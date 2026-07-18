import { useState, useEffect, useCallback } from 'react';
import { getBookings } from '../../../services/bookingService';
import { useBookingFilters } from './useBookingFilters';
import { useBookingMutations } from './useBookingMutations';

/**
 * Orchestrator hook for booking management.
 * Integrates filtering and CRUD operations while respecting SRP.
 */
export function useBookings(options = {}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = useBookingFilters(bookings);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookings(filters.filter, filters.serviceFilter);
      setBookings(data);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setError('Impossible de charger les réservations.');
    } finally {
      setLoading(false);
    }
  }, [filters.filter, filters.serviceFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const mutations = useBookingMutations(bookings, setBookings, filters.filteredBookings, options);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    ...filters,
    ...mutations,
  };
}
