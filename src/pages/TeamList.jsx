import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await API.get("/api/teams");
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to fetch teams", err);
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

  const filteredTeams = teams.filter((team) =>
    team.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvgScore = () => {
    if (teams.length === 0) return 0;
    const evaluatedTeams = teams.filter(t => getTotalScore(t.criteria) > 0);
    if (evaluatedTeams.length === 0) return 0;
    const sum = evaluatedTeams.reduce((acc, t) => acc + getTotalScore(t.criteria), 0);
    return (sum / evaluatedTeams.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090411] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090411] text-slate-100 px-4 sm:px-6 md:px-10 py-16 overflow-hidden">
      <div className="absolute top-[-10%] right-[5%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-white/[0.06]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Teams Overview
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-md font-medium">
            Explore all registered hackathon teams, check their real-time validation status, and track score metrics.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-purple-500/50 rounded-xl px-4 py-2.5 pl-10 text-sm text-slate-200 placeholder-slate-500 outline-none focus:ring-1 focus:ring-purple-500/30 transition-all backdrop-blur-md"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.636z" />
            </svg>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5 px-5 backdrop-blur-md self-start sm:self-auto">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Total Teams</div>
              <div className="text-lg font-semibold text-slate-200">{filteredTeams.length}</div>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Avg Score</div>
              <div className="text-lg font-semibold text-purple-400">{getAvgScore()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const isApproved = team.paid;
          const score = getTotalScore(team.criteria);

          return (
            <Link to={`/team-profile/${team._id}`} key={team._id} className="group relative flex flex-col justify-between rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl shadow-xl shadow-black/30 hover:border-purple-500/30 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(147,51,234,0.08)] transition-all duration-300">
              <div>
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors duration-200 tracking-tight truncate flex-1">
                    {team.name}
                  </h2>

                  <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-sm shadow-amber-500/5">
                    <span className="text-[10px]">⭐</span> {score}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-400 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-slate-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  <span>{team.members?.length || 0} Registered Members</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.04] flex justify-between items-center">
                <span
                  className={`flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full font-bold tracking-wider uppercase border ${
                    isApproved
                      ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10 shadow-sm shadow-emerald-500/5"
                      : "border-amber-500/20 text-amber-400 bg-amber-500/10 shadow-sm shadow-amber-500/5"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                  {isApproved ? "Approved" : "Pending"}
                </span>

                <button className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-purple-300 transition-colors duration-200">
                  <span>Details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-[92%] h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 transition-all duration-300 rounded-full" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}