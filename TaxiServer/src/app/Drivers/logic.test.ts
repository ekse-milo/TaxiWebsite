import { expect, test, describe } from 'vitest';
import { buildTimestamp, generateWhatsAppLink, Driver } from './logic';

describe('Driver Service Logic', () => {

    test('buildTimestamp correctly formats times including AM/PM conversion', () => {
        // 12 PM (Noon)
        expect(buildTimestamp('2023-12-01', '12', '30', 'PM')).toBe('2023-12-01T12:30:00+05:30');
        
        // 3:15 PM 
        expect(buildTimestamp('2023-12-01', '3', '15', 'PM')).toBe('2023-12-01T15:15:00+05:30');
        
        // 12 AM (Midnight)
        expect(buildTimestamp('2023-12-01', '12', '00', 'AM')).toBe('2023-12-01T00:00:00+05:30');
        
        // 8 AM
        expect(buildTimestamp('2023-12-01', '8', '05', 'AM')).toBe('2023-12-01T08:05:00+05:30');
    });

    test('generateWhatsAppLink constructs correct url encoded string', () => {
        const bookingData = {
            name: 'John Doe',
            phone: '9876543210',
            email: 'john@example.com',
            routeType: 'Airport',
            carType: 'Sedan',
            date: '2023-12-01',
            timeHour: '10',
            timeMinute: '30',
            timePeriod: 'AM',
            pickup: 'Hotel',
            drop: 'Airport',
            specialRequests: '',
        };

        const mockDriver: Driver = {
            id: 1,
            name: 'Test Driver',
            phone_number: '123',
            license_number: '123',
            created_at: '2023',
            is_available: true,
            rating: '5',
            experience: '5'
        };

        const ownerPhone = '919800000000';
        const link = generateWhatsAppLink(ownerPhone, bookingData, mockDriver);
        
        // Should start with wa.me domain and phone
        expect(link.startsWith('https://wa.me/919800000000?text=')).toBe(true);
        // Ensure some encoded form elements exist in the link
        expect(link).toContain(encodeURIComponent('John Doe'));
        expect(link).toContain(encodeURIComponent('Test Driver'));
        expect(link).toContain(encodeURIComponent('Sedan'));
    });
});
