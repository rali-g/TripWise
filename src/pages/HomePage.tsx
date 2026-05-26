import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, ChevronUp,
  MapPin, Users, Calendar, ArrowRight, ArrowLeftRight, Leaf,
  Star, Zap, Shield
} from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../utils/mockData';
import { useAuth } from '../contexts/AuthContext';

const TRANSPORT_OPTIONS = [
  { id: 'flight', label: 'Flights', emoji: '✈️' },
  { id: 'train', label: 'Trains', emoji: '🚆' },
  { id: 'bus', label: 'Buses', emoji: '🚌' },
  { id: 'metro', label: 'Metro', emoji: '🚇' },
  { id: 'ferry', label: 'Ferry', emoji: '⛴️' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [selectedModes, setSelectedModes] = useState<string[]>(['flight', 'train', 'bus']);
  const [maxBudget, setMaxBudget] = useState('');
  const [directOnly, setDirectOnly] = useState(false);
  const [accessibility, setAccessibility] = useState(false);

  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const toggleTripType = () => {
    setIsRoundTrip(rt => !rt);
    if (isRoundTrip) {
      // switching back to one-way: swap cities so the user sees the reverse direction then goes back
      swapLocations();
    }
  };

  const handleSearch = () => {
    if (!origin || !destination || !date) return;
    const params = new URLSearchParams({
      origin,
      destination,
      date,
      passengers: passengers.toString(),
      modes: selectedModes.join(','),
      ...(maxBudget ? { budget: maxBudget } : {}),
      ...(directOnly ? { directOnly: 'true' } : {}),
    });
    navigate(`/results?${params}`);
  };

  const toggleMode = (id: string) => {
    setSelectedModes(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <main id="main-content">
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        style={{
          background: 'linear-gradient(160deg, #EFF6FF 0%, #F0FDFA 50%, #FFFBEB 100%)',
          padding: '4rem 1.5rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dark mode hero bg */}
        <style>{`
          .dark section[aria-labelledby="hero-heading"] {
            background: linear-gradient(160deg, #0F172A 0%, #0D1F2D 50%, #1A1200 100%) !important;
          }
        `}</style>

        {/* Background decoration */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -100, right: -100,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="badge badge-blue" style={{ marginBottom: '1rem', fontSize: '0.8rem' }}>
              <Zap size={12} aria-hidden="true" />
              Multimodal travel made simple
            </div>
            <h1
              id="hero-heading"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                margin: '0 0 1rem',
                color: 'var(--color-text)',
              }}
            >
              Your door-to-door
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                travel companion
              </span>
            </h1>
            <p style={{
              fontSize: '1.125rem', color: 'var(--color-text-muted)',
              margin: 0, lineHeight: 1.6,
            }}>
              Search flights, trains, buses and transit in one place.
              Book once, travel everywhere.
            </p>
          </div>

          {/* Search card */}
          <div
            className="card"
            style={{ padding: 'clamp(1rem, 4vw, 1.75rem)', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
            role="search"
            aria-label="Travel search"
          >
            {/* Origin / Destination row */}
            <div className="search-origin-dest">
              <div>
                <label htmlFor="origin" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  From
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin
                    size={16}
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                  />
                  <input
                    id="origin"
                    type="text"
                    className="input"
                    placeholder="City or airport"
                    value={origin}
                    onChange={e => setOrigin(e.target.value)}
                    aria-label="Departure city or airport"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <button
                onClick={toggleTripType}
                aria-label={isRoundTrip ? 'Switch to one-way trip' : 'Switch to round trip'}
                title={isRoundTrip ? 'Round trip — click for one-way' : 'One way — click for round trip'}
                className="swap-btn"
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: `1.5px solid ${isRoundTrip ? '#2563EB' : 'var(--color-border)'}`,
                  backgroundColor: isRoundTrip ? 'rgba(37,99,235,0.1)' : 'var(--color-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.2s ease',
                  color: isRoundTrip ? '#2563EB' : 'var(--color-text-muted)',
                  marginTop: '1.375rem',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.borderColor = '#2563EB';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = isRoundTrip ? 'rgba(37,99,235,0.1)' : 'var(--color-bg)';
                  e.currentTarget.style.color = isRoundTrip ? '#2563EB' : 'var(--color-text-muted)';
                  e.currentTarget.style.borderColor = isRoundTrip ? '#2563EB' : 'var(--color-border)';
                }}
              >
                {isRoundTrip
                  ? <ArrowLeftRight size={16} aria-hidden="true" />
                  : <ArrowRight size={16} aria-hidden="true" />}
              </button>

              <div>
                <label htmlFor="destination" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  To
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin
                    size={16}
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#14B8A6' }}
                  />
                  <input
                    id="destination"
                    type="text"
                    className="input"
                    placeholder="City or airport"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    aria-label="Destination city or airport"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Date / Passengers row */}
            <div className="search-dates-grid" style={{ marginBottom: '1rem' }}>
              <div>
                <label htmlFor="departure-date" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Departure
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} aria-hidden="true" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    id="departure-date"
                    type="date"
                    className="input"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="return-date" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.375rem', color: isRoundTrip ? '#2563EB' : 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Return {isRoundTrip ? <span style={{ fontWeight: 700 }}>↩</span> : <span style={{ fontWeight: 400 }}>(optional)</span>}
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} aria-hidden="true" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: isRoundTrip ? '#2563EB' : 'var(--color-text-muted)' }} />
                  <input
                    id="return-date"
                    type="date"
                    className="input"
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                    required={isRoundTrip}
                    style={{ paddingLeft: '2.5rem', borderColor: isRoundTrip ? '#2563EB' : undefined, outline: isRoundTrip && !returnDate ? '2px solid rgba(37,99,235,0.3)' : undefined }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="passengers" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.375rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Passengers
                </label>
                <div style={{ position: 'relative' }}>
                  <Users size={16} aria-hidden="true" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <select
                    id="passengers"
                    className="input"
                    value={passengers}
                    onChange={e => setPassengers(Number(e.target.value))}
                    style={{ paddingLeft: '2.5rem', cursor: 'pointer' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'passenger' : 'passengers'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Advanced filters toggle */}
            <button
              onClick={() => setShowAdvanced(o => !o)}
              aria-expanded={showAdvanced}
              aria-controls="advanced-filters"
              className="btn-ghost"
              style={{ marginBottom: showAdvanced ? '1rem' : '0', fontSize: '0.875rem', color: '#2563EB', padding: '0.25rem 0' }}
            >
              {showAdvanced ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
              {showAdvanced ? 'Hide' : 'Show'} advanced options
            </button>

            {/* Advanced filters */}
            {showAdvanced && (
              <div
                id="advanced-filters"
                style={{
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {/* Transport modes */}
                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Transport types
                  </legend>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {TRANSPORT_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => toggleMode(opt.id)}
                        aria-pressed={selectedModes.includes(opt.id)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          borderRadius: '9999px',
                          border: `1.5px solid ${selectedModes.includes(opt.id) ? '#2563EB' : 'var(--color-border)'}`,
                          backgroundColor: selectedModes.includes(opt.id) ? 'rgba(37,99,235,0.1)' : 'transparent',
                          color: selectedModes.includes(opt.id) ? '#2563EB' : 'var(--color-text-muted)',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          minHeight: 44,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                        }}
                      >
                        <span aria-hidden="true">{opt.emoji}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label htmlFor="max-budget" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>
                      Max budget (€)
                    </label>
                    <input
                      id="max-budget"
                      type="number"
                      className="input"
                      placeholder="No limit"
                      value={maxBudget}
                      onChange={e => setMaxBudget(e.target.value)}
                      min={0}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  {[
                    { id: 'direct-only', label: 'Direct routes only', checked: directOnly, onChange: () => setDirectOnly(o => !o) },
                    { id: 'accessibility', label: 'Accessibility required', checked: accessibility, onChange: () => setAccessibility(o => !o) },
                  ].map(opt => (
                    <label key={opt.id} htmlFor={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', minHeight: 44 }}>
                      <input
                        id={opt.id}
                        type="checkbox"
                        checked={opt.checked}
                        onChange={opt.onChange}
                        style={{ width: 18, height: 18, accentColor: '#2563EB', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="btn-primary"
              disabled={!origin || !destination || !date}
              aria-label="Search for travel routes"
              style={{
                width: '100%',
                fontSize: '1.0625rem',
                padding: '0.875rem',
                opacity: (!origin || !destination || !date) ? 0.5 : 1,
                cursor: (!origin || !destination || !date) ? 'not-allowed' : 'pointer',
              }}
            >
              <Search size={20} aria-hidden="true" />
              Search routes
            </button>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section aria-label="Why TripWise" style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { icon: Zap, label: 'Instant multimodal search', desc: 'Compare 500+ providers in seconds', color: '#2563EB' },
              { icon: Shield, label: 'Secure unified payment', desc: 'PCI-DSS compliant checkout', color: '#14B8A6' },
              { icon: Leaf, label: 'Track your carbon footprint', desc: 'Always show low-CO₂ options', color: '#16A34A' },
              { icon: Star, label: 'Earn loyalty points', desc: 'On every booking, every mode', color: '#F59E0B' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '0.625rem',
                  backgroundColor: `${item.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <item.icon size={20} color={item.color} aria-hidden="true" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9375rem', margin: '0 0 0.25rem', color: 'var(--color-text)' }}>{item.label}</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section aria-labelledby="popular-heading" style={{ padding: '3.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <h2 id="popular-heading" style={{ fontSize: '1.375rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              Popular destinations
            </h2>
            <button className="btn-ghost" style={{ fontSize: '0.875rem', color: '#2563EB' }}>
              View all
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
          }}>
            {POPULAR_DESTINATIONS.map(dest => (
              <button
                key={dest.name}
                onClick={() => { setDestination(dest.name); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="card card-hover"
                aria-label={`Search routes to ${dest.name}, ${dest.country}`}
                style={{
                  padding: '1.25rem', cursor: 'pointer', border: 'none',
                  textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '2rem' }} aria-hidden="true">{dest.emoji}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0, color: 'var(--color-text)' }}>{dest.name}</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0' }}>{dest.country}</p>
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2563EB', margin: 0 }}>
                  From {dest.from}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty CTA */}
      {!isAuthenticated && (
        <section
          aria-label="Join TripWise"
          style={{
            margin: '0 1.5rem 3.5rem',
            borderRadius: '1.5rem',
            maxWidth: 1200,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0 1.5rem 3.5rem',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 40%, #0D9488 100%)',
            borderRadius: '1.5rem',
            padding: '3rem 2rem',
            textAlign: 'center',
            color: 'white',
          }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 0.75rem' }}>
              Earn points on every journey
            </h2>
            <p style={{ fontSize: '1.0625rem', opacity: 0.9, margin: '0 0 2rem', lineHeight: 1.6 }}>
              Join 2 million travellers already using TripWise Rewards.<br />
              Get 500 bonus points just for signing up.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/register" className="btn-primary" style={{ backgroundColor: 'white', color: '#2563EB', padding: '0.875rem 2rem' }}>
                Create free account
              </a>
              <a href="/login" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.875rem 2rem', border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '0.75rem', color: 'white', fontWeight: 600, textDecoration: 'none',
                minHeight: 44, transition: 'all 0.2s ease',
              }}>
                Sign in
              </a>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
