'use client';

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

export function generateWhatsAppLink(ownerPhone: string, bookingData: any): string {
    const formattedDate = formatDate(bookingData.date);
    const rawMessage = `NEW BOOKING REQUEST\n\n` +
        `Customer: ${bookingData.name}\n` +
        `Phone: ${bookingData.phone}\n\n` +
        `Trip Details\n` +
        `Route: ${bookingData.routeType}\n` +
        `Car: ${bookingData.carType}\n` +
        `Date: ${formattedDate}\n` +
        `Time: ${bookingData.timeHour}:${bookingData.timeMinute} ${bookingData.timePeriod}\n\n` +
        `Addresses\n` +
        `Pickup: ${bookingData.pickup}\n` +
        `Drop: ${bookingData.drop}\n\n` +
        `Special Requests: ${bookingData.specialRequests || 'None'}`;

    return `https://wa.me/${ownerPhone}?text=${encodeURIComponent(rawMessage)}`;
}

export async function upsertCustomerRecord(phone: string, name: string) {
    return { phone_number: phone, name };
}

export async function createBookingRecord(bookingPayload: any) {
    return bookingPayload;
}

// Simple CSV parser that handles quoted strings
function parseCSV(csvText: string) {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        const obj: any = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        return obj;
    });
}

export async function fetchVehicleCategories() {
    try {
        const response = await fetch('/data/taxis.csv');
        const csvText = await response.text();
        const data = parseCSV(csvText);
        return data.map((item: any) => ({
            category_name: item.type,
            base_price: parseInt(item.rate_per_hour)
        }));
    } catch (err) {
        console.error("CSV Fetch Error:", err);
        return [
            { category_name: 'Hatchback', base_price: 1500 },
            { category_name: 'Sedan', base_price: 2000 },
            { category_name: 'MUV', base_price: 2500 },
            { category_name: 'SUV', base_price: 3000 }
        ];
    }
}

export async function fetchReviewsRecords() {
    try {
        const response = await fetch('/data/reviews.csv');
        const csvText = await response.text();
        const data = parseCSV(csvText);
        const lastThree = data.slice(-3);
        return lastThree.map((item: any, index: number) => ({
            id: index + 1,
            name: item.name,
            review: item.review,
            rating: parseInt(item.rating)
        }));
    } catch (err) {
        console.error("CSV Fetch Error:", err);
        return [
            { id: 1, name: 'Rahul Desai', review: 'Great experience! The ride was comfortable and on time.', rating: 5 },
            { id: 2, name: 'Priya Sharma', review: 'Comfortable ride from the airport. Clean car.', rating: 4 },
            { id: 3, name: 'Vikram Singh', review: 'Excellent sightseeing tour. Knew all the best spots.', rating: 5 }
        ];
    }
}
