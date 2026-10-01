import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Icon } from './Icon';
import { dashboardPath } from './paths';
import { DEMO_ROLES, useDemoLogin } from './DemoLogin';

export { dashboardPath };

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`logo ${inverse ? 'logo--inverse' : ''}`} to="/" aria-label="DormWatch home">
      <span className="logo-eye"><Icon name="eye" size={18} /></span>
      <span>DormWatch</span>
    </Link>
  );
}

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'te', label: 'తె' },
];

type NavItem = { label: string; to: string; hash?: boolean };

/**
 * The one header used across DormWatch. Sticky, collapses on scroll, adapts
 * its links to the signed-in role, and links to landing-page sections from
 * any route.
 */
export function SiteHeader() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  // Close menus on navigation, Escape, or a click outside the account menu.
  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  const lang = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2);
  const demo = useDemoLogin();
  const isDemo = !!user?.isDemo;

  // Sticky elements below the header (e.g. the listings toolbar) read this.
  useEffect(() => {
    document.documentElement.style.setProperty('--dw-header-h', isDemo ? '108px' : '64px');
  }, [isDemo]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items: NavItem[] = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.explore'), to: '/accommodations' },
  ];
  if (!user) {
    items.push({ label: 'How it works', to: '#how', hash: true }, { label: 'For Owners', to: '#owners', hash: true });
  } else if (user.role === 'student') {
    items.push({ label: t('nav.dashboard'), to: '/dashboard' }, { label: t('nav.myContributions'), to: '/my-reports' });
  } else if (user.role === 'owner') {
    items.push({ label: t('nav.ownerPanel'), to: '/owner/dashboard' }, { label: 'Add property', to: '/owner/add-property' });
  } else if (user.role === 'admin') {
    items.push({ label: t('nav.moderation'), to: '/admin' }, { label: 'Owner checks', to: '/admin/owner-verifications' });
  }

  const renderItem = (item: NavItem) => {
    if (item.hash) {
      // Plain anchors on the landing page; elsewhere route home and let it scroll.
      return isHome ? (
        <a key={item.to} href={item.to}>{item.label}</a>
      ) : (
        <Link key={item.to} to={`/${item.to}`}>{item.label}</Link>
      );
    }
    return (
      <NavLink key={item.to} to={item.to} end className={({ isActive }) => (isActive ? 'is-active' : '')}>
        {item.label}
      </NavLink>
    );
  };

  const firstName = user?.name?.split(' ')[0] || 'Account';
  const initial = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="dw dw-header-host">
      <header className={`site-header ${scrolled || !isHome ? 'is-scrolled' : ''}`}>
        <div className="nav-wrap">
          <Logo />
          <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
            {items.map(renderItem)}
            <div className="language" role="group" aria-label="Language">
              {languages.map((l, i) => (
                <React.Fragment key={l.code}>
                  {i > 0 && <span aria-hidden="true">/</span>}
                  <button
                    className={lang === l.code ? 'active' : ''}
                    aria-pressed={lang === l.code}
                    onClick={() => i18n.changeLanguage(l.code)}
                  >
                    {l.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
            {user ? (
              <>
                {user.role === 'student' && (
                  <Link className="mobile-only" to="/report">{t('nav.reportIssue')}</Link>
                )}
                <Link className="mobile-only" to="/profile">{t('nav.myProfile')}</Link>
                <button className="mobile-only nav-logout" onClick={handleLogout}>{t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link className="mobile-only" to="/login">{t('nav.login')}</Link>
                <Link className="button button--dark mobile-only" to="/register">{t('nav.joinNow')}</Link>
              </>
            )}
          </nav>

          <div className="nav-actions">
            {user ? (
              <>
                {user.role === 'student' && (
                  <Link className="button button--dark button--small" to="/report">
                    <Icon name="alert" size={15} /> {t('nav.reportIssue')}
                  </Link>
                )}
                <div className="account" ref={menuRef}>
                  <button
                    className={`account-trigger ${menuOpen ? 'is-open' : ''}`}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <span className="account-avatar">{initial}</span>
                    <span className="account-name">
                      <strong>{firstName}</strong>
                      <small>{user.role}</small>
                    </span>
                    <Icon name="chevron" size={16} />
                  </button>
                  {menuOpen && (
                    <div className="account-menu" role="menu">
                      <div className="account-menu__head">
                        <small>{t('nav.signedInAs')}</small>
                        <strong>{user.email}</strong>
                      </div>
                      <Link role="menuitem" to={dashboardPath(user.role)}><Icon name="home" size={16} /> {t('nav.dashboard')}</Link>
                      <Link role="menuitem" to="/profile"><Icon name="user" size={16} /> {t('nav.myProfile')}</Link>
                      {user.role === 'student' && (
                        <Link role="menuitem" to="/my-reports"><Icon name="photo" size={16} /> {t('nav.myContributions')}</Link>
                      )}
                      <button role="menuitem" className="danger" onClick={handleLogout}>
                        <Icon name="arrowLeft" size={16} /> {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => (isActive ? 'is-active' : '')}>{t('nav.login')}</NavLink>
                <Link className="button button--dark button--small" to="/register">{t('nav.joinNow')}</Link>
              </>
            )}
          </div>

          <button
            className="menu-button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? 'x' : 'menu'} />
          </button>
        </div>
        <span className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      </header>
      {isDemo && user && (
        <div className="demo-bar" role="region" aria-label="Demo mode">
          <div className="nav-wrap">
            <p>
              <span className="demo-bar__tag">Demo</span>
              <span className="demo-bar__text">
                You're exploring as <strong>{user.name}</strong>. Changes are shared with other visitors.
              </span>
            </p>
            <div className="demo-bar__actions">
              <span className="demo-bar__label">Switch to</span>
              {DEMO_ROLES.filter((d) => d.role !== user.role).map((d) => (
                <button key={d.role} onClick={() => demo.start(d.role)} disabled={demo.loadingRole !== null}>
                  {demo.loadingRole === d.role ? <span className="spinner" aria-hidden="true" /> : <Icon name={d.icon} size={13} />}
                  {d.label}
                </button>
              ))}
              <button
                className="demo-bar__exit"
                onClick={() => {
                  // Full page load: dashboards redirect to /login as soon as the
                  // user is cleared, which would otherwise beat a client-side navigate.
                  logout();
                  window.location.assign('/register');
                }}
              >
                Exit &amp; sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
