import { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle, XCircle, Clock, Filter,
  Loader2, AlertCircle, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';
import { getBookings, updateBookingStatus } from '../../services/bookingService';
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

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [quotePrices, setQuotePrices] = useState({});

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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    // Time comes as "HH:MM:SS" from Supabase, show "HH:MM"
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
        <button className="btn btn-secondary btn-sm" onClick={fetchBookings} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          Actualiser
        </button>
      </div>

      {/* Filters */}
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
      {!loading && !error && bookings.length === 0 && (
        <div className="admin-empty">
          <CalendarEmpty />
          <p>Aucune réservation {filter !== 'all' ? `"${STATUS_FILTERS.find(f => f.value === filter)?.label}"` : ''}</p>
        </div>
      )}

      {/* Booking cards */}
      {!loading && bookings.length > 0 && (
        <div className="booking-cards">
          {bookings.map(booking => {
            const status = STATUS_CONFIG[booking.status] || { label: booking.status, color: '#666', icon: Clock };
            const StatusIcon = status.icon;
            const isExpanded = expandedId === booking.id;
            const isUpdating = updatingId === booking.id;

            return (
              <div key={booking.id} className="booking-card">
                <div
                  className="booking-card__header"
                  onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                >
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
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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
