import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Radio, AlertTriangle, CheckCircle, Clock, Navigation,
  RotateCcw, MapPin, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_BOOKINGS } from '../utils/mockData';
import { formatTime, TRANSPORT_ICONS } from '../utils/helpers';

interface LiveEvent {
  id: string;
  type: 'delay' | 'on-time' | 'alert' | 'update';
  segment: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const INITIAL_EVENTS: LiveEvent[] = [
  { id: 'e1', type: 'on-time', segment: 'Metro Line 2', message: 'Metro Line 2 is running on schedule. Board at Platform 4.', timestamp: new Date().toISOString(), severity: 'low' },
  { id: 'e2', type: 'alert', segment: 'Connection', message: 'Your connection at Central Airport has 45 min buffer. Sufficient for security.', timestamp: new Date(Date.now() - 120000).toISOString(), severity: 'low' },
  { id: 'e3', type: 'delay', segment: 'RER B', message: 'RER B is delayed by 8 minutes due to signal fault near CDG. Alternative: RoissyBus.', timestamp: new Date(Date.now() - 300000).toISOString(), severity: 'medium' },
];

const ALTERNATIVES = [
  { id: 'alt1', label: 'RoissyBus', desc: 'Direct to Paris Opera. +12 min, same price.', icon: '🚌', recommended: true },
  { id: 'alt2', label: 'Taxi / Uber', desc: 'Door-to-door. +25 min, +€18.', icon: '🚗', recommended: false },
];

export default function RealTimeAssistantPage() {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<LiveEvent[]>(INITIAL_EVENTS);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const booking = MOCK_BOOKINGS[0];
  const visibleEvents = events.filter(e => !dismissed.has(e.id));
  const hasIssues = visibleEvents.some(e => e.type === 'delay' || e.type === 'alert');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setRefreshing(false);
      // Simulate new event
      const newEvent: LiveEvent = {
        id: `e_${Date.now()}`,
        type: 'update',
        segment: 'SkyAir Flight',
        message: 'Your flight SK-447 is now boarding at Gate B22. Final call in 20 min.',
        timestamp: new Date().toISOString(),
        severity: 'medium',
      };
      setEvents(prev => [newEvent, ...prev]);
    }, 1200);
  };

  const severityColor = { low: '#16A34A', medium: '#D97706', high: '#DC2626' };
  const eventIcon = { delay: '⚠️', 'on-time': '✅', alert: '🔔', update: '📢' };

  return (
    <main id="main-content" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        padding: '2rem 1.5rem',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '0.875rem',
              background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Radio size={24} color="white" aria-hidden="true" />
            </div>
            <div>
              <h1 style={{ color: 'white', fontWeight: 900, fontSize: '1.375rem', margin: 0 }}>
                Live Travel Assistant
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  animation: 'pulse 2s infinite',
                  display: 'block',
                }} aria-hidden="true" />
                <span style={{ color: '#22C55E', fontSize: '0.8125rem', fontWeight: 600 }}>Live monitoring active</span>
              </div>
            </div>
          </div>

          {/* Active trip */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '1rem', padding: '1rem 1.25rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={18} color="rgba(255,255,255,0.7)" aria-hidden="true" />
              <div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: 0, textTransform: 'uppercase', fontWeight: 600 }}>Active trip</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'white', fontWeight: 700 }}>{booking.route.segments[0]?.from}</span>
                  <ChevronRight size={14} color="rgba(255,255,255,0.5)" aria-hidden="true" />
                  <span style={{ color: 'white', fontWeight: 700 }}>{booking.route.segments[booking.route.segments.length - 1]?.to}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {booking.route.segments.map((s, i) => (
                <span key={i} style={{ fontSize: '1.25rem' }} aria-label={s.mode}>{TRANSPORT_ICONS[s.mode]}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Status overview */}
        <section aria-label="Trip status" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            {
              label: 'Journey status',
              value: hasIssues ? 'Action needed' : 'On track',
              icon: hasIssues ? AlertTriangle : CheckCircle,
              color: hasIssues ? '#D97706' : '#16A34A',
            },
            {
              label: 'Next segment',
              value: `${formatTime(booking.route.segments[1]?.departure ?? booking.route.departureTime)}`,
              icon: Clock,
              color: '#2563EB',
            },
            {
              label: 'ETA destination',
              value: formatTime(booking.route.arrivalTime),
              icon: Navigation,
              color: '#14B8A6',
            },
          ].map(item => (
            <div key={item.label} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '0.75rem', flexShrink: 0,
                backgroundColor: `${item.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <item.icon size={22} color={item.color} aria-hidden="true" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: 600 }}>{item.label}</p>
                <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0, color: item.color }}>{item.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Delay alternative */}
        {hasIssues && (
          <section aria-labelledby="alternatives-heading" className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #D97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 id="alternatives-heading" style={{ fontWeight: 700, fontSize: '1.0625rem', margin: 0, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <AlertTriangle size={18} color="#D97706" aria-hidden="true" />
                Suggested alternatives
              </h2>
              <button onClick={() => setShowAlternatives(o => !o)} className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                {showAlternatives ? 'Hide' : 'Show'} alternatives
              </button>
            </div>
            {showAlternatives && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {ALTERNATIVES.map(alt => (
                  <div key={alt.id} className="card" style={{ padding: '1rem', borderColor: alt.recommended ? '#2563EB' : undefined }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.5rem' }} aria-hidden="true">{alt.icon}</span>
                        <div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <h3 style={{ fontWeight: 700, margin: 0, fontSize: '0.9375rem' }}>{alt.label}</h3>
                            {alt.recommended && <span className="badge badge-blue">Recommended</span>}
                          </div>
                          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>{alt.desc}</p>
                        </div>
                      </div>
                      <button className={alt.recommended ? 'btn-primary' : 'btn-secondary'} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        Switch route
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Live feed */}
        <section aria-labelledby="feed-heading">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 id="feed-heading" style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0 }}>
              Live updates
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Updated {lastRefresh.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <button
                onClick={handleRefresh}
                className="btn-ghost"
                aria-label="Refresh live updates"
                style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}
              >
                <RotateCcw
                  size={16}
                  aria-hidden="true"
                  style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
                />
                Refresh
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {visibleEvents.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <CheckCircle size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} aria-hidden="true" />
                <p style={{ margin: 0 }}>All clear — no active alerts</p>
              </div>
            ) : (
              visibleEvents.map(event => (
                <article
                  key={event.id}
                  className="card"
                  style={{
                    padding: '1rem 1.25rem',
                    borderLeft: `3px solid ${severityColor[event.severity]}`,
                  }}
                  aria-label={`${event.type} update for ${event.segment}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.875rem', flex: 1 }}>
                      <span style={{ fontSize: '1.25rem', flexShrink: 0 }} aria-hidden="true">{eventIcon[event.type]}</span>
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', margin: 0 }}>{event.segment}</h3>
                          <span style={{
                            padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700,
                            backgroundColor: `${severityColor[event.severity]}18`,
                            color: severityColor[event.severity],
                            textTransform: 'capitalize',
                          }}>
                            {event.type.replace('-', ' ')}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 0.375rem', lineHeight: 1.5 }}>
                          {event.message}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                          {new Date(event.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDismissed(prev => new Set([...prev, event.id]))}
                      className="btn-ghost"
                      aria-label={`Dismiss update for ${event.segment}`}
                      style={{ padding: '0.25rem', flexShrink: 0 }}
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Quick actions */}
        <section aria-label="Quick actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to={`/ticket/${booking.id}`} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
            View QR ticket
          </Link>
          <Link to="/dashboard" className="btn-ghost" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
            My dashboard
          </Link>
        </section>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
