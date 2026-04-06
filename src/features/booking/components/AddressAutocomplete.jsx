import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Search } from 'lucide-react';

const GENEVA_DATABASE = [
  { label: 'Aéroport de Genève (GVA)', city: 'Genève', postcode: '1215', context: 'Genève (Suisse)' },
  { label: 'Gare de Genève-Cornavin', city: 'Genève', postcode: '1201', context: 'Genève (Suisse)' },
  { label: 'Genève Centre-Ville', city: 'Genève', postcode: '1200', context: 'Genève (Suisse)' },
  { label: 'Palexpo, Genève', city: 'Grand-Saconnex', postcode: '1218', context: 'Genève (Suisse)' },
  { label: 'Carouge, Genève', city: 'Carouge', postcode: '1227', context: 'Genève (Suisse)' },
  { label: 'Lancy, Genève', city: 'Lancy', postcode: '1212', context: 'Genève (Suisse)' },
  { label: 'Meyrin, Genève', city: 'Meyrin', postcode: '1217', context: 'Genève (Suisse)' },
  { label: 'Thônex, Genève', city: 'Thônex', postcode: '1226', context: 'Genève (Suisse)' },
  { label: 'Versoix, Genève', city: 'Versoix', postcode: '1290', context: 'Genève (Suisse)' },
  { label: 'Vésenaz, Genève', city: 'Vésenaz', postcode: '1222', context: 'Genève (Suisse)' },
];

/**
 * AddressAutocomplete component for professional address selection.
 * Uses French BAN API + Hardcoded Geneva data.
 */
export default function AddressAutocomplete({ 
  id, 
  label, 
  value, 
  onChange, 
  error, 
  placeholder = "Commencez à saisir..." 
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Sync with value prop if it changes externally
  useEffect(() => {
    if (value !== query) {
      setQuery(value || '');
    }
  }, [value]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Check Geneva hardcoded first
      const genevaMatches = GENEVA_DATABASE.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // 2. Fetch from BAN API (France)
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      
      const apiMatches = data.features.map(f => ({
        label: f.properties.label,
        city: f.properties.city,
        postcode: f.properties.postcode,
        context: f.properties.context, // Contains dept number
        type: f.properties.type
      }));

      setSuggestions([...genevaMatches, ...apiMatches]);
      setIsOpen(true);
    } catch (err) {
      console.error('BAN API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query && query !== value) {
        fetchSuggestions(query);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.label);
    setIsOpen(false);
    // Send structured data back to parent
    onChange({
      label: item.label,
      city: item.city,
      postcode: item.postcode,
      context: item.context
    });
  };

  return (
    <div className="form-group autocomplete-container" ref={dropdownRef}>
      <label className="form-label" htmlFor={id}>
        <MapPin size={14} /> {label}
      </label>
      
      <div className="autocomplete-input-wrapper">
        <input
          type="text"
          id={id}
          autoComplete="off"
          className={`form-input ${error ? 'form-input--error' : ''}`}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setIsOpen(true)}
        />
        {isLoading && <Loader2 size={16} className="autocomplete-loader spin" />}
        {!isLoading && <Search size={16} className="autocomplete-icon" />}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="autocomplete-dropdown animate-fade-in">
          {suggestions.map((item, index) => (
            <li key={index} className="autocomplete-item" onClick={() => handleSelect(item)}>
              <div className="autocomplete-item-icon">
                <MapPin size={16} />
              </div>
              <div className="autocomplete-item-info">
                <span className="autocomplete-item-label">{item.label}</span>
                <span className="autocomplete-item-context">{item.context}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && <span className="form-error"><MapPin size={12} /> {error}</span>}
    </div>
  );
}
