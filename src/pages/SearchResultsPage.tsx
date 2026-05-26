import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal, Clock, Banknote, Leaf, Star,
  ChevronRight, ArrowLeft, X
} from 'lucide-react';
import { buildRoutes } from '../utils/mockData';
import { formatDuration, formatTime, formatCurrency, formatCo2, scoreColor } from '../utils/helpers';
import { TransportChain } from '../components/ui/TransportBadge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { StatusBadge } from '../components/ui/StatusBadge';
import type { Route, TransportMode } from '../types';

type SortKey = 'recommended' | 'cheapest' | 'fastest' | 'greenest';

const TAG_LABELS: Record<string, string> = {
  recommended: '⭐ Recommended',
  cheapest: '💰 Cheapest',
  fastest: '⚡ Fastest',
  greenest: '🌱 Greenest',
};

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(300);
  const [maxDuration, setMaxDuration] = useState(600);

  const origin = searchParams.get('origin') || '';
  const destination = searchParams.get('destination') || '';
  const date = searchParams.get('date') || '';

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setRoutes(buildRoutes(origin, destination, date));
      setLoading(false);
    }, 1400);
    return () => clearTimeout(t);
  }, [searchParams.toString()]);

  const sorted = [...routes]
    .filter(r => r.totalPrice <= maxPrice && r.totalDuration <= maxDuration)
    .sort((a, b) => {
      if (sortBy === 'cheapest') return a.totalPrice - b.totalPrice;
      if (sortBy === 'fastest') return a.totalDuration - b.totalDuration;
      if (sortBy === 'greenest') return a.co2kg - b.co2kg;
      return b.score - a.score;
    });

  const sortOptions: { key: SortKey; label: string; icon: typeof Clock }[] = [
    { key: 'recommended', label: 'Best', icon: Star },
    { key: 'cheapest', label: 'Cheapest', icon: Banknote },
    { key: 'fastest', label: 'Fastest', icon: Clock },
    { key: 'greenest', label: 'Greenest', icon: Leaf },
  ];

  return (
    <main id="main-content" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Results header bar */}
      <div style={{
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        padding: '1rem 1.5rem',
        position: 'sticky', top: 64, zIndex: 40,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/"
              aria-label="Back to search"
              className="btn-ghost"
              style={{ padding: '0.5rem', minWidth: 44, minHeight: 44, color: 'var(--color-text-muted)' }}
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-text)' }}>{origin}</span>
              <ChevronRight size={18} color="var(--color-text-muted)" aria-hidden="true" />
              <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-text)' }}>{destination}</span>
              {date && (
                <span className="badge badge-gray" style={{ marginLeft: '0.5rem' }}>{date}</span>
              )}
            </div>

            <button
              onClick={() => setShowFilters(o => !o)}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
              className="btn-secondary"
              style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', gap: '0.375rem' }}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filters
            </button>
          </div>

          {/* Sort tabs */}
          <div
            role="tablist"
            aria-label="Sort results"
            style={{ display: 'flex', gap: '0.375rem', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}
          >
            {sortOptions.map(opt => (
              <button
                key={opt.key}
                role="tab"
                aria-selected={sortBy === opt.key}
                onClick={() => setSortBy(opt.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.5rem 1rem', borderRadius: '9999px', whiteSpace: 'nowrap',
                  border: `1.5px solid ${sortBy === opt.key ? '#2563EB' : 'var(--color-border)'}`,
                  backgroundColor: sortBy === opt.key ? 'rgba(37,99,235,0.1)' : 'var(--color-bg)',
                  color: sortBy === opt.key ? '#2563EB' : 'var(--color-text-muted)',
                  fontWeight: sortBy === opt.key ? 600 : 500,
                  fontSize: '0.875rem', cursor: 'pointer', minHeight: 44,
                  transition: 'all 0.15s ease',
                }}
              >
                <opt.icon size={14} aria-hidden="true" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Filter sidebar */}
        {showFilters && (
          <aside
            id="filter-panel"
            role="complementary"
            aria-label="Search filters"
            style={{
              width: 280, flexShrink: 0,
              position: 'sticky', top: 136,
            }}
          >
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Filters</h2>
                <button onClick={() => setShowFilters(false)} className="btn-ghost" style={{ padding: '0.25rem' }} aria-label="Close filters">
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label htmlFor="max-price" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.625rem' }}>
                    <span>Max price</span>
                    <span style={{ color: '#2563EB' }}>€{maxPrice}</span>
                  </label>
                  <input
                    id="max-price"
                    type="range"
                    min={20} max={500} step={10}
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#2563EB' }}
                    aria-label={`Maximum price: €${maxPrice}`}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <span>€20</span><span>€500</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="max-duration" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.625rem' }}>
                    <span>Max duration</span>
                    <span style={{ color: '#2563EB' }}>{formatDuration(maxDuration)}</span>
                  </label>
                  <input
                    id="max-duration"
                    type="range"
                    min={60} max={720} step={30}
                    value={maxDuration}
                    onChange={e => setMaxDuration(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#2563EB' }}
                    aria-label={`Maximum duration: ${formatDuration(maxDuration)}`}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <span>1h</span><span>12h</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Results list */}
        <section aria-label="Search results" style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p role="status" aria-live="polite" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Searching 500+ providers…
              </p>
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              <p aria-live="polite" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                {sorted.length} route{sorted.length !== 1 ? 's' : ''} found
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sorted.map(route => (
                  <RouteCard key={route.id} route={route}
                    onBook={() => navigate(`/book/${route.id}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}`)}
                    onDetails={() => navigate(`/routes/${route.id}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}`)} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function RouteCard({ route, onBook, onDetails }: { route: Route; onBook: () => void; onDetails: () => void }) {
  const dep = formatTime(route.departureTime);
  const arr = formatTime(route.arrivalTime);
  const tagEntry = route.tags[0];

  return (
    <article
      className="card card-hover"
      aria-label={`Route: ${dep} to ${arr}, ${formatDuration(route.totalDuration)}, ${formatCurrency(route.totalPrice, route.currency)}`}
    >
      {/* Tag ribbon */}
      {tagEntry && (
        <div style={{
          backgroundColor: tagEntry === 'recommended' ? '#2563EB' : tagEntry === 'greenest' ? '#16A34A' : tagEntry === 'cheapest' ? '#D97706' : '#7C3AED',
          color: 'white', fontSize: '0.7rem', fontWeight: 700,
          padding: '0.25rem 0.875rem', borderRadius: '1rem 1rem 0 0',
          display: 'inline-block', marginBottom: '-1px', marginLeft: '1.25rem',
          letterSpacing: '0.03em', textTransform: 'uppercase',
        }}>
          {TAG_LABELS[tagEntry]}
        </div>
      )}

      <div style={{ padding: '1.25rem 1.5rem' }}>
        {/* Main route info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {/* Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '0 0 auto' }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: '1.375rem', margin: 0, color: 'var(--color-text)' }}>{dep}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Depart</p>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', minWidth: 80 }}>
              <div style={{ height: 1, backgroundColor: 'var(--color-border)', width: '100%' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {formatDuration(route.totalDuration)}
              </span>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '1.375rem', margin: 0, color: 'var(--color-text)' }}>{arr}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Arrive</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 40, backgroundColor: 'var(--color-border)', flexShrink: 0 }} aria-hidden="true" />

          {/* Transport chain */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <TransportChain modes={route.segments.map(s => s.mode as TransportMode)} />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.375rem 0 0' }}>
              {route.transfers === 0 ? 'Direct' : `${route.transfers} transfer${route.transfers > 1 ? 's' : ''}`}
              {' · '}
              {route.segments.map(s => s.operator).filter((o, i, a) => a.indexOf(o) === i).slice(0, 2).join(', ')}
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '1rem', flexShrink: 0, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: 600 }}>CO₂</p>
              <p style={{ fontSize: '0.8125rem', fontWeight: 600, margin: 0, color: route.co2kg < 5 ? '#16A34A' : route.co2kg < 15 ? '#D97706' : '#DC2626' }}>
                {formatCo2(route.co2kg)}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: 600 }}>Score</p>
              <p style={{ fontSize: '0.8125rem', fontWeight: 700, margin: 0, color: scoreColor(route.score) }}>
                {route.score}/100
              </p>
            </div>
          </div>

          {/* Price & CTA */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontWeight: 900, fontSize: '1.5rem', margin: 0, color: 'var(--color-text)' }}>
              {formatCurrency(route.totalPrice, route.currency)}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0.625rem' }}>per person, all included</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button onClick={onDetails} className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 0.875rem' }}>
                Details
              </button>
              <button onClick={onBook} className="btn-primary" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                Book
              </button>
            </div>
          </div>
        </div>

        {/* Realtime status */}
        {route.segments.some(s => s.realtime?.status !== 'on-time') && (
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
            {route.segments.filter(s => s.realtime?.status !== 'on-time').map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                <StatusBadge status={s.realtime!.status as any} delayMinutes={s.realtime?.delayMinutes} />
                <span style={{ color: 'var(--color-text-muted)' }}>{s.operator}: {s.from} → {s.to}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
