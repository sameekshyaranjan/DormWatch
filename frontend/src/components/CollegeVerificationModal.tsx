import React, { useState } from 'react';
import { FiX, FiMail, FiCheck, FiShield } from 'react-icons/fi';

interface CollegeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CollegeVerificationModal({ isOpen, onClose, onSuccess }: CollegeVerificationModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [collegeEmail, setCollegeEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  if (!isOpen) return null;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!collegeEmail.trim() || !collegeName.trim()) {
      setError('Please enter both your college email and college name.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/api/otp/send-college-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ collegeEmail, collegeName })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccessMsg('OTP sent to your college email!');
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API}/api/otp/verify-college`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ collegeEmail, otp: otpString })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccessMsg('College email verified successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      for (let i = 0; i < pastedOtp.length; i++) {
        if (index + i < 6) newOtp[index + i] = pastedOtp[i];
      }
      setOtp(newOtp);
      // Focus last filled input
      const nextInputIndex = Math.min(index + pastedOtp.length, 5);
      const nextInput = document.getElementById(`otp-${nextInputIndex}`);
      if (nextInput) nextInput.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-xl">
              <FiShield className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Verify College Status</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <FiX className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
              <FiX className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
          
          {successMsg && !error && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium flex items-center gap-2">
              <FiCheck className="h-4 w-4 flex-shrink-0" />
              {successMsg}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Verify your college email address to unlock the ability to submit safety reports and earn the Verified Student badge.
              </p>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">College Name</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Vasavi College of Engineering"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">College Email (.edu / .ac.in)</label>
                <input
                  type="email"
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  placeholder="e.g. student@vce.ac.in"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP...' : <><FiMail /> Send Verification Code</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Verification Code</h3>
                <p className="text-gray-500 text-sm">
                  We've sent a 6-digit code to <span className="font-semibold text-gray-900">{collegeEmail}</span>
                </p>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 disabled:hover:bg-blue-600"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
              
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setStep(1);
                    setSuccessMsg('');
                    setError('');
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Change email address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
