import { Search, XCircle, Filter, Calendar } from 'lucide-react';

export const STATUS_FILTERS = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'quoted', label: 'Devis envoyé' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'completed', label: 'Terminées' },
  { value: 'cancelled', label: 'Annulées' },
];

const DATE_FILTERS = [
  { value: 'all', label: 'Tout' },
  { value: 'today', label: "Aujourd'hui" },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
];

export default function BookingFilters({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  serviceFilter = 'all',
  setServiceFilter,
  dateFilter,
  setDateFilter
}) {
  return (
    <>
      <div className="admin-search">
        <Search size={18} />
        <input
          type="text"
          placeholder="Rechercher par nom, email, téléphone, trajet..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-search__input"
        />
        {searchQuery && (
          <button className="admin-search__clear" onClick={() => setSearchQuery('')}>
            <XCircle size={16} />
          </button>
        )}
      </div>

      <div className="admin-filters-row">
        <div className="admin-filters">
          <Filter size={16} />
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              className={`admin-filter-btn ${filter === f.value ? 'admin-filter-btn--active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="admin-filters">
          <Calendar size={16} />
          {DATE_FILTERS.map(f => (
            <button
              key={f.value}
              className={`admin-filter-btn ${dateFilter === f.value ? 'admin-filter-btn--active' : ''}`}
              onClick={() => setDateFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Service Type Filter Row */}
      {setServiceFilter && (
        <div className="admin-filters-row" style={{ marginTop: '0.75rem' }}>
          <div className="admin-filters">
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginRight: 'var(--space-2)' }}>Activité :</span>
            {[
              { value: 'all', label: 'Tous' },
              { value: 'vtc', label: 'VTC' },
              { value: 'medical', label: 'Taxi Conventionné' },
            ].map(f => (
              <button
                key={f.value}
                className={`admin-filter-btn ${serviceFilter === f.value ? 'admin-filter-btn--active' : ''}`}
                onClick={() => setServiceFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
