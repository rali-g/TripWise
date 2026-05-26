// ─── User & Auth ────────────────────────────────────────────────────────────
export type UserRole = 'guest' | 'registered' | 'business' | 'partner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  loyaltyPoints: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

// ─── Transport ───────────────────────────────────────────────────────────────
export type TransportMode =
  | 'flight'
  | 'train'
  | 'bus'
  | 'metro'
  | 'tram'
  | 'ferry'
  | 'taxi'
  | 'walk'
  | 'bike';

export interface TransportSegment {
  id: string;
  mode: TransportMode;
  operator: string;
  operatorLogo?: string;
  from: string;
  to: string;
  fromCode?: string;
  toCode?: string;
  departure: string; // ISO timestamp
  arrival: string;   // ISO timestamp
  duration: number;  // minutes
  platform?: string;
  class?: string;
  co2kg: number;
  price: number;
  currency: string;
  realtime?: { status: 'on-time' | 'delayed' | 'cancelled'; delayMinutes?: number };
}

// ─── Route ───────────────────────────────────────────────────────────────────
export interface Route {
  id: string;
  segments: TransportSegment[];
  totalDuration: number; // minutes
  totalPrice: number;
  currency: string;
  transfers: number;
  co2kg: number;
  score: number; // 0-100 TripWise score
  tags: ('cheapest' | 'fastest' | 'recommended' | 'greenest')[];
  departureTime: string;
  arrivalTime: string;
}

// ─── Search ──────────────────────────────────────────────────────────────────
export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  transportModes: TransportMode[];
  maxBudget?: number;
  maxTransfers?: number;
  accessibility: boolean;
  directOnly: boolean;
  maxCo2?: number;
  sortBy: 'recommended' | 'cheapest' | 'fastest' | 'greenest';
}

// ─── Booking ─────────────────────────────────────────────────────────────────
export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'refunded';

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  documentType?: 'passport' | 'id_card' | 'drivers_license';
  documentNumber?: string;
}

export interface Booking {
  id: string;
  bookingRef: string;
  route: Route;
  passengers: Passenger[];
  status: BookingStatus;
  totalPaid: number;
  currency: string;
  createdAt: string;
  qrCode: string;
  ticketId: string;
}

// ─── Notification ────────────────────────────────────────────────────────────
export interface TripNotification {
  id: string;
  type: 'delay' | 'cancellation' | 'update' | 'reminder' | 'promo';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

// ─── Loyalty ─────────────────────────────────────────────────────────────────
export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'upgrade' | 'discount' | 'lounge' | 'partner';
  available: boolean;
}
