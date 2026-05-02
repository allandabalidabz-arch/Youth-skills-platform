import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, MapPin, Phone, Save, Plus, X, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', location: '', phone: '', avatar: '' });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    api.get('/users/profile').then(res => {
      const u = res.data.user;
      setForm({ name: u.name || '', bio: u.bio || '', location: u.location || '', phone: u.phone || '', avatar: u.avatar || '' });
      setSkills(u.skills || []);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/profile', { ...form, skills });
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    setSavingPw(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPw(false);
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills(p => [...p, s]); setNewSkill(''); }
  };

  const removeSkill = (s) => setSkills(p => p.filter(x => x !== s));

  return (
    <div className="max-w-2xl space-y-6 fade-in">
      <div>
        <h1 className="section-title">My Profile</h1>
        <p className="section-subtitle">Manage your personal information and skills</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {[{ id: 'profile', label: 'Profile' }, { id: 'security', label: 'Security' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar */}
          <div className="card flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl overflow-hidden flex-shrink-0">
              {form.avatar ? <img src={form.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Avatar URL</label>
              <input type="url" className="input" placeholder="https://..." value={form.avatar} onChange={e => setForm(p => ({ ...p, avatar: e.target.value }))} />
            </div>
          </div>

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
              <textarea className="input h-24 resize-none" placeholder="Tell us about yourself..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" className="input pl-10" placeholder="City, Country" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" className="input pl-10" placeholder="+234..." value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map(s => (
                <span key={s} className="badge bg-blue-100 text-blue-700 flex items-center gap-1 pr-1">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" className="input flex-1" placeholder="Add a skill (e.g. JavaScript)" value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
              <button type="button" onClick={addSkill} className="btn-secondary px-4"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full py-3">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handleChangePw} className="card space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
            <input type="password" className="input" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
            <input type="password" className="input" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
            <input type="password" className="input" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} required />
          </div>
          <button type="submit" disabled={savingPw} className="btn-primary w-full py-3">
            <Lock className="w-4 h-4" /> {savingPw ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
