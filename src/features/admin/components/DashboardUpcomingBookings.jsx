import { CalendarClock } from 'lucide-react';

export default function DashboardUpcomingBookings({ bookings }) {
  if (!bookings) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const upcoming = bookings
    .filter(b => b.pickup_date >= todayStr && b.status !== 'cancelled' && b.status !== 'completed')
    .sort((a, b) => {
      if (a.pickup_date === b.pickup_date) {
        return a.pickup_time.localeCompare(b.pickup_time);
      }
      return a.pickup_date.localeCompare(b.pickup_date);
    })
    .slice(0, 5);

  const getStatusPill = (status) => {
    switch (status) {
      case 'confirmed': return <span className="pill pill-green">Confirmé</span>;
      case 'pending': return <span className="pill pill-yellow">En attente</span>;
      case 'quoted': return <span className="pill pill-orange">Devis envoyé</span>;
      default: return <span className="pill">{status}</span>;
    }
  };

  return (
    <div className="dash-panel list-panel premium-card">
      <div className="panel-header">
        <h3><CalendarClock size={18} /> Réservations à venir</h3>
        <button className="text-link">Voir tout ↗</button>
      </div>

      <div className="list-items">
        {upcoming.length === 0 ? (
          <p className="dash-empty text-muted">Aucune réservation à venir</p>
        ) : (
          upcoming.map((b) => (
            <div key={b.id} className="list-item">
              <div className="item-time">
                {/* On recupere que HH:mm */}
                {b.pickup_time?.substring(0, 5) || 'N/A'}
              </div>
              <div className="item-details">
                <strong className="item-name">{b.first_name} {b.last_name}</strong>
                <span className="item-sub">
                  {b.departure?.split(',')[0]} → {b.arrival?.split(',')[0]}
                </span>
              </div>
              <div className="item-meta">
                <strong className="item-price">{b.price ? `${b.price} €` : '--'}</strong>
                {getStatusPill(b.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
