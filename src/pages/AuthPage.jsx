import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Field } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <Card glass className="auth-card">
        <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
        <p className="muted">{isLogin ? 'Log in to continue your practice.' : 'Start tracking your interview progress.'}</p>
        <form className="stack" onSubmit={onSubmit} noValidate>
          {!isLogin && <Field id="name" label="Name" placeholder="Your name" value={form.name} onChange={set('name')} autoComplete="name" />}
          <Field id="email" type="email" label="Email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email" />
          <Field id="password" type="password" label="Password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} autoComplete={isLogin ? 'current-password' : 'new-password'} />
          {error && <p role="alert" style={{ color: 'var(--danger)', fontSize: 'var(--fs-sm)' }}>{error}</p>}
          <Button type="submit" disabled={busy}>{busy ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}</Button>
          <p className="muted" style={{ margin: 0 }}>
            {isLogin ? 'New here? ' : 'Already have an account? '}
            <Link to={isLogin ? '/register' : '/login'} style={{ color: 'var(--accent)' }}>{isLogin ? 'Create an account' : 'Log in'}</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
