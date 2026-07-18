import { createContext, useContext, useState, useEffect } from 'react';
import { getSetting, updateSetting } from '../services/settingsService';
import { BRAND } from '../config/brand';

const SiteContext = createContext();

export function SiteProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(BRAND);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const contactInfo = await getSetting('contact_info', BRAND);
        // Fusion des clés par défaut avec la base pour le Self-Healing
        setSiteSettings({ ...BRAND, ...contactInfo }); 
      } catch (err) {
        console.error('Failed to load site settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const saveSettings = async (newSettings) => {
    const updated = { ...siteSettings, ...newSettings };
    setSiteSettings(updated);
    try {
      await updateSetting('contact_info', updated);
    } catch (err) {
      console.error('Failed to save site settings:', err);
    }
  };

  return (
    <SiteContext.Provider value={{ siteSettings, saveSettings, loading }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteProvider');
  }
  return context;
}
