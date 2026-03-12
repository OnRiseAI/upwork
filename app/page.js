"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CallWidget from "./components/CallWidget";
import Penny from "./components/Penny";
import { VERTICALS, VERTICAL_KEYS, getVertical, getAgentId } from "./lib/verticals";

// ─── Icons ───
function PhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

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

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ─── Vertical icons ───
const VERTICAL_ICONS = {
  scale: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v18" strokeLinecap="round" /><path d="M1 7l5-4 5 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 7l5-4 5 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 7c0 3 2.5 5 5 5s5-2 5-5" /><path d="M13 7c0 3 2.5 5 5 5s5-2 5-5" />
    </svg>
  ),
  building: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
      <path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" />
      <path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
    </svg>
  ),
  utensils: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  ),
  tooth: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5.5C10 3 7.5 2 5.5 3S2 6.5 3 9c1.5 4 2 6 3 9s2 4 3.5 4S12 20 12 17" />
      <path d="M12 5.5C14 3 16.5 2 18.5 3S22 6.5 21 9c-1.5 4-2 6-3 9s-2 4-3.5 4S12 20 12 17" />
    </svg>
  ),
  paw: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="4" cy="8" r="2" />
      <circle cx="8" cy="8" r="2" /><circle cx="14" cy="8" r="2" />
      <path d="M10 17c.6-1.7 1.8-3 3-3s2.4 1.3 3 3c.7 2-1 4-3 4s-3.7-2-3-4z" />
    </svg>
  ),
  wrench: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  key: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  shield: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  scissors: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  ),
  bed: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" />
      <path d="M6 8v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

function HomeContent() {
  const searchParams = useSearchParams();
  const verticalParam = searchParams.get("vertical");
  const nameParam = searchParams.get("name");

  const [selectedVertical, setSelectedVertical] = useState(verticalParam || null);
  const [selectedSubVertical, setSelectedSubVertical] = useState(null);

  useEffect(() => {
    if (verticalParam && getVertical(verticalParam)) {
      setSelectedVertical(verticalParam);
    }
  }, [verticalParam]);

  const vertical = selectedVertical ? getVertical(selectedVertical) : null;

  const activeConfig = (vertical?.subVerticals && selectedSubVertical && vertical.subVerticals[selectedSubVertical])
    ? vertical.subVerticals[selectedSubVertical]
    : vertical;

  const defaultName = nameParam || (activeConfig ? activeConfig.defaultName : "");
  const [businessName, setBusinessName] = useState(defaultName);

  useEffect(() => {
    const name = nameParam || (activeConfig ? activeConfig.defaultName : "");
    setBusinessName(name);
  }, [selectedVertical, selectedSubVertical, nameParam, activeConfig]);

  useEffect(() => {
    setSelectedSubVertical(null);
  }, [selectedVertical]);

  // ── Vertical picker ──
  if (!vertical) {
    return (
      <div className="max-w-3xl mx-auto text-center">
        <div className="space-y-4 mb-12 animate-float-in">
          <div className="flex justify-center mb-6">
            <Penny pose="waving" size={140} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-[#1A1A1A]">
            Pick an industry to demo
          </h1>
          <p className="font-body text-[15px] text-[#6B7280] max-w-md mx-auto">
            Each AI receptionist is pre-trained for its vertical. Pick one and talk to it live.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VERTICAL_KEYS.map((key) => {
            const v = VERTICALS[key];
            return (
              <button
                key={key}
                onClick={() => setSelectedVertical(key)}
                className="group bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:border-[#0D9488]/30 hover:shadow-sm transition-all duration-300 text-left space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0D9488]">
                    {VERTICAL_ICONS[v.icon] || VERTICAL_ICONS.building}
                  </div>
                  <ArrowRightIcon className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#0D9488] transition-all group-hover:translate-x-0.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-body text-[15px] font-medium text-[#1A1A1A]">{v.label}</h3>
                  <p className="font-body text-[12px] text-[#9CA3AF] leading-relaxed">{v.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Demo experience ──
  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left column */}
      <div className="lg:col-span-5 space-y-7 animate-float-in">
        <div className="space-y-5">
          <button
            onClick={() => setSelectedVertical(null)}
            className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors font-body text-[13px] group"
          >
            <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Change industry
          </button>

          {/* Industry tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDFA] border border-[#CCFBF1]">
            <div className="text-[#0D9488]">
              {VERTICAL_ICONS[vertical.icon] || VERTICAL_ICONS.building}
            </div>
            <span className="font-body text-[11px] font-medium text-[#0D9488] tracking-wide uppercase">
              {vertical.label}{selectedSubVertical && vertical.subVerticals?.[selectedSubVertical] ? ` \u2014 ${vertical.subVerticals[selectedSubVertical].label}` : ""}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl md:text-[2.4rem] leading-[1.1] text-[#1A1A1A]">
              Meet your AI receptionist
            </h1>
            <p className="font-body text-[15px] text-[#6B7280] max-w-md leading-relaxed">
              Enter your business name below — the AI will greet callers as your receptionist.
            </p>
          </div>
        </div>

        {/* Sub-vertical picker */}
        {vertical.subVerticals && (
          <div className="space-y-2">
            <p className="font-body text-[12px] font-medium text-[#0D9488] tracking-wide uppercase">What type of service?</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(vertical.subVerticals).map(([subKey, sub]) => (
                <button
                  key={subKey}
                  onClick={() => setSelectedSubVertical(selectedSubVertical === subKey ? null : subKey)}
                  className={`px-3.5 py-2 rounded-xl border font-body text-[12px] font-medium transition-all ${
                    selectedSubVertical === subKey
                      ? "border-[#0D9488] bg-[#F0FDFA] text-[#0D9488]"
                      : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#0D9488]/30 hover:text-[#0D9488]"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Business name input */}
        <div className="space-y-2">
          <label htmlFor="business-name" className="font-body text-[12px] font-medium text-[#0D9488] tracking-wide uppercase">
            Your Business Name
          </label>
          <div className="relative">
            <input
              id="business-name"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Smith & Associates Law"
              className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white font-body text-[15px] text-[#1A1A1A] placeholder:text-[#D1D5DB] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/20 transition-all"
            />
            <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0D9488] text-white font-body text-[10px] font-medium tracking-wide shadow-sm pointer-events-none">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
              Try yours
            </div>
          </div>
          <p className="font-body text-[11px] text-[#9CA3AF]">
            The AI will greet callers using this name
          </p>
        </div>

        {/* Desktop: capabilities, questions, other verticals */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-3">
            <p className="font-body text-[12px] font-medium text-[#6B7280] tracking-wide uppercase">Capabilities</p>
            <div className="space-y-2">
              {activeConfig.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-[#F3F4F6]">
                  <CheckIcon className="w-4 h-4 text-[#0D9488] flex-shrink-0" />
                  <span className="font-body text-[13px] text-[#6B7280]">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-body text-[12px] font-medium text-[#6B7280] tracking-wide uppercase">Try asking</p>
            <div className="space-y-2">
              {activeConfig.sampleQuestions.map((q, i) => (
                <div key={i} className="px-4 py-2.5 rounded-xl bg-white border border-[#F3F4F6] font-body text-[12px] text-[#9CA3AF] italic">
                  &ldquo;{q}&rdquo;
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <p className="font-body text-[12px] font-medium text-[#9CA3AF] tracking-wide uppercase">Other industries</p>
            <div className="flex flex-wrap gap-2">
              {VERTICAL_KEYS.filter((k) => k !== selectedVertical).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedVertical(key)}
                  className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#0D9488]/30 hover:text-[#0D9488] font-body text-[11px] text-[#9CA3AF] transition-all"
                >
                  {VERTICALS[key].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call Widget */}
      <div className="lg:col-span-7 lg:sticky lg:top-24 animate-float-in stagger-2">
        <CallWidget
          agentId={getAgentId(selectedVertical, selectedSubVertical)}
          businessName={businessName}
          vertical={selectedVertical}
          title={businessName}
          description={activeConfig.description}
          sampleQuestions={activeConfig.sampleQuestions}
        />
      </div>

      {/* Mobile: capabilities, questions, other verticals below widget */}
      <div className="lg:hidden space-y-8">
        <div className="space-y-3">
          <p className="font-body text-[12px] font-medium text-[#6B7280] tracking-wide uppercase">Capabilities</p>
          <div className="space-y-2">
            {activeConfig.capabilities.map((cap, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-[#F3F4F6]">
                <CheckIcon className="w-4 h-4 text-[#0D9488] flex-shrink-0" />
                <span className="font-body text-[13px] text-[#6B7280]">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-body text-[12px] font-medium text-[#6B7280] tracking-wide uppercase">Try asking</p>
          <div className="space-y-2">
            {activeConfig.sampleQuestions.map((q, i) => (
              <div key={i} className="px-4 py-2.5 rounded-xl bg-white border border-[#F3F4F6] font-body text-[12px] text-[#9CA3AF] italic">
                &ldquo;{q}&rdquo;
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <p className="font-body text-[12px] font-medium text-[#9CA3AF] tracking-wide uppercase">Other industries</p>
          <div className="flex flex-wrap gap-2">
            {VERTICAL_KEYS.filter((k) => k !== selectedVertical).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedVertical(key)}
                className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#0D9488]/30 hover:text-[#0D9488] font-body text-[11px] text-[#9CA3AF] transition-all"
              >
                {VERTICALS[key].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen font-body bg-[#FAFAF9]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center">
              <PhoneIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-[19px] text-[#1A1A1A]">WePickUpThePhone</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDFA] border border-[#CCFBF1]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{ animation: "pulse-soft 2s ease-in-out infinite" }} />
            <span className="font-body text-[11px] text-[#0D9488] font-medium tracking-wide">Live Demo</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
        <Suspense fallback={
          <div className="text-center py-24">
            <div className="inline-block w-6 h-6 border-2 border-[#E5E7EB] border-t-[#0D9488] rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
          </div>
        }>
          <HomeContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] mt-16 bg-[#FAFAF9]">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#0D9488] flex items-center justify-center">
              <PhoneIcon className="w-3 h-3 text-white" />
            </div>
            <span className="font-display text-sm text-[#1A1A1A]">WePickUpThePhone</span>
          </div>
          <p className="font-body text-xs text-[#9CA3AF]">AI-powered. Human-quality. Always on.</p>
        </div>
      </footer>
    </div>
  );
}
