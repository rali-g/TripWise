import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle, Download, Mail, Share2, Calendar,
  ChevronRight, QrCode
} from 'lucide-react';
import { MOCK_BOOKINGS } from '../utils/mockData';
import { formatTime, formatDate, formatCurrency, TRANSPORT_ICONS } from '../utils/helpers';

export default function ConfirmationPage() {
  const { bookingId: _bookingId } = useParams<{ bookingId: string }>();
  const [emailSent, setEmailSent] = useState(false);

  // Find booking or use first mock
  const booking = MOCK_BOOKINGS[0];

  const handleEmailTicket = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <main id="main-content" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Success banner */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #16A34A, #22C55E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 24px rgba(22,163,74,0.3)',
          }}>
            <CheckCircle size={40} color="white" aria-hidden="true" />
          </div>
          <h1 style={{ fontWeight: 900, fontSize: '1.75rem', margin: '0 0 0.5rem', color: 'var(--color-text)' }}>
            Booking confirmed!
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '1.0625rem' }}>
            Your trip is all set. Have a great journey!
          </p>
        </div>

        {/* Booking ref card */}
        <section aria-label="Booking reference" className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem' }}>
              Booking reference
            </p>
            <p style={{ fontWeight: 900, fontSize: '1.5rem', margin: 0, fontFamily: 'monospace', letterSpacing: '0.05em', color: '#2563EB' }}>
              {booking.bookingRef}
            </p>
          </div>
          <div className="badge badge-green" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            <CheckCircle size={14} aria-hidden="true" />
            Confirmed
          </div>
        </section>

        {/* QR Ticket */}
        <section aria-labelledby="ticket-heading" className="card" style={{ padding: '2rem 1.5rem', marginBottom: '1.25rem', textAlign: 'center' }}>
          <h2 id="ticket-heading" style={{ fontWeight: 800, fontSize: '1.125rem', margin: '0 0 1.5rem', color: 'var(--color-text)' }}>
            Your unified QR ticket
          </h2>

          {/* QR code visual */}
          <div
            aria-label={`QR code for ticket ${booking.ticketId}`}
            role="img"
            style={{
              width: 200, height: 200, margin: '0 auto 1.25rem',
              borderRadius: '1rem', backgroundColor: 'var(--color-bg-secondary)',
              border: '2px solid var(--color-border)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '0.75rem',
            }}
          >
            {/* Visual QR placeholder pattern */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3,
              width: 140, height: 140,
            }}>
              {Array.from({ length: 49 }, (_, i) => {
                // Deterministic pseudo-random pattern based on ticket ID
                const code = booking.ticketId;
                const val = (code.charCodeAt(i % code.length) + i * 7) % 3;
                const isCorner = (i < 7 && (i < 3 || i > 3)) ||
                                 (i > 41 && (i < 45 || i > 45)) ||
                                 (i % 7 === 0 && i < 22) ||
                                 (i % 7 === 6 && i < 22);
                return (
                  <div key={i} style={{
                    backgroundColor: val === 0 || isCorner ? 'var(--color-text)' : 'transparent',
                    borderRadius: 2,
                  }} />
                );
              })}
            </div>
          </div>

          <p style={{
            fontFamily: 'monospace', fontSize: '1.0625rem', fontWeight: 700,
            letterSpacing: '0.1em', color: '#2563EB', margin: '0 0 0.5rem',
          }}>
            {booking.ticketId.toUpperCase()}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0 0 1.5rem' }}>
            Show this QR code at every checkpoint
          </p>

          {/* Journey summary */}
          <div style={{
            backgroundColor: 'var(--color-bg-secondary)', borderRadius: '0.875rem',
            padding: '1rem', textAlign: 'left', marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700 }}>{booking.route.segments[0]?.from}</span>
              <ChevronRight size={16} color="var(--color-text-muted)" aria-hidden="true" />
              <span style={{ fontWeight: 700 }}>{booking.route.segments[booking.route.segments.length - 1]?.to}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 0.5rem' }}>
              {formatDate(booking.route.departureTime)}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {booking.route.segments.map((s, i) => (
                <span key={i} style={{ fontSize: '1.125rem' }} aria-label={s.mode}>{TRANSPORT_ICONS[s.mode]}</span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {formatTime(booking.route.departureTime)} → {formatTime(booking.route.arrivalTime)}
              </span>
              <span style={{ fontWeight: 700 }}>{formatCurrency(booking.totalPaid, booking.currency)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button className="btn-primary" style={{ justifyContent: 'center' }} aria-label="Download ticket as PDF">
              <Download size={18} aria-hidden="true" />
              Download PDF
            </button>
            <button
              onClick={handleEmailTicket}
              className="btn-secondary"
              style={{ justifyContent: 'center' }}
              aria-label="Send ticket to email"
            >
              <Mail size={18} aria-hidden="true" />
              {emailSent ? 'Sent! ✓' : 'Email ticket'}
            </button>
            <button className="btn-ghost" style={{ justifyContent: 'center' }} aria-label="Add to calendar">
              <Calendar size={18} aria-hidden="true" />
              Add to calendar
            </button>
            <button className="btn-ghost" style={{ justifyContent: 'center' }} aria-label="Share booking">
              <Share2 size={18} aria-hidden="true" />
              Share
            </button>
          </div>
        </section>

        {/* Offline mode notice */}
        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <QrCode size={18} color="#2563EB" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: '0 0 0.25rem' }}>Works offline</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Your QR ticket is saved locally and works without internet connection.
              <Link to={`/ticket/${booking.id}`} style={{ color: '#2563EB', marginLeft: '0.25rem' }}>View offline ticket</Link>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn-primary" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
            View in dashboard
          </Link>
          <Link to="/" className="btn-ghost" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
            Plan another trip
          </Link>
        </div>
      </div>
    </main>
  );
}
