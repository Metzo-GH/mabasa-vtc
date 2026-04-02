import { useState } from 'react';
import { Loader2, CheckCircle, XCircle, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

export default function BookingCard({
  booking,
  status,
  isExpanded,
  isUpdating,
  isDeleting,
  isSelected,
  onToggleExpand,
  onSelect,
  onStatusUpdate,
  onDelete
}) {
  const [quotePrice, setQuotePrice] = useState('');
  const StatusIcon = status.icon;

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

  return (
    <div className={`booking-card ${isDeleting ? 'booking-card--deleting' : ''}`}>
      <div className="booking-card__header" onClick={onToggleExpand}>
        <label className="booking-card__select" onClick={e => e.stopPropagation()}>
          <input 
            type="checkbox" 
            className="admin-checkbox"
            checked={isSelected}
            onChange={e => onSelect(e.target.checked)}
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
          <span className="booking-card__status" style={{ '--status-color': status.color }}>
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
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const priceValue = parseFloat(quotePrice);
                    if (isNaN(priceValue) || priceValue <= 0) return alert("Le prix doit être un nombre positif");
                    onStatusUpdate('quoted', priceValue);
                  }}
                  disabled={isUpdating || !quotePrice}
                >
                  {isUpdating ? <Loader2 size={14} className="spin" /> : 'Envoyer le devis'}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onStatusUpdate('cancelled')}
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
                onClick={() => onStatusUpdate('completed')}
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
              onClick={onDelete}
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
}
