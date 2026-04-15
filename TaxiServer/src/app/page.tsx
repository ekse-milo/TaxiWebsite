'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchVehicleCategories } from "./Drivers/logic";
import './style.css';

// Helper to map DB names to local image files
const getImagePath = (categoryName: string) => {
  const map: { [key: string]: string } = {
    'Hatchback': 'Hatch',
    'Sedan': 'Sedan',
    'MUV': 'MUV',
    'SUV': 'SUV'
  };
  return `/assets/${map[categoryName] || 'Sedan'}.png`;
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Scroll effect
  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Categories from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchVehicleCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Navigation handler
  const handleBooking = (car: string) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      window.dispatchEvent(new CustomEvent('startConnectionCheck', { detail: { duration: 3000 } }));
      return;
    }
    router.push(`/form?car=${encodeURIComponent(car)}`);
  };

  return (
    <>
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo">
            <img src="/logo.png" alt="Website Logo" className="website-logo" />
          </div>

          <input type="checkbox" id="menu-toggle" className="menu-checkbox" />
          <label htmlFor="menu-toggle" className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </label>

          <nav className="nav">
            <a href="#packages" className="nav-link">PACKAGES</a>
            <a href="#cars" className="nav-link">OUR FLEET</a>
            <a href="#reviews" className="nav-link">REVIEWS</a>
            <a href="#contact" className="nav-link">CONTACT</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <h1 className="hero-title">Experience Goa&apos;s Vibes</h1>
        <h2 className="hero-subtitle">With Comfortable Rides</h2>
        <p className="hero-text">
          From sun-kissed beaches to heritage streets. We drive, you relax.
        </p>
      </section>

      <hr className="section-divider" />

      {/* Packages */}
      <section id="packages" className="packages-section">
        <h2 className="section-title">POPULAR PACKAGES</h2>
        <p className="section-subtitle">
          Curated trips for the best Goan experience.
        </p>

        <div className="packages-container">
          <div className="package-card">
            <h3 className="nameColor">Airport Transfer</h3>
            <p className="package-desc">
              Hassle-free pickup and drop to Dabolim or Mopa Airport.
            </p>
          </div>

          <div className="package-card">
            <h3 className="nameColor">City Tour</h3>
            <p className="package-desc">
              Explore Panjim, Old Goa Churches, and Shopping streets.
            </p>
          </div>

          <div className="package-card">
            <h3 className="nameColor">Sightseeing</h3>
            <p className="package-desc">
              North or South Goa beaches, Forts, and Waterfalls.
            </p>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Cars */}
      <section id="cars" className="cars-section">
        <h2 className="section-title">CHOOSE YOUR RIDE</h2>
        <p className="section-subtitle">
          Comfortable, Clean, and AC Cabs for every group size.
        </p>

        <div className="cars-container">
          {loading ? (
            <div className="loading-spinner">Loading Fleet...</div>
          ) : (
            categories.map((cat) => (
              <div key={cat.category_name} className="car-card">
                <Image
                  src={getImagePath(cat.category_name)}
                  alt={cat.category_name}
                  height={100}
                  width={150}
                />

                <h3 className="nameColor">{cat.category_name}</h3>
                <p className="car-price">Starts ₹{cat.base_price} / day</p>

                <button
                  className="btn-outline"
                  onClick={() => handleBooking(cat.category_name)}
                >
                  Book
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <hr className="section-divider" />

      {/* Reviews */}
      <section id="reviews" className="reviews-section">
        <h2 className="section-title">TRAVELER STORIES</h2>

        <div className="reviews-container">
          <div className="review-card">
            <p className="review-quote">
              &quot;The driver was so polite and the car was spotless.&quot;
            </p>
            <p className="review-author">- Sarah Jenkins</p>
          </div>

          <div className="review-card">
            <p className="review-quote">
              &quot;Best rates we found for an airport drop.&quot;
            </p>
            <p className="review-author">- Rahul Verma</p>
          </div>

          <div className="review-card">
            <p className="review-quote">
              &quot;Smooth rides and great recommendations.&quot;
            </p>
            <p className="review-author">- Mike & Team</p>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Footer */}
      <footer id="contact" className="footer">
        <h3>Companies Name</h3>
        <p className="footer-tagline">
          Making your Goan holidays smoother, one ride at a time.
        </p>

        <div className="footer-contact-info">
          <p><b>Phone: </b>Phone Number</p>
          <p><b>Email: </b>Email</p>
          <p><b>Address: </b>Address</p>
        </div>

        <p className="footer-copyright">
          &copy; All rights reserved.
        </p>
      </footer>
    </>
  );
}