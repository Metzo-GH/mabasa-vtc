/**
 * Pure functions for booking validation.
 * Ensures the logic is testable without React dependency.
 */

export const validateStep1 = (form) => {
  const errors = {};
  
  if (!form.departure?.label) {
    errors.departure = 'Veuillez indiquer le lieu de départ';
  }
  
  if (!form.arrival?.label) {
    errors.arrival = 'Veuillez indiquer le lieu d\'arrivée';
  }
  
  if (!form.date) errors.date = 'Veuillez choisir une date';
  if (!form.time) errors.time = 'Veuillez choisir une heure';
  
  if (form.tripType === 'roundtrip') {
    if (!form.returnDate) errors.returnDate = 'Date de retour requise';
    if (!form.returnTime) errors.returnTime = 'Heure de retour requise';
  }

  // Business Rule: Departure or Arrival MUST be in Hautes-Alpes (05) OR Auvergne-Rhône-Alpes (ARA)
  if (form.departure?.label && form.arrival?.label) {
    const isDeptAllowed = (addr) => {
      if (!addr) return false;
      
      const postcode = String(addr.postcode || '');
      const context = String(addr.context || '');
      
      // Allowed departments: 
      // 05 (Hautes-Alpes)
      // 01, 03, 07, 15, 26, 38, 42, 43, 63, 69, 73, 74 (Auvergne-Rhône-Alpes)
      const allowedDepts = [
        '01', '03', '05', '07', '15', '26', '38', '42', '43', '63', '69', '73', '74'
      ];
      
      return allowedDepts.some(dept => postcode.startsWith(dept) || context.includes(`${dept},`));
    };

    if (!isDeptAllowed(form.departure) && !isDeptAllowed(form.arrival)) {
      const errorMsg = 'Le départ ou l\'arrivée doit être dans les Hautes-Alpes (05) ou en Auvergne-Rhône-Alpes';
      errors.departure = errorMsg;
      errors.arrival = errorMsg;
    }
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

  // Recursively sanitize strings in objects
  const sanitizeValue = (val) => {
    if (typeof val === 'string') return escapeString(val);
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const sObj = {};
      Object.keys(val).forEach(k => {
        sObj[k] = sanitizeValue(val[k]);
      });
      return sObj;
    }
    return val;
  };

  Object.keys(sanitized).forEach(key => {
    sanitized[key] = sanitizeValue(sanitized[key]);
  });
  
  return sanitized;
};
