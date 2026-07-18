/**
 * @param {string} dateStr - ISO date string
 * @returns {string} - French formatted date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * @param {string} dateStr - ISO date string with time
 * @returns {string} - French formatted date + time
 */
export const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * @param {string} timeStr - HH:mm:ss or HH:mm string
 * @returns {string} - HH:mm formatted
 */
export const formatTime = (timeStr) => {
  return timeStr ? timeStr.slice(0, 5) : '';
};
