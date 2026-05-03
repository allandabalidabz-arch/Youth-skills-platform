import React from 'react';
import { Link } from 'react-router-dom';
import Logo, { LogoIcon } from '../components/Logo';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 text-center">
      <div>
        <div className="flex justify-center mb-6">
          <LogoIcon size={100} />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-800 mb-2">404</h1>
        <p className="text-xl text-slate-600 mb-6">Page not found</p>
        <Link to="/" className="btn-primary inline-flex">Go Home</Link>
      </div>
    </div>
  );
}
