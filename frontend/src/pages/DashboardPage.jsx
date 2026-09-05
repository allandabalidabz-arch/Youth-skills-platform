import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { BookOpen, Award, TrendingUp, CheckCircle2, Clock, ArrowRight, Building2 } from 'lucide-react';

const categoryColors = {
  coding: 'bg-blue-100 text-blue-700',
  design: 'bg-purple-100 text-purple-700',
  entrepreneurship: 'bg-green-100 text-green-700',
  marketing: 'bg-orange-100 text-orange-700',
  data: 'bg-teal-100 text-teal-700'
};

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = user?.role === 'youth' ? '/dashboard/youth'
      : user?.role === 'employer' ? '/dashboard/employer'
      : '/dashboard/admin';

    api.get(endpoint).then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  if (user?.role === 'youth') return <YouthDashboard data={data} user={user} />;
  if (user?.role === 'employer') return <EmployerDashboardView />;
  return <AdminDashboardView data={data} />;
}

function YouthDashboard({ data, user }) {
  if (!data) return null;
  const { stats, recentCourses, recentCertificates } = data;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="section-title">My Dashboard</h1>
        <p className="section-subtitle">Track your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={BookOpen} label="Enrolled Courses" value={stats.enrolledCourses} color="bg-blue-100 text-blue-600" sub={`${stats.completedCourses} completed`} />
        <StatCard icon={Award} label="Certificates" value={stats.certificates} color="bg-yellow-100 text-yellow-600" />
        <StatCard icon={TrendingUp} label="Completion Rate" value={stats.enrolledCourses > 0 ? `${Math.round((stats.completedCourses / stats.enrolledCourses) * 100)}%` : '0%'} color="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">My Courses</h2>
            <Link to="/courses" className="text-sm text-blue-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {recentCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No courses yet</p>
              <Link to="/courses" className="btn-primary mt-3 text-sm py-2">Browse Courses</Link>
            </div>
          ) : recentCourses.map(c => (
            <Link key={c.course_id} to={`/courses/${c.course_id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors mb-1">
              <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                {c.thumbnail ? <img src={c.thumbnail} alt="" className="w-full h-full object-cover" /> : <BookOpen className="w-5 h-5 text-slate-400 m-2.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{c.title}</p>
                <span className={`badge text-xs ${categoryColors[c.category] || 'bg-slate-100 text-slate-600'}`}>{c.category}</span>
              </div>
              {c.completed_at ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> : <Clock className="w-5 h-5 text-slate-300 flex-shrink-0" />}
            </Link>
          ))}
        </div>

        {/* Recent Certificates */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">Recent Certificates</h2>
            <Link to="/certificates" className="text-sm text-blue-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {recentCertificates.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Complete a course to earn your first certificate</p>
            </div>
          ) : recentCertificates.map(c => (
            <div key={c.certificate_number} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-100 mb-2">
              <Award className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{c.course_title}</p>
                <p className="text-xs text-slate-500">#{c.certificate_number} · {new Date(c.issued_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function EmployerDashboardView() {
  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="section-title">Employer Dashboard</h1>
        <p className="section-subtitle">Welcome to the YouthSkills employer portal</p>
      </div>
      <div className="card text-center py-16">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Employer features are coming soon.</p>
      </div>
    </div>
  );
}

function AdminDashboardView({ data }) {
  if (!data) return null;
  const { stats } = data;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-subtitle">Platform overview and statistics</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Total Users" value={stats.totalUsers} color="bg-blue-100 text-blue-600" sub={`${stats.youthUsers} youth`} />
        <StatCard icon={Building2} label="Employers" value={stats.employers} color="bg-green-100 text-green-600" />
        <StatCard icon={BookOpen} label="Courses" value={stats.totalCourses} color="bg-purple-100 text-purple-600" sub={`${stats.totalEnrollments} enrollments`} />
        <StatCard icon={Award} label="Certificates Issued" value={stats.totalCertificates} color="bg-yellow-100 text-yellow-600" />
      </div>
    </div>
  );
}
