"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function PhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function SharedLayout({ children }) {
  return (
    <div className="min-h-screen relative">
      {/* Background gradient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(45, 212, 191, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 bg-[#07070A]/80 backdrop-blur-xl border-b border-[#141418]"
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2DD4BF] to-[#0D9488] flex items-center justify-center">
              <PhoneIcon className="w-4 h-4 text-[#07070A]" />
            </div>
            <span className="text-[17px] font-bold tracking-[-0.01em] text-white">
              WePickUpThePhone
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-2.5 text-[11px] font-bold tracking-[0.08em] uppercase text-[#2DD4BF]/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-40" style={{ animation: "ring-pulse 2s ease-out infinite" }} />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DD4BF]" />
            </span>
            Live Demo
          </div>
        </div>
      </motion.header>

      {/* Main */}
      <main className="relative z-10 px-6 py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="relative z-10 border-t border-[#111116] mt-20"
      >
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#2A2A30]">WePickUpThePhone</span>
          <span className="text-[11px] text-[#2A2A30] font-medium">AI-powered. Human-quality. Always on.</span>
        </div>
      </motion.footer>
    </div>
  );
}
