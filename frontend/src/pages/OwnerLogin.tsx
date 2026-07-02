import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiAlertCircle, FiEye, FiEyeOff, FiCheck, FiShield
} from 'react-icons/fi';

export default function OwnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    setLoading(true);

    try {
      const user = await login(email.trim().toLowerCase(), password);
      
      if (user.role !== 'owner') {
        setError('This account is not registered as a property owner. Please use student login or register as an owner.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
        return;
      }

      window.location.href = '/owner/dashboard';
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* ─── Left Side: Branding & Value Prop ──────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-950 p-12 xl:p-20 flex-col justify-between text-slate-300 relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-20 group">
            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
              <FiShield className="h-6 w-6 text-slate-950" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              DormWatch
            </span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-semibold text-white mb-6 leading-[1.15] tracking-tight">
            Welcome back to the Owner Portal.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-16 max-w-md">
            Manage your properties, respond to student feedback, and continue building trust through transparency.
          </p>

          <div className="space-y-8">
            {[
              {
                title: 'Respond to safety reports',
                desc: 'Upload proof of resolution and communicate directly with your tenants.',
              },
              {
                title: 'Track your trust score',
                desc: 'Monitor your DormWatch Safety Index and keep your properties green.',
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
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
             <div className="bg-slate-950 p-2 rounded-lg">
                <FiShield className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-950">
                DormWatch
              </span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">
              Sign in to your account
            </h2>
            <p className="text-slate-500">
              Enter your credentials to access your properties.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                placeholder="owner@property.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-sm font-medium text-slate-900 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <Link
            to="/owner/register"
            className="w-full mt-8 py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            Create an owner account
          </Link>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center space-y-3">
            <p className="text-sm text-slate-500">
              Are you a student?{' '}
              <Link to="/login" className="text-slate-900 font-medium hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}