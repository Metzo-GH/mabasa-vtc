import { useState, useEffect, useMemo } from 'react';
import {
  Mail, Phone, Clock, Loader2, AlertCircle, RefreshCw, Eye, 
  Search, Trash2, SortAsc, SortDesc, Filter, CheckCircle, 
  ChevronRight, User
} from 'lucide-react';
import { getContacts, markContactAsRead, deleteContact } from '../../services/contactService';
import './Admin.css';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  
  // States for search and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newer first
  const [filterUnread, setFilterUnread] = useState(false);

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

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      await deleteContact(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      console.error('Delete contact error:', err);
      alert('Erreur lors de la suppression.');
    }
  };

  // Logic for filtering and sorting
  const filteredContacts = useMemo(() => {
    let result = [...contacts];

    // Search
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(lowSearch) || 
        c.email.toLowerCase().includes(lowSearch) ||
        c.message.toLowerCase().includes(lowSearch)
      );
    }

    // Filter Unread
    if (filterUnread) {
      result = result.filter(c => !c.is_read);
    }

    // Sort by Date
    result.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [contacts, searchTerm, filterUnread, sortOrder]);

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
    <div className="admin-page admin-dark-theme">
      {/* Premium Header */}
      <div className="admin-page__header premium-header">
        <div>
          <h1 className="flex-center gap-2"><Mail size={28} /> Messagerie</h1>
          <span className="dash-subtitle">
            {unreadCount > 0 
              ? `${unreadCount} message${unreadCount > 1 ? 's' : ''} non lu${unreadCount > 1 ? 's' : ''}` 
              : 'Tous les messages sont traités'}
          </span>
        </div>
        
        <div className="dash-filters glass-panel">
          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <button 
            className={`btn btn-icon ${filterUnread ? 'btn-active' : ''}`}
            onClick={() => setFilterUnread(!filterUnread)}
            title="Messages non lus uniquement"
          >
            <Filter size={16} />
          </button>

          <button 
            className="btn btn-icon"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            title={sortOrder === 'desc' ? 'Plus récents en premier' : 'Plus anciens en premier'}
          >
            {sortOrder === 'desc' ? <SortDesc size={16} /> : <SortAsc size={16} />}
          </button>

          <button className="btn btn-icon btn-refresh" onClick={fetchContacts} title="Actualiser">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-error glass-panel"><AlertCircle size={16} /> {error}</div>
      )}

      {loading && !contacts.length && (
        <div className="admin-loading"><Loader2 size={32} className="spin" /></div>
      )}

      {!loading && filteredContacts.length === 0 && (
        <div className="admin-empty glass-panel animate-fade-in">
          <Mail size={48} strokeWidth={1} />
          <p>{searchTerm ? 'Aucun résultat pour votre recherche' : 'Aucun message pour le moment'}</p>
        </div>
      )}

      {!loading && contacts.length > 0 && (
        <div className="contacts-layout">
          {/* Main List */}
          <div className="contacts-list glass-panel scroll-custom">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`contact-item premium-item ${!contact.is_read ? 'contact-item--unread' : ''} ${selectedId === contact.id ? 'contact-item--selected' : ''}`}
                onClick={() => handleSelect(contact)}
              >
                <div className="contact-item__header">
                  <div className="contact-item__user">
                    <div className="avatar micro-avatar">{contact.name.charAt(0).toUpperCase()}</div>
                    <strong>{contact.name}</strong>
                  </div>
                  <span className="contact-item__date">{formatDate(contact.created_at)}</span>
                </div>
                <p className="contact-item__preview">
                  {contact.message.length > 60
                    ? `${contact.message.slice(0, 60)}...`
                    : contact.message}
                </p>
                <div className="contact-item__footer">
                   {!contact.is_read && <span className="badge-new">Nouveau</span>}
                   <button className="btn-delete-mini" onClick={(e) => handleDelete(e, contact.id)}>
                     <Trash2 size={14} />
                   </button>
                </div>
                {selectedId === contact.id && <ChevronRight size={18} className="selected-indicator" />}
              </div>
            ))}
          </div>

          {/* Detailed View */}
          <div className="contact-detail glass-panel animate-fade-in">
            {selected ? (
              <div className="detail-content">
                <div className="contact-detail__header-main">
                  <div className="detail-avatar">
                   <User size={32} />
                  </div>
                  <div className="detail-title">
                    <h2>{selected.name}</h2>
                    <span className="detail-date"><Clock size={12} /> {formatDate(selected.created_at)}</span>
                  </div>
                </div>

                <div className="contact-detail__meta">
                  <div className="meta-row">
                    <Mail size={16} /> 
                    <a href={`mailto:${selected.email}`} className="text-link">{selected.email}</a>
                  </div>
                  {selected.phone && (
                    <div className="meta-row">
                      <Phone size={16} /> 
                      <a href={`tel:${selected.phone}`} className="text-link">{selected.phone}</a>
                    </div>
                  )}
                </div>

                <div className="contact-detail__message-box">
                  <div className="message-label">Message</div>
                  <div className="message-text">
                    {selected.message}
                  </div>
                </div>

                <div className="detail-actions">
                  {selected.is_read && (
                    <span className="read-status"><CheckCircle size={14} /> Message consulté</span>
                  )}
                  <button className="btn btn-danger btn-sm flex-center gap-2" onClick={(e) => handleDelete(e, selected.id)}>
                    <Trash2 size={16} /> Supprimer le message
                  </button>
                </div>
              </div>
            ) : (
              <div className="contact-detail__empty">
                <Mail size={48} strokeWidth={1} className="floating-anim" />
                <p>Sélectionnez un message pour<br />afficher les détails</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
