
import React, { useState } from 'react';

interface RegisterProps {
  onRegister: (email: string, password: string) => Promise<boolean>;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    onRegister(email, password);
  };
  
  const inputStyles = "w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all";
  const labelStyles = "block mb-2 text-sm font-semibold text-slate-600";

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800">Create Account</h2>
        <p className="text-center text-slate-500 mb-8">Join to start reporting lost and found items.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className={labelStyles}>Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} required />
            </div>
            <div>
                <label htmlFor="password" className={labelStyles}>Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyles} required />
            </div>
            <div>
                <label htmlFor="confirmPassword" className={labelStyles}>Confirm Password</label>
                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputStyles} required />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" className="w-full bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors duration-300 shadow-sm">
                Register
            </button>
        </form>
    </div>
  );
};

export default Register;
