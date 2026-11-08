import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Monitor, Globe, Award, ArrowRight, Mail, Phone, MapPin, Facebook, Twitter, Youtube, CheckCircle2 } from 'lucide-react';
import Logo, { LogoIcon } from '../components/Logo';

const features = [
  { icon: Monitor, title: 'System Analysis & Design', desc: 'Learn SDLC, data flow diagrams, entity relationship diagrams, and system design principles', color: 'bg-indigo-100 text-indigo-600' },
  { icon: Globe, title: 'Web Development', desc: 'Build websites from scratch using HTML, CSS, and JavaScript', color: 'bg-blue-100 text-blue-600' },
  { icon: Code2, title: 'Operating Systems', desc: 'Understand how operating systems manage processes, memory, files, and security', color: 'bg-slate-100 text-slate-600' },
  { icon: Award, title: 'Certificates', desc: 'Earn verified digital certificates on course completion', color: 'bg-orange-100 text-orange-600' },
];

const stats = [
  { value: '500+', label: 'Youth Trained' },
  { value: '9', label: 'Course Modules' },
  { value: '3', label: 'Courses Available' },
  { value: '95%', label: 'Satisfaction Rate' },
];

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const handleContact = (e) => {
    e.preventDefault();
    // In production this would POST to an API endpoint
    setContactSent(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSent(false), 5000);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/"><Logo size="sm" /></Link>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollTo('about')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors">About</button>
            <button onClick={() => scrollTo('courses')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors">Courses</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors">How It Works</button>
            <button onClick={() => scrollTo('contact')} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors">Contact Us</button>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white font-medium text-sm px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-3xl p-5 shadow-2xl inline-block">
              <LogoIcon size={130} />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
            Empowering Youth Through Digital Skills — Open to Everyone, Everywhere
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Learn. Grow. <br /><span className="text-yellow-300">Get Certified.</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Access free digital skills training in System Analysis, Web Development, and Operating Systems. Track your progress, earn verified certificates, and build a career in technology — from anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2 justify-center text-lg">
              Start Learning Free <ArrowRight className="w-5 h-5" />
            </Link>
            <button onClick={() => scrollTo('about')} className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-4 rounded-xl transition-all text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
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

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">About YouthSkills Program</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">Who we are, what we do, and why we exist</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                The <strong>YouthSkills Program</strong> is a free, web-based digital skills learning platform open to any young person who wants to build a future in technology. We believe that where you live should never determine what you can learn. Whether you are in Lusaka, Ndola, a rural town, or anywhere with internet access — you can register, study, and earn a verified certificate.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Our platform was built to address the gap in accessible, structured digital education for youth. We provide three professionally designed courses covering the fundamentals of computing — System Analysis and Design, Web Development, and Operating Systems — taught through structured modules, interactive quizzes, and practical assignments.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Every learner who completes a course earns a digitally verified certificate that can be shared with employers and institutions. Our certificates include the learner's name, NRC number, and a public verification link so anyone can confirm its authenticity.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  'Free to register and enrol',
                  'Open to all youth everywhere',
                  'Structured courses with quizzes',
                  'Verified digital certificates',
                  'Learn at your own pace',
                  'Mobile money payment support',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-extrabold text-blue-600 mb-2">3</div>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Professional Courses</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-extrabold text-green-600 mb-2">9</div>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Learning Modules</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-extrabold text-purple-600 mb-2">500+</div>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Youth Trained</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 text-center">
                <div className="text-4xl font-extrabold text-orange-500 mb-2">100%</div>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Free to Register</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses ───────────────────────────────────────────────────────── */}
      <section id="courses" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">Everything You Need to Succeed</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">From beginner to job-ready in one platform</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="card hover:shadow-md transition-shadow text-center">
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-4`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">How It Works</h2>
            <p className="text-slate-500 dark:text-slate-400">Three simple steps to your digital career</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register & Enroll', desc: 'Create your free account using your NRC number and enroll in any course — from anywhere in the world.' },
              { step: '02', title: 'Learn & Complete', desc: 'Study module content at your own pace, take quizzes, and submit assignments to progress through each course.' },
              { step: '03', title: 'Earn & Share Certificates', desc: 'Download your verified digital certificate and share it with employers to showcase your new skills.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold mx-auto mb-4">{item.step}</div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 text-lg">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join thousands of youth building their digital future today — no matter where you are.</p>
          <Link to="/register" className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-10 py-4 rounded-xl transition-all inline-flex items-center gap-2 text-lg">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Contact Us ────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">Contact Us</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Have a question? We'd love to hear from you.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">

            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Get in Touch</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Whether you have a question about our courses, need help with your account, or want to learn more about the YouthSkills Program, our team is ready to help. Reach out through any of the channels below.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Email</p>
                    <a href="mailto:allandabalidabz@gmail.com" className="text-slate-800 dark:text-slate-100 font-semibold hover:text-blue-600 transition-colors">
                      allandabalidabz@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Phone / WhatsApp</p>
                    <a href="tel:+260970342178" className="text-slate-800 dark:text-slate-100 font-semibold hover:text-green-600 transition-colors">
                      +260 970 342 178
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Location</p>
                    <p className="text-slate-800 dark:text-slate-100 font-semibold">Lusaka, Zambia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-sm p-8">
              {contactSent ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 dark:text-slate-400">Thank you for reaching out. We will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Send Us a Message</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter your full name"
                      value={contactForm.name}
                      onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      className="input"
                      placeholder="your@email.com"
                      value={contactForm.email}
                      onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                    <textarea
                      className="input h-32 resize-none"
                      placeholder="Write your message here..."
                      value={contactForm.message}
                      onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full py-3">
                    <Mail className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">

            {/* Brand */}
            <div>
              <div className="mb-4"><Logo size="sm" white /></div>
              <p className="text-slate-400 text-sm leading-relaxed">
                A free digital skills learning platform open to any youth, anywhere. Learn, grow, and get certified.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <button onClick={() => scrollTo('about')} className="block text-slate-400 hover:text-white transition-colors text-left">About Us</button>
                <button onClick={() => scrollTo('courses')} className="block text-slate-400 hover:text-white transition-colors text-left">Courses</button>
                <button onClick={() => scrollTo('how-it-works')} className="block text-slate-400 hover:text-white transition-colors text-left">How It Works</button>
                <button onClick={() => scrollTo('contact')} className="block text-slate-400 hover:text-white transition-colors text-left">Contact Us</button>
                <Link to="/register" className="block text-slate-400 hover:text-white transition-colors">Register Free</Link>
                <Link to="/login" className="block text-slate-400 hover:text-white transition-colors">Sign In</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:allandabalidabz@gmail.com" className="hover:text-white transition-colors">allandabalidabz@gmail.com</a>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href="tel:+260970342178" className="hover:text-white transition-colors">+260 970 342 178</a>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Lusaka, Zambia</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm">© {new Date().getFullYear()} YouthSkills Program. Empowering youth through digital education.</p>
            <Link to="/admin/login" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
