import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState & { submit: string }>>({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required.';
    if (!form.lastName.trim()) next.lastName = 'Last name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) next.email = 'Valid email is required.';
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate registration then auto-login with demo account
    await new Promise(r => setTimeout(r, 1000));
    try {
      await login('user@demo.com', 'demo');
      navigate('/dashboard', { replace: true });
    } catch {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['#DC2626', '#D97706', '#2563EB', '#16A34A'];

  const fields: Array<{ id: keyof FormState; label: string; type?: string; autocomplete: string; placeholder: string }> = [
    { id: 'firstName', label: 'First name', autocomplete: 'given-name', placeholder: 'Jane' },
    { id: 'lastName', label: 'Last name', autocomplete: 'family-name', placeholder: 'Smith' },
    { id: 'email', label: 'Email address', type: 'email', autocomplete: 'email', placeholder: 'jane@example.com' },
  ];

  return (
    <main id="main-content" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', backgroundColor: 'var(--color-bg-secondary)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '1rem', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #2563EB, #14B8A6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem',
          }} aria-hidden="true">✈</div>
          <h1 style={{ fontWeight: 900, fontSize: '1.625rem', margin: '0 0 0.375rem' }}>Create your account</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Start planning smarter journeys today</p>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          {errors.submit && (
            <div role="alert" style={{
              display: 'flex', gap: '0.625rem', alignItems: 'flex-start',
              padding: '0.875rem', borderRadius: '0.625rem',
              backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
              marginBottom: '1.25rem',
            }}>
              <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#DC2626' }}>{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.125rem' }}>
              {['firstName', 'lastName'].map(key => {
                const f = fields.find(x => x.id === key)!;
                return (
                  <div key={f.id}>
                    <label htmlFor={f.id} style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type={f.type ?? 'text'}
                      className="input"
                      value={form[f.id]}
                      onChange={set(f.id)}
                      placeholder={f.placeholder}
                      autoComplete={f.autocomplete}
                      required
                      aria-invalid={!!errors[f.id]}
                      aria-describedby={errors[f.id] ? `${f.id}-error` : undefined}
                      style={{ width: '100%' }}
                    />
                    {errors[f.id] && <p id={`${f.id}-error`} role="alert" style={{ fontSize: '0.75rem', color: '#DC2626', margin: '0.375rem 0 0' }}>{errors[f.id]}</p>}
                  </div>
                );
              })}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.125rem' }}>
              <label htmlFor="email" style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Email address</label>
              <input
                id="email" type="email" className="input"
                value={form.email} onChange={set('email')}
                placeholder="jane@example.com" autoComplete="email" required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                style={{ width: '100%' }}
              />
              {errors.email && <p id="email-error" role="alert" style={{ fontSize: '0.75rem', color: '#DC2626', margin: '0.375rem 0 0' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.125rem' }}>
              <label htmlFor="password" style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  value={form.password} onChange={set('password')}
                  placeholder="Min. 8 characters" autoComplete="new-password" required
                  aria-invalid={!!errors.password}
                  aria-describedby="password-strength"
                  style={{ width: '100%', paddingRight: '3rem' }}
                />
                <button
                  type="button" onClick={() => setShowPassword(o => !o)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.25rem' }}
                >
                  {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
              </div>
              {passwordStrength !== null && (
                <div id="password-strength" aria-live="polite" style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < passwordStrength ? strengthColor[passwordStrength - 1] : 'var(--color-border)', transition: 'background-color 0.2s' }} aria-hidden="true" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: strengthColor[(passwordStrength ?? 1) - 1], margin: 0 }}>
                    {passwordStrength > 0 ? strengthLabel[passwordStrength - 1] : 'Too short'}
                  </p>
                </div>
              )}
              {errors.password && <p role="alert" style={{ fontSize: '0.75rem', color: '#DC2626', margin: '0.375rem 0 0' }}>{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Confirm password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword" type={showPassword ? 'text' : 'password'} className="input"
                  value={form.confirmPassword} onChange={set('confirmPassword')}
                  placeholder="Repeat your password" autoComplete="new-password" required
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
                  style={{ width: '100%', paddingRight: '3rem' }}
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle size={16} color="#16A34A" aria-hidden="true" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </div>
              {errors.confirmPassword && <p id="confirm-error" role="alert" style={{ fontSize: '0.75rem', color: '#DC2626', margin: '0.375rem 0 0' }}>{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                <>
                  <UserPlus size={16} aria-hidden="true" />
                  Create account
                </>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1.25rem' }}>
          By creating an account you agree to our{' '}
          <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Terms</Link> and{' '}
          <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Privacy Policy</Link>.
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
