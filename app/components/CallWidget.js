"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AudioVisualizer from "./AudioVisualizer";

const CREATE_CALL_TIMEOUT_MS = 10000;
const retellClientModulePromise = import("retell-client-js-sdk");

// ─── Icons ───
function PhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PhoneOffIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
      <line x1="23" y1="1" x2="1" y2="23" />
    </svg>
  );
}

function MicIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );
}

function MicOffIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
    </svg>
  );
}

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11.5 14.5 15.5 10" />
    </svg>
  );
}

export default function CallWidget({ agentId, businessName, vertical, title, description, sampleQuestions = [], extraVariables = {}, onCallEnded = null }) {
  const [callState, setCallState] = useState("idle");
  const [isAgentTalking, setIsAgentTalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState(null);
  const retellClientRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const createCallAbortRef = useRef(null);
  const isMountedRef = useRef(true);
  const transcriptSignatureRef = useRef("");

  const stopAndResetClient = useCallback(() => {
    if (retellClientRef.current) {
      try { retellClientRef.current.stopCall(); } catch {}
      retellClientRef.current = null;
    }
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  useEffect(() => {
    if (callState === "active") {
      timerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [callState]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearInterval(timerRef.current);
      createCallAbortRef.current?.abort();
      stopAndResetClient();
    };
  }, [stopAndResetClient]);

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const startCall = useCallback(async () => {
    if (callState === "connecting" || callState === "active") return;

    setError(null);
    setCallState("connecting");
    setTranscript([]);
    setCallDuration(0);
    setIsMuted(false);
    transcriptSignatureRef.current = "";

    try {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch {
        setError("Microphone access denied. Please allow mic access in your browser.");
        setCallState("idle");
        return;
      }

      stopAndResetClient();

      const { RetellWebClient } = await retellClientModulePromise;
      const client = new RetellWebClient();
      retellClientRef.current = client;

      const controller = new AbortController();
      createCallAbortRef.current = controller;
      const timeout = setTimeout(() => controller.abort(), CREATE_CALL_TIMEOUT_MS);

      const response = await fetch("/api/create-web-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: agentId,
          business_name: businessName,
          vertical: vertical,
          extra_variables: extraVariables,
        }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!response.ok) throw new Error("Failed to create web call");
      const data = await response.json();

      client.on("call_started", () => setCallState("active"));
      client.on("call_ended", () => {
        setCallState("ended");
        setIsAgentTalking(false);
        setIsMuted(false);
        retellClientRef.current = null;
        if (onCallEnded) {
          const currentTranscript = transcriptSignatureRef.current
            .split("|")
            .map((t) => { const [role, ...rest] = t.split(":"); return { role, content: rest.join(":") }; })
            .filter((t) => t.content);
          onCallEnded(currentTranscript);
        }
      });
      client.on("agent_start_talking", () => setIsAgentTalking(true));
      client.on("agent_stop_talking", () => setIsAgentTalking(false));
      client.on("update", (update) => {
        if (update.transcript) {
          const nextTranscript = update.transcript.map((t) => ({ role: t.role, content: t.content }));
          const nextSignature = nextTranscript.map((t) => `${t.role}:${t.content}`).join("|");
          if (nextSignature !== transcriptSignatureRef.current) {
            transcriptSignatureRef.current = nextSignature;
            setTranscript(nextTranscript);
          }
        }
      });
      client.on("error", () => {
        setError("Connection lost. Please try again.");
        setCallState("idle");
        setIsMuted(false);
        retellClientRef.current = null;
      });

      await client.startCall({ accessToken: data.access_token, sampleRate: 24000 });
    } catch (err) {
      if (!isMountedRef.current) return;
      const isAbortError = err?.name === "AbortError";
      setError(isAbortError ? "Connection timed out." : "Unable to start call.");
      setCallState("idle");
      setIsMuted(false);
      stopAndResetClient();
    } finally {
      createCallAbortRef.current = null;
    }
  }, [agentId, businessName, vertical, callState, stopAndResetClient]);

  const endCall = useCallback(() => {
    stopAndResetClient();
    setCallState("ended");
    setIsAgentTalking(false);
    setIsMuted(false);
  }, [stopAndResetClient]);

  const toggleMute = useCallback(() => {
    if (retellClientRef.current) {
      setIsMuted((prev) => {
        if (prev) retellClientRef.current.unmute();
        else retellClientRef.current.mute();
        return !prev;
      });
    }
  }, []);

  const resetCall = useCallback(() => {
    setCallState("idle");
    setTranscript([]);
    setCallDuration(0);
    setError(null);
    setIsAgentTalking(false);
    setIsMuted(false);
  }, []);

  return (
    <div className="bg-[#0E0E12] rounded-2xl border border-[#1A1A1F] overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-[#222228]">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-[#141418] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-[6px] h-[6px] rounded-full transition-all duration-500 ${
            callState === "active"
              ? "bg-[#2DD4BF] shadow-[0_0_8px_rgba(45,212,191,0.5)]"
              : callState === "connecting"
              ? "bg-[#2DD4BF]"
              : "bg-[#333338]"
          }`} style={callState === "connecting" ? { animation: "pulse-dot 1.2s ease-in-out infinite" } : undefined} />
          <span className="text-[12px] font-semibold text-[#555] tracking-wide">
            {callState === "idle" && "Ready"}
            {callState === "connecting" && "Connecting\u2026"}
            {callState === "active" && formatDuration(callDuration)}
            {callState === "ended" && formatDuration(callDuration)}
          </span>
        </div>
        {callState === "active" && (
          <button onClick={toggleMute} className="p-1.5 rounded-lg hover:bg-[#1A1A1F] transition-colors" aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? <MicOffIcon className="w-4 h-4 text-red-400" /> : <MicIcon className="w-4 h-4 text-[#555]" />}
          </button>
        )}
      </div>

      {/* Call Area */}
      <div className="px-6 py-10 flex flex-col items-center justify-center flex-grow min-h-[420px]">

        {/* ── IDLE ── */}
        {callState === "idle" && (
          <div className="text-center space-y-8 animate-scale-in">
            {/* Phone icon with glow rings */}
            <div className="relative flex items-center justify-center mx-auto w-28 h-28">
              <div className="absolute inset-0 rounded-full bg-[#2DD4BF]/[0.06]" style={{ animation: "ring-pulse 3s ease-out infinite" }} />
              <div className="absolute inset-0 rounded-full bg-[#2DD4BF]/[0.06]" style={{ animation: "ring-pulse 3s ease-out infinite 1.5s" }} />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2DD4BF]/10 to-[#0D9488]/5 border border-[#2DD4BF]/15 flex items-center justify-center relative">
                <PhoneIcon className="w-7 h-7 text-[#2DD4BF]" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[18px] font-bold text-white">{title}</h3>
              <p className="text-[13px] text-[#6B6B76] max-w-[280px] mx-auto leading-relaxed font-medium">{description}</p>
            </div>

            <button
              onClick={startCall}
              className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-[#07070A] font-bold text-[14px] hover:shadow-[0_0_30px_rgba(45,212,191,0.2)] transition-all duration-300 active:scale-[0.97]"
            >
              <span className="flex items-center gap-2.5">
                <PhoneIcon className="w-4 h-4" />
                Start Live Call
              </span>
            </button>

            {sampleQuestions.length > 0 && (
              <div className="pt-1 space-y-1.5 max-w-[280px] mx-auto">
                {sampleQuestions.slice(0, 3).map((q, i) => (
                  <p key={i} className="text-[11px] text-[#333] italic font-medium text-center">
                    &ldquo;{q}&rdquo;
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CONNECTING ── */}
        {callState === "connecting" && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-6 h-6 border-2 border-[#1A1A1F] border-t-[#2DD4BF] rounded-full mx-auto" style={{ animation: "spin 0.8s linear infinite" }} />
            <div className="space-y-1.5">
              <p className="text-[16px] font-bold text-white">Connecting</p>
              <p className="text-[13px] text-[#555] font-medium">Setting up secure voice channel</p>
            </div>
          </div>
        )}

        {/* ── ACTIVE ── */}
        {callState === "active" && (
          <div className="w-full space-y-6 animate-fade-in">
            <div className="flex flex-col items-center gap-2">
              <AudioVisualizer isAgentTalking={isAgentTalking} />
              <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#555]">
                {isAgentTalking ? "Speaking" : "Listening"}
              </p>
            </div>

            {transcript.length > 0 && (
              <div className="bg-[#0A0A0D] rounded-xl border border-[#141418] max-h-[200px] overflow-y-auto transcript-scroll p-4 space-y-2.5 mx-2">
                {transcript.map((entry, i) => (
                  <div key={i} className={`flex ${entry.role === "agent" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-[12px] leading-relaxed font-medium ${
                      entry.role === "agent"
                        ? "bg-[#2DD4BF]/[0.08] text-[#D0D0D8] border border-[#2DD4BF]/10"
                        : "bg-[#141418] text-[#A0A0AB] border border-[#1A1A1F]"
                    }`}>
                      {entry.content}
                    </div>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button onClick={endCall} className="px-6 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[13px] hover:bg-red-500/15 transition-colors active:scale-[0.97]">
                <span className="flex items-center gap-2">
                  <PhoneOffIcon className="w-4 h-4" />
                  End Call
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ── ENDED ── */}
        {callState === "ended" && (
          <div className="text-center space-y-8 animate-scale-in">
            <CheckCircleIcon className="w-14 h-14 text-[#2DD4BF] mx-auto" />

            <div className="space-y-2">
              <h3 className="text-[22px] font-extrabold text-white">Impressed?</h3>
              <p className="text-[13px] text-[#6B6B76] px-4 max-w-sm mx-auto leading-relaxed font-medium">
                This AI receptionist can be fully customized for your business and deployed in days.
              </p>
            </div>

            <button onClick={resetCall} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#2DD4BF] to-[#0D9488] text-[#07070A] font-bold text-[14px] hover:shadow-[0_0_30px_rgba(45,212,191,0.2)] transition-all mx-auto">
              Try Again
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center animate-shake">
            <p className="text-[12px] text-red-400 font-medium">{error}</p>
            <button onClick={resetCall} className="mt-2 text-[12px] text-[#2DD4BF] font-bold hover:underline">Try again</button>
          </div>
        )}
      </div>
    </div>
  );
}
