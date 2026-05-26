import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, Bell, Menu, X, LogOut, LayoutDashboard,
  Ticket, Star, Settings, ChevronDown
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_NOTIFICATIONS } from '../../utils/mockData';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'My Trips', requiresAuth: true },
    { to: '/assistant', label: 'Live Assistant', requiresAuth: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      role="banner"
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: '1.5rem' }}>

          {/* Logo */}
          <Link
            to="/"
            aria-label="TripWise home"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              textDecoration: 'none', flexShrink: 0,
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '0.625rem',
              background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={18} color="white" aria-hidden="true" />
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text)' }}>
              Trip<span style={{ color: '#2563EB' }}>Wise</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" style={{ display: 'flex', gap: '0.25rem', flex: 1 }}
            className="hidden-mobile">
            {navLinks.map(link => (
              (!link.requiresAuth || isAuthenticated) && (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: '0.5rem 0.875rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: isActive(link.to) ? 600 : 500,
                    color: isActive(link.to) ? '#2563EB' : 'var(--color-text-muted)',
                    textDecoration: 'none',
                    backgroundColor: isActive(link.to) ? 'rgba(37,99,235,0.08)' : 'transparent',
                    transition: 'all 0.15s ease',
                    minHeight: 44,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <ThemeToggle />

            {isAuthenticated && (
              <Link
                to="/dashboard"
                aria-label={`Notifications (${unreadCount} unread)`}
                style={{
                  position: 'relative', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', minWidth: 44, minHeight: 44,
                  borderRadius: '0.5rem', color: 'var(--color-text-muted)',
                  textDecoration: 'none', padding: '0.5rem',
                  transition: 'all 0.15s ease',
                }}
                className="btn-ghost"
              >
                <Bell size={20} aria-hidden="true" />
                {unreadCount > 0 && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 16, height: 16, borderRadius: '50%',
                      backgroundColor: '#EF4444',
                      fontSize: '0.6rem', fontWeight: 700, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--color-bg)',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated && user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label={`User menu for ${user.name}`}
                  className="btn-ghost"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.625rem' }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {user.avatar}
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }} className="hidden-mobile">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} aria-hidden="true" />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    aria-label="User menu"
                    style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      backgroundColor: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.875rem',
                      padding: '0.5rem',
                      minWidth: 200,
                      boxShadow: '0 16px 40px var(--color-shadow)',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '0.75rem 1rem 0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.25rem' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{user.email}</p>
                      <p style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 600, margin: '4px 0 0', textTransform: 'uppercase' }}>
                        ⭐ {user.loyaltyPoints.toLocaleString()} pts · {user.loyaltyTier}
                      </p>
                    </div>

                    {[
                      { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
                      { icon: Ticket, label: 'My Tickets', to: '/dashboard' },
                      { icon: Star, label: 'Loyalty', to: '/dashboard' },
                      ...(user.role === 'admin' ? [{ icon: Settings, label: 'Admin', to: '/dashboard' }] : []),
                    ].map(item => (
                      <Link
                        key={item.label}
                        to={item.to}
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.625rem 0.875rem', borderRadius: '0.5rem',
                          fontSize: '0.875rem', color: 'var(--color-text)',
                          textDecoration: 'none', transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <item.icon size={16} aria-hidden="true" />
                        {item.label}
                      </Link>
                    ))}

                    <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                      <button
                        role="menuitem"
                        onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.625rem 0.875rem', borderRadius: '0.5rem',
                          fontSize: '0.875rem', color: '#DC2626', cursor: 'pointer',
                          background: 'none', border: 'none', width: '100%', textAlign: 'left',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.08)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <LogOut size={16} aria-hidden="true" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                  Get started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="btn-ghost show-mobile"
              style={{ padding: '0.5rem' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav
            aria-label="Mobile navigation"
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {navLinks.map(link => (
              (!link.requiresAuth || isAuthenticated) && (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: isActive(link.to) ? 600 : 500,
                    color: isActive(link.to) ? '#2563EB' : 'var(--color-text)',
                    textDecoration: 'none',
                    backgroundColor: isActive(link.to) ? 'rgba(37,99,235,0.08)' : 'transparent',
                    minHeight: 44,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>
        )}
      </div>

      {/* Overlay to close user menu */}
      {userMenuOpen && (
        <div
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setUserMenuOpen(false)}
        />
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
