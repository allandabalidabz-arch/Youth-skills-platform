import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { BookOpen, Clock, Users, Search, Filter, CheckCircle2 } from 'lucide-react';

const categoryColors = {
  system: 'bg-indigo-100 text-indigo-700',
  coding: 'bg-blue-100 text-blue-700',
};

const levelColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700'
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (level) params.set('level', level);
      const res = await api.get(`/courses?${params}`);
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [category, level]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="section-title">Course Library</h1>
        <p className="section-subtitle">Explore our digital skills courses and start learning today</p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" className="input pl-10" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input sm:w-44" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="system">Systems</option>
            <option value="coding">Coding</option>
          </select>
          <select className="input sm:w-36" value={level} onChange={e => setLevel(e.target.value)}>
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-40 bg-slate-200 rounded-xl mb-4" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No courses found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(course => (
            <Link key={course.id} to={`/courses/${course.id}`} className="card hover:shadow-md transition-all hover:-translate-y-0.5 group p-0 overflow-hidden">
              {/* Thumbnail */}
              <div className="h-44 bg-slate-100 overflow-hidden relative">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                {course.is_enrolled && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Enrolled
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${categoryColors[course.category] || 'bg-slate-100 text-slate-600'}`}>{course.category}</span>
                  <span className={`badge ${levelColors[course.level] || 'bg-slate-100 text-slate-600'}`}>{course.level}</span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-3">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration_hours}h</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.enrolled_count} enrolled</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.module_count} modules</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">By {course.instructor_name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
