
import React, { useState } from 'react';
import { View } from '../types';

interface VerifyEmailProps {
  email: string | null;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => void;
  setView: (view: View) => void;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, onVerify, onResend, setView }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(code)) {
      setError('Please enter a valid 6-digit code.');
      return;
    }
    const success = await onVerify(code);
    if (!success) {
      setError('Invalid confirmation code. Please try again.');
    }
  };

  const handleViewCode = () => {
    // Retrieve code from localStorage where it was stored during registration
    const tempCode = localStorage.getItem(`verificationCode_${email}`);
    if (tempCode) {
      setVerificationCode(tempCode);
      setShowCode(true);
    }
  };

  const handleResend = () => {
    onResend();
    setShowCode(false);
    setError('');
    setCode('');
  };
  
  const inputStyles = "w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-800 tracking-[1em] text-center text-2xl font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all";
  const labelStyles = "block mb-2 text-sm font-semibold text-slate-600";

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">Verify Your Email</h2>
        <p className="text-center text-slate-500 mb-8">
            A 6-digit confirmation code was sent to <strong className="text-slate-700">{email}</strong>. Please enter it below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="code" className={labelStyles}>Confirmation Code</label>
                <input 
                    id="code" 
                    type="text" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    className={inputStyles} 
                    maxLength={6}
                    placeholder="000000"
                    required 
                />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {showCode && verificationCode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 font-semibold mb-2">Your verification code:</p>
                <p className="text-center text-2xl font-bold text-yellow-900 tracking-widest">{verificationCode}</p>
              </div>
            )}
            
            <button type="submit" className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors duration-300 shadow-sm">
                Verify Account
            </button>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={handleViewCode}
                className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors duration-300 text-sm"
              >
                View Code
              </button>
              <button 
                type="button" 
                onClick={handleResend}
                className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors duration-300 text-sm"
              >
                Resend Code
              </button>
            </div>

            <p className="text-center text-sm text-slate-500">
                Already verified?{' '}
                <button type="button" onClick={() => setView(View.LOGIN)} className="font-semibold text-cyan-600 hover:underline">
                    Login
                </button>
            </p>
        </form>
    </div>
  );
};

export default VerifyEmail;
