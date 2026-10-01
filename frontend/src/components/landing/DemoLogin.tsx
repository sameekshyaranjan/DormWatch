import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type DemoRole } from '../../contexts/AuthContext';
import { Icon, type IconName } from './Icon';
import { dashboardPath } from './paths';

export const DEMO_ROLES: { role: DemoRole; label: string; icon: IconName; summary: string }[] = [
  { role: 'student', label: 'Student', icon: 'user', summary: 'Browse housing, file safety reports and track your contributions.' },
  { role: 'owner', label: 'Owner', icon: 'home', summary: 'Add properties, see reports on them and post proof of fixes.' },
  { role: 'admin', label: 'Admin', icon: 'shield', summary: 'Moderate reports, verify owners and manage users.' },
];

/** Signs into a shared demo account and opens that role's dashboard. */
export function useDemoLogin() {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState<DemoRole | null>(null);
  const [error, setError] = useState('');

  const start = async (role: DemoRole) => {
    setError('');
    setLoadingRole(role);
    try {
      const user = await demoLogin(role);
      navigate(dashboardPath(user.role), { replace: true });
    } catch (err: any) {
      setError(err.message || 'Could not start the demo. Please try again.');
    } finally {
      setLoadingRole(null);
    }
  };

  return { start, loadingRole, error };
}

/** Large role cards, used on the login page. */
export function DemoAccounts() {
  const { start, loadingRole, error } = useDemoLogin();
  return (
    <section className="demo-box" id="demo" aria-labelledby="demo-title">
      <div className="demo-box__head">
        <span className="demo-badge"><Icon name="spark" size={12} /> No sign-up needed</span>
        <h3 id="demo-title">Just exploring? Try a demo account</h3>
      </div>
      {error && <p className="demo-error" role="alert"><Icon name="alert" size={14} /> {error}</p>}
      <div className="demo-roles">
        {DEMO_ROLES.map((d) => (
          <button
            key={d.role}
            type="button"
            className="demo-role"
            onClick={() => start(d.role)}
            disabled={loadingRole !== null}
            aria-busy={loadingRole === d.role}
          >
            <span className="demo-role__icon">
              {loadingRole === d.role ? <span className="spinner spinner--dark" aria-hidden="true" /> : <Icon name={d.icon} size={18} />}
            </span>
            <span className="demo-role__text">
              <strong>{d.label}</strong>
              <small>{d.summary}</small>
            </span>
            <Icon name="arrow" size={16} />
          </button>
        ))}
      </div>
      <p className="demo-note">Demo accounts are shared, so other visitors can see what you change.</p>
    </section>
  );
}

/** Compact one-line version, used in the landing hero. */
export function DemoQuickStart() {
  const { start, loadingRole, error } = useDemoLogin();
  return (
    <div className="demo-quick">
      <span className="demo-quick__label">Try the live demo as</span>
      <div className="demo-quick__roles">
        {DEMO_ROLES.map((d) => (
          <button key={d.role} type="button" onClick={() => start(d.role)} disabled={loadingRole !== null} aria-busy={loadingRole === d.role}>
            {loadingRole === d.role ? <span className="spinner spinner--dark" aria-hidden="true" /> : <Icon name={d.icon} size={14} />}
            {d.label}
          </button>
        ))}
      </div>
      {error && <p className="demo-error" role="alert"><Icon name="alert" size={14} /> {error}</p>}
    </div>
  );
}
