import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Clock, TrendingUp, Wifi, ArrowLeft, Send, CheckCircle2, Briefcase } from 'lucide-react';

const typeColors = { job: 'bg-green-100 text-green-700', internship: 'bg-blue-100 text-blue-700', freelance: 'bg-purple-100 text-purple-700', volunteer: 'bg-orange-100 text-orange-700' };

export default function OpportunityDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opp, setOpp] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    api.get(`/opportunities/${id}`).then(res => {
      setOpp(res.data.opportunity);
      setApplication(res.data.application);
    }).catch(() => {
      toast.error('Opportunity not found');
      navigate('/opportunities');
    }).finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.post(`/opportunities/${id}/apply`, { cover_letter: coverLetter });
      toast.success('Application submitted!');
      setApplication({ status: 'pending' });
      setShowApplyForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;
  if (!opp) return null;

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', reviewed: 'bg-blue-100 text-blue-700', shortlisted: 'bg-purple-100 text-purple-700', accepted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

  return (
    <div className="max-w-3xl space-y-6 fade-in">
      <button onClick={() => navigate('/opportunities')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Opportunities
      </button>

      <div className="card">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`badge ${typeColors[opp.type] || 'bg-slate-100 text-slate-600'}`}>{opp.type}</span>
          {opp.is_remote ? <span className="badge bg-slate-100 text-slate-600 flex items-center gap-1"><Wifi className="w-3 h-3" /> Remote</span> : null}
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">{opp.title}</h1>
        <p className="text-lg text-slate-600 mb-4">{opp.company}</p>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {opp.location}</span>
          {opp.salary_range && <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> {opp.salary_range}</span>}
          {opp.deadline && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>}
        </div>

        <div className="prose prose-sm max-w-none text-slate-700 mb-6">
          <h3 className="font-bold text-slate-800 mb-2">About This Opportunity</h3>
          <p className="whitespace-pre-wrap">{opp.description}</p>
        </div>

        {opp.required_skills?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {opp.required_skills.map(s => <span key={s} className="badge bg-blue-100 text-blue-700">{s}</span>)}
            </div>
          </div>
        )}

        {/* Apply section */}
        {user?.role === 'youth' && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            {application ? (
              <div className={`flex items-center gap-3 p-4 rounded-xl ${statusColors[application.status]}`}>
                <CheckCircle2 className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Application {application.status}</p>
                  <p className="text-sm opacity-80">You have already applied for this opportunity.</p>
                </div>
              </div>
            ) : showApplyForm ? (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Letter (optional)</label>
                  <textarea className="input h-32 resize-none" placeholder="Tell the employer why you're a great fit for this role..." value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={applying} className="btn-primary">
                    <Send className="w-4 h-4" /> {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button type="button" onClick={() => setShowApplyForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setShowApplyForm(true)} className="btn-primary">
                <Briefcase className="w-4 h-4" /> Apply Now
              </button>
            )}
          </div>
        )}
      </div>

      {/* Employer info */}
      {opp.employer_bio && (
        <div className="card">
          <h3 className="font-bold text-slate-800 mb-2">About the Employer</h3>
          <p className="text-slate-600 text-sm">{opp.employer_bio}</p>
        </div>
      )}
    </div>
  );
}
