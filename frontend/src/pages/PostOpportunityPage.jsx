import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, X, Send } from 'lucide-react';

export default function PostOpportunityPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', company: '', description: '', type: 'internship',
    location: '', is_remote: false, salary_range: '', deadline: ''
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills(p => [...p, s]); setNewSkill(''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/opportunities', { ...form, required_skills: skills });
      toast.success('Opportunity posted successfully!');
      navigate('/employer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 fade-in">
      <div>
        <h1 className="section-title">Post an Opportunity</h1>
        <p className="section-subtitle">Connect with talented youth looking for opportunities</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4">
          <h3 className="font-semibold text-slate-800">Basic Information</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title *</label>
            <input type="text" className="input" placeholder="e.g. Junior Web Developer" value={form.title} onChange={set('title')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name *</label>
            <input type="text" className="input" placeholder="Your company name" value={form.company} onChange={set('company')} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Type *</label>
              <select className="input" value={form.type} onChange={set('type')}>
                <option value="job">Full-time Job</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Location *</label>
              <input type="text" className="input" placeholder="City, Country" value={form.location} onChange={set('location')} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Salary / Stipend</label>
              <input type="text" className="input" placeholder="e.g. $500-$800/month" value={form.salary_range} onChange={set('salary_range')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Application Deadline</label>
              <input type="date" className="input" value={form.deadline} onChange={set('deadline')} />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_remote} onChange={e => setForm(p => ({ ...p, is_remote: e.target.checked }))} className="w-4 h-4 text-blue-600 rounded" />
            <span className="text-sm font-medium text-slate-700">This is a remote opportunity</span>
          </label>
        </div>

        <div className="card">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
          <textarea className="input h-40 resize-none" placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..." value={form.description} onChange={set('description')} required />
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map(s => (
              <span key={s} className="badge bg-blue-100 text-blue-700 flex items-center gap-1 pr-1">
                {s}
                <button type="button" onClick={() => setSkills(p => p.filter(x => x !== s))} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" className="input flex-1" placeholder="Add required skill (e.g. JavaScript)" value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
            <button type="button" onClick={addSkill} className="btn-secondary px-4"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3">
            <Send className="w-4 h-4" /> {submitting ? 'Posting...' : 'Post Opportunity'}
          </button>
          <button type="button" onClick={() => navigate('/employer')} className="btn-secondary px-6">Cancel</button>
        </div>
      </form>
    </div>
  );
}
