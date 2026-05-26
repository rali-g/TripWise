import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Clock, Banknote, Leaf, Share2, Bookmark,
  GitCompareArrows, ChevronRight, MapPin, AlertTriangle,
  Accessibility, ExternalLink, Download
} from 'lucide-react';
import { MOCK_ROUTES, buildRoutes } from '../utils/mockData';
import {
  formatDuration, formatTime, formatDate, formatCurrency,
  formatCo2, TRANSPORT_ICONS, TRANSPORT_LABELS, TRANSPORT_COLORS
} from '../utils/helpers';
import { StatusBadge } from '../components/ui/StatusBadge';
import type { TransportSegment } from '../types';

export default function RouteDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [qp] = useSearchParams();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const origin = qp.get('origin') || '';
  const destination = qp.get('destination') || '';
  const date = qp.get('date') || '';
  const tripParams = `?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}`;

  const routes = (origin || destination) ? buildRoutes(origin, destination, date) : MOCK_ROUTES;
  const route = routes.find(r => r.id === id) ?? routes[0];

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'TripWise Route', url });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <main id="main-content" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Top bar */}
      <div style={{
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: '1rem 1.5rem',
        position: 'sticky', top: 64, zIndex: 40,
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={() => navigate(-1)} className="btn-ghost" aria-label="Go back" style={{ padding: '0.5rem' }}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0, color: 'var(--color-text)' }}>
                Route details
              </h1>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
                {formatDate(route.departureTime)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setSaved(o => !o)}
              className="btn-ghost"
              aria-label={saved ? 'Remove from saved' : 'Save route'}
              aria-pressed={saved}
              style={{ color: saved ? '#F59E0B' : undefined, padding: '0.5rem' }}
            >
              <Bookmark size={20} fill={saved ? '#F59E0B' : 'none'} />
            </button>
            <button onClick={handleShare} className="btn-ghost" aria-label="Share route" style={{ padding: '0.5rem' }}>
              {shared ? <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A' }}>Copied!</span> : <Share2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Summary card */}
        <section aria-label="Route summary" className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Departure', value: formatTime(route.departureTime), sub: formatDate(route.departureTime), icon: Clock },
              { label: 'Arrival', value: formatTime(route.arrivalTime), sub: formatDate(route.arrivalTime), icon: MapPin },
              { label: 'Duration', value: formatDuration(route.totalDuration), sub: `${route.transfers} transfer${route.transfers !== 1 ? 's' : ''}`, icon: Clock },
              { label: 'Total cost', value: formatCurrency(route.totalPrice, route.currency), sub: 'per person', icon: Banknote },
              { label: 'CO₂ impact', value: formatCo2(route.co2kg), sub: route.co2kg < 5 ? 'Low impact 🌱' : route.co2kg < 15 ? 'Medium' : 'High', icon: Leaf },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', margin: '0 0 0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </p>
                <p style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0, color: 'var(--color-text)' }}>{item.value}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0' }}>{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {route.tags.map(tag => (
              <span key={tag} className={`badge ${tag === 'recommended' ? 'badge-blue' : tag === 'greenest' ? 'badge-teal' : tag === 'cheapest' ? 'badge-amber' : 'badge-blue'}`}>
                {tag === 'recommended' ? '⭐' : tag === 'cheapest' ? '💰' : tag === 'fastest' ? '⚡' : '🌱'} {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            ))}
            <span className="badge badge-blue">Score: {route.score}/100</span>
          </div>
        </section>

        {/* Interactive timeline */}
        <section aria-labelledby="timeline-heading" className="card" style={{ padding: '1.5rem' }}>
          <h2 id="timeline-heading" style={{ fontWeight: 800, fontSize: '1.125rem', margin: '0 0 1.5rem', color: 'var(--color-text)' }}>
            Journey timeline
          </h2>

          <ol style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative' }} aria-label="Journey segments">
            {/* Vertical line */}
            <div aria-hidden="true" style={{
              position: 'absolute', left: 20, top: 24, bottom: 24,
              width: 2, backgroundColor: 'var(--color-border)',
            }} />

            {/* Origin */}
            <li style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '3px solid var(--color-bg)', position: 'relative', zIndex: 1,
              }}>
                <MapPin size={18} color="white" aria-hidden="true" />
              </div>
              <div style={{ paddingTop: '0.625rem' }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                  {route.segments[0]?.from}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0' }}>
                  Depart {formatTime(route.departureTime)}
                </p>
              </div>
            </li>

            {route.segments.map((segment, idx) => (
              <SegmentItem key={segment.id} segment={segment} isLast={idx === route.segments.length - 1} />
            ))}

            {/* Destination */}
            <li style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                backgroundColor: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '3px solid var(--color-bg)', position: 'relative', zIndex: 1,
              }}>
                <MapPin size={18} color="white" aria-hidden="true" />
              </div>
              <div style={{ paddingTop: '0.625rem' }}>
                <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                  {route.segments[route.segments.length - 1]?.to}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0' }}>
                  Arrive {formatTime(route.arrivalTime)}
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
          onClick={() => navigate(`/book/${route.id}${tripParams}`)}
            className="btn-primary"
            style={{ flex: 1, minWidth: 180, justifyContent: 'center' }}
          >
            Reserve this route
          </button>
          <button className="btn-secondary" style={{ minWidth: 44, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitCompareArrows size={18} aria-hidden="true" />
            Compare
          </button>
          <button className="btn-ghost" style={{ minWidth: 44, padding: '0.75rem 1rem' }}>
            <Download size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Accessibility note */}
        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Accessibility size={18} color="#2563EB" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            This route includes step-free access at all stations. Wheelchair-accessible vehicles available.
            <a href="#" style={{ color: '#2563EB', marginLeft: '0.25rem' }}>View accessibility details <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /></a>
          </p>
        </div>
      </div>
    </main>
  );
}

function SegmentItem({ segment, isLast: _isLast }: { segment: TransportSegment; isLast: boolean }) {
  const color = TRANSPORT_COLORS[segment.mode];
  const icon = TRANSPORT_ICONS[segment.mode];
  const isWalk = segment.mode === 'walk';

  return (
    <li style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', position: 'relative' }}>
      {/* Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        backgroundColor: isWalk ? 'var(--color-bg-secondary)' : `${color}18`,
        border: `2px solid ${isWalk ? 'var(--color-border)' : color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.125rem', position: 'relative', zIndex: 1,
      }}>
        <span aria-hidden="true">{icon}</span>
      </div>

      {/* Content */}
      <div className="card" style={{ flex: 1, padding: '0.875rem 1rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', margin: 0, color: 'var(--color-text)' }}>
              {TRANSPORT_LABELS[segment.mode]}
              {segment.operator !== 'Walk' && ` · ${segment.operator}`}
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
              {segment.from} {segment.fromCode && `(${segment.fromCode})`}
              {' '}<ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} aria-hidden="true" />{' '}
              {segment.to} {segment.toCode && `(${segment.toCode})`}
            </p>
            {segment.platform && (
              <p style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600, margin: '0.25rem 0 0' }}>
                {segment.platform}
              </p>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', margin: 0 }}>
              {formatTime(segment.departure)} – {formatTime(segment.arrival)}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0' }}>
              {formatDuration(segment.duration)}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {segment.realtime && (
            <StatusBadge
              status={segment.realtime.status === 'on-time' ? 'on-time' : segment.realtime.status === 'delayed' ? 'delayed' : 'cancelled'}
              delayMinutes={segment.realtime.delayMinutes}
            />
          )}
          {!isWalk && (
            <>
              <span className="badge badge-gray">{formatCo2(segment.co2kg)}</span>
              {segment.price > 0 && (
                <span className="badge badge-gray">{formatCurrency(segment.price, segment.currency)}</span>
              )}
              {segment.class && (
                <span className="badge badge-blue">{segment.class}</span>
              )}
            </>
          )}
        </div>

        {segment.realtime?.status === 'delayed' && (
          <div style={{
            marginTop: '0.625rem', padding: '0.5rem 0.75rem',
            backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: '0.5rem',
            display: 'flex', gap: '0.5rem', alignItems: 'center',
          }}>
            <AlertTriangle size={14} color="#D97706" aria-hidden="true" />
            <span style={{ fontSize: '0.8125rem', color: '#D97706', fontWeight: 500 }}>
              Delayed by {segment.realtime.delayMinutes} minutes. New departure: {formatTime(new Date(new Date(segment.departure).getTime() + (segment.realtime.delayMinutes ?? 0) * 60000).toISOString())}
            </span>
          </div>
        )}
      </div>
    </li>
  );
}
