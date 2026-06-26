import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import { 
  FaUserPlus, FaUsers, FaPlus, FaTicketAlt, 
  FaUserMinus, FaGavel, FaStar, FaRegCommentDots, FaCreditCard
} from "react-icons/fa";

export default function ParticipantsDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [teamDetails, setTeamDetails] = useState({
    _id: "",
    name: "",
    code: "",
    members: [],
  });

  const [judgeEvaluation, setJudgeEvaluation] = useState({
    evaluated: false,
    totalScore: 0,
    breakdown: [
      { criteria: "Innovation & Originality", score: 0 },
      { criteria: "Technical Complexity", score: 0 },
      { criteria: "UI/UX Experience", score: 0 },
      { criteria: "Presentation & Pitch", score: 0 },
      { criteria: "Feasibility", score: 0 },
    ],
    feedback: "",
  });

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/participant/my-teams");
      if (res.data && res.data.length > 0) {
        const team = res.data[0];
        setTeamDetails(team);
        setHasTeam(true);
        setIsCreator(team.leader?._id === user?._id || team.leader === user?._id);
        setIsPaymentDone(team.paid);

        const criteria = team.criteria || { innovation: 0, complexity: 0, design: 0, presentation: 0, functionality: 0 };
        const total = criteria.innovation + criteria.complexity + criteria.design + criteria.presentation + criteria.functionality;
        const evaluated = total > 0;

        setJudgeEvaluation({
          evaluated,
          totalScore: total,
          breakdown: [
            { criteria: "Innovation & Originality", score: criteria.innovation },
            { criteria: "Technical Complexity", score: criteria.complexity },
            { criteria: "UI/UX Experience", score: criteria.design },
            { criteria: "Presentation & Pitch", score: criteria.presentation },
            { criteria: "Feasibility", score: criteria.functionality },
          ],
          feedback: team.feedback || "No feedback from judge yet.",
        });
      } else {
        setHasTeam(false);
      }
    } catch (err) {
      console.error("Failed to load team details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTeamDetails();
    }
  }, [user]);

  const handleCreateTeam = async () => {
    const name = window.prompt("Enter a unique name for your team:");
    if (!name || !name.trim()) return;

    try {
      setLoading(true);
      await API.post("/api/participant/teams", { name: name.trim() });
      await fetchTeamDetails();
    } catch (err) {
      console.error("Failed to create team", err);
      alert(err.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!invitationCode.trim()) return;

    try {
      setLoading(true);
      await API.post("/api/participant/teams/join-by-code", { code: invitationCode.trim() });
      await fetchTeamDetails();
    } catch (err) {
      console.error("Failed to join team", err);
      alert(err.response?.data?.message || "Failed to join team");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (isPaymentDone) return;
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      setLoading(true);
      await API.delete(`/api/participant/teams/${teamDetails._id}/members`, {
        data: { memberId }
      });
      await fetchTeamDetails();
    } catch (err) {
      console.error("Failed to remove member", err);
      alert(err.response?.data?.message || "Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (isPaymentDone) return;
    if (!window.confirm("Are you sure you want to leave the team?")) return;

    try {
      setLoading(true);
      await API.post(`/api/participant/teams/${teamDetails._id}/leave`);
      await fetchTeamDetails();
    } catch (err) {
      console.error("Failed to leave team", err);
      alert(err.response?.data?.message || "Failed to leave team");
    } finally {
      setLoading(false);
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
    <div className="relative min-h-screen bg-[#090411] text-slate-100 px-4 sm:px-6 md:px-10 py-16 overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto mb-12 border-b border-white/[0.06] pb-6">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          User Dashboard
        </h1>
        {isPaymentDone && (
          <p className="text-green-400 text-sm mt-2 font-bold italic">
            * Payment successful. Your team details are now locked.
          </p>
        )}
        <p className="text-slate-400 text-sm mt-2 font-medium">
          {hasTeam ? "Manage your team roster, track status, and view real-time judging evaluations." : "Get started by creating a new team or joining an existing one."}
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* 1. NO TEAM STATE (CREATE OR JOIN OPTION) */}
        {!hasTeam ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Create Team Box */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl flex flex-col justify-between transition group">
              <div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xl w-fit mb-6">
                  <FaPlus />
                </div>
                <h2 className="text-xl font-bold text-slate-200 mb-2">Create a New Team</h2>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Be the captain of your squad. Register a unique team name, generate an invitation link, and lead your crew to victory.
                </p>
              </div>
              <button
                onClick={handleCreateTeam}
                className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-xs tracking-wide shadow-lg shadow-purple-900/40 transition transform hover:-translate-y-0.5"
              >
                Create Team
              </button>
            </div>

            {/* Join Team Box */}
            <div className="bg-white/[0.02] border border-white/[0.06] hover:border-pink-500/30 rounded-2xl p-8 backdrop-blur-xl flex flex-col justify-between transition group">
              <div>
                <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xl w-fit mb-6">
                  <FaTicketAlt />
                </div>
                <h2 className="text-xl font-bold text-slate-200 mb-2">Join Existing Team</h2>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Received an invitation? Input your secret access code below to instantly align with your pre-existing workspace.
                </p>
              </div>

              {!showJoinInput ? (
                <button
                  onClick={() => setShowJoinInput(true)}
                  className="mt-8 w-full py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-200 font-semibold text-xs tracking-wide transition"
                >
                  Join via Code
                </button>
              ) : (
                <form onSubmit={handleJoinTeam} className="mt-6 flex gap-2 animate-fadeIn">
                  <input
                    type="text"
                    required
                    placeholder="Enter Code (e.g., TEAM-XXXXXX)"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    className="flex-1 bg-[#120A24] border border-white/[0.06] rounded-xl px-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-pink-500/50 transition"
                  />
                  <button
                    type="submit"
                    className="px-5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-xs tracking-wide shadow-lg shadow-pink-900/40 transition"
                  >
                    Confirm
                  </button>
                </form>
              )}
            </div>

          </div>
        ) : (
          
          /* 2. JOINED / CREATED STATE (TEAM HUB + JUDGING) */
          <div className="space-y-10">
            
            {/* TEAM INFORMATION CARD */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.06] pb-6 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                    {isCreator ? "Team Creator" : "Team Member"}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-200 mt-2 tracking-tight">{teamDetails.name}</h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-2 text-xs">
                    <span className="text-slate-500 font-medium">Invite Code: </span>
                    <span className="text-slate-200 font-bold tracking-wider ml-1">{teamDetails.code}</span>
                  </div>
                  {!isPaymentDone && ( 
                    <button 
                      onClick={handleLeaveTeam}
                      className="px-3.5 py-2 text-xs rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-medium transition"
                    >
                      Leave
                    </button>
                  )}

                  {!isPaymentDone && (
                    <Link to="/participants/payment">
                      <button className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 text-white">
                        <FaCreditCard /> Complete Payment
                      </button>
                    </Link>
                  )}

                </div>
              </div>

              {/* MEMBERS ROSTER LIST */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FaUsers /> Roster Workspace ({teamDetails.members.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamDetails.members.map((member) => {
                    const isLeader = teamDetails.leader?._id === member._id || teamDetails.leader === member._id;
                    return (
                      <div key={member._id} className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 flex items-center justify-between group">
                        <div>
                          <div className="text-slate-200 font-semibold text-sm">{member.name}</div>
                          <div className="text-xs text-slate-500 font-medium mt-0.5">{isLeader ? "Leader" : "Member"}</div>
                        </div>
                        
                        {/* Option to remove member if owner & not payment verified */}
                        {isCreator && !isLeader && !isPaymentDone && (
                          <button
                            onClick={() => handleRemoveMember(member._id)}
                            className="text-red-400 p-2 border border-red-500/10 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <FaUserMinus />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* JUDGE POINTS & BREAKDOWN EVALUATION SECTION */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
                <FaGavel className="text-cyan-400" /> Judging Performance
              </h2>

              {judgeEvaluation.evaluated ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  
                  {/* Segmentation Metric Bars */}
                  <div className="lg:col-span-2 space-y-4">
                    {judgeEvaluation.breakdown.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-300">{item.criteria}</span>
                          <span className="text-purple-400">{item.score} / 100</span>
                        </div>
                        <div className="w-full bg-white/[0.04] border border-white/[0.04] h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Score Summary Box & Remarks */}
                  <div className="bg-[#110a1c]/40 border border-purple-500/10 rounded-xl p-5 flex flex-col h-full justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                        <FaStar className="text-amber-400 text-[10px]" /> Total Compiled Score
                      </div>
                      <div className="text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
                        {judgeEvaluation.totalScore} <span className="text-sm text-slate-500 font-semibold">/ 500</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/[0.04]">
                      <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2">
                        <FaRegCommentDots className="text-purple-400" /> Judge Remarks
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium bg-[#090411]/50 p-3 rounded-lg border border-white/[0.02]">
                        "{judgeEvaluation.feedback}"
                      </p>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.01]">
                  <div className="text-slate-500 text-sm font-medium">Your submission has not been evaluated by the panel yet.</div>
                  <div className="text-xs text-slate-600 mt-1">Metrics will update dynamically once processing completes.</div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}