import { CheckCircle } from 'lucide-react';

export default function BookingSuccess({ form, onReset }) {
  return (
    <main className="booking-page">
      <div className="container">
        <div className="booking__success animate-fade-in-up">
          <div className="booking__success-icon">
            <CheckCircle size={48} />
          </div>
          <h2>Demande envoyée !</h2>
          <p>
            Merci pour votre demande de réservation. Nous vous contacterons dans les plus
            brefs délais pour confirmer votre trajet.
          </p>
          <div className="booking__success-summary">
            <div className="booking__summary-row">
              <span>Trajet</span>
              <strong>{form.departure?.label} → {form.arrival?.label}</strong>
            </div>
            <div className="booking__summary-row">
              <span>Date</span>
              <strong>{new Date(form.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
            <div className="booking__summary-row">
              <span>Heure</span>
              <strong>{form.time}</strong>
            </div>
            <div className="booking__summary-row">
              <span>Passagers</span>
              <strong>{form.passengers}</strong>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={onReset}>
            Nouvelle réservation
          </button>
        </div>
      </div>
    </main>
  );
}
