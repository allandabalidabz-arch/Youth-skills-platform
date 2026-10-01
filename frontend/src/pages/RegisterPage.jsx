import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Logo from '../components/Logo';

// Format validators (mirrors backend)
const isValidEmail    = (email)    => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone    = (phone)    => /^\+?[0-9]{7,15}$/.test(phone.trim());
const isValidLocation = (location) => /[a-zA-Z]/.test(location);
const isValidName     = (name)     => /^[a-zA-Z\s]+$/.test(name.trim());

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'youth', location: '', phone: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const touch = (field) => () => setTouched(p => ({ ...p, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    if (!isValidName(form.name)) {
      return toast.error('Name must contain letters only.');
    }
    if (!isValidEmail(form.email)) {
      return toast.error('Invalid email format.');
    }
    if (form.phone && !isValidPhone(form.phone)) {
      return toast.error('Invalid phone number format.');
    }
    if (form.location && !isValidLocation(form.location)) {
      return toast.error('Enter a valid location.');
    }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to YouthSkills, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Logo size="lg" />
          </Link>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Join the YouthSkills Program for free</p>
        </div>

        <div className="card shadow-lg">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Get Started</h1>

          {/* Role — youth only, no employer option */}
          <div className="mb-5">
            <div className="p-3 rounded-xl border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-left">
              <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">🎓 I'm a Learner</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Learn digital skills and earn certificates</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input type="text" className="input" placeholder="Your full name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value.replace(/[^a-zA-Z\s]/g, '') }))}
                onBlur={touch('name')} required />
              {touched.name && form.name && !isValidName(form.name) && (
                <p className="text-xs text-red-500 mt-1">Name must contain letters only.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <input type="email" className="input" placeholder="name@gmail.com" value={form.email} onChange={set('email')} onBlur={touch('email')} required />
              {touched.email && form.email && !isValidEmail(form.email) && (
                <p className="text-xs text-red-500 mt-1">Enter a valid email e.g. name@gmail.com</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                <input type="text" className="input" placeholder="City, Country" value={form.location} onChange={set('location')} onBlur={touch('location')} />
                {touched.location && form.location && !isValidLocation(form.location) && (
                  <p className="text-xs text-red-500 mt-1">Enter a valid location.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone (optional)</label>
                <input type="tel" className="input" placeholder="+260" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/[^0-9+]/g, '') }))}
                  onBlur={touch('phone')} />
                {touched.phone && form.phone && !isValidPhone(form.phone) && (
                  <p className="text-xs text-red-500 mt-1">Invalid phone number format.</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-12" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm Password</label>
              <input type="password" className="input" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><UserPlus className="w-5 h-5" /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
            Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
