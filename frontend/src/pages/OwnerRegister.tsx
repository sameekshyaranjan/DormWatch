import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon, type IconName } from '../components/landing/Icon';
import { AuthLayout, Field, FormAlert } from '../components/landing/AuthLayout';

// ─── Types ───────────────────────────────────────────────────────
interface OwnerForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  propertyName: string;
  propertyCount: string;
}

interface DocumentFile {
  file: File;
  preview: string;
}

type DocKey = 'governmentId' | 'propertyProof' | 'businessRegistration';
type Documents = Record<DocKey, DocumentFile | null>;

// ─── Constants ───────────────────────────────────────────────────
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = 'JPG, PNG, WebP, PDF';
const PROPERTY_COUNTS = ['1-2', '3-5', '5-10', '10+'];

const DOCS: { key: DocKey; label: string; description: string; required: boolean }[] = [
  { key: 'governmentId', label: 'Government-issued ID', description: 'Aadhaar, PAN or driving licence', required: true },
  { key: 'propertyProof', label: 'Property ownership proof', description: 'Ownership deed or a valid lease agreement', required: true },
  { key: 'businessRegistration', label: 'Business registration', description: 'GST certificate or trade licence', required: false },
];

// ─── Helpers ─────────────────────────────────────────────────────
function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS}`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large. Maximum size: 5MB (yours: ${(file.size / 1024 / 1024).toFixed(1)}MB)`;
  }
  return null;
}

function createPreview(file: File): string {
  return file.type === 'application/pdf' ? 'pdf' : URL.createObjectURL(file);
}

// ─── Document upload (click or drag & drop) ──────────────────────
function DocumentUpload({
  label,
  description,
  required,
  doc,
  onSelect,
  onRemove,
}: {
  label: string;
  description: string;
  required: boolean;
  doc: DocumentFile | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = (file?: File | null) => {
    if (file) onSelect(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className={`upload ${doc ? 'is-filled' : ''} ${dragging ? 'is-dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        pick(e.dataTransfer.files?.[0]);
      }}
    >
      <div className="upload-head">
        <span className="upload-icon">
          <Icon name={doc ? 'check' : 'file'} size={18} />
        </span>
        <span className="upload-title">
          <strong>
            {label} {required ? <em className="req">Required</em> : <em>Optional</em>}
          </strong>
          <small>{description}</small>
        </span>
      </div>

      {doc ? (
        <div className="upload-file">
          {doc.preview === 'pdf' ? (
            <span className="upload-thumb upload-thumb--pdf">PDF</span>
          ) : (
            <img className="upload-thumb" src={doc.preview} alt="" />
          )}
          <span className="upload-file__meta">
            <strong>{doc.file.name}</strong>
            <small>{(doc.file.size / 1024 / 1024).toFixed(2)} MB</small>
          </span>
          <button type="button" onClick={() => inputRef.current?.click()} className="upload-link">Replace</button>
          <button type="button" onClick={onRemove} className="upload-remove" aria-label={`Remove ${label}`}>
            <Icon name="x" size={15} />
          </button>
        </div>
      ) : (
        <button type="button" className="upload-drop" onClick={() => inputRef.current?.click()}>
          <Icon name="upload" size={18} />
          <span><strong>Click to upload</strong> or drag a file here</span>
          <small>{ALLOWED_EXTENSIONS} · up to 5MB</small>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.pdf"
        onChange={(e) => pick(e.target.files?.[0])}
        className="sr-only"
        tabIndex={-1}
        aria-label={label}
      />
    </div>
  );
}

// ─── Left panel ──────────────────────────────────────────────────
const ownerSteps: { icon: IconName; title: string; text: string }[] = [
  { icon: 'user', title: 'Account & property', text: 'Your contact details and main property.' },
  { icon: 'file', title: 'Verification documents', text: 'A government ID and proof of ownership.' },
  { icon: 'shield', title: 'Admin review', text: 'An admin checks your documents and approves your account.' },
];

function OwnerAside({ step }: { step: 1 | 2 }) {
  return (
    <>
      <div>
        <span className="auth-kicker">For property owners</span>
        <h1>Turn good upkeep<br />into trust.</h1>
        <p>Show students you fix problems fast. Resolved issues raise your Trust Score and fill your rooms.</p>
      </div>

      <ol className="auth-benefits owner-steps">
        {ownerSteps.map((s, i) => {
          const state = i + 1 < step ? 'done' : i + 1 === step ? 'current' : '';
          return (
            <li key={s.title} className={state ? `is-${state}` : ''}>
              <span className="auth-benefits__num">0{i + 1}</span>
              <span className="auth-benefits__icon">
                <Icon name={state === 'done' ? 'check' : s.icon} size={18} />
              </span>
              <span>
                <strong>{s.title}</strong>
                <small>{s.text}</small>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="owner-proof" aria-hidden="true">
        <figure><img src="/landing/fix-before.webp" alt="" /><figcaption>Reported</figcaption></figure>
        <span className="owner-proof__arrow"><Icon name="arrow" size={16} /></span>
        <figure><img src="/landing/fix-after.webp" alt="" /><figcaption>Fixed</figcaption></figure>
        <span className="owner-proof__score">Trust Score <b>64</b> <Icon name="arrow" size={12} /> <b className="good">86</b></span>
      </div>
    </>
  );
}

// ─── Page ────────────────────────────────────────────────────────
export default function OwnerRegister() {
  const location = useLocation();
  // Name/email carry over when arriving from the general sign-up page.
  const prefill = (location.state || {}) as { name?: string; email?: string };

  const [formData, setFormData] = useState<OwnerForm>({
    name: prefill.name || '',
    email: prefill.email || '',
    phone: '',
    password: '',
    confirmPassword: '',
    propertyName: '',
    propertyCount: '1-2',
  });

  const [documents, setDocuments] = useState<Documents>({
    governmentId: null,
    propertyProof: null,
    businessRegistration: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Free image previews when the page unmounts.
  const docsRef = useRef(documents);
  docsRef.current = documents;
  useEffect(
    () => () => {
      Object.values(docsRef.current).forEach((d) => d && d.preview !== 'pdf' && URL.revokeObjectURL(d.preview));
    },
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectDocument = (docType: DocKey, file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setDocuments((prev) => {
      const old = prev[docType];
      if (old && old.preview !== 'pdf') URL.revokeObjectURL(old.preview);
      return { ...prev, [docType]: { file, preview: createPreview(file) } };
    });
  };

  const removeDocument = (docType: DocKey) => {
    setDocuments((prev) => {
      const doc = prev[docType];
      if (doc && doc.preview !== 'pdf') URL.revokeObjectURL(doc.preview);
      return { ...prev, [docType]: null };
    });
  };

  const validateStep1 = (): boolean => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please fill in all required fields');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return false;
    }
    if (!formData.propertyName.trim()) {
      setError('Property name is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNextStep = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!documents.governmentId) {
      setError('Government-issued ID is required');
      return;
    }
    if (!documents.propertyProof) {
      setError('Property proof document is required');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('email', formData.email.trim().toLowerCase());
      submitData.append('phone', formData.phone.trim());
      submitData.append('password', formData.password);
      submitData.append('propertyName', formData.propertyName.trim());
      submitData.append('propertyCount', formData.propertyCount);
      submitData.append('role', 'owner');

      submitData.append('governmentId', documents.governmentId.file);
      submitData.append('propertyProof', documents.propertyProof.file);
      if (documents.businessRegistration) {
        submitData.append('businessRegistration', documents.businessRegistration.file);
      }

      const response = await fetch(`${API}/api/auth/register-owner`, {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();
      // server.js returns { token, user }; src/index.ts returns { data: { token, user } }.
      const token = data.token ?? data.data?.token;
      const newUser = data.user ?? data.data?.user;

      if (response.ok && data.success && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        refreshUser();
        setTimeout(() => navigate('/owner/dashboard'), 100);
      } else {
        setError(data.message || data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Connection error. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const requiredDocsDone = Boolean(documents.governmentId && documents.propertyProof);

  return (
    <AuthLayout aside={<OwnerAside step={step} />}>
      <div className="auth-head">
        <span className="section-index">OWNER SIGN-UP</span>
        <h2>{step === 1 ? 'Create your owner account' : 'Verify your ownership'}</h2>
        <p>
          {step === 1
            ? 'Manage your properties and respond to student reports.'
            : 'Owners are verified by hand to keep DormWatch trustworthy. Upload clear copies.'}
        </p>
      </div>

      <ol className="stepper" aria-label="Sign-up progress">
        {['Account', 'Documents'].map((label, i) => {
          const n = (i + 1) as 1 | 2;
          return (
            <li key={label} className={step === n ? 'is-current' : step > n ? 'is-done' : ''} aria-current={step === n ? 'step' : undefined}>
              <span>{step > n ? <Icon name="check" size={13} /> : n}</span>
              {label}
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <form className="auth-form step-pane" onSubmit={handleNextStep} noValidate>
          {error && <FormAlert>{error}</FormAlert>}

          <div className="field-row">
            <Field id="owner-name" label="Full name" icon="user" name="name" autoComplete="name" required placeholder="Your full name" value={formData.name} onChange={handleChange} />
            <Field id="owner-phone" label="Phone" icon="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
          </div>

          <Field id="owner-email" label="Work email" icon="mail" name="email" type="email" autoComplete="email" required placeholder="you@yourproperty.com" value={formData.email} onChange={handleChange} />

          <Field id="owner-property" label="Main property name" icon="home" name="propertyName" required placeholder="e.g. Sunshine PG" value={formData.propertyName} onChange={handleChange} />

          <fieldset className="chip-field">
            <legend>Properties you manage</legend>
            <div className="chip-options">
              {PROPERTY_COUNTS.map((count) => (
                <label key={count} className={formData.propertyCount === count ? 'is-active' : ''}>
                  <input
                    type="radio"
                    name="propertyCount"
                    value={count}
                    checked={formData.propertyCount === count}
                    onChange={handleChange}
                  />
                  {count}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field-row">
            <Field id="owner-password" label="Password" icon="lock" name="password" type="password" autoComplete="new-password" required minLength={6} placeholder="At least 6 characters" value={formData.password} onChange={handleChange} />
            <Field
              id="owner-confirm"
              label="Confirm password"
              icon="lock"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={handleChange}
              hint={
                formData.confirmPassword.length > 0 && (
                  <p className={`field-hint ${passwordsMatch ? 'field-hint--good' : 'field-hint--warn'}`}>
                    <Icon name={passwordsMatch ? 'check' : 'alert'} size={14} /> {passwordsMatch ? 'Passwords match' : "Passwords don't match yet"}
                  </p>
                )
              }
            />
          </div>

          <button type="submit" className="button button--dark button--block">
            Continue to documents <Icon name="arrow" size={17} />
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="auth-form step-pane" onSubmit={handleSubmit}>
          {error && <FormAlert>{error}</FormAlert>}

          <div className="uploads">
            {DOCS.map((d) => (
              <DocumentUpload
                key={d.key}
                label={d.label}
                description={d.description}
                required={d.required}
                doc={documents[d.key]}
                onSelect={(file) => selectDocument(d.key, file)}
                onRemove={() => removeDocument(d.key)}
              />
            ))}
          </div>

          <p className="owner-note">
            <Icon name="lock" size={14} />
            <span>An admin reviews these documents to verify your account.</span>
          </p>

          <div className="step-actions">
            <button type="button" className="button button--ghost" onClick={handleBackStep}>
              <Icon name="arrowLeft" size={16} /> Back
            </button>
            <button type="submit" className="button button--dark" disabled={loading || !requiredDocsDone} aria-busy={loading}>
              {loading ? (
                <><span className="spinner" aria-hidden="true" /> Submitting…</>
              ) : (
                <>Submit for verification <Icon name="arrow" size={17} /></>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
        <span className="auth-switch__sep" aria-hidden="true">·</span>
        Student? <Link to="/register">Student sign-up</Link>
      </div>
    </AuthLayout>
  );
}
