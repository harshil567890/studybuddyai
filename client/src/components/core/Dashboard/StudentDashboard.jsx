import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Flame,
  Award,
  PlayCircle,
  BookOpen,
  Clock,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Layers,
  ChevronRight,
} from "lucide-react";
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import { fetchCognitiveAnalytics } from "../../../services/operations/studioAPI";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { analytics } = useSelector((state) => state.studio);

  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studyGoals, setStudyGoals] = useState([
    { id: 1, title: "Master 10 Flashcards in Distributed Systems", done: true },
    { id: 2, title: "Complete System Architecture Quiz with >85%", done: false },
    { id: 3, title: "Watch 2 Video Lectures on AI Integration", done: false },
    { id: 4, title: "Upload & Synthesize Semester Exam Notes", done: false },
  ]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (token) {
        const courses = await getUserEnrolledCourses(token);
        if (courses) {
          setEnrolledCourses(courses);
        }
        dispatch(fetchCognitiveAnalytics(token));
      }
      setLoading(false);
    })();
  }, [token, dispatch]);

  const activeCourse = enrolledCourses && enrolledCourses.length > 0 ? enrolledCourses[0] : null;

  const toggleGoal = (id) => {
    setStudyGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <div className="h-32 rounded-3xl bg-slate-900/60 border border-slate-800" />
        <div className="h-48 rounded-3xl bg-slate-900/40 border border-slate-800" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-900/40 border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 text-slate-100">
      {/* Student Command Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-indigo-950/30 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <img
            src={user?.image}
            alt={`${user?.firstName} ${user?.lastName}`}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Student Command Center
              </span>
              <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                <Flame className="h-3 w-3 fill-amber-400 text-amber-400" />
                {analytics?.streakDays || 7} Day Streak
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              You are on pace for optimal knowledge retention. Pick up where you left off.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/studio")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-95 transition"
          >
            <BrainCircuit className="h-4 w-4" />
            <span>Open Study Studio</span>
          </button>
        </div>
      </div>

      {/* Primary Continue Learning Section */}
      {activeCourse ? (
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={activeCourse.thumbnail}
                alt={activeCourse.courseName}
                className="h-28 w-44 rounded-2xl object-cover border border-slate-700/60 shadow-md shrink-0"
              />
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  Current Course in Progress
                </span>
                <h3 className="text-xl font-bold text-white line-clamp-1">
                  {activeCourse.courseName}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 max-w-xl">
                  {activeCourse.courseDescription}
                </p>

                {/* Progress Bar */}
                <div className="pt-2 w-full max-w-md">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
                    <span>Progress</span>
                    <span className="text-indigo-300 font-bold">
                      {activeCourse.progressPercentage || 0}% Complete
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${activeCourse.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const firstSection = activeCourse.courseContent?.[0];
                const firstSub = firstSection?.subSection?.[0];
                if (firstSection && firstSub) {
                  navigate(
                    `/view-course/${activeCourse._id}/section/${firstSection._id}/sub-section/${firstSub._id}`
                  );
                } else {
                  navigate(`/dashboard/enrolled-courses`);
                }
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-xs font-bold text-white shadow-xl hover:opacity-95 transition shrink-0"
            >
              <PlayCircle className="h-5 w-5" />
              <span>Resume Active Lecture</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-800 p-8 text-center bg-slate-900/20">
          <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">No enrolled courses yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Explore our curated catalog of AI and software architecture masterclasses to begin your learning journey.
          </p>
          <button
            onClick={() => navigate("/catalog/artificial-intelligence")}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg"
          >
            Explore Courses
          </button>
        </div>
      )}

      {/* Velocity & Retention Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Clock,
            label: "Weekly Study Velocity",
            val: `${analytics?.studyHours ?? "0.0"} hrs`,
            pill: Number(analytics?.studyHours || 0) > 0 ? "Active sessions" : "No sessions logged",
            pillColor: Number(analytics?.studyHours || 0) > 0 ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 bg-slate-800/40",
          },
          {
            icon: Award,
            label: "Cognitive Retention",
            val: (analytics?.cognitiveScore && analytics.cognitiveScore > 0) ? `${analytics.cognitiveScore}%` : "Not Calibrated",
            pill: (analytics?.cognitiveScore && analytics.cognitiveScore > 0) ? "Retention index" : "Take quiz to calibrate",
            pillColor: (analytics?.cognitiveScore && analytics.cognitiveScore > 0) ? "text-cyan-400 bg-cyan-500/10" : "text-slate-400 bg-slate-800/40",
          },
          {
            icon: HelpCircle,
            label: "Quiz Accuracy",
            val: (analytics?.totalQuizzes && analytics.totalQuizzes > 0) ? `${analytics.averageQuizScore}%` : "0%",
            pill: `${analytics?.totalQuizzes || 0} sets completed`,
            pillColor: (analytics?.totalQuizzes && analytics.totalQuizzes > 0) ? "text-purple-400 bg-purple-500/10" : "text-slate-400 bg-slate-800/40",
          },
          {
            icon: Layers,
            label: "Flashcards Mastered",
            val: `${analytics?.masteredFlashcards || 0}`,
            pill: `${analytics?.totalFlashcards || 0} total in decks`,
            pillColor: (analytics?.masteredFlashcards && analytics.masteredFlashcards > 0) ? "text-indigo-400 bg-indigo-500/10" : "text-slate-400 bg-slate-800/40",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2 backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                <Icon className="h-4 w-4 text-slate-500" />
              </div>
              <p className="text-2xl font-black text-white">{stat.val}</p>
              <span
                className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${stat.pillColor}`}
              >
                {stat.pill}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grid: AI Recommendations & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: AI Recommendations & Study Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Tutor Recommendations */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  AI-Curated Study Recommendations
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Dynamic Analysis</span>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "Practice Arena: Test Your Skills",
                  desc: "Take an adaptive AI arena quiz with immediate scorecards and detailed explanations.",
                  action: "Take Practice Quiz",
                  onClick: () => navigate("/studio"),
                },
                {
                  title: "Spaced Retrieval: Study Flashcard Decks",
                  desc: "Review flashcards using active recall to optimize memory consolidation.",
                  action: "Review Cards",
                  onClick: () => navigate("/studio"),
                },
                {
                  title: "Document Synthesis: Upload Notes or Slides",
                  desc: "Process PDF notes in the Study Studio to auto-generate exam summaries and practice questions.",
                  action: "Open Studio",
                  onClick: () => navigate("/studio"),
                },
              ].map((rec, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {rec.desc}
                      </p>
                    </div>
                    <button
                      onClick={rec.onClick}
                      className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
                    >
                      <span>{rec.action}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Study Goals */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-400" />
              Weekly Milestone Goals
            </h3>
            <div className="space-y-2">
              {studyGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`flex items-center justify-between rounded-2xl p-3.5 border cursor-pointer transition ${
                    goal.done
                      ? "bg-slate-950/40 border-slate-800/60 text-slate-500 line-through"
                      : "bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={goal.done}
                      onChange={() => {}}
                      className="rounded accent-indigo-600"
                    />
                    <span className="text-xs font-medium">{goal.title}</span>
                  </div>
                  {goal.done && (
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Done
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Subject Mastery Radar & Quick Links */}
        <div className="space-y-6">
          {/* Subject Mastery Radar */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white">Subject Mastery Radar</h3>
            {analytics?.subjectRadar && analytics.subjectRadar.length > 0 ? (
              <div className="space-y-4">
                {analytics.subjectRadar.map((sub, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-300">
                      <span>{sub.subject}</span>
                      <span className="text-cyan-400 font-bold">{sub.score}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                        style={{ width: `${sub.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800/80">
                <BrainCircuit className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">Radar Calibration Pending</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Complete quizzes and flashcard reviews in the Study Studio to chart your topic mastery radar.
                </p>
              </div>
            )}
          </div>

          {/* Quick Enrolled Courses Overview */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Enrolled Courses</h3>
              <button
                onClick={() => navigate("/dashboard/enrolled-courses")}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {enrolledCourses && enrolledCourses.length > 0 ? (
                enrolledCourses.slice(0, 3).map((c) => (
                  <div
                    key={c._id}
                    onClick={() => navigate("/dashboard/enrolled-courses")}
                    className="flex items-center gap-3 rounded-2xl p-2.5 bg-slate-950/50 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition"
                  >
                    <img
                      src={c.thumbnail}
                      alt={c.courseName}
                      className="h-12 w-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {c.courseName}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {c.progressPercentage || 0}% completed
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 px-3 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800/80">
                  <p className="text-xs text-slate-400">No courses in progress</p>
                  <button
                    onClick={() => navigate("/catalog/artificial-intelligence")}
                    className="mt-2 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Browse Catalog
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
