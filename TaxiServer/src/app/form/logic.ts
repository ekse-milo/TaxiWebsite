'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// ==========================================
// PURE VALIDATION SERVICES (Reusable anywhere)
// ==========================================

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

export const checkFormErrors = (formData: any, isTimeSelected: boolean) => {
    return {
        name: formData.name.trim().length < 2,
        phone: !validatePhone(formData.phone),
        pickup: formData.pickup.trim() === '',
        drop: formData.drop.trim() === '',
        date: formData.date === '',
        time: !isTimeSelected
    };
};

export const isFormFullyValid = (errors: any): boolean => {
    return !errors.name && !errors.phone && !errors.pickup && !errors.drop && !errors.date && !errors.time;
};

// ==========================================
// REACT COMPONENT LOGIC (Hook)
// ==========================================

import { 
    formatDate, 
    buildTimestamp, 
    generateWhatsAppLink, 
    upsertCustomerRecord, 
    createBookingRecord,
    fetchVehicleCategories,
    fetchPackages
} from '../utilities/sharedLogic';

export function useFormLogic() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const carFromUrl = searchParams.get('car') || 'Hatchback';
    const routeFromUrl = searchParams.get('route') || 'Airport Transfer';
    const isPackageBooking = searchParams.has('route');

    const [carType, setCarType] = useState(carFromUrl);
    const [routeType, setRouteType] = useState(routeFromUrl);
    const [showErrors, setShowErrors] = useState(false);

    // Dynamic data from CSV
    const [carTypes, setCarTypes] = useState<string[]>(['Hatchback', 'Sedan', 'MUV', 'SUV']);
    const [routes, setRoutes] = useState<string[]>(['Airport', 'Sightseeing', 'City Tour']);

    useEffect(() => {
        const loadData = async () => {
            const taxis = await fetchVehicleCategories();
            if (taxis && taxis.length > 0) {
                const fetchedTaxis = taxis.map(t => t.category_name);
                setCarTypes(fetchedTaxis);
                if (!fetchedTaxis.includes(carType)) {
                    setCarType(fetchedTaxis[0]);
                }
            }
            
            const packages = await fetchPackages();
            if (packages && packages.length > 0) {
                const fetchedRoutes = packages.map(p => p.package);
                setRoutes(fetchedRoutes);
                
                // If the current routeType (from URL or hardcoded default) is not in the fetched routes,
                // and we have fetched routes, then default to the first one.
                if (!fetchedRoutes.includes(routeType)) {
                    setRouteType(fetchedRoutes[0]);
                }
            }
        };
        loadData();
    }, []);

    // Picker States
    const [showCalendar, setShowCalendar] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showAirportPicker, setShowAirportPicker] = useState(false);
    const [isTimeSelected, setIsTimeSelected] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [airportTransferType, setAirportTransferType] = useState<'from' | 'to'>('from');

    // Clear fields if switching to Airport package
    useEffect(() => {
        if (routeType.toLowerCase().includes('airport')) {
            setFormData(prev => ({ ...prev, pickup: '', drop: '' }));
        }
    }, [routeType]);

    const handleAirportTransferTypeChange = (type: 'from' | 'to') => {
        setAirportTransferType(type);
        setFormData(prev => ({ ...prev, pickup: '', drop: '' }));
    };

    // Initial time: 1 hour from now
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    let h = oneHourLater.getHours();
    const p = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    const hStr = String(h).padStart(2, '0');
    const m = Math.floor(oneHourLater.getMinutes() / 5) * 5;
    const mStr = String(m).padStart(2, '0');

    // Form inputs state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pickup: '',
        drop: '',
        date: '',
        timeHour: hStr,
        timeMinute: mStr,
        timePeriod: p,
        specialRequests: ''
    });

    const [showSummary, setShowSummary] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const OWNER_PHONE = process.env.NEXT_PUBLIC_OWNER_PHONE || "918007454465";

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
        setIsTimeSelected(false); // Reset the time selection when date changes
        closeCalendar();
    };

    // Time Picker Handlers
    const openTimePicker = () => setShowTimePicker(true);
    const closeTimePicker = () => setShowTimePicker(false);

    const openAirportPicker = () => setShowAirportPicker(true);
    const closeAirportPicker = () => setShowAirportPicker(false);

    const handleSelectTime = (hour: string, minute: string, period: string) => {
        setFormData(prev => ({
            ...prev,
            timeHour: hour,
            timeMinute: minute,
            timePeriod: period
        }));
        setIsTimeSelected(true);
        // We don't close immediately to let them refine, or we can close if you prefer
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    // Calculate validation state using our Pure Services
    const errors = checkFormErrors(formData, isTimeSelected);
    const isFormValid = isFormFullyValid(errors);

    const handleBooking = () => {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            window.dispatchEvent(new CustomEvent('startConnectionCheck', { detail: { duration: 3000 } }));
            return;
        }

        setShowErrors(true);

        if (isFormValid) {
            setShowSummary(true);
        }
    };

    const handleConfirmBooking = async () => {
        if (!formData || isSubmitting) return;
        setIsSubmitting(true);

        try {
            // 1. Create or Update Customer
            await upsertCustomerRecord(
                formData.phone,
                formData.name
            );

            // 2. Format precise timestamp
            const pickupTimestamp = buildTimestamp(
                formData.date,
                formData.timeHour,
                formData.timeMinute,
                formData.timePeriod
            );

            // 3. Create Booking Record
            await createBookingRecord({
                customer_number: formData.phone,
                pickup_time: pickupTimestamp,
                pickup_location: formData.pickup,
                dropoff_location: formData.drop,
                route_type: routeType,
                requested_category: carType,
                special_requests: formData.specialRequests || null,
                status: 'pending'
            });

            // 4. Generate Link & Open WhatsApp
            const whatsappUrl = generateWhatsAppLink(OWNER_PHONE, {
                ...formData,
                carType,
                routeType
            });
            window.open(whatsappUrl, '_blank');
            setShowSummary(false);
            setShowThankYou(true);

        } catch (err) {
            console.error('Unexpected error:', err);
            alert('Something went wrong. Please check your internet and try again.');
        }

        setIsSubmitting(false);
    };

    return {
        carType,
        setCarType,
        routeType,
        setRouteType,
        isPackageBooking,
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
        showTimePicker,
        isTimeSelected,
        openTimePicker,
        closeTimePicker,
        handleSelectTime,
        showAirportPicker,
        openAirportPicker,
        closeAirportPicker,
        nextMonth,
        prevMonth,
        handleBooking,
        showSummary,
        setShowSummary,
        showThankYou,
        setShowThankYou,
        airportTransferType,
        handleAirportTransferTypeChange,
        isSubmitting,
        handleConfirmBooking,
        formatDate,
        carTypes,
        routes
    };
}
