import { createContext, useContext, useState, useEffect } from 'react';
import { getActiveMode, updateActiveMode as saveActiveMode } from '../services/settingsService';
import { updateSEOMetadata } from '../utils/seoMetadata';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState('vtc'); // Default fallback
  const [loading, setLoading] = useState(true);

  // Sync mode with document.body class and SEO meta tags
  const applyTheme = (targetMode) => {
    const body = document.body;
    if (targetMode === 'medical') {
      body.classList.remove('theme-vtc');
      body.classList.add('theme-medical');
    } else {
      body.classList.remove('theme-medical');
      body.classList.add('theme-vtc');
    }
    updateSEOMetadata(targetMode);
  };

  useEffect(() => {
    async function loadMode() {
      try {
        const activeMode = await getActiveMode();
        setModeState(activeMode);
        applyTheme(activeMode);
      } catch (err) {
        console.error('Failed to load active site mode:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMode();
  }, []);

  const setMode = async (newMode) => {
    setModeState(newMode);
    applyTheme(newMode);
    try {
      await saveActiveMode(newMode);
    } catch (err) {
      console.error('Failed to save active site mode:', err);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
