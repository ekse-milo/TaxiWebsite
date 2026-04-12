'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function useFormLogic() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const carFromUrl = searchParams.get('car') || 'Hatchback';

    const [carType, setCarType] = useState(carFromUrl);
    const [routeType, setRouteType] = useState('Airport');
    const [showErrors, setShowErrors] = useState(false);

    // Calendar State
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

    // Form inputs state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        pickup: '',
        drop: '',
        date: '',
        timeHour: '12',
        timeMinute: '00',
        timePeriod: 'AM',
        specialRequests: ''
    });

    useEffect(() => {
        if (carFromUrl) setCarType(carFromUrl);
    }, [carFromUrl]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSwapAddresses = () => {
        setFormData(prev => ({
            ...prev,
            pickup: prev.drop,
            drop: prev.pickup
        }));
    };

    // Calendar Handlers
    const openCalendar = () => setShowCalendar(true);
    const closeCalendar = () => setShowCalendar(false);
    
    const handleSelectDate = (dateStr: string) => {
        setFormData(prev => ({ ...prev, date: dateStr }));
        closeCalendar();
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    const errors = {
        name: formData.name.trim().length < 2,
        phone: !phoneRegex.test(formData.phone),
        email: !emailRegex.test(formData.email),
        pickup: formData.pickup.trim() === '',
        drop: formData.drop.trim() === '',
        date: formData.date === ''
    };

    // The form is valid if no errors in text fields and date is chosen
    const isFormValid = !errors.name && !errors.phone && !errors.email && !errors.pickup && !errors.drop && !errors.date;

    const handleBooking = () => {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            window.dispatchEvent(new CustomEvent('startConnectionCheck', { detail: { duration: 3000 } }));
            return;
        }

        setShowErrors(true);

        if (isFormValid) {
            // Combine the time parts into one string for storage
            const finalTime = `${formData.timeHour}:${formData.timeMinute} ${formData.timePeriod}`;
            
            localStorage.setItem('taxi_booking_data', JSON.stringify({
                ...formData,
                time: finalTime,
                carType,
                routeType
            }));
            router.push('/Drivers');
        }
    };

    return {
        carType,
        routeType,
        setRouteType,
        formData,
        isFormValid,
        showErrors,
        errors,
        showCalendar,
        currentMonth,
        handleInputChange,
        handleSwapAddresses,
        openCalendar,
        closeCalendar,
        handleSelectDate,
        nextMonth,
        prevMonth,
        handleBooking
    };
}
