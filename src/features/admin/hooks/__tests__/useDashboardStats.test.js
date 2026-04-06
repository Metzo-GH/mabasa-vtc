import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useDashboardStats from '../useDashboardStats';
import * as bookingService from '../../../../services/bookingService';

// Mock du service
vi.mock('../../../../services/bookingService', () => ({
  getBookings: vi.fn(),
}));

describe('useDashboardStats', () => {
  const mockBookings = [
    {
      id: '1',
      pickup_date: new Date().toISOString().split('T')[0], // Aujourd'hui
      status: 'confirmed',
      price: 100,
      departure: 'Paris',
      arrival: 'Lyon',
    },
    {
      id: '2',
      pickup_date: '2025-01-01',
      status: 'pending',
      price: 50,
      departure: 'Marseille',
      arrival: 'Nice',
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait calculer les stats correctement pour le filtrage par défaut', async () => {
    bookingService.getBookings.mockResolvedValue(mockBookings);

    // On suppose que le test tourne en 2026 selon AI_MAP (ou date actuelle)
    // Pour le test, on va passer des valeurs fixes pour éviter les décalages temporels
    const { result } = renderHook(() => useDashboardStats('all', 'all'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats).not.toBeNull();
    expect(result.current.stats.totalBookings).toBe(2);
    expect(result.current.stats.pending).toBe(1);
    expect(result.current.stats.revenue).toBe(100); // Seul le trajet confirmé à 100€ compte
  });

  it('devrait filtrer par année', async () => {
    bookingService.getBookings.mockResolvedValue(mockBookings);

    const { result } = renderHook(() => useDashboardStats('all', '2025'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Uniquement la résa de 2025
    expect(result.current.stats.totalBookings).toBe(1);
    expect(result.current.stats.rawBookings[0].id).toBe('2');
  });

  it('devrait identifier les trajets populaires', async () => {
    const extraBookings = [
      ...mockBookings,
      { id: '3', pickup_date: '2025-01-02', status: 'confirmed', price: 10, departure: 'Paris', arrival: 'Lyon' }
    ];
    bookingService.getBookings.mockResolvedValue(extraBookings);

    const { result } = renderHook(() => useDashboardStats('all', 'all'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats.topRoutes[0].route).toBe('Paris → Lyon');
    expect(result.current.stats.topRoutes[0].count).toBe(2);
  });
});
