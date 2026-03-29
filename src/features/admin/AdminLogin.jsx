import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import './Admin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  if (user) {
    navigate(ROUTES.ADMIN_BOOKINGS, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate(ROUTES.ADMIN_BOOKINGS, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError('Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <div className="admin-login__icon">
            <Lock size={24} />
          </div>
          <h1>Espace Chauffeur</h1>
          <p>Connectez-vous pour gérer vos réservations</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">
              <Mail size={14} /> Email
            </label>
            <input
              type="email"
              id="admin-email"
              className="form-input"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              <Lock size={14} /> Mot de passe
            </label>
            <input
              type="password"
              id="admin-password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="admin-login__error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? (
              <><Loader2 size={18} className="spin" /> Connexion...</>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
