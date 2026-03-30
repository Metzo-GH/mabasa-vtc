import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './features/landing/Home';
import Booking from './features/booking/Booking';
import Contact from './features/contact/Contact';
import QuotePage from './features/booking/QuotePage';
import Legal from './features/legal/Legal';
import AdminLogin from './features/admin/AdminLogin';
import AdminLayout from './features/admin/AdminLayout';
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
          <Route
            path={ROUTES.HOME}
            element={<><Header /><Home /><Footer /></>}
          />
          <Route
            path={ROUTES.BOOKING}
            element={<><Header /><Booking /><Footer /></>}
          />
          <Route
            path={ROUTES.CONTACT}
            element={<><Header /><Contact /><Footer /></>}
          />
          <Route
            path={ROUTES.QUOTE}
            element={<><Header /><QuotePage /><Footer /></>}
          />
          <Route
            path={ROUTES.LEGAL}
            element={<><Header /><Legal /><Footer /></>}
          />
          <Route
            path={ROUTES.CGV}
            element={<><Header /><Legal /><Footer /></>}
          />
          <Route path="*" element={<><Header /><Home /><Footer /></>} />

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
            <Route path={ROUTES.ADMIN_BOOKINGS} element={<BookingList />} />
            <Route path={ROUTES.ADMIN_CONTACTS} element={<ContactList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
