import { useState, useEffect } from 'react';
import { 
  TrendingUp, CalendarCheck, Clock, BarChart3, 
  Loader2, AlertCircle, MapPin, RefreshCw 
} from 'lucide-react';
import { getBookingStats } from '../../services/bookingService';
import './Admin.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookingStats();
      setStats(data);
    } catch (err) {
      console.error('Stats fetch error:', err);
      setError('Impossible de charger les statistiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading"><Loader2 size={32} className="spin" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-error"><AlertCircle size={16} /> {error}</div>
      </div>
    );
  }

  const maxRevenue = Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Tableau de bord</h1>
          <span className="dash-subtitle">Vue d'ensemble de votre activité</span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchStats}>
          <RefreshCw size={16} /> Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      <div className="dash-cards">
        <div className="dash-card">
          <div className="dash-card__icon dash-card__icon--blue">
            <CalendarCheck size={22} />
          </div>
          <div className="dash-card__content">
            <span className="dash-card__label">Courses ce mois</span>
            <strong className="dash-card__value">{stats.thisMonthBookings}</strong>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__icon dash-card__icon--gold">
            <TrendingUp size={22} />
          </div>
          <div className="dash-card__content">
            <span className="dash-card__label">CA ce mois</span>
            <strong className="dash-card__value">{stats.revenueThisMonth.toFixed(0)} €</strong>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__icon dash-card__icon--orange">
            <Clock size={22} />
          </div>
          <div className="dash-card__content">
            <span className="dash-card__label">En attente</span>
            <strong className="dash-card__value">{stats.pending}</strong>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__icon dash-card__icon--green">
            <BarChart3 size={22} />
          </div>
          <div className="dash-card__content">
            <span className="dash-card__label">Taux de confirmation</span>
            <strong className="dash-card__value">{stats.conversionRate}%</strong>
          </div>
        </div>
      </div>

      {/* Charts Row */}
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

      {/* Global Stats */}
      <div className="dash-panel dash-panel--footer">
        <div className="dash-footer-stats">
          <div>
            <span>Total courses</span>
            <strong>{stats.totalBookings}</strong>
          </div>
          <div>
            <span>CA total</span>
            <strong>{stats.revenue.toFixed(0)} €</strong>
          </div>
          <div>
            <span>Confirmées</span>
            <strong>{stats.conversionRate}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
