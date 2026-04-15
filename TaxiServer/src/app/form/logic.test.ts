import { expect, test, describe } from 'vitest';
import { validatePhone, checkFormErrors, isFormFullyValid } from './logic';

describe('Form Validation Logic', () => {

    test('validates correct Indian phone numbers', () => {
        expect(validatePhone('9876543210')).toBe(true);
        expect(validatePhone('1234567890')).toBe(true);
    });

    test('rejects incorrect phone numbers', () => {
        expect(validatePhone('123')).toBe(false); // Too short
        expect(validatePhone('98765432101')).toBe(false); // Too long
        expect(validatePhone('abcdefghij')).toBe(false); // Only letters
    });

    test('identifies errors in incomplete form data', () => {
        const incompleteData = {
            name: 'A', // Too short
            phone: '123', // Invalid
            pickup: '',
            drop: 'Hotel Goa',
            date: ''
        };

        const errors = checkFormErrors(incompleteData);
        expect(errors.name).toBe(true); // Should have error
        expect(errors.phone).toBe(true); // Should have error
        expect(errors.pickup).toBe(true); // Should have error
        expect(errors.drop).toBe(false); // No error, provided
        expect(errors.date).toBe(true); // Should have error
    });

    test('identifies fully valid form data', () => {
        const validErrors = {
            name: false,
            phone: false,
            pickup: false,
            drop: false,
            date: false
        };
        expect(isFormFullyValid(validErrors)).toBe(true);
    });
});
