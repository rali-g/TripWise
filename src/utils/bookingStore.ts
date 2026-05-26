import type { Booking } from '../types';

const KEY = 'tripwise_bookings';

export function getStoredBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

export function addBooking(booking: Booking): void {
  const bookings = getStoredBookings();
  // Avoid duplicates if navigated back and re-confirmed
  const exists = bookings.some(b => b.id === booking.id);
  if (!exists) {
    bookings.unshift(booking);
    localStorage.setItem(KEY, JSON.stringify(bookings));
  }
}
