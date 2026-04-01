'use client';

import Link from 'next/link';
import './success.css';

export default function SuccessPage() {
    return (
        <section className="success-body">
            <div className="success-card">
                <div className="success-icon-circle">
                    <span className="material-icons">check_circle</span>
                </div>
                
                <h1>Booking Confirmed!</h1>
                <p>Your taxi has been successfully booked. Your driver will reach your pickup location shortly.</p>
                
                <Link href="/" className="home-link-btn">
                    <span className="material-icons">home</span>
                    Return to Home
                </Link>
            </div>
        </section>
    );
}
