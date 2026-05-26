import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Ticket, Star, Bell, Heart,
  ChevronRight, TrendingUp, Gift
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_BOOKINGS, MOCK_NOTIFICATIONS, MOCK_REWARDS } from '../utils/mockData';
import { formatDate, formatTime, formatCurrency, TRANSPORT_ICONS } from '../utils/helpers';
import { StatusBadge } from '../components/ui/StatusBadge';

type Tab = 'trips' | 'loyalty' | 'notifications' | 'saved';

const TIER_INFO = {
  bronze: { color: '#CD7F32', next: 'Silver', points: 5000, progress: 57 },
  silver: { color: '#9CA3AF', next: 'Gold', points: 15000, progress: 38 },
  gold: { color: '#F59E0B', next: 'Platinum', points: 50000, progress: 25 },
  platinum: { color: '#2563EB', next: null, points: 0, progress: 100 },
};

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('trips');

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const tier = TIER_INFO[user!.loyaltyTier];
  const upcoming = MOCK_BOOKINGS.filter(b => b.status === 'confirmed');
  const past = MOCK_BOOKINGS.filter(b => b.status === 'completed');
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read);

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { id: 'trips', label: 'My Trips', icon: Ticket },
    { id: 'loyalty', label: 'Loyalty', icon: Star },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: unread.length },
    { id: 'saved', label: 'Saved', icon: Heart },
  ];

  return (
    <main id="main-content" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Profile header */}
      <div style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #0D9488 100%)',
        padding: '2.5rem 1.5rem 4rem',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.375rem', fontWeight: 800, color: 'white',
            }} aria-hidden="true">
              {user!.avatar}
            </div>
            <div>
              <h1 style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>
                Welcome back, {user!.name.split(' ')[0]}!
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.375rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>{user!.email}</span>
                <span className="badge" style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.08em',
                }}>
                  {user!.role}
                </span>
              </div>
            </div>
          </div>

          {/* Loyalty mini */}
          <div style={{
            marginTop: '1.5rem',
            backgroundColor: 'rgba(255,255,255,0.12)',
            borderRadius: '1rem', padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem' }}>
                Points balance
              </p>
              <p style={{ fontWeight: 900, fontSize: '1.5rem', color: 'white', margin: 0 }}>
                {user!.loyaltyPoints.toLocaleString()}
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, textTransform: 'capitalize' }}>
                  {user!.loyaltyTier} tier
                </span>
                {tier.next && (
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
                    {tier.next} →
                  </span>
                )}
              </div>
              <div style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '9999px',
                  backgroundColor: 'white',
                  width: `${tier.progress}%`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '-2rem auto 0', padding: '0 1.5rem 2rem' }}>
        {/* Tab navigation */}
        <nav
          role="tablist"
          aria-label="Dashboard sections"
          className="card"
          style={{ padding: '0.375rem', display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', overflowX: 'auto' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', padding: '0.625rem 0.875rem',
                borderRadius: '0.625rem', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#2563EB' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--color-text-muted)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: '0.875rem', transition: 'all 0.2s ease',
                whiteSpace: 'nowrap', position: 'relative', minHeight: 44,
              }}
            >
              <tab.icon size={16} aria-hidden="true" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.3)' : '#EF4444',
                  color: 'white', fontSize: '0.65rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Trips panel */}
        {activeTab === 'trips' && (
          <div id="panel-trips" role="tabpanel" aria-labelledby="tab-trips">
            {upcoming.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontWeight: 800, fontSize: '1.125rem', margin: '0 0 1rem', color: 'var(--color-text)' }}>
                  Upcoming trips
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.125rem', margin: '0 0 1rem', color: 'var(--color-text)' }}>
                  Past trips
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {past.map(b => <BookingCard key={b.id} booking={b} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loyalty panel */}
        {activeTab === 'loyalty' && (
          <div id="panel-loyalty" role="tabpanel" aria-labelledby="tab-loyalty">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total points', value: user!.loyaltyPoints.toLocaleString(), icon: Star, color: '#F59E0B' },
                { label: 'Tier', value: user!.loyaltyTier.charAt(0).toUpperCase() + user!.loyaltyTier.slice(1), icon: TrendingUp, color: tier.color },
                { label: 'Trips booked', value: MOCK_BOOKINGS.length.toString(), icon: Ticket, color: '#2563EB' },
                { label: 'Rewards available', value: MOCK_REWARDS.filter(r => r.available).length.toString(), icon: Gift, color: '#14B8A6' },
              ].map(stat => (
                <div key={stat.label} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '0.75rem',
                    backgroundColor: `${stat.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <stat.icon size={22} color={stat.color} aria-hidden="true" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>{stat.label}</p>
                    <p style={{ fontWeight: 800, fontSize: '1.25rem', margin: 0, color: 'var(--color-text)' }}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ fontWeight: 800, fontSize: '1.125rem', margin: '0 0 1rem', color: 'var(--color-text)' }}>
              Available rewards
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {MOCK_REWARDS.map(reward => (
                <div
                  key={reward.id}
                  className="card card-hover"
                  style={{
                    padding: '1.25rem',
                    opacity: reward.available ? 1 : 0.6,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className={`badge badge-${reward.category === 'upgrade' ? 'blue' : reward.category === 'discount' ? 'amber' : reward.category === 'lounge' ? 'teal' : 'gray'}`}>
                      {reward.category}
                    </span>
                    {!reward.available && <span className="badge badge-gray">Unavailable</span>}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 0.375rem' }}>{reward.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0 0 1rem', lineHeight: 1.5 }}>{reward.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#F59E0B' }}>⭐ {reward.pointsCost.toLocaleString()} pts</span>
                    <button
                      className={reward.available && user!.loyaltyPoints >= reward.pointsCost ? 'btn-primary' : 'btn-secondary'}
                      style={{ fontSize: '0.8125rem', padding: '0.5rem 0.875rem' }}
                      disabled={!reward.available || user!.loyaltyPoints < reward.pointsCost}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications panel */}
        {activeTab === 'notifications' && (
          <div id="panel-notifications" role="tabpanel" aria-labelledby="tab-notifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {MOCK_NOTIFICATIONS.map(notif => (
                <div
                  key={notif.id}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderLeft: `3px solid ${
                      notif.type === 'delay' ? '#D97706' :
                      notif.type === 'cancellation' ? '#DC2626' :
                      notif.type === 'promo' ? '#2563EB' : '#14B8A6'
                    }`,
                    opacity: notif.read ? 0.75 : 1,
                  }}
                  aria-label={`${notif.read ? 'Read' : 'Unread'} notification: ${notif.title}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', margin: 0 }}>{notif.title}</h3>
                        {!notif.read && (
                          <span style={{
                            width: 8, height: 8, borderRadius: '50%',
                            backgroundColor: '#EF4444', display: 'block', flexShrink: 0,
                          }} aria-label="Unread" />
                        )}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 0.5rem', lineHeight: 1.5 }}>
                        {notif.message}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                        {new Date(notif.timestamp).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {notif.actionLabel && (
                      <Link
                        to={notif.actionUrl ?? '#'}
                        className="btn-secondary"
                        style={{ fontSize: '0.8125rem', padding: '0.5rem 0.875rem', whiteSpace: 'nowrap' }}
                      >
                        {notif.actionLabel}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved panel */}
        {activeTab === 'saved' && (
          <div id="panel-saved" role="tabpanel" aria-labelledby="tab-saved">
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}>
              <Heart size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} aria-hidden="true" />
              <h2 style={{ fontWeight: 700, margin: '0 0 0.5rem' }}>No saved routes yet</h2>
              <p style={{ margin: '0 0 1.5rem' }}>Save routes from search results to quickly re-book them later.</p>
              <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                Search routes
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function BookingCard({ booking }: { booking: typeof MOCK_BOOKINGS[0] }) {
  const from = booking.route.segments[0]?.from ?? '';
  const to = booking.route.segments[booking.route.segments.length - 1]?.to ?? '';

  return (
    <article className="card" style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.0625rem' }}>{from}</span>
            <ChevronRight size={16} color="var(--color-text-muted)" aria-hidden="true" />
            <span style={{ fontWeight: 800, fontSize: '1.0625rem' }}>{to}</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 0.5rem' }}>
            {formatDate(booking.route.departureTime)} · {formatTime(booking.route.departureTime)} – {formatTime(booking.route.arrivalTime)}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <StatusBadge status={booking.status} />
            <span className="badge badge-gray" style={{ fontFamily: 'monospace' }}>{booking.bookingRef}</span>
            {booking.route.segments.map((s, i) => (
              <span key={i} style={{ fontSize: '1.0625rem' }} aria-label={s.mode}>{TRANSPORT_ICONS[s.mode]}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 800, fontSize: '1.125rem', margin: '0 0 0.5rem' }}>
            {formatCurrency(booking.totalPaid, booking.currency)}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <Link to={`/ticket/${booking.id}`} className="btn-ghost" style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}>
              <Ticket size={14} aria-hidden="true" /> Ticket
            </Link>
            {booking.status === 'confirmed' && (
              <Link to={`/routes/${booking.route.id}`} className="btn-secondary" style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}>
                View details
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
