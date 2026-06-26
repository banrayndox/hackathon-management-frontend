import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaThLarge,
  FaUsers,
  FaTrophy,
  FaGavel,
  FaSignInAlt,
  FaSignOutAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, logout, loginRedirect } = useAuth();
  useEffect(() => {
    console.log("From-> Navbar-> user state changed:", user);
  }, [user]);
  const isLoggedIn = !!user;

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "judge") return "/judge/dashboard";
    return "/participants/dashboard";
  };

  const navItem = (path) => {
    const isDashboardActive = path === "/dashboard" && location.pathname.includes("dashboard");
    return (location.pathname === path || isDashboardActive)
      ? "text-purple-400 font-semibold"
      : "text-white/70 hover:text-purple-300 font-medium transition-colors duration-200";
  };

  const renderLinks = (closeDrawer = () => {}) => (
    <>
      <Link to="/" className={`flex items-center gap-2 ${navItem("/")}`} onClick={closeDrawer}>
        <FaHome /> Home
      </Link>

      {isLoggedIn && (
        <>
          <Link to={getDashboardLink()} className={`flex items-center gap-2 ${navItem("/dashboard")}`} onClick={closeDrawer}>
            <FaThLarge /> Dashboard
          </Link>
          <Link to="/teamlist" className={`flex items-center gap-2 ${navItem("/teamlist")}`} onClick={closeDrawer}>
            <FaUsers /> Teams
          </Link>
          <Link to="/judgeslist" className={`flex items-center gap-2 ${navItem("/judgeslist")}`} onClick={closeDrawer}>
            <FaGavel /> Judges
          </Link>
          <Link to="/leaderboard" className={`flex items-center gap-2 ${navItem("/leaderboard")}`} onClick={closeDrawer}>
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

  const handleSignIn = () => {
    loginRedirect(); // পুরো পেজ Redirect
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="navbar bg-[#0B0614]/70 backdrop-blur-xl border-b border-white/10 px-4 md:px-6 sticky top-0 z-50">
      <div className="flex-1">

      </div>

      <div className="hidden md:flex gap-6 items-center font-medium mr-6">
        {renderLinks()}
      </div>

      <div className="hidden md:flex">
        {isLoggedIn ? (
          <button
            onClick={handleSignOut}
            className="btn btn-sm border border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 font-semibold shadow-lg shadow-red-950/20 transition-all duration-200"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="btn btn-sm border-none text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 shadow-lg shadow-purple-900/40 font-semibold transition-all duration-200"
          >
            <FaSignInAlt /> Sign In
          </button>
        )}
      </div>

      {/* Mobile Drawer – same changes */}
      <div className="md:hidden">
        <div className="drawer drawer-end">
          <input id="nav-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="nav-drawer" className="btn btn-ghost text-white">
              <FaEllipsisV size={20} />
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="nav-drawer" className="drawer-overlay backdrop-blur-md bg-black/40"></label>
            <div className="menu p-6 w-72 min-h-full bg-[#120A24]/95 backdrop-blur-xl text-white flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-6 text-purple-400 border-b border-white/5 pb-3">Menu</h2>
                <div className="flex flex-col gap-5 text-lg pl-1">
                  {renderLinks(handleCloseDrawer)}
                </div>
              </div>
              <div className="mt-auto pt-6 border-t border-white/5">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      handleCloseDrawer();
                    }}
                    className="btn bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 w-full font-semibold"
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleSignIn();
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
    </div>
  );
}







