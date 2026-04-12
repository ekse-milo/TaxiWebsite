'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

export function useDriversLogic() {
    const router = useRouter();
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [bookingData, setBookingData] = useState<any>(null);

    // ✅ OWNER'S WHATSAPP NUMBER
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

    const handleConfirmBooking = () => {
        if (!bookingData) return;

        // ✅ 1. CONSTRUCT WHATSAPP MESSAGE (Safe encoding)
        const rawMessage = `🚀 *NEW BOOKING REQUEST* 🚀\n\n` +
            `*Customer:* ${bookingData.name}\n` +
            `*Phone:* ${bookingData.phone}\n` +
            `*Email:* ${bookingData.email}\n\n` +
            `*Trip Details:* \n` +
            `📍 *Route:* ${bookingData.routeType}\n` +
            `🚗 *Car:* ${bookingData.carType}\n` +
            `📅 *Date:* ${bookingData.date}\n` +
            `⏰ *Time:* ${bookingData.timeHour}:${bookingData.timeMinute} ${bookingData.timePeriod}\n\n` +
            `*Addresses:* \n` +
            `🏠 *Pickup:* ${bookingData.pickup}\n` +
            `🏁 *Drop:* ${bookingData.drop}\n\n` +
            `💬 *Special Requests:* ${bookingData.specialRequests || 'None'}\n\n` +
            `👤 *Requested Driver:* ${selectedDriver?.name || 'Any'}`;

        const whatsappUrl = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(rawMessage)}`;

        // ✅ 2. OPEN WHATSAPP
        window.open(whatsappUrl, '_blank');
        
        // ✅ 3. RESET UI
        setSelectedDriver(null);
    };

    const handleCancelConfirmation = () => {
        setSelectedDriver(null);
    };

    return {
        driversData,
        selectedDriver,
        bookingData,
        formatDate,
        handleSelectDriver,
        handleConfirmBooking,
        handleCancelConfirmation
    };
}
