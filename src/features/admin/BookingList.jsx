import { useState } from 'react';
import {
  CheckCircle, XCircle, Clock,
  Loader2, AlertCircle, RefreshCw, ChevronDown, ChevronUp,
  Search, Trash2, Download, Calendar, ArrowUp, ArrowDown
} from 'lucide-react';
import CalendarView from './CalendarView';
import BookingCard from './components/BookingCard';
import BookingFilters, { STATUS_FILTERS } from './components/BookingFilters';
import { useBookings } from './hooks/useBookings';
import './Admin.css';

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: '#f59e0b', icon: Clock },
  quoted: { label: 'Devis envoyé', color: '#3b82f6', icon: CheckCircle },
  confirmed: { label: 'Confirmé', color: '#10b981', icon: CheckCircle },
  completed: { label: 'Terminé', color: '#6366f1', icon: CheckCircle },
  cancelled: { label: 'Annulé', color: '#ef4444', icon: XCircle },
};

export default function BookingList() {
  const {
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
  } = useBookings();

  const [viewMode, setViewMode] = useState('list');
  const [expandedId, setExpandedId] = useState(null);

  const exportCSV = () => {
    const headers = ['Date', 'Départ', 'Arrivée', 'Client', 'Email', 'Téléphone', 'Statut', 'Prix (€)'];
    const rows = filteredBookings.map(b => [
      new Date(b.created_at).toLocaleDateString('fr-FR'),
      b.departure,
      b.arrival,
      `${b.first_name} ${b.last_name}`,
      b.email,
      b.phone,
      STATUS_CONFIG[b.status]?.label || b.status,
      b.price || '',
    ]);

    const csvContent = [headers, ...rows].map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')
    ).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mabasa_reservations_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Réservations</h1>
          {pendingCount > 0 && (
            <span className="admin-page__badge">{pendingCount} en attente</span>
          )}
        </div>
        <div className="admin-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={exportCSV} title="Exporter en CSV">
            <Download size={16} /> CSV
          </button>
          <button className="btn btn-secondary btn-sm" onClick={fetchBookings} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Actualiser
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="admin-view-toggle" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setViewMode('list')}
        >
          Vue Liste
        </button>
        <button 
          className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setViewMode('calendar')}
        >
          Vue Calendrier
        </button>
      </div>

      {viewMode === 'calendar' && (
        <CalendarView 
          bookings={bookings} 
          onSelectDate={(date) => {
            setDateFilter('all');
            setSearchQuery(date);
            setViewMode('list');
          }}
        />
      )}

      <div style={{ display: viewMode === 'list' ? 'block' : 'none' }}>
        
        <BookingFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        {/* Results count & Bulk Actions */}
        {!loading && (
          <div className="admin-results-header">
            <div className="admin-results-count" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>
                {filteredBookings.length} résultat{filteredBookings.length !== 1 ? 's' : ''}
                {searchQuery && ` pour "${searchQuery}"`}
              </span>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                title="Trier par date de commande"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {sortOrder === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />} 
                {sortOrder === 'desc' ? 'Plus récentes' : 'Plus anciennes'}
              </button>
            </div>
            
            {filteredBookings.length > 0 && (
              <div className="admin-bulk-actions">
                <label className="admin-checkbox-label">
                  <input 
                    type="checkbox" 
                    className="admin-checkbox"
                    checked={filteredBookings.length > 0 && selectedIds.size === filteredBookings.length}
                    onChange={handleSelectAll}
                  />
                  <span className="admin-checkbox-custom"></span>
                  Sélectionner tout
                </label>

                {selectedIds.size > 0 && (
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={handleBulkDelete}
                    disabled={isDeletingBulk}
                  >
                    {isDeletingBulk ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />}
                    Supprimer sélection ({selectedIds.size})
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="admin-error">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="admin-loading">
            <Loader2 size={32} className="spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="admin-empty">
            <CalendarEmpty />
            <p>Aucune réservation {filter !== 'all' ? `"${STATUS_FILTERS.find(f => f.value === filter)?.label}"` : ''} {searchQuery ? `pour "${searchQuery}"` : ''}</p>
          </div>
        )}

        {/* Booking cards */}
        {!loading && filteredBookings.length > 0 && (
          <div className="booking-cards">
            {filteredBookings.map(booking => {
              const status = STATUS_CONFIG[booking.status] || { label: booking.status, color: '#666', icon: Clock };
              const isExpanded = expandedId === booking.id;
              const isUpdating = updatingId === booking.id;
              const isDeleting = deletingId === booking.id;

              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  status={status}
                  isExpanded={isExpanded}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                  isSelected={selectedIds.has(booking.id)}
                  onToggleExpand={() => setExpandedId(isExpanded ? null : booking.id)}
                  onSelect={(checked) => handleSelectOne(booking.id, checked)}
                  onStatusUpdate={(newStatus, price) => handleStatusUpdate(booking.id, newStatus, price)}
                  onDelete={() => handleDelete(booking.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/** Simple empty calendar icon */
function CalendarEmpty() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
