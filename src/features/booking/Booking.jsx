import { useState } from 'react';
import BookingStep1 from './components/BookingStep1';
import BookingStep2 from './components/BookingStep2';
import BookingSuccess from './components/BookingSuccess';
import { createBooking } from '../../services/bookingService';
import './Booking.css';

const INITIAL_FORM = {
  tripType: 'oneway',
  departure: '',
  arrival: '',
  date: '',
  time: '',
  returnDate: '',
  returnTime: '',
  passengers: '1',
  luggage: '1',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  flightNumber: '',
  notes: '',
};

export default function Booking() {
  const [form, setForm] = useState(INITIAL_FORM);
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

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.departure) newErrors.departure = 'Veuillez indiquer le lieu de départ';
    if (!form.arrival) newErrors.arrival = 'Veuillez indiquer le lieu d\'arrivée';
    if (!form.date) newErrors.date = 'Veuillez choisir une date';
    if (!form.time) newErrors.time = 'Veuillez choisir une heure';
    if (form.tripType === 'roundtrip') {
      if (!form.returnDate) newErrors.returnDate = 'Date de retour requise';
      if (!form.returnTime) newErrors.returnTime = 'Heure de retour requise';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'Prénom requis';
    if (!form.lastName) newErrors.lastName = 'Nom requis';
    if (!form.email) newErrors.email = 'Email requis';
    if (!form.phone) newErrors.phone = 'Téléphone requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep2 = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep1 = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

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
    setForm(INITIAL_FORM);
    setStep(1);
  };

  if (submitted) {
    return <BookingSuccess form={form} onReset={handleReset} />;
  }

  return (
    <main className="booking-page">
      <div className="container">
        {/* Header */}
        <div className="booking__header animate-fade-in-up">
          <span className="section-label">Réservation</span>
          <h1>Réservez votre <span className="text-accent">trajet</span></h1>
          <p className="subtitle">
            Remplissez le formulaire ci-dessous et nous vous contacterons pour confirmer votre réservation.
          </p>
        </div>

        {/* Step indicator */}
        <div className="booking__steps animate-fade-in-up animate-delay-1">
          <div className={`booking__step ${step >= 1 ? 'booking__step--active' : ''}`}>
            <div className="booking__step-number">1</div>
            <span>Votre trajet</span>
          </div>
          <div className="booking__step-line" />
          <div className={`booking__step ${step >= 2 ? 'booking__step--active' : ''}`}>
            <div className="booking__step-number">2</div>
            <span>Vos coordonnées</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking__form animate-fade-in-up animate-delay-2">
          {step === 1 && (
            <BookingStep1 
              form={form} 
              updateField={updateField} 
              errors={errors} 
              onNext={goToStep2} 
            />
          )}

          {step === 2 && (
            <BookingStep2 
              form={form}
              updateField={updateField}
              errors={errors}
              onPrev={goToStep1}
              isLoading={isLoading}
              submitError={submitError}
            />
          )}
        </form>
      </div>
    </main>
  );
}
