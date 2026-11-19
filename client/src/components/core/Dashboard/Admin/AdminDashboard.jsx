import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ShieldAlert,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Search,
  Trash2,
  Plus,
  Layers,
  Sparkles,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  fetchAdminStats,
  fetchAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  fetchAdminCourses,
  toggleCourseStatus,
  createCategory,
  deleteCategory,
} from "../../../../services/operations/adminAPI";
import { fetchCourseCategories } from "../../../../services/operations/courseDetailsAPI";

export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'users' | 'courses' | 'categories'
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // User Management states
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);

  // Course Management states
  const [courses, setCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [courseStatusFilter, setCourseStatusFilter] = useState("");
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Category Management states
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [catModalOpen, setCatModalOpen] = useState(false);

  // Load Platform Stats
  const loadStats = async () => {
    setStatsLoading(true);
    const data = await fetchAdminStats(token);
    if (data) setStats(data);
    setStatsLoading(false);
  };

  // Load Users
  const loadUsers = async () => {
    setUsersLoading(true);
    const data = await fetchAllUsers(token, userSearch, userRoleFilter);
    if (data) setUsers(data);
    setUsersLoading(false);
  };

  // Load Courses
  const loadCourses = async () => {
    setCoursesLoading(true);
    const data = await fetchAdminCourses(token, courseSearch, courseStatusFilter);
    if (data) setCourses(data);
    setCoursesLoading(false);
  };

  // Load Categories
  const loadCategories = async () => {
    const data = await fetchCourseCategories();
    if (data) setCategories(data);
  };

  useEffect(() => {
    if (token) {
      loadStats();
      loadCategories();
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "courses") loadCourses();
    if (activeTab === "categories") loadCategories();
  }, [activeTab, userRoleFilter, courseStatusFilter]);

  // Handle User Role Change
  const handleRoleChange = async (userId, newRole) => {
    const updated = await updateUserRole(userId, newRole, token);
    if (updated) {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, accountType: newRole } : u))
      );
    }
  };

  // Handle User Status Toggle
  const handleToggleStatus = async (userId) => {
    const updated = await toggleUserStatus(userId, token);
    if (updated && typeof updated.active === "boolean") {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, active: updated.active } : u))
      );
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const success = await deleteUser(userId, token);
    if (success) {
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      loadStats();
    }
  };

  // Handle Course Status Toggle
  const handleToggleCourse = async (courseId) => {
    const updated = await toggleCourseStatus(courseId, token);
    if (updated) {
      setCourses((prev) =>
        prev.map((c) => (c._id === courseId ? { ...c, status: updated.status } : c))
      );
    }
  };

  // Handle Create Category
  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCatName.trim() || !newCatDesc.trim()) {
      toast.error("Category name and description are required");
      return;
    }
    const created = await createCategory(newCatName.trim(), newCatDesc.trim(), token);
    if (created) {
      setNewCatName("");
      setNewCatDesc("");
      setCatModalOpen(false);
      loadCategories();
      loadStats();
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm("Delete this category?")) return;
    const success = await deleteCategory(catId, token);
    if (success) {
      setCategories((prev) => prev.filter((c) => c._id !== catId));
      loadStats();
    }
  };

  return (
    <div className="space-y-8 pb-12 text-slate-100">
      {/* Admin Executive Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-rose-500/20">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Governance & Security
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                Platform Normal
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Platform Admin Control Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live monitoring, role-based access control, catalog governance, and revenue analytics.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            loadStats();
            toast.success("Platform telemetry synchronized");
          }}
          className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-800/80 space-x-2 overflow-x-auto">
        {[
          { id: "overview", label: "Executive Overview", icon: BarChart3 },
          { id: "users", label: "User Governance", icon: Users },
          { id: "courses", label: "Course Catalog", icon: BookOpen },
          { id: "categories", label: "Category Taxonomy", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "border-rose-500 text-rose-400 bg-rose-500/10 rounded-t-xl shadow-sm"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 rounded-t-xl"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && (
        statsLoading && !stats ? (
          <div className="p-12 text-center text-slate-400">Loading platform telemetry...</div>
        ) : (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Registered Users",
                val: stats?.totalUsers || 0,
                sub: `${stats?.totalStudents || 0} Students • ${stats?.totalInstructors || 0} Instructors`,
                icon: Users,
                color: "text-indigo-400",
              },
              {
                label: "Course Catalog",
                val: stats?.totalCourses || 0,
                sub: `${stats?.publishedCourses || 0} Published • ${stats?.draftCourses || 0} Draft`,
                icon: BookOpen,
                color: "text-cyan-400",
              },
              {
                label: "Platform Revenue",
                val: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
                sub: `${stats?.totalEnrollments || 0} Paid Enrollments`,
                icon: DollarSign,
                color: "text-emerald-400",
              },
              {
                label: "AI Studio Artifacts",
                val: (stats?.totalDocuments || 0) + (stats?.totalQuizzes || 0),
                sub: `${stats?.totalDocuments || 0} Docs • ${stats?.totalQuizzes || 0} Quizzes`,
                icon: Sparkles,
                color: "text-purple-400",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">{card.label}</span>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                  <p className="text-2xl font-black text-white">{card.val}</p>
                  <p className="text-[11px] text-slate-400">{card.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Platform Activity & Ecosystem Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                Role Distribution
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Students</span>
                    <span className="text-indigo-400 font-bold">
                      {stats?.totalStudents || 0}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${
                          stats?.totalUsers
                            ? ((stats.totalStudents || 0) / stats.totalUsers) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Instructors</span>
                    <span className="text-purple-400 font-bold">
                      {stats?.totalInstructors || 0}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{
                        width: `${
                          stats?.totalUsers
                            ? ((stats.totalInstructors || 0) / stats.totalUsers) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                Catalog Status
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Published Courses</span>
                    <span className="text-emerald-400 font-bold">
                      {stats?.publishedCourses || 0}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${
                          stats?.totalCourses
                            ? ((stats.publishedCourses || 0) / stats.totalCourses) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Draft Courses</span>
                    <span className="text-amber-400 font-bold">
                      {stats?.draftCourses || 0}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{
                        width: `${
                          stats?.totalCourses
                            ? ((stats.draftCourses || 0) / stats.totalCourses) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
      )}

      {/* TAB 2: USER GOVERNANCE */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadUsers()}
                placeholder="Search by name or email..."
                className="w-full rounded-xl bg-slate-900/60 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="">All Roles</option>
                <option value="Student">Students</option>
                <option value="Instructor">Instructors</option>
                <option value="Admin">Admins</option>
              </select>

              <button
                onClick={loadUsers}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition"
              >
                Apply Filter
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {usersLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                      Loading user accounts...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                      No users match your criteria.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/20 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={u.image}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover border border-slate-700"
                      />
                      <span className="font-semibold text-white">
                        {u.firstName} {u.lastName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.accountType}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-1 text-[11px] text-slate-200 focus:outline-none"
                      >
                        <option value="Student">Student</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border transition ${
                          u.active !== false
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-rose-500/10 hover:text-rose-400"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-emerald-500/10 hover:text-emerald-400"
                        }`}
                      >
                        {u.active !== false ? "Active" : "Suspended"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                      {u.createdAt && !isNaN(new Date(u.createdAt)) ? new Date(u.createdAt).toLocaleDateString() : "Active Member"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-slate-500 hover:text-rose-400 transition"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4 ml-auto" />
                      </button>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COURSE CATALOG GOVERNANCE */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadCourses()}
                placeholder="Search courses..."
                className="w-full rounded-xl bg-slate-900/60 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={courseStatusFilter}
                onChange={(e) => setCourseStatusFilter(e.target.value)}
                className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>

              <button
                onClick={loadCourses}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition"
              >
                Filter Courses
              </button>
            </div>
          </div>

          {coursesLoading ? (
            <div className="p-12 text-center text-slate-400">Loading catalog courses...</div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No courses match your query.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
              <div
                key={c._id}
                className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 backdrop-blur-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 mb-3">
                    <img
                      src={c.thumbnail}
                      alt={c.courseName}
                      className="h-full w-full object-cover"
                    />
                    <span
                      className={`absolute top-2 right-2 rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        c.status === "Published"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {c.courseName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {c.courseDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500">Instructor</span>
                    <p className="text-xs font-semibold text-slate-300">
                      {c.instructor?.firstName} {c.instructor?.lastName}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleCourse(c._id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-sm ${
                      c.status === "Published"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                    }`}
                  >
                    {c.status === "Published" ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* TAB 4: CATEGORY TAXONOMY */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Course Categories</h3>
              <p className="text-xs text-slate-400">
                Organize catalog taxonomies and search filters for learners.
              </p>
            </div>
            <button
              onClick={() => setCatModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:opacity-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2 backdrop-blur-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-slate-500 hover:text-rose-400 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {cat.description || "No description provided."}
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 font-mono">
                  {cat.courses?.length || 0} associated courses
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Create New Category</h3>
            <form onSubmit={handleCreateCategorySubmit} className="space-y-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Distributed Cloud Architectures"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="e.g. Courses covering microservices, Kubernetes, and event-driven architecture."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
