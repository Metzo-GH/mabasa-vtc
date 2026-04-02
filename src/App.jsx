import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import Home from './features/landing/Home';
import Booking from './features/booking/Booking';
import Contact from './features/contact/Contact';
import QuotePage from './features/booking/QuotePage';
import Legal from './features/legal/Legal';
import AdminLogin from './features/admin/AdminLogin';
import AdminLayout from './features/admin/AdminLayout';
import Dashboard from './features/admin/Dashboard';
import BookingList from './features/admin/BookingList';
import ContactList from './features/admin/ContactList';
import { ROUTES } from './config/routes';
import ScrollToTop from './utils/ScrollToTop';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public pages — with Header & Footer */}
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.BOOKING} element={<Booking />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path={ROUTES.QUOTE} element={<QuotePage />} />
            <Route path={ROUTES.LEGAL} element={<Legal />} />
            <Route path={ROUTES.CGV} element={<Legal />} />
            <Route path="*" element={<Home />} />
          </Route>

          {/* Admin login — no Header/Footer */}
          <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

          {/* Admin dashboard — protected, own layout */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.ADMIN_BOOKINGS} element={<BookingList />} />
            <Route path={ROUTES.ADMIN_CONTACTS} element={<ContactList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
