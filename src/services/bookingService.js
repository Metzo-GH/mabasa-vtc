import { supabase } from '../lib/supabase';

/**
 * Booking service — handles all Supabase operations for bookings.
 * Keeps data logic separate from React components.
 */

/**
 * Create a new booking (public — no auth required).
 * Maps the frontend form fields to the database column names.
 */
export async function createBooking(formData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      trip_type: formData.tripType,
      departure: formData.departure,
      arrival: formData.arrival,
      pickup_date: formData.date,
      pickup_time: formData.time,
      return_date: formData.tripType === 'roundtrip' ? formData.returnDate : null,
      return_time: formData.tripType === 'roundtrip' ? formData.returnTime : null,
      passengers: parseInt(formData.passengers, 10),
      luggage: parseInt(formData.luggage, 10),
      flight_number: formData.flightNumber || null,
      notes: formData.notes || null,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    })

  if (error) throw error;

  // Trigger the email notification (fire-and-forget, wrapped in try/catch to not block the UI)
  try {
    const { data: emailData, error: emailError } = await supabase.functions.invoke('smart-endpoint', {
      body: { 
        bookingData: {
          trip_type: formData.tripType,
          departure: formData.departure,
          arrival: formData.arrival,
          pickup_date: formData.date,
          pickup_time: formData.time,
          passengers: formData.passengers,
          luggage: formData.luggage,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone
        } 
      }
    });

    if (emailError) {
      console.error('Failed to send email:', emailError);
    }
  } catch (err) {
    console.error('Error invoking send-email function:', err);
  }

  return data;
}

/**
 * Fetch all bookings (admin only — requires auth).
 * Sorted by creation date, most recent first.
 * Optional status filter.
 */
export async function getBookings(statusFilter = null) {
  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Update booking status (admin only — requires auth).
 * Now optionally accepts a price when moving status to "quoted".
 */
export async function updateBookingStatus(id, status, price = null) {
  const updateData = { status };
  if (price !== null) {
    updateData.price = parseFloat(price);
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Trigger Edge Function si on envoie un Devis
  if (status === 'quoted') {
    try {
      await supabase.functions.invoke('send-quote', {
        body: { bookingData: data }
      });
    } catch (err) {
      console.error('Erreur appel send-quote', err);
    }
  }

  return data;
}

/**
 * Fetch a single booking (quote) anonymously using the secure RPC.
 * Used by the client to review the price.
 */
export async function getQuoteById(id) {
  const { data, error } = await supabase.rpc('get_quote_by_id', { b_id: id });
  
  if (error) throw error;
  
  // rpc always returns an array or null
  if (!data || data.length === 0) return null;
  return data[0]; 
}

/**
 * Confirm a quote anonymously using the secure RPC.
 * The RPC ensures status is 'quoted' before moving to 'confirmed'.
 */
export async function confirmQuote(id) {
  const { error } = await supabase.rpc('confirm_quote', { b_id: id });
  if (error) throw error;
  return true;
}

/**
 * Delete a booking (admin only).
 */
export async function deleteBooking(id) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Get booking statistics for the admin dashboard.
 */
export async function getBookingStats() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Courses ce mois
  const thisMonth = data.filter(b => {
    const d = new Date(b.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // CA total (confirmed + completed only)
  const revenue = data
    .filter(b => ['confirmed', 'completed'].includes(b.status) && b.price)
    .reduce((sum, b) => sum + parseFloat(b.price), 0);

  // CA ce mois
  const revenueThisMonth = thisMonth
    .filter(b => ['confirmed', 'completed'].includes(b.status) && b.price)
    .reduce((sum, b) => sum + parseFloat(b.price), 0);

  // En attente
  const pending = data.filter(b => b.status === 'pending').length;

  // Taux de confirmation
  const total = data.length;
  const confirmed = data.filter(b => ['confirmed', 'completed'].includes(b.status)).length;
  const conversionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  // Revenue par mois (6 derniers mois)
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const month = d.getMonth();
    const year = d.getFullYear();
    const monthData = data.filter(b => {
      const bd = new Date(b.created_at);
      return bd.getMonth() === month && bd.getFullYear() === year 
        && ['confirmed', 'completed'].includes(b.status) && b.price;
    });
    const monthRev = monthData.reduce((sum, b) => sum + parseFloat(b.price), 0);
    monthlyRevenue.push({
      label: d.toLocaleDateString('fr-FR', { month: 'short' }),
      revenue: monthRev,
      count: monthData.length,
    });
  }

  // Top trajets
  const routeCounts = {};
  data.forEach(b => {
    const route = `${b.departure} → ${b.arrival}`;
    routeCounts[route] = (routeCounts[route] || 0) + 1;
  });
  const topRoutes = Object.entries(routeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([route, count]) => ({ route, count }));

  return {
    totalBookings: total,
    thisMonthBookings: thisMonth.length,
    revenue,
    revenueThisMonth,
    pending,
    conversionRate,
    monthlyRevenue,
    topRoutes,
  };
}
