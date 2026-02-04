'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import './form.css';

function FormContent() {
    const searchParams = useSearchParams();
    const carFromUrl = searchParams.get('car') || 'Hatchback';

    const [carType, setCarType] = useState(carFromUrl);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // Feb 2026
    const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

    const handleGoNow = () => {
        setAvailabilityStatus('checking');
        // Reset selected dates if user switches to Go Now
        setSelectedDates([]);

        // Simulate API check
        setTimeout(() => {
            const isAvailable = Math.random() > 0.3; // 70% chance available
            setAvailabilityStatus(isAvailable ? 'available' : 'unavailable');
        }, 2000);
    };

    useEffect(() => {
        if (carFromUrl) setCarType(carFromUrl);
    }, [carFromUrl]);

    const handleGoLater = () => {
        setAvailabilityStatus('idle');
        setShowCalendar(true);
    };

    const handleBooking = () => {
        alert('Booking Confirmed! Thank you for choosing our service.');
    };

    const closeCalendar = () => {
        setShowCalendar(false);
    };

    const toggleDate = (date: string) => {
        setAvailabilityStatus('idle'); // clear simple availability if picking dates
        setSelectedDates(prev =>
            prev.includes(date)
                ? prev.filter(d => d !== date)
                : [...prev, date].sort()
        );
    };


    // Calendar logic
    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const days = [];
        const numDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);

        // Padding for previous month days
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day disabled"></div>);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= numDays; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dateObj = new Date(year, month, day);
            const isDisabled = dateObj < today;
            const isSelected = selectedDates.includes(dateStr);
            const isToday = dateObj.getFullYear() === today.getFullYear() &&
                dateObj.getMonth() === today.getMonth() &&
                dateObj.getDate() === today.getDate();

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'occupied selected' : ''} ${isDisabled ? 'disabled' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => !isDisabled && toggleDate(dateStr)}
                >
                    {day}
                </div>
            );
        }
        return days;
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    return (
        <section className="booking-section">
            <div className="search-box">

                <div className="car-selection-display" style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ color: '#005577', margin: '0 0 5px 0' }}>Booking {carType}</h2>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Please fill in your details below</p>
                </div>

                <div className="user-column">
                    <label className="input-box">
                        <span className="material-icons">person</span>
                        <input type="text" placeholder="Name" />
                    </label>

                    <label className="input-box">
                        <span className="material-icons">phone</span>
                        <input type="tel" placeholder="Contact Number" />
                    </label>
                </div>

                <div className="address-row">
                    <label className="input-box">
                        <span className="material-icons">place</span>
                        <input type="text" placeholder="Pickup Address" />
                        <span className="material-icons search-icon">search</span>
                    </label>

                    <div className="swap-icon">
                        <span className="material-icons">swap_horiz</span>
                    </div>

                    <label className="input-box">
                        <span className="material-icons">place</span>
                        <input type="text" placeholder="Drop Address" />
                        <span className="material-icons search-icon">search</span>
                    </label>
                </div>

                {selectedDates.length > 0 && (
                    <div style={{ marginTop: '25px', color: '#005577', fontWeight: '700', textAlign: 'center', background: '#e3f2fd', padding: '15px', borderRadius: '12px' }}>
                        <div style={{ marginBottom: '5px' }}>Selected Dates:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                            {selectedDates.map(date => (
                                <span key={date} style={{ background: '#005577', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                                    {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="action-buttons">
                <button className="later-btn" onClick={handleGoLater}>
                    <span className="material-icons">event</span>
                    Go Later
                </button>

                <button className="now-btn" onClick={handleGoNow} disabled={availabilityStatus === 'checking'}>
                    {availabilityStatus === 'checking' ? 'Checking...' : 'Go Now'}
                    <span className="material-icons">chevron_right</span>
                </button>
            </div>

            {availabilityStatus !== 'idle' && (
                <div className="availability-status">
                    {availabilityStatus === 'checking' && (
                        <p className="status-text checking">Checking car availability, please wait...</p>
                    )}
                    {availabilityStatus === 'available' && (
                        <div className="status-result success">
                            <span className="material-icons">check_circle</span>
                            <p>Great! Car is available.</p>
                        </div>
                    )}
                    {availabilityStatus === 'unavailable' && (
                        <div className="status-result error">
                            <span className="material-icons">cancel</span>
                            <p>Sorry, no cars are available at this moment. Please try "Go Later".</p>
                        </div>
                    )}
                </div>
            )}

            <button
                className={`submit-btn ${(availabilityStatus === 'available' || selectedDates.length > 0) ? 'active' : ''}`}
                disabled={!(availabilityStatus === 'available' || selectedDates.length > 0)}
                onClick={handleBooking}
            >
                Submit
            </button>

            {showCalendar && (
                <div className="calendar-overlay" onClick={closeCalendar}>
                    <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="calendar-header">
                            <button className="calendar-nav-btn" onClick={prevMonth}>
                                <span className="material-icons">chevron_left</span>
                            </button>
                            <h3>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                            <button className="calendar-nav-btn" onClick={nextMonth}>
                                <span className="material-icons">chevron_right</span>
                            </button>
                        </div>

                        <div className="calendar-grid">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="weekday">{day}</div>
                            ))}
                            {generateCalendarDays()}
                        </div>

                        <div className="calendar-footer">
                            <button className="calendar-confirm-btn" onClick={closeCalendar}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default function FormPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FormContent />
        </Suspense>
    );
}
