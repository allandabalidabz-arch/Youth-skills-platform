import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Palette, TrendingUp, Award, Briefcase, ArrowRight, Star } from 'lucide-react';
import Logo, { LogoIcon } from '../components/Logo';

const features = [
  { icon: Code2, title: 'Coding & Tech', desc: 'Web development, Python, data analysis and more', color: 'bg-blue-100 text-blue-600' },
  { icon: Palette, title: 'Graphic Design', desc: 'Visual design, branding, UI/UX fundamentals', color: 'bg-purple-100 text-purple-600' },
  { icon: TrendingUp, title: 'Entrepreneurship', desc: 'Business planning, marketing, financial literacy', color: 'bg-green-100 text-green-600' },
  { icon: Briefcase, title: 'Job Matching', desc: 'Connect with employers looking for your skills', color: 'bg-orange-100 text-orange-600' },
];

const stats = [
  { value: '500+', label: 'Youth Trained' },
  { value: '20+', label: 'Course Modules' },
  { value: '50+', label: 'Opportunities' },
  { value: '95%', label: 'Satisfaction Rate' },
];

const testimonials = [
  { name: 'Amara O.', role: 'Web Developer', text: 'YouthSkills gave me the foundation I needed. Within 3 months of completing the web dev course, I landed my first job!', rating: 5 },
  { name: 'Kwame M.', role: 'Entrepreneur', text: 'The entrepreneurship course helped me launch my startup. The opportunity matching feature connected me with my first investor.', rating: 5 },
  { name: 'Fatima A.', role: 'Graphic Designer', text: 'I went from zero design knowledge to getting paid freelance projects. The certificate really helped my portfolio.', rating: 5 },
];

export default function LandingPage() {
  { icon: Code2, title: 'Coding & Tech', desc: 'Web development, Python, data analysis and more', color: 'bg-blue-100 text-blue-600' },
  { icon: Palette, title: 'Graphic Design', desc: 'Visual design, branding, UI/UX fundamentals', color: 'bg-purple-100 text-purple-600' },
  { icon: TrendingUp, title: 'Entrepreneurship', desc: 'Business planning, marketing, financial literacy', color: 'bg-green-100 text-green-600' },
  { icon: Briefcase, title: 'Job Matching', desc: 'Connect with employers looking for your skills', color: 'bg-orange-100 text-orange-600' },
];

const stats = [
  { value: '500+', label: 'Youth Trained' },
  { value: '20+', label: 'Course Modules' },
  { value: '50+', label: 'Opportunities' },
  { value: '95%', label: 'Satisfaction Rate' },
];

const testimonials = [
  { name: 'Amara O.', role: 'Web Developer', text: 'YouthSkills gave me the foundation I needed. Within 3 months of completing the web dev course, I landed my first job!', rating: 5 },
  { name: 'Kwame M.', role: 'Entrepreneur', text: 'The entrepreneurship course helped me launch my startup. The opportunity matching feature connected me with my first investor.', rating: 5 },
  { name: 'Fatima A.', role: 'Graphic Designer', text: 'I went from zero design knowledge to getting paid freelance projects. The certificate really helped my portfolio.', rating: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-600 hover:text-slate-800 font-medium text-sm px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* Big logo in hero */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-3xl p-4 shadow-2xl inline-block">
              <LogoIcon size={120} />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Star className="w-4 h-4 text-yellow-300" />
            Empowering African Youth Through Digital Skills
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Learn. Grow. <br />
            <span className="text-yellow-300">Get Hired.</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Access world-class digital skills training, track your progress, earn certificates, and connect directly with employers looking for talent like you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2 justify-center text-lg">
              Start Learning Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/register?role=employer" className="border-2 border-white/50 hover:border-white text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2 justify-center text-lg">
              Post Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-white">{s.value}</div>
              <div className="text-slate-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Everything You Need to Succeed</h2>
            <p className="text-slate-500 text-lg">From beginner to job-ready in one platform</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="card hover:shadow-md transition-shadow text-center">
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-4`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">How It Works</h2>
            <p className="text-slate-500">Three simple steps to your digital career</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register & Enroll', desc: 'Create your free account and enroll in courses that match your interests and career goals.' },
              { step: '02', title: 'Learn & Earn Certificates', desc: 'Complete modules, take quizzes, and earn verified digital certificates upon course completion.' },
              { step: '03', title: 'Get Matched & Apply', desc: 'Our smart matching connects you with jobs and internships that fit your skills and certificates.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold mx-auto mb-4">{item.step}</div>
                <h3 className="font-bold text-slate-800 mb-2 text-lg">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Success Stories</h2>
            <p className="text-slate-500">Real youth, real results</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-600 text-sm mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">{t.name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of youth building their digital future today.</p>
          <Link to="/register" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-10 py-4 rounded-xl transition-all inline-flex items-center gap-2 text-lg">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Logo size="sm" white />
        </div>
        <p>© 2026 YouthSkills Program. Empowering youth through digital education.</p>
        <p className="mt-1">
          <Link to="/verify/CERT-123" className="hover:text-white transition-colors">Verify Certificate</Link>
        </p>
      </footer>
    </div>
  );
}
