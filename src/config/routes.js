/**
 * Application route configuration
 * Centralized route definitions for easy maintenance
 */

export const ROUTES = {
  HOME: '/',
  BOOKING: '/reservation',
  CONTACT: '/contact',
  QUOTE: '/devis/:id',
  LEGAL: '/mentions-legales',
  CGV: '/cgv',
  // Admin
  ADMIN_LOGIN: '/admin',
  ADMIN_BOOKINGS: '/admin/reservations',
  ADMIN_CONTACTS: '/admin/messages',
};

export const NAV_LINKS = [
  { label: 'Accueil', path: ROUTES.HOME },
  { label: 'Réserver', path: ROUTES.BOOKING },
  { label: 'Contact', path: ROUTES.CONTACT },
];
