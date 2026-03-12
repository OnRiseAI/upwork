"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import CallWidget from "./CallWidget";
import { VERTICALS, VERTICAL_KEYS, getVertical, getAgentId } from "../lib/verticals";

// ─── Icons ───
function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

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

const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function VerticalDemo({ verticalKey, nameParam }) {
  const vertical = getVertical(verticalKey);
  const [selectedSubVertical, setSelectedSubVertical] = useState(null);

  const activeConfig = (vertical?.subVerticals && selectedSubVertical && vertical.subVerticals[selectedSubVertical])
    ? vertical.subVerticals[selectedSubVertical]
    : vertical;

  const defaultName = nameParam || (activeConfig ? activeConfig.defaultName : "");
  const [businessName, setBusinessName] = useState(defaultName);

  useEffect(() => {
    const name = nameParam || (activeConfig ? activeConfig.defaultName : "");
    setBusinessName(name);
  }, [selectedSubVertical, nameParam, activeConfig]);

  if (!vertical) return null;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start"
    >
      {/* Left column */}
      <motion.div className="lg:col-span-5 space-y-8" variants={staggerContainer}>
        <motion.div variants={fadeUp}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#555] hover:text-[#AAA] transition-colors text-[13px] font-medium group"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            All industries
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-5">
          <div className="inline-flex items-center gap-2.5 text-[#2DD4BF]">
            {VERTICAL_ICONS[vertical.icon] || VERTICAL_ICONS.building}
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase">
              {vertical.label}{selectedSubVertical && vertical.subVerticals?.[selectedSubVertical] ? ` / ${vertical.subVerticals[selectedSubVertical].label}` : ""}
            </span>
          </div>

          <h1 className="text-[clamp(1.75rem,3.5vw,2.6rem)] font-extrabold tracking-[-0.025em] leading-[1.1] text-white">
            Your AI receptionist,
            <br />
            <span className="text-[#2DD4BF]">ready to talk.</span>
          </h1>
          <p className="text-[15px] text-[#6B6B76] leading-relaxed font-medium">
            Type your business name below — the AI greets callers as your front desk.
          </p>
        </motion.div>

        {/* Sub-vertical picker */}
        {vertical.subVerticals && (
          <motion.div variants={fadeUp} className="space-y-3">
            <p className="text-[11px] font-bold text-[#2DD4BF]/60 tracking-[0.12em] uppercase">Service type</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(vertical.subVerticals).map(([subKey, sub]) => (
                <motion.button
                  key={subKey}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedSubVertical(selectedSubVertical === subKey ? null : subKey)}
                  className={`px-3.5 py-2 rounded-lg border text-[12px] font-semibold transition-colors duration-200 ${
                    selectedSubVertical === subKey
                      ? "border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-[#2DD4BF]"
                      : "border-[#1A1A1F] bg-[#0E0E12] text-[#6B6B76] hover:border-[#2DD4BF]/20 hover:text-[#2DD4BF]"
                  }`}
                >
                  {sub.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Business name input */}
        <motion.div variants={fadeUp} className="space-y-2.5">
          <label htmlFor="business-name" className="text-[11px] font-bold text-[#2DD4BF]/60 tracking-[0.12em] uppercase">
            Business name
          </label>
          <div className="relative">
            <input
              id="business-name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Smith & Associates"
              className="w-full px-4 py-3.5 rounded-xl border border-[#1A1A1F] bg-[#0E0E12] text-[15px] text-white font-medium placeholder:text-[#333] focus:outline-none focus:border-[#2DD4BF]/40 focus:ring-2 focus:ring-[#2DD4BF]/10 transition-all"
            />
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: [0, -6, 0, -3, 0] }}
              transition={{
                opacity: { delay: 0.6, duration: 0.3 },
                y: { delay: 0.6, duration: 1.8, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" },
              }}
              className="absolute -top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2DD4BF] text-[#07070A] text-[10px] font-bold tracking-wide shadow-[0_0_12px_rgba(45,212,191,0.3)]"
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
              Try your business name
            </motion.div>
          </div>
          <p className="text-[11px] text-[#44444D] font-medium">The AI adapts its greeting instantly</p>
        </motion.div>

        {/* Desktop: capabilities + questions */}
        <div className="hidden lg:block space-y-8 pt-2">
          <motion.div variants={fadeUp} className="space-y-3">
            <p className="text-[11px] font-bold text-[#44444D] tracking-[0.12em] uppercase">Capabilities</p>
            <div className="space-y-1">
              {activeConfig.capabilities.map((cap, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 py-2.5 border-b border-[#111116]"
                >
                  <CheckIcon className="w-4 h-4 text-[#2DD4BF] flex-shrink-0" />
                  <span className="text-[13px] text-[#7A7A85] font-medium">{cap}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3">
            <p className="text-[11px] font-bold text-[#44444D] tracking-[0.12em] uppercase">Try asking</p>
            <div className="space-y-2">
              {activeConfig.sampleQuestions.map((q, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                  className="text-[12px] text-[#555] italic font-medium leading-relaxed"
                >
                  &ldquo;{q}&rdquo;
                </motion.p>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-3 pt-6 border-t border-[#111116]">
            <p className="text-[11px] font-bold text-[#333] tracking-[0.12em] uppercase">Other industries</p>
            <div className="flex flex-wrap gap-1.5">
              {VERTICAL_KEYS.filter((k) => k !== verticalKey).map((key) => (
                <motion.div key={key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={`/${key}`}
                    className="inline-block px-3 py-1.5 rounded-lg border border-[#1A1A1F] bg-[#0E0E12] hover:border-[#2DD4BF]/20 hover:text-[#2DD4BF] text-[11px] text-[#44444D] font-semibold transition-colors"
                  >
                    {VERTICALS[key].label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Call Widget */}
      <motion.div className="lg:col-span-7 lg:sticky lg:top-24" variants={slideInRight}>
        <CallWidget
          agentId={getAgentId(verticalKey, selectedSubVertical)}
          businessName={businessName}
          vertical={verticalKey}
          title={businessName}
          description={activeConfig.description}
          sampleQuestions={activeConfig.sampleQuestions}
        />
      </motion.div>

      {/* Mobile: capabilities + questions */}
      <motion.div variants={fadeUp} className="lg:hidden space-y-8">
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[#44444D] tracking-[0.12em] uppercase">Capabilities</p>
          <div className="space-y-1">
            {activeConfig.capabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#111116]">
                <CheckIcon className="w-4 h-4 text-[#2DD4BF] flex-shrink-0" />
                <span className="text-[13px] text-[#7A7A85] font-medium">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold text-[#44444D] tracking-[0.12em] uppercase">Try asking</p>
          <div className="space-y-2">
            {activeConfig.sampleQuestions.map((q, i) => (
              <p key={i} className="text-[12px] text-[#555] italic font-medium leading-relaxed">
                &ldquo;{q}&rdquo;
              </p>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t border-[#111116]">
          <p className="text-[11px] font-bold text-[#333] tracking-[0.12em] uppercase">Other industries</p>
          <div className="flex flex-wrap gap-1.5">
            {VERTICAL_KEYS.filter((k) => k !== verticalKey).map((key) => (
              <Link
                key={key}
                href={`/${key}`}
                className="px-3 py-1.5 rounded-lg border border-[#1A1A1F] bg-[#0E0E12] hover:border-[#2DD4BF]/20 hover:text-[#2DD4BF] text-[11px] text-[#44444D] font-semibold transition-all"
              >
                {VERTICALS[key].label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
