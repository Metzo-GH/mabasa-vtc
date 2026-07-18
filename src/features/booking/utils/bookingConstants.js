export const INITIAL_FORM = {
  tripType: 'oneway',
  departure: { label: '', city: '', postcode: '', context: '' },
  arrival: { label: '', city: '', postcode: '', context: '' },
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
  // Medical specific fields
  serviceType: 'vtc',
  secuNumber: '',
  caisseAffiliation: '',
  prescriptionMedicale: false,
  medicalMotif: '',
};

/** @type {Record<string, string>} Motifs médicaux normalisés */
export const MEDICAL_MOTIF_LABELS = {
  hospitalisation: 'Hospitalisation',
  consultation:    'Consultation',
  dialyse:         'Dialyse / Chimio / Radio',
  reeducation:     'Rééducation',
  autre:           'Autre motif',
};

/** @type {Record<string, {label: string, color: string}>} Configuration des statuts */
export const STATUS_CONFIG = {
  pending:   { label: 'En attente',    color: '#f59e0b' },
  quoted:    { label: 'Devis envoyé',  color: '#3b82f6' },
  confirmed: { label: 'Confirmé',      color: '#10b981' },
  completed: { label: 'Terminé',       color: '#6366f1' },
  cancelled: { label: 'Annulé',        color: '#ef4444' },
};

