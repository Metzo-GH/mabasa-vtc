import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './features/landing/Home';
import Booking from './features/booking/Booking';
import Contact from './features/contact/Contact';
import Legal from './features/legal/Legal';
import { ROUTES } from './config/routes';
import ScrollToTop from './utils/ScrollToTop';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.BOOKING} element={<Booking />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.LEGAL} element={<Legal />} />
        <Route path={ROUTES.CGV} element={<Legal />} />
      </Routes>
      <Footer />
    </Router>
  );
}
