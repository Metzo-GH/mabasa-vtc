import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { ROUTES } from '../../config/routes';
import { useTheme } from '../../context/ThemeContext';
import { useSiteSettings } from '../../context/SiteContext';
import './Footer.css';

export default function Footer() {
  const { mode } = useTheme();
  const { siteSettings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  const isMedical = mode === 'medical';
  const description = isMedical
    ? 'Taxi conventionné agréé CPAM à Arles et ses environs. Transport assis personnalisé vers hôpitaux, cliniques et consultations médicales.'
    : siteSettings.description;

  const destinations = isMedical
    ? ['Arles', 'Nîmes', 'Avignon', 'Marseille', 'Montpellier']
    : ['Courchevel', 'Val Thorens', 'Méribel', 'Genève', 'Lyon'];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-text">{siteSettings.name}</span>
              <span className="footer__logo-sub">
                {isMedical ? 'Taxi Conventionné' : 'VTC/Taxi Premium'}
              </span>
            </div>
            <p className="footer__desc">{description}</p>
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
            {destinations.map((dest) => (
              <span key={dest} className="footer__link">{dest}</span>
            ))}
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__title">Contact</h4>
            <div className="footer__contact-item">
              <Phone size={16} />
              <span>{siteSettings.phone}</span>
            </div>
            <div className="footer__contact-item">
              <Mail size={16} />
              <span>{siteSettings.email}</span>
            </div>
            <div className="footer__contact-item">
              <MapPin size={16} />
              <span>{isMedical ? 'Arles, France' : 'Hautes-Alpes, France'}</span>
            </div>
            <div className="footer__contact-item">
              <Clock size={16} />
              <span>Disponible 7j/7</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {currentYear} {siteSettings.name}. Tous droits réservés.</p>
          <div className="footer__legal">
            <Link to={ROUTES.LEGAL}>Mentions légales</Link>
            <Link to={ROUTES.CGV}>CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
