import { useState, useEffect } from "react";
import { FaGavel, FaAward, FaRegCommentDots, FaCheckCircle, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "../../api/axios";

export default function JudgeDashboard() {
  const [assignedTeams, setAssignedTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scoring Segmentation States
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [scores, setScores] = useState({
    innovation: 50,
    complexity: 50,
    design: 50,
    presentation: 50,
    functionality: 50
  });
  const [feedback, setFeedback] = useState("");

  const refreshData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/judge/my-teams");
      setAssignedTeams(res.data);
    } catch (err) {
      console.error("Failed to load judge data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const activeTeam = assignedTeams.find(t => t._id === activeTeamId);

  // Handlers
  const handleScoreChange = (segment, value) => {
    setScores({ ...scores, [segment]: parseInt(value) || 0 });
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!activeTeamId) return;

    try {
      setLoading(true);
      await API.put(`/api/judge/teams/${activeTeamId}/scores`, {
        ...scores,
        feedback: feedback.trim()
      });
      await refreshData();
      
      // Reset Form & Close Panel
      setActiveTeamId(null);
      setScores({ innovation: 50, complexity: 50, design: 50, presentation: 50, functionality: 50 });
      setFeedback("");
    } catch (err) {
      console.error("Failed to submit evaluation:", err);
      alert(err.response?.data?.message || "Failed to submit evaluation");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenJudgement = (team) => {
    setActiveTeamId(team._id);
    setScores({
      innovation: team.criteria?.innovation || 50,
      complexity: team.criteria?.complexity || 50,
      design: team.criteria?.design || 50,
      presentation: team.criteria?.presentation || 50,
      functionality: team.criteria?.functionality || 50,
    });
    setFeedback(team.feedback || "");
  };

  // Helper to compute total score from criteria
  const getTotalScore = (criteria) => {
    if (!criteria) return 0;
    return criteria.innovation + criteria.complexity + criteria.design + criteria.presentation + criteria.functionality;
  };

  // Helper to determine if evaluated
  const isEvaluated = (team) => {
    return getTotalScore(team.criteria) > 0;
  };

  // Metrics
  const totalAssigned = assignedTeams.length;
  const totalJudged = assignedTeams.filter(t => isEvaluated(t)).length;
  const totalPending = totalAssigned - totalJudged;

  if (loading && assignedTeams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090411] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090411] text-slate-100 px-4 sm:px-6 md:px-10 py-16 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-12 border-b border-white/[0.06] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Judge Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Evaluate your assigned hackathon projects, input metrics based on core criteria segments, and provide critical feedback.
          </p>
        </div>

        {/* METRICS ROW */}
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 px-5 backdrop-blur-md">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Assigned</div>
            <div className="text-lg font-semibold text-slate-200">{totalAssigned}</div>
          </div>
          <div className="w-px h-8 bg-white/[0.08]" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Judged</div>
            <div className="text-lg font-semibold text-emerald-400">{totalJudged}</div>
          </div>
          <div className="w-px h-8 bg-white/[0.08]" />
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Pending</div>
            <div className="text-lg font-semibold text-amber-400">{totalPending}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* ASSIGNED TEAMS TABLE CONTAINER */}
        <div className={`bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl ${activeTeamId ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
            <FaGavel className="text-purple-400" /> Assigned Projects
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <th className="pb-3 font-semibold">Team Name</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Final Score</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-sm font-medium">
                {assignedTeams.map((team) => {
                  const judged = isEvaluated(team);
                  return (
                    <tr key={team._id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="py-4">
                        <Link to={`/team-profile/${team._id}`}>
                          <div className="text-slate-200 font-semibold text-base hover:text-purple-400 transition-colors">{team.name}</div>
                          <div className="text-xs text-slate-500 font-normal mt-0.5">{team.members?.length || 0} members</div>
                        </Link>
                      </td>
                      <td className="py-4">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded border ${
                          judged
                            ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10"
                            : "border-amber-500/20 text-amber-400 bg-amber-500/10 animate-pulse"
                        }`}>
                          {judged ? "judged" : "pending"}
                        </span>
                      </td>
                      <td className="py-4">
                        {judged ? (
                          <span className="text-slate-200 font-bold bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.08]">
                            {getTotalScore(team.criteria)} / 500
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleOpenJudgement(team)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition shadow-md ${
                            judged
                              ? "border-white/[0.08] text-slate-400 hover:bg-white/[0.04]"
                              : "border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 shadow-purple-950/20"
                          }`}
                        >
                          {judged ? "Re-evaluate" : "Judge Now"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {assignedTeams.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs text-slate-500">No teams assigned to you yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* JUDGING SUBMISSION FORM */}
        {activeTeamId && (
          <div className="bg-[#110a1c]/60 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-xl shadow-2xl shadow-black animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b border-white/[0.06] pb-3">
              <div>
                <h2 className="text-lg font-bold text-purple-300">Evaluating</h2>
                <p className="text-xs text-slate-400 mt-0.5">{activeTeam?.name}</p>
              </div>
              <button 
                onClick={() => setActiveTeamId(null)} 
                className="text-slate-500 hover:text-slate-300 text-sm transition"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmitEvaluation} className="space-y-5">
              
              {/* SEGMENTATION CRITERIA 1 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-300">1. Innovation & Originality</span>
                  <span className="text-cyan-400">{scores.innovation} / 100</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={scores.innovation}
                  onChange={(e) => handleScoreChange("innovation", e.target.value)}
                  className="w-full accent-purple-500 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* SEGMENTATION CRITERIA 2 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-300">2. Technical Complexity</span>
                  <span className="text-cyan-400">{scores.complexity} / 100</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={scores.complexity}
                  onChange={(e) => handleScoreChange("complexity", e.target.value)}
                  className="w-full accent-purple-500 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* SEGMENTATION CRITERIA 3 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-300">3. UI/UX Design</span>
                  <span className="text-cyan-400">{scores.design} / 100</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={scores.design}
                  onChange={(e) => handleScoreChange("design", e.target.value)}
                  className="w-full accent-purple-500 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* SEGMENTATION CRITERIA 4 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-300">4. Presentation & Pitch</span>
                  <span className="text-cyan-400">{scores.presentation} / 100</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={scores.presentation}
                  onChange={(e) => handleScoreChange("presentation", e.target.value)}
                  className="w-full accent-purple-500 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* SEGMENTATION CRITERIA 5 */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-300">5. Functionality & Execution</span>
                  <span className="text-cyan-400">{scores.functionality} / 100</span>
                </div>
                <input
                  type="range" min="0" max="100"
                  value={scores.functionality}
                  onChange={(e) => handleScoreChange("functionality", e.target.value)}
                  className="w-full accent-purple-500 bg-white/[0.05] h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* FEEDBACK FIELD */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FaRegCommentDots className="text-purple-400" /> Evaluation Remarks
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide structured feedback and suggestions for the team..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition resize-none"
                />
              </div>

              {/* ACTION BUTTON */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-950/30 transition transform hover:-translate-y-0.5"
              >
                Submit Evaluation
              </button>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}