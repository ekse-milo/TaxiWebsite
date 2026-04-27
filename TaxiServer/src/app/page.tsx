'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchVehicleCategories, fetchReviewsRecords, fetchPackages, Review } from "./utilities/sharedLogic";
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
  const [packages, setPackages] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const router = useRouter();


  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPos > 10); // Lower threshold for mobile responsiveness
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Categories
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

  // Fetch Packages
  useEffect(() => {
    async function loadPackages() {
      try {
        const data = await fetchPackages();
        setPackages(data);
      } catch (err) {
        console.error("Failed to load packages:", err);
      } finally {
        setLoadingPackages(false);
      }
    }
    loadPackages();
  }, []);

  // Scroll effect using IntersectionObserver for maximum mobile reliability
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting means the trigger is visible at the top
        setIsScrolled(!entry.isIntersecting);
      },
      { 
        // We want to trigger as soon as the top element starts leaving the view
        threshold: [0.99] 
      }
    );

    const trigger = document.getElementById('scroll-trigger');
    if (trigger) observer.observe(trigger);

    return () => observer.disconnect();
  }, []);

  // Fetch Reviews
  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await fetchReviewsRecords();
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    }
    loadReviews();
  }, []);

  // Navigation handler
  const handleBooking = (car: string, route?: string) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      window.dispatchEvent(new CustomEvent('startConnectionCheck', { detail: { duration: 3000 } }));
      return;
    }
    const url = route
      ? `/form?car=${encodeURIComponent(car)}&route=${encodeURIComponent(route)}`
      : `/form?car=${encodeURIComponent(car)}`;
    router.push(url);
  };

  return (
    <>
      {/* Invisible element to trigger scroll state */}
      <div id="scroll-trigger" style={{ position: 'absolute', top: 0, left: 0, height: '10px', width: '1px', pointerEvents: 'none', visibility: 'hidden' }}></div>

      {/* Header */}
      <header className={`${styles.header} ${isScrolled || isMenuOpen ? styles.scrolled : ''}`}>

        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <img src="/assets/logo.png" alt="Website Logo" className={styles.websiteLogo} />
            <span className={styles.brandName}>Joshua Alex Moraes Taxi Service</span>
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
            <div className={styles.mobileBrandName}>Joshua Alex Moraes Taxi Service</div>
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
          {loadingPackages ? (
            <div className={styles.loadingSpinner}>Loading Packages...</div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.package} className={styles.packageCard}>
                <h3 className={styles.nameColor}>{pkg.package}</h3>
                <p className={styles.packageDesc}>
                  {pkg.description}
                </p>
                <button
                  className={styles.btnOutline}
                  onClick={() => handleBooking('Sedan', pkg.package)}
                  style={{ marginTop: '15px' }}
                >
                  Book
                </button>
              </div>
            ))
          )}
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
                  priority
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
          {loadingReviews ? (
            <div className={styles.loadingSpinner}>Loading Stories...</div>
          ) : (
            reviews.map((r, index) => (
              <div key={index} className={styles.reviewCard}>
                <div className={styles.reviewStars}>
                  {"★".repeat(r.rating || 5)}{"☆".repeat(5 - (r.rating || 5))}
                </div>
                <p className={styles.reviewQuote}>
                  &quot;{r.review}&quot;
                </p>
                <p className={styles.reviewAuthor}>- {r.name}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <hr className={styles.sectionDivider} />

      {/* Footer */}
      <footer id="contact" className={styles.footer}>
        <h3>Joshua Alex Moraes Taxi Service</h3>
        <p className={styles.footerTagline}>
          Making your Goan holidays smoother, one ride at a time.
        </p>

        <div className={styles.footerContactInfo}>
          <p><b>Phone: </b>+91 80074 54465</p>
          <p><b>Address: </b>Villa No. 8, Shalom Villa, Bamborda, Verna, Goa 403722</p>
        </div>

        <p className={styles.footerCopyright}>
          &copy; 2026 Joshua Alex Moraes Taxi Service. All rights reserved.
        </p>
      </footer>
    </>
  );
}
