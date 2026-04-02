import { ArrowRight, AlertCircle, Loader2, Send } from 'lucide-react';

export default function BookingStep2({ form, updateField, errors, onPrev, isLoading, submitError }) {
  return (
    <div className="booking__panel">
      {/* Summary */}
      <div className="booking__recap">
        <h3>Récapitulatif du trajet</h3>
        <div className="booking__recap-grid">
          <span>{form.departure}</span>
          <ArrowRight size={16} />
          <span>{form.arrival}</span>
          <span className="booking__recap-date">
            {new Date(form.date || new Date()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à {form.time}
          </span>
        </div>
        <button type="button" className="booking__edit-link" onClick={onPrev}>
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

      {submitError && (
        <div className="booking__error">
          <AlertCircle size={16} />
          {submitError}
        </div>
      )}

      <div className="booking__submit-row">
        <button type="button" className="btn btn-secondary" onClick={onPrev} disabled={isLoading}>
          Retour
        </button>
        <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
          {isLoading ? (
            <><Loader2 size={18} className="spin" /> Envoi en cours...</>
          ) : (
            <><Send size={18} /> Envoyer la demande</>
          )}
        </button>
      </div>
    </div>
  );
}
