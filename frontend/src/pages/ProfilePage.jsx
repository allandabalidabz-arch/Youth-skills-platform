import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, MapPin, Phone, Save, Plus, X, Lock, CreditCard, Camera, Loader2 } from 'lucide-react';

// Format validators (mirrors backend)
const isValidPhone    = (phone)    => /^\+?[0-9]{7,15}$/.test(phone.trim());
const isValidLocation = (location) => /[a-zA-Z]/.test(location);
const isValidNRC      = (nrc)      => /^[0-9]{6}\/[0-9]{2}\/[0-9]$/.test(nrc.trim());

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '', location: '', phone: '', nrc: '', avatar: '' });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({});
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const touch = (field) => () => setTouched(p => ({ ...p, [field]: true }));

  useEffect(() => {
    api.get('/users/profile').then(res => {
      const u = res.data.user;
      setForm({ name: u.name || '', bio: u.bio || '', location: u.location || '', phone: u.phone || '', nrc: u.nrc || '', avatar: u.avatar || '' });
      setSkills(u.skills || []);
    });
  }, []);

  // Resolve avatar src — local upload or external URL
  const getAvatarSrc = (src) => {
    if (!src) return null;
    if (src.startsWith('/uploads/')) return `http://localhost:5000${src}`;
    return src;
  };

  const currentAvatar = avatarPreview || getAvatarSrc(form.avatar);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      return toast.error('Only JPG, PNG, WEBP, or GIF images are allowed.');
    }
    if (file.size > 3 * 1024 * 1024) {
      return toast.error('Image must be smaller than 3 MB.');
    }

    // Show instant preview
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to backend
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(p => ({ ...p, avatar: res.data.avatarUrl }));
      setAvatarPreview(null); // Use the saved path from now on
      updateUser({ ...user, avatar: res.data.avatarUrl });
      toast.success('Profile picture updated!');
    } catch (err) {
      setAvatarPreview(null);
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.phone && !isValidPhone(form.phone)) return toast.error('Invalid phone number format.');
    if (form.location && !isValidLocation(form.location)) return toast.error('Enter a valid location.');
    if (form.nrc && !isValidNRC(form.nrc)) return toast.error('Invalid NRC format. Use: 123456/78/9');
    setSaving(true);
    try {
      await api.put('/users/profile', { ...form, skills });
      const meRes = await api.get('/auth/me');
      updateUser({ ...meRes.data.user, skills: meRes.data.user.skills || [] });
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
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
    } finally { setSavingPw(false); }
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
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl w-fit">
        {[{ id: 'profile', label: 'Profile' }, { id: 'security', label: 'Security' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id
              ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="space-y-5">

          {/* Avatar upload */}
          <div className="card flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div
                onClick={handleAvatarClick}
                className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-3xl overflow-hidden cursor-pointer ring-2 ring-offset-2 ring-blue-200 dark:ring-blue-700 hover:ring-blue-400 transition-all">
                {uploadingAvatar ? (
                  <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                ) : currentAvatar ? (
                  <img src={currentAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">Profile Picture</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Click the photo to upload a new image. JPG, PNG, WEBP or GIF — max 3 MB.</p>
              <button type="button" onClick={handleAvatarClick} disabled={uploadingAvatar}
                className="btn-secondary text-xs py-1.5 px-4">
                <Camera className="w-3.5 h-3.5" />
                {uploadingAvatar ? 'Uploading...' : 'Choose Photo'}
              </button>
            </div>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input type="text" className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Bio</label>
              <textarea className="input h-24 resize-none" placeholder="Tell us about yourself..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" className="input pl-10" placeholder="City, Country" value={form.location}
                    onChange={e => setForm(p => ({ ...p, location: e.target.value }))} onBlur={touch('location')} />
                </div>
                {touched.location && form.location && !isValidLocation(form.location) && (
                  <p className="text-xs text-red-500 mt-1">Enter a valid location.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" className="input pl-10" placeholder="+260" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/[^0-9+]/g, '') }))}
                    onBlur={touch('phone')} />
                </div>
                {touched.phone && form.phone && !isValidPhone(form.phone) && (
                  <p className="text-xs text-red-500 mt-1">Invalid phone number format.</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">NRC Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" className="input pl-10" placeholder="123456/78/9" value={form.nrc}
                  onChange={e => setForm(p => ({ ...p, nrc: e.target.value }))} onBlur={touch('nrc')} />
              </div>
              {touched.nrc && form.nrc && !isValidNRC(form.nrc) && (
                <p className="text-xs text-red-500 mt-1">Invalid NRC format. Use: 123456/78/9</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Skills</h3>
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
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
            <input type="password" className="input" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
            <input type="password" className="input" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
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
