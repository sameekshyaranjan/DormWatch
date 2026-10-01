import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from '../components/landing/Icon';
import { AuthLayout, Field, FormAlert, SubmitButton } from '../components/landing/AuthLayout';
import { dashboardPath } from '../components/landing/SiteHeader';
import { DemoAccounts } from '../components/landing/DemoLogin';

function LoginAside() {
  return (
    <>
      <div>
        <span className="auth-kicker">Welcome back</span>
        <h1>Good to see<br />you again.</h1>
        <p>Pick up where you left off. Your saved properties, reports and alerts are waiting.</p>
      </div>

      <div className="auth-visual" aria-hidden="true">
        <figure className="auth-photo">
          <img src="/landing/building.webp" alt="" />
        </figure>
        <div className="auth-float auth-float--score">
          <span className="score-orbit" style={{ '--p': '88' } as React.CSSProperties}>
            <strong>88</strong>
            <span>Excellent</span>
          </span>
          <span>
            <small className="micro-label">KORAMANGALA</small>
            <strong>Sunshine PG</strong>
            <em><Icon name="check" size={12} /> 2 issues fixed this month</em>
          </span>
        </div>
        <div className="auth-float auth-float--alert">
          <span className="auth-float__icon"><Icon name="alert" size={15} /></span>
          <span>
            <strong>New report near you</strong>
            <small>Water supply · Ejipura</small>
          </span>
        </div>
      </div>

      <blockquote className="auth-quote">
        <p>“I avoided a leasing nightmare because a previous student uploaded photos of black mold in the bathroom.”</p>
        <footer><span>PS</span> Priya S. · Student, Bengaluru</footer>
      </blockquote>
    </>
  );
}

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Set by ProtectedRoute when a signed-out visitor hits a protected page.
  const from: string | undefined = (location.state as any)?.from?.pathname;

  // /login#demo (linked from sign-up) jumps straight to the demo accounts.
  useEffect(() => {
    if (location.hash !== '#demo') return;
    const t = window.setTimeout(() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
    return () => window.clearTimeout(t);
  }, [location.hash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);

      if (!loggedInUser) {
        setError('Login failed');
        return;
      }

      // One login for everyone: send each role to its own area, or back to
      // the page they were trying to open if it belongs to that area.
      const role = loggedInUser.role;
      const canReturn =
        !!from &&
        (role === 'owner'
          ? from.startsWith('/owner')
          : role === 'admin'
            ? from.startsWith('/admin')
            : !from.startsWith('/owner') && !from.startsWith('/admin'));
      navigate(canReturn ? from : dashboardPath(role), { replace: true });
    } catch (err: any) {
      if (err.message?.includes('verify') || err.message?.includes('not verified')) {
        navigate('/verify-email', { state: { email: email } });
        return;
      }
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout aside={<LoginAside />}>
      <div className="auth-head">
        <span className="section-index">LOG IN</span>
        <h2>Log in to DormWatch</h2>
        <p>One login for students and property owners.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate={false}>
        {error && <FormAlert>{error}</FormAlert>}

        <Field
          id="email-address"
          label="Email"
          icon="mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Field
          id="password"
          label="Password"
          icon="lock"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelAction={<Link className="field-link" to="/forgot-password">Forgot password?</Link>}
        />

        <SubmitButton loading={loading} loadingText="Signing in…">Log in</SubmitButton>
      </form>

      <div className="auth-switch">
        New to DormWatch? <Link to="/register">Create a free account</Link>
      </div>

      <DemoAccounts />

      <div className="auth-foot">
        <Link to="/owner/register" className="auth-alt">
          <span className="auth-alt__icon"><Icon name="home" size={18} /></span>
          <span>
            <strong>Own a PG or hostel?</strong>
            <small>Create an owner account to list it</small>
          </span>
          <Icon name="arrow" size={17} />
        </Link>
        <p className="auth-secure"><Icon name="shield" size={14} /> Your data is encrypted and secure.</p>
      </div>
    </AuthLayout>
  );
};
