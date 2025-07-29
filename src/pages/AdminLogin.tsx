import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient.ts';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use Supabase Auth for admin login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        setError(error.message || 'Invalid email or password');
      } else if (data && data.user) {
        // Login successful
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminEmail', credentials.email);
        localStorage.setItem('adminToken', data.session?.access_token || 'authenticated');
        navigate('/admin-dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-br from-white via-slate-50 to-cyan-50" aria-label="Admin Login">
      <div className="max-w-md w-full mx-4 reveal animate-fade-in-up">
        <div className="modern-card p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-large">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
              SPAARK ELITE EVENTS
            </h1>
            <p className="text-xl italic mb-4 text-black" style={{ fontFamily: 'Playfair Display, serif' }}>
              Luxury. Celebration. Perfection.
            </p>
            <h2 className="text-2xl font-light dark-blue-hero-text mb-4">
              Admin Access Portal
            </h2>
            <p className="text-gray-600">Sign in to manage your events platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-cyan-700 font-semibold mb-2">Email</label>
              <div className="relative">
                {!credentials.email && (
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                )}
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={credentials.email}
                  onChange={handleInputChange}
                  className={`modern-input ${!credentials.email ? 'pl-10' : 'pl-4'}`}
                  placeholder="     Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-cyan-700 font-semibold mb-2">Password</label>
              <div className="relative">
                {!credentials.password && (
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                )}
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className={`modern-input ${!credentials.password ? 'pl-10' : 'pl-4'} pr-12`}
                  placeholder="     Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center shadow-large"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Secure access for authorized administrators only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
