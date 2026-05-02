import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Award, CheckCircle2, XCircle, GraduationCap } from 'lucide-react';

export default function VerifyCertPage() {
  const { certNumber } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/certificates/verify/${certNumber}`).then(res => setResult(res.data)).catch(() => setResult({ valid: false })).finally(() => setLoading(false));
  }, [certNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">YouthSkills</span>
          </Link>
          <p className="text-slate-500 mt-2 text-sm">Certificate Verification</p>
        </div>

        <div className="card shadow-lg text-center">
          {loading ? (
            <div className="py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" /></div>
          ) : result?.valid ? (
            <div>
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-green-700 mb-1">Certificate Valid ✓</h2>
              <p className="text-slate-500 text-sm mb-6">This certificate is authentic and was issued by YouthSkills Platform.</p>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white mb-6">
                <Award className="w-10 h-10 mx-auto mb-3 opacity-80" />
                <p className="text-sm opacity-80 uppercase tracking-wider mb-1">Certificate of Completion</p>
                <h3 className="text-lg font-bold mb-2">{result.certificate.course_title}</h3>
                <p className="text-sm opacity-80">Awarded to</p>
                <p className="text-xl font-extrabold mt-1">{result.certificate.holder_name}</p>
              </div>

              <div className="text-left space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Certificate #</span>
                  <span className="font-mono font-bold text-slate-700">{result.certificate.certificate_number}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Category</span>
                  <span className="font-medium capitalize">{result.certificate.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Level</span>
                  <span className="font-medium capitalize">{result.certificate.level}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Instructor</span>
                  <span className="font-medium">{result.certificate.instructor_name}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Issued On</span>
                  <span className="font-medium">{new Date(result.certificate.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-600 mb-2">Certificate Not Found</h2>
              <p className="text-slate-500 text-sm">The certificate number <span className="font-mono font-bold">{certNumber}</span> could not be verified. It may be invalid or does not exist.</p>
            </div>
          )}

          <Link to="/" className="btn-secondary w-full mt-4">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
