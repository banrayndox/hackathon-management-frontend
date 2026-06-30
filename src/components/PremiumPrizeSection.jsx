import React from 'react';
import { FaTrophy, FaAward, FaCrown, FaLightbulb, FaCode } from 'react-icons/fa';

export default function PremiumPrizeSection() {
  return (
    <section className="px-4 sm:px-6 md:px-10 mt-20 max-w-5xl mx-auto">
      
      {/* Section Header to set the premium tone */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 bg-clip-text text-transparent">
           Hackathon
        </span>
        <h2 className="text-3xl font-black text-white mt-1 tracking-tight sm:text-4xl">
          Prize Pool
        </h2>
      </div>

      {/* Main Podiums (Top 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
        
        {/* 1st Runner-Up (Left) */}
        <div className="group relative order-2 sm:order-1 bg-gradient-to-b from-slate-500/15 via-slate-500/5 to-transparent border border-slate-500/30 p-8 rounded-2xl text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-400/50 hover:shadow-[0_0_30px_rgba(148,163,184,0.1)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-500/10 text-slate-300 ring-4 ring-slate-500/20 group-hover:scale-110 transition-transform">
            <FaAward size={28} />
          </div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">1st Runner-Up</h3>
          <p className="text-3xl font-black bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent mt-2 font-mono tracking-tight">
            30,000 BDT
          </p>
        </div>

        {/* Champion (Center - Tallest & Most Glow) */}
        <div className="group relative order-1 sm:order-2 bg-gradient-to-b from-amber-500/25 via-amber-500/5 to-transparent border-2 border-amber-500/50 p-10 rounded-2xl text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] sm:min-h-[250px] flex flex-col justify-center">
          {/* Top Hot Badge */}
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-lg animate-pulse">
            Grand Prize
          </span>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-4 ring-amber-500/30 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <FaCrown size={32} className="animate-wiggle" />
          </div>
          <h3 className="text-amber-400 text-xs font-black uppercase tracking-[0.2em]">Champion</h3>
          <p className="text-4xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent mt-2 font-mono tracking-tight drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
            50,000 BDT
          </p>
        </div>

        {/* 2nd Runner-Up (Right) */}
        <div className="group relative order-3 bg-gradient-to-b from-amber-800/20 via-amber-800/5 to-transparent border border-amber-800/30 p-8 rounded-2xl text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-700/50 hover:shadow-[0_0_30px_rgba(180,83,9,0.1)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-800/10 text-amber-600 ring-4 ring-amber-800/20 group-hover:scale-110 transition-transform">
            <FaAward size={28} />
          </div>
          <h3 className="text-amber-600 text-xs font-bold uppercase tracking-widest">2nd Runner-Up</h3>
          <p className="text-3xl font-black bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent mt-2 font-mono tracking-tight">
            20,000 BDT
          </p>
        </div>

      </div>

      {/* Special Category Awards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        
        {/* Creative Award */}
        <div className="group flex items-center justify-between bg-gradient-to-r from-purple-950/40 to-transparent border border-purple-500/30 p-5 rounded-xl backdrop-blur-sm transition-all duration-200 hover:border-purple-500/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:text-purple-300">
              <FaLightbulb size={18} />
            </div>
            <span className="text-purple-200 text-xs sm:text-sm font-semibold tracking-wide">Special Creative Award</span>
          </div>
          <span className="font-mono text-white font-black text-sm sm:text-base tracking-tight bg-purple-500/10 px-3 py-1 rounded-md border border-purple-500/20">
            10,000 BDT
          </span>
        </div>

        {/* Technical Award */}
        <div className="group flex items-center justify-between bg-gradient-to-r from-cyan-950/40 to-transparent border border-cyan-500/30 p-5 rounded-xl backdrop-blur-sm transition-all duration-200 hover:border-cyan-500/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:text-cyan-300">
              <FaCode size={18} />
            </div>
            <span className="text-cyan-200 text-xs sm:text-sm font-semibold tracking-wide">Special Technical Award</span>
          </div>
          <span className="font-mono text-white font-black text-sm sm:text-base tracking-tight bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/20">
            10,000 BDT
          </span>
        </div>

      </div>
    </section>
  );
}