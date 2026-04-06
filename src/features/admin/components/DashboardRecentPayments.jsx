import { Wallet } from 'lucide-react';

export default function DashboardRecentPayments({ bookings }) {
  if (!bookings) return null;

  // Récupérer les 5 derniers paiements (status = confirmed ou completed) avec un prix
  const recent = bookings
    .filter(b => (b.status === 'confirmed' || b.status === 'completed') && b.price)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    
    // Si c'est aujourd'hui
    if (date.toDateString() === today.toDateString()) {
      return `Auj. ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Hier
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Autre
    return `${date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="dash-panel list-panel premium-card">
      <div className="panel-header">
        <h3><Wallet size={18} /> Derniers paiements</h3>
        <button className="text-link">Voir tout ↗</button>
      </div>

      <div className="list-items">
        {recent.length === 0 ? (
          <p className="dash-empty text-muted">Aucun paiement récent</p>
        ) : (
          recent.map((b) => (
            <div key={b.id} className="list-item">
              <div className="avatar circle-avatar">
                {getInitials(b.first_name, b.last_name)}
              </div>
              <div className="item-details">
                <strong className="item-name">{b.first_name?.charAt(0)}. {b.last_name}</strong>
                <span className="item-sub text-muted">
                  {formatDate(b.created_at)}
                </span>
              </div>
              <div className="item-meta">
                <strong className="item-price text-green">+{b.price} €</strong>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
