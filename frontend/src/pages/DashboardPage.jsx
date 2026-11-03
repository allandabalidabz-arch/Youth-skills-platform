import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { BookOpen, Award, TrendingUp, CheckCircle2, Clock, ArrowRight, Users, Search, MapPin, Calendar, ChevronDown, ChevronUp, Layers, FileText, CreditCard, Star, XCircle, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState(null);

  const fetchDashboard = () => {
    setLoading(true);
    setError(null);
    const endpoint = user?.role === 'youth' ? '/dashboard/youth' : '/dashboard/admin';
    api.get(endpoint)
      .then(res => setData(res.data))
      .catch(err => {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDashboard(); }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-red-500 font-medium">{error}</p>
      <button onClick={fetchDashboard} className="btn-primary text-sm py-2 px-6">Try Again</button>
    </div>
  );

  if (user?.role === 'youth') return <YouthDashboard data={data} user={user} />;
  return <AdminDashboardView data={data} />;
}

function YouthDashboard({ data, user }) {
  const stats = data?.stats || { enrolledCourses: 0, completedCourses: 0, certificates: 0 };
  const recentCourses = data?.recentCourses || [];
  const recentCertificates = data?.recentCertificates || [];
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
              <p className="text-slate-400 text-sm mb-1">No courses yet</p>
              <p className="text-slate-400 text-xs mb-3">Start learning today — browse available courses and enroll for free.</p>
              <Link to="/courses" className="btn-primary mt-3 text-sm py-2">Browse Courses</Link>
            </div>
          ) : recentCourses.map(c => (
            <Link key={c.course_id} to={`/courses/${c.course_id}`} className="flex flex-col p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors mb-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                  {c.thumbnail ? <img src={c.thumbnail} alt="" className="w-full h-full object-cover" /> : <BookOpen className="w-5 h-5 text-slate-400 m-2.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{c.title}</p>
                  <span className={`badge text-xs ${categoryColors[c.category] || 'bg-slate-100 text-slate-600'}`}>{c.category}</span>
                </div>
                {c.completed_at ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> : <Clock className="w-5 h-5 text-slate-300 flex-shrink-0" />}
              </div>
              <div className="mt-2 ml-13">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{c.completedModules}/{c.totalModules} modules</span>
                  <span className="text-xs font-semibold text-blue-600">{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${c.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${c.progress}%` }} />
                </div>
              </div>
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

function AdminDashboardView({ data }) {
  const stats = data?.stats || { totalUsers: 0, youthUsers: 0, totalCourses: 0, totalEnrollments: 0, totalCertificates: 0 };

  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [total, setTotal] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);

  // Assignments state
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [gradingId, setGradingId] = useState(null);
  const [gradeInputs, setGradeInputs] = useState({});
  const [expandedSubmission, setExpandedSubmission] = useState(null);

  // Payments state
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState({});

  useEffect(() => {
    if (activeTab === 'youth') fetchUsers('');
    if (activeTab === 'modules') fetchCourses();
    if (activeTab === 'assignments') fetchSubmissions();
    if (activeTab === 'payments') fetchPayments();
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

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const coursesRes = await api.get('/courses?limit=20');
      const allSubs = [];
      for (const course of coursesRes.data.courses) {
        const res = await api.get(`/assignments/course/${course.id}/submissions`);
        allSubs.push(...res.data.submissions);
      }
      allSubs.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
      setSubmissions(allSubs);
    } catch (err) { console.error(err); }
    finally { setLoadingSubmissions(false); }
  };

  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await api.get('/payments/all');
      setPayments(res.data.payments);
    } catch (err) { console.error(err); }
    finally { setLoadingPayments(false); }
  };

  const handleGrade = async (submissionId) => {
    const { grade, feedback } = gradeInputs[submissionId] || {};
    if (grade === undefined || grade === '') return toast.error('Enter a grade between 0 and 100.');
    const g = parseInt(grade);
    if (isNaN(g) || g < 0 || g > 100) return toast.error('Grade must be between 0 and 100.');
    setGradingId(submissionId);
    try {
      await api.put(`/assignments/submission/${submissionId}/grade`, { grade: g, feedback: feedback || '' });
      toast.success('Assignment graded successfully!');
      setExpandedSubmission(null);
      fetchSubmissions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Grading failed.');
    } finally {
      setGradingId(null);
    }
  };

  const handleApprovePayment = async (paymentId) => {
    setProcessingPayment(paymentId);
    try {
      await api.put(`/payments/${paymentId}/approve`);
      toast.success('Payment approved — certificate unlocked!');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed.');
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    setProcessingPayment(paymentId);
    try {
      await api.put(`/payments/${paymentId}/reject`, { reason: rejectReason[paymentId] || '' });
      toast.success('Payment rejected.');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setProcessingPayment(null);
    }
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
    { id: 'completions', label: 'Completions', icon: Award },
    { id: 'modules', label: 'Modules', icon: Layers },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <button onClick={() => setActiveTab('youth')} className="card flex items-center gap-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer w-full">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalUsers}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
                <p className="text-xs text-blue-500">{stats.youthUsers} youth →</p>
              </div>
            </button>
            <button onClick={() => setActiveTab('modules')} className="card flex items-center gap-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer w-full">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600"><BookOpen className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalCourses}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Courses</p>
                <p className="text-xs text-purple-500">{stats.totalEnrollments} enrollments →</p>
              </div>
            </button>
            <button onClick={() => setActiveTab('completions')} className="card flex items-center gap-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer w-full">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-100 text-yellow-600"><Award className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalCertificates}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Certificates Issued</p>
                <p className="text-xs text-yellow-600">View completions →</p>
              </div>
            </button>
            <button onClick={() => setActiveTab('assignments')} className="card flex items-center gap-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer w-full">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-600"><FileText className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.pendingAssignments ?? 0}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pending Assignments</p>
                <p className="text-xs text-orange-500">Grade now →</p>
              </div>
            </button>
            <button onClick={() => setActiveTab('payments')} className="card flex items-center gap-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer w-full">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-600"><CreditCard className="w-6 h-6" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.pendingPayments ?? 0}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Pending Payments</p>
                <p className="text-xs text-green-500">Review now →</p>
              </div>
            </button>
          </div>
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
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">NRC</th>
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
                        {u.nrc
                          ? <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{u.nrc}</span>
                          : <span className="text-slate-300 dark:text-slate-600">—</span>}
                      </td>
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

      {/* COMPLETIONS */}
      {activeTab === 'completions' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-500" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Course Completions</h2>
            <span className="badge bg-yellow-100 text-yellow-700">{(data?.recentCompletions || []).length}</span>
          </div>
          {(data?.recentCompletions || []).length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No completions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Certificate No.</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                  {(data?.recentCompletions || []).map((c, idx) => (
                    <tr key={c.certificate_number} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-700 dark:text-yellow-300 font-bold text-xs flex-shrink-0">
                            {c.student_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-100">{c.student_name}</p>
                            <p className="text-xs text-slate-400">{c.student_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700 dark:text-slate-200">{c.course_title}</span>
                      </td>
                      <td className="py-3 px-3 hidden md:table-cell">
                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{c.certificate_number}</span>
                      </td>
                      <td className="py-3 px-3 hidden lg:table-cell">
                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(c.issued_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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
      {activeTab === 'modules' && (        <div className="space-y-3">
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

      {/* ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Assignment Submissions</h2>
              <span className="badge bg-blue-100 text-blue-700">{submissions.length}</span>
            </div>
            <button onClick={fetchSubmissions} className="btn-secondary text-sm py-2">Refresh</button>
          </div>
          {loadingSubmissions ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
          ) : submissions.length === 0 ? (
            <div className="card text-center py-12">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No submissions yet.</p>
            </div>
          ) : submissions.map(sub => (
            <div key={sub.id} className="card p-0 overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm flex-shrink-0">
                  {sub.student_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{sub.student_name}</p>
                    <span className="text-slate-400 text-xs">{sub.student_email}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    <span className="font-medium">{sub.assignment_title}</span> · {sub.module_title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Submitted: {new Date(sub.submitted_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {sub.status === 'graded' ? (
                    <span className={`badge text-xs ${sub.grade >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {sub.grade}/100
                    </span>
                  ) : (
                    <span className="badge bg-yellow-100 text-yellow-700 text-xs">Pending</span>
                  )}
                  <button
                    onClick={() => setExpandedSubmission(expandedSubmission === sub.id ? null : sub.id)}
                    className="btn-secondary text-xs py-1.5 px-3">
                    {expandedSubmission === sub.id ? 'Close' : sub.status === 'graded' ? 'View' : 'Grade'}
                  </button>
                </div>
              </div>

              {expandedSubmission === sub.id && (
                <div className="border-t border-slate-100 dark:border-slate-700 p-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Student's Submission</p>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 max-h-64 overflow-y-auto">
                      <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{sub.submission_text}</pre>
                    </div>
                  </div>
                  {sub.status === 'graded' && sub.feedback && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
                      <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Your Feedback</p>
                      <p className="text-sm text-green-700 dark:text-green-300">{sub.feedback}</p>
                    </div>
                  )}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
                      {sub.status === 'graded' ? 'Update Grade' : 'Grade this Submission'}
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Grade (0–100):</label>
                      <input type="number" min="0" max="100" className="input w-24 text-sm py-2"
                        placeholder={sub.grade ?? '0'} defaultValue={sub.grade ?? ''}
                        onChange={e => setGradeInputs(p => ({ ...p, [sub.id]: { ...p[sub.id], grade: e.target.value } }))} />
                    </div>
                    <div className="mt-3">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Feedback (optional):</label>
                      <textarea className="input mt-1 h-24 resize-none text-sm"
                        placeholder="Write feedback for the student..."
                        defaultValue={sub.feedback ?? ''}
                        onChange={e => setGradeInputs(p => ({ ...p, [sub.id]: { ...p[sub.id], feedback: e.target.value } }))} />
                    </div>
                    <button onClick={() => handleGrade(sub.id)} disabled={gradingId === sub.id} className="btn-primary text-sm py-2 mt-3">
                      {gradingId === sub.id
                        ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        : <><Star className="w-4 h-4" /> {sub.status === 'graded' ? 'Update Grade' : 'Submit Grade'}</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Certificate Payments</h2>
              <span className="badge bg-yellow-100 text-yellow-700">
                {payments.filter(p => p.status === 'pending').length} pending
              </span>
            </div>
            <button onClick={fetchPayments} className="btn-secondary text-sm py-2">Refresh</button>
          </div>
          {loadingPayments ? (
            <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
          ) : payments.length === 0 ? (
            <div className="card text-center py-12">
              <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No payment submissions yet.</p>
            </div>
          ) : payments.map(pay => (
            <div key={pay.id} className={`card border-l-4 ${pay.status === 'approved' ? 'border-green-500' : pay.status === 'rejected' ? 'border-red-400' : 'border-yellow-400'}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{pay.user_name}</p>
                    <span className="text-slate-400 text-xs">{pay.user_email}</span>
                    {pay.status === 'approved' && <span className="badge bg-green-100 text-green-700 text-xs"><CheckCircle className="w-3 h-3 inline mr-1" />Approved</span>}
                    {pay.status === 'rejected' && <span className="badge bg-red-100 text-red-700 text-xs"><XCircle className="w-3 h-3 inline mr-1" />Rejected</span>}
                    {pay.status === 'pending' && <span className="badge bg-yellow-100 text-yellow-700 text-xs"><AlertCircle className="w-3 h-3 inline mr-1" />Pending</span>}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-1"><span className="font-medium">Course:</span> {pay.course_title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-1"><span className="font-medium">Cert No:</span> <span className="font-mono text-xs">{pay.certificate_number}</span></p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-1"><span className="font-medium">Amount:</span> {pay.amount?.toLocaleString()} {pay.currency}</p>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 mt-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Payment Proof / Reference</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">{pay.proof_text}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Submitted: {new Date(pay.submitted_at).toLocaleString()}</p>
                  {pay.approved_at && <p className="text-xs text-green-600 mt-0.5">Approved: {new Date(pay.approved_at).toLocaleString()}</p>}
                </div>
                {pay.status === 'pending' && (
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <button onClick={() => handleApprovePayment(pay.id)} disabled={processingPayment === pay.id}
                      className="btn-primary text-sm py-2 bg-green-600 hover:bg-green-700">
                      {processingPayment === pay.id
                        ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        : <><CheckCircle className="w-4 h-4" /> Approve</>}
                    </button>
                    <input type="text" className="input text-xs py-2" placeholder="Reject reason (optional)..."
                      value={rejectReason[pay.id] || ''}
                      onChange={e => setRejectReason(p => ({ ...p, [pay.id]: e.target.value }))} />
                    <button onClick={() => handleRejectPayment(pay.id)} disabled={processingPayment === pay.id}
                      className="btn-secondary text-sm py-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
