import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Logo from '../components/Logo';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: params.get('role') || 'youth', location: '', phone: ''
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match.');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Logo size="lg" />
          </Link>
          <p className="text-slate-500 mt-2">Join the YouthSkills Program for free</p>
        </div>

        <div className="card shadow-lg">
          <h1 className="text-xl font-bold text-slate-800 mb-6">Get Started</h1>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { value: 'youth', label: '🎓 I\'m a Learner', desc: 'Learn skills & find jobs' },
              { value: 'employer', label: '🏢 I\'m an Employer', desc: 'Post opportunities' }
            ].map(r => (
              <button key={r.value} type="button" onClick={() => setForm(p => ({ ...p, role: r.value }))}
                className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === r.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="font-semibold text-sm text-slate-800">{r.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{r.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" className="input" placeholder="Your full name" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                <input type="text" className="input" placeholder="City, Country" value={form.location} onChange={set('location')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone (optional)</label>
                <input type="tel" className="input" placeholder="+234..." value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} className="input pr-12" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input type="password" className="input" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <><UserPlus className="w-5 h-5" /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
