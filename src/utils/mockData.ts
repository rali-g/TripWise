import type { Route, Booking, TripNotification, LoyaltyReward } from '../types';

export const MOCK_ROUTES: Route[] = [
  {
    id: 'r1',
    tags: ['recommended'],
    score: 92,
    totalDuration: 185,
    totalPrice: 87.50,
    currency: 'EUR',
    transfers: 2,
    co2kg: 12.4,
    departureTime: '2026-06-15T07:10:00',
    arrivalTime: '2026-06-15T10:15:00',
    segments: [
      {
        id: 's1', mode: 'walk', operator: 'Walk', from: 'Home', to: 'City Station',
        departure: '2026-06-15T07:10:00', arrival: '2026-06-15T07:16:00',
        duration: 6, co2kg: 0, price: 0, currency: 'EUR',
        realtime: { status: 'on-time' },
      },
      {
        id: 's2', mode: 'metro', operator: 'Metro Line 2', operatorLogo: '🚇',
        from: 'City Station', to: 'Central Airport', fromCode: 'CST', toCode: 'CAP',
        departure: '2026-06-15T07:20:00', arrival: '2026-06-15T07:55:00',
        duration: 35, co2kg: 1.2, price: 3.50, currency: 'EUR', platform: 'Platform 4',
        realtime: { status: 'on-time' },
      },
      {
        id: 's3', mode: 'flight', operator: 'SkyAir', operatorLogo: '✈️',
        from: 'Central Airport', to: 'Paris CDG', fromCode: 'MUC', toCode: 'CDG',
        departure: '2026-06-15T08:45:00', arrival: '2026-06-15T09:55:00',
        duration: 70, co2kg: 8.9, price: 72.00, currency: 'EUR', class: 'Economy',
        realtime: { status: 'on-time' },
      },
      {
        id: 's4', mode: 'train', operator: 'RER B', operatorLogo: '🚆',
        from: 'Paris CDG', to: 'Paris Gare du Nord', fromCode: 'CDG', toCode: 'GDN',
        departure: '2026-06-15T10:05:00', arrival: '2026-06-15T10:35:00',
        duration: 30, co2kg: 2.3, price: 12.00, currency: 'EUR',
        realtime: { status: 'on-time' },
      },
    ],
  },
  {
    id: 'r2',
    tags: ['cheapest'],
    score: 78,
    totalDuration: 310,
    totalPrice: 52.00,
    currency: 'EUR',
    transfers: 1,
    co2kg: 6.8,
    departureTime: '2026-06-15T06:00:00',
    arrivalTime: '2026-06-15T11:10:00',
    segments: [
      {
        id: 's5', mode: 'bus', operator: 'FlixBus', operatorLogo: '🚌',
        from: 'City Center', to: 'Lyon', fromCode: 'MUC', toCode: 'LYS',
        departure: '2026-06-15T06:00:00', arrival: '2026-06-15T10:00:00',
        duration: 240, co2kg: 4.5, price: 28.00, currency: 'EUR',
        realtime: { status: 'on-time' },
      },
      {
        id: 's6', mode: 'train', operator: 'TGV', operatorLogo: '🚄',
        from: 'Lyon Part Dieu', to: 'Paris Gare de Lyon', fromCode: 'LYS', toCode: 'PDL',
        departure: '2026-06-15T10:15:00', arrival: '2026-06-15T11:55:00',
        duration: 100, co2kg: 2.3, price: 24.00, currency: 'EUR',
        realtime: { status: 'delayed', delayMinutes: 8 },
      },
    ],
  },
  {
    id: 'r3',
    tags: ['fastest'],
    score: 85,
    totalDuration: 125,
    totalPrice: 142.00,
    currency: 'EUR',
    transfers: 0,
    co2kg: 18.2,
    departureTime: '2026-06-15T09:30:00',
    arrivalTime: '2026-06-15T11:35:00',
    segments: [
      {
        id: 's7', mode: 'flight', operator: 'AirFrance', operatorLogo: '✈️',
        from: 'Munich Airport', to: 'Paris CDG', fromCode: 'MUC', toCode: 'CDG',
        departure: '2026-06-15T09:30:00', arrival: '2026-06-15T10:45:00',
        duration: 75, co2kg: 14.2, price: 128.00, currency: 'EUR', class: 'Business',
        realtime: { status: 'on-time' },
      },
      {
        id: 's8', mode: 'taxi', operator: 'Uber', operatorLogo: '🚗',
        from: 'Paris CDG', to: 'City Center', fromCode: 'CDG', toCode: 'CTR',
        departure: '2026-06-15T10:50:00', arrival: '2026-06-15T11:35:00',
        duration: 45, co2kg: 4.0, price: 14.00, currency: 'EUR',
        realtime: { status: 'on-time' },
      },
    ],
  },
  {
    id: 'r4',
    tags: ['greenest'],
    score: 88,
    totalDuration: 240,
    totalPrice: 69.00,
    currency: 'EUR',
    transfers: 1,
    co2kg: 3.1,
    departureTime: '2026-06-15T07:45:00',
    arrivalTime: '2026-06-15T11:45:00',
    segments: [
      {
        id: 's9', mode: 'train', operator: 'Deutsche Bahn', operatorLogo: '🚆',
        from: 'Munich Hbf', to: 'Strasbourg', fromCode: 'MUC', toCode: 'SXB',
        departure: '2026-06-15T07:45:00', arrival: '2026-06-15T10:30:00',
        duration: 165, co2kg: 1.8, price: 45.00, currency: 'EUR',
        realtime: { status: 'on-time' },
      },
      {
        id: 's10', mode: 'train', operator: 'SNCF TGV', operatorLogo: '🚄',
        from: 'Strasbourg', to: 'Paris Est', fromCode: 'SXB', toCode: 'PES',
        departure: '2026-06-15T10:45:00', arrival: '2026-06-15T12:55:00',
        duration: 130, co2kg: 1.3, price: 24.00, currency: 'EUR',
        realtime: { status: 'on-time' },
      },
    ],
  },
];

/**
 * Returns MOCK_ROUTES with the origin and destination substituted into
 * the first/last segment of every route, so the UI always reflects
 * what the user actually searched for.
 */
function swapDate(iso: string, date: string): string {
  return date + 'T' + iso.split('T')[1];
}

export function buildRoutes(origin: string, destination: string, date?: string): Route[] {
  if (!origin && !destination) return MOCK_ROUTES;
  return MOCK_ROUTES.map(route => {
    const targetDate = date || route.departureTime.split('T')[0];
    const lastIdx = route.segments.length - 1;
    const segments = route.segments.map((seg, i) => ({
      ...seg,
      from: i === 0 ? origin || seg.from : seg.from,
      to: i === lastIdx ? destination || seg.to : seg.to,
      departure: swapDate(seg.departure, targetDate),
      arrival: swapDate(seg.arrival, targetDate),
    }));
    return {
      ...route,
      segments,
      departureTime: swapDate(route.departureTime, targetDate),
      arrivalTime: swapDate(route.arrivalTime, targetDate),
    };
  });
}

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    bookingRef: 'TW-2026-8841',
    route: MOCK_ROUTES[0],
    passengers: [{ firstName: 'Alex', lastName: 'Johnson', email: 'user@demo.com', phone: '+49 170 1234567' }],
    status: 'confirmed',
    totalPaid: 87.50,
    currency: 'EUR',
    createdAt: '2026-05-20T14:30:00',
    qrCode: 'auk-xxyt-gtz',
    ticketId: 'auk-xxyt-gtz',
  },
  {
    id: 'b2',
    bookingRef: 'TW-2026-5512',
    route: MOCK_ROUTES[2],
    passengers: [{ firstName: 'Alex', lastName: 'Johnson', email: 'user@demo.com', phone: '+49 170 1234567' }],
    status: 'completed',
    totalPaid: 142.00,
    currency: 'EUR',
    createdAt: '2026-04-10T09:15:00',
    qrCode: 'bxt-kkza-mnp',
    ticketId: 'bxt-kkza-mnp',
  },
];

export const MOCK_NOTIFICATIONS: TripNotification[] = [
  {
    id: 'n1', type: 'delay', title: 'TGV Delayed 8 min',
    message: 'Your TGV from Lyon to Paris is delayed by 8 minutes. New departure: 10:23.',
    timestamp: '2026-06-15T09:45:00', read: false,
    actionLabel: 'View alternatives', actionUrl: '/routes/r2',
  },
  {
    id: 'n2', type: 'reminder', title: 'Trip tomorrow',
    message: 'Your trip Munich → Paris departs tomorrow at 07:10. Check in opens now.',
    timestamp: '2026-06-14T10:00:00', read: false,
    actionLabel: 'View ticket', actionUrl: '/tickets/b1',
  },
  {
    id: 'n3', type: 'promo', title: 'Earn 2x points this weekend',
    message: 'Book any train journey this weekend and earn double loyalty points!',
    timestamp: '2026-06-12T08:00:00', read: true,
  },
];

export const MOCK_REWARDS: LoyaltyReward[] = [
  { id: 'rw1', title: 'Free Seat Upgrade', description: 'Upgrade to Business class on any train', pointsCost: 1000, category: 'upgrade', available: true },
  { id: 'rw2', title: '€10 Travel Credit', description: 'Redeem for any booking', pointsCost: 500, category: 'discount', available: true },
  { id: 'rw3', title: 'Airport Lounge Access', description: 'Access premium lounges worldwide', pointsCost: 2000, category: 'lounge', available: true },
  { id: 'rw4', title: 'Partner Hotel Night', description: 'Free night at 200+ partner hotels', pointsCost: 3000, category: 'partner', available: false },
];

export const POPULAR_DESTINATIONS = [
  { name: 'Paris', country: 'France', emoji: '🗼', from: '€52' },
  { name: 'Barcelona', country: 'Spain', emoji: '🏖️', from: '€65' },
  { name: 'Amsterdam', country: 'Netherlands', emoji: '🌷', from: '€38' },
  { name: 'Rome', country: 'Italy', emoji: '🏛️', from: '€78' },
  { name: 'Vienna', country: 'Austria', emoji: '🎶', from: '€29' },
  { name: 'Prague', country: 'Czech Republic', emoji: '🏰', from: '€34' },
];
