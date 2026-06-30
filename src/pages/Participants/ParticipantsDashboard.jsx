import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUserPlus, FaUsers, FaPlus, FaTicketAlt,
  FaUserMinus, FaGavel, FaStar, FaRegCommentDots, FaCreditCard,
  FaFileCode, FaLink, FaGithub, FaExclamationTriangle
} from "react-icons/fa";

/* ────────────────────────────────────────────────
   Reusable Confirm Dialog (replaces window.confirm)
──────────────────────────────────────────────── */
function ConfirmModal({ isOpen, title, message, confirmLabel = "Confirm", danger = true, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-[#13082a] border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/60">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-purple-500/10 border border-purple-500/20 text-purple-400"}`}>
          <FaExclamationTriangle className="text-xl" />
        </div>
        <h3 className="text-base font-bold text-slate-200 text-center">{title}</h3>
        <p className="text-xs text-slate-400 text-center mt-2 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] text-xs font-bold transition">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition ${danger ? "bg-red-600 hover:bg-red-500" : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Input Prompt Modal (replaces window.prompt)
──────────────────────────────────────────────── */
function PromptModal({ isOpen, title, message, placeholder, onConfirm, onCancel }) {
  const [value, setValue] = useState("");
  useEffect(() => { if (isOpen) setValue(""); }, [isOpen]);
  if (!isOpen) return null;
  const handleSubmit = (e) => { e.preventDefault(); if (value.trim()) onConfirm(value.trim()); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-[#13082a] border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/60">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <FaUsers className="text-xl" />
        </div>
        <h3 className="text-base font-bold text-slate-200 text-center">{title}</h3>
        <p className="text-xs text-slate-400 text-center mt-1">{message}</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            type="text"
            autoFocus
            required
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-[#090411] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 transition"
          />
          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 hover:text-slate-200 text-xs font-bold transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-xs font-bold transition">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Main Dashboard
──────────────────────────────────────────────── */
export default function ParticipantsDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [teamDetails, setTeamDetails] = useState({ _id: "", name: "", code: "", members: [], submitted: false });

  const [invitations, setInvitations] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedInviteeId, setSelectedInviteeId] = useState("");
  const [activeTab, setActiveTab] = useState("team");
  const [projectForm, setProjectForm] = useState({
    projectName: "", projectDescription: "", techStack: "",
    githubLink: "", driveLink: "", demoLink: "",
  });

  const [judgeEvaluation, setJudgeEvaluation] = useState({
    evaluated: false, totalScore: 0,
    breakdown: [
      { criteria: "Innovation & Originality", score: 0 },
      { criteria: "Technical Complexity", score: 0 },
      { criteria: "UI/UX Experience", score: 0 },
      { criteria: "Presentation & Pitch", score: 0 },
      { criteria: "Feasibility", score: 0 },
    ],
    feedback: "",
  });

  // ─── Confirm / Prompt modal states ───
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", confirmLabel: "Confirm", danger: true, onConfirm: null });
  const [promptModal, setPromptModal] = useState({ open: false });

  const openConfirm = (title, message, onConfirm, { confirmLabel = "Confirm", danger = true } = {}) => {
    setConfirmModal({ open: true, title, message, confirmLabel, danger, onConfirm });
  };
  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, open: false }));

  const openPrompt = () => setPromptModal({ open: true });
  const closePrompt = () => setPromptModal({ open: false });

  // ─── Data fetchers ───
  const fetchInvitations = useCallback(async () => {
    try {
      const res = await API.get("/api/participant/invitations");
      setInvitations(res.data);
    } catch { /* silent */ }
  }, []);

  const fetchAvailableUsers = useCallback(async () => {
    try {
      const res = await API.get("/api/participant/available-users");
      setAvailableUsers(res.data);
    } catch { /* silent */ }
  }, []);

  const fetchTeamDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/participant/my-teams");
      if (res.data && res.data.length > 0) {
        const team = res.data[0];
        
        setTeamDetails(team);
        setHasTeam(true);
        const isLeader = team.leader?._id === user?._id || team.leader === user?._id;
        setIsCreator(isLeader);
        setIsPaymentDone(team.paid);
        setProjectForm({
          projectName: team.projectName || "",
          projectDescription: team.projectDescription || "",
          techStack: team.techStack ? team.techStack.join(", ") : "",
          githubLink: team.githubLink || "",
          driveLink: team.driveLink || "",
          demoLink: team.demoLink || "",
        });
        if (isLeader) fetchAvailableUsers();
        const c = team.criteria || {};
        const total = (c.innovation || 0) + (c.complexity || 0) + (c.design || 0) + (c.presentation || 0) + (c.functionality || 0);
        setJudgeEvaluation({
          evaluated: total > 0, totalScore: total,
          breakdown: [
            { criteria: "Innovation & Originality", score: c.innovation || 0 },
            { criteria: "Technical Complexity", score: c.complexity || 0 },
            { criteria: "UI/UX Experience", score: c.design || 0 },
            { criteria: "Presentation & Pitch", score: c.presentation || 0 },
            { criteria: "Feasibility", score: c.functionality || 0 },
          ],
          feedback: team.feedback || "No feedback from judge yet.",
        });
      } else {
        setHasTeam(false);
        fetchInvitations();
      }
    } catch {
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  }, [user, fetchAvailableUsers, fetchInvitations]);

  useEffect(() => { if (user) fetchTeamDetails(); }, [user, fetchTeamDetails]);

  // ─── Handlers ───
  const handleCreateTeam = () => {
    openPrompt();
  };

  const doCreateTeam = async (name) => {
    closePrompt();
    const tid = toast.loading("Creating team...");
    try {
      setLoading(true);
      await API.post("/api/participant/teams", { name });
      toast.success("Team created successfully!", { id: tid });
      await fetchTeamDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create team", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!invitationCode.trim()) return;
    const tid = toast.loading("Joining team...");
    try {
      setLoading(true);
      await API.post("/api/participant/teams/join-by-code", { code: invitationCode.trim() });
      toast.success("Joined team successfully!", { id: tid });
      await fetchTeamDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join team", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId, teamName) => {
    const tid = toast.loading("Accepting invitation...");
    try {
      setLoading(true);
      await API.post(`/api/participant/invitations/${invitationId}/accept`);
      toast.success(`Welcome to ${teamName}!`, { id: tid });
      await fetchTeamDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    const tid = toast.loading("Rejecting...");
    try {
      setLoading(true);
      await API.post(`/api/participant/invitations/${invitationId}/reject`);
      toast.success("Invitation rejected", { id: tid });
      await fetchInvitations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    if (!selectedInviteeId) return;
    const invitee = availableUsers.find(u => u._id === selectedInviteeId);
    const tid = toast.loading("Sending invitation...");
    try {
      setLoading(true);
      await API.post("/api/participant/teams/invite", { inviteeId: selectedInviteeId });
      toast.success(`Invitation sent to ${invitee?.name}!`, { id: tid });
      setSelectedInviteeId("");
      await fetchAvailableUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send invitation", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (memberId, memberName) => {
    openConfirm(
      "Remove Member",
      `Are you sure you want to remove ${memberName} from the team?`,
      async () => {
        closeConfirm();
        const tid = toast.loading("Removing member...");
        try {
          setLoading(true);
          await API.delete(`/api/participant/teams/${teamDetails._id}/members`, { data: { memberId } });
          toast.success(`${memberName} removed from team`, { id: tid });
          await fetchTeamDetails();
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to remove member", { id: tid });
        } finally {
          setLoading(false);
        }
      },
      { confirmLabel: "Remove", danger: true }
    );
  };

  const handleLeaveTeam = () => {
    openConfirm(
      "Leave Team",
      "Are you sure you want to leave your current team? This action cannot be undone.",
      async () => {
        closeConfirm();
        const tid = toast.loading("Leaving team...");
        try {
          setLoading(true);
          await API.post(`/api/participant/teams/${teamDetails._id}/leave`);
          toast.success("You left the team", { id: tid });
          await fetchTeamDetails();
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to leave team", { id: tid });
        } finally {
          setLoading(false);
        }
      },
      { confirmLabel: "Leave Team", danger: true }
    );
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!teamDetails._id) return;
    const tid = toast.loading("Submitting project details...");
    try {
      setLoading(true);
      await API.put(`/api/participant/teams/${teamDetails._id}/submit`, projectForm);
      toast.success("Project details submitted successfully!", { id: tid });
      await fetchTeamDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit project", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090411] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <>
      {/* ── Modals ── */}
      <PromptModal
        isOpen={promptModal.open}
        title="Create a New Team"
        message="Choose a unique name for your team"
        placeholder="e.g. Neural Ninjas"
        onConfirm={doCreateTeam}
        onCancel={closePrompt}
      />
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        danger={confirmModal.danger}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirm}
      />

      <div className="relative min-h-screen bg-[#090411] text-slate-100 px-4 sm:px-6 md:px-10 py-16 overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />

        {/* ── Header ── */}
        <div className="max-w-6xl mx-auto mb-12 border-b border-white/[0.06] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
                     <div className="flex items-center gap-4 mb-8">
  {/* প্রোফাইল পিকচার */}
  {user?.profilePicture ? (
    <img
      src={user?.profilePicture}
      alt={user.name}
      className="w-12 h-12 rounded-full border-2 border-purple-500/30 object-cover shadow-lg shadow-purple-500/10"
    />
  ) : (
    <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-lg shadow-lg shadow-purple-500/10">
      {user?.name?.charAt(0).toUpperCase() || '?'}
    </div>
  )}

  <div>
    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
      {user?.name}'s Dashboard
    </h1>
    {user?.email && (
      <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
    )}
  </div>
</div>
            {isPaymentDone && (
              <p className="text-green-400 text-sm mt-2 font-bold italic">★ Payment verified — team details are locked.</p>
            )}
            <p className="text-slate-400 text-sm mt-2 font-medium">
              {hasTeam ? "Manage your team, submit project details, and view judging evaluations." : "Get started by creating a new team or joining an existing one."}
            </p>
          </div>

          {hasTeam && (
            <div className="flex bg-white/[0.02] border border-white/[0.08] p-1 rounded-xl">
              <button onClick={() => setActiveTab("team")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "team" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}>
                Team Hub
              </button>
              <button onClick={() => setActiveTab("project")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "project" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}>
                Project Submission
              </button>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto">

          {/* ═══════════ NO TEAM ═══════════ */}
          {!hasTeam ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

                {/* Create Team */}
                <div className="bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl flex flex-col justify-between transition">
                  <div>
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xl w-fit mb-6"><FaPlus /></div>
                    <h2 className="text-xl font-bold text-slate-200 mb-2">Create a New Team</h2>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">Be the captain of your squad. Register a unique team name, generate an invitation link, and lead your crew to victory.</p>
                  </div>
                  <button onClick={handleCreateTeam} className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-xs tracking-wide shadow-lg shadow-purple-900/40 transition transform hover:-translate-y-0.5">
                    Create Team
                  </button>
                </div>

                {/* Join Team */}
                <div className="bg-white/[0.02] border border-white/[0.06] hover:border-pink-500/30 rounded-2xl p-8 backdrop-blur-xl flex flex-col justify-between transition">
                  <div>
                    <div className="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xl w-fit mb-6"><FaTicketAlt /></div>
                    <h2 className="text-xl font-bold text-slate-200 mb-2">Join Existing Team</h2>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">Received an invitation? Input your secret access code below to instantly align with your pre-existing workspace.</p>
                  </div>
                  {!showJoinInput ? (
                    <button onClick={() => setShowJoinInput(true)} className="mt-8 w-full py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-200 font-semibold text-xs tracking-wide transition">
                      Join via Code
                    </button>
                  ) : (
                    <form onSubmit={handleJoinTeam} className="mt-6 flex gap-2">
                      <input type="text" required placeholder="TEAM-XXXXXX" value={invitationCode} onChange={(e) => setInvitationCode(e.target.value)} className="flex-1 bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-pink-500/50 transition" />
                      <button type="submit" className="px-5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold text-xs tracking-wide shadow-lg transition">Join</button>
                    </form>
                  )}
                </div>
              </div>

              {/* Invitations List */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl mt-10">
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <FaTicketAlt className="text-purple-400" /> Pending Team Invitations ({invitations.length})
                </h3>
                {invitations.length > 0 ? (
                  <div className="space-y-4">
                    {invitations.map((inv) => (
                      <div key={inv._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] gap-4">
                        <div>
                          <div className="text-sm font-semibold text-slate-200">Team: <span className="text-purple-300">{inv.team?.name}</span></div>
                          <div className="text-xs text-slate-500 mt-1">Invited by: {inv.sender?.name} ({inv.sender?.email})</div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button onClick={() => handleAcceptInvitation(inv._id, inv.team?.name)} className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition">Accept</button>
                          <button onClick={() => handleRejectInvitation(inv._id)} className="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold transition">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-500 italic">No invitations received.</div>
                )}
              </div>
            </div>

          ) : (
            /* ═══════════ HAS TEAM ═══════════ */
            <div>
              {activeTab === "team" ? (
                <div className="space-y-10">

                  {/* Team Info Card */}
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
                          <button onClick={handleLeaveTeam} className="px-3.5 py-2 text-xs rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-medium transition">Leave</button>
                        )}
                        {!isPaymentDone && isCreator (
                          <Link to="/participants/payment">
                            <button className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 text-white">
                              <FaCreditCard /> Complete Payment
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Roster */}
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><FaUsers /> Team Members ({teamDetails.members?.length || 0})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamDetails.members?.map((member) => {
                        const isLeader = teamDetails.leader?._id === member._id || teamDetails.leader === member._id;
                        return (
                          // <div key={member._id} className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/40 border border-slate-800"> 
                          {/* ১. মেম্বার প্রোফাইল পিকচার */}
                          <img 
                            src={member.image || member.profilePicture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} // ইমেজ না থাকলে ডিফল্ট প্লেসহোল্ডার
                            alt={member.name} 
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800 shadow-md"
                          />

                          {/* ২. টেক্সট কন্টেন্ট (নাম, ইমেইল ও রোল) */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-slate-200 font-semibold text-sm truncate">{member.name}</span>
                              
                              {/* ৩. স্টাইলিশ রোল ব্যাজ (Leader হলে গোল্ডেন/অরেঞ্জ, Member হলে ব্লু/স্লিট) */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isLeader 
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-950/20" 
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}>
                                {isLeader ? "Leader" : "Member"}
                              </span>
                            </div>
                            
                            {/* ৪. মেম্বার ইমেইল */}
                            <div className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                              {member.email || "no-email@example.com"}
                            </div>
                          {/* </div> */}
</div>
                            {isCreator && !isLeader && !isPaymentDone && (
                              <button onClick={() => handleRemoveMember(member._id, member.name)} className="text-red-400 p-2 border border-red-500/10 hover:bg-red-500/10 rounded-lg transition">
                                <FaUserMinus />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Invite Panel */}
                    {isCreator && !isPaymentDone && (
                      <div className="mt-8 pt-6 border-t border-white/[0.06]">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <FaUserPlus className="text-pink-400" /> Send Team Invitations
                        </h3>
                        <form onSubmit={handleSendInvitation} className="flex flex-col sm:flex-row gap-3">
                          <select value={selectedInviteeId} onChange={(e) => setSelectedInviteeId(e.target.value)} className="flex-1 bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-slate-200 outline-none focus:border-purple-500/50 transition cursor-pointer">
                            <option value="">Select a participant to invite...</option>
                            {availableUsers.map((u) => (
                              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                            ))}
                          </select>
                          <button type="submit" disabled={!selectedInviteeId} className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs tracking-wide shadow-lg transition disabled:opacity-50">
                            Send Invitation
                          </button>
                        </form>
                      </div>
                    )}
                  </div>

                  {/* Judging Section */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2"><FaGavel className="text-cyan-400" /> Judging Performance</h2>
   <div className="flex items-center gap-3 mb-4">
  <h3 className="text-sm font-medium text-slate-400 whitespace-nowrap">Assigned Judge</h3>
  {teamDetails?.assignedJudge ? (
    <div className="flex items-center gap-2 bg-slate-700/30 rounded-lg px-3 py-1.5 border border-slate-600/30">
      {teamDetails.assignedJudge.profilePicture && (
        <img
          src={teamDetails.assignedJudge.profilePicture}
          alt={teamDetails.assignedJudge.name}
          className="w-6 h-6 rounded-full object-cover"
        />
      )}
      <span className="text-white font-medium text-sm">{teamDetails.assignedJudge.name}</span>
    </div>
  ) : (
    <span className="text-slate-400 text-sm bg-slate-700/20 px-3 py-1.5 rounded-lg border border-dashed border-slate-500/40">
      No assigned judge yet.
    </span>
  )}
</div>
                    {judgeEvaluation.evaluated ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-4">
                          {judgeEvaluation.breakdown.map((item, i) => (
                            <div key={i}>
                              <div className="flex justify-between text-xs font-bold mb-1.5">
                                <span className="text-slate-300">{item.criteria}</span>
                                <span className="text-purple-400">{item.score} / 100</span>
                              </div>
                              <div className="w-full bg-white/[0.04] h-2 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500" style={{ width: `${item.score}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-[#110a1c]/40 border border-purple-500/10 rounded-xl p-5 flex flex-col h-full justify-between">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1"><FaStar className="text-amber-400 text-[10px]" /> Total Score</div>
                            <div className="text-4xl font-extrabold text-slate-100 tracking-tight mt-1">{judgeEvaluation.totalScore} <span className="text-sm text-slate-500 font-semibold">/ 500</span></div>
                          </div>
                          <div className="mt-6 pt-4 border-t border-white/[0.04]">
                            <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mb-2"><FaRegCommentDots className="text-purple-400" /> Judge Remarks</div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium bg-[#090411]/50 p-3 rounded-lg border border-white/[0.02]">"{judgeEvaluation.feedback}"</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.01]">
                        <div className="text-slate-500 text-sm font-medium">Not evaluated by the panel yet.</div>
                        <div className="text-xs text-slate-600 mt-1">Metrics will update once processing completes.</div>
                      </div>
                    )}
                  </div>
                </div>

              ) : (
                /* ── Project Submission ── */
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur-xl">
                  <div className="flex justify-between items-center border-b border-white/[0.06] pb-6 mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-200 tracking-tight">Project Submission Desk</h2>
                      <p className="text-slate-400 text-xs mt-1 font-medium">Submit repositories, drive links, and tech stack details.</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${teamDetails.submitted ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" : "border-amber-500/20 text-amber-400 bg-amber-500/10"}`}>
                      {teamDetails.submitted ? "Submitted" : "Not Submitted"}
                    </span>
                  </div>

                  {/* ── Submitted Read-only View ── */}
                  {teamDetails.submitted ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-400">Project Successfully Submitted</p>
                          <p className="text-xs text-slate-500 mt-0.5">Your project details have been locked and sent to the evaluation panel.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Project Name</div>
                          <div className="text-sm font-semibold text-slate-200">{projectForm.projectName || <span className="text-slate-600 italic">—</span>}</div>
                        </div>
                        <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4">
                          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Tech Stack</div>
                          <div className="flex flex-wrap gap-1.5">
                            {projectForm.techStack
                              ? projectForm.techStack.split(",").map((t, i) => t.trim() && (
                                <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{t.trim()}</span>
                              ))
                              : <span className="text-slate-600 italic text-xs">—</span>
                            }
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">Project Description</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{projectForm.projectDescription || <span className="text-slate-600 italic">—</span>}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { label: "GitHub", icon: <FaGithub />, value: projectForm.githubLink },
                          { label: "Drive / Slides", icon: <FaFileCode />, value: projectForm.driveLink },
                          { label: "Live Demo", icon: <FaLink />, value: projectForm.demoLink },
                        ].map(({ label, icon, value }) => (
                          <div key={label} className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4">
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2 flex items-center gap-1.5">{icon} {label}</div>
                            {value ? (
                              <a href={value} target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:text-purple-300 hover:underline font-semibold break-all transition">
                                {value}
                              </a>
                            ) : (
                              <span className="text-xs text-slate-600 italic">Not provided</span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] text-center text-xs text-slate-500 italic">
                        ⚠ Project details are locked after submission. Contact an admin to make changes.
                      </div>
                    </div>

                  ) : (
                    /* ── Editable Form (only before submission, only leader) ── */
                    <form onSubmit={handleProjectSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Name</label>
                          <input type="text" required disabled={!isCreator} placeholder="e.g. Smart AI Health Assistant" value={projectForm.projectName} onChange={(e) => setProjectForm({ ...projectForm, projectName: e.target.value })} className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 transition disabled:opacity-50" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tech Stack (comma-separated)</label>
                          <input type="text" required disabled={!isCreator} placeholder="React, Node.js, TensorFlow" value={projectForm.techStack} onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })} className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 transition disabled:opacity-50" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Description</label>
                        <textarea required rows={4} disabled={!isCreator} placeholder="Describe your project, the problem it solves, and its implementation..." value={projectForm.projectDescription} onChange={(e) => setProjectForm({ ...projectForm, projectDescription: e.target.value })} className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 transition resize-none disabled:opacity-50" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FaGithub /> GitHub</label>
                          <input type="url" disabled={!isCreator} placeholder="https://github.com/..." value={projectForm.githubLink} onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })} className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 transition disabled:opacity-50" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FaFileCode /> Drive Link</label>
                          <input type="url" disabled={!isCreator} placeholder="https://drive.google.com/..." value={projectForm.driveLink} onChange={(e) => setProjectForm({ ...projectForm, driveLink: e.target.value })} className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 transition disabled:opacity-50" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FaLink /> Demo Link</label>
                          <input type="url" disabled={!isCreator} placeholder="https://yourdemo.com" value={projectForm.demoLink} onChange={(e) => setProjectForm({ ...projectForm, demoLink: e.target.value })} className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-purple-500/50 transition disabled:opacity-50" />
                        </div>
                      </div>
                      {isCreator ? (
                        <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-950/20 transition transform hover:-translate-y-0.5">
                          Submit Project Details
                        </button>
                      ) : (
                        <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl text-center text-xs text-slate-500 italic">
                          * Only the Team Leader can submit project details.
                        </div>
                      )}
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}