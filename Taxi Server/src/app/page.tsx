'use client';

import Image from "next/image";
import styles from "./page.module.css";
import './style.css';
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const bookButtons = document.querySelectorAll('.btn-outline');
    const whatsappNumber = "910000000000";

    const handleClick = (e: Event) => {
      const button = e.currentTarget as HTMLElement;
      let message = "Hi, I'm interested in booking a ride with Goa Rides!";

      const card = button.closest('.car-card, .package-card');
      if (card) {
        const title = card.querySelector('h3');
        if (title) {
          message = `Hi, I'm interested in booking the ${title.innerText} package/car with Goa Rides!`;
        }
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(whatsappURL, '_blank');
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
        <table width="100%">
          <tbody>
            <tr>
              <td align="left">
                <Image src="/logo.png" alt="Website Logo" height={40} width={40} />
              </td>
              <td align="right">
                <nav>
                  <a href="#cars" className="nav-link">OUR FLEET</a>
                  <a href="#packages" className="nav-link">PACKAGES</a>
                  <a href="#reviews" className="nav-link">REVIEWS</a>
                  <a href="#contact" className="nav-link">CONTACT</a>
                </nav>
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <div style={{ textAlign: 'center' }} className="hero-section">
        <h1 className="hero-title">Experience Goa's Vibes</h1>
        <h2 className="hero-subtitle">With Comfortable Rides</h2>
        <p className="hero-text">From sun-kissed beaches to heritage streets. We drive, you relax.</p>
      </div>

      <hr className="section-divider" />

      <div id="cars" style={{ textAlign: 'center' }} className="cars-section">
        <h2 className="section-title">CHOOSE YOUR RIDE</h2>
        <p className="section-subtitle">Comfortable, Clean, and AC Cabs for every group size.</p>
        <br />
        <table style={{ margin: '0 auto' }} className="cars-table">
          <tbody>
            <tr>
              <td style={{ textAlign: 'center' }} className="car-card">
                <Image src="/assets/Hatch.png" alt="Hatchback" height={100} width={150} /><br />
                <h3 className="nameColor">Hatchback</h3>
                <p className="car-price">Starts ₹1200 / day</p>
              </td>
              <td style={{ textAlign: 'center' }} className="car-card">
                <Image src="/assets/Sedan.png" alt="Sedan" height={100} width={150} /><br />
                <h3 className="nameColor">Sedan</h3>
                <p className="car-price">Starts ₹1500 / day</p>
              </td>
              <td style={{ textAlign: 'center' }} className="car-card">
                <Image src="/assets/MUV.png" alt="MUV" height={100} width={150} /><br />
                <h3 className="nameColor">MUV</h3>
                <p className="car-price">Starts ₹2200 / day</p>
              </td>
              <td style={{ textAlign: 'center' }} className="car-card">
                <Image src="/assets/SUV.png" alt="SUV" height={100} width={150} /><br />
                <h3 className="nameColor">SUV</h3>
                <p className="car-price">Starts ₹3000 / day</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="section-divider" />

      <div id="packages" style={{ textAlign: 'center' }} className="packages-section">
        <h2 className="section-title">POPULAR PACKAGES</h2>
        <p className="section-subtitle">Curated trips for the best Goan experience.</p>
        <br />
        <table style={{ margin: '0 auto' }} className="packages-table">
          <tbody>
            <tr>
              <td style={{ textAlign: 'center' }} className="package-card">
                <h3 className="nameColor">Airport Transfer</h3>
                <p className="package-desc">Hassle-free pickup and drop to Dabolim or Mopa Airport.</p>
                <button className="btn-outline">Book</button>
              </td>
              <td style={{ textAlign: 'center' }} className="package-card">
                <h3 className="nameColor">City Tour</h3>
                <p className="package-desc">Explore Panjim, Old Goa Churches, and Shopping streets.</p>
                <button className="btn-outline">Book</button>
              </td>
              <td style={{ textAlign: 'center' }} className="package-card">
                <h3 className="nameColor">Sightseeing</h3>
                <p className="package-desc">North or South Goa beaches, Forts, and Waterfalls.</p>
                <button className="btn-outline">Book</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="section-divider" />

      <div id="reviews" style={{ textAlign: 'center' }} className="reviews-section">
        <h2 className="section-title">TRAVELER STORIES</h2>
        <br />
        <table style={{ margin: '0 auto' }} className="reviews-table">
          <tbody>
            <tr>
              <td style={{ textAlign: 'center' }} className="review-card">
                <p className="review-quote">"The driver was so polite and the car was spotless. Loved the Goan music playlist!"</p>
                <p className="review-author">- Sarah Jenkins</p>
              </td>
              <td style={{ textAlign: 'center' }} className="review-card">
                <p className="review-quote">"Best rates we found for an airport drop. Efficient and on time."</p>
                <p className="review-author">- Rahul Verma</p>
              </td>
              <td style={{ textAlign: 'center' }} className="review-card">
                <p className="review-quote">"We booked an SUV for 3 days. Smooth rides and great recommendations by the driver."</p>
                <p className="review-author">- Mike & Team</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="section-divider" />

      <footer id="contact" className="footer" style={{ textAlign: 'center' }}>
        <h3>Companies Name</h3>
        <p className="footer-tagline">Making your Goan holidays smoother, one ride at a time.</p>

        <div className="footer-contact-info">
          <p><b>Phone: </b>Phone Number</p>
          <p><b>Email: </b>Email</p>
          <p><b>Address: </b>Address</p>
        </div>

        <hr className="footer-divider" />
        <p className="footer-copyright">&copy; All rights reserved.</p>
      </footer>
    </>
  );
}
