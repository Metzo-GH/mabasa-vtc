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
 * Delete multiple bookings (admin only).
 */
export async function deleteBookings(ids) {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .in('id', ids);

  if (error) throw error;
  return true;
}

/**
 * Get booking statistics for the admin dashboard.
 */
export async function getBookingStats() {
  const { data, error } = await supabase.rpc('get_dashboard_stats');
  if (error) throw error;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyRevenue = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    // On met au format YYYY-MM
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const monthStr = `${yyyy}-${mm}`;
    
    const found = data.monthlyData.find(item => item.month_val && item.month_val.startsWith(monthStr));
    
    monthlyRevenue.push({
      label: d.toLocaleDateString('fr-FR', { month: 'short' }),
      revenue: found ? parseFloat(found.revenue) : 0,
      count: found ? found.count : 0,
    });
  }

  return {
    totalBookings: data.totalBookings,
    thisMonthBookings: data.thisMonthBookings,
    revenue: parseFloat(data.revenue),
    revenueThisMonth: parseFloat(data.revenueThisMonth),
    pending: data.pending,
    conversionRate: data.conversionRate,
    monthlyRevenue,
    topRoutes: data.topRoutes,
  };
}
