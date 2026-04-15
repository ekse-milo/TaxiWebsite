'use client';

import { Suspense } from 'react';
import { useFormLogic } from './logic';
import styles from './form.module.css';


function FormContent() {
    const {
        carType,
        routeType,
        setRouteType,
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
        nextMonth,
        prevMonth,
        handleBooking
    } = useFormLogic();

    const routes = ['Airport', 'Sightseeing', 'City Tour'];

    // Dropdown value arrays
    const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
    const periods = ['AM', 'PM'];

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
        ? new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Select Date';

    return (
        <>
            <header className={styles.formHeader}>
                <h1>Bookings</h1>
            </header>

            <section className={styles.bookingSection}>
                <div className={styles.searchBox}>
                    <div className={styles.carSelectionDisplay} style={{ textAlign: 'center', marginBottom: '10px' }}>
                        <h2 style={{ color: '#005577', margin: '0 0 5px 0' }}>Booking {carType}</h2>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>Please select your journey type and fill in your details</p>
                    </div>

                    <div className={styles.routeSelectionContainer}>
                        {routes.map(route => (
                            <div
                                key={route}
                                className={`${styles.routeOption} ${routeType === route ? styles.selected : ''}`}
                                onClick={() => setRouteType(route)}
                            >
                                <div className={styles.circleCheck}></div>
                                <span>{route}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.userColumn}>
                        <div className={styles.inputGroup}>
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

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div className={styles.inputGroup} style={{ flex: 1, minWidth: '250px' }}>
                                <label className={`${styles.inputBox} ${showErrors && errors.phone ? styles.hasError : ''}`}>
                                    <span className="material-icons" style={{ color: '#005577' }}>phone</span>
                                    <input
                                        type="tel"
                                        placeholder="10-Digit phone Number"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </label>
                                {showErrors && errors.phone && <p className={styles.errorMsg}>Enter valid 10-digit number</p>}
                            </div>

                            <div className={styles.inputGroup} style={{ flex: 1, minWidth: '250px' }}>
                                <label className={`${styles.inputBox} ${showErrors && errors.email ? styles.hasError : ''}`}>
                                    <span className="material-icons" style={{ color: '#005577' }}>email</span>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </label>
                                {showErrors && errors.email && <p className={styles.errorMsg}>Enter a valid email address</p>}
                            </div>
                        </div>
                    </div>

                    <div className={styles.addressRow} style={{ marginTop: '5px' }}>
                        <div className={styles.inputGroup} style={{ flex: 1 }}>
                            <label className={`${styles.inputBox} ${showErrors && errors.pickup ? styles.hasError : ''}`}>
                                <span className="material-icons" style={{ color: '#005577' }}>place</span>
                                <input
                                    type="text"
                                    placeholder="Pickup Address"
                                    value={formData.pickup}
                                    onChange={(e) => handleInputChange('pickup', e.target.value)}
                                />
                                <span className="material-icons search-icon">search</span>
                            </label>
                            {showErrors && errors.pickup && <p className={styles.errorMsg}>Pickup address is required</p>}
                        </div>

                        <div className={styles.swapIcon} onClick={handleSwapAddresses}>
                            <span className="material-icons">swap_horiz</span>
                        </div>

                        <div className={styles.inputGroup} style={{ flex: 1 }}>
                            <label className={`${styles.inputBox} ${showErrors && errors.drop ? styles.hasError : ''}`}>
                                <span className="material-icons" style={{ color: '#005577' }}>place</span>
                                <input
                                    type="text"
                                    placeholder="Drop Address"
                                    value={formData.drop}
                                    onChange={(e) => handleInputChange('drop', e.target.value)}
                                />
                                <span className="material-icons search-icon">search</span>
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
                            <div className={styles.inputBox}>
                                <span className="material-icons" style={{ color: '#005577' }}>schedule</span>
                                <div className={styles.timeSelectors}>
                                    <select
                                        className={styles.timeSelect}
                                        value={formData.timeHour}
                                        onChange={(e) => handleInputChange('timeHour', e.target.value)}
                                    >
                                        {hours.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                    <span className={styles.timeDivider}>:</span>
                                    <select
                                        className={styles.timeSelect}
                                        value={formData.timeMinute}
                                        onChange={(e) => handleInputChange('timeMinute', e.target.value)}
                                    >
                                        {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <select
                                        className={styles.timeSelect}
                                        value={formData.timePeriod}
                                        onChange={(e) => handleInputChange('timePeriod', e.target.value)}
                                        style={{ marginLeft: '5px', color: '#005577', fontWeight: 'bold' }}
                                    >
                                        {periods.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup} style={{ marginTop: '10px' }}>
                        <label className={styles.inputBox} style={{ alignItems: 'flex-start', borderRadius: '18px' }}>
                            <span className="material-icons" style={{ color: '#005577', marginTop: '10px' }}>notes</span>
                            <textarea
                                placeholder="Special Requests (Example: I have 3 large bags, traveling with a pet, or need a child seat)"
                                value={formData.specialRequests}
                                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.submitContainer} style={{ marginTop: '30px', textAlign: 'center', width: '100%' }}>
                    <button
                        className={`${styles.submitBtn} ${isFormValid ? styles.active : ''}`}
                        disabled={!isFormValid && showErrors}
                        onClick={handleBooking}
                        style={{ width: '100%', maxWidth: '400px' }}
                    >
                        Confirm Booking Request
                    </button>
                    {!isFormValid && showErrors && (
                        <p style={{ color: '#d32f2f', fontSize: '0.9rem', fontWeight: '600', marginTop: '15px' }}>
                            Please fix the errors in red to continue
                        </p>
                    )}

                    <br/><br/>
                    <a href='/'><button
                        className={styles.homeBtn}
                    >
                        Home
                    </button></a>
                </div>
            </section>

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
