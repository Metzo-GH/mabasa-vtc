import { useState } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import useDashboardStats from './hooks/useDashboardStats';
import DashboardKPIs from './components/DashboardKPIs';
import DashboardCharts from './components/DashboardCharts';
import DashboardUpcomingBookings from './components/DashboardUpcomingBookings';
import DashboardRecentPayments from './components/DashboardRecentPayments';
import './Admin.css';

export default function Dashboard() {
  const today = new Date();
  const currentMonthStr = String(today.getMonth() + 1).padStart(2, '0');
  const currentYearStr = String(today.getFullYear());

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState(currentYearStr);

  const { bookings, stats, loading, error, refetch } = useDashboardStats(selectedMonth, selectedYear);

  if (loading && !stats) {
    return (
      <div className="admin-page admin-dark-theme">
        <div className="admin-loading"><Loader2 size={32} className="spin" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page admin-dark-theme">
        <div className="admin-error"><AlertCircle size={16} /> {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-dark-theme">
      {/* Header Premium */}
      <div className="admin-page__header premium-header">
        <div>
          <h1>Bonjour,</h1>
          <span className="dash-subtitle">
            {today.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        
        {/* Filtres de temps */}
        <div className="dash-filters glass-panel">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les mois</option>
            <option value="01">Janvier</option>
            <option value="02">Février</option>
            <option value="03">Mars</option>
            <option value="04">Avril</option>
            <option value="05">Mai</option>
            <option value="06">Juin</option>
            <option value="07">Juillet</option>
            <option value="08">Août</option>
            <option value="09">Septembre</option>
            <option value="10">Octobre</option>
            <option value="11">Novembre</option>
            <option value="12">Décembre</option>
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les années</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>

          <button className="btn btn-icon btn-refresh" onClick={refetch} title="Actualiser">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <DashboardKPIs stats={stats} />
      
      {/* Listes récentes */}
      <div className="dash-grid-lists">
        <DashboardUpcomingBookings bookings={stats?.rawBookings} />
        <DashboardRecentPayments bookings={stats?.rawBookings} />
      </div>

      {/* Graphiques */}
      <DashboardCharts stats={stats} />
    </div>
  );
}
