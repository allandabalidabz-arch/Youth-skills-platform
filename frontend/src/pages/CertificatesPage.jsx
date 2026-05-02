import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Award, Download, ExternalLink, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryColors = {
  coding: 'from-blue-500 to-blue-700',
  design: 'from-purple-500 to-purple-700',
  entrepreneurship: 'from-green-500 to-green-700',
  marketing: 'from-orange-500 to-orange-700',
  data: 'from-teal-500 to-teal-700'
};

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates/my').then(res => setCertificates(res.data.certificates)).finally(() => setLoading(false));
  }, []);

  const copyVerifyLink = (certNumber) => {
    const url = `${window.location.origin}/verify/${certNumber}`;
    navigator.clipboard.writeText(url);
    toast.success('Verification link copied!');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="section-title">My Certificates</h1>
        <p className="section-subtitle">Your earned digital certificates — share them with employers</p>
      </div>

      {certificates.length === 0 ? (
        <div className="card text-center py-16">
          <Award className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 text-lg mb-2">No Certificates Yet</h3>
          <p className="text-slate-400 mb-6">Complete a course to earn your first certificate!</p>
          <a href="/courses" className="btn-primary inline-flex">Browse Courses</a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <div key={cert.id} className="rounded-2xl overflow-hidden shadow-md border border-slate-100">
              {/* Certificate visual */}
              <div className={`bg-gradient-to-br ${categoryColors[cert.category] || 'from-blue-500 to-blue-700'} p-8 text-white text-center relative`}>
                <div className="absolute top-4 right-4 opacity-20">
                  <Award className="w-16 h-16" />
                </div>
                <Award className="w-12 h-12 mx-auto mb-3 opacity-90" />
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">Certificate of Completion</p>
                <h3 className="text-xl font-bold mb-2">{cert.course_title}</h3>
                <p className="text-sm opacity-80">Awarded to</p>
                <p className="text-2xl font-extrabold mt-1">{user?.name}</p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs opacity-70">Issued by YouthSkills Platform</p>
                  <p className="text-xs opacity-70">{new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Certificate details */}
              <div className="bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-slate-400">Certificate Number</p>
                    <p className="font-mono text-sm font-bold text-slate-700">{cert.certificate_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Level</p>
                    <p className="text-sm font-semibold text-slate-700 capitalize">{cert.level}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3">Instructor: {cert.instructor_name}</p>
                <div className="flex gap-2">
                  <button onClick={() => copyVerifyLink(cert.certificate_number)} className="btn-secondary flex-1 text-sm py-2">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <a href={`/verify/${cert.certificate_number}`} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1 text-sm py-2">
                    <ExternalLink className="w-4 h-4" /> Verify
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
