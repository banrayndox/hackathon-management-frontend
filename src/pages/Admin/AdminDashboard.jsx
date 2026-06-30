import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FaUsers, FaGavel, FaGamepad, FaCheckCircle,
  FaTrashAlt, FaUserShield, FaUserMinus, FaSearch,
  FaEdit, FaTimes, FaExclamationTriangle
} from "react-icons/fa";
import API from "../../api/axios";
import toast from "react-hot-toast";

/* ── Reusable Confirm Modal ── */
function ConfirmModal({ isOpen, title, message, confirmLabel = "Confirm", danger = true, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-[#13082a] border border-white/[0.08] rounded-2xl p-6 shadow-2xl shadow-black/60">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
          danger ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-purple-500/10 border border-purple-500/20 text-purple-400"
        }`}>
          <FaExclamationTriangle className="text-xl" />
        </div>
        <h3 className="text-base font-bold text-slate-200 text-center">{title}</h3>
        <p className="text-xs text-slate-400 text-center mt-2 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] text-xs font-bold transition">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold transition ${
            danger ? "bg-red-600 hover:bg-red-500" : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400"
          }`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const {user} = useAuth()
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

const [teamJudgeFilter, setTeamJudgeFilter] = useState("all");
const [userTeamRoleFilter, setUserTeamRoleFilter] = useState("all");

  const [teamSearch, setTeamSearch] = useState("");
  
  const [teamPaymentFilter, setTeamPaymentFilter] = useState("all");

  // Modal state for points adjustment
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [tempCriteria, setTempCriteria] = useState({ innovation: 0, complexity: 0, design: 0, presentation: 0, functionality: 0 });
  const [tempFeedback, setTempFeedback] = useState("");

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", confirmLabel: "Confirm", danger: true, onConfirm: null });
  const openConfirm = (title, message, onConfirm, { confirmLabel = "Confirm", danger = true } = {}) =>
    setConfirmModal({ open: true, title, message, confirmLabel, danger, onConfirm });
  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, open: false }));

  const refreshData = async () => {
    try {
      setLoading(true);
      const [usersRes, teamsRes] = await Promise.all([
        API.get("/api/admin/users"),
        API.get("/api/admin/teams")
      ]);
      // console.log(usersRes)
      // console.log(teamsRes)
      setUsers(usersRes.data);
      setTeams(teamsRes.data);
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Actions
  const handleDeleteUser = (id, name) => {
    openConfirm(
      "Delete User",
      `Permanently delete ${name}? This cannot be undone.`,
      async () => {
        closeConfirm();
        const tid = toast.loading("Deleting user...");
        try {
          setLoading(true);
          await API.delete(`/api/admin/users/${id}`);
          toast.success("User deleted", { id: tid });
          await refreshData();
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete user", { id: tid });
        } finally {
          setLoading(false);
        }
      },
      { confirmLabel: "Delete", danger: true }
    );
  };

  const toggleJudgeRole = async (id, currentRole, name) => {
    const newRole = currentRole === "judge" ? "participant" : "judge";
    const tid = toast.loading(newRole === "judge" ? "Promoting to Judge..." : "Demoting to Participant...");
    try {
      setLoading(true);
      await API.put(`/api/admin/users/${id}/role`, { role: newRole });
      toast.success(newRole === "judge" ? `${name} promoted to Judge` : `${name} demoted to Participant`, { id: tid });
      await refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignJudge = async (teamId, judgeId, judgeName) => {
    const tid = toast.loading(judgeId === "None" ? "Removing judge..." : `Assigning ${judgeName || "judge"}...`);
    try {
      setLoading(true);
      await API.put(`/api/admin/teams/${teamId}/assign-judge`, { judgeId: judgeId === "None" ? null : judgeId });
      toast.success(judgeId === "None" ? "Judge unassigned" : `Judge assigned successfully`, { id: tid });
      await refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign judge", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (teamId, teamName) => {
    const tid = toast.loading("Approving payment...");
    try {
      setLoading(true);
      await API.put(`/api/admin/teams/${teamId}/payment`, { paid: true });
      toast.success(`Payment approved for ${teamName}`, { id: tid });
      await refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve payment", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeam = (id, name) => {
    openConfirm(
      "Remove Team",
      `Permanently remove team "${name}"? This cannot be undone.`,
      async () => {
        closeConfirm();
        const tid = toast.loading("Removing team...");
        try {
          setLoading(true);
          await API.delete(`/api/admin/teams/${id}`);
          toast.success(`Team "${name}" removed`, { id: tid });
          await refreshData();
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to delete team", { id: tid });
        } finally {
          setLoading(false);
        }
      },
      { confirmLabel: "Remove", danger: true }
    );
  };

  const handleOpenPointsModal = (team) => {
    setSelectedTeam(team);
    setTempCriteria({
      innovation: team.criteria?.innovation || 0,
      complexity: team.criteria?.complexity || 0,
      design: team.criteria?.design || 0,
      presentation: team.criteria?.presentation || 0,
      functionality: team.criteria?.functionality || 0,
    });
    setTempFeedback(team.feedback || "");
    setShowPointsModal(true);
  };

  const handleCriteriaChange = (criterion, value) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) return;
    setTempCriteria(prev => ({ ...prev, [criterion]: Math.min(num, 100) }));
  };

  const handleSavePoints = async () => {
    const valid = Object.values(tempCriteria).every(v => v >= 0 && v <= 100);
    if (!valid) {
      toast.error("Each criterion must be between 0 and 100.");
      return;
    }
    const tid = toast.loading("Saving scores...");
    try {
      setLoading(true);
      await API.put(`/api/admin/teams/${selectedTeam._id}/scores`, {
        ...tempCriteria,
        feedback: tempFeedback.trim()
      });
      toast.success(`Scores saved for ${selectedTeam.name}`, { id: tid });
      await refreshData();
      setShowPointsModal(false);
      setSelectedTeam(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save points", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowPointsModal(false);
    setSelectedTeam(null);
  };

  // Helper to compute total score from criteria
  const getTotalScore = (criteria) => {
    if (!criteria) return 0;
    return Object.values(criteria).reduce((sum, val) => sum + val, 0);
  };

  // Metrics
  const judgesList = users.filter(user => user.role === "judge");
  const totalUsers = users.length;
  const totalTeams = teams.length;
  const totalJudges = judgesList.length;
  const totalPaidTeams = teams.filter(team => team.paid).length;

  // Filtered Arrays
const filteredUsers = users.filter(user => {
  const matchesSearch = user.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
                        user.email?.toLowerCase().includes(userSearch.toLowerCase());
  const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
  // Leader/Member ফিল্টার – ধরে নিচ্ছি user-এর teamRole বা leader ফিল্ড আছে
  const userTeamRole = user.teamRole || (user.isLeader ? "leader" : "member"); // আপনার ডাটা অনুযায়ী পরিবর্তন করুন
  const matchesTeamRole = userTeamRoleFilter === "all" || userTeamRole === userTeamRoleFilter;
  return matchesSearch && matchesRole && matchesTeamRole;
});

const filteredTeams = teams.filter(team => {
  const matchesSearch = team.name?.toLowerCase().includes(teamSearch.toLowerCase());
  const matchesPayment = teamPaymentFilter === "all" || 
                         (teamPaymentFilter === "paid" && team.paid) || 
                         (teamPaymentFilter === "unpaid" && !team.paid);
  // জাজ ফিল্টার
  const hasJudge = team.feedback && team.feedback !== "";
  const matchesJudge = teamJudgeFilter === "all" || 
                       (teamJudgeFilter === "judge" && hasJudge) || 
                       (teamJudgeFilter === "nonjudge" && !hasJudge);
  return matchesSearch && matchesPayment && matchesJudge;
});

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090411] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090411] text-slate-100 px-4 sm:px-6 md:px-10 py-16 overflow-hidden">
      <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto mb-12 border-b border-white/[0.06] pb-6">
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
      {user?.name}'s Control Dashboard
    </h1>
    {user?.email && (
      <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
    )}
  </div>
</div>
        <p className="text-slate-400 text-sm mt-2 font-medium">
          Control user privileges, assign judges to hackathon teams, and monitor system metrics.
        </p>
      </div>

      {/* METRICS PANEL */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Total Users</div>
            <div className="text-3xl font-extrabold text-slate-200 mt-1">{totalUsers}</div>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xl"><FaUsers /></div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Total Teams</div>
            <div className="text-3xl font-extrabold text-slate-200 mt-1">{totalTeams}</div>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xl"><FaGamepad /></div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Total Judges</div>
            <div className="text-3xl font-extrabold text-slate-200 mt-1">{totalJudges}</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xl"><FaGavel /></div>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Paid Teams</div>
            <div className="text-3xl font-extrabold text-slate-200 mt-1">{totalPaidTeams}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xl"><FaCheckCircle /></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* USER MANAGEMENT */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <FaUsers className="text-purple-400" /> User Directory
            </h2>

            {/* User Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search user or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-2 pl-9 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-purple-500/50 transition"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              </div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-[#120A24] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-purple-500/50 transition"
              >
                <option value="all">All Roles</option>
                <option value="participant">Participant</option>
                <option value="judge">Judge</option>
              </select>

              <select
  value={userTeamRoleFilter}
  onChange={(e) => setUserTeamRoleFilter(e.target.value)}
  className="bg-[#120A24] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-purple-500/50 transition"
>
  <option value="all">Leader/Member</option>
  <option value="leader">Leader</option>
  <option value="member">Member</option>
</select>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-slate-400 text-xs uppercase font-bold tracking-wider">
                    <th className="pb-3 font-semibold">User info</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-sm font-medium">
                  {filteredUsers.map((userItem) => (
                    <tr key={userItem._id} className="group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
  {/* Profile Picture */}
                  {userItem.profilePicture ? (
                    <img 
                      src={userItem.profilePicture} 
                      alt={`${userItem.name}'s profile`} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    /* Image na thakle ekti default placeholder icon */
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-sm font-medium">
                      {userItem.name ? userItem.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}

                  {/* User Name */}
                  <div className="text-slate-200 font-semibold">
                    {userItem.name}
                  </div>
</div>
                        <div className="text-xs text-slate-500">{userItem.email}</div>
                      </td>
                      <td className="py-4">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                          userItem.role === "judge" 
                            ? "border-amber-500/20 text-amber-400 bg-amber-500/10" 
                            : "border-slate-500/20 text-slate-400 bg-slate-500/10"
                        }`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
   {userItem.role !== 'admin' && (   <button
                            onClick={() => toggleJudgeRole(userItem._id, userItem.role, userItem.name)}
                            title={userItem.role === "judge" ? "Demote to User" : "Promote to Judge"}
                            className={`p-2 rounded-lg border text-xs transition transform hover:-translate-y-0.5 ${
                              userItem.role === "judge"
                                ? "border-slate-500/20 text-slate-400 hover:bg-slate-500/10"
                                : "border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                            }`}
                          >
                            {userItem.role === "judge" ? <FaUserMinus /> : <FaUserShield />}
                          </button>)}
 {userItem.role !== 'admin' && (
  <button
    onClick={() => handleDeleteUser(userItem._id, userItem.name)}
    title="Delete User"
    className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition transform hover:-translate-y-0.5"
  >
    <FaTrashAlt className="w-4 h-4" /> {/* react-icons এ Tailwind-এর w-4 h-4 দিয়ে সাইজ কন্ট্রোল করা যায় */}
  </button>
)}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-xs text-slate-500">No users found matching filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TEAM MANAGEMENT */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
              <FaGamepad className="text-pink-400" /> Team Control
            </h2>

            {/* Team Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search team name..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-full bg-[#120A24] border border-white/[0.06] rounded-xl px-4 py-2 pl-9 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-purple-500/50 transition"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              </div>
              <select
                value={teamPaymentFilter}
                onChange={(e) => setTeamPaymentFilter(e.target.value)}
                className="bg-[#120A24] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-purple-500/50 transition"
              >
                <option value="all">All Payment</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>

              <select
  value={teamJudgeFilter}
  onChange={(e) => setTeamJudgeFilter(e.target.value)}
  className="bg-[#120A24] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-purple-500/50 transition"
>
  <option value="all">All Judges</option>
  <option value="judge">Has Judge</option>
  <option value="nonjudge">No Judge</option>
</select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-slate-400 text-xs uppercase font-bold tracking-wider">
                    <th className="pb-3 font-semibold">Team</th>
                    <th className="pb-3 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">Judge</th>
                    <th className="pb-3 font-semibold">Total Score</th>
                    <th className="pb-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-sm font-medium">
                  {filteredTeams.map((team) => (
                    <tr key={team._id} className="group">
                      <td className="py-4">
                        <div className="text-slate-200 font-semibold">{team.name}</div>
                      </td>
                      <td className="py-4">
                        <div>
                          <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                            team.paid 
                              ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10" 
                              : "border-red-500/20 text-red-400 bg-red-500/10"
                          }`}>
                            {team.paid ? "Paid" : "Unpaid"}
                          </span>
                          {!team.paid && team.transactionId && (
                            <div className="mt-2 space-y-1">
                              <div className="text-[10px] text-slate-400">
                                <span>ID: {team.transactionId}</span><br />
                                <span>Method: {team.paymentMethod}</span>
                              </div>
                              <button
                                onClick={() => handleApprovePayment(team._id, team.name)}
                                className="px-2 py-1 bg-green-600 hover:bg-green-500 text-[10px] font-bold rounded text-white transition active:scale-[0.98]"
                              >
                                Approve
                              </button>
                            </div>
                          )}
                          {team.paid && (
                            <div className="text-[10px] text-slate-400 mt-1">
                              <span>ID: {team.transactionId}</span><br />
                              <span>Method: {team.paymentMethod}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <select
                          value={team.assignedJudge?._id || team.assignedJudge || "None"}
                          onChange={(e) => {
                            const judge = judgesList.find(j => j._id === e.target.value);
                            handleAssignJudge(team._id, e.target.value, judge?.name);
                          }}
                          className="bg-[#120A24] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 outline-none transition"
                        >
                          <option value="None">Assign Judge...</option>
                          {judgesList.map(judge => (
                            <option key={judge._id} value={judge._id}>{judge.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4">
                        <span className="text-amber-400 font-bold">{getTotalScore(team.criteria)}</span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenPointsModal(team)}
                            title="Adjust Points"
                            className="p-2 rounded-lg border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 text-xs transition transform hover:-translate-y-0.5"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleRemoveTeam(team._id, team.name)}
                            title="Remove Team"
                            className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition transform hover:-translate-y-0.5"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTeams.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-slate-500">No teams found matching filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        danger={confirmModal.danger}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirm}
      />

      {/* POINTS ADJUSTMENT MODAL */}
      {showPointsModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#120A24] border border-white/[0.08] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-200">Adjust Scores for {selectedTeam.name}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-200 transition">
                <FaTimes />
              </button>
            </div>
            <div className="space-y-3">
              {Object.keys(tempCriteria).map((key) => (
                <div key={key}>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={tempCriteria[key]}
                    onChange={(e) => handleCriteriaChange(key, e.target.value)}
                    className="w-full bg-[#090411] border border-white/[0.06] rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-purple-500/50 transition"
                  />
                </div>
              ))}
              
              {/* Feedback Input */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">
                  Evaluation Feedback
                </label>
                <textarea
                  rows={3}
                  value={tempFeedback}
                  onChange={(e) => setTempFeedback(e.target.value)}
                  placeholder="Provide comments on the team's performance..."
                  className="w-full bg-[#090411] border border-white/[0.06] rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-purple-500/50 transition resize-none"
                />
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center">
                <span className="text-sm text-slate-400 font-bold">Total:</span>
                <span className="text-2xl font-extrabold text-amber-400">
                  {Object.values(tempCriteria).reduce((sum, v) => sum + v, 0)}
                </span>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg border border-white/[0.06] text-slate-300 text-sm hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePoints}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:opacity-90 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}