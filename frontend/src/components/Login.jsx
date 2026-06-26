import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('admin'); // Default role matching your mockup design
  const [institutionalId, setInstitutionalId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!institutionalId || !password) {
      alert("Please enter your credentials.");
      return;
    }

    // Pass the active authenticated role state directly into App.jsx routing loops
    onLoginSuccess(role);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col justify-between font-sans">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 w-full z-10">
        <div className="flex items-center gap-2">
          {/* Swapped 🎓 emoji for crisp material school icon matching your brand layout */}
          <span className="material-symbols-outlined text-black text-2xl font-black tracking-tight flex items-center gap-1">
            school
          </span>
          <span className="text-black text-xl font-black tracking-tight">AcademeAssign</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a className="text-xs font-semibold text-gray-500 hover:text-black transition-colors" href="#">Help Center</a>
          <a className="text-xs font-semibold text-gray-500 hover:text-black transition-colors" href="#">Contact Support</a>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4 relative overflow-hidden my-auto">
        <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200">
          
          {/* Left Side: Informational Brand Messaging */}
          <div className="hidden md:flex flex-col justify-between p-8 bg-black text-white">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-4">Academic Resource & Allocation Manager</h1>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                Efficiently manage faculty workloads, course schedules, and institutional resources with our unified administrative suite.
              </p>
            </div>
            
            <div className="space-y-4 my-8">
              <div className="flex items-start gap-3">
                {/* Swapped 🛡️ emoji for structural material verified_user icon vector */}
                <div className="p-2 bg-gray-900 rounded text-emerald-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Secure Institutional Access</h3>
                  <p className="text-xs text-gray-400">Authenticated via university-wide single sign-on protocols.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {/* Swapped 📊 emoji for structural material analytics icon vector */}
                <div className="p-2 bg-gray-900 rounded text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined">analytics</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Real-time Allocation</h3>
                  <p className="text-xs text-gray-400">Monitor faculty availability and course demand instantly.</p>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-600 font-mono">
              Version 4.2.0-STABLE | © 2026 EDUALLOC
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Portal Sign-in</h2>
              <p className="text-sm text-gray-500">Welcome back. Please select your role to continue.</p>
            </div>

            {/* Dynamic Role Selector Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                type="button"
                onClick={() => setRole('admin')}
                className={`flex flex-col items-center gap-1 p-3 border rounded-lg transition-all ${
                  role === 'admin' 
                    ? 'border-black ring-2 ring-black bg-gray-50 font-bold text-black' 
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {/* Swapped ⚙️ emoji for administrative vector asset */}
                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                <span className="text-xs">Administrator</span>
              </button>

              <button 
                type="button"
                onClick={() => setRole('faculty')}
                className={`flex flex-col items-center gap-1 p-3 border rounded-lg transition-all ${
                  role === 'faculty' 
                    ? 'border-black ring-2 ring-black bg-gray-50 font-bold text-black' 
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {/* Swapped 🧑‍🏫 emoji for standard faculty school vector asset */}
                <span className="material-symbols-outlined text-xl">school</span>
                <span className="text-xs">Faculty</span>
              </button>
            </div>

            {/* SSO Button Decoration */}
            <button type="button" className="w-full h-12 mb-4 border border-gray-200 hover:bg-gray-50 transition-colors rounded flex items-center justify-center gap-2 text-xs font-semibold text-gray-700">
              {/* Swapped 🔑 emoji for clean material key symbol asset */}
              <span className="material-symbols-outlined text-sm">key</span> Sign in with Institutional SSO
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-400 font-medium">Or use internal credentials</span></div>
            </div>

            {/* Main Interactive Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {role === 'admin' ? 'Administrator ID' : 'Faculty/Staff ID'}
                </label>
                <input 
                  className="w-full h-10 px-3 border border-gray-300 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
                  placeholder={role === 'admin' ? 'e.g. AD-99238' : 'e.g. FC-11024'} 
                  type="text"
                  value={institutionalId}
                  onChange={(e) => setInstitutionalId(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                <input 
                  className="w-full h-10 px-3 border border-gray-300 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-1 cursor-pointer text-gray-500">
                  <input className="rounded border-gray-300 text-black focus:ring-black" type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a className="text-black font-semibold hover:underline" href="#">Forgot password?</a>
              </div>

              <button 
                className="w-full h-12 bg-black text-white font-semibold text-sm rounded hover:bg-gray-900 transition-colors transform active:scale-[0.99]" 
                type="submit"
              >
                Access Management System
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-500">
              First time accessing the portal? <a className="text-black font-semibold hover:underline" href="#">Request Access</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Design */}
      <footer className="bg-gray-100 border-t border-gray-200 px-6 py-3 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">AcademeAssign Portal</span>
            <span>|</span>
            <p>© 2026 University Institutional Registrar. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <a className="hover:text-black transition-colors" href="#">Support</a>
            <a className="hover:text-black transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-black transition-colors" href="#">Contact Administrator</a>
          </div>
        </div>
      </footer>
    </div>
  );
}