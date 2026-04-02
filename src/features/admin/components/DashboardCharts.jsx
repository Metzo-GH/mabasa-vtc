import { BarChart3, MapPin } from 'lucide-react';

export default function DashboardCharts({ stats }) {
  const maxRevenue = Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1);

  return (
    <div className="dash-grid">
      {/* Revenue Chart */}
      <div className="dash-panel">
        <h3><BarChart3 size={18} /> Revenus — 6 derniers mois</h3>
        <div className="dash-chart">
          {stats.monthlyRevenue.map((m, i) => (
            <div key={i} className="dash-bar-col">
              <span className="dash-bar-value">{m.revenue > 0 ? `${m.revenue.toFixed(0)}€` : ''}</span>
              <div 
                className="dash-bar" 
                style={{ height: `${Math.max((m.revenue / maxRevenue) * 100, 4)}%` }}
              />
              <span className="dash-bar-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Routes */}
      <div className="dash-panel">
        <h3><MapPin size={18} /> Trajets les plus demandés</h3>
        {stats.topRoutes.length === 0 ? (
          <p className="dash-empty">Aucune donnée encore</p>
        ) : (
          <div className="dash-routes">
            {stats.topRoutes.map((r, i) => (
              <div key={i} className="dash-route-item">
                <span className="dash-route-rank">#{i + 1}</span>
                <span className="dash-route-name">{r.route}</span>
                <span className="dash-route-count">{r.count} course{r.count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
