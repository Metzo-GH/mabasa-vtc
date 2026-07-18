import { supabase } from '../lib/supabase';

/**
 * Service to manage global application settings (like active season mode).
 * Uses a fallback mechanism if the DB table settings doesn't exist yet.
 */

// Fallback logic based on current date:
// - Summer season (May 1st to Oct 31st) -> medical (Taxi Conventionné)
// - Winter season (Nov 1st to April 30th) -> vtc (VTC Premium)
const getDefaultModeBySeason = () => {
  const currentMonth = new Date().getMonth(); // 0-indexed (0 is Jan, 11 is Dec)
  // May (4) to October (9) is summer/medical
  if (currentMonth >= 4 && currentMonth <= 9) {
    return 'medical';
  }
  return 'vtc';
};

/**
 * Fetch the active site mode.
 * Returns 'vtc' or 'medical'.
 */
export async function getActiveMode() {
  try {
    // Check local storage fallback first in case we're offline or DB has no settings table
    const localFallback = localStorage.getItem('site_mode_fallback');
    
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'site_mode')
      .maybeSingle(); // maybeSingle doesn't throw 406 on no rows

    if (error) {
      if (localFallback) return localFallback;
      return getDefaultModeBySeason();
    }

    return data?.value || localFallback || getDefaultModeBySeason();
  } catch (err) {
    console.error('Error fetching site mode, using fallback:', err);
    const localFallback = localStorage.getItem('site_mode_fallback');
    return localFallback || getDefaultModeBySeason();
  }
}

/**
 * Update the active site mode.
 */
export async function updateActiveMode(mode) {
  if (mode !== 'vtc' && mode !== 'medical') {
    throw new Error('Invalid site mode. Must be "vtc" or "medical".');
  }

  // Update localStorage first for immediate local reactivity
  localStorage.setItem('site_mode_fallback', mode);

  try {
    const { data, error } = await supabase
      .from('settings')
      .upsert({
        key: 'site_mode',
        value: mode,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.warn('Failed to update settings in Supabase table (this is normal if table is not created yet):', error.message);
      return { fallback: true, mode };
    }

    return data;
  } catch (err) {
    console.error('Exception updating settings in Supabase:', err);
    return { fallback: true, mode };
  }
}

/**
 * Fetch a generic setting by key
 */
export async function getSetting(key, defaultValue = null) {
  try {
    const localFallback = localStorage.getItem(`setting_${key}`);
    
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      if (localFallback) return JSON.parse(localFallback);
      return defaultValue;
    }

    return data?.value || (localFallback ? JSON.parse(localFallback) : defaultValue);
  } catch (err) {
    console.error(`Error fetching setting ${key}, using fallback:`, err);
    const localFallback = localStorage.getItem(`setting_${key}`);
    return localFallback ? JSON.parse(localFallback) : defaultValue;
  }
}

/**
 * Update a generic setting by key
 */
export async function updateSetting(key, value) {
  // Update localStorage first for immediate local reactivity
  localStorage.setItem(`setting_${key}`, JSON.stringify(value));

  try {
    const { data, error } = await supabase
      .from('settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.warn(`Failed to update setting ${key} in Supabase table:`, error.message);
      return { fallback: true, value };
    }

    return data;
  } catch (err) {
    console.error(`Exception updating setting ${key} in Supabase:`, err);
    return { fallback: true, value };
  }
}
