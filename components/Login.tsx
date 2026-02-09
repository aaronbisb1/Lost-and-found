
import React, { useState } from 'react';
import { View } from '../types';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  setView: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await onLogin(email, password);
    if (!result.success && result.error) {
      setError(result.error);
    }
  };
  
  const inputStyles = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all";
  const labelStyles = "block mb-2 text-sm font-semibold text-slate-600";

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">Login</h2>
        <p className="text-center text-slate-500 mb-8">Access your account to manage your items.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className={labelStyles}>Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} required />
            </div>
            <div>
                <label htmlFor="password" className={labelStyles}>Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyles} required />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors duration-300 shadow-sm">
                Login
            </button>
            <p className="text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => setView(View.REGISTER)} className="font-semibold text-cyan-600 hover:underline">
                    Register here
                </button>
            </p>
        </form>
    </div>
  );
};

export default Login;
