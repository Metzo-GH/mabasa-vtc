import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getBookingStats } from '../../services/bookingService';
import DashboardKPIs from './components/DashboardKPIs';
import DashboardCharts from './components/DashboardCharts';
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

      <DashboardKPIs stats={stats} />
      <DashboardCharts stats={stats} />

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
