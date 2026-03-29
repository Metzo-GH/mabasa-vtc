import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { BRAND } from '../../config/brand';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form:', form);
    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      <div className="container">
        <div className="contact__header animate-fade-in-up">
          <span className="section-label">Contact</span>
          <h1>Contactez-<span className="text-accent">nous</span></h1>
          <p className="subtitle">
            Une question, un devis personnalisé ? N'hésitez pas à nous contacter,
            nous vous répondons dans les plus brefs délais.
          </p>
        </div>

        <div className="contact__grid">
          {/* Contact Info */}
          <div className="contact__info animate-fade-in-up animate-delay-1">
            <div className="contact__info-card">
              <div className="contact__info-item">
                <div className="contact__info-icon">
                  <Phone size={20} />
                </div>
                <div>
                  <h4>Téléphone</h4>
                  <p>{BRAND.phone}</p>
                </div>
              </div>

              <div className="contact__info-item">
                <div className="contact__info-icon">
                  <Mail size={20} />
                </div>
                <div>
                  <h4>Email</h4>
                  <p>{BRAND.email}</p>
                </div>
              </div>

              <div className="contact__info-item">
                <div className="contact__info-icon">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>{BRAND.whatsapp}</p>
                </div>
              </div>

              <div className="contact__info-item">
                <div className="contact__info-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4>Zone de service</h4>
                  <p>Hautes-Alpes, France</p>
                </div>
              </div>

              <div className="contact__info-item">
                <div className="contact__info-icon">
                  <Clock size={20} />
                </div>
                <div>
                  <h4>Disponibilité</h4>
                  <p>7 jours sur 7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact__form-wrap animate-fade-in-up animate-delay-2">
            {submitted ? (
              <div className="contact__success">
                <CheckCircle size={40} />
                <h3>Message envoyé !</h3>
                <p>Nous vous répondrons dans les plus brefs délais.</p>
                <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact__form">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Nom complet</label>
                  <input
                    type="text"
                    id="contact-name"
                    className="form-input"
                    placeholder="Votre nom"
                    required
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="contact__form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email</label>
                    <input
                      type="email"
                      id="contact-email"
                      className="form-input"
                      placeholder="exemple@email.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-phone">Téléphone</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      className="form-input"
                      placeholder="+33 6 XX XX XX XX"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    className="form-textarea"
                    placeholder="Votre message..."
                    required
                    value={form.message}
                    onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg">
                  <Send size={18} />
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
