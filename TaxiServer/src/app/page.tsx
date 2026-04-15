'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchVehicleCategories } from "./Drivers/logic";
import styles from './page.module.css';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <header className={`${styles.header} ${isScrolled || isMenuOpen ? styles.scrolled : ''}`}>

        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Website Logo" className={styles.websiteLogo} />
          </div>

          <input
            type="checkbox"
            id="menu-toggle"
            className={styles.menuCheckbox}
            checked={isMenuOpen}
            onChange={(e) => setIsMenuOpen(e.target.checked)}
          />

          <label htmlFor="menu-toggle" className={styles.hamburger}>
            <span></span>
            <span></span>
            <span></span>
          </label>

          <nav className={styles.nav}>
            <a href="#packages" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>PACKAGES</a>
            <a href="#cars" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>OUR FLEET</a>
            <a href="#reviews" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>REVIEWS</a>
            <a href="#contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>CONTACT</a>
          </nav>

        </div>
      </header>

      {/* Hero */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Experience Goa&apos;s Vibes</h1>
        <h2 className={styles.heroSubtitle}>With Comfortable Rides</h2>
        <p className={styles.heroText}>
          From sun-kissed beaches to heritage streets. We drive, you relax.
        </p>
      </section>

      <hr className={styles.sectionDivider} />

      {/* Packages */}
      <section id="packages" className={styles.packagesSection}>
        <h2 className={styles.sectionTitle}>POPULAR PACKAGES</h2>
        <p className={styles.sectionSubtitle}>
          Curated trips for the best Goan experience.
        </p>

        <div className={styles.packagesContainer}>
          <div className={styles.packageCard}>
            <h3 className={styles.nameColor}>Airport Transfer</h3>
            <p className={styles.packageDesc}>
              Hassle-free pickup and drop to Dabolim or Mopa Airport.
            </p>
          </div>

          <div className={styles.packageCard}>
            <h3 className={styles.nameColor}>City Tour</h3>
            <p className={styles.packageDesc}>
              Explore Panjim, Old Goa Churches, and Shopping streets.
            </p>
          </div>

          <div className={styles.packageCard}>
            <h3 className={styles.nameColor}>Sightseeing</h3>
            <p className={styles.packageDesc}>
              North or South Goa beaches, Forts, and Waterfalls.
            </p>
          </div>
        </div>
      </section>

      <hr className={styles.sectionDivider} />

      {/* Cars */}
      <section id="cars" className={styles.carsSection}>
        <h2 className={styles.sectionTitle}>CHOOSE YOUR RIDE</h2>
        <p className={styles.sectionSubtitle}>
          Comfortable, Clean, and AC Cabs for every group size.
        </p>

        <div className={styles.carsContainer}>
          {loading ? (
            <div className={styles.loadingSpinner}>Loading Fleet...</div>
          ) : (
            categories.map((cat) => (
              <div key={cat.category_name} className={styles.carCard}>
                <Image
                  src={getImagePath(cat.category_name)}
                  alt={cat.category_name}
                  height={100}
                  width={150}
                />

                <h3 className={styles.nameColor}>{cat.category_name}</h3>
                <p className={styles.carPrice}>Starts ₹{cat.base_price} / day</p>

                <button
                  className={styles.btnOutline}
                  onClick={() => handleBooking(cat.category_name)}
                >
                  Book
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <hr className={styles.sectionDivider} />

      {/* Reviews */}
      <section id="reviews" className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>TRAVELER STORIES</h2>

        <div className={styles.reviewsContainer}>
          <div className={styles.reviewCard}>
            <p className={styles.reviewQuote}>
              &quot;The driver was so polite and the car was spotless.&quot;
            </p>
            <p className={styles.reviewAuthor}>- Sarah Jenkins</p>
          </div>

          <div className={styles.reviewCard}>
            <p className={styles.reviewQuote}>
              &quot;Best rates we found for an airport drop.&quot;
            </p>
            <p className={styles.reviewAuthor}>- Rahul Verma</p>
          </div>

          <div className={styles.reviewCard}>
            <p className={styles.reviewQuote}>
              &quot;Smooth rides and great recommendations.&quot;
            </p>
            <p className={styles.reviewAuthor}>- Mike & Team</p>
          </div>
        </div>
      </section>

      <hr className={styles.sectionDivider} />

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <h3>Companies Name</h3>
        <p className={styles.footerTagline}>
          Making your Goan holidays smoother, one ride at a time.
        </p>

        <div className={styles.footerContactInfo}>
          <p><b>Phone: </b>Phone Number</p>
          <p><b>Email: </b>Email</p>
          <p><b>Address: </b>Address</p>
        </div>

        <p className={styles.footerCopyright}>
          &copy; All rights reserved.
        </p>
      </footer>
    </>
  );
}