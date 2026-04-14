'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../utilities/supabase/supabase';

export interface Driver {
    id: number;
    name: string;
    phone_number: string;
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
        license_number: 'GA-03-TX-5542',
        created_at: '2023-05-10',
        is_available: true,
        rating: '5.0',
        experience: '8 Years'
    }
];

// ==========================================
// PURE UTILITY FUNCTIONS (Reusable anywhere)
// ==========================================

export const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export function buildTimestamp(dateStr: string, hour: string, minute: string, period: string): string {
    let h = parseInt(hour);
    // Convert 12-hour to 24-hour format
    if (period === 'AM' && h === 12) h = 0;
    if (period === 'PM' && h !== 12) h = h + 12;
    const hh = h.toString().padStart(2, '0');
    const mm = minute.padStart(2, '0');
    return `${dateStr}T${hh}:${mm}:00+05:30`;
}

export function generateWhatsAppLink(ownerPhone: string, bookingData: any, selectedDriver: Driver | null): string {
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

    return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(rawMessage)}`;
}

// ==========================================
// API SERVICE FUNCTIONS (Reusable Database Logic)
// ==========================================

export async function upsertCustomerRecord(phone: string, name: string, email: string) {
    const { data, error } = await supabase
        .from('customers')
        .upsert(
            { phone_number: phone, name, email },
            { onConflict: 'phone_number' }
        );

    if (error) throw error;
    return data;
}

export async function createBookingRecord(bookingPayload: any) {
    const { data, error } = await supabase
        .from('bookings')
        .insert(bookingPayload);

    if (error) throw error;
    return data;
}

export async function fetchVehicleCategories() {
    const { data, error } = await supabase
        .from('VEHICLE_CATEGORIES')
        .select('*')
        .order('base_price', { ascending: true });

    if (error) throw error;
    return data;
}

export async function fetchDriversRecords() {
    const { data, error } = await supabase
        .from('drivers')
        .select('*');

    if (error) throw error;
    return data;
}


// ==========================================
// REACT COMPONENT LOGIC (Hook)
// ==========================================

export function useDriversLogic() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [bookingData, setBookingData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const OWNER_PHONE = process.env.NEXT_PUBLIC_OWNER_PHONE || "91XXXXXXXXXX";

    useEffect(() => {
        // 1. Fetch Drivers from Supabase
        async function loadDrivers() {
            try {
                const data = await fetchDriversRecords();
                setDrivers(data);
            } catch (err) {
                console.error("Failed to load drivers:", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadDrivers();

        // 2. Load Local Storage Data
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
            // 1. Create or Update Customer (using external service function)
            await upsertCustomerRecord(
                bookingData.phone,
                bookingData.name,
                bookingData.email
            );

            // 2. Format precise timestamp (using utility function)
            const pickupTimestamp = buildTimestamp(
                bookingData.date,
                bookingData.timeHour,
                bookingData.timeMinute,
                bookingData.timePeriod
            );

            // 3. Create Booking Record (using external service function)
            await createBookingRecord({
                customer_number: bookingData.phone,
                pickup_time: pickupTimestamp,
                pickup_location: bookingData.pickup,
                dropoff_location: bookingData.drop,
                route_type: bookingData.routeType,
                requested_category: bookingData.carType,
                special_requests: bookingData.specialRequests || null,
                status: 'Pending'
            });

            // 4. Generate Link & Open WhatsApp (using utility function)
            const whatsappUrl = generateWhatsAppLink(OWNER_PHONE, bookingData, selectedDriver);
            window.open(whatsappUrl, '_blank');

        } catch (err) {
            console.error('Unexpected error:', err);
            alert('Something went wrong. Please check your internet and try again.');
        }

        // 5. Reset State
        setIsSubmitting(false);
        setSelectedDriver(null);
    };

    const handleCancelConfirmation = () => {
        setSelectedDriver(null);
    };

    return {
        driversData: drivers,
        isLoading,
        selectedDriver,
        bookingData,
        isSubmitting,
        formatDate,
        handleSelectDriver,
        handleConfirmBooking,
        handleCancelConfirmation
    };
}
