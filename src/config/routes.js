/**
 * Application route configuration
 * Centralized route definitions for easy maintenance
 */

export const ROUTES = {
  HOME: '/',
  BOOKING: '/reservation',
  CONTACT: '/contact',
  LEGAL: '/mentions-legales',
  CGV: '/cgv',
};

export const NAV_LINKS = [
  { label: 'Accueil', path: ROUTES.HOME },
  { label: 'Réserver', path: ROUTES.BOOKING },
  { label: 'Contact', path: ROUTES.CONTACT },
];
