import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuoteById, confirmQuote } from '../../services/bookingService';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import './QuotePage.css';

export default function QuotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const data = await getQuoteById(id);
        if (!data) {
          setError("Devis introuvable ou déjà confirmé/annulé.");
        } else {
          setQuote(data);
        }
      } catch (err) {
        console.error("Quote fetch error", err);
        setError("Impossible de charger le devis. Le lien est peut-être expiré.");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) fetchQuote();
  }, [id]);

  const handleConfirm = async () => {
    setConfirming(true);
    setError(null);
    try {
      await confirmQuote(id);
      setSuccess(true);
    } catch (err) {
      console.error("Confirmation error", err);
      setError("Une erreur est survenue lors de la confirmation. Veuillez nous contacter directement.");
    } finally {
      setConfirming(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="quote-container quote-loading">
        <Loader2 size={40} className="spin" color="#d4af37" />
        <p>Recherche de votre réservation...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="quote-container quote-success">
        <CheckCircle size={60} color="#10b981" />
        <h1>Réservation Confirmée !</h1>
        <p>Merci <strong>{quote?.first_name}</strong>. Votre trajet de <strong>{quote?.departure}</strong> vers <strong>{quote?.arrival}</strong> a bien été confirmé pour le prix de <strong>{quote?.price} €</strong>.</p>
        <p>Le chauffeur sera au point de rendez-vous à <strong>{quote?.pickup_time.slice(0, 5)}</strong>.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="quote-container">
      {error ? (
        <div className="quote-error">
          <AlertCircle size={40} color="#ef4444" />
          <h2>Lien invalide</h2>
          <p>{error}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      ) : (
        <div className="quote-card">
          <div className="quote-header">
            <h2>Votre Devis MABASA</h2>
            <p>Veuillez vérifier les informations de votre trajet et valider le tarif proposé par le chauffeur.</p>
          </div>
          
          <div className="quote-details">
            <div className="quote-route">
              <span className="quote-pill">{quote.trip_type === 'roundtrip' ? 'Aller-Retour' : 'Aller simple'}</span>
              <div className="quote-route-path">
                <strong>{quote.departure}</strong>
                <span>➔</span>
                <strong>{quote.arrival}</strong>
              </div>
            </div>
            
            <div className="quote-info-grid">
              <div className="quote-info-item">
                <span className="quote-label">Date :</span>
                <span className="quote-value">{formatDate(quote.pickup_date)}</span>
              </div>
              <div className="quote-info-item">
                <span className="quote-label">Heure :</span>
                <span className="quote-value">{quote.pickup_time.slice(0, 5)}</span>
              </div>
              <div className="quote-info-item">
                <span className="quote-label">Passager :</span>
                <span className="quote-value">{quote.first_name} {quote.last_name}</span>
              </div>
            </div>

            <div className="quote-price-box">
              <span>Tarif de la course</span>
              <strong>{quote.price} €</strong>
            </div>
          </div>

          <div className="quote-actions">
            <button className="btn btn-secondary" disabled={confirming} onClick={() => navigate('/')}>
              <ArrowLeft size={18} /> Annuler
            </button>
            <button className="btn btn-primary quote-confirm-btn" onClick={handleConfirm} disabled={confirming}>
              {confirming ? <Loader2 size={18} className="spin" /> : <CheckCircle size={18} />}
              Accepter pour {quote.price} €
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
