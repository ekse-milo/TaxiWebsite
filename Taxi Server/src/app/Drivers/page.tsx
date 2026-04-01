'use client';

import { useDriversLogic } from './logic';
import './drivers.css';

export default function DriversPage() {
    const {
        driversData,
        selectedDriver,
        bookingData,
        formatDate,
        handleSelectDriver,
        handleConfirmBooking,
        handleCancelConfirmation
    } = useDriversLogic();

    return (
        <section className="drivers-body">
            <header className="drivers-header">
                <h1>Our Drivers</h1>
            </header>

            <div className="drivers-container">
                <div className="drivers-grid">
                    {driversData.map(driver => (
                        <div key={driver.id} className="driver-card" onClick={() => handleSelectDriver(driver)}>
                            <div className="driver-card-top"></div>
                            <div className="driver-avatar">
                                <span className="material-icons">local_taxi</span>
                            </div>
                            <h3 className="driver-name">{driver.name || 'Professional Driver'}</h3>
                            <div className={`status-badge ${driver.is_available ? 'status-available' : 'status-unavailable'}`}>
                                <div className="status-dot"></div>
                                {driver.is_available ? 'Available Now' : 'On Trip'}
                            </div>
                            <div className="driver-details">
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <span className="material-icons">phone</span>
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">Phone Number</span>
                                        <span className="detail-value">{driver.phone_number || '+91 XXXX XXXX'}</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <span className="material-icons">email</span>
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">Email</span>
                                        <span className="detail-value">{driver.email || 'driver@taxigoa.com'}</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-icon">
                                        <span className="material-icons">badge</span>
                                    </div>
                                    <div className="detail-text">
                                        <span className="detail-label">License Number</span>
                                        <span className="detail-value">{driver.license_number || 'GOA-TX-XXXX'}</span>
                                    </div>
                                </div>
                            </div>
                            {driver.created_at && (
                                <div className="driver-footer">
                                    Joined {formatDate(driver.created_at)}
                                </div>
                            )}
                            <button className="select-driver-btn">
                                Select Driver
                                <span className="material-icons">chevron_right</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {selectedDriver && (
                <div className="modal-overlay" onClick={handleCancelConfirmation}>
                    <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Confirm Booking</h2>
                            <p className="modal-subtitle">Review your ride details with {selectedDriver.name}</p>
                        </div>

                        <div className="modal-content">
                            <div className="summary-section">
                                <h4>Your Details</h4>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summar-label">Name</span>
                                        <span className="summary-value">{bookingData?.name || '-'}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summar-label">Phone</span>
                                        <span className="summary-value">{bookingData?.phone || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="summary-section">
                                <h4>Ride Details</h4>
                                <div className="summary-item" style={{ marginBottom: '15px' }}>
                                    <span className="summar-label">Car Type</span>
                                    <span className="summary-value" style={{ color: '#005577', fontWeight: '700' }}>{bookingData?.carType}</span>
                                </div>
                                <div className="summary-item" style={{ marginBottom: '10px' }}>
                                    <span className="summar-label">Pickup Address</span>
                                    <span className="summary-value">{bookingData?.pickup}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summar-label">Drop Address</span>
                                    <span className="summary-value">{bookingData?.drop}</span>
                                </div>
                            </div>

                            {bookingData?.selectedDates?.length > 0 && (
                                <div className="summary-section">
                                    <h4>Booking Dates</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {bookingData.selectedDates.map((date: string) => (
                                            <span key={date} style={{ background: '#005577', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>
                                                {formatDate(date)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="modal-cancel-btn" onClick={handleCancelConfirmation}>Cancel</button>
                            <button className="modal-submit-btn" onClick={handleConfirmBooking}>Confirm Booking</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
