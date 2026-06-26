import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function ProfilePage() {
  const { user: authUser, fetchUserProfile } = useAuth();
  
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    phone: "",
    bio: "",
    expertise: "",
    industry: "",
    designation: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setEditedUser(authUser);
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await API.put("/api/auth/me", editedUser);
      await fetchUserProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const isJudge = editedUser.role?.toLowerCase() === "judge";

  return (
    <div className="relative min-h-screen bg-[#090411] text-slate-100 px-4 sm:px-6 md:px-10 py-16 overflow-hidden flex items-center justify-center">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* PROFILE CARD */}
      <div className="relative w-full max-w-xl bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/50 transition-all hover:shadow-purple-950/30">
        {/* COVER GRADIENT LINE */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 opacity-80" />

        {/* HEADER: Avatar + Name & Role (non-editable) */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-white/[0.06] text-center sm:text-left mt-2">
          <div className="relative flex-shrink-0 group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-sm opacity-40 group-hover:opacity-70 transition duration-500" />
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="relative w-20 h-20 rounded-2xl bg-slate-800 object-cover border-2 border-white/10 shadow-xl"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {user.name}
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-medium flex items-center gap-1.5 justify-center sm:justify-start">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {user.email}
            </p>
          </div>
        </div>



        {/* EDITABLE FIELDS – Department & Phone (always editable when editing) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-purple-500/20 transition-colors">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">
              Department
            </span>
            {isEditing ? (
              <input
                name="department"
                value={editedUser.department}
                onChange={handleInputChange}
                className="bg-[#090411] border border-white/[0.06] rounded-lg px-3 py-1 text-sm text-slate-200 w-full outline-none focus:border-purple-500/50 transition"
              />
            ) : (
              <span className="text-sm text-indigo-300 font-semibold tracking-wide">
                {user.department}
              </span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-purple-500/20 transition-colors">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-0.5">
              Phone Number
            </span>
            {isEditing ? (
              <input
                name="phone"
                value={editedUser.phone}
                onChange={handleInputChange}
                className="bg-[#090411] border border-white/[0.06] rounded-lg px-3 py-1 text-sm text-slate-200 w-full outline-none focus:border-purple-500/50 transition"
              />
            ) : (
              <span className="text-sm text-slate-200 font-medium">{user.phone}</span>
            )}
          </div>
        </div>

        {/* JUDGE-SPECIFIC FIELDS (only shown when role === Judge) */}
        {isJudge && (
          <div className="space-y-4 mb-5">
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">
                Expertise
              </span>
              {isEditing ? (
                <input
                  name="expertise"
                  value={editedUser.expertise || ""}
                  onChange={handleInputChange}
                  className="w-full bg-[#090411] border border-white/[0.06] rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-purple-500/50 transition"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {user.expertise?.split(",").map((item, i) => (
                    <span
                      key={i}
                      className="inline-block bg-purple-500/10 text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {item.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">
                Industry / University
              </span>
              {isEditing ? (
                <input
                  name="industry"
                  value={editedUser.industry || ""}
                  onChange={handleInputChange}
                  className="w-full bg-[#090411] border border-white/[0.06] rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-purple-500/50 transition"
                />
              ) : (
                <span className="text-sm text-slate-300 font-medium">{user.industry || "—"}</span>
              )}
            </div>

            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">
                Designation
              </span>
              {isEditing ? (
                <input
                  name="designation"
                  value={editedUser.designation || ""}
                  onChange={handleInputChange}
                  className="w-full bg-[#090411] border border-white/[0.06] rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-purple-500/50 transition"
                />
              ) : (
                <span className="text-sm text-slate-300 font-medium">{user.designation || "—"}</span>
              )}
            </div>
          </div>
        )}

        {/* BIOGRAPHY (editable for both roles) */}
        <div className="mb-5">
          <div className="p-4 rounded-xl bg-purple-500/[0.02] border border-purple-500/10 hover:border-purple-500/20 transition-colors">
            <h3 className="text-[10px] uppercase font-bold tracking-wider text-purple-400 mb-1.5">
              Biography
            </h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={editedUser.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-[#090411] border border-white/[0.06] rounded-xl px-4 py-2 text-sm text-slate-200 outline-none focus:border-purple-500/50 transition resize-none"
              />
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        {/* FOOTER BAR with Edit / Save / Cancel */}
        <div className="pt-4 border-t border-white/[0.04] flex justify-end gap-2 text-xs font-medium">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 rounded-lg border border-white/[0.06] text-slate-300 hover:bg-white/5 transition text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition text-xs font-bold uppercase tracking-wider"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setEditedUser({ ...user });
                setIsEditing(true);
              }}
              className="px-4 py-1.5 rounded-lg border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition text-xs font-bold uppercase tracking-wider"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}