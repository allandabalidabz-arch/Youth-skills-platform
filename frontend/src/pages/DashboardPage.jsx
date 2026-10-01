import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { BookOpen, Award, TrendingUp, CheckCircle2, Clock, ArrowRight, Building2, Users, Search, MapPin, Calendar, ChevronDown, ChevronUp, Layers } from 'lucide-react';

const categoryColors = {
  system: 'bg-indigo-100 text-indigo-700',
  coding: 'bg-blue-100 text-blue-700',
};

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500">{sub}</p>}
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={BookOpen} label="Enrolled Courses" value={stats.enrolledCourses} color="bg-blue-100 text-blue-600" sub={`${stats.completedCourses} completed`} />
        <StatCard icon={Award} label="Certificates" value={stats.certificates} color="bg-yellow-100 text-yellow-600" />
        <StatCard icon={TrendingUp} label="Completion Rate" value={stats.enrolledCourses > 0 ? `${Math.round((stats.completedCourses / stats.enrolledCourses) * 100)}%` : '0%'} color="bg-purple-100 text-purple-600" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 dark:text-slate-100">My Courses</h2>
            <Link to="/courses" className="text-sm text-blue-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {recentCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No courses yet</p>
              <Link to="/courses" className="btn-primary mt-3 text-sm py-2">Browse Courses</Link>
            </div>
          ) : recentCourses.map(c => (
            <Link key={c.course_id} to={`/courses/${c.course_id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors mb-1">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                {c.thumbnail ? <img src={c.thumbnail} alt="" className="w-full h-full object-cover" /> : <BookOpen className="w-5 h-5 text-slate-400 m-2.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{c.title}</p>
                <span className={`badge text-xs ${categoryColors[c.category] || 'bg-slate-100 text-slate-600'}`}>{c.category}</span>
              </div>
              {c.completed_at ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> : <Clock className="w-5 h-5 text-slate-300 flex-shrink-0" />}
            </Link>
          ))}
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Recent Certificates</h2>
            <Link to="/certificates" className="text-sm text-blue-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {recentCertificates.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Complete a course to earn your first certificate</p>
            </div>
          ) : recentCertificates.map(c => (
            <div key={c.certificate_number} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 mb-2">
              <Award className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{c.course_title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">#{c.certificate_number} · {new Date(c.issued_at).toLocaleDateString()}</p>
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
        <p className="text-slate-500 dark:text-slate-400 text-sm">Employer features are coming soon.</p>
      </div>
    </div>
  );
}

function AdminDashboardView({ data }) {
  if (!data) return null;
  const { stats } = data;

  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [total, setTotal] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    if (activeTab === 'youth') fetchUsers('');
    if (activeTab === 'modules') fetchCourses();
  }, [activeTab]);

  const fetchUsers = async (q) => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({ role: 'youth', limit: 50 });
      if (q) params.set('search', q);
      const res = await api.get(`/users?${params}`);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    finally { setLoadingUsers(false); }
  };

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await api.get('/courses?limit=20');
      setCourses(res.data.courses);
    } catch (err) { console.error(err); }
    finally { setLoadingCourses(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchUsers(search); };

  const toggleCourse = async (courseId) => {
    if (expandedCourse === courseId) { setExpandedCourse(null); return; }
    setExpandedCourse(courseId);
    if (!courses.find(c => c.id === courseId)?.modules) {
      try {
        const res = await api.get(`/courses/${courseId}`);
        setCourses(prev => prev.map(c => c.id === courseId ? { ...c, modules: res.data.modules } : c));
      } catch (err) { console.error(err); }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'youth', label: 'Registered Youth', icon: Users },
    { id: 'modules', label: 'Modules', icon: Layers },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-subtitle">Platform overview and management</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id
              ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button onClick={() => setActiveTab('youth')} className="card flex items-center gap-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer w-full">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalUsers}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
                <p className="text-xs text-blue-500">{stats.youthUsers} youth →</p>
              </div>
            </button>
            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-600"><Building2 className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.employers}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Employers</p>
              </div>
            </div>
            <button onClick={() => setActiveTab('modules')} className="card flex items-center gap-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer w-full">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600"><BookOpen className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalCourses}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Courses</p>
                <p className="text-xs text-purple-500">{stats.totalEnrollments} enrollments →</p>
              </div>
            </button>
            <div className="card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-100 text-yellow-600"><Award className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalCertificates}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Certificates Issued</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Click on Total Users or Courses cards to view details.</p>
        </div>
      )}

      {/* YOUTH */}
      {activeTab === 'youth' && (
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Registered Youth</h2>
              <span className="badge bg-blue-100 text-blue-700">{total}</span>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" className="input pl-9 py-2 text-sm w-56" placeholder="Search name or email..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary py-2 px-4 text-sm">Search</button>
            </form>
          </div>
          {loadingUsers ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No youth users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Location</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                  {users.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs flex-shrink-0 overflow-hidden">
                            {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-800 dark:text-slate-100">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                      <td className="py-3 px-3 hidden md:table-cell">
                        {u.location
                          ? <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><MapPin className="w-3 h-3" />{u.location}</span>
                          : <span className="text-slate-300 dark:text-slate-600">—</span>}
                      </td>
                      <td className="py-3 px-3 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">Click a course to expand its modules.</p>
          {loadingCourses ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
          ) : courses.map(course => (
            <div key={course.id} className="card p-0 overflow-hidden">
              <button onClick={() => toggleCourse(course.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                  {course.thumbnail ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover" /> : <BookOpen className="w-6 h-6 text-slate-400 m-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-slate-100">{course.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`badge text-xs ${course.category === 'system' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>{course.category}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{course.module_count} modules · {course.enrolled_count} enrolled</span>
                  </div>
                </div>
                {expandedCourse === course.id ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
              </button>
              {expandedCourse === course.id && (
                <div className="border-t border-slate-100 dark:border-slate-700">
                  {!course.modules ? (
                    <div className="flex items-center justify-center py-6"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" /></div>
                  ) : course.modules.map((mod, idx) => (
                    <div key={mod.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs flex-shrink-0">{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{mod.title}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{mod.duration_minutes} min · {mod.quizzes?.length || 0} quiz questions</p>
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
