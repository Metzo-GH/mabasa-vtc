import { MapPin, Calendar, Clock, Users, Luggage, ArrowRight, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { ZONES } from '../../../config/brand';

const TRIP_TYPES = [
  { value: 'oneway', label: 'Aller simple' },
  { value: 'roundtrip', label: 'Aller-retour' },
];

export default function BookingStep1({ form, updateField, errors, onNext }) {
  const today = new Date().toISOString().split('T')[0];

  return (
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

      <button type="button" className="btn btn-primary btn-lg booking__next" onClick={onNext}>
        Continuer
        <ArrowRight size={20} />
      </button>
    </div>
  );
}
