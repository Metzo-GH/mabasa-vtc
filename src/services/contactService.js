import { supabase } from '../lib/supabase';

/**
 * Contact service — handles all Supabase operations for contact messages.
 */

/**
 * Create a new contact message (public — no auth required).
 */
export async function createContact(formData) {
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      message: formData.message,
    })

  if (error) throw error;
  return data;
}

/**
 * Fetch all contact messages (admin only — requires auth).
 * Unread messages first, then sorted by date.
 */
export async function getContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('is_read', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Mark a contact message as read (admin only).
 */
export async function markContactAsRead(id) {
  const { data, error } = await supabase
    .from('contacts')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
/**
 * Delete a contact message (admin only).
 */
export async function deleteContact(id) {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
