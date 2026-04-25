'use client';

import { Suspense, useRef, useEffect } from 'react';
import { useFormLogic } from './logic';
import styles from './form.module.css';


const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const periods = ['AM', 'PM'];

function FormContent() {
    const {
        carType,
        setCarType,
        routeType,
        setRouteType,
        isPackageBooking,
        formData,
        isFormValid,
        showErrors,
        errors,
        showCalendar,
        currentMonth,
        handleInputChange,
        handleSwapAddresses,
        openCalendar,
        closeCalendar,
        handleSelectDate,
        showTimePicker,
        isTimeSelected,
        openTimePicker,
        closeTimePicker,
        handleSelectTime,
        nextMonth,
        prevMonth,
        handleBooking,
        showSummary,
        setShowSummary,
        showThankYou,
        setShowThankYou,
        isSubmitting,
        showAirportPicker,
        openAirportPicker,
        closeAirportPicker,
        airportTransferType,
        handleAirportTransferTypeChange,
        handleConfirmBooking,
        formatDate
    } = useFormLogic();

    const hourRef = useRef<HTMLDivElement>(null);
    const minuteRef = useRef<HTMLDivElement>(null);
    const periodRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showTimePicker) {
            const timer = setTimeout(() => {
                if (hourRef.current) hourRef.current.scrollTop = hours.indexOf(formData.timeHour) * 50;
                if (minuteRef.current) minuteRef.current.scrollTop = minutes.indexOf(formData.timeMinute) * 50;
                if (periodRef.current) periodRef.current.scrollTop = periods.indexOf(formData.timePeriod) * 50;
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [showTimePicker]);

    const isTimeInPast = (h: string, m: string, p: string) => {
        const now = new Date();
        const localMonth = String(now.getMonth() + 1).padStart(2, '0');
        const localDay = String(now.getDate()).padStart(2, '0');
        const todayStr = `${now.getFullYear()}-${localMonth}-${localDay}`;

        const selectedDate = formData.date || todayStr;

        // If selected date is in the future, nothing is in the past
        if (selectedDate > todayStr) return false;
        // If selected date is in the past, everything is in the past
        if (selectedDate < todayStr) return true;

        // It's today, so compare hours and minutes
        let hourNum = parseInt(h);
        if (p === 'PM' && hourNum < 12) hourNum += 12;
        if (p === 'AM' && hourNum === 12) hourNum = 0;

        const selectedTime = new Date(now);
        selectedTime.setHours(hourNum, parseInt(m), 0, 0);

        return selectedTime.getTime() < now.getTime();
    };

    const onScroll = (ref: React.RefObject<HTMLDivElement | null>, items: string[], type: 'hour' | 'minute' | 'period') => {
        if (!ref.current) return;
        const index = Math.round(ref.current.scrollTop / 50);
        const val = items[index];

        if (val) {
            if (type === 'hour' && val !== formData.timeHour) handleSelectTime(val, formData.timeMinute, formData.timePeriod);
            if (type === 'minute' && val !== formData.timeMinute) handleSelectTime(formData.timeHour, val, formData.timePeriod);
            if (type === 'period' && val !== formData.timePeriod) handleSelectTime(formData.timeHour, formData.timeMinute, val);
        }
    };

    // Prevent background scroll when any modal is open
    useEffect(() => {
        const anyModalOpen = showCalendar || showTimePicker || showAirportPicker || showSummary || showThankYou;
        if (anyModalOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };
    }, [showCalendar, showTimePicker, showAirportPicker, showSummary, showThankYou]);


    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={`${styles.calendarDay} ${styles.disabled}`}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            // Fix: Build the string manually instead of using toISOString() which converts to UTC
            const localMonth = String(month + 1).padStart(2, '0');
            const localDay = String(day).padStart(2, '0');
            const dateStr = `${year}-${localMonth}-${localDay}`;

            const isPast = dateObj < today;
            const isToday = dateObj.getTime() === today.getTime();
            const isSelected = formData.date === dateStr;

            days.push(
                <div
                    key={day}
                    className={`${styles.calendarDay} ${isPast ? styles.disabled : ''} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                    onClick={() => !isPast && handleSelectDate(dateStr)}
                >
                    {day}
                </div>
            );
        }
        return days;
    };


    const displayDate = formData.date
        ? formatDate(formData.date)
        : 'Select Date';
    const routes = ['Airport', 'Sightseeing', 'City Tour'];
    const carTypes = ['Hatchback', 'Sedan', 'MUV', 'SUV'];

    return (
        <>
            <div className={`${styles.formWrapper} ${(showSummary || showThankYou) ? styles.blurred : ''}`}>
                <header className={styles.formHeader}>
                    <h1>Bookings</h1>
                </header>

                <section className={styles.bookingSection}>
                    <div className={styles.searchBox}>
                        {isPackageBooking ? (
                            /* Show Car Selection if coming from Packages */
                            <div className={styles.routeSelectionContainer} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                                <div style={{ width: '100%', textAlign: 'center', marginBottom: '15px' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Taxi Type for {routeType}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    {carTypes.map(car => (
                                        <div
                                            key={car}
                                            className={`${styles.routeOption} ${carType === car ? styles.selected : ''}`}
                                            onClick={() => setCarType(car)}
                                        >
                                            <span>{car}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            /* Show Route Selection if coming from Taxi selection */
                            <div className={styles.routeSelectionContainer}>
                                <div style={{ width: '100%', textAlign: 'center', marginBottom: '15px' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Package for {carType}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    {routes.map(route => (
                                        <div
                                            key={route}
                                            className={`${styles.routeOption} ${routeType === route ? styles.selected : ''}`}
                                            onClick={() => setRouteType(route)}
                                        >
                                            <span>{route}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {routeType === 'Airport' && (
                            <div className={styles.routeSelectionContainer} style={{ marginTop: '0', padding: '15px', background: '#f8f9fa', borderRadius: '15px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                    <div
                                        className={`${styles.routeOption} ${airportTransferType === 'from' ? styles.selected : ''}`}
                                        onClick={() => handleAirportTransferTypeChange('from')}
                                        style={{ flex: 1, fontSize: '0.9rem' }}
                                    >
                                        <span className="material-icons" style={{ fontSize: '18px' }}>flight_land</span>
                                        Pickup from Airport
                                    </div>
                                    <div
                                        className={`${styles.routeOption} ${airportTransferType === 'to' ? styles.selected : ''}`}
                                        onClick={() => handleAirportTransferTypeChange('to')}
                                        style={{ flex: 1, fontSize: '0.9rem' }}
                                    >
                                        <span className="material-icons" style={{ fontSize: '18px' }}>flight_takeoff</span>
                                        Dropoff to Airport
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.addressRow}>
                            <div className={styles.inputGroup} style={{ flex: 1 }}>
                                <label className={`${styles.inputBox} ${showErrors && errors.name ? styles.hasError : ''}`}>
                                    <span className="material-icons" style={{ color: '#005577' }}>person</span>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                </label>
                                {showErrors && errors.name && <p className={styles.errorMsg}>Enter a valid name</p>}
                            </div>

                            <div className={styles.inputGroup} style={{ flex: 1 }}>
                                <label className={`${styles.inputBox} ${showErrors && errors.phone ? styles.hasError : ''}`}>
                                    <span className="material-icons" style={{ color: '#005577' }}>phone</span>
                                    <input
                                        type="tel"
                                        placeholder="10-Digit Phone Number"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </label>
                                {showErrors && errors.phone && <p className={styles.errorMsg}>Enter valid 10-digit number</p>}
                            </div>
                        </div>

                        <div className={styles.addressRow} style={{ marginTop: '5px' }}>
                            {/* Pickup Field */}
                            <div className={styles.inputGroup} style={{ flex: 1 }}>
                                <label
                                    className={`${styles.inputBox} ${showErrors && errors.pickup ? styles.hasError : ''}`}
                                    onClick={() => (routeType === 'Airport' && airportTransferType === 'from') && openAirportPicker()}
                                    style={{ cursor: (routeType === 'Airport' && airportTransferType === 'from') ? 'pointer' : 'text' }}
                                >
                                    <span className="material-icons" style={{ color: '#005577' }}>{airportTransferType === 'from' && routeType === 'Airport' ? 'flight_land' : 'place'}</span>
                                    {(routeType === 'Airport' && airportTransferType === 'from') ? (
                                        <span style={{ flex: 1, padding: '8px 10px', color: formData.pickup ? '#333' : '#999' }}>
                                            {formData.pickup || 'Select Airport'}
                                        </span>
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder="Pickup Address"
                                            value={formData.pickup}
                                            onChange={(e) => handleInputChange('pickup', e.target.value)}
                                        />
                                    )}
                                </label>
                                {showErrors && errors.pickup && <p className={styles.errorMsg}>Pickup address is required</p>}
                            </div>

                            {/* Drop Field */}
                            <div className={styles.inputGroup} style={{ flex: 1 }}>
                                <label
                                    className={`${styles.inputBox} ${showErrors && errors.drop ? styles.hasError : ''}`}
                                    onClick={() => (routeType === 'Airport' && airportTransferType === 'to') && openAirportPicker()}
                                    style={{ cursor: (routeType === 'Airport' && airportTransferType === 'to') ? 'pointer' : 'text' }}
                                >
                                    <span className="material-icons" style={{ color: '#005577' }}>{airportTransferType === 'to' && routeType === 'Airport' ? 'flight_takeoff' : 'place'}</span>
                                    {(routeType === 'Airport' && airportTransferType === 'to') ? (
                                        <span style={{ flex: 1, padding: '8px 10px', color: formData.drop ? '#333' : '#999' }}>
                                            {formData.drop || 'Select Airport'}
                                        </span>
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder="Drop Address"
                                            value={formData.drop}
                                            onChange={(e) => handleInputChange('drop', e.target.value)}
                                        />
                                    )}
                                </label>
                                {showErrors && errors.drop && <p className={styles.errorMsg}>Drop address is required</p>}
                            </div>
                        </div>

                        <div className={styles.dateTimeRow}>
                            <div className={styles.inputGroup} style={{ flex: 1 }}>
                                <div
                                    className={`${styles.inputBox} ${showErrors && errors.date ? styles.hasError : ''}`}
                                    onClick={openCalendar}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="material-icons" style={{ color: '#005577' }}>calendar_today</span>
                                    <span style={{ flex: 1, padding: '8px 10px', color: formData.date ? '#333' : '#999' }}>
                                        {displayDate}
                                    </span>
                                </div>
                                {showErrors && errors.date && <p className={styles.errorMsg}>Select a date</p>}
                            </div>

                            <div className={styles.inputGroup} style={{ flex: 1 }}>
                                <div
                                    className={`${styles.inputBox} ${showErrors && errors.time ? styles.hasError : ''}`}
                                    onClick={openTimePicker}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="material-icons" style={{ color: '#005577' }}>schedule</span>
                                    <span style={{ flex: 1, padding: '8px 10px', color: isTimeSelected ? '#333' : '#999' }}>
                                        {isTimeSelected ? `${formData.timeHour}:${formData.timeMinute} ${formData.timePeriod}` : 'Pickup Time'}
                                    </span>
                                </div>
                                {showErrors && errors.time && <p className={styles.errorMsg}>Select a time</p>}
                            </div>
                        </div>

                        <div className={styles.inputGroup} style={{ marginTop: '10px' }}>
                            <label className={styles.inputBox} style={{ alignItems: 'flex-start', borderRadius: '18px' }}>
                                <span className="material-icons" style={{ color: '#005577', marginTop: '10px' }}>notes</span>
                                <textarea
                                    placeholder="Special Requests (Example: I have 3 large bags, traveling with a pet)"
                                    value={formData.specialRequests}
                                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                                />
                            </label>
                        </div>

                        {/* Action Buttons Row */}
                        <div className={styles.formActionsRow}>
                            <a href='/'>
                                <button type="button" className={styles.homeBtn}>Home</button>
                            </a>

                            {!isFormValid && showErrors && (
                                <p className={styles.smallErrorMsg} style={{ margin: 'auto', textAlign: 'center' }}>
                                    Please fix errors
                                </p>
                            )}

                            <button
                                type="button"
                                className={`${styles.submitBtn} ${isFormValid ? styles.active : ''}`}
                                disabled={!isFormValid && showErrors}
                                onClick={handleBooking}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {showCalendar && (
                        <div className={styles.calendarOverlay} onClick={closeCalendar}>
                            <div className={styles.calendarModal} onClick={e => e.stopPropagation()}>
                                <div className={styles.calendarHeader}>
                                    <button className={styles.calendarNavBtn} onClick={prevMonth}>
                                        <span className="material-icons">chevron_left</span>
                                    </button>
                                    <h3>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                                    <button className={styles.calendarNavBtn} onClick={nextMonth}>
                                        <span className="material-icons">chevron_right</span>
                                    </button>
                                </div>
                                <div className={styles.calendarGrid}>
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                        <div key={day} className={styles.weekday}>{day}</div>
                                    ))}
                                    {generateCalendarDays()}
                                </div>
                            </div>
                        </div>
                    )}

                    {showTimePicker && (
                        <div className={styles.calendarOverlay} onClick={closeTimePicker}>
                            <div className={styles.calendarModal} onClick={e => e.stopPropagation()} style={{ maxWidth: '320px' }}>
                                <div className={styles.calendarHeader}>
                                    <h3 style={{ margin: '0 auto' }}>Select Time</h3>
                                </div>
                                <div className={styles.timePickerGrid}>
                                    <div className={styles.selectionHighlight}></div>

                                    <div className={styles.timePickerColumn} ref={hourRef} onScroll={() => onScroll(hourRef, hours, 'hour')}>
                                        <div className={styles.drumSpacer}></div>
                                        {hours.map(h => {
                                            const disabled = isTimeInPast(h, formData.timeMinute, formData.timePeriod);
                                            return (
                                                <div
                                                    key={h}
                                                    className={`${styles.timePickerItem} ${formData.timeHour === h ? styles.timeSelected : ''} ${disabled ? styles.disabled : ''}`}
                                                    onClick={() => {
                                                        if (disabled) return;
                                                        handleSelectTime(h, formData.timeMinute, formData.timePeriod);
                                                        if (hourRef.current) hourRef.current.scrollTo({ top: hours.indexOf(h) * 50, behavior: 'smooth' });
                                                    }}
                                                >
                                                    {h}
                                                </div>
                                            );
                                        })}
                                        <div className={styles.drumSpacer}></div>
                                    </div>

                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#005577', zIndex: 3 }}>:</div>

                                    <div className={styles.timePickerColumn} ref={minuteRef} onScroll={() => onScroll(minuteRef, minutes, 'minute')}>
                                        <div className={styles.drumSpacer}></div>
                                        {minutes.map(m => {
                                            const disabled = isTimeInPast(formData.timeHour, m, formData.timePeriod);
                                            return (
                                                <div
                                                    key={m}
                                                    className={`${styles.timePickerItem} ${formData.timeMinute === m ? styles.timeSelected : ''} ${disabled ? styles.disabled : ''}`}
                                                    onClick={() => {
                                                        if (disabled) return;
                                                        handleSelectTime(formData.timeHour, m, formData.timePeriod);
                                                        if (minuteRef.current) minuteRef.current.scrollTo({ top: minutes.indexOf(m) * 50, behavior: 'smooth' });
                                                    }}
                                                >
                                                    {m}
                                                </div>
                                            );
                                        })}
                                        <div className={styles.drumSpacer}></div>
                                    </div>

                                    <div className={styles.timePickerColumn} ref={periodRef} onScroll={() => onScroll(periodRef, periods, 'period')}>
                                        <div className={styles.drumSpacer}></div>
                                        {periods.map(p => {
                                            const disabled = isTimeInPast(formData.timeHour, formData.timeMinute, p);
                                            return (
                                                <div
                                                    key={p}
                                                    className={`${styles.timePickerItem} ${formData.timePeriod === p ? styles.timeSelected : ''} ${disabled ? styles.disabled : ''}`}
                                                    onClick={() => {
                                                        if (disabled) return;
                                                        handleSelectTime(formData.timeHour, formData.timeMinute, p);
                                                        if (periodRef.current) periodRef.current.scrollTo({ top: periods.indexOf(p) * 50, behavior: 'smooth' });
                                                    }}
                                                >
                                                    {p}
                                                </div>
                                            );
                                        })}
                                        <div className={styles.drumSpacer}></div>
                                    </div>
                                </div>
                                <button
                                    className={styles.summarySubmitBtn}
                                    onClick={() => !isTimeInPast(formData.timeHour, formData.timeMinute, formData.timePeriod) && closeTimePicker()}
                                    disabled={isTimeInPast(formData.timeHour, formData.timeMinute, formData.timePeriod)}
                                    style={{ 
                                        margin: '20px auto 0', 
                                        width: '90%', 
                                        padding: '10px',
                                        background: isTimeInPast(formData.timeHour, formData.timeMinute, formData.timePeriod) ? '#ccc' : '#005577',
                                        cursor: isTimeInPast(formData.timeHour, formData.timeMinute, formData.timePeriod) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}

                    {showAirportPicker && (
                        <div className={styles.calendarOverlay} onClick={closeAirportPicker}>
                            <div className={styles.calendarModal} onClick={e => e.stopPropagation()} style={{ maxWidth: '320px' }}>
                                <div className={styles.calendarHeader}>
                                    <h3 style={{ margin: '0 auto' }}>Select Airport</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                                    {['Dabolim Airport', 'Mopa Airport'].map(airport => {
                                        const isSelected = airportTransferType === 'from'
                                            ? formData.pickup === airport
                                            : formData.drop === airport;
                                        return (
                                            <div
                                                key={airport}
                                                className={`${styles.timePickerItem} ${isSelected ? styles.timeSelected : ''}`}
                                                onClick={() => {
                                                    const field = airportTransferType === 'from' ? 'pickup' : 'drop';
                                                    handleInputChange(field, airport);
                                                    closeAirportPicker();
                                                }}
                                                style={{ padding: '15px' }}
                                            >
                                                {airport}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {showSummary && (
                <div className={styles.modalOverlay} onClick={() => setShowSummary(false)}>
                    <div className={styles.summaryCard} onClick={e => e.stopPropagation()}>
                        <div className={styles.cardHeader}>
                            <span className="material-icons" style={{ color: '#005577', fontSize: '48px' }}>whatsapp</span>
                            <h2>Confirm Your Ride</h2>
                            <p className={styles.cardSubtitle}>Please review your details. We will redirect you to WhatsApp to finalize with our team.</p>
                        </div>

                        <div className={styles.cardContent}>
                            <div className={styles.summarySection}>
                                <h4>Trip Overview</h4>
                                <div className={styles.summaryGrid}>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryLabel}>Route</span>
                                        <span className={styles.summaryValue}>{routeType}</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryLabel}>Car</span>
                                        <span className={styles.summaryValue}>{carType}</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryLabel}>Date</span>
                                        <span className={styles.summaryValue}>{formData.date ? formatDate(formData.date) : '-'}</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summaryLabel}>Time</span>
                                        <span className={styles.summaryValue}>{formData.timeHour}:{formData.timeMinute} {formData.timePeriod}</span>
                                    </div>
                                </div>
                            </div>
 
                            <div className={styles.summarySection}>
                                <h4>Addresses</h4>
                                <div className={styles.summaryItem} style={{ marginBottom: '10px' }}>
                                    <span className={styles.summaryLabel}>Pickup</span>
                                    <span className={styles.summaryValue}>{formData.pickup}</span>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span className={styles.summaryLabel}>Drop</span>
                                    <span className={styles.summaryValue}>{formData.drop}</span>
                                </div>
                            </div>

                            {formData.specialRequests && (
                                <div className={styles.summarySection}>
                                    <h4>Special Requests</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#333' }}>{formData.specialRequests}</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.cardActions}>
                            <button className={styles.cancelBtn} onClick={() => setShowSummary(false)} disabled={isSubmitting}>Edit Details</button>
                            <button
                                className={styles.summarySubmitBtn}
                                onClick={handleConfirmBooking}
                                disabled={isSubmitting}
                                style={{ background: isSubmitting ? '#999' : '#25D366' }}
                            >
                                <span className="material-icons" style={{ fontSize: '18px' }}>{isSubmitting ? 'hourglass_empty' : 'send'}</span>
                                {isSubmitting ? 'Processing...' : 'Send Request via WhatsApp'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showThankYou && (
                <div className={styles.modalOverlay} onClick={() => setShowThankYou(false)}>
                    <div className={styles.summaryCard} onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center', padding: '40px 30px' }}>
                        <div style={{ background: '#e8f5e9', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <span className="material-icons" style={{ color: '#2ecc71', fontSize: '40px' }}>check_circle</span>
                        </div>
                        <h2 style={{ color: '#333', marginBottom: '15px' }}>Request Sent!</h2>
                        <p style={{ color: '#666', lineHeight: '1.6', fontSize: '1.1rem' }}>
                            Thank you for choosing us, you will get a call shortly for confirmation.
                        </p>
                        <button
                            className={styles.summarySubmitBtn}
                            onClick={() => {
                                setShowThankYou(false);
                                window.location.href = '/';
                            }}
                            style={{ marginTop: '30px', width: '100%', background: '#005577' }}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default function FormPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FormContent />
        </Suspense>
    );
}
