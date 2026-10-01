import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Logo from './Logo';
import {
  LayoutDashboard, BookOpen, Award, User, LogOut,
  Bell, Menu, Building2, Sun, Moon
} from 'lucide-react';

// ── Dark mode hook ─────────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return [dark, setDark];
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications.slice(0, 8));
      setUnreadCount(res.data.unreadCount);
    } catch {}
  };

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = user?.role === 'admin' ? [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
  ] : user?.role === 'youth' ? [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'Courses' },
    { to: '/certificates', icon: Award, label: 'Certificates' },
    { to: '/profile', icon: User, label: 'Profile' },
  ] : [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const notifTypeColors = {
    success: 'bg-green-100 text-green-700',
    achievement: 'bg-yellow-100 text-yellow-700',
    warning: 'bg-orange-100 text-orange-700',
    info: 'bg-blue-100 text-blue-700'
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-700">
            <Logo size="sm" />
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100'}`
                }>
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer" onClick={() => navigate('/profile')}>
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm overflow-hidden">
                {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-4 lg:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-100">{user?.name}</span> 👋</p>
          </div>
          <div className="flex items-center gap-3 ml-auto">

            {/* Dark mode toggle */}
            <button onClick={() => setDark(!dark)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {dark
                ? <Sun className="w-5 h-5 text-yellow-400" />
                : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
                    {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">Mark all read</button>}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-center text-slate-400 py-8 text-sm">No notifications yet</p>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 ${!n.is_read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                        <div className="flex items-start gap-2">
                          <span className={`badge mt-0.5 ${notifTypeColors[n.type] || notifTypeColors.info}`}>{n.type}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
