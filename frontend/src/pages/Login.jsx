import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-primary-50 p-6">
      <div className="w-full max-w-md bg-white border border-primary-200 rounded-lg-custom shadow-lg-flat p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-md-custom bg-accent-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            W
          </div>
          <h2 className="text-xl font-bold text-primary-900 m-0">Welcome back</h2>
          <p className="text-sm text-primary-500 mt-1">Please sign in to manage your workflows</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary-700 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-primary-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-md-custom text-sm focus:outline-none focus:border-accent-500 transition-colors placeholder-primary-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-primary-700 block">Password</label>
              <a href="#" className="text-xs font-medium text-accent-500 hover:text-accent-600">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-primary-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 border border-primary-200 rounded-md-custom text-sm focus:outline-none focus:border-accent-500 transition-colors placeholder-primary-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-primary-400 hover:text-primary-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-primary-900 text-white rounded-md-custom text-sm font-semibold hover:bg-primary-950 transition-colors focus:outline-none"
          >
            Sign In to System
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-primary-500">
            Don't have an account? <span className="text-accent-500 hover:text-accent-600 cursor-pointer font-medium">Contact administrator</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
