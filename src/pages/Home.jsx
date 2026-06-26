import { FaUniversity, FaSeedling, FaUserTie } from "react-icons/fa";
import { FaLightbulb, FaCogs, FaRocket } from "react-icons/fa";
import { FaUserPlus, FaTrophy } from "react-icons/fa";
import { FaGift, FaAward} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, loginRedirect } = useAuth();
  const isLoggedIn = !!user;

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "judge") return "/judge/dashboard";
    return "/participants/dashboard";
  };
  return (
    <div className="min-h-screen bg-[#0B0614] text-white">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-purple-950 via-purple-900 to-purple-700 px-4 sm:px-6 md:px-10">

        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.4),transparent_60%)]"></div>

        <div className="min-h-[80vh] flex items-center justify-center text-center relative">

          <div className="max-w-3xl">

            {/* TAGS */}

        <div className="flex justify-center gap-3 flex-wrap">

        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/40 text-xs font-semibold">
            <FaLightbulb /> INNOVATION
        </span>

        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/40 text-xs font-semibold">
            <FaCogs /> BUILD
        </span>

        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/40 text-xs font-semibold">
            <FaRocket /> DEPLOY
        </span>

        </div>

            {/* TITLE */}
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="italic text-6xl sm:text-8xl md:text-9xl font-extrabold leading-tight">AI</span> INNOVATION HACKATHON
            </h1>

            <p className="text-sm font-bold sm:text-lg md:text-2xl mt-3 text-purple-200">
              FROM LEARNING TO IMPACT
            </p>

            <p className="mt-2 text-xs font-bold sm:text-sm md:text-base text-gray-300 tracking-wide">
              INTRA-UNIVERSITY HACKATHON 2026
            </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

        {/* PRIMARY CTA */}
{/* ব্যবহারকারী লগইন না থাকলে (!isLoggedIn) এই বাটনটি দেখাবে */}
{!isLoggedIn ? (
  <button 
    onClick={loginRedirect}
    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold shadow-lg shadow-purple-900/40 hover:shadow-purple-500/50 transition transform hover:-translate-y-0.5"
  >
    <FaUserPlus /> Register Team
  </button>
) : (
  <Link to={getDashboardLink()}>
    <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold shadow-lg shadow-purple-900/40 hover:shadow-purple-500/50 transition transform hover:-translate-y-0.5">
      Go to Dashboard
    </button>
  </Link>
)}

        {/* SECONDARY CTA */}
        <Link to='/leaderboard'>
        <button className="
            flex items-center justify-center gap-2
            px-6 py-3 rounded-xl
            border border-purple-400/50
            text-purple-200 font-semibold
            hover:bg-purple-500/10
            hover:border-purple-300
            transition transform hover:-translate-y-0.5
        ">
            <FaTrophy /> Leaderboard
        </button>
</Link>
        </div>

          </div>

        </div>
      </section>



{/* GRAND PRIZE */}
<section className="px-4 sm:px-6 md:px-10 mt-12">

  <div className="
    relative max-w-3xl mx-auto
    rounded-2xl p-6 sm:p-8
    bg-gradient-to-r from-purple-900/40 to-pink-900/40
    border border-purple-500/30
    backdrop-blur-xl
    shadow-[0_0_40px_rgba(168,85,247,0.15)]
    hover:shadow-[0_0_60px_rgba(168,85,247,0.25)]
    transition
  ">

    {/* glow orb */}
    <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full"></div>

    <div className="relative text-center">

      {/* badge */}
      <div className="flex justify-center mb-3">
        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-400/30 text-xs font-semibold">
          <FaTrophy /> GRAND PRIZE
        </span>
      </div>

      {/* amount */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-white to-pink-300 bg-clip-text text-transparent">
        1,20,000 BDT
      </h1>

      {/* description */}
      <p className="text-xs sm:text-sm md:text-base text-gray-300 mt-3 leading-relaxed">
        Reward for the winning team of <span className="text-purple-300 font-semibold">
        AI Innovation Hackathon 2026
        </span>
      </p>

    </div>
  </div>

</section>


{/* PERKS */}
<section className="px-4 sm:px-6 md:px-10 mt-12">

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

    {/* CARD 1 */}
    <div className="
      group card bg-white/5 border border-white/10
      backdrop-blur-xl rounded-2xl
      hover:border-purple-500/40
      hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]
      transition
    ">
      <div className="card-body">

        <div className="flex items-center gap-3 mb-2 text-purple-300">
          <FaGift className="text-xl group-hover:scale-110 transition" />
          <h2 className="font-bold text-base sm:text-lg">
            Finalist Rewards
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          ID Card, T-Shirt, Pen, Diary, Lunch & Official Certificate
        </p>

      </div>
    </div>

    {/* CARD 2 */}
    <div className="
      group card bg-white/5 border border-white/10
      backdrop-blur-xl rounded-2xl
      hover:border-yellow-400/40
      hover:shadow-[0_0_30px_rgba(250,204,21,0.12)]
      transition
    ">
      <div className="card-body">

        <div className="flex items-center gap-3 mb-2 text-yellow-300">
          <FaAward className="text-xl group-hover:scale-110 transition" />
          <h2 className="font-bold text-base sm:text-lg">
            Certification
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Official certificate from university authority & recognition
        </p>

      </div>
    </div>

    {/* CARD 3 */}
    <div className="
      group card bg-white/5 border border-white/10
      backdrop-blur-xl rounded-2xl
      hover:border-pink-500/40
      hover:shadow-[0_0_30px_rgba(236,72,153,0.12)]
      transition
    ">
      <div className="card-body">

        <div className="flex items-center gap-3 mb-2 text-pink-300">
          <FaRocket className="text-xl group-hover:scale-110 transition" />
          <h2 className="font-bold text-base sm:text-lg">
            Exposure
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
          Industry exposure, networking & career opportunities
        </p>

      </div>
    </div>

  </div>

</section>

     {/* ORGANIZERS */}
<section className="text-center mt-16 px-4 sm:px-6 md:px-10">

  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-300 tracking-wide">
    ORGANIZERS & SUPPORT
  </h2>

  {/* underline */}
  <div className="flex justify-center mt-2 mb-10">
    <div className="w-24 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
  </div>

  <div className="flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-16">

    {/* ORGANIZED BY */}
    <div className="group text-center">

      <p className="text-sm text-gray-300 mb-2 tracking-widest uppercase">
        Organized By
      </p>
      {/* underline */}
  <div className="flex justify-center mb-10">
    <div className="w-24 h-[2px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
  </div>
      <img
        src="/org.png"
        className="
          w-16 h-16 sm:w-20 sm:h-20 mx-auto
          rounded-full border border-white/20
          shadow-lg
          group-hover:shadow-purple-500/30
          transition
        "
      />

      <p className="mt-3 font-semibold text-white group-hover:text-purple-300 transition">
        Department of CSE
      </p>

    </div>

    {/* SEED FUNDED */}
    <div className="group text-center">

      <p className="text-sm text-gray-300 mb-2 tracking-widest uppercase">
        Seed Funded By
      </p>
      {/* underline */}
  <div className="flex justify-center mb-10">
    <div className="w-24 h-[2px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
  </div>
      <img
        src="/seed.png"
        className="
          w-16 h-16 sm:w-20 sm:h-20 mx-auto
          rounded-full border border-white/20
          shadow-lg
          group-hover:shadow-green-400/30
          transition
        "
      />

      <p className="mt-3 font-semibold text-white group-hover:text-green-300 transition">
        Word AI Alliance
      </p>

    </div>

    {/* LEAD */}
    <div className="group text-center">

      <p className="text-sm text-gray-300 mb-2 tracking-widest uppercase">
        Lead By
      </p>
      {/* underline */}
  <div className="flex justify-center mb-10">
    <div className="w-24 h-[2px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
  </div>
      <img
        src="/lead.png"
        className="
          w-16 h-16 sm:w-20 sm:h-20 mx-auto
          rounded-full border border-white/20
          shadow-lg
          group-hover:shadow-pink-500/30
          transition
        "
      />

      <p className="mt-3 font-semibold text-white group-hover:text-pink-300 transition">
        CSE AI Centre
      </p>

    </div>

{/* SUPPORTED BY */}
<div className="text-center mt-16 px-4 sm:px-6 md:px-10">

  <p className="text-sm text-gray-300 mb-2 tracking-widest uppercase">
    Supported By
  </p>

  {/* underline */}
  <div className="flex justify-center mb-10">
    <div className="w-24 h-[2px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
  </div>

  {/* GRID */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

    {/* FACULTY 1 */}
    <div className="group text-center">

      <img
        src="/faculty1.png"
        className="
          w-20 h-20 mx-auto
          rounded-full border border-white/20
          shadow-lg
          group-hover:shadow-purple-500/30
          transition
        "
      />

      <p className="mt-3 font-semibold text-white group-hover:text-purple-300 transition">
        Daffodil AI Club
      </p>


    </div>

    {/* FACULTY 2 */}
    <div className="group text-center">

      <img
        src="/faculty2.png"
        className="
          w-20 h-20 mx-auto
          rounded-full border border-white/20
          shadow-lg
          group-hover:shadow-pink-500/30
          transition
        "
      />

      <p className="mt-3 font-semibold text-white group-hover:text-pink-300 transition">
        Cyber Security Club
      </p>


    </div>

    {/* FACULTY 3 */}
    <div className="group text-center">

      <img
        src="/faculty3.png"
        className="
          w-20 h-20 mx-auto
          rounded-full border border-white/20
          shadow-lg
          group-hover:shadow-indigo-500/30
          transition
        "
      />

      <p className="mt-3 font-semibold text-white group-hover:text-indigo-300 transition">
        AR/VR & Game Dev Lab
      </p>


    </div>

  </div>

</div>


  </div>

</section>

      {/* BOTTOM SPACING */}
      <div className="h-16"></div>

    </div>
  );
}