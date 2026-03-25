import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { motion } from 'motion/react';
import { Shield, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@velozity.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const fakeToken = "abc123";
    const fakeUser = {
      id: 1,
      name: "User",
      email: email,
    };
    login(fakeToken, fakeUser);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex bg-[#faf8ff]">
      <div className="hidden lg:flex lg:w-3/5 relative bg-[#001e4b] items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070" 
            alt="Architecture"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-tr from-[#001e4b] via-[#001e4b]/80 to-transparent z-10" />
        <div className="relative z-20 max-w-xl">
          <div className="mb-8">
            <span className="text-[#829ddb] font-bold text-xs uppercase tracking-[0.2em]">Velozity Global</span>
            <h1 className="text-5xl text-white font-black mt-2 leading-tight">
              Infrastructure for <br/>Modern Enterprise.
            </h1>
          </div>
          <p className="text-[#829ddb] text-lg leading-relaxed mb-12 max-w-md">
            Secure, scalable, and engineered for high-performance precision. Access your institutional architecture dashboard.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Shield className="text-[#829ddb] mb-3" />
              <h3 className="text-white font-bold text-sm mb-1">AES-256 Encryption</h3>
              <p className="text-[#829ddb] text-xs">Military-grade data protection protocol.</p>
            </div>
            <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Shield className="text-[#829ddb] mb-3" />
              <h3 className="text-white font-bold text-sm mb-1">Global Node Status</h3>
              <p className="text-[#829ddb] text-xs">Active monitoring across 42 regions.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex flex-col bg-white relative">
        <div className="flex justify-end p-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#f2f3ff] rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-[#131b2e] uppercase tracking-wider">System Status: Optimal</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 md:px-20 max-w-2xl mx-auto w-full">
          <div className="mb-10">
            <div className="w-12 h-1 bg-[#001e4b] mb-6" />
            <h2 className="text-3xl font-black text-[#131b2e] tracking-tight mb-2">Precision Access</h2>
            <p className="text-slate-500 text-sm">Please authenticate to access the Velozity Global console.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Institutional Email</label>
              <input 
                className="w-full bg-[#f2f3ff] border-none rounded-xl py-4 px-5 text-sm focus:ring-2 focus:ring-[#001e4b]/20 transition-all outline-none" 
                placeholder="name@velozity.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Security Cipher</label>
                <a className="text-[10px] font-bold text-[#001e4b] hover:underline uppercase tracking-widest" href="#">Forgot Password?</a>
              </div>
              <input 
                className="w-full bg-[#f2f3ff] border-none rounded-xl py-4 px-5 text-sm focus:ring-2 focus:ring-[#001e4b]/20 transition-all outline-none" 
                placeholder="••••••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#001e4b] text-white font-bold py-4 px-6 rounded-xl text-sm shadow-xl shadow-[#001e4b]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-white px-4 text-slate-400 font-medium">Alternative Auth</span>
              </div>
            </div>

            <button type="button" className="w-full border border-slate-200 hover:bg-[#f2f3ff] text-[#131b2e] font-bold py-4 px-6 rounded-xl text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <Shield className="w-5 h-5" />
              Corporate SSO Login
            </button>
          </form>

          <div className="mt-16 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Session Protocol</span>
                <span className="text-xs font-medium text-[#131b2e] flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#001e4b]" />
                  TLS 1.3 Active
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hardware Key</span>
                <span className="text-xs font-medium text-[#131b2e] flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#001e4b]" />
                  FIDO2 Supported
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer className="p-8 mt-auto text-center lg:text-left">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">
            © 2024 Precision Architect Systems • Regulatory ID: 994-VX-01
          </p>
        </footer>
      </div>
    </div>
  );
}
