import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiShield,
  FiHome,
  FiCheck,
  FiAlertCircle,
  FiUploadCloud,
  FiFileText,
  FiX,
  FiInfo,
} from 'react-icons/fi';

// ─── Types ───────────────────────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  propertyName: string;
  propertyCount: string;
}

interface DocumentFile {
  file: File;
  preview: string;
}

interface Documents {
  governmentId: DocumentFile | null;
  propertyProof: DocumentFile | null;
  businessRegistration: DocumentFile | null;
}

// ─── Constants ───────────────────────────────────────────────────
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = 'JPG, PNG, WebP, PDF';

// ─── Helper ──────────────────────────────────────────────────────
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
  if (file.type === 'application/pdf') {
    return 'pdf';
  }
  return URL.createObjectURL(file);
}

// ─── Component ───────────────────────────────────────────────────
export default function OwnerRegister() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
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

  const govIdRef = useRef<HTMLInputElement>(null);
  const propProofRef = useRef<HTMLInputElement>(null);
  const bizRegRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: keyof Documents
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = '';
      return;
    }

    setError('');
    setDocuments((prev) => ({
      ...prev,
      [docType]: {
        file,
        preview: createPreview(file),
      },
    }));
  };

  const removeDocument = (docType: keyof Documents) => {
    const doc = documents[docType];
    if (doc && doc.preview !== 'pdf') {
      URL.revokeObjectURL(doc.preview);
    }
    setDocuments((prev) => ({ ...prev, [docType]: null }));
    const refMap: Record<keyof Documents, React.RefObject<HTMLInputElement>> = {
      governmentId: govIdRef,
      propertyProof: propProofRef,
      businessRegistration: bizRegRef,
    };
    const ref = refMap[docType];
    if (ref.current) ref.current.value = '';
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
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.propertyName.trim()) {
      setError('Property name is required');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    if (validateStep1()) setStep(2);
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

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        refreshUser();
        setTimeout(() => navigate('/owner/dashboard'), 100);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Connection error. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Document Upload Card ───────────────────────────────────
  const DocumentUploadCard = ({
    label,
    description,
    docType,
    required,
    inputRef,
  }: {
    label: string;
    description: string;
    docType: keyof Documents;
    required: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => {
    const doc = documents[docType];
    return (
      <div className={`p-5 rounded-xl border-2 transition-all ${doc ? 'border-slate-800 bg-slate-50' : 'border-dashed border-slate-300 hover:border-slate-400 bg-white'}`}>
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {label} {required && <span className="text-red-500">*</span>}
            </h4>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </div>
          {doc && (
            <button
              type="button"
              onClick={() => removeDocument(docType)}
              className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
            >
              <FiX className="h-4 w-4 text-slate-600" />
            </button>
          )}
        </div>

        {doc ? (
          <div className="flex items-center gap-3 mt-4 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
            {doc.preview === 'pdf' ? (
              <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200">
                <FiFileText className="h-5 w-5 text-slate-600" />
              </div>
            ) : (
              <img src={doc.preview} alt={label} className="w-10 h-10 object-cover rounded-md border border-slate-200" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{doc.file.name}</p>
              <p className="text-xs text-slate-500">{(doc.file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <FiCheck className="h-5 w-5 text-green-600 mr-2" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full mt-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiUploadCloud className="h-4 w-4" />
            Upload File
          </button>
        )}
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={(e) => handleFileSelect(e, docType)} className="hidden" />
      </div>
    );
  };

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex">
      {/* ─── Left Side: Branding & Value Prop ──────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-950 p-12 xl:p-20 flex-col justify-between text-slate-300 relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10">


          <h1 className="text-4xl xl:text-5xl font-semibold text-white mb-6 leading-[1.15] tracking-tight">
            Elevate your property's reputation.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-16 max-w-md">
            Join thousands of verified property owners building trust through transparency and direct accountability.
          </p>

          <div className="space-y-8">
            {[
              {
                title: 'Public Accountability',
                desc: 'Respond to student concerns publicly and showcase your commitment to safety.',
              },
              {
                title: 'Boost Trust Scores',
                desc: "Resolve issues quickly to improve your property's DormWatch Safety Index.",
              },
              {
                title: 'Quality Tenants',
                desc: 'Attract safety-conscious students who value verified, transparent management.',
              },
            ].map((benefit, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mt-0.5 border border-slate-700">
                  <FiCheck className="h-4 w-4 text-slate-300" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-slate-600 font-medium">
          &copy; {new Date().getFullYear()} DormWatch. All rights reserved.
        </div>
      </div>

      {/* ─── Right Side: Form ──────────────────────────────────── */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 py-12 sm:px-12 xl:px-24 bg-white overflow-y-auto">
        <div className="w-full max-w-xl mx-auto">


          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">
              Create owner account
            </h2>
            <p className="text-slate-500">
              Start managing your properties and responding to reports.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-10">
            <div className={`flex-1 h-1 rounded-full ${step === 1 ? 'bg-slate-900' : 'bg-slate-200'} transition-colors`} />
            <div className={`flex-1 h-1 rounded-full ${step === 2 ? 'bg-slate-900' : 'bg-slate-200'} transition-colors`} />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Work Email</label>
                    <input
                      name="email"
                      type="email"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="jane@property.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Main Property Name</label>
                    <input
                      name="propertyName"
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="Evergreen Dorms"
                      value={formData.propertyName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Properties Managed</label>
                    <select
                      name="propertyCount"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.2em] bg-[right_1rem_center] bg-no-repeat"
                      value={formData.propertyCount}
                      onChange={handleChange}
                    >
                      <option value="1-2">1-2 Properties</option>
                      <option value="3-5">3-5 Properties</option>
                      <option value="5-10">5-10 Properties</option>
                      <option value="10+">10+ Properties</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <input
                      name="password"
                      type="password"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full mt-8 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Documents
                  <FiArrowRight />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
                  <FiInfo className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 leading-relaxed">
                    To maintain platform integrity, property owners must be manually verified. Please upload clear copies of the following.
                  </p>
                </div>

                <div className="space-y-4">
                  <DocumentUploadCard
                    label="Government-Issued ID"
                    description="Aadhaar, PAN, or Driving License"
                    docType="governmentId"
                    required={true}
                    inputRef={govIdRef}
                  />
                  <DocumentUploadCard
                    label="Property Ownership Proof"
                    description="Ownership deed or valid Lease agreement"
                    docType="propertyProof"
                    required={true}
                    inputRef={propProofRef}
                  />
                  <DocumentUploadCard
                    label="Business Registration"
                    description="GST Certificate or Trade License (Optional)"
                    docType="businessRegistration"
                    required={false}
                    inputRef={bizRegRef}
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleBackStep}
                    className="px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !documents.governmentId || !documents.propertyProof}
                    className="flex-1 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit for Verification'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-center space-y-3">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/owner/login" className="text-slate-900 font-medium hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-slate-500">
              Are you a student?{' '}
              <Link to="/register" className="text-slate-900 font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}