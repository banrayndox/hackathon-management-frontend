import { useState, useEffect } from "react";
import { 
  FaUsers, FaGavel, FaGamepad, FaCheckCircle, 
  FaTrashAlt, FaUserShield, FaUserMinus, FaSearch,
  FaEdit, FaTimes
} from "react-icons/fa";
import API from "../../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  const [teamSearch, setTeamSearch] = useState("");
  const [teamPaymentFilter, setTeamPaymentFilter] = useState("all");

  // Modal state for points adjustment
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [tempCriteria, setTempCriteria] = useState({ innovation: 0, complexity: 0, design: 0, presentation: 0, functionality: 0 });
  const [tempFeedback, setTempFeedback] = useState("");

  const refreshData = async () => {
    try {
      setLoading(true);
      const [usersRes, teamsRes] = await Promise.all([
        API.get("/api/admin/users"),
        API.get("/api/admin/teams")
      ]);
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
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setLoading(true);
      await API.delete(`/api/admin/users/${id}`);
      await refreshData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const toggleJudgeRole = async (id, currentRole) => {
    try {
      setLoading(true);
      const newRole = currentRole === "judge" ? "participant" : "judge";
      await API.put(`/api/admin/users/${id}/role`, { role: newRole });
      await refreshData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignJudge = async (teamId, judgeId) => {
    try {
      setLoading(true);
      await API.put(`/api/admin/teams/${teamId}/assign-judge`, { judgeId: judgeId === "None" ? null : judgeId });
      await refreshData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to assign judge");
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (teamId) => {
    try {
      setLoading(true);
      await API.put(`/api/admin/teams/${teamId}/payment`, { paid: true });
      await refreshData();
    } catch (err) {
      console.error("Failed to approve payment", err);
      alert(err.response?.data?.message || "Failed to approve payment");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeam = async (id) => {
    if (!window.confirm("Are you sure you want to remove this team?")) return;
    try {
      setLoading(true);
      await API.delete(`/api/admin/teams/${id}`);
      await refreshData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete team");
    } finally {
      setLoading(false);
    }
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
      alert("Each criterion must be between 0 and 100.");
      return;
    }
    try {
      setLoading(true);
      await API.put(`/api/admin/teams/${selectedTeam._id}/scores`, {
        ...tempCriteria,
        feedback: tempFeedback.trim()
      });
      await refreshData();
      setShowPointsModal(false);
      setSelectedTeam(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save points");
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
    return matchesSearch && matchesRole;
  });

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name?.toLowerCase().includes(teamSearch.toLowerCase());
    const matchesPayment = teamPaymentFilter === "all" || 
                           (teamPaymentFilter === "paid" && team.paid) || 
                           (teamPaymentFilter === "unpaid" && !team.paid);
    return matchesSearch && matchesPayment;
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
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Admin Control Center
        </h1>
        <p className="text-slate-400 text-sm mt-2 font-medium">
          Manage system configurations, control user privileges, assign judges to hackathon teams, and monitor system metrics.
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
                        <div className="text-slate-200 font-semibold">{userItem.name}</div>
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
                          <button
                            onClick={() => toggleJudgeRole(userItem._id, userItem.role)}
                            title={userItem.role === "judge" ? "Demote to User" : "Promote to Judge"}
                            className={`p-2 rounded-lg border text-xs transition transform hover:-translate-y-0.5 ${
                              userItem.role === "judge"
                                ? "border-slate-500/20 text-slate-400 hover:bg-slate-500/10"
                                : "border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                            }`}
                          >
                            {userItem.role === "judge" ? <FaUserMinus /> : <FaUserShield />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(userItem._id)}
                            title="Delete User"
                            className="p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition transform hover:-translate-y-0.5"
                          >
                            <FaTrashAlt />
                          </button>
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
                                onClick={() => handleApprovePayment(team._id)}
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
                          onChange={(e) => handleAssignJudge(team._id, e.target.value)}
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
                            onClick={() => handleRemoveTeam(team._id)}
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