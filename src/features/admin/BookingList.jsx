import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CheckCircle, XCircle, Clock, Filter,
  Loader2, AlertCircle, RefreshCw, ChevronDown, ChevronUp,
  Search, Trash2, Download, Calendar, ArrowUp, ArrowDown
} from 'lucide-react';
import { getBookings, updateBookingStatus, deleteBooking, deleteBookings } from '../../services/bookingService';
import CalendarView from './CalendarView';
import './Admin.css';

const STATUS_CONFIG = {
  pending: { label: 'En attente', color: '#f59e0b', icon: Clock },
  quoted: { label: 'Devis envoyé', color: '#3b82f6', icon: CheckCircle },
  confirmed: { label: 'Confirmé', color: '#10b981', icon: CheckCircle },
  completed: { label: 'Terminé', color: '#6366f1', icon: CheckCircle },
  cancelled: { label: 'Annulé', color: '#ef4444', icon: XCircle },
};

const STATUS_FILTERS = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'quoted', label: 'Devis envoyé' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'completed', label: 'Terminées' },
  { value: 'cancelled', label: 'Annulées' },
];

const DATE_FILTERS = [
  { value: 'all', label: 'Tout' },
  { value: 'today', label: "Aujourd'hui" },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
];

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('list');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [quotePrices, setQuotePrices] = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());
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

  // Client-side filtering: date + search
  const filteredBookings = useMemo(() => {
    let result = bookings;

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay() + 1); // Monday
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      result = result.filter(b => {
        const created = new Date(b.created_at);
        if (dateFilter === 'today') return created >= startOfDay;
        if (dateFilter === 'week') return created >= startOfWeek;
        if (dateFilter === 'month') return created >= startOfMonth;
        return true;
      });
    }

    // Search filter
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

    // Sorting
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
      setBookings(prev =>
        prev.map(b => (b.id === id ? updated : b))
      );
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
      // Nettoyer la sélection si nécessaire
      const newSelected = new Set(selectedIds);
      newSelected.delete(id);
      setSelectedIds(newSelected);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Erreur lors de la suppression. Avez-vous activé la règle RLS "DELETE" sur Supabase ?');
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
    if (!window.confirm(`Supprimer définitivement les ${selectedIds.size} réservations sélectionnées ? Cette action est irréversible.`)) return;
    
    setIsDeletingBulk(true);
    try {
      await deleteBookings(Array.from(selectedIds));
      setBookings(prev => prev.filter(b => !selectedIds.has(b.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Erreur lors de la suppression groupée. Avez-vous activé la règle RLS "DELETE" sur Supabase ?');
    } finally {
      setIsDeletingBulk(false);
    }
  };

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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    return timeStr ? timeStr.slice(0, 5) : '';
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
      {/* Search Bar */}
      <div className="admin-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Rechercher par nom, email, téléphone, trajet..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-search__input"
        />
        {searchQuery && (
          <button className="admin-search__clear" onClick={() => setSearchQuery('')}>
            <XCircle size={16} />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="admin-filters-row">
        {/* Status filter */}
        <div className="admin-filters">
          <Filter size={16} />
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              className={`admin-filter-btn ${filter === f.value ? 'admin-filter-btn--active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Date filter */}
        <div className="admin-filters">
          <Calendar size={16} />
          {DATE_FILTERS.map(f => (
            <button
              key={f.value}
              className={`admin-filter-btn ${dateFilter === f.value ? 'admin-filter-btn--active' : ''}`}
              onClick={() => setDateFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

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
            const StatusIcon = status.icon;
            const isExpanded = expandedId === booking.id;
            const isUpdating = updatingId === booking.id;
            const isDeleting = deletingId === booking.id;

            return (
              <div key={booking.id} className={`booking-card ${isDeleting ? 'booking-card--deleting' : ''}`}>
                <div
                  className="booking-card__header"
                  onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                >
                  <label className="booking-card__select" onClick={e => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="admin-checkbox"
                      checked={selectedIds.has(booking.id)}
                      onChange={e => handleSelectOne(booking.id, e.target.checked)}
                    />
                    <span className="admin-checkbox-custom"></span>
                  </label>
                  <div className="booking-card__route">
                    <strong>{booking.departure}</strong>
                    <span className="booking-card__arrow">→</span>
                    <strong>{booking.arrival}</strong>
                  </div>
                  <div className="booking-card__meta">
                    <span className="booking-card__date">
                      {formatDate(booking.pickup_date)} à {formatTime(booking.pickup_time)}
                    </span>
                    <span
                      className="booking-card__status"
                      style={{ '--status-color': status.color }}
                    >
                      <StatusIcon size={14} />
                      {status.label}
                    </span>
                    {booking.price && (
                      <span className="booking-card__price">{booking.price} €</span>
                    )}
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="booking-card__details">
                    <div className="booking-card__grid">
                      <div>
                        <label>Client</label>
                        <p>{booking.first_name} {booking.last_name}</p>
                      </div>
                      <div>
                        <label>Téléphone</label>
                        <p><a href={`tel:${booking.phone}`}>{booking.phone}</a></p>
                      </div>
                      <div>
                        <label>Email</label>
                        <p><a href={`mailto:${booking.email}`}>{booking.email}</a></p>
                      </div>
                      <div>
                        <label>Type</label>
                        <p>{booking.trip_type === 'roundtrip' ? 'Aller-retour' : 'Aller simple'}</p>
                      </div>
                      <div>
                        <label>Passagers</label>
                        <p>{booking.passengers}</p>
                      </div>
                      <div>
                        <label>Bagages</label>
                        <p>{booking.luggage}</p>
                      </div>
                      {booking.flight_number && (
                        <div>
                          <label>N° de vol</label>
                          <p>{booking.flight_number}</p>
                        </div>
                      )}
                      {booking.trip_type === 'roundtrip' && booking.return_date && (
                        <div>
                          <label>Retour</label>
                          <p>{formatDate(booking.return_date)} à {formatTime(booking.return_time)}</p>
                        </div>
                      )}
                      {booking.notes && (
                        <div className="booking-card__notes">
                          <label>Notes</label>
                          <p>{booking.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="booking-card__actions">
                      {booking.status === 'pending' && (
                        <div className="quote-form">
                          <input 
                            type="number" 
                            placeholder="Prix proposé (€)" 
                            className="form-input"
                            value={quotePrices[booking.id] || ''}
                            onChange={(e) => setQuotePrices({...quotePrices, [booking.id]: e.target.value})}
                          />
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              const priceValue = parseFloat(quotePrices[booking.id]);
                              if (isNaN(priceValue) || priceValue <= 0) return alert("Le prix doit être un nombre positif");
                              handleStatusUpdate(booking.id, 'quoted', priceValue);
                            }}
                            disabled={isUpdating || !quotePrices[booking.id]}
                          >
                            {isUpdating ? <Loader2 size={14} className="spin" /> : 'Envoyer le devis'}
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                            disabled={isUpdating}
                          >
                            <XCircle size={14} /> Annuler
                          </button>
                        </div>
                      )}
                      
                      {booking.status === 'quoted' && (
                        <span className="booking-card__final-status" style={{color: '#3b82f6'}}>
                          <CheckCircle size={14} /> En attente validation client ({booking.price} €)
                        </span>
                      )}

                      {booking.status === 'confirmed' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                          disabled={isUpdating}
                        >
                          {isUpdating ? <Loader2 size={14} className="spin" /> : <CheckCircle size={14} />}
                          Marquer terminé
                        </button>
                      )}
                      {(booking.status === 'completed' || booking.status === 'cancelled') && (
                        <span className="booking-card__final-status">
                          <StatusIcon size={14} />
                          {status.label}
                        </span>
                      )}

                      {/* Delete button — always visible */}
                      <button
                        className="btn btn-danger btn-sm booking-card__delete"
                        onClick={() => handleDelete(booking.id)}
                        disabled={isDeleting}
                        title="Supprimer"
                      >
                        {isDeleting ? <Loader2 size={14} className="spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
