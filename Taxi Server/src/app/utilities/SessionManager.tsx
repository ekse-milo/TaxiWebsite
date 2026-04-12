'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const SESSION_LIMIT = 20 * 60 * 1000; // 20 minutes in milliseconds

export default function SessionManager() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = () => {
      const startTime = localStorage.getItem('taxi_session_start');
      const now = Date.now();

      if (startTime) {
        const timeElapsed = now - parseInt(startTime);

        if (timeElapsed > SESSION_LIMIT) {
          // ⚠️ Session Expired
          console.log("Session expired. Resetting...");
          localStorage.removeItem('taxi_booking_data');
          localStorage.removeItem('taxi_session_start');
          
          // Clear any other local data you might have
          // localStorage.clear(); // Use this if you want to wipe everything

          if (pathname !== '/') {
            router.push('/');
          }
        }
      } else {
        // 🆕 New user entry, set the session start time
        localStorage.setItem('taxi_session_start', now.toString());
      }
    };

    // Run check on load
    checkSession();

    // Also check every minute while they are on the site
    const interval = setInterval(checkSession, 60000); 

    return () => clearInterval(interval);
  }, [router, pathname]);

  return null;
}
