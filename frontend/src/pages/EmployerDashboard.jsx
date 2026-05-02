import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Briefcase, Users, ChevronDown, ChevronUp, MapPin, Plus } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
};

export default function EmployerDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOpp, setExpandedOpp] = useState(null);
  const [applicants, setApplicants] = useState({});

  useEffect(() => {
    api.get('/opportunities/employer/posted').then(res => setOpportunities(res.data.opportunities)).finally(() => setLoading(false));
  }, []);

  const loadApplicants = async (oppId) => {
    if (applicants[oppId]) {
      setExpandedOpp(expandedOpp === oppId ? null : oppId);
      return;
    }
    try {
      const res = await api.get(`/opportunities/${oppId}/applicants`);
      setApplicants(p => ({ ...p, [oppId]: res.data.applicants }));
      setExpandedOpp(oppId);
    } catch {
      toast.error('Failed to load applicants');
    }
  };

  const updateStatus = async (oppId, appId, status) => {
    try {
      await api.put(`/opportunities/${oppId}/application/${appId}/status`, { status });
      toast.success('Status updated');
      setApplicants(p => ({
        ...p,
        [oppId]: p[oppId].map(a => a.id === appId ? { ...a, status } : a)
      }));
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">My Opportunities</h1>
          <p className="section-subtitle">Manage your job postings and review applicants</p>
        </div>
        <Link to="/employer/post" className="btn-primary">
          <Plus className="w-4 h-4" /> Post New
        </Link>
      </div>

      {opportunities.length === 0 ? (
        <div className="card text-center py-16">
          <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 mb-2">No Opportunities Posted</h3>
          <p className="text-slate-400 mb-6">Start attracting talented youth by posting your first opportunity.</p>
          <Link to="/employer/post" className="btn-primary inline-flex">Post an Opportunity</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map(opp => (
            <div key={opp.id} className="card p-0 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`badge ${opp.type === 'job' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{opp.type}</span>
                      {opp.is_remote ? <span className="badge bg-slate-100 text-slate-600">Remote</span> : null}
                      {!opp.is_active ? <span className="badge bg-red-100 text-red-700">Inactive</span> : null}
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">{opp.title}</h3>
                    <p className="text-slate-500 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /> {opp.location}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-slate-600 font-semibold">
                      <Users className="w-4 h-4" /> {opp.application_count}
                    </div>
                    <p className="text-xs text-slate-400">applicants</p>
                  </div>
                </div>
                <button onClick={() => loadApplicants(opp.id)} className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  {expandedOpp === opp.id ? <><ChevronUp className="w-4 h-4" /> Hide Applicants</> : <><ChevronDown className="w-4 h-4" /> View Applicants ({opp.application_count})</>}
                </button>
              </div>

              {expandedOpp === opp.id && applicants[opp.id] && (
                <div className="border-t border-slate-100 bg-slate-50">
                  {applicants[opp.id].length === 0 ? (
                    <p className="text-center text-slate-400 py-6 text-sm">No applicants yet</p>
                  ) : applicants[opp.id].map(app => (
                    <div key={app.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border-b border-slate-100 last:border-0 bg-white hover:bg-slate-50">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                        {app.name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800">{app.name}</p>
                        <p className="text-xs text-slate-400">{app.email} · {app.location}</p>
                        {app.skills?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {app.skills.slice(0, 4).map(s => <span key={s} className="badge bg-slate-100 text-slate-600 text-xs">{s}</span>)}
                          </div>
                        )}
                        {app.certificates?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {app.certificates.map(c => <span key={c.certificate_number} className="badge bg-yellow-100 text-yellow-700 text-xs">🏆 {c.course_title}</span>)}
                          </div>
                        )}
                        {app.cover_letter && <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">"{app.cover_letter}"</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`badge ${statusColors[app.status]}`}>{app.status}</span>
                        <select value={app.status} onChange={e => updateStatus(opp.id, app.id, e.target.value)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
