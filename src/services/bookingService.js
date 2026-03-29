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
    } else {
      console.log('Email sent successfully:', emailData);
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
 */
export async function updateBookingStatus(id, status) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
