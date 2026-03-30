import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { NAV_LINKS, ROUTES } from '../../config/routes';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link to={ROUTES.HOME} className="header__logo" aria-label="Accueil MABASA TAXI VTC">
          <span className="header__logo-text">{BRAND.name}</span>
          <span className="header__logo-sub">TAXI VTC</span>
        </Link>

        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          {NAV_LINKS.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`header__link ${location.pathname === path ? 'header__link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link to={ROUTES.BOOKING} className="btn btn-primary btn-sm header__cta">
            <Phone size={16} />
            Réserver
          </Link>
        </nav>

        <button
          className="header__burger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
