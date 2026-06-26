import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Leaderboard() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await API.get("/api/teams");
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const getTotalScore = (criteria) => {
    if (!criteria) return 0;
    return criteria.innovation + criteria.complexity + criteria.design + criteria.presentation + criteria.functionality;
  };

  // 1. Sort teams by score descending to get accurate ranking
  const sortedTeams = [...teams].sort((a, b) => getTotalScore(b.criteria) - getTotalScore(a.criteria));

  // 2. Filter teams based on search query
  const filtered = sortedTeams.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  // 3. Slice array for pagination pages
  const paginated = filtered.slice(
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
    <div className="relative min-h-screen bg-[#090411] text-slate-100 px-4 sm:px-6 md:px-10 py-16 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-600/[0.07] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 font-medium">
              Live updates of hackathon teams ranked by judge evaluations.
            </p>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search teams..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/[0.03] border border-white/[0.08] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* TABLE WRAPPER CONTAINER */}
        <div className="overflow-hidden bg-white/[0.01] border border-white/[0.06] rounded-2xl shadow-xl shadow-black/30 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="p-4 pl-6 w-24">Rank</th>
                  <th className="p-4">Team</th>
                  <th className="p-4 w-28">Members</th>
                  <th className="p-4 pr-6 text-right w-24">Score</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {paginated.length > 0 ? (
                  paginated.map((team, i) => { 
                    const rank = (page - 1) * itemsPerPage + i + 1;
                    const score = getTotalScore(team.criteria);

                    return (
                      <tr 
                        key={team._id}   
                        onClick={() => navigate(`/team-profile/${team._id}`)} 
                        className="group hover:bg-white/[0.03] transition-colors duration-150 cursor-pointer"
                      >
                        {/* RANK BADGES */}
                        <td className="p-4 pl-6 text-sm font-bold text-slate-400">
                          {rank === 1 && <span className="text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">#1</span>}
                          {rank === 2 && <span className="text-slate-300 bg-slate-300/10 border border-slate-300/20 px-2 py-0.5 rounded-md">#2</span>}
                          {rank === 3 && <span className="text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded-md">#3</span>}
                          {rank > 3 && <span className="pl-2">#{rank}</span>}
                        </td>

                        {/* TEAM NAME */}
                        <td className="p-4 text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {team.name}
                        </td>

                        {/* MEMBERS WITH ACCENT BOX */}
                        <td className="p-4 text-sm text-slate-400 font-medium">
                          <span className="inline-flex items-center gap-1.5 bg-white/[0.03] px-2.5 py-1 rounded-md text-xs border border-white/[0.04]">
                            <span className="text-slate-500">👥</span> {team.members?.length || 0}
                          </span>
                        </td>

                        {/* SCORE STYLING */}
                        <td className="p-4 pr-6 text-right">
                          <span className="inline-block text-sm font-bold text-purple-300 tracking-wide bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                            ⭐ {score}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-sm text-slate-500 font-medium">
                      No teams found matching "{search}"
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
            Showing page <span className="text-slate-300 font-semibold">{page}</span> of <span className="text-slate-300 font-semibold">{totalPages}</span>
          </div>

          <div className="flex gap-2">
            <button
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] active:scale-98 transition-all disabled:opacity-30 disabled:pointer-events-none text-slate-300"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ← Prev
            </button>
            <button
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] active:scale-98 transition-all disabled:opacity-30 disabled:pointer-events-none text-slate-300"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}