import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Search, Wifi, TrendingUp, Clock } from 'lucide-react';

const typeColors = {
  job: 'bg-green-100 text-green-700',
  internship: 'bg-blue-100 text-blue-700',
  freelance: 'bg-purple-100 text-purple-700',
  volunteer: 'bg-orange-100 text-orange-700'
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700'
};

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [remote, setRemote] = useState('');

  const fetchOpps = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (type) params.set('type', type);
      if (remote) params.set('remote', remote);
      const res = await api.get(`/opportunities?${params}`);
      setOpportunities(res.data.opportunities);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOpps(); }, [type, remote]);

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="section-title">Opportunities</h1>
        <p className="section-subtitle">
          {user?.role === 'youth' ? 'Jobs and internships matched to your skills' : 'Browse all available opportunities'}
        </p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <form onSubmit={(e) => { e.preventDefault(); fetchOpps(); }} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" className="input pl-10" placeholder="Search opportunities..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input sm:w-40" value={type} onChange={e => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="job">Full-time Job</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
            <option value="volunteer">Volunteer</option>
          </select>
          <select className="input sm:w-36" value={remote} onChange={e => setRemote(e.target.value)}>
            <option value="">Any Location</option>
            <option value="true">Remote Only</option>
          </select>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse h-28" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No opportunities found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {opportunities.map(opp => (
            <Link key={opp.id} to={`/opportunities/${opp.id}`} className="card hover:shadow-md transition-all hover:border-blue-100 border border-transparent flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`badge ${typeColors[opp.type] || 'bg-slate-100 text-slate-600'}`}>{opp.type}</span>
                  {opp.is_remote ? <span className="badge bg-slate-100 text-slate-600 flex items-center gap-1"><Wifi className="w-3 h-3" /> Remote</span> : null}
                  {opp.application_status && <span className={`badge ${statusColors[opp.application_status]}`}>Applied: {opp.application_status}</span>}
                </div>
                <h3 className="font-bold text-slate-800 text-lg">{opp.title}</h3>
                <p className="text-slate-600 text-sm">{opp.company}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {opp.location}</span>
                  {opp.salary_range && <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> {opp.salary_range}</span>}
                  {opp.deadline && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>}
                </div>
                {opp.required_skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {opp.required_skills.slice(0, 4).map(s => (
                      <span key={s} className="badge bg-slate-100 text-slate-600 text-xs">{s}</span>
                    ))}
                  </div>
                )}
              </div>
              {user?.role === 'youth' && opp.match_score !== undefined && (
                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-4 ${opp.match_score >= 70 ? 'border-green-400 text-green-600 bg-green-50' : opp.match_score >= 40 ? 'border-yellow-400 text-yellow-600 bg-yellow-50' : 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                    {opp.match_score}%
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Match</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
