import { TrendingUp, CalendarCheck, Clock, BarChart3 } from 'lucide-react';

export default function DashboardKPIs({ stats }) {
  return (
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
  );
}
