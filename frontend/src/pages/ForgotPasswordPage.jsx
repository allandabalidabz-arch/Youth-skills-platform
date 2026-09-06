import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Logo from '../components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Logo size="lg" />
          </Link>
          <p className="text-slate-500 mt-2">Reset your password</p>
        </div>

        <div className="card shadow-lg">
          {!submitted ? (
            <>
              <h1 className="text-xl font-bold text-slate-800 mb-2">Forgot Password</h1>
              <p className="text-sm text-slate-500 mb-6">
                Enter your registered email address and we will send you a password reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      className="input pl-10"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading
                    ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    : <><Send className="w-4 h-4" /> Send Reset Link</>
                  }
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Check your notifications</h2>
              <p className="text-sm text-slate-500 mb-2">
                If <span className="font-semibold text-slate-700">{email}</span> is registered,
                a password reset link has been sent.
              </p>
              <p className="text-xs text-slate-400 mb-6">
                Check your in-app notifications after logging in, or use the link shown in the server console during development.
              </p>
              <Link to="/login" className="btn-primary w-full py-3">
                Back to Login
              </Link>
            </div>
          )}

          {!submitted && (
            <div className="mt-5 text-center">
              <Link to="/login" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 justify-center">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
