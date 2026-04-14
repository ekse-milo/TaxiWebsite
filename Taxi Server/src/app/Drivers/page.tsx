'use client';

import { useDriversLogic } from './logic';
import './drivers.css';

export default function DriversPage() {
    const {
        driversData,
        isLoading,
        selectedDriver,
        bookingData,
        isSubmitting,
        formatDate,
        handleSelectDriver,
        handleConfirmBooking,
        handleCancelConfirmation
    } = useDriversLogic();

    return (
        <section className="drivers-body">
            <header className="drivers-header">
                <h1>Our Professional Drivers</h1>
            </header>

            <div className="drivers-container">
                {isLoading ? (
                    <div className="loading-state">
                        <span className="material-icons rotating">hourglass_empty</span>
                        <p>Loading Professional Drivers...</p>
                    </div>
                ) : (
                    <div className="drivers-grid">
                        {driversData.map(driver => (
                            <div key={driver.id} className="driver-card" onClick={() => handleSelectDriver(driver)}>
                                <div className="driver-card-top"></div>
                                <div className="driver-avatar">
                                    <span className="material-icons" style={{ fontSize: '40px' }}>account_circle</span>
                                </div>
                                <h3 className="driver-name">{driver.name}</h3>
                                <div className="driver-rating">
                                    {driver.rating && (
                                        <>
                                            <span className="material-icons" style={{ color: '#FFD700', fontSize: '18px' }}>star</span>
                                            <span>{driver.rating}</span>
                                        </>
                                    )}
                                    {driver.experience && (
                                        <span style={{ marginLeft: '10px', color: '#666', fontSize: '0.8rem' }}>({driver.experience} Exp)</span>
                                    )}
                                </div>
                                
                                <div className={`status-badge ${driver.is_available ? 'status-available' : 'status-unavailable'}`}>
                                    <div className="status-dot"></div>
                                    {driver.is_available ? 'Available Now' : 'On Trip'}
                                </div>

                                <div className="driver-details">
                                    <div className="detail-row">
                                        <div className="detail-icon"><span className="material-icons">local_taxi</span></div>
                                        <div className="detail-text">
                                            <span className="detail-label">Taxi Service</span>
                                            <span className="detail-value">Licensed Professional</span>
                                        </div>
                                    </div>
                                    <div className="detail-row">
                                        <div className="detail-icon"><span className="material-icons">verified</span></div>
                                        <div className="detail-text">
                                            <span className="detail-label">Verify ID</span>
                                            <span className="detail-value">{driver.license_number}</span>
                                        </div>
                                    </div>
                                    <div className="detail-row">
                                        <div className="detail-icon"><span className="material-icons">phone</span></div>
                                        <div className="detail-text">
                                            <span className="detail-label">Direct Contact</span>
                                            <span className="detail-value">{driver.phone_number}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button className="select-driver-btn">
                                    Select {driver.name.split(' ')[0]}
                                    <span className="material-icons">chevron_right</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedDriver && (
                <div className="modal-overlay" onClick={handleCancelConfirmation}>
                    <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="material-icons" style={{ color: '#005577', fontSize: '48px' }}>whatsapp</span>
                            <h2>Confirm Booking</h2>
                            <p className="modal-subtitle">We will redirect you to WhatsApp to finalize with our team.</p>
                        </div>

                        <div className="modal-content">
                            <div className="summary-section">
                                <h4>Trip Overview</h4>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summar-label">Route</span>
                                        <span className="summary-value" style={{ color: '#005577', fontWeight: 'bold' }}>{bookingData?.routeType}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summar-label">Car</span>
                                        <span className="summary-value">{bookingData?.carType}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summar-label">Date</span>
                                        <span className="summary-value">{bookingData?.date ? formatDate(bookingData.date) : '-'}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="summar-label">Time</span>
                                        <span className="summary-value">{bookingData?.timeHour}:{bookingData?.timeMinute} {bookingData?.timePeriod}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="summary-section">
                                <h4>Addresses</h4>
                                <div className="summary-item" style={{ marginBottom: '10px' }}>
                                    <span className="summar-label">Pickup</span>
                                    <span className="summary-value">{bookingData?.pickup}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summar-label">Drop</span>
                                    <span className="summary-value">{bookingData?.drop}</span>
                                </div>
                            </div>

                            {bookingData?.specialRequests && (
                                <div className="summary-section">
                                    <h4>Special Requests</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#333', fontStyle: 'italic' }}>"{bookingData.specialRequests}"</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="modal-cancel-btn" onClick={handleCancelConfirmation} disabled={isSubmitting}>Back</button>
                            <button
                                className="modal-submit-btn"
                                onClick={handleConfirmBooking}
                                disabled={isSubmitting}
                                style={{ background: isSubmitting ? '#999' : '#25D366' }}
                            >
                                <span className="material-icons" style={{ fontSize: '18px' }}>{isSubmitting ? 'hourglass_empty' : 'send'}</span>
                                {isSubmitting ? 'Saving Booking...' : 'Send Request via WhatsApp'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
