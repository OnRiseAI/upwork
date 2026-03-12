"use client";

import { useState, useEffect } from "react";

const STATIC_HEIGHTS = [6, 6, 6, 6, 6];

export default function AudioVisualizer({ isAgentTalking }) {
  const [heights, setHeights] = useState(STATIC_HEIGHTS);

  useEffect(() => {
    if (!isAgentTalking) return;
    const interval = setInterval(() => {
      setHeights(Array.from({ length: 5 }, () => 6 + Math.random() * 28));
    }, 120);
    return () => clearInterval(interval);
  }, [isAgentTalking]);

  return (
    <div className="flex items-center justify-center gap-[4px] h-10">
      {(isAgentTalking ? heights : STATIC_HEIGHTS).map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-all duration-100"
          style={{
            height: `${h}px`,
            backgroundColor: isAgentTalking ? "#0D9488" : "#D1D5DB",
          }}
        />
      ))}
    </div>
  );
}
