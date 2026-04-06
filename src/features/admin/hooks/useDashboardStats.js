import { useState, useEffect, useMemo } from 'react';
import { getBookings } from '../../../services/bookingService';

/**
 * Hook personnalisé pour charger et filtrer dynamiquement les statistiques du tableau de bord.
 * Effectue un post-traitement en temps réel desréservations brutes.
 *
 * @param {string} selectedMonth - Mois sélectionné ('all' ou '01', '02', etc.)
 * @param {string} selectedYear - Année sélectionnée ('all' ou '2025', etc.)
 * @returns {Object} { bookings, stats, loading, error, refetch }
 */
export default function useDashboardStats(selectedMonth, selectedYear) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookings('all');
      setBookings(data);
    } catch (err) {
      console.error('Erreur chargement réservations:', err);
      setError('Impossible de charger les données du tableau de bord.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const stats = useMemo(() => {
    if (!bookings.length) return null;

    const today = new Date();
    const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const todayStr = today.toISOString().split('T')[0];
    
    // Filtres dynamiques : si * (All) on garde tout, sinon on filtre par an / mois
    const filteredBookings = bookings.filter(b => {
      if (!b.pickup_date) return false;
      const [y, m, d] = b.pickup_date.split('-');
      
      let matchYear = selectedYear === 'all' || selectedYear === y;
      let matchMonth = selectedMonth === 'all' || selectedMonth === m;
      
      return matchYear && matchMonth;
    });

    let totalRevenue = 0;
    let pending = 0;
    let confirmedCount = 0;
    let dailyRevenue = 0; // For today
    let dailyBookings = 0;

    const routeCounts = {};

    filteredBookings.forEach(b => {
      const isConfirmed = b.status === 'confirmed' || b.status === 'completed';
      const isPending = b.status === 'pending' || b.status === 'quoted';
      
      if (isConfirmed && b.price) {
        totalRevenue += Number(b.price);
        if (b.pickup_date === todayStr) {
          dailyRevenue += Number(b.price);
        }
      }

      if (b.pickup_date === todayStr) {
        dailyBookings += 1;
      }

      if (isPending) pending++;
      if (isConfirmed) confirmedCount++;

      // Pour les trajets
      if (b.departure && b.arrival) {
        const route = `${b.departure.split(',')[0]} → ${b.arrival.split(',')[0]}`;
        routeCounts[route] = (routeCounts[route] || 0) + 1;
      }
    });

    const conversionRate = filteredBookings.length > 0 
      ? Math.round((confirmedCount / filteredBookings.length) * 100) 
      : 0;

    // Trier les trajets
    const sortedRoutes = Object.entries(routeCounts)
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count);

    const topRoutes = sortedRoutes.slice(0, 5);
    const bottomRoutes = sortedRoutes.slice(-5).reverse(); // Les pires (plus petit count)

    return {
      rawBookings: filteredBookings,
      allBookings: bookings, // for dynamic chart switching based on all data
      
      totalBookings: filteredBookings.length,
      revenue: totalRevenue,
      pending,
      conversionRate,
      
      dailyRevenue,
      dailyBookings,

      topRoutes,
      bottomRoutes,
    };
  }, [bookings, selectedMonth, selectedYear]);

  return { bookings, stats, loading, error, refetch: fetchBookings };
}
