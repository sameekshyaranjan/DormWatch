import React, { useState } from 'react';
import { Icon, type IconName } from './Icon';

/** Two-panel shell used by the login and registration pages. */
export function AuthLayout({ aside, children }: { aside: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="dw dw-page auth">
      <div className="auth-shell page-shell">
        <aside className="auth-aside">{aside}</aside>
        <section className="auth-panel">{children}</section>
      </div>
    </div>
  );
}

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  icon: IconName;
  /** Rendered at the right end of the label row (e.g. "Forgot password?"). */
  labelAction?: React.ReactNode;
  hint?: React.ReactNode;
}

/** Labelled input with a leading icon. Password inputs get a show/hide toggle. */
export function Field({ label, icon, labelAction, hint, id, type = 'text', ...rest }: FieldProps) {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="field">
      <div className="field-label">
        <label htmlFor={id}>{label}</label>
        {labelAction}
      </div>
      <div className="field-control">
        <Icon name={icon} size={18} />
        <input id={id} type={isPassword && reveal ? 'text' : type} {...rest} />
        {isPassword && (
          <button
            type="button"
            className="field-reveal"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            aria-pressed={reveal}
          >
            {reveal ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {hint}
    </div>
  );
}

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="form-alert" role="alert">
      <Icon name="alert" size={17} />
      <span>{children}</span>
    </div>
  );
}

export function SubmitButton({ loading, loadingText, children }: { loading: boolean; loadingText: string; children: React.ReactNode }) {
  return (
    <button type="submit" className="button button--dark button--block" disabled={loading} aria-busy={loading}>
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" /> {loadingText}
        </>
      ) : (
        <>
          {children} <Icon name="arrow" size={17} />
        </>
      )}
    </button>
  );
}
