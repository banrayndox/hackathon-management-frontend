import { useState, useEffect } from "react";
import API from "../api/axios";

export default function JudgesList() {
  const [judges, setJudges] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

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
                  <th className="p-4 pr-6 text-center w-36">Assigned Teams</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {displayedJudges.length > 0 ? (
                  displayedJudges.map((judge) => (
                    <tr key={judge._id} className="group hover:bg-white/[0.02] transition-colors duration-150">
                      
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
                        {judge.email}
                      </td>

                      {/* EXPERTISE */}
                      <td className="p-4 text-sm">
                        <span className="inline-block text-xs font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-md shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                          {judge.expertise || "General Judging"}
                        </span>
                      </td>

                      {/* ORGANIZATION */}
                      <td className="p-4 text-sm text-slate-300 font-medium">
                        {judge.industry || "Academic Faculty"}
                      </td>

                      {/* ASSIGNED TEAMS */}
                      <td className="p-4 pr-6 text-center">
                        <span className="inline-block text-xs font-bold text-purple-300 tracking-wide bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                          👥 {judge.assignedTeamsCount || 0} Teams
                        </span>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-16 text-center text-sm text-slate-500 font-medium">
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