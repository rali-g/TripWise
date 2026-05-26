import type { TransportMode } from '../types';

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('en-EU', { style: 'currency', currency }).format(amount);
}

export function formatCo2(kg: number): string {
  if (kg < 1) return `${Math.round(kg * 1000)}g CO₂`;
  return `${kg.toFixed(1)}kg CO₂`;
}

export const TRANSPORT_ICONS: Record<TransportMode, string> = {
  flight: '✈️',
  train: '🚆',
  bus: '🚌',
  metro: '🚇',
  tram: '🚊',
  ferry: '⛴️',
  taxi: '🚗',
  walk: '🚶',
  bike: '🚲',
};

export const TRANSPORT_LABELS: Record<TransportMode, string> = {
  flight: 'Flight',
  train: 'Train',
  bus: 'Bus',
  metro: 'Metro',
  tram: 'Tram',
  ferry: 'Ferry',
  taxi: 'Taxi / Rideshare',
  walk: 'Walk',
  bike: 'Bicycle',
};

export const TRANSPORT_COLORS: Record<TransportMode, string> = {
  flight: '#2563EB',
  train: '#16A34A',
  bus: '#D97706',
  metro: '#7C3AED',
  tram: '#0891B2',
  ferry: '#0369A1',
  taxi: '#F59E0B',
  walk: '#64748B',
  bike: '#15803D',
};

export function co2Color(kg: number): string {
  if (kg < 5) return '#16A34A';
  if (kg < 15) return '#D97706';
  return '#DC2626';
}

export function scoreColor(score: number): string {
  if (score >= 85) return '#16A34A';
  if (score >= 70) return '#D97706';
  return '#DC2626';
}

export function generateQRPattern(code: string): string {
  // Returns a simple deterministic pattern for visual QR placeholder
  return code;
}

export function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
