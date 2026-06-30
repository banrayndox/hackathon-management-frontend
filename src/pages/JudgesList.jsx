import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import React from "react";
export default function JudgesList() {
  const [judges, setJudges] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ expertise: "", industry: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedJudge, setSelectedJudge] = useState(null);

  const [expandedJudgeId, setExpandedJudgeId] = useState(null); // কোন জাজের টিম লিস্ট খোলা আছে তা ট্র্যাক করবে
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  const { user } = useAuth();

  // বাটনে ক্লিক করলে এই ফাংশনটি রান হবে
  const handleToggleTeams = async (judge) => {
    // যদি অলরেডি খোলা থাকে, তবে আবার ক্লিক করলে বন্ধ হয়ে যাবে
    if (expandedJudgeId === judge._id) {
      setExpandedJudgeId(null);
      return;
    }

    if (judge.assignedTeamsCount === 0) return;

    setExpandedJudgeId(judge._id);
    setLoadingTeams(true);
    try {
      const res = await API.get(`/api/admin/judges/${judge._id}/teams`);
      console.log(res)
      setAssignedTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams", err);
    } finally {
      setLoadingTeams(false);
    }
  };

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const res = await API.get("/api/judges");
        setJudges(res.data);
      } catch (err) {
        console.error("Failed to load judges list", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJudges();
  }, []);

  const filteredJudges = judges.filter((judge) =>
    `${judge.name} ${judge.email} ${judge.expertise || ""} ${judge.industry || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredJudges.length / itemsPerPage) || 1;

  const displayedJudges = filteredJudges.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleEditClick = (judge) => {
    setEditingId(judge._id);
    setEditForm({ expertise: judge.expertise || "", industry: judge.industry || "" });
  };

  const handleSaveUpdate = async (id) => {
    setIsUpdating(true);
    try {
      const res = await API.put(`/api/admin/judges/${id}`, editForm);
      setJudges(judges.map((j) => (j._id === id ? { ...j, expertise: res.data.expertise, industry: res.data.industry } : j)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleViewTeams = async (judge) => {
    if (judge.assignedTeamsCount === 0) return;
    setSelectedJudge(judge);
    setLoadingTeams(true);
    try {
      const res = await API.get(`/api/admin/judges/${judge._id}/teams`);
      setAssignedTeams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTeams(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090411] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen !bg-[#090411] text-slate-100 px-4 sm:px-6 md:px-10 py-16 overflow-hidden">
      {/* Background Ambient Glow (Purple Neon) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0" />
      {/* Secondary Cyan Glow for Cyberpunk contrast */}
      <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[250px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Judges Directory
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Overview of all registered hackathon judges and their assignments.
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full mb-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 opacity-70">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, email, expertise or industry..."
            className="w-full pl-12 pr-4 py-3 rounded-xl text-sm !bg-white/[0.02] border border-white/[0.08] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:!bg-white/[0.05] focus:ring-1 focus:ring-purple-500/30 transition-all shadow-inner"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* TABLE WRAPPER CONTAINER */}
        <div className="overflow-hidden !bg-[#110a1c]/60 border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="p-4 pl-6 w-20">Profile</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Expertise</th>
                  <th className="p-4">Industry / Institution</th>
                {isAdmin && ( <th className="p-4 pr-6 text-center w-36">Assigned Teams</th> )}
                  {isAdmin && <th className="p-4 text-center w-24">Actions</th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {displayedJudges.length > 0 ? (
                  displayedJudges.map((judge) => (
                    <React.Fragment key={judge._id}>
                      {/* মূল জাজ রো */}
                      <tr className="group hover:bg-white/[0.02] transition-colors duration-150">
                        {/* AVATAR */}
                        <td className="p-4 pl-6">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/[0.08] group-hover:ring-purple-500/50 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all duration-300">
                            <img
                              src={judge.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${judge.name}`}
                              alt={judge.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        {/* NAME */}
                        <td className="p-4 text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                          {judge.name}
                        </td>

                        {/* EMAIL */}
                        <td className="p-4 text-sm text-slate-400 font-medium">
                          {user?.role === 'judge' || user?.role === 'admin' ? (
                            judge.email
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <span>🔒</span> Hidden
                            </span>
                          )}
                        </td>

                        {/* EXPERTISE */}
                        <td className="p-4 text-sm">
                          {editingId === judge._id ? (
                            <input
                              type="text"
                              value={editForm.expertise}
                              onChange={(e) => setEditForm({ ...editForm, expertise: e.target.value })}
                              className="bg-slate-900 border border-purple-500/50 text-slate-200 text-xs rounded-md px-2 py-1 w-full"
                            />
                          ) : (
                            <span className="inline-block text-xs font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-md">
                              {judge.expertise || "General Judging"}
                            </span>
                          )}
                        </td>

                        {/* INDUSTRY */}
                        <td className="p-4 text-sm text-slate-300 font-medium">
                          {editingId === judge._id ? (
                            <input
                              type="text"
                              value={editForm.industry}
                              onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                              className="bg-slate-900 border border-purple-500/50 text-slate-200 text-xs rounded-md px-2 py-1 w-full"
                            />
                          ) : (
                            judge.industry || "Academic Faculty"
                          )}
                        </td>

                        {/* ASSIGNED TEAMS BUTTON */}
                  {isAdmin && (    <td className="p-4 pr-6 text-center">
                          <button
                            onClick={() => handleToggleTeams(judge)}
                            disabled={!judge.assignedTeamsCount}
                            className={`inline-block text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg transition-all ${
                              judge.assignedTeamsCount > 0 ? "hover:bg-purple-500/30 cursor-pointer hover:scale-105" : "opacity-50"
                            }`}
                          >
                            👥 {judge.assignedTeamsCount || 0} Teams {expandedJudgeId === judge._id ? '▲' : '▼'}
                          </button>
                        </td> )}

                        {/* ADMIN ACTIONS */}
                        {isAdmin && (
                          <td className="p-4 text-center">
                            {editingId === judge._id ? (
                              /* এডিটিং মুড: সেভ এবং ক্যান্সেল বাটন */
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  onClick={() => handleSaveUpdate(judge._id)}
                                  disabled={isUpdating}
                                  title="Save Changes"
                                  className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] disabled:opacity-50 disabled:pointer-events-none"
                                >
                                  {isUpdating ? (
                                    <svg className="animate-spin h-3.5 w-3.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                  )}
                                </button>

                                <button
                                  onClick={() => setEditingId(null)}
                                  title="Cancel"
                                  className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 active:scale-95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              /* নরমাল মুড: শুধু এডিট বাটন */
                              <button
                                onClick={() => handleEditClick(judge)}
                                className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold rounded-lg hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/40 active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.05)] opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200"
                              >
                                <span className="flex items-center gap-1.5">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                  </svg>
                                  Edit
                                </span>
                              </button>
                            )}
                          </td>
                        )}
                      </tr>

                      {/* এক্সপেন্ডেড রো (টিমের বিবরণ) - শুধুমাত্র তখনই দেখাবে যখন expandedJudgeId মিলবে */}
                     {expandedJudgeId === judge._id && (
  <tr className="bg-purple-950/10 border-b border-white/[0.04]">
    <td colSpan={isAdmin ? 7 : 6} className="p-4 pl-12 bg-[#0d071a]/50">
      <div className="rounded-xl border border-purple-500/10 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
          <span>📋</span> Assigned Teams Details
        </h4>

        {loadingTeams ? (
          <div className="text-xs text-purple-400 font-medium animate-pulse py-2 flex items-center gap-2">
            <svg className="animate-spin h-3.5 w-3.5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading teams dataset...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assignedTeams.length > 0 ? (
              assignedTeams.map((team, idx) => (
                <div key={team._id || idx} className="p-3 bg-white/[0.01] border border-white/[0.04] rounded-lg hover:border-purple-500/20 transition-all">
                  <div className="text-sm font-semibold text-slate-200">{team.name}</div>
                  <div className="text-xs text-slate-400 mt-1 truncate">
                    {team.projectTitle ? `💡 Project: ${team.projectTitle}` : "⏳ No project submitted yet"}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic col-span-full">No assigned teams found.</p>
            )}
          </div>
        )}
      </div>
    </td>
  </tr>
)}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="p-16 text-center text-sm text-slate-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-30 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>No judges found matching "{search}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="flex items-center justify-between mt-6 px-1">
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-300 font-semibold">{displayedJudges.length}</span> of <span className="text-slate-300 font-semibold">{filteredJudges.length}</span> judges
          </div>

          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none text-slate-300"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    page === index + 1
                      ? "bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] text-slate-400"
                  }`}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none text-slate-300"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}