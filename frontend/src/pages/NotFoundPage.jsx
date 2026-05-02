import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 text-center">
      <div>
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-800 mb-2">404</h1>
        <p className="text-xl text-slate-600 mb-6">Page not found</p>
        <Link to="/" className="btn-primary inline-flex">Go Home</Link>
      </div>
    </div>
  );
}
