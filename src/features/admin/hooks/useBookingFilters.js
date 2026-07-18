import { useState, useMemo } from 'react';

/**
 * Custom hook to handle filtering, searching, and sorting of bookings.
 * Keeps filtering concerns separate from CRUD operations (SRP).
 * 
 * @param {Array} bookings - The raw bookings array from the API
 */
export function useBookingFilters(bookings) {
  const [filter, setFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredBookings = useMemo(() => {
    let result = bookings;

    if (dateFilter !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay() + 1);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      result = result.filter(b => {
        const created = new Date(b.created_at);
        if (dateFilter === 'today') return created >= startOfDay;
        if (dateFilter === 'week') return created >= startOfWeek;
        if (dateFilter === 'month') return created >= startOfMonth;
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(b =>
        (b.first_name && b.first_name.toLowerCase().includes(q)) ||
        (b.last_name && b.last_name.toLowerCase().includes(q)) ||
        (b.email && b.email.toLowerCase().includes(q)) ||
        (b.phone && b.phone.includes(q)) ||
        (b.departure && b.departure.toLowerCase().includes(q)) ||
        (b.arrival && b.arrival.toLowerCase().includes(q))
      );
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [bookings, dateFilter, searchQuery, sortOrder]);

  return {
    filter,
    setFilter,
    serviceFilter,
    setServiceFilter,
    dateFilter,
    setDateFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    filteredBookings,
  };
}
