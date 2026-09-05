import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  BookOpen, Clock, CheckCircle2, ChevronDown, ChevronUp,
  Play, Award, Users, ArrowLeft, Lock, FileText, Send, RotateCcw
} from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [assignments, setAssignments] = useState({});
  const [submissionText, setSubmissionText] = useState({});
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data.course);
      setModules(res.data.modules);
      setEnrollment(res.data.enrollment);
      // Fetch assignments for all modules
      const assignmentData = {};
      for (const mod of res.data.modules) {
        const aRes = await api.get(`/assignments/module/${mod.id}`);
        if (aRes.data.assignment) {
          assignmentData[mod.id] = { assignment: aRes.data.assignment, submission: aRes.data.submission };
        }
      }
      setAssignments(assignmentData);
    } catch {
      toast.error('Course not found');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourse(); }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success('Enrolled successfully!');
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleSubmitAssignment = async (assignmentId, moduleId) => {
    const text = submissionText[moduleId] || '';
    if (text.trim().length < 20) {
      return toast.error('Submission must be at least 20 characters.');
    }
    setSubmittingAssignment(true);
    try {
      await api.post(`/assignments/${assignmentId}/submit`, { submission_text: text });
      toast.success('Assignment submitted successfully!');
      fetchCourse();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const handleCompleteModule = async (moduleId, score) => {
    setCompleting(true);
    try {
      const res = await api.post(`/progress/module/${moduleId}/complete`, { quiz_score: score });
      toast.success(res.data.certificateIssued ? '🏆 Certificate earned!' : 'Module completed!');
      fetchCourse();
      setQuizMode(false);
      setQuizResult(null);
      setQuizAnswers({});
    } catch (err) {
      toast.error('Failed to mark complete');
    } finally {
      setCompleting(false);
    }
  };

  const handleSubmitQuiz = async (module) => {
    const answers = module.quizzes.map((_, i) => quizAnswers[i] ?? -1);
    try {
      const res = await api.post(`/progress/quiz/${module.id}/submit`, { answers });
      setQuizResult(res.data);
      if (res.data.score >= 60) {
        await handleCompleteModule(module.id, res.data.score);
      }
    } catch {
      toast.error('Quiz submission failed');
    }
  };

  const completedCount = modules.filter(m => m.progress?.completed).length;
  const progress = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;
  if (!course) return null;

  const categoryColors = { system: 'bg-indigo-100 text-indigo-700', coding: 'bg-blue-100 text-blue-700' };

  return (
    <div className="space-y-6 fade-in max-w-4xl">
      <button onClick={() => navigate('/courses')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>

      {/* Course Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-6">
          {course.thumbnail && (
            <img src={course.thumbnail} alt={course.title} className="w-full md:w-56 h-40 object-cover rounded-xl flex-shrink-0" />
          )}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`badge ${categoryColors[course.category] || 'bg-slate-100 text-slate-600'}`}>{course.category}</span>
              <span className="badge bg-slate-100 text-slate-600">{course.level}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{course.title}</h1>
            <p className="text-slate-500 mb-4">{course.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration_hours} hours</span>
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {modules.length} modules</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.enrolled_count} enrolled</span>
            </div>
            <p className="text-sm text-slate-600">Instructor: <span className="font-semibold">{course.instructor_name}</span></p>

            {user?.role === 'youth' && !enrollment && (
              <button onClick={handleEnroll} disabled={enrolling} className="btn-primary mt-4">
                {enrolling ? 'Enrolling...' : 'Enroll Now — Free'}
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {enrollment && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Your Progress</span>
              <span className="text-sm font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-1">{completedCount} of {modules.length} modules completed</p>
            {enrollment.completed_at && (
              <div className="flex items-center gap-2 mt-2 text-green-600 font-medium text-sm">
                <Award className="w-4 h-4" /> Course completed! Certificate issued.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="card">
        <h2 className="font-bold text-slate-800 mb-4 text-lg">Course Modules</h2>
        <div className="space-y-3">
          {modules.map((module, idx) => {
            const isCompleted = module.progress?.completed;
            const isActive = activeModule === module.id;
            const isLocked = !enrollment && user?.role === 'youth';

            return (
              <div key={module.id} className={`border rounded-xl overflow-hidden transition-all ${isActive ? 'border-blue-200' : 'border-slate-100'}`}>
                <button
                  onClick={() => !isLocked && setActiveModule(isActive ? null : module.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors ${isLocked ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-100' : 'bg-slate-100'}`}>
                    {isLocked ? <Lock className="w-4 h-4 text-slate-400" /> :
                      isCompleted ? <CheckCircle2 className="w-5 h-5 text-green-600" /> :
                      <span className="text-sm font-bold text-slate-500">{idx + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{module.title}</p>
                    <p className="text-xs text-slate-400">{module.duration_minutes} min · {module.quizzes?.length || 0} quiz questions</p>
                  </div>
                  {isCompleted && module.progress?.quiz_score !== null && (
                    <span className="badge bg-green-100 text-green-700 text-xs">Quiz: {module.progress.quiz_score}%</span>
                  )}
                  {!isLocked && (isActive ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />)}
                </button>

                {isActive && !isLocked && (
                  <div className="px-4 pb-4 border-t border-slate-100">
                    {/* Content */}
                    {!quizMode ? (
                      <div>
                        <div className="prose prose-sm max-w-none mt-4 text-slate-700 bg-slate-50 rounded-xl p-4 overflow-auto">
                          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{module.content}</pre>
                        </div>
                        <div className="flex gap-3 mt-4">
                          {module.quizzes?.length > 0 && !isCompleted && (
                            <button onClick={() => setQuizMode(true)} className="btn-primary text-sm py-2">
                              <Play className="w-4 h-4" /> Take Quiz
                            </button>
                          )}
                          {!isCompleted && module.quizzes?.length === 0 && (
                            <button onClick={() => handleCompleteModule(module.id, null)} disabled={completing} className="btn-primary text-sm py-2">
                              <CheckCircle2 className="w-4 h-4" /> Mark Complete
                            </button>
                          )}
                          {isCompleted && <span className="flex items-center gap-2 text-green-600 font-medium text-sm"><CheckCircle2 className="w-4 h-4" /> Completed</span>}
                        </div>

                        {/* Assignment Section */}
                        {assignments[module.id] && (
                          <div className="mt-6 border-t border-slate-100 pt-5">
                            <div className="flex items-center gap-2 mb-3">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <h4 className="font-bold text-slate-800">Assignment</h4>
                              {assignments[module.id].submission && (
                                <span className={`badge text-xs ${assignments[module.id].submission.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {assignments[module.id].submission.status === 'graded'
                                    ? `Graded: ${assignments[module.id].submission.grade}/100`
                                    : 'Submitted'}
                                </span>
                              )}
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 mb-4">
                              <h5 className="font-semibold text-slate-800 mb-1">{assignments[module.id].assignment.title}</h5>
                              <p className="text-sm text-slate-600 mb-3">{assignments[module.id].assignment.description}</p>
                              <div className="bg-white rounded-lg p-3 border border-blue-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Instructions:</p>
                                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{assignments[module.id].assignment.instructions}</pre>
                              </div>
                            </div>

                            {/* Feedback if graded */}
                            {assignments[module.id].submission?.status === 'graded' && assignments[module.id].submission?.feedback && (
                              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                <p className="text-sm font-semibold text-green-800 mb-1">Instructor Feedback:</p>
                                <p className="text-sm text-green-700">{assignments[module.id].submission.feedback}</p>
                              </div>
                            )}

                            {/* Previous submission */}
                            {assignments[module.id].submission && (
                              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Your Submission:</p>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap line-clamp-4">{assignments[module.id].submission.submission_text}</p>
                              </div>
                            )}

                            {/* Submission form */}
                            {enrollment && user?.role === 'youth' && assignments[module.id].submission?.status !== 'graded' && (
                              <div>
                                <textarea
                                  className="input h-36 resize-none text-sm"
                                  placeholder="Write your assignment submission here... (minimum 20 characters)"
                                  value={submissionText[module.id] || assignments[module.id].submission?.submission_text || ''}
                                  onChange={e => setSubmissionText(p => ({ ...p, [module.id]: e.target.value }))}
                                />
                                <button
                                  onClick={() => handleSubmitAssignment(assignments[module.id].assignment.id, module.id)}
                                  disabled={submittingAssignment}
                                  className="btn-primary text-sm py-2 mt-2"
                                >
                                  {assignments[module.id].submission ? <><RotateCcw className="w-4 h-4" /> Resubmit</> : <><Send className="w-4 h-4" /> Submit Assignment</>}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Quiz */
                      <div className="mt-4">
                        {quizResult ? (
                          <div className={`p-4 rounded-xl mb-4 ${quizResult.score >= 60 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <p className="font-bold text-lg">{quizResult.score >= 60 ? '🎉 Passed!' : '❌ Try Again'}</p>
                            <p className="text-sm">Score: {quizResult.score}% ({quizResult.correct}/{quizResult.total} correct)</p>
                            {quizResult.score < 60 && (
                              <button onClick={() => { setQuizResult(null); setQuizAnswers({}); }} className="btn-primary mt-3 text-sm py-2">Retry Quiz</button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <h3 className="font-bold text-slate-800">Quiz — {module.title}</h3>
                            {module.quizzes.map((q, qi) => (
                              <div key={q.id} className="bg-slate-50 rounded-xl p-4">
                                <p className="font-medium text-slate-800 mb-3 text-sm">{qi + 1}. {q.question}</p>
                                <div className="space-y-2">
                                  {q.options.map((opt, oi) => (
                                    <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${quizAnswers[qi] === oi ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}>
                                      <input type="radio" name={`q${qi}`} checked={quizAnswers[qi] === oi} onChange={() => setQuizAnswers(p => ({ ...p, [qi]: oi }))} className="text-blue-600" />
                                      <span className="text-sm text-slate-700">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <div className="flex gap-3">
                              <button onClick={() => handleSubmitQuiz(module)} disabled={Object.keys(quizAnswers).length < module.quizzes.length} className="btn-primary text-sm py-2">Submit Quiz</button>
                              <button onClick={() => setQuizMode(false)} className="btn-secondary text-sm py-2">Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
