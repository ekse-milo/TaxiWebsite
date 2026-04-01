'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export function useFormLogic() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const carFromUrl = searchParams.get('car') || 'Hatchback';

    const [carType, setCarType] = useState(carFromUrl);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [tempSelectedDates, setTempSelectedDates] = useState<string[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); // Default to current month
    const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
    const [showErrors, setShowErrors] = useState(false);

    // Form inputs state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pickup: '',
        drop: ''
    });

    useEffect(() => {
        if (carFromUrl) setCarType(carFromUrl);
    }, [carFromUrl]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleGoNow = () => {
        setShowErrors(true); // Highlight missing fields when checking availability

        if (!formData.name.trim() || !formData.phone.trim() || !formData.pickup.trim() || !formData.drop.trim()) {
            setAvailabilityStatus('idle'); // Don't show availability if form is incomplete
            return;
        }

        setAvailabilityStatus('checking');
        // Reset selected dates if user switches to Go Now
        setSelectedDates([]);

        // Simulate API check
        setTimeout(() => {
            const isAvailable = Math.random() > 0.3; // 70% chance available
            setAvailabilityStatus(isAvailable ? 'available' : 'unavailable');
        }, 2000);
    };

    const handleGoLater = () => {
        setAvailabilityStatus('idle');
        setTempSelectedDates([...selectedDates]); // Copy current to temp
        setShowCalendar(true);
    };

    const handleBooking = () => {
        // Save form data and selected dates to localStorage for the summary page
        localStorage.setItem('taxi_booking_data', JSON.stringify({
            ...formData,
            selectedDates,
            carType
        }));
        router.push('/Drivers');
    };

    const handleCancelCalendar = () => {
        setShowCalendar(false);
        setTempSelectedDates([]);
    };

    const handleDoneCalendar = () => {
        setSelectedDates([...tempSelectedDates]);
        setShowCalendar(false);
        setShowErrors(true); // Highlight missing fields when dates are confirmed
    };

    const toggleDate = (date: string) => {
        setTempSelectedDates(prev =>
            prev.includes(date)
                ? prev.filter(d => d !== date)
                : [...prev, date].sort()
        );
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const isFormValid = formData.name.trim() !== '' &&
        formData.phone.trim() !== '' &&
        formData.pickup.trim() !== '' &&
        formData.drop.trim() !== '' &&
        (availabilityStatus === 'available' || selectedDates.length > 0);

    return {
        carType,
        showCalendar,
        selectedDates,
        tempSelectedDates,
        currentMonth,
        availabilityStatus,
        formData,
        isFormValid,
        showErrors,
        handleInputChange,
        handleGoNow,
        handleGoLater,
        handleBooking,
        handleCancelCalendar,
        handleDoneCalendar,
        toggleDate,
        nextMonth,
        prevMonth
    };
}
