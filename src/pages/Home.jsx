
import { useEffect } from "react";
import { 
  FaUniversity, FaSeedling, FaUserTie, FaLightbulb, FaCogs, FaRocket, 
  FaUserPlus, FaTrophy, FaGift, FaAward, FaBook, FaBullseye, FaUsers, 
  FaServer, FaDollarSign, FaShieldAlt, FaTools, FaCalendarAlt, FaClock 
} from "react-icons/fa";


 
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PremiumPrizeSection from "../components/PremiumPrizeSection";

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
      {/* CTA */}
{/* এখানে w-full এবং items-center যোগ করা হয়েছে যেন মোবাইল স্ক্রিনে সবকিছু সেন্টারে থাকে */}
<div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 w-full">

  {/* SECONDARY CTA */}
  {/* Link ট্যাগে w-full sm:w-auto এবং flex justify-center দেওয়া হয়েছে */}
  <Link 
    to='https://drive.google.com/file/d/1mCZv8RE6YKEvrkX9XvWh-a34LvwUjNSY/view'
    className="w-full sm:w-auto flex justify-center"
  >
    <button className="
        flex items-center justify-center gap-2
        w-full sm:w-auto /* মোবাইলে বাটনটি ফুল উইডথ হবে, বড় স্ক্রিনে কন্টেন্ট অনুযায়ী সাইজ নিবে */
        px-6 py-3 rounded-xl
        bg-purple-950/20 backdrop-blur-md
        border border-white/10
        text-purple-200 font-medium tracking-wide
        shadow-[0_0_15px_rgba(168,85,247,0.1)]
        
        hover:bg-purple-500/20
        hover:border-purple-400/40
        hover:text-white
        hover:shadow-[0_0_25px_rgba(168,85,247,0.35)]
        
        transition-all duration-300 ease-out 
        active:scale-[0.98]
    ">
        <FaBook /> Download Rulebook
    </button>
  </Link>
</div>

          </div>

        </div>
      </section>



{/* GRAND PRIZE */}

<PremiumPrizeSection />


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











{/* OBJECTIVES & HACKATHON TRACK */}
<section className="px-4 sm:px-6 md:px-10 mt-16 max-w-6xl mx-auto">
  <div className="text-center mb-10">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-300 tracking-wide uppercase">
      Our Objectives & Track Details
    </h2>
    <div className="flex justify-center mt-2">
      <div className="w-24 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
    </div>
    <p className="mt-4 text-pink-300 font-semibold text-sm sm:text-base">
      Theme: AI for Cluster Intelligence — Making Compute Faster, Cheaper & More Reliable
    </p>
    <p className="text-xs text-gray-400 mt-1">
      Eligibility: DIU Students & Alumni only | Team Size: 3 Students + 1 Mentor
    </p>
  </div>

  {/* Objectives Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-purple-500/40 transition">
      <div className="flex items-center gap-3 mb-3 text-purple-400">
        <FaServer className="text-xl" />
        <h3 className="font-bold text-lg">Smarter GPU Cluster Management</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
        Encourage hands-on engagement with the real-world challenge of orchestrating GPU and CPU clusters — the compute layer that powers every AI workload.
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-pink-500/40 transition">
      <div className="flex items-center gap-3 mb-3 text-pink-400">
        <FaLightbulb className="text-xl" />
        <h3 className="font-bold text-lg">Spark Innovation & Startup Potential</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
        Companies like Rafay and Mirantis have built businesses orchestrating GPU clusters, but the intelligent layer on top is still wide open — a real gap and a great problem for hackers.
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-indigo-500/40 transition">
      <div className="flex items-center gap-3 mb-3 text-indigo-400">
        <FaUsers className="text-xl" />
        <h3 className="font-bold text-lg">Build a Strong AI Community at DIU</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
        Unite DIU students and alumni around cutting-edge AI themes, fostering collaboration, mentorship, and a culture of innovation within the university ecosystem.
      </p>
    </div>

    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-yellow-400/40 transition">
      <div className="flex items-center gap-3 mb-3 text-yellow-400">
        <FaCogs className="text-xl" />
        <h3 className="font-bold text-lg">Build the Smart Layer for Compute</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
        Challenge participants to build the intelligent layer that decides what runs where, predicts failures, and cuts idle GPU costs — making AI compute faster, cheaper, and more reliable.
      </p>
    </div>
  </div>



  {/* Track Sub-Angles */}
  <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/20 rounded-2xl p-6 sm:p-8">
    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
      <FaTools className="text-purple-400" /> Track Angles & Supported Tools
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6">
      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <h4 className="font-semibold text-purple-300 text-sm mb-1">Smart Scheduling</h4>
        <p className="text-xs text-gray-400">ML workload placement & GPU packing.</p>
      </div>
      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <h4 className="font-semibold text-pink-300 text-sm mb-1">Predictive Operations</h4>
        <p className="text-xs text-gray-400">Spotting failures & anomalies early.</p>
      </div>
      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
        <h4 className="font-semibold text-yellow-300 text-sm mb-1">Cost Optimization</h4>
        <p className="text-xs text-gray-400">Cutting idle GPU spend automatically.</p>
      </div>
    </div>
    <div className="flex flex-wrap justify-center gap-2 pt-2 border-t border-white/10">
      {['Kubernetes', 'Prometheus', 'NVIDIA DCGM', 'Other Open Tools'].map((tool) => (
        <span key={tool} className="text-xs bg-purple-500/10 text-purple-300 px-3 py-1 rounded-md border border-purple-500/20 font-mono">
          {tool}
        </span>
      ))}
    </div>
  </div>













{/* JOURNEY & TIMELINE */}
<section className="px-4 sm:px-6 md:px-10 mt-16 max-w-6xl mx-auto mb-10">
  <div className="text-center mb-10">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-300 tracking-wide uppercase">
      Hackathon Phases & Evaluation
    </h2>
    <div className="flex justify-center mt-2 mb-4">
      <div className="w-24 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    {/* Phase 1 */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 relative">
      <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-purple-600 text-xs font-bold text-white shadow-md">
        PHASE 1 — PRELIMINARY (ONLINE)
      </span>
      <p className="text-xs sm:text-sm text-gray-300 mt-2 mb-4 leading-relaxed">
        Submit your project idea, proposed architecture, and potential impact. 
        <br/><span className="text-purple-300 font-semibold">Top 50 teams advance</span> (10 on waiting list).
      </p>
      <div className="border-t border-white/10 pt-3 mb-4">
        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Deliverables</h4>
        <p className="text-xs text-gray-300">Concept Note • Max 10 Presentation Slides • 3–5 Min Video</p>
      </div>
      <div>
        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Judging Weights</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between border-b border-white/5 py-1"><span>Innovation & Creativity</span><span className="font-bold text-purple-300">40%</span></div>
          <div className="flex justify-between border-b border-white/5 py-1"><span>Idea Concept & Tech Analysis</span><span className="font-bold text-purple-300">30%</span></div>
          <div className="flex justify-between border-b border-white/5 py-1"><span>Real-world Impact</span><span className="font-bold text-purple-300">20%</span></div>
          <div className="flex justify-between py-1"><span>Presentation Quality</span><span className="font-bold text-purple-300">10%</span></div>
        </div>
      </div>
    </div>

    {/* Phase 2 */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 relative">
      <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-pink-600 text-xs font-bold text-white shadow-md">
        PHASE 2 — FINAL ROUND (ON-SITE)
      </span>
      <p className="text-xs sm:text-sm text-gray-300 mt-2 mb-4 leading-relaxed">
        An intense <span className="text-pink-300 font-semibold">8-hour live prototyping session</span> at Knowledge Tower. Pitch straight to faculty and industry leaders.
      </p>
      <div className="border-t border-white/10 pt-3">
        <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-2">Judging Criteria</h4>
        <div className="grid grid-cols-2 gap-x-4 text-xs">
          <div className="flex justify-between border-b border-white/5 py-1"><span>Innovation</span><span className="font-bold text-pink-300">20%</span></div>
          <div className="flex justify-between border-b border-white/5 py-1"><span>Tech Complexity</span><span className="font-bold text-pink-300">20%</span></div>
          <div className="flex justify-between border-b border-white/5 py-1"><span>Real-world Impact</span><span className="font-bold text-pink-300">20%</span></div>
          <div className="flex justify-between border-b border-white/5 py-1"><span>Scalability</span><span className="font-bold text-pink-300">15%</span></div>
          <div className="flex justify-between border-b border-white/5 py-1"><span>Demo & Pitch</span><span className="font-bold text-pink-300">15%</span></div>
          <div className="flex justify-between border-b border-white/5 py-1"><span>Collaboration</span><span className="font-bold text-pink-300">10%</span></div>
        </div>
      </div>
    </div>
  </div>

  {/* Event Timeline Calendar */}
  {/* <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6">
    <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
      <FaCalendarAlt className="text-purple-400" /> Key Dates & Deadlines
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 text-center">
      {[
        { date: '25 May', label: 'Reg Opens' },
        { date: '22 June', label: 'Reg Deadline' },
        { date: '25 June', label: 'Mentoring 1' },
        { date: '25-30 Jun', label: 'Phase 1 Sub' },
        { date: '27 June', label: 'Mentoring 2' },
        { date: '2 July', label: 'Finalists' },
        { date: '7 July', label: 'Phase 2 Reg' },
        { date: '11 July', label: 'Grand Finale' },
      ].map((item, idx) => (
        <div key={idx} className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/10">
          <p className="text-xs font-extrabold text-pink-400 font-mono">{item.date}</p>
          <p className="text-[10px] text-gray-300 mt-1 font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  </div> */}
</section>


</section>











{/* DAY-OF SCHEDULE */}
<section className="px-4 sm:px-6 md:px-10 mt-16 max-w-4xl mx-auto">
  <div className="text-center mb-10">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-300 tracking-wide uppercase">
      Final Round Schedule (11 July)
    </h2>
    <p className="text-xs text-gray-400 mt-1">Venue: Knowledge Tower (Library), Daffodil International University</p>
    <div className="flex justify-center mt-2">
      <div className="w-24 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
    </div>
  </div>

  <div className="relative border-l border-purple-500/30 ml-4 md:ml-32 space-y-6">
    {[
      { time: '8:00 AM', title: 'Registration & Check-in', desc: 'Arrive, register, and set up your workspace' },
      { time: '8:15 AM', title: 'Breakfast', desc: 'Fuel up before the big day' },
      { time: '8:30 AM', title: 'Opening & Hack Starts', desc: 'Keynote speakers, event kickoff, and the clock starts' },
      { time: '10:30 AM', title: 'First Judge Visit', desc: 'Initial progress check and feedback from judges' },
      { time: '1:00 PM', title: 'Lunch Break', desc: 'Full lunch break to recharge' },
      { time: '1:35 PM', title: 'Second Judge Visit', desc: 'Mid-way evaluation and technical guidance' },
      { time: '4:30 PM', title: 'Submission Deadline', desc: 'All projects must be pushed and finalized' },
      { time: '4:30 PM', title: 'Final Pitch Presentations', desc: 'Teams present prototypes to the judging panel' },
      { time: '6:30 PM', title: 'Award Ceremony', desc: 'Winners announced and prizes distributed' },
    ].map((sched, index) => (
      <div key={index} className="relative pl-6 group">
        <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-purple-500 border border-[#0B0614] group-hover:bg-pink-500 transition"></div>
        <div className="md:absolute md:-left-32 md:w-24 text-left md:text-right font-mono font-bold text-xs text-purple-400 pt-0.5">
          {sched.time}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition">{sched.title}</h4>
          <p className="text-xs text-gray-400 mt-0.5">{sched.desc}</p>
        </div>
      </div>
    ))}
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
<div className="text-center mt-10 px-4 sm:px-6 md:px-10">

  <p className="text-xs text-gray-400 mb-1.5 tracking-widest uppercase">
    Supported By
  </p>

  {/* underline */}
  <div className="flex justify-center mb-6">
    <div className="w-16 h-[1.5px] bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
  </div>

  {/* GRID */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto">

    {/* FACULTY 1 */}
    <div className="group text-center">

      <img
        src="/faculty1.png"
        className="
          w-14 h-14 mx-auto
          rounded-full border border-white/20
          shadow-md
          group-hover:shadow-purple-500/30
          transition
        "
      />

      <p className="mt-2 text-sm font-medium text-white group-hover:text-purple-300 transition">
        Daffodil AI Club
      </p>

    </div>

    {/* FACULTY 2 */}
    <div className="group text-center">

      <img
        src="/faculty2.png"
        className="
          w-14 h-14 mx-auto
          rounded-full border border-white/20
          shadow-md
          group-hover:shadow-pink-500/30
          transition
        "
      />

      <p className="mt-2 text-sm font-medium text-white group-hover:text-pink-300 transition">
        Cyber Security Club
      </p>

    </div>

    {/* FACULTY 3 */}
    <div className="group text-center">

      <img
        src="/faculty3.png"
        className="
          w-14 h-14 mx-auto
          rounded-full border border-white/20
          shadow-md
          group-hover:shadow-indigo-500/30
          transition
        "
      />

      <p className="mt-2 text-sm font-medium text-white group-hover:text-indigo-300 transition">
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