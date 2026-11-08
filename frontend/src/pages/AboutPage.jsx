import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Award, BookOpen, Users, Globe } from 'lucide-react';
import Logo, { LogoIcon } from '../components/Logo';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/"><Logo size="sm" /></Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white font-medium text-sm px-4 py-2">← Back to Home</Link>
            <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white font-medium text-sm px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-xl inline-block">
              <LogoIcon size={80} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About YouthSkills Program</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Who we are, what we do, and why we exist.
          </p>
        </div>
      </section>

      {/* About content */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 space-y-8">

          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Who We Are</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              The <strong>YouthSkills Program</strong> is a free, web-based digital skills learning platform open to any young person who wants to build a future in technology. We believe that where you live should never determine what you can learn. Whether you are in Lusaka, Ndola, a rural town, or anywhere with internet access — you can register, study, and earn a verified certificate.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">What We Do</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              Our platform was built to address the gap in accessible, structured digital education for youth. We provide three professionally designed courses covering the fundamentals of computing — System Analysis and Design, Web Development, and Operating Systems — taught through structured modules, interactive quizzes, and practical assignments.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Our Certificates</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              Every learner who completes a course earns a digitally verified certificate that can be shared with employers and institutions. Our certificates include the learner's name, NRC number, and a public verification link so anyone can confirm its authenticity.
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">What You Get</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'Free to register and enrol — no fees',
                'Open to all youth everywhere',
                'Structured courses with interactive quizzes',
                'Verified digital certificates',
                'Learn at your own pace, any time',
                'Mobile money payment support (2,000 ZMW)',
                'Personal dashboard with progress tracking',
                'In-app notifications for key events',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            {[
              { icon: Users, value: '500+', label: 'Youth Trained', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
              { icon: BookOpen, value: '3', label: 'Courses Available', color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
              { icon: Globe, value: '9', label: 'Course Modules', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
              { icon: Award, value: '95%', label: 'Satisfaction Rate', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-500' },
            ].map(s => (
              <div key={s.label} className={`${s.color} rounded-2xl p-6 text-center`}>
                <s.icon className="w-7 h-7 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-extrabold mb-1">{s.value}</div>
                <p className="text-sm font-medium opacity-80">{s.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of youth building their digital future today.</p>
          <Link to="/register" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-10 py-4 rounded-xl transition-all inline-flex items-center gap-2 text-lg">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} YouthSkills Program. Empowering youth through digital education.</p>
        <p className="mt-2">
          <Link to="/admin/login" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Admin Portal</Link>
        </p>
      </footer>

    </div>
  );
}
