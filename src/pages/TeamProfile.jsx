import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";
import { FaGithub, FaLink, FaFolderOpen } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
export default function TeamProfilePage() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth()
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const res = await API.get(`/api/teams/${id}`);
        setTeam(res.data);
      } catch (err) {
        console.error("Failed to load team profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090411] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090411] text-white">
        <p className="text-slate-400 font-medium">Team not found.</p>
      </div>
    );
  }

  const getTotalScore = (criteria) => {
    if (!criteria) return 0;
    return criteria.innovation + criteria.complexity + criteria.design + criteria.presentation + criteria.functionality;
  };

  const totalScore = getTotalScore(team.criteria);
  const isJudged = totalScore > 0;

  return (
    <div className="relative min-h-screen bg-[#090411] text-slate-100 px-4 sm:px-6 md:px-10 py-16 overflow-hidden flex items-center justify-center">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* MAIN CARD */}
      <div className="relative w-full max-w-3xl bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/40">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {team.name}
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 font-medium">
              {team.submitted ? `Project: ${team.projectName}` : "Registered Hackathon Team"}
            </p>
          </div>

          {/* BADGES */}
          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <span className={`capitalize px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
              team.paid
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-300 border-amber-500/20"
            }`}>
              ● Verification {team.paid ? "Approved" : "Pending"}
            </span>
            {isJudged && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-sm shadow-amber-500/5">
                ⭐ {totalScore}
              </span>
            )}
          </div>
        </div>

        {/* PROJECT DETAILS (Only if submitted) */}
     {isAdmin && ( 
      <>
       { team.submitted ? (
          <div className="mt-8 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Project Description
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl font-medium text-justify">
              {team.projectDescription}
            </p>

            {team.techStack && team.techStack.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {team.techStack.map((techItem, index) => (
                    <span
                      key={index}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500/[0.06] text-indigo-300 border border-indigo-500/15 tracking-wide hover:border-indigo-400/30 transition-colors"
                    >
                      {techItem}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {team.githubLink && (
                <a
                  href={team.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-bold transition text-slate-200"
                >
                  <FaGithub /> GitHub Link
                </a>
              )}
              {team.driveLink && (
                <a
                  href={team.driveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-bold transition text-slate-200"
                >
                  <FaFolderOpen /> Slide / Drive Link
                </a>
              )}
              {team.demoLink && (
                <a
                  href={team.demoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-bold transition text-slate-200"
                >
                  <FaLink /> Live Demo Link
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs text-slate-500 italic">
            No project details submitted by this team yet.
          </div>
        )}
        </> )}

        {/* TEAM MEMBERS GRID */}
        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-4">
            Team Member ({team.members?.length || 0})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.members?.map((member) => {
           
              const isLeader = team.leader?._id === member._id || team.leader === member._id;
              return (
                <div
                  key={member._id}
                  className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    isLeader
                      ? "bg-purple-500/[0.03] border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/[0.06]"
                      : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.05]"
                  }`}
                >
                  {/* Avatar Container */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={`${member.profilePicture}`}
                      alt={member.profilePictureture}
                      className="w-12 h-12 rounded-full bg-slate-800 object-cover border border-white/10 group-hover:scale-105 transition-transform duration-300"
                    />
                    
                  </div>

                  {/* Member Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                        {member.name}
                      </h4>
                      {isLeader && (
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Leader
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {member.department ? `${member.department} Department` : "Participant"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========== JUDGE ASSIGNMENT & EVALUATION ========== */}
        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <h3 className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-4">
            Judge & Evaluation
          </h3>

          {/* Assigned Judge Info */}
          {team.assignedJudge ? (
            <div className="space-y-4">
             <div className="flex flex-col gap-1.5">
          <div className="text-slate-400 text-xs">Assigned Judge:</div>
  
              <div className="flex items-center gap-2">
                {/* প্রোফাইল পিকচার সেকশন */}
                {team.assignedJudge?.profilePicture ? (
                  <img
                    src={team.assignedJudge.profilePicture}
                    alt={team.assignedJudge.name || "Judge"}
                    className="w-7 h-7 rounded-full object-cover border border-purple-500/30"
                  />
                ) : (
                  /* ডিফল্ট অ্যাভাটার আইকন (যদি ইমেজ না থাকে) */
                  <div className="w-7 h-7 rounded-full bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs font-bold">
                    {team.assignedJudge?.name ? team.assignedJudge.name.charAt(0).toUpperCase() : "J"}
                  </div>
                )}

                {/* জাজের নাম */}
                <span className="text-sm font-semibold text-purple-300">
                  {team.assignedJudge?.name || "Assigned Panelist"}
                </span>
              </div>
            </div>

              {/* Evaluated metrics */}
              {isJudged && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-amber-500/[0.03] border border-amber-500/10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-bold uppercase">Final Compiled Score</span>
                      <span className="text-lg font-bold text-amber-300">{totalScore} / 500</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-500/[0.02] border border-purple-500/10">
                    <div className="text-xs text-slate-400 mb-2 font-bold uppercase">Feedback from Judge</div>
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      "{team.feedback || "Excellent effort!"}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs text-slate-500 italic">
              No judge assigned yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}