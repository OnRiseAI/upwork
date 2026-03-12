"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AudioVisualizer from "./AudioVisualizer";
import Penny from "./Penny";

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

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function CallWidget({ agentId, businessName, vertical, title, description, sampleQuestions = [] }) {
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
        setError("Microphone access denied. Please allow microphone access in your browser.");
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
      setError(isAbortError ? "Connection timed out. Please try again." : "Unable to start call. Please try again.");
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
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-[#0D9488]/20">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#F3F4F6] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
            callState === "active"
              ? "bg-emerald-500"
              : callState === "connecting"
              ? "bg-[#0D9488] animate-pulse"
              : "bg-[#D1D5DB]"
          }`} />
          <span className="font-body text-[13px] font-medium text-[#6B7280]">
            {callState === "idle" && "Ready to call"}
            {callState === "connecting" && "Connecting..."}
            {callState === "active" && `Live \u00B7 ${formatDuration(callDuration)}`}
            {callState === "ended" && `Ended \u00B7 ${formatDuration(callDuration)}`}
          </span>
        </div>
        {callState === "active" && (
          <button onClick={toggleMute} className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors" aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? <MicOffIcon className="w-4 h-4 text-red-500" /> : <MicIcon className="w-4 h-4 text-[#9CA3AF]" />}
          </button>
        )}
      </div>

      {/* Call Area */}
      <div className="px-6 py-10 flex flex-col items-center justify-center flex-grow min-h-[420px]">

        {/* ── IDLE ── */}
        {callState === "idle" && (
          <div className="text-center space-y-6 animate-scale-in">
            <div className="flex justify-center">
              <Penny pose="talking" size={120} />
            </div>
            <div className="space-y-2">
              <h3 className="font-body text-lg font-medium text-[#1A1A1A]">{title}</h3>
              <p className="font-body text-[13px] text-[#9CA3AF] max-w-[280px] mx-auto leading-relaxed">{description}</p>
            </div>
            <button
              onClick={startCall}
              className="group px-7 py-3.5 rounded-xl bg-[#0D9488] text-white font-body font-medium text-sm hover:bg-[#0F766E] transition-colors active:scale-[0.98]"
            >
              <span className="flex items-center gap-2.5">
                <PhoneIcon className="w-4 h-4" />
                Start Live Call
                <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
            {sampleQuestions.length > 0 && (
              <div className="pt-1 grid grid-cols-2 gap-2 max-w-[300px] mx-auto">
                {sampleQuestions.slice(0, 4).map((q, i) => (
                  <div key={i} className="px-2.5 py-1.5 rounded-lg border border-[#F3F4F6] bg-[#FAFAF9] text-[10px] text-[#9CA3AF] text-center italic">
                    &ldquo;{q}&rdquo;
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CONNECTING ── */}
        {callState === "connecting" && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <Penny pose="thinking" size={120} />
            </div>
            <div className="space-y-2">
              <p className="font-body text-base font-medium text-[#1A1A1A]">Connecting...</p>
              <p className="font-body text-[13px] text-[#9CA3AF]">Setting up secure voice channel</p>
            </div>
            <div className="w-6 h-6 border-2 border-[#E5E7EB] border-t-[#0D9488] rounded-full mx-auto" style={{ animation: "spin 0.8s linear infinite" }} />
          </div>
        )}

        {/* ── ACTIVE ── */}
        {callState === "active" && (
          <div className="w-full space-y-6 animate-fade-in">
            <div className="flex flex-col items-center gap-3">
              <div className={`relative transition-all duration-500 ${isAgentTalking ? "scale-105" : "scale-100"}`}>
                <Penny pose="talking" size={100} />
              </div>
              <AudioVisualizer isAgentTalking={isAgentTalking} />
              <p className="font-body text-[11px] font-medium tracking-wider uppercase text-[#9CA3AF]">
                {isAgentTalking ? "Penny is speaking" : "Listening..."}
              </p>
            </div>
            {transcript.length > 0 && (
              <div className="bg-[#FAFAF9] rounded-xl border border-[#F3F4F6] max-h-[180px] overflow-y-auto transcript-scroll p-4 space-y-3 mx-2">
                {transcript.map((entry, i) => (
                  <div key={i} className={`flex ${entry.role === "agent" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      entry.role === "agent"
                        ? "bg-[#F0FDFA] text-[#1A1A1A] border border-[#CCFBF1]"
                        : "bg-white text-[#4B5563] border border-[#E5E7EB]"
                    }`}>
                      {entry.content}
                    </div>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            )}
            <div className="flex justify-center pt-2">
              <button onClick={endCall} className="px-7 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-body font-medium text-sm hover:bg-red-100 transition-colors active:scale-[0.97]">
                <span className="flex items-center gap-2">
                  <PhoneOffIcon className="w-4 h-4" />
                  End Conversation
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ── ENDED ── */}
        {callState === "ended" && (
          <div className="text-center space-y-6 animate-scale-in">
            <div className="flex justify-center">
              <Penny pose="thumbsUp" size={120} />
            </div>
            <div className="space-y-2">
              <h3 className="font-body text-xl font-medium text-[#1A1A1A]">Impressed?</h3>
              <p className="font-body text-[13px] text-[#9CA3AF] px-4 max-w-sm mx-auto leading-relaxed">
                This AI receptionist can be customized for your business and deployed in days.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
              <button onClick={resetCall} className="flex-1 px-6 py-3.5 rounded-xl bg-[#0D9488] text-white font-body font-medium text-sm hover:bg-[#0F766E] transition-colors">
                Try Again
              </button>
              <a href={`mailto:jon@onrise.ai?subject=${encodeURIComponent(`AI Receptionist for ${businessName || "My Business"}`)}&body=${encodeURIComponent(`Hi Jon,\n\nI just tried the AI receptionist demo for "${businessName || "my business"}" (${vertical || "general"} vertical) and I'm interested in getting this set up.\n\nCan we schedule a quick call to discuss?\n\nThanks!`)}`} className="flex-1 px-6 py-3.5 rounded-xl border border-[#0D9488] text-[#0D9488] font-body font-medium text-sm hover:bg-[#F0FDFA] transition-colors text-center">
                Build This for Me
              </a>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 px-5 py-4 rounded-xl bg-red-50 border border-red-200 text-center animate-shake">
            <p className="font-body text-xs text-red-600">{error}</p>
            <button onClick={resetCall} className="mt-2 text-xs text-[#0D9488] font-medium hover:underline">Try again</button>
          </div>
        )}
      </div>
    </div>
  );
}
