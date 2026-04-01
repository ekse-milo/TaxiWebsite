'use client';

import Image from "next/image";
import styles from "./page.module.css";
import './style.css';
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const bookButtons = document.querySelectorAll('.btn-outline');

    const handleClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const car = target.getAttribute('data-car');
      window.location.href = `/form?car=${car || ''}`;
    };

    bookButtons.forEach(button => {
      button.addEventListener('click', handleClick);
    });

    return () => {
      bookButtons.forEach(button => {
        button.removeEventListener('click', handleClick);
      });
    };
  }, []);
  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Image src="/logo.png" alt="Website Logo" height={40} width={40} />
          </div>
          <nav className="nav">
            <a href="#cars" className="nav-link">OUR FLEET</a>
            <a href="#packages" className="nav-link">PACKAGES</a>
            <a href="#reviews" className="nav-link">REVIEWS</a>
            <a href="#contact" className="nav-link">CONTACT</a>
          </nav>
        </div>
      </header>

      <div className="hero-section">
        <h1 className="hero-title">Experience Goa's Vibes</h1>
        <h2 className="hero-subtitle">With Comfortable Rides</h2>
        <p className="hero-text">From sun-kissed beaches to heritage streets. We drive, you relax.</p>
      </div>

      <hr className="section-divider" />

      <div id="cars" className="cars-section">
        <h2 className="section-title">CHOOSE YOUR RIDE</h2>
        <p className="section-subtitle">Comfortable, Clean, and AC Cabs for every group size.</p>
        <div className="cars-container">
          <div className="car-card">
            <Image src="/assets/Hatch.png" alt="Hatchback" height={100} width={150} />
            <h3 className="nameColor">Hatchback</h3>
            <p className="car-price">Starts ₹1200 / day</p>
            <button className="btn-outline" data-car="Hatchback">Book</button>
          </div>
          <div className="car-card">
            <Image src="/assets/Sedan.png" alt="Sedan" height={100} width={150} />
            <h3 className="nameColor">Sedan</h3>
            <p className="car-price">Starts ₹1500 / day</p>
            <button className="btn-outline" data-car="Sedan">Book</button>
          </div>
          <div className="car-card">
            <Image src="/assets/MUV.png" alt="MUV" height={100} width={150} />
            <h3 className="nameColor">MUV</h3>
            <p className="car-price">Starts ₹2200 / day</p>
            <button className="btn-outline" data-car="MUV">Book</button>
          </div>
          <div className="car-card">
            <Image src="/assets/SUV.png" alt="SUV" height={100} width={150} />
            <h3 className="nameColor">SUV</h3>
            <p className="car-price">Starts ₹3000 / day</p>
            <button className="btn-outline" data-car="SUV">Book</button>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      <div id="packages" className="packages-section">
        <h2 className="section-title">POPULAR PACKAGES</h2>
        <p className="section-subtitle">Curated trips for the best Goan experience.</p>
        <div className="packages-container">
          <div className="package-card">
            <h3 className="nameColor">Airport Transfer</h3>
            <p className="package-desc">Hassle-free pickup and drop to Dabolim or Mopa Airport.</p>
          </div>
          <div className="package-card">
            <h3 className="nameColor">City Tour</h3>
            <p className="package-desc">Explore Panjim, Old Goa Churches, and Shopping streets.</p>
          </div>
          <div className="package-card">
            <h3 className="nameColor">Sightseeing</h3>
            <p className="package-desc">North or South Goa beaches, Forts, and Waterfalls.</p>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      <div id="reviews" className="reviews-section">
        <h2 className="section-title">TRAVELER STORIES</h2>
        <div className="reviews-container">
          <div className="review-card">
            <p className="review-quote">"The driver was so polite and the car was spotless. Loved the Goan music playlist!"</p>
            <p className="review-author">- Sarah Jenkins</p>
          </div>
          <div className="review-card">
            <p className="review-quote">"Best rates we found for an airport drop. Efficient and on time."</p>
            <p className="review-author">- Rahul Verma</p>
          </div>
          <div className="review-card">
            <p className="review-quote">"We booked an SUV for 3 days. Smooth rides and great recommendations by the driver."</p>
            <p className="review-author">- Mike & Team</p>
          </div>
        </div>
      </div>

      <hr className="section-divider" />

      <footer id="contact" className="footer">
        <h3>Companies Name</h3>
        <p className="footer-tagline">Making your Goan holidays smoother, one ride at a time.</p>

        <div className="footer-contact-info">
          <p><b>Phone: </b>Phone Number</p>
          <p><b>Email: </b>Email</p>
          <p><b>Address: </b>Address</p>
        </div>
        {/* 
        <hr className="footer-divider" /> */}
        <p className="footer-copyright">&copy; All rights reserved.</p>
      </footer>
    </>
  );
}
