import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useSiteSettings } from '../../context/SiteContext';
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Database, Save, Phone, Mail, MessageCircle } from 'lucide-react';
import './Admin.css';

export default function SettingsPanel() {
  const { mode, setMode } = useTheme();
  const { siteSettings, saveSettings } = useSiteSettings();

  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);
  const [successContactMsg, setSuccessContactMsg] = useState('');
  
  const [showSql, setShowSql] = useState(false);

  const [contactForm, setContactForm] = useState({
    phone: '',
    email: '',
    whatsapp: ''
  });

  useEffect(() => {
    if (siteSettings) {
      setContactForm({
        phone: siteSettings.phone || '',
        email: siteSettings.email || '',
        whatsapp: siteSettings.whatsapp || ''
      });
    }
  }, [siteSettings]);

  const handleModeChange = async (targetMode) => {
    if (mode === targetMode) return;
    setIsUpdating(true);
    setSuccessMsg('');
    try {
      await setMode(targetMode);
      setSuccessMsg(`Le site a été basculé avec succès en mode ${targetMode === 'medical' ? 'Été (Taxi Conventionné)' : 'Hiver (VTC Premium)'} !`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error updating site mode:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingContact(true);
    setSuccessContactMsg('');
    try {
      await saveSettings(contactForm);
      setSuccessContactMsg('Les informations de contact ont été mises à jour avec succès !');
      setTimeout(() => setSuccessContactMsg(''), 4000);
    } catch (err) {
      console.error('Error updating contact settings:', err);
    } finally {
      setIsUpdatingContact(false);
    }
  };

  const sqlMigration = `-- 1. CRÉER LA TABLE DE CONFIGURATION
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. INITIALISER LE MODE PAR DÉFAUT
INSERT INTO settings (key, value) VALUES ('site_mode', '"medical"') 
ON CONFLICT (key) DO NOTHING;

-- 3. AJOUTER LES COLONNES MÉDICALES DANS LES RÉSERVATIONS
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service_type TEXT DEFAULT 'vtc';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS secu_number TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS caisse_affiliation TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS prescription_medicale BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS medical_motif TEXT;`;

  return (
    <div className="admin-page admin-dark-theme">
      {/* Header */}
      <div className="admin-page__header premium-header">
        <div>
          <h1>Configuration du Site</h1>
          <span className="dash-subtitle">Gérez la saisonnalité et les informations publiques du site</span>
        </div>
      </div>

      {/* SECTION 1: THEME & MODE */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-4)', color: 'var(--color-text)' }}>Saison et Mode (Thème visuel)</h2>

      {/* Success Alert Mode */}
      {successMsg && (
        <div className="glass-panel alert-success animate-fade-in-up" style={{ margin: '0 0 var(--space-6) 0', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Info Warning */}
      <div className="glass-panel alert-warning animate-fade-in-up" style={{ margin: '0 0 var(--space-6) 0', padding: 'var(--space-4)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}>
        <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Attention administrative :</strong> Ce réglage modifie instantanément le site public pour tous les visiteurs.
          Le design global (Or VTC vs Bleu Médical), la page d'accueil (Arles vs Stations de ski) et le formulaire de réservation s'adapteront immédiatement au mode choisi pour éviter toute réservation hors-saison.
        </div>
      </div>

      {/* Grid Modes */}
      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        
        {/* VTC Card */}
        <div 
          className={`card config-card ${mode === 'vtc' ? 'config-card--active' : ''}`}
          onClick={() => !isUpdating && handleModeChange('vtc')}
          style={{ 
            cursor: 'pointer',
            borderWidth: '2px',
            borderColor: mode === 'vtc' ? '#C9A84C' : 'var(--color-border)',
            position: 'relative'
          }}
        >
          <div className="config-card__badge" style={{ position: 'absolute', top: '12px', right: '12px', background: '#C9A84C', color: '#0A0A0F', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', display: mode === 'vtc' ? 'block' : 'none' }}>
            ACTIF
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{ background: 'rgba(201, 168, 76, 0.1)', color: '#C9A84C', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-body)' }}>Hiver : VTC Premium</h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Alpes & stations de ski</span>
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
            Active le service premium de transferts gares, aéroports et stations de ski. 
            Thème couleur **Or / Sombre**. Formulaire de réservation axé sur le nombre de bagages, 
            les numéros de vols et les stations de montagne (Courchevel, Genève).
          </p>
        </div>

        {/* Taxi Conventionné Card */}
        <div 
          className={`card config-card ${mode === 'medical' ? 'config-card--active' : ''}`}
          onClick={() => !isUpdating && handleModeChange('medical')}
          style={{ 
            cursor: 'pointer',
            borderWidth: '2px',
            borderColor: mode === 'medical' ? '#0EA5E9' : 'var(--color-border)',
            position: 'relative'
          }}
        >
          <div className="config-card__badge" style={{ position: 'absolute', top: '12px', right: '12px', background: '#0EA5E9', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', display: mode === 'medical' ? 'block' : 'none' }}>
            ACTIF
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9', width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-body)' }}>Été : Taxi Conventionné</h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Région Arles (13, 30, 84)</span>
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
            Active le service médical conventionné CPAM. Thème couleur **Bleu Médical**. 
            Formulaire de réservation adapté aux impératifs de santé avec saisie optionnelle du 
            numéro de Sécurité Sociale, de la Caisse d'affiliation, et du motif de transport médical.
          </p>
        </div>

      </div>

      {/* SECTION 2: CONTACT SETTINGS */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-4)', color: 'var(--color-text)' }}>Informations de Contact</h2>
      
      {/* Success Alert Contact */}
      {successContactMsg && (
        <div className="glass-panel alert-success animate-fade-in-up" style={{ margin: '0 0 var(--space-6) 0', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
          <CheckCircle2 size={20} />
          <span>{successContactMsg}</span>
        </div>
      )}

      <form onSubmit={handleContactSubmit} className="glass-panel" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Phone size={16} /> Numéro de téléphone
            </label>
            <input 
              type="text" 
              className="form-input" 
              value={contactForm.phone}
              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
              placeholder="+33 6 12 34 56 78"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Mail size={16} /> Adresse Email
            </label>
            <input 
              type="email" 
              className="form-input" 
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              placeholder="contact@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MessageCircle size={16} /> Numéro WhatsApp (sans espace)
            </label>
            <input 
              type="text" 
              className="form-input" 
              value={contactForm.whatsapp}
              onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
              placeholder="+33612345678"
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={isUpdatingContact} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Save size={18} />
            {isUpdatingContact ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>


      {/* SQL Migration Assistant */}
      <div className="glass-panel" style={{ padding: 'var(--space-6)', borderColor: 'var(--color-border)' }}>
        <button 
          onClick={() => setShowSql(!showSql)}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <Database size={16} />
          {showSql ? "Masquer les détails de la base de données" : "Voir les instructions de la base de données (SQL)"}
        </button>

        {showSql && (
          <div className="animate-fade-in-up" style={{ marginTop: 'var(--space-4)' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
              Si vous déployez sur une nouvelle base Supabase, exécutez ce script SQL dans votre éditeur SQL Supabase pour ajouter les tables et colonnes requises :
            </p>
            <pre style={{ 
              background: '#050508', 
              padding: 'var(--space-4)', 
              borderRadius: 'var(--radius-md)', 
              color: '#4ADE80', 
              fontSize: '12px',
              fontFamily: 'monospace',
              overflowX: 'auto',
              border: '1px solid var(--color-border)'
            }}>
              {sqlMigration}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
