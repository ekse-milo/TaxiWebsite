'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../utilities/supabase/supabase';

export interface Driver {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    license_number: string;
    created_at: string;
    is_available: boolean;
    rating: string;
    experience: string;
}

const driversData: Driver[] = [
    {
        id: 1,
        name: 'Sandeep Sharma',
        phone_number: '+91 98XXX XXX01',
        email: 'sandeep@taxigoa.com',
        license_number: 'GA-01-TX-2023',
        created_at: '2023-01-15',
        is_available: true,
        rating: '4.9',
        experience: '12 Years'
    },
    {
        id: 2,
        name: 'Antonio Dcosta',
        phone_number: '+91 98XXX XXX02',
        email: 'antonio@taxigoa.com',
        license_number: 'GA-02-TX-1098',
        created_at: '2022-11-20',
        is_available: true,
        rating: '4.8',
        experience: '15 Years'
    },
    {
        id: 3,
        name: 'Rajesh G. Naik',
        phone_number: '+91 98XXX XXX03',
        email: 'rajesh@taxigoa.com',
        license_number: 'GA-03-TX-5542',
        created_at: '2023-05-10',
        is_available: true,
        rating: '5.0',
        experience: '8 Years'
    }
];

export const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// HELPER: Convert "1:30 PM" style time + "2026-04-16" date into a proper timestamp
function buildTimestamp(dateStr: string, hour: string, minute: string, period: string): string {
    let h = parseInt(hour);
    // Convert 12-hour to 24-hour format
    if (period === 'AM' && h === 12) h = 0;       // 12:00 AM = 00:00
    if (period === 'PM' && h !== 12) h = h + 12;   // 1:00 PM = 13:00
    const hh = h.toString().padStart(2, '0');
    const mm = minute.padStart(2, '0');
    // Return ISO format with India timezone offset
    return `${dateStr}T${hh}:${mm}:00+05:30`;
}

export function useDriversLogic() {
    const router = useRouter();
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [bookingData, setBookingData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    //  OWNER'S WHATSAPP NUMBER
    const OWNER_PHONE = "91XXXXXXXXXX";

    useEffect(() => {
        const savedData = localStorage.getItem('taxi_booking_data');
        if (savedData) {
            try {
                setBookingData(JSON.parse(savedData));
            } catch (e) {
                console.error("Error parsing booking data", e);
            }
        }
    }, []);

    const handleSelectDriver = (driver: Driver) => {
        if (!driver.is_available) {
            alert('This driver is currently on another trip.');
            return;
        }
        setSelectedDriver(driver);
    };

    const handleConfirmBooking = async () => {
        if (!bookingData || isSubmitting) return;
        setIsSubmitting(true);

        try {
            // ═══════════════════════════════════════════════════
            // STEP 1: SAVE CUSTOMER TO "customers" TABLE
            // ═══════════════════════════════════════════════════
            // "upsert" means: if this phone number already exists, 
            // update their name/email. If it's new, create a new row.
            const { error: customerError } = await supabase
                .from('customers')
                .upsert(
                    {
                        phone_number: bookingData.phone,
                        name: bookingData.name,
                        email: bookingData.email
                    },
                    { onConflict: 'phone_number' }
                );

            if (customerError) {
                console.error('Customer save failed:', customerError);
                alert('Could not save customer details. Please try again.');
                setIsSubmitting(false);
                return;
            }

            // ═══════════════════════════════════════════════════
            // STEP 2: BUILD THE PICKUP TIMESTAMP
            // ═══════════════════════════════════════════════════
            // Convert "2026-04-16" + "1" + "30" + "PM" → "2026-04-16T13:30:00+05:30"
            const pickupTimestamp = buildTimestamp(
                bookingData.date,
                bookingData.timeHour,
                bookingData.timeMinute,
                bookingData.timePeriod
            );

            // ═══════════════════════════════════════════════════
            // STEP 3: SAVE BOOKING TO "bookings" TABLE
            // ═══════════════════════════════════════════════════
            const { error: bookingError } = await supabase
                .from('bookings')
                .insert({
                    customer_number: bookingData.phone,
                    pickup_time: pickupTimestamp,
                    pickup_location: bookingData.pickup,
                    dropoff_location: bookingData.drop,
                    route_type: bookingData.routeType,
                    requested_category: bookingData.carType,
                    special_requests: bookingData.specialRequests || null,
                    status: 'Pending',
                    // taxi_licence and driver_licence are left NULL
                    // Owner will assign them later after reviewing the request
                });

            if (bookingError) {
                console.error('Booking save failed:', bookingError);
                alert('Could not save booking. Please try again.');
                setIsSubmitting(false);
                return;
            }

            // ═══════════════════════════════════════════════════
            // STEP 4: CONSTRUCT & SEND WHATSAPP MESSAGE
            // ═══════════════════════════════════════════════════
            const rawMessage = `🚀 *NEW BOOKING REQUEST* 🚀\n\n` +
                `*Customer:* ${bookingData.name}\n` +
                `*Phone:* ${bookingData.phone}\n` +
                `*Email:* ${bookingData.email}\n\n` +
                `*Trip Details:* \n` +
                ` *Route:* ${bookingData.routeType}\n` +
                `*Car:* ${bookingData.carType}\n` +
                `*Date:* ${bookingData.date}\n` +
                `*Time:* ${bookingData.timeHour}:${bookingData.timeMinute} ${bookingData.timePeriod}\n\n` +
                `*Addresses:* \n` +
                `*Pickup:* ${bookingData.pickup}\n` +
                `*Drop:* ${bookingData.drop}\n\n` +
                `*Special Requests:* ${bookingData.specialRequests || 'None'}\n\n` +
                `*Requested Driver:* ${selectedDriver?.name || 'Any'}`;

            const whatsappUrl = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(rawMessage)}`;

            // OPEN WHATSAPP
            window.open(whatsappUrl, '_blank');

        } catch (err) {
            console.error('Unexpected error:', err);
            alert('Something went wrong. Please check your internet and try again.');
        }

        // RESET UI
        setIsSubmitting(false);
        setSelectedDriver(null);
    };

    const handleCancelConfirmation = () => {
        setSelectedDriver(null);
    };

    return {
        driversData,
        selectedDriver,
        bookingData,
        isSubmitting,
        formatDate,
        handleSelectDriver,
        handleConfirmBooking,
        handleCancelConfirmation
    };
}
