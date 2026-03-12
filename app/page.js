"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { VERTICALS, VERTICAL_KEYS } from "./lib/verticals";

// ─── Vertical icons ───
const VERTICAL_ICONS = {
  scale: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v18" strokeLinecap="round" /><path d="M1 7l5-4 5 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 7l5-4 5 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 7c0 3 2.5 5 5 5s5-2 5-5" /><path d="M13 7c0 3 2.5 5 5 5s5-2 5-5" />
    </svg>
  ),
  building: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
      <path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" />
      <path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
    </svg>
  ),
  utensils: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  ),
  tooth: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5.5C10 3 7.5 2 5.5 3S2 6.5 3 9c1.5 4 2 6 3 9s2 4 3.5 4S12 20 12 17" />
      <path d="M12 5.5C14 3 16.5 2 18.5 3S22 6.5 21 9c-1.5 4-2 6-3 9s-2 4-3.5 4S12 20 12 17" />
    </svg>
  ),
  paw: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="4" cy="8" r="2" />
      <circle cx="8" cy="8" r="2" /><circle cx="14" cy="8" r="2" />
      <path d="M10 17c.6-1.7 1.8-3 3-3s2.4 1.3 3 3c.7 2-1 4-3 4s-3.7-2-3-4z" />
    </svg>
  ),
  wrench: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  key: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  scissors: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  ),
  bed: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" />
      <path d="M6 8v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

// ─── Framer Motion variants ───
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <motion.div
        className="mb-16"
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        <motion.h1
          variants={fadeUp}
          className="text-[clamp(2.8rem,6vw,4.5rem)] font-extrabold tracking-[-0.035em] leading-[1.02] text-white"
        >
          Try it <span className="text-[#2DD4BF]">live.</span>
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-6 text-[17px] text-[#6B6B76] max-w-lg leading-relaxed font-medium"
        >
          Pick an industry, then call our AI receptionist from your browser. It answers in under a second.
        </motion.p>
      </motion.div>

      {/* Vertical grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        {VERTICAL_KEYS.map((key) => {
          const v = VERTICALS[key];
          return (
            <motion.div key={key} variants={cardVariant} whileHover={{ y: -4, transition: { duration: 0.2 } }} whileTap={{ scale: 0.98 }}>
              <Link
                href={`/${key}`}
                className="card-glow group block text-left p-5 pb-6 rounded-2xl border border-[#1A1A1F] bg-[#0E0E12] hover:border-[#2DD4BF]/20 hover:bg-[#111116] transition-colors duration-300"
              >
                <div className="w-9 h-9 rounded-xl bg-[#2DD4BF]/[0.07] border border-[#2DD4BF]/[0.1] flex items-center justify-center text-[#555] group-hover:text-[#2DD4BF] group-hover:border-[#2DD4BF]/20 transition-all duration-300 mb-4">
                  {VERTICAL_ICONS[v.icon] || VERTICAL_ICONS.building}
                </div>
                <span className="block text-[14px] font-semibold text-[#A0A0AB] group-hover:text-white transition-colors duration-300">
                  {v.label}
                </span>
                <span className="block text-[11px] text-[#44444D] group-hover:text-[#6B6B76] mt-1.5 leading-relaxed transition-colors duration-300">
                  {v.description.split(' — ')[1] || v.description.substring(0, 50)}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}
