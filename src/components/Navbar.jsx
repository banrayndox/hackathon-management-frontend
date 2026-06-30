// components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaThLarge,
  FaTrophy,
  FaGavel,
  FaSignInAlt,
  FaSignOutAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, loading, logout, loginRedirect } = useAuth();
  const isLoggedIn = !!user;

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "judge") return "/judge/dashboard";
    return "/participants/dashboard";
  };

  const navItem = (path) => {
    const isDashboardActive =
      path === "/dashboard" && location.pathname.includes("dashboard");
    return (location.pathname === path || isDashboardActive)
      ? "text-purple-400 font-semibold"
      : "text-white/70 hover:text-purple-300 font-medium transition-colors duration-200";
  };

  const renderLinks = (closeDrawer = () => {}) => (
    <>
      <Link
        to="/"
        className={`flex items-center gap-2 ${navItem("/")}`}
        onClick={closeDrawer}
      >
        <FaHome /> Home
      </Link>
      {isLoggedIn && (
        <>
          <Link
            to={getDashboardLink()}
            className={`flex items-center gap-2 ${navItem("/dashboard")}`}
            onClick={closeDrawer}
          >
            <FaThLarge /> Dashboard
          </Link>
          <Link
            to="/judgeslist"
            className={`flex items-center gap-2 ${navItem("/judgeslist")}`}
            onClick={closeDrawer}
          >
            <FaGavel /> Judges List
          </Link>
          <Link
            to="/leaderboard"
            className={`flex items-center gap-2 ${navItem("/leaderboard")}`}
            onClick={closeDrawer}
          >
            <FaTrophy /> Leaderboard
          </Link>
        </>
      )}
    </>
  );

  const handleCloseDrawer = () => {
    const drawer = document.getElementById("nav-drawer");
    if (drawer) drawer.checked = false;
  };

  return (
    <>
      {/* ডেস্কটপ ন্যাভবার (শুধু md+ তে দেখা যাবে) */}
      <div className="hidden md:flex navbar bg-[#0B0614]/70 backdrop-blur-xl border-b border-white/10 px-6 sticky top-0 z-50 min-h-16">
        <div className="flex-1 flex gap-6 items-center font-medium">
          {renderLinks()}
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <button className="btn btn-sm btn-ghost text-white/50" disabled>
              Loading...
            </button>
          ) : isLoggedIn ? (
            <button
              onClick={logout}
              className="btn btn-sm border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 font-semibold shadow-lg shadow-red-950/20 transition-all duration-200 flex items-center gap-2"
            >
              {user?.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt="User Profile"
                  className="w-5 h-5 rounded-full object-cover border border-red-500/20"
                />
              )}
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={loginRedirect}
              className="btn btn-sm border-none text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 shadow-lg shadow-purple-900/40 font-semibold transition-all duration-200"
            >
              <FaSignInAlt /> Sign In
            </button>
          )}
        </div>
      </div>

      {/* মোবাইলের জন্য ফ্লোটিং ড্রয়ার বাটন (শুধু md-তে দেখা যাবে) */}
      <div className="md:hidden fixed top-3 right-3 z-50">
        <div className="drawer drawer-end">
          <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="nav-drawer"
              className="btn btn-circle btn-ghost text-white bg-black/30 backdrop-blur-sm hover:bg-black/50 border border-white/20"
            >
              <FaEllipsisV size={22} />
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="nav-drawer"
              className="drawer-overlay backdrop-blur-md bg-black/40"
            ></label>
            <div className="menu p-6 w-72 min-h-full bg-[#120A24]/95 backdrop-blur-xl text-white flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-6 text-purple-400 border-b border-white/5 pb-3">
                  Menu
                </h2>
                <div className="flex flex-col gap-5 text-lg pl-1">
                  {renderLinks(handleCloseDrawer)}
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-white/5">
                {loading ? (
                  <button className="btn btn-ghost w-full text-white/50" disabled>
                    Loading...
                  </button>
                ) : isLoggedIn ? (
                  <button
                    onClick={() => {
                      logout();
                      handleCloseDrawer();
                    }}
                    className="btn bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 w-full font-semibold flex items-center justify-center gap-2"
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <FaSignOutAlt />
                    )}
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      loginRedirect();
                      handleCloseDrawer();
                    }}
                    className="btn bg-gradient-to-r from-purple-600 to-pink-500 border-none text-white w-full font-semibold"
                  >
                    <FaSignInAlt /> Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}