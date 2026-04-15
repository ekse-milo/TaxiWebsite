'use client';

import { useDriversLogic } from './logic';
import styles from './drivers.module.css';

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
        <section className={styles.driversBody}>
            <header className={styles.driversHeader}>
                <h1>Our Professional Drivers</h1>
            </header>

            <div className={styles.driversContainer}>
                {isLoading ? (
                    <div className={styles.loadingState}>
                        <span className={`material-icons ${styles.rotating}`}>hourglass_empty</span>
                        <p>Loading Professional Drivers...</p>
                    </div>
                ) : (
                    <div className={styles.driversGrid}>
                        {driversData.map((driver, index) => (
                            <div key={driver.id || index} className={styles.driverCard} onClick={() => handleSelectDriver(driver)}>
                                <div className={styles.driverCardTop}></div>
                                <div className={styles.driverAvatar}>
                                    <span className="material-icons" style={{ fontSize: '40px' }}>account_circle</span>
                                </div>
                                <h3 className={styles.driverName}>{driver.name}</h3>
                                <div className={styles.driverRating}>

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

                                <div className={`${styles.statusBadge} ${driver.is_available ? styles.statusAvailable : styles.statusUnavailable}`}>
                                    <div className={styles.statusDot}></div>
                                    {driver.is_available ? 'Available Now' : 'On Trip'}
                                </div>

                                <div className={styles.driverDetails}>
                                    <div className={styles.detailRow}>
                                        <div className={styles.detailIcon}><span className="material-icons">local_taxi</span></div>
                                        <div className={styles.detailText}>
                                            <span className={styles.detailLabel}>Taxi Service</span>
                                            <span className={styles.detailValue}>Licensed Professional</span>
                                        </div>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <div className={styles.detailIcon}><span className="material-icons">verified</span></div>
                                        <div className={styles.detailText}>
                                            <span className={styles.detailLabel}>Verify ID</span>
                                            <span className={styles.detailValue}>{driver.license_number}</span>
                                        </div>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <div className={styles.detailIcon}><span className="material-icons">phone</span></div>
                                        <div className={styles.detailText}>
                                            <span className={styles.detailLabel}>Direct Contact</span>
                                            <span className={styles.detailValue}>{driver.phone_number}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className={styles.selectDriverBtn}>
                                    Select {driver.name.split(' ')[0]}
                                    <span className="material-icons">chevron_right</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <br /><br />
            <a href='/'><button
                className={styles.homeBtn}
            >
                Home
            </button></a>

            {selectedDriver && (
                <div className={styles.modalOverlay} onClick={handleCancelConfirmation}>
                    <div className={styles.summaryModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <span className="material-icons" style={{ color: '#005577', fontSize: '48px' }}>whatsapp</span>
                            <h2>Confirm Booking</h2>
                            <p className={styles.modalSubtitle}>We will redirect you to WhatsApp to finalize with our team.</p>
                        </div>

                        <div className={styles.modalContent}>
                            <div className={styles.summarySection}>
                                <h4>Trip Overview</h4>
                                <div className={styles.summaryGrid}>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summarLabel}>Route</span>
                                        <span className={styles.summaryValue} style={{ color: '#005577', fontWeight: 'bold' }}>{bookingData?.routeType}</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summarLabel}>Car</span>
                                        <span className={styles.summaryValue}>{bookingData?.carType}</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summarLabel}>Date</span>
                                        <span className={styles.summaryValue}>{bookingData?.date ? formatDate(bookingData.date) : '-'}</span>
                                    </div>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.summarLabel}>Time</span>
                                        <span className={styles.summaryValue}>{bookingData?.timeHour}:{bookingData?.timeMinute} {bookingData?.timePeriod}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.summarySection}>
                                <h4>Addresses</h4>
                                <div className={styles.summaryItem} style={{ marginBottom: '10px' }}>
                                    <span className={styles.summarLabel}>Pickup</span>
                                    <span className={styles.summaryValue}>{bookingData?.pickup}</span>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span className={styles.summarLabel}>Drop</span>
                                    <span className={styles.summaryValue}>{bookingData?.drop}</span>
                                </div>
                            </div>

                            {bookingData?.specialRequests && (
                                <div className={styles.summarySection}>
                                    <h4>Special Requests</h4>
                                    <p style={{ fontSize: '0.9rem', color: '#333', fontStyle: 'italic' }}>"{bookingData.specialRequests}"</p>
                                </div>
                            )}
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.modalCancelBtn} onClick={handleCancelConfirmation} disabled={isSubmitting}>Back</button>
                            <button
                                className={styles.modalSubmitBtn}
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

