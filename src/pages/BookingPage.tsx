import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, Check, User,
  Loader2, Lock
} from 'lucide-react';
import { MOCK_ROUTES, buildRoutes } from '../utils/mockData';
import { formatDuration, formatTime, formatCurrency, TRANSPORT_ICONS } from '../utils/helpers';

type Step = 1 | 2 | 3 | 4 | 5;
type PaymentMethod = 'card' | 'apple' | 'google' | 'points';

const STEP_LABELS = ['Review', 'Passengers', 'Payment', 'Processing', 'Confirmation'];

export default function BookingPage() {
  const { routeId } = useParams<{ routeId: string }>();
  const [qp] = useSearchParams();
  const navigate = useNavigate();

  const origin = qp.get('origin') || '';
  const destination = qp.get('destination') || '';
  const date = qp.get('date') || '';
  const routes = (origin || destination) ? buildRoutes(origin, destination, date) : MOCK_ROUTES;
  const route = routes.find(r => r.id === routeId) ?? routes[0];

  const [step, setStep] = useState<Step>(1);
  const [passenger, setPassenger] = useState({
    firstName: '', lastName: '', email: '', phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!passenger.firstName.trim()) e.firstName = 'First name is required';
    if (!passenger.lastName.trim()) e.lastName = 'Last name is required';
    if (!passenger.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!passenger.phone.trim()) e.phone = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    if (paymentMethod !== 'card') return true;
    const e: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Valid card number required';
    if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) e.cardExpiry = 'Format: MM/YY';
    if (cardCvc.length < 3) e.cardCvc = 'Valid CVC required';
    if (!cardName.trim()) e.cardName = 'Cardholder name required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    setErrors({});
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step === 3) {
      setStep(4);
      setTimeout(() => {
        navigate(`/confirmation/b_${routeId ?? 'r1'}`);
      }, 2200);
      return;
    }
    setStep((step + 1) as Step);
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) =>
    v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

  return (
    <main id="main-content" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Progress header */}
      <div style={{
        backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)',
        padding: '1rem 1.5rem', position: 'sticky', top: 64, zIndex: 40,
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <button onClick={() => step > 1 && step < 4 ? setStep((step - 1) as Step) : navigate(-1)} className="btn-ghost" style={{ padding: '0.5rem' }} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontWeight: 800, fontSize: '1.125rem', margin: 0 }}>
              {step < 4 ? 'Book your trip' : step === 4 ? 'Processing...' : 'Booking confirmed!'}
            </h1>
          </div>

          {/* Step indicators */}
          <nav aria-label="Booking steps">
            <ol style={{ display: 'flex', gap: '0', listStyle: 'none', margin: 0, padding: 0 }}>
              {STEP_LABELS.slice(0, 4).map((label, i) => {
                const num = i + 1;
                const isComplete = step > num;
                const isCurrent = step === num;
                return (
                  <li key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }} aria-current={isCurrent ? 'step' : undefined}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        backgroundColor: isComplete ? '#16A34A' : isCurrent ? '#2563EB' : 'var(--color-bg-secondary)',
                        border: `2px solid ${isComplete ? '#16A34A' : isCurrent ? '#2563EB' : 'var(--color-border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}>
                        {isComplete
                          ? <Check size={14} color="white" aria-hidden="true" />
                          : <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isCurrent ? 'white' : 'var(--color-text-muted)' }}>{num}</span>
                        }
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#2563EB' : isComplete ? '#16A34A' : 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                        {label}
                      </span>
                    </div>
                    {i < 3 && (
                      <div style={{ height: 2, flex: 1, backgroundColor: isComplete ? '#16A34A' : 'var(--color-border)', transition: 'background-color 0.3s', marginBottom: 20 }} aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Route summary (always visible) */}
        {step < 4 && (
          <section aria-label="Route summary" className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>
                    {route.segments[0]?.from}
                  </span>
                  <ChevronRight size={16} color="var(--color-text-muted)" aria-hidden="true" />
                  <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>
                    {route.segments[route.segments.length - 1]?.to}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
                  {formatTime(route.departureTime)} → {formatTime(route.arrivalTime)} · {formatDuration(route.totalDuration)}
                  {' · '}
                  {route.segments.map(s => TRANSPORT_ICONS[s.mode]).join(' ')}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 900, fontSize: '1.375rem', margin: 0 }}>
                  {formatCurrency(route.totalPrice, route.currency)}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>total</p>
              </div>
            </div>
          </section>
        )}

        {/* Step 1: Review */}
        {step === 1 && (
          <section aria-labelledby="review-heading" className="card" style={{ padding: '1.5rem' }}>
            <h2 id="review-heading" style={{ fontWeight: 700, fontSize: '1.0625rem', margin: '0 0 1.25rem' }}>
              Review your journey
            </h2>
            <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {route.segments.map(seg => (
                <li key={seg.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem' }} aria-hidden="true">{TRANSPORT_ICONS[seg.mode]}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{seg.from} → {seg.to}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0' }}>
                      {seg.operator} · {formatTime(seg.departure)} – {formatTime(seg.arrival)} · {formatDuration(seg.duration)}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{formatCurrency(seg.price, seg.currency)}</span>
                </li>
              ))}
            </ol>

            <div style={{
              borderTop: '1px solid var(--color-border)', paddingTop: '1rem',
              display: 'flex', flexDirection: 'column', gap: '0.5rem',
            }}>
              {[
                { label: 'Subtotal', value: formatCurrency(route.totalPrice * 0.94, route.currency) },
                { label: 'Taxes & fees', value: formatCurrency(route.totalPrice * 0.06, route.currency) },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.0625rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                <span>Total</span>
                <span>{formatCurrency(route.totalPrice, route.currency)}</span>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Passengers */}
        {step === 2 && (
          <section aria-labelledby="passengers-heading" className="card" style={{ padding: '1.5rem' }}>
            <h2 id="passengers-heading" style={{ fontWeight: 700, fontSize: '1.0625rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} aria-hidden="true" />
              Passenger details
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {([
                { id: 'firstName', label: 'First name', placeholder: 'John', key: 'firstName' as const },
                { id: 'lastName', label: 'Last name', placeholder: 'Doe', key: 'lastName' as const },
              ]).map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>{f.label}</label>
                  <input
                    id={f.id}
                    type="text"
                    className="input"
                    placeholder={f.placeholder}
                    value={passenger[f.key]}
                    onChange={e => setPassenger(p => ({ ...p, [f.key]: e.target.value }))}
                    autoComplete={f.key === 'firstName' ? 'given-name' : 'family-name'}
                    aria-invalid={!!errors[f.key]}
                    aria-describedby={errors[f.key] ? `${f.id}-error` : undefined}
                  />
                  {errors[f.key] && <p id={`${f.id}-error`} role="alert" style={{ fontSize: '0.75rem', color: '#DC2626', margin: '0.25rem 0 0' }}>{errors[f.key]}</p>}
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="email" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>Email address</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="john.doe@example.com"
                  value={passenger.email}
                  onChange={e => setPassenger(p => ({ ...p, email: e.target.value }))}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <p id="email-error" role="alert" style={{ fontSize: '0.75rem', color: '#DC2626', margin: '0.25rem 0 0' }}>{errors.email}</p>}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="phone" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>Phone number</label>
                <input
                  id="phone"
                  type="tel"
                  className="input"
                  placeholder="+1 555 000 0000"
                  value={passenger.phone}
                  onChange={e => setPassenger(p => ({ ...p, phone: e.target.value }))}
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && <p id="phone-error" role="alert" style={{ fontSize: '0.75rem', color: '#DC2626', margin: '0.25rem 0 0' }}>{errors.phone}</p>}
              </div>
            </div>
          </section>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <section aria-labelledby="payment-heading" className="card" style={{ padding: '1.5rem' }}>
            <h2 id="payment-heading" style={{ fontWeight: 700, fontSize: '1.0625rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} aria-hidden="true" />
              Secure payment
            </h2>

            {/* Payment method selector */}
            <fieldset style={{ border: 'none', padding: 0, margin: '0 0 1.25rem' }}>
              <legend style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--color-text-muted)' }}>Choose payment method</legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.625rem' }}>
                {([
                  { id: 'card' as const, label: 'Credit card', icon: '💳' },
                  { id: 'apple' as const, label: 'Apple Pay', icon: '' },
                  { id: 'google' as const, label: 'Google Pay', icon: '🔵' },
                  { id: 'points' as const, label: 'Points (2840)', icon: '⭐' },
                ] as const).map(opt => (
                  <label
                    key={opt.id}
                    htmlFor={`pay-${opt.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer',
                      border: `1.5px solid ${paymentMethod === opt.id ? '#2563EB' : 'var(--color-border)'}`,
                      backgroundColor: paymentMethod === opt.id ? 'rgba(37,99,235,0.07)' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      id={`pay-${opt.id}`}
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                      style={{ accentColor: '#2563EB' }}
                    />
                    <span aria-hidden="true">{opt.icon}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Card form */}
            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div>
                  <label htmlFor="card-number" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>Card number</label>
                  <input
                    id="card-number"
                    type="text"
                    className="input"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    autoComplete="cc-number"
                    inputMode="numeric"
                    aria-invalid={!!errors.cardNumber}
                    aria-describedby={errors.cardNumber ? 'card-number-error' : undefined}
                  />
                  {errors.cardNumber && <p id="card-number-error" role="alert" style={{ fontSize: '0.75rem', color: '#DC2626', margin: '0.25rem 0 0' }}>{errors.cardNumber}</p>}
                </div>
                <div>
                  <label htmlFor="card-name" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>Cardholder name</label>
                  <input
                    id="card-name"
                    type="text"
                    className="input"
                    placeholder="JOHN DOE"
                    value={cardName}
                    onChange={e => setCardName(e.target.value.toUpperCase())}
                    autoComplete="cc-name"
                    aria-invalid={!!errors.cardName}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <div>
                    <label htmlFor="card-expiry" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>Expiry</label>
                    <input
                      id="card-expiry"
                      type="text"
                      className="input"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      autoComplete="cc-exp"
                      inputMode="numeric"
                      aria-invalid={!!errors.cardExpiry}
                    />
                    {errors.cardExpiry && <p role="alert" style={{ fontSize: '0.75rem', color: '#DC2626', margin: '0.25rem 0 0' }}>{errors.cardExpiry}</p>}
                  </div>
                  <div>
                    <label htmlFor="card-cvc" style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>CVC</label>
                    <input
                      id="card-cvc"
                      type="text"
                      className="input"
                      placeholder="123"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      aria-invalid={!!errors.cardCvc}
                    />
                  </div>
                </div>
              </div>
            )}

            {(paymentMethod === 'apple' || paymentMethod === 'google') && (
              <div style={{
                textAlign: 'center', padding: '2rem',
                backgroundColor: 'var(--color-bg-secondary)', borderRadius: '0.875rem',
              }}>
                <p style={{ fontSize: '2.5rem', margin: '0 0 0.75rem' }} aria-hidden="true">
                  {paymentMethod === 'apple' ? '' : '🔵'}
                </p>
                <p style={{ fontWeight: 600, margin: '0 0 0.5rem' }}>
                  {paymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  You'll be redirected to complete payment securely
                </p>
              </div>
            )}

            {paymentMethod === 'points' && (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: '0.875rem' }}>
                <p style={{ fontWeight: 600, margin: '0 0 0.5rem', color: '#D97706' }}>⭐ Redeem loyalty points</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  You have <strong>2,840 points</strong>. This trip costs approximately <strong>1,750 points</strong>.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(22,163,74,0.08)', borderRadius: '0.75rem' }}>
              <Lock size={14} color="#16A34A" aria-hidden="true" />
              <span style={{ fontSize: '0.8125rem', color: '#16A34A', fontWeight: 500 }}>
                256-bit SSL encryption · PCI-DSS compliant · Idempotency-protected
              </span>
            </div>
          </section>
        )}

        {/* Step 4: Processing */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }} role="status" aria-live="polite" aria-label="Processing your payment">
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
              animation: 'spin 1s linear infinite',
            }}>
              <Loader2 size={32} color="white" aria-hidden="true" />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '1.375rem', margin: '0 0 0.75rem' }}>Processing your booking…</h2>
            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
              Securing your seats and confirming with providers. Do not close this page.
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* CTA */}
        {step < 4 && (
          <button onClick={goNext} className="btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1.0625rem', justifyContent: 'center' }}>
            {step === 1 ? 'Continue to passengers' : step === 2 ? 'Continue to payment' : `Pay ${formatCurrency(route.totalPrice, route.currency)}`}
          </button>
        )}
      </div>
    </main>
  );
}
