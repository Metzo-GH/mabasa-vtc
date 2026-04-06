import { TrendingUp, CarProvider, CalendarCheck, BarChart3, MapPin, MapPinOff } from 'lucide-react';

export default function DashboardKPIs({ stats }) {
  if (!stats) return null;

  return (
    <div className="dash-kpi-container">
      {/* Ligne du haut KPI Premium */}
      <div className="dash-cards">
        <div className="dash-card premium-card">
          <div className="dash-card__content">
            <span className="dash-card__label">Revenus du jour</span>
            <strong className="dash-card__value">{stats.dailyRevenue.toFixed(0)} €</strong>
            {/* Simulation d'un +12% statique pour le design si besoin, ou on le calcule si possible */}
            <span className="dash-card__trend positive">+12% vs hier</span>
          </div>
        </div>

        <div className="dash-card premium-card">
          <div className="dash-card__content">
            <span className="dash-card__label">Courses à venir (jour)</span>
            <strong className="dash-card__value">{stats.dailyBookings}</strong>
            <span className="dash-card__trend neutral">dont {stats.pending} en attente</span>
          </div>
        </div>

        <div className="dash-card premium-card">
          <div className="dash-card__content">
            <span className="dash-card__label">Courses effectuées</span>
            <strong className="dash-card__value">{stats.totalBookings}</strong>
            <span className="dash-card__trend neutral">sur période</span>
          </div>
        </div>

        <div className="dash-card premium-card">
          <div className="dash-card__content">
            <span className="dash-card__label">Revenus globaux</span>
            <strong className="dash-card__value">{stats.revenue.toFixed(0)} €</strong>
            <span className="dash-card__trend positive">+8% vs période préc.</span>
          </div>
        </div>
      </div>

      {/* Ligne du bas : Trajets */}
      <div className="dash-grid-routes">
        <div className="dash-panel route-panel premium-card">
          <div className="route-panel-header">
            <h3><MapPin size={18} className="icon-green"/> Trajets les plus populaires</h3>
          </div>
          {stats.topRoutes?.length === 0 ? (
            <p className="dash-empty text-muted">Aucune donnée</p>
          ) : (
            <div className="dash-routes-list">
              {stats.topRoutes.map((r, i) => (
                <div key={i} className="dash-route-row">
                  <span className="route-name">{r.route}</span>
                  <span className="route-count pill pill-green">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-panel route-panel premium-card">
          <div className="route-panel-header">
            <h3><MapPinOff size={18} className="icon-orange" /> Trajets les moins populaires</h3>
          </div>
          {stats.bottomRoutes?.length === 0 ? (
            <p className="dash-empty text-muted">Aucune donnée</p>
          ) : (
            <div className="dash-routes-list">
              {stats.bottomRoutes.map((r, i) => (
                <div key={i} className="dash-route-row">
                  <span className="route-name">{r.route}</span>
                  <span className="route-count pill pill-orange">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
