import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  CalendarCheck, MessageSquare, LogOut, Menu, X, ChevronLeft, LayoutDashboard
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import './Admin.css';

const ADMIN_NAV = [
  { label: 'Tableau de bord', path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: 'Réservations', path: ROUTES.ADMIN_BOOKINGS, icon: CalendarCheck },
  { label: 'Messages', path: ROUTES.ADMIN_CONTACTS, icon: MessageSquare },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  };

  return (
    <div className="admin">
      {/* Mobile toggle */}
      <button
        className="admin__mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`admin__sidebar ${sidebarOpen ? 'admin__sidebar--open' : ''}`}>
        <div className="admin__sidebar-header">
          <h2>MABASA</h2>
          <span>Dashboard</span>
        </div>

        <nav className="admin__nav">
          {ADMIN_NAV.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `admin__nav-link ${isActive ? 'admin__nav-link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin__sidebar-footer">
          <NavLink to={ROUTES.HOME} className="admin__nav-link admin__back-link">
            <ChevronLeft size={18} />
            Retour au site
          </NavLink>
          <button className="admin__nav-link admin__logout" onClick={handleSignOut}>
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="admin__overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="admin__content">
        <Outlet />
      </main>
    </div>
  );
}
