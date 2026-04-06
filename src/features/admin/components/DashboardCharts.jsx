import { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

export default function DashboardCharts({ stats }) {
  const [viewType, setViewType] = useState('journalier'); // 'journalier', 'mensuel', 'annuel'

  const chartData = useMemo(() => {
    if (!stats || !stats.rawBookings) return [];
    
    // Pour calculer le graphe on groupe les revenus
    const groups = {};

    stats.rawBookings.forEach(b => {
      // On compte que les confirmés ou complétés qui ont un prix
      const isConfirmed = b.status === 'confirmed' || b.status === 'completed';
      if (!isConfirmed || !b.price || !b.pickup_date) return;

      const dateObj = new Date(b.pickup_date);
      let key = '';
      let label = '';

      if (viewType === 'journalier') {
        key = dateObj.toISOString().split('T')[0];
        label = dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      } else if (viewType === 'mensuel') {
        key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
        label = dateObj.toLocaleDateString('fr-FR', { month: 'short' });
      } else if (viewType === 'annuel') {
        key = String(dateObj.getFullYear());
        label = key;
      }

      if (!groups[key]) {
        groups[key] = { label, revenue: 0, dateNum: dateObj.getTime() };
      }
      groups[key].revenue += Number(b.price);
    });

    // Convert object to array and sort by date chronologically
    const sortedArray = Object.values(groups).sort((a, b) => a.dateNum - b.dateNum);
    return sortedArray.slice(-14); // Afficher max 14 barres (ex: 14 jours, 12 mois, etc)
  }, [stats, viewType]);

  const maxRevenue = Math.max(...chartData.map(m => m.revenue), 1);

  return (
    <div className="dash-panel premium-card chart-panel">
      <div className="chart-header">
        <h3><BarChart3 size={18} className="icon-purple" /> Évolution des gains</h3>
        
        <div className="chart-toggles glass-panel">
          <button 
            className={`filter-btn ${viewType === 'journalier' ? 'active' : ''}`}
            onClick={() => setViewType('journalier')}
          >
            Journalier
          </button>
          <button 
            className={`filter-btn ${viewType === 'mensuel' ? 'active' : ''}`}
            onClick={() => setViewType('mensuel')}
          >
            Mensuel
          </button>
          <button 
            className={`filter-btn ${viewType === 'annuel' ? 'active' : ''}`}
            onClick={() => setViewType('annuel')}
          >
            Annuel
          </button>
        </div>
      </div>

      <div className="dash-chart">
        {chartData.length === 0 ? (
          <p className="dash-empty text-muted">Ajustez le filtre pour voir les revenus</p>
        ) : (
          chartData.map((m, i) => {
            // Surligner la derniere barre en orange comme pour "Aujourd'hui"
            const isLast = i === chartData.length - 1;
            return (
              <div key={i} className="dash-bar-col">
                <span className="dash-bar-value">{m.revenue > 0 ? `${m.revenue.toFixed(0)}€` : ''}</span>
                <div 
                  className={`dash-bar ${isLast ? 'bar-accent' : 'bar-primary'}`} 
                  style={{ height: `${Math.max((m.revenue / maxRevenue) * 100, 4)}%` }}
                />
                <span className="dash-bar-label">{m.label}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
