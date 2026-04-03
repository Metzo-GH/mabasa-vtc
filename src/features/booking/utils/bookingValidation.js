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
