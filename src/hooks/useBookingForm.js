import { useState } from 'react';
import { createBooking } from '../services/bookingService';
import { validateStep1, validateStep2 } from '../features/booking/utils/bookingValidation';

/**
 * Custom hook to manage the booking form state and logic.
 * Respects SRP by separating UI from business logic/validation.
 */
export function useBookingForm(initialForm) {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const goToStep2 = () => {
    const newErrors = validateStep1(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep1 = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const newErrors = validateStep2(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    setIsLoading(true);
    setSubmitError(null);

    try {
      await createBooking(form);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Booking submission error:', err);
      setSubmitError(
        'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm(initialForm);
    setStep(1);
  };

  return {
    form,
    step,
    submitted,
    errors,
    isLoading,
    submitError,
    updateField,
    goToStep1,
    goToStep2,
    handleSubmit,
    handleReset,
  };
}
