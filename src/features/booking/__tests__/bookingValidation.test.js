import { describe, it, expect } from 'vitest';
import { validateStep1, validateStep2 } from '../utils/bookingValidation';

describe('Booking Validation Utils', () => {
  describe('validateStep1', () => {
    it('should return errors for empty objects', () => {
      const form = {
        departure: { label: '' },
        arrival: { label: '' },
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

    it('should return errors if neither departure nor arrival is in 05', () => {
      const form = {
        departure: { label: 'Paris', city: 'Paris', postcode: '75000', context: '75, Paris' },
        arrival: { label: 'Lyon', city: 'Lyon', postcode: '69000', context: '69, Lyon' },
        date: '2026-05-01',
        time: '10:00',
        tripType: 'oneway'
      };
      const errors = validateStep1(form);
      expect(errors.departure).toBe('Le départ ou l\'arrivée doit être dans les Hautes-Alpes (05)');
      expect(errors.arrival).toBe('Le départ ou l\'arrivée doit être dans les Hautes-Alpes (05)');
    });

    it('should return no errors if departure is in 05', () => {
      const form = {
        departure: { label: 'Gap', city: 'Gap', postcode: '05000', context: '05, Hautes-Alpes' },
        arrival: { label: 'Lyon', city: 'Lyon', postcode: '69000', context: '69, Lyon' },
        date: '2026-05-01',
        time: '10:00',
        tripType: 'oneway'
      };
      const errors = validateStep1(form);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('should return no errors if arrival is in 05', () => {
      const form = {
        departure: { label: 'Genève Coronavin', city: 'Genève', postcode: '1201', context: 'Genève (Suisse)' },
        arrival: { label: 'Briançon', city: 'Briançon', postcode: '05100', context: '05, Hautes-Alpes' },
        date: '2026-05-01',
        time: '10:00',
        tripType: 'oneway'
      };
      // Briançon starts with 05.
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
