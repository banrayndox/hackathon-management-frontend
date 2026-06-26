export default function Dashboard() {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-base-200 p-5">
        <ul className="menu gap-2">
          <li><a>Dashboard</a></li>
          <li><a>My Team</a></li>
          <li><a>Submit Project</a></li>
          <li><a>Leaderboard</a></li>
          <li><a>Notifications</a></li>
        </ul>
      </div>

      {/* Main */}
      <div className="flex-1 p-10 bg-base-100">

        <h1 className="text-3xl font-bold mb-5">
          Welcome Back 🚀
        </h1>

        <div className="grid grid-cols-3 gap-4">

          <div className="card bg-base-200">
            <div className="card-body">
              Team Status: Approved
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              Payment: Verified
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              Score: 85
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}