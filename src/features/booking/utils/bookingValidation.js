/**
 * Pure functions for booking validation.
 * Ensures the logic is testable without React dependency.
 */

export const validateStep1 = (form) => {
  const errors = {};
  if (!form.departure) errors.departure = 'Veuillez indiquer le lieu de départ';
  if (!form.arrival) errors.arrival = 'Veuillez indiquer le lieu d\'arrivée';
  if (!form.date) errors.date = 'Veuillez choisir une date';
  if (!form.time) errors.time = 'Veuillez choisir une heure';
  
  if (form.tripType === 'roundtrip') {
    if (!form.returnDate) errors.returnDate = 'Date de retour requise';
    if (!form.returnTime) errors.returnTime = 'Heure de retour requise';
  }
  
  return errors;
};

export const validateStep2 = (form) => {
  const errors = {};
  if (!form.firstName) errors.firstName = 'Prénom requis';
  if (!form.lastName) errors.lastName = 'Nom requis';
  if (!form.email) errors.email = 'Email requis';
  if (!form.phone) errors.phone = 'Téléphone requis';
  
  return errors;
};

/**
 * Assainissement des champs textes (OWASP XSS mitigation)
 */
export const sanitizeBookingData = (data) => {
  const sanitized = { ...data };
  const escapeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag])
    );
  };

  // Assainir tous les champs de type string
  Object.keys(sanitized).forEach(key => {
    sanitized[key] = escapeString(sanitized[key]);
  });
  
  return sanitized;
};
