'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export interface Review {
    id: number;
    name: string;
    review: string;
    rating: number;
}


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
    const rawMessage = `NEW BOOKING REQUEST\n\n` +
        `Customer: ${bookingData.name}\n` +
        `Phone: ${bookingData.phone}\n` +
        `Email: ${bookingData.email}\n\n` +
        `Trip Details: \n` +
        `Route: ${bookingData.routeType}\n` +
        `Car: ${bookingData.carType}\n` +
        `Date: ${bookingData.date}\n` +
        `Time: ${bookingData.timeHour}:${bookingData.timeMinute} ${bookingData.timePeriod}\n\n` +
        `Addresses: \n` +
        `Pickup: ${bookingData.pickup}\n` +
        `Drop: ${bookingData.drop}\n\n` +
        `Special Requests: ${bookingData.specialRequests || 'None'}\n\n` +
        `Requested Driver: ${selectedDriver?.name || 'Any'}`;

    return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(rawMessage)}`;
}

// ==========================================
// API SERVICE FUNCTIONS 
// ==========================================

export async function upsertCustomerRecord(phone: string, name: string, email: string) {
    // 1. Check if a customer already exists with either with particular phone OR particular email
    const { data: results, error: findError } = await supabase
        .from('customers')
        .select('phone_number, email')
        .or(`phone_number.eq.${phone},email.eq.${email}`);

    if (findError) {
        console.error("Database lookup failed:", findError);
        throw findError;
    }

    // Prioritize the record that matches the phone number to avoid update errors
    const existing = results && results.length > 0
        ? (results.find(r => r.phone_number === phone) || results[0])
        : null;

    let result;
    if (existing) {
        const matchKey = existing.phone_number
            ? { phone_number: existing.phone_number }
            : { email: existing.email };

        const { data, error: updateError } = await supabase
            .from('customers')
            .update({ phone_number: phone, name, email })
            .match(matchKey)
            .select()
            .single();

        if (updateError) {
            // If the update failed (likely an email conflict with another row),
            // try updating just the name and keeping the original email to bypass the error
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('customers')
                .update({ phone_number: phone, name })
                .match(matchKey)
                .select()
                .single();

            if (fallbackError) throw fallbackError;
            result = fallbackData;
        } else {
            result = data;
        }
    } else {
        // If user don't exist create a new record
        const { data, error: insertError } = await supabase
            .from('customers')
            .insert({ phone_number: phone, name, email })
            .select()
            .single();

        if (insertError) {
            console.error("Insert failed:", insertError);
            throw insertError;
        }
        result = data;
    }

    return result;
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

export async function fetchReviewsRecords() {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('id', { ascending: false })
        .limit(3);

    if (error) throw error;
    return data;
}


// ==========================================
// REACT COMPONENT LOGIC 
// ==========================================

export function useDriversLogic() {
    const router = useRouter();
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
                router.push('/');
            }
        } else {
            // Unauth bypass guard: If no data exists, kick user back to home
            router.push('/');
        }
    }, [router]);

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
                status: 'pending'
            });

            // 4. Generate Link & Open WhatsApp (using utility function)
            const whatsappUrl = generateWhatsAppLink(OWNER_PHONE, bookingData, selectedDriver);
            window.open(whatsappUrl, '_blank');

        } catch (err) {
            const error = err as { message?: string; details?: string; status?: number };
            console.error('Unexpected error:', err);
            console.error('Error message:', error?.message);
            console.error('Error details:', error?.details);
            console.error('Error status:', error?.status);
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
