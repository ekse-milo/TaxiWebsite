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
}

const driversData: Driver[] = [
    {
        id: 1,
        name: '',
        phone_number: '',
        email: '',
        license_number: '',
        created_at: '',
        is_available: true,
    },
    {
        id: 2,
        name: '',
        phone_number: '',
        email: '',
        license_number: '',
        created_at: '',
        is_available: false,
    },
    {
        id: 3,
        name: '',
        phone_number: '',
        email: '',
        license_number: '',
        created_at: '',
        is_available: true,
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
            alert('This driver is currently on another trip. Please choose an available driver.');
            return;
        }
        setSelectedDriver(driver);
    };

    const handleConfirmBooking = () => {
        router.push('/success');
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
