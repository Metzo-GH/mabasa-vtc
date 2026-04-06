import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { ROUTES } from '../../config/routes';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-text">{BRAND.name}</span>
              <span className="footer__logo-sub">VTC/Taxi Premium</span>
            </div>
            <p className="footer__desc">{BRAND.description}</p>
          </div>

          {/* Navigation */}
          <div className="footer__col">
            <h4 className="footer__title">Navigation</h4>
            <Link to={ROUTES.HOME} className="footer__link">Accueil</Link>
            <Link to={ROUTES.BOOKING} className="footer__link">Réserver un trajet</Link>
            <Link to={ROUTES.CONTACT} className="footer__link">Contact</Link>
          </div>

          {/* Destinations */}
          <div className="footer__col">
            <h4 className="footer__title">Destinations</h4>
            <span className="footer__link">Courchevel</span>
            <span className="footer__link">Val Thorens</span>
            <span className="footer__link">Méribel</span>
            <span className="footer__link">Genève</span>
            <span className="footer__link">Lyon</span>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__title">Contact</h4>
            <div className="footer__contact-item">
              <Phone size={16} />
              <span>{BRAND.phone}</span>
            </div>
            <div className="footer__contact-item">
              <Mail size={16} />
              <span>{BRAND.email}</span>
            </div>
            <div className="footer__contact-item">
              <MapPin size={16} />
              <span>Hautes-Alpes, France</span>
            </div>
            <div className="footer__contact-item">
              <Clock size={16} />
              <span>Disponible 7j/7</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {currentYear} {BRAND.name}. Tous droits réservés.</p>
          <div className="footer__legal">
            <Link to={ROUTES.LEGAL}>Mentions légales</Link>
            <Link to={ROUTES.CGV}>CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
