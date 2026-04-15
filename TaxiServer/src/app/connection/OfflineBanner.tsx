'use client';

import { useState, useEffect } from 'react';
import styles from './OfflineBanner.module.css';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState("Checking connection...");

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setIsChecking(false);
    };

    // Custom trigger with duration control
    const handleTrigger = (e: any) => {
      const duration = e.detail?.duration || 0;

      if (!navigator.onLine) {
        if (duration > 0) {
          setIsChecking(true);
          setCheckMessage("Verifying internet connection...");

          setTimeout(() => {
            setIsChecking(false);
            if (!navigator.onLine) {
              setIsOffline(true);
            }
          }, duration);
        } else {
          setIsOffline(true);
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('startConnectionCheck', handleTrigger as any);

    // Initial check on refresh/load
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('startConnectionCheck', handleTrigger as any);
    };
  }, []);

  const handleTryAgain = () => {
    setIsChecking(true);
    setCheckMessage("Reconnecting...");

    // Recovery Check Stage: 5 Seconds
    setTimeout(() => {
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        window.location.reload();
      } else {
        setIsChecking(false);
        setIsOffline(true);
      }
    }, 5000);
  };

  // 1. Loading State
  if (isChecking) {
    return (
      <div className={styles.checkingOverlay}>
        <div className={styles.checkingContent}>
          <div className={styles.spinner}></div>
          <h2 className={styles.checkingTitle}>{checkMessage}</h2>
          <p className={styles.checkingText}>Please wait while we verify your connection status.</p>
        </div>
      </div>
    );
  }

  // 2. Offline State
  if (isOffline) {
    return (
      <div className={styles.offlineOverlay}>
        <div className={styles.offlineContent}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="18" r="2" fill="#005577" />
            <path d="M5 11C7.8 8.2 11.7 7.5 15 8.7" stroke="#005577" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 11C20.1 12.1 20.8 13.5 21 15" stroke="#005577" strokeWidth="2" strokeLinecap="round" />
            <path d="M2.5 8C5.5 5 10 4 14 5" stroke="#005577" strokeWidth="2" strokeLinecap="round" />
            <path d="M17 17L21 21M21 17L17 21" stroke="#005577" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <h2 className={styles.offlineTitle}>No Internet Connection</h2>
          <p className={styles.offlineText}>
            Oops! It looks like you're offline. Please check your connection to continue your taxi booking.
          </p>
          <button
            onClick={handleTryAgain}
            style={{
              marginTop: '20px',
              padding: '12px 30px',
              backgroundColor: '#005577',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
