import { useState } from 'react';
import {
  MapPin, Calendar, Clock, Users, Luggage,
  ArrowRight, ArrowLeftRight, CheckCircle, Send, AlertCircle
} from 'lucide-react';
import { BRAND, ZONES } from '../../config/brand';
import './Booking.css';

const TRIP_TYPES = [
  { value: 'oneway', label: 'Aller simple' },
  { value: 'roundtrip', label: 'Aller-retour' },
];

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

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      // For now, just show success. In Phase 2, this will save to Supabase
      console.log('Booking submitted:', form);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  if (submitted) {
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
                <strong>{form.departure} → {form.arrival}</strong>
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
            <button className="btn btn-primary btn-lg" onClick={() => { setSubmitted(false); setForm(INITIAL_FORM); setStep(1); }}>
              Nouvelle réservation
            </button>
          </div>
        </div>
      </main>
    );
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
            <div className="booking__panel">
              {/* Trip type */}
              <div className="booking__trip-type">
                {TRIP_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    className={`booking__trip-btn ${form.tripType === type.value ? 'booking__trip-btn--active' : ''}`}
                    onClick={() => updateField('tripType', type.value)}
                  >
                    {type.value === 'roundtrip' && <ArrowLeftRight size={16} />}
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Departure & Arrival */}
              <div className="booking__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="departure">
                    <MapPin size={14} /> Lieu de départ
                  </label>
                  <select
                    id="departure"
                    className={`form-select ${errors.departure ? 'form-input--error' : ''}`}
                    value={form.departure}
                    onChange={(e) => updateField('departure', e.target.value)}
                  >
                    <option value="">Sélectionnez un lieu</option>
                    {ZONES.destinations.map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                    <option value="__other">Autre (préciser dans les notes)</option>
                  </select>
                  {errors.departure && <span className="form-error"><AlertCircle size={12} /> {errors.departure}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="arrival">
                    <MapPin size={14} /> Lieu d'arrivée
                  </label>
                  <select
                    id="arrival"
                    className={`form-select ${errors.arrival ? 'form-input--error' : ''}`}
                    value={form.arrival}
                    onChange={(e) => updateField('arrival', e.target.value)}
                  >
                    <option value="">Sélectionnez un lieu</option>
                    {ZONES.destinations.map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                    <option value="__other">Autre (préciser dans les notes)</option>
                  </select>
                  {errors.arrival && <span className="form-error"><AlertCircle size={12} /> {errors.arrival}</span>}
                </div>
              </div>

              {/* Date & Time */}
              <div className="booking__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="date">
                    <Calendar size={14} /> Date de prise en charge
                  </label>
                  <input
                    type="date"
                    id="date"
                    className={`form-input ${errors.date ? 'form-input--error' : ''}`}
                    value={form.date}
                    min={today}
                    onChange={(e) => updateField('date', e.target.value)}
                  />
                  {errors.date && <span className="form-error"><AlertCircle size={12} /> {errors.date}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="time">
                    <Clock size={14} /> Heure de prise en charge
                  </label>
                  <input
                    type="time"
                    id="time"
                    className={`form-input ${errors.time ? 'form-input--error' : ''}`}
                    value={form.time}
                    onChange={(e) => updateField('time', e.target.value)}
                  />
                  {errors.time && <span className="form-error"><AlertCircle size={12} /> {errors.time}</span>}
                </div>
              </div>

              {/* Return date/time (if roundtrip) */}
              {form.tripType === 'roundtrip' && (
                <div className="booking__row booking__return animate-fade-in-up">
                  <div className="form-group">
                    <label className="form-label" htmlFor="returnDate">
                      <Calendar size={14} /> Date de retour
                    </label>
                    <input
                      type="date"
                      id="returnDate"
                      className={`form-input ${errors.returnDate ? 'form-input--error' : ''}`}
                      value={form.returnDate}
                      min={form.date || today}
                      onChange={(e) => updateField('returnDate', e.target.value)}
                    />
                    {errors.returnDate && <span className="form-error"><AlertCircle size={12} /> {errors.returnDate}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="returnTime">
                      <Clock size={14} /> Heure de retour
                    </label>
                    <input
                      type="time"
                      id="returnTime"
                      className={`form-input ${errors.returnTime ? 'form-input--error' : ''}`}
                      value={form.returnTime}
                      onChange={(e) => updateField('returnTime', e.target.value)}
                    />
                    {errors.returnTime && <span className="form-error"><AlertCircle size={12} /> {errors.returnTime}</span>}
                  </div>
                </div>
              )}

              {/* Passengers & Luggage */}
              <div className="booking__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="passengers">
                    <Users size={14} /> Nombre de passagers
                  </label>
                  <select
                    id="passengers"
                    className="form-select"
                    value={form.passengers}
                    onChange={(e) => updateField('passengers', e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map(n => (
                      <option key={n} value={n}>{n} passager{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="luggage">
                    <Luggage size={14} /> Nombre de bagages
                  </label>
                  <select
                    id="luggage"
                    className="form-select"
                    value={form.luggage}
                    onChange={(e) => updateField('luggage', e.target.value)}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>{n} bagage{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Flight number & Notes */}
              <div className="form-group">
                <label className="form-label" htmlFor="flightNumber">
                  N° de vol (optionnel)
                </label>
                <input
                  type="text"
                  id="flightNumber"
                  className="form-input"
                  placeholder="Ex: AF1234"
                  value={form.flightNumber}
                  onChange={(e) => updateField('flightNumber', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="notes">
                  Notes ou demandes spéciales (optionnel)
                </label>
                <textarea
                  id="notes"
                  className="form-textarea"
                  placeholder="Siège enfant, équipement de ski, adresse précise..."
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                />
              </div>

              <button type="button" className="btn btn-primary btn-lg booking__next" onClick={goToStep2}>
                Continuer
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="booking__panel">
              {/* Summary */}
              <div className="booking__recap">
                <h3>Récapitulatif du trajet</h3>
                <div className="booking__recap-grid">
                  <span>{form.departure}</span>
                  <ArrowRight size={16} />
                  <span>{form.arrival}</span>
                  <span className="booking__recap-date">
                    {new Date(form.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à {form.time}
                  </span>
                </div>
                <button type="button" className="booking__edit-link" onClick={() => setStep(1)}>
                  Modifier le trajet
                </button>
              </div>

              {/* Personal info */}
              <div className="booking__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">Prénom *</label>
                  <input
                    type="text"
                    id="firstName"
                    className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
                    placeholder="Votre prénom"
                    value={form.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                  />
                  {errors.firstName && <span className="form-error"><AlertCircle size={12} /> {errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Nom *</label>
                  <input
                    type="text"
                    id="lastName"
                    className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
                    placeholder="Votre nom"
                    value={form.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                  />
                  {errors.lastName && <span className="form-error"><AlertCircle size={12} /> {errors.lastName}</span>}
                </div>
              </div>

              <div className="booking__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                    placeholder="exemple@email.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                  {errors.email && <span className="form-error"><AlertCircle size={12} /> {errors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Téléphone *</label>
                  <input
                    type="tel"
                    id="phone"
                    className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                    placeholder="+33 6 XX XX XX XX"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                  {errors.phone && <span className="form-error"><AlertCircle size={12} /> {errors.phone}</span>}
                </div>
              </div>

              <div className="booking__submit-row">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                  Retour
                </button>
                <button type="submit" className="btn btn-primary btn-lg">
                  <Send size={18} />
                  Envoyer la demande
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
