import { describe, it, expect } from 'vitest';
import { validateStep1, validateStep2 } from '../utils/bookingValidation';

describe('Booking Validation Utils', () => {
  describe('validateStep1', () => {
    it('should return errors for empty fields', () => {
      const form = {
        departure: '',
        arrival: '',
        date: '',
        time: '',
        tripType: 'oneway'
      };
      const errors = validateStep1(form);
      expect(errors.departure).toBeDefined();
      expect(errors.arrival).toBeDefined();
      expect(errors.date).toBeDefined();
      expect(errors.time).toBeDefined();
    });

    it('should return errors for missing return date in roundtrip', () => {
      const form = {
        departure: 'Paris',
        arrival: 'Lyon',
        date: '2026-05-01',
        time: '10:00',
        tripType: 'roundtrip',
        returnDate: '',
        returnTime: ''
      };
      const errors = validateStep1(form);
      expect(errors.returnDate).toBeDefined();
      expect(errors.returnTime).toBeDefined();
    });

    it('should return no errors for valid oneway trip', () => {
      const form = {
        departure: 'Paris',
        arrival: 'Lyon',
        date: '2026-05-01',
        time: '10:00',
        tripType: 'oneway'
      };
      const errors = validateStep1(form);
      expect(Object.keys(errors).length).toBe(0);
    });
  });

  describe('validateStep2', () => {
    it('should return errors for missing contact info', () => {
      const form = {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      };
      const errors = validateStep2(form);
      expect(errors.firstName).toBeDefined();
      expect(errors.lastName).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.phone).toBeDefined();
    });

    it('should return no errors for complete contact info', () => {
      const form = {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean@example.com',
        phone: '+33612345678'
      };
      const errors = validateStep2(form);
      expect(Object.keys(errors).length).toBe(0);
    });
  });
});
