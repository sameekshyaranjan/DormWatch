import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon, type IconName } from '../components/landing/Icon';
import { AuthLayout, Field, FormAlert, SubmitButton } from '../components/landing/AuthLayout';

// College domains that earn the Verified Student badge.
const isCollegeEmail = (email: string) => {
  const lowerEmail = email.toLowerCase();
  return (
    lowerEmail.endsWith('.ac.in') ||
    lowerEmail.endsWith('.edu.in') ||
    lowerEmail.endsWith('.edu') ||
    lowerEmail.endsWith('.ernet.in') ||
    lowerEmail.endsWith('.res.in')
  );
};

const passwordScore = (password: string) => {
  let strength = 0;
  if (password.length > 5) strength += 1;
  if (password.length > 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
};

const benefits: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: 'Report without fear', text: 'Your identity is protected while your voice is heard.' },
  { icon: 'camera', title: 'See the real photos', text: 'Verified reports and evidence from people who lived there.' },
  { icon: 'check', title: 'Earn a Verified Student badge', text: 'Sign up with your college email so your reports carry more weight.' },
];

function RegisterAside() {
  return (
    <>
      <div>
        <span className="auth-kicker">Join DormWatch</span>
        <h1>Make student<br />housing honest.</h1>
        <p>Free for students and parents. It takes less than a minute.</p>
      </div>

      <ol className="auth-benefits">
        {benefits.map((b, i) => (
          <li key={b.title}>
            <span className="auth-benefits__num">0{i + 1}</span>
            <span className="auth-benefits__icon"><Icon name={b.icon} size={18} /></span>
            <span>
              <strong>{b.title}</strong>
              <small>{b.text}</small>
            </span>
          </li>
        ))}
      </ol>

      <div className="auth-strip" aria-hidden="true">
        <img src="/landing/evidence-wall.webp" alt="" />
        <img src="/landing/reality-water.webp" alt="" />
        <img src="/landing/fix-after.webp" alt="" />
        <span className="auth-strip__tag"><Icon name="spark" size={12} /> AI-verified evidence</span>
      </div>
    </>
  );
}

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = useMemo(() => passwordScore(password), [password]);
  const strengthLabel = strength < 2 ? 'Weak' : strength < 4 ? 'Okay' : 'Strong';
  const strengthTone = strength < 2 ? 'weak' : strength < 4 ? 'okay' : 'strong';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, 'student');
      navigate('/verify-email', { state: { email: email } });
    } catch (err: any) {
      if (err.message?.includes('verify') || err.message?.includes('Verification')) {
        navigate('/verify-email', { state: { email: email } });
        return;
      }
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Inline feedback on the email field about the Verified Student badge.
  const domain = email.includes('@') ? email.split('@')[1] : '';
  let emailHint: React.ReactNode = (
    <p className="field-hint">Use your college email (e.g. name@vce.ac.in) to get a Verified Student badge.</p>
  );
  if (domain && isCollegeEmail(email)) {
    emailHint = (
      <p className="field-hint field-hint--good">
        <Icon name="check" size={14} /> College email detected. You'll get a Verified Student badge.
      </p>
    );
  } else if (domain.includes('.')) {
    emailHint = (
      <p className="field-hint field-hint--warn">
        <Icon name="alert" size={14} /> Personal email works too, but only college emails get the Verified Student badge.
      </p>
    );
  }

  // Owners need documents and admin approval, so they get their own flow.
  // Carry over anything already typed.
  const goToOwnerSignup = () => navigate('/owner/register', { state: { name, email } });

  return (
    <AuthLayout aside={<RegisterAside />}>
      <div className="auth-head">
        <span className="section-index">CREATE ACCOUNT</span>
        <h2>Join DormWatch</h2>
        <p>Find safe housing and help the next student do the same.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <FormAlert>{error}</FormAlert>}

        <div className="segmented" role="group" aria-label="Account type">
          <span className="segmented-option is-active" aria-current="true">
            <Icon name="user" size={16} /> Student / resident
          </span>
          <button type="button" className="segmented-option" onClick={goToOwnerSignup}>
            <Icon name="home" size={16} /> Property owner <Icon name="arrow" size={14} />
          </button>
        </div>

        <Field
          id="name"
          label="Full name"
          icon="user"
          name="name"
          required
          autoComplete="name"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Field
          id="email-address"
          label="Email"
          icon="mail"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@college.ac.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          hint={emailHint}
        />

        <Field
          id="password"
          label="Password"
          icon="lock"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={
            password.length > 0 && (
              <div className={`strength strength--${strengthTone}`} aria-live="polite">
                <div className="strength-bars">
                  {[0, 1, 2, 3, 4].map((i) => <span key={i} className={i < strength ? 'on' : ''} />)}
                </div>
                <span>{strengthLabel}</span>
              </div>
            )
          }
        />

        <SubmitButton loading={loading} loadingText="Creating your account…">Create account</SubmitButton>

        <p className="auth-terms">
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>

      <div className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </AuthLayout>
  );
};
