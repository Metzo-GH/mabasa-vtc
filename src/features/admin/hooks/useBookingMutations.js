import { useState, useCallback } from 'react';
import { updateBookingStatus, deleteBooking, deleteBookings } from '../../../services/bookingService';

/**
 * Custom hook to handle CRUD mutations for bookings (SRP).
 * 
 * @param {Array} bookings - The raw bookings state
 * @param {Function} setBookings - State updater function for bookings
 * @param {Array} filteredBookings - Currently filtered bookings list
 * @param {Object} options - Custom options for callbacks (confirmations, alerts)
 */
export function useBookingMutations(bookings, setBookings, filteredBookings, options = {}) {
  const { onRequestConfirmation, onRequestAlert } = options;
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  const confirmAction = useCallback((config) => {
    if (onRequestConfirmation) {
      onRequestConfirmation(config);
    } else {
      if (window.confirm(config.message)) {
        config.onConfirm();
      }
    }
  }, [onRequestConfirmation]);

  const showAlert = useCallback((message, title = 'Notification', isError = false) => {
    if (onRequestAlert) {
      onRequestAlert({ message, title, isError });
    } else {
      window.alert(message);
    }
  }, [onRequestAlert]);

  const handleStatusUpdate = useCallback(async (id, newStatus, price = null) => {
    setUpdatingId(id);
    try {
      const updated = await updateBookingStatus(id, newStatus, price);
      setBookings(prev => prev.map(b => (b.id === id ? updated : b)));
      if (newStatus === 'quoted') {
        showAlert('Le devis a bien été envoyé au client par email !', 'Devis Envoyé');
      }
    } catch (err) {
      console.error('Status update error:', err);
      showAlert('Erreur lors de la mise à jour du statut.', 'Erreur', true);
    } finally {
      setUpdatingId(null);
    }
  }, [setBookings, showAlert]);

  const handleDelete = useCallback(async (id) => {
    confirmAction({
      title: 'Supprimer la réservation',
      message: 'Supprimer définitivement cette réservation ? Cette action est irréversible.',
      isDanger: true,
      onConfirm: async () => {
        setDeletingId(id);
        try {
          await deleteBooking(id);
          setBookings(prev => prev.filter(b => b.id !== id));
          setSelectedIds(prev => {
            const newSelected = new Set(prev);
            newSelected.delete(id);
            return newSelected;
          });
        } catch (err) {
          console.error('Delete error:', err);
          showAlert('Erreur lors de la suppression.', 'Erreur', true);
        } finally {
          setDeletingId(null);
        }
      }
    });
  }, [confirmAction, setBookings, showAlert]);

  const handleSelectAll = useCallback((e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredBookings.map(b => b.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [filteredBookings]);

  const handleSelectOne = useCallback((id, checked) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    
    confirmAction({
      title: 'Suppression groupée',
      message: `Supprimer définitivement les ${selectedIds.size} réservations sélectionnées ?`,
      isDanger: true,
      onConfirm: async () => {
        setIsDeletingBulk(true);
        try {
          await deleteBookings(Array.from(selectedIds));
          setBookings(prev => prev.filter(b => !selectedIds.has(b.id)));
          setSelectedIds(new Set());
        } catch (err) {
          console.error('Bulk delete error:', err);
          showAlert('Erreur lors de la suppression groupée.', 'Erreur', true);
        } finally {
          setIsDeletingBulk(false);
        }
      }
    });
  }, [selectedIds, confirmAction, setBookings, showAlert]);

  return {
    selectedIds,
    updatingId,
    deletingId,
    isDeletingBulk,
    handleStatusUpdate,
    handleDelete,
    handleSelectAll,
    handleSelectOne,
    handleBulkDelete,
  };
}
