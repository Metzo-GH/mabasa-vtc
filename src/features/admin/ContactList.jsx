import { useState, useEffect } from 'react';
import {
  Mail, Phone, Clock, CheckCircle,
  Loader2, AlertCircle, RefreshCw, Eye
} from 'lucide-react';
import { getContacts, markContactAsRead } from '../../services/contactService';
import './Admin.css';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      console.error('Fetch contacts error:', err);
      setError('Impossible de charger les messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSelect = async (contact) => {
    setSelectedId(contact.id);
    if (!contact.is_read) {
      try {
        const updated = await markContactAsRead(contact.id);
        setContacts(prev =>
          prev.map(c => (c.id === contact.id ? updated : c))
        );
      } catch (err) {
        console.error('Mark as read error:', err);
      }
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = contacts.filter(c => !c.is_read).length;
  const selected = contacts.find(c => c.id === selectedId);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1>Messages</h1>
          {unreadCount > 0 && (
            <span className="admin-page__badge">{unreadCount} non lu{unreadCount > 1 ? 's' : ''}</span>
          )}
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchContacts} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          Actualiser
        </button>
      </div>

      {error && (
        <div className="admin-error">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading && (
        <div className="admin-loading">
          <Loader2 size={32} className="spin" />
        </div>
      )}

      {!loading && !error && contacts.length === 0 && (
        <div className="admin-empty">
          <Mail size={48} strokeWidth={1} />
          <p>Aucun message pour le moment</p>
        </div>
      )}

      {!loading && contacts.length > 0 && (
        <div className="contacts-layout">
          {/* Contact list */}
          <div className="contacts-list">
            {contacts.map(contact => (
              <div
                key={contact.id}
                className={`contact-item ${!contact.is_read ? 'contact-item--unread' : ''} ${selectedId === contact.id ? 'contact-item--selected' : ''}`}
                onClick={() => handleSelect(contact)}
              >
                <div className="contact-item__header">
                  <strong>{contact.name}</strong>
                  <span className="contact-item__date">{formatDate(contact.created_at)}</span>
                </div>
                <p className="contact-item__preview">
                  {contact.message.length > 80
                    ? `${contact.message.slice(0, 80)}...`
                    : contact.message}
                </p>
                {!contact.is_read && <div className="contact-item__dot" />}
              </div>
            ))}
          </div>

          {/* Message detail */}
          <div className="contact-detail">
            {selected ? (
              <>
                <div className="contact-detail__header">
                  <h2>{selected.name}</h2>
                  <span className="contact-detail__date">
                    <Clock size={14} />
                    {formatDate(selected.created_at)}
                  </span>
                </div>
                <div className="contact-detail__info">
                  <a href={`mailto:${selected.email}`}>
                    <Mail size={14} /> {selected.email}
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`}>
                      <Phone size={14} /> {selected.phone}
                    </a>
                  )}
                </div>
                <div className="contact-detail__message">
                  {selected.message}
                </div>
                {selected.is_read && (
                  <div className="contact-detail__read">
                    <Eye size={14} /> Lu
                  </div>
                )}
              </>
            ) : (
              <div className="contact-detail__empty">
                <Mail size={40} strokeWidth={1} />
                <p>Sélectionnez un message pour le lire</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
