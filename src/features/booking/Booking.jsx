import BookingStep1 from './components/BookingStep1';
import BookingStep2 from './components/BookingStep2';
import BookingSuccess from './components/BookingSuccess';
import { useBookingForm } from '../../hooks/useBookingForm';
import { useTheme } from '../../context/ThemeContext';
import './Booking.css';
import { INITIAL_FORM } from './utils/bookingConstants';

export default function Booking() {
  const { mode } = useTheme();
  const isMedical = mode === 'medical';

  const {
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
  } = useBookingForm(INITIAL_FORM);

  if (submitted) {
    return <BookingSuccess form={form} onReset={handleReset} />;
  }

  return (
    <main className="booking-page">
      <div className="container">
        {/* Header */}
        <div className="booking__header animate-fade-in-up">
          <span className="section-label">
            {isMedical ? 'Taxi Conventionné CPAM' : 'Réservation VTC'}
          </span>
          <h1>
            {isMedical ? (
              <>Réservez votre <span className="text-accent">Taxi Conventionné</span></>
            ) : (
              <>Réservez votre <span className="text-accent">trajet</span></>
            )}
          </h1>
          <p className="subtitle">
            {isMedical ? (
              'Remplissez les détails médicaux ci-dessous pour planifier votre transport de santé conventionné.'
            ) : (
              'Remplissez le formulaire ci-dessous et nous vous contacterons pour confirmer votre réservation.'
            )}
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
