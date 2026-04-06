import { Link } from 'react-router-dom';
import {
  Plane, Mountain, Briefcase, Route, ArrowRight,
  CheckCircle, Shield, Clock, Star, ChevronRight,
  MapPin, Users, Calendar
} from 'lucide-react';
import { BRAND, SERVICES } from '../../config/brand';
import { ROUTES } from '../../config/routes';
import './Home.css';

const ICON_MAP = {
  Plane, Mountain, Briefcase, Route,
};

const STEPS = [
  {
    number: '01',
    title: 'Réservez en ligne',
    description: 'Remplissez le formulaire avec votre trajet, la date et l\'heure souhaitées.',
    icon: Calendar,
  },
  {
    number: '02',
    title: 'Confirmation rapide',
    description: 'Recevez une confirmation par email ou téléphone dans les plus brefs délais.',
    icon: CheckCircle,
  },
  {
    number: '03',
    title: 'Profitez du trajet',
    description: 'Votre chauffeur vous attend à l\'heure convenue pour un trajet confortable.',
    icon: MapPin,
  },
];

const FEATURES = [
  { icon: Shield, title: 'Véhicule assuré', desc: 'Tous nos véhicules sont assurés et régulièrement entretenus.' },
  { icon: Clock, title: 'Ponctualité garantie', desc: 'Nous assurons votre prise en charge à l\'heure, sans exception.' },
  { icon: Star, title: 'Service premium', desc: 'Un service sur-mesure, discret et professionnel à chaque trajet.' },
  { icon: Users, title: 'Jusqu\'à 7 passagers', desc: 'Des véhicules adaptés pour les familles et les groupes.' },
];

const TESTIMONIALS = [
  {
    name: 'Sophie L.',
    location: 'Paris → Courchevel',
    text: 'Service impeccable ! Le chauffeur était à l\'heure, le véhicule très confortable. Je recommande vivement pour les transferts vers les stations.',
    rating: 5,
  },
  {
    name: 'Marco R.',
    location: 'Genève → Val Thorens',
    text: 'Ponctuel, professionnel et très agréable. Le trajet depuis l\'aéroport de Genève s\'est parfaitement déroulé. Merci MABASA !',
    rating: 5,
  },
  {
    name: 'Claire D.',
    location: 'Lyon → Méribel',
    text: 'Nous avons réservé pour toute la famille. Le van était spacieux, les bagages et les skis bien rangés. Parfait !',
    rating: 5,
  },
];

export default function Home() {
  return (
    <main>
      {/* === HERO === */}
      <section className="hero" id="hero">
        <div className="hero__bg" />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <span className="section-label animate-fade-in-up">VTC/Taxi Premium • Hautes-Alpes</span>
          <h1 className="hero__title animate-fade-in-up animate-delay-1">
            Votre chauffeur privé<br />
            <span className="text-gradient">dans les Alpes</span>
          </h1>
          <p className="subtitle hero__subtitle animate-fade-in-up animate-delay-2">
            Transferts aéroport, gare et stations de ski. Courchevel, Val Thorens, Méribel,
            Genève — voyagez confortablement avec {BRAND.name}.
          </p>
          <div className="hero__actions animate-fade-in-up animate-delay-3">
            <Link to={ROUTES.BOOKING} className="btn btn-primary btn-lg">
              Réserver un trajet
              <ArrowRight size={20} />
            </Link>
            <Link to={ROUTES.CONTACT} className="btn btn-secondary btn-lg">
              Nous contacter
            </Link>
          </div>
          <div className="hero__badges animate-fade-in-up animate-delay-4">
            <div className="hero__badge">
              <CheckCircle size={16} />
              <span>Prix fixe, sans surprise</span>
            </div>
            <div className="hero__badge">
              <CheckCircle size={16} />
              <span>Disponible 7j/7</span>
            </div>
            <div className="hero__badge">
              <CheckCircle size={16} />
              <span>Annulation gratuite 24h</span>
            </div>
          </div>
        </div>
      </section>

      {/* === SERVICES === */}
      <section className="section services" id="services">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Nos Services</span>
            <h2>Un service adapté à<br /><span className="text-accent">chaque besoin</span></h2>
            <div className="divider" />
            <p className="subtitle">
              Des transferts aéroport aux déplacements professionnels, {BRAND.name} vous accompagne
              dans tous vos trajets alpins.
            </p>
          </div>
          <div className="services__grid">
            {SERVICES.map((service, index) => {
              const IconComponent = ICON_MAP[service.icon];
              return (
                <div key={service.id} className={`card services__card animate-fade-in-up animate-delay-${index + 1}`}>
                  <div className="services__icon">
                    {IconComponent && <IconComponent size={28} />}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <Link to={ROUTES.BOOKING} className="services__link">
                    Réserver <ChevronRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section className="section steps-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Comment ça marche</span>
            <h2>Réserver en<br /><span className="text-accent">3 étapes simples</span></h2>
            <div className="divider" />
          </div>
          <div className="steps__grid">
            {STEPS.map((step, index) => (
              <div key={step.number} className={`steps__item animate-fade-in-up animate-delay-${index + 1}`}>
                <div className="steps__number">{step.number}</div>
                <div className="steps__icon-wrap">
                  <step.icon size={24} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === FEATURES === */}
      <section className="section features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Pourquoi MABASA</span>
            <h2>Un service de<br /><span className="text-accent">confiance</span></h2>
            <div className="divider" />
          </div>
          <div className="features__grid">
            {FEATURES.map((feature, index) => (
              <div key={feature.title} className={`features__item animate-fade-in-up animate-delay-${index + 1}`}>
                <div className="features__icon">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === DESTINATIONS === */}
      <section className="section destinations" id="destinations">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Destinations populaires</span>
            <h2>Nos trajets les plus<br /><span className="text-accent">demandés</span></h2>
            <div className="divider" />
          </div>
          <div className="destinations__grid">
            {[
              { from: 'Aéroport de Genève', to: 'Courchevel', duration: '~2h30' },
              { from: 'Aéroport de Genève', to: 'Val Thorens', duration: '~2h45' },
              { from: 'Aéroport de Lyon', to: 'Courchevel', duration: '~3h' },
              { from: 'Gare de Moutiers', to: 'Courchevel', duration: '~30 min' },
              { from: 'Chambéry', to: 'Val Thorens', duration: '~1h45' },
              { from: 'Genève Centre', to: 'Méribel', duration: '~2h30' },
            ].map((route, index) => (
              <Link
                key={index}
                to={ROUTES.BOOKING}
                className={`card destinations__card animate-fade-in-up animate-delay-${(index % 4) + 1}`}
              >
                <div className="destinations__route">
                  <div className="destinations__point">
                    <div className="destinations__dot destinations__dot--from" />
                    <span>{route.from}</span>
                  </div>
                  <div className="destinations__line" />
                  <div className="destinations__point">
                    <div className="destinations__dot destinations__dot--to" />
                    <span>{route.to}</span>
                  </div>
                </div>
                <div className="destinations__duration">
                  <Clock size={14} />
                  {route.duration}
                </div>
                <ChevronRight size={18} className="destinations__arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section className="section testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Témoignages</span>
            <h2>Ce que disent<br /><span className="text-accent">nos clients</span></h2>
            <div className="divider" />
          </div>
          <div className="testimonials__grid">
            {TESTIMONIALS.map((t, index) => (
              <div key={index} className={`card testimonials__card animate-fade-in-up animate-delay-${index + 1}`}>
                <div className="testimonials__stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="var(--color-primary)" color="var(--color-primary)" />
                  ))}
                </div>
                <p className="testimonials__text">"{t.text}"</p>
                <div className="testimonials__author">
                  <div className="testimonials__avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA === */}
      <section className="section cta" id="cta">
        <div className="container">
          <div className="cta__inner">
            <div className="cta__glow" />
            <span className="section-label">Prêt à partir ?</span>
            <h2>Réservez votre<br /><span className="text-gradient">transfert maintenant</span></h2>
            <p className="subtitle" style={{ margin: '0 auto' }}>
              Prix fixe, confirmation rapide, et un service de qualité.<br />
              Votre chauffeur privé dans les Alpes vous attend.
            </p>
            <div className="cta__actions">
              <Link to={ROUTES.BOOKING} className="btn btn-primary btn-lg">
                Réserver un trajet
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
