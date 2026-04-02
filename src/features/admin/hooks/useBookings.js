import { useState, useEffect, useCallback, useMemo } from 'react';
import { getBookings, updateBookingStatus, deleteBooking, deleteBookings } from '../../../services/bookingService';

export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookings(filter);
      setBookings(data);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setError('Impossible de charger les réservations.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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

  const handleStatusUpdate = async (id, newStatus, price = null) => {
    setUpdatingId(id);
    try {
      const updated = await updateBookingStatus(id, newStatus, price);
      setBookings(prev => prev.map(b => (b.id === id ? updated : b)));
      if (newStatus === 'quoted') {
        alert('Le devis a bien été envoyé au client par email !');
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('Erreur lors de la mise à jour du statut.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer définitivement cette réservation ? Cette action est irréversible.')) return;
    setDeletingId(id);
    try {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      const newSelected = new Set(selectedIds);
      newSelected.delete(id);
      setSelectedIds(newSelected);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredBookings.map(b => b.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id, checked) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Supprimer définitivement les ${selectedIds.size} réservations sélectionnées ?`)) return;
    
    setIsDeletingBulk(true);
    try {
      await deleteBookings(Array.from(selectedIds));
      setBookings(prev => prev.filter(b => !selectedIds.has(b.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Erreur lors de la suppression groupée.');
    } finally {
      setIsDeletingBulk(false);
    }
  };

  return {
    bookings,
    filteredBookings,
    loading,
    error,
    filter,
    setFilter,
    dateFilter,
    setDateFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleBulkDelete,
    isDeletingBulk,
    handleStatusUpdate,
    handleDelete,
    updatingId,
    deletingId,
    fetchBookings
  };
}
