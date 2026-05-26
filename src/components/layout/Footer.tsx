import { Link } from 'react-router-dom';
import { MapPin, Globe, Layers, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-secondary)',
        padding: '3rem 1.5rem 2rem',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MapPin size={16} color="white" aria-hidden="true" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                Trip<span style={{ color: '#2563EB' }}>Wise</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
              Door-to-door travel, simplified. One search, one ticket, any journey.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              {[Globe, Layers, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={['Twitter', 'GitHub', 'LinkedIn'][i]}
                  className="btn-ghost"
                  style={{ padding: '0.375rem', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem', color: 'var(--color-text)' }}>Product</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Search Routes', 'Route Planner', 'Live Assistant', 'Loyalty Program'].map(l => (
                <li key={l}>
                  <Link to="/" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  >{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem', color: 'var(--color-text)' }}>Company</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['About', 'Careers', 'Press', 'Partners'].map(l => (
                <li key={l}>
                  <a href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.875rem', color: 'var(--color-text)' }}>Legal</h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map(l => (
                <li key={l}>
                  <a href="#" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
            © 2026 TripWise. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
            WCAG 2.1 AA · Carbon-neutral hosting 🌱
          </p>
        </div>
      </div>
    </footer>
  );
}
