import { useParams } from 'react-router-dom';
import { WifiOff, CheckCircle, ChevronRight } from 'lucide-react';
import { MOCK_BOOKINGS } from '../utils/mockData';
import { formatDate, formatTime, formatDuration, TRANSPORT_ICONS } from '../utils/helpers';

export default function OfflineTicketPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const booking = MOCK_BOOKINGS.find(b => b.id === bookingId) ?? MOCK_BOOKINGS[0];
  const { route } = booking;

  return (
    <main
      id="main-content"
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
      }}
    >
      {/* Offline badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.5rem 1rem', borderRadius: '9999px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: '1.5rem',
      }}>
        <WifiOff size={14} color="#94A3B8" aria-hidden="true" />
        <span style={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 600 }}>
          Offline ticket — works without internet
        </span>
      </div>

      {/* Ticket card */}
      <div
        style={{
          width: '100%', maxWidth: 400,
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}
        role="main"
        aria-label="Travel ticket"
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)',
          padding: '1.5rem',
          color: 'white',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.25rem', opacity: 0.8 }}>
                TripWise Ticket
              </p>
              <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.75 }}>
                {formatDate(route.departureTime)}
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <CheckCircle size={11} aria-hidden="true" />
              CONFIRMED
            </div>
          </div>

          {/* Route */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <p style={{ fontWeight: 900, fontSize: '1.875rem', margin: 0, lineHeight: 1 }}>
                {route.segments[0]?.from.slice(0, 3).toUpperCase()}
              </p>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0' }}>
                {formatTime(route.departureTime)}
              </p>
              <p style={{ fontSize: '0.7rem', opacity: 0.65, margin: '0.125rem 0 0' }}>
                {route.segments[0]?.from}
              </p>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '100%', borderTop: '1px dashed rgba(255,255,255,0.4)' }} aria-hidden="true" />
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                {formatDuration(route.totalDuration)}
              </span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {route.segments.map((s, i) => (
                  <span key={i} style={{ fontSize: '0.875rem' }} aria-label={s.mode}>{TRANSPORT_ICONS[s.mode]}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 900, fontSize: '1.875rem', margin: 0, lineHeight: 1 }}>
                {route.segments[route.segments.length - 1]?.to.slice(0, 3).toUpperCase()}
              </p>
              <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0' }}>
                {formatTime(route.arrivalTime)}
              </p>
              <p style={{ fontSize: '0.7rem', opacity: 0.65, margin: '0.125rem 0 0' }}>
                {route.segments[route.segments.length - 1]?.to}
              </p>
            </div>
          </div>
        </div>

        {/* Tear line */}
        <div style={{
          display: 'flex', alignItems: 'center', backgroundColor: '#F8FAFC',
        }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#0F172A', flexShrink: 0, marginLeft: -10 }} aria-hidden="true" />
          <div style={{ flex: 1, borderTop: '2px dashed #E2E8F0', margin: '0 0.5rem' }} aria-hidden="true" />
          <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#0F172A', flexShrink: 0, marginRight: -10 }} aria-hidden="true" />
        </div>

        {/* QR code */}
        <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', textAlign: 'center' }}>
          <div
            aria-label={`QR code for ticket ${booking.ticketId}`}
            role="img"
            style={{
              width: 180, height: 180, margin: '0 auto 1rem',
              backgroundColor: 'white',
              borderRadius: '0.875rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 2, width: 140, height: 140 }}>
              {Array.from({ length: 64 }, (_, i) => {
                const code = booking.ticketId ?? 'auk-xxyt-gtz';
                const seed = (code.charCodeAt(i % code.length) * (i + 1) * 31) % 100;
                const isDark = seed < 55 || (i < 18 && (i % 9 < 3 || i % 9 > 5));
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: isDark ? '#0F172A' : 'transparent',
                      borderRadius: 1,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <p style={{
            fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800,
            letterSpacing: '0.12em', color: '#2563EB', margin: '0 0 0.375rem',
          }}>
            {(booking.ticketId ?? 'auk-xxyt-gtz').toUpperCase()}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
            Scan at each checkpoint
          </p>
        </div>

        {/* Passenger info */}
        <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'white' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Passenger', value: `${booking.passengers[0]?.firstName} ${booking.passengers[0]?.lastName}` },
              { label: 'Booking ref', value: booking.bookingRef },
              { label: 'Transfers', value: `${route.transfers} transfer${route.transfers !== 1 ? 's' : ''}` },
              { label: 'Duration', value: formatDuration(route.totalDuration) },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, margin: '0 0 0.2rem' }}>
                  {item.label}
                </p>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: 0, color: '#0F172A' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Segments */}
        <div style={{ padding: '0 1.5rem 1.5rem', backgroundColor: 'white' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', margin: '0 0 0.875rem' }}>
            Journey segments
          </p>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {route.segments.map((seg) => (
              <li key={seg.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }} aria-hidden="true">{TRANSPORT_ICONS[seg.mode]}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600 }}>{seg.from}</span>
                  <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} aria-hidden="true" />
                  <span style={{ fontWeight: 600 }}>{seg.to}</span>
                </div>
                <span style={{ color: '#64748B', flexShrink: 0 }}>
                  {formatTime(seg.departure)}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#F8FAFC', borderTop: '1px dashed #E2E8F0',
          padding: '1rem 1.5rem', textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
            TripWise · Valid for all segments shown · Non-transferable
          </p>
        </div>
      </div>

      <p style={{ color: '#475569', fontSize: '0.8125rem', marginTop: '1.5rem', textAlign: 'center' }}>
        This ticket works offline and remains valid even without internet access.
      </p>
    </main>
  );
}
