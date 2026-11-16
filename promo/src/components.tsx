import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, useC } from "./theme";

export const Bg: React.FC<{ children?: React.ReactNode; glow?: boolean }> = ({ children, glow = true }) => {
  const c = useC();
  return (
    <AbsoluteFill style={{ background: c.bg, fontFamily: FONT, color: c.text, overflow: "hidden" }}>
      {glow && <AbsoluteFill style={{ background: c.glow }} />}
      {children}
    </AbsoluteFill>
  );
};

export const Caption: React.FC<{ text: string; at?: number; size?: number; bottom?: number }> = ({ text, at = 0, size = 56, bottom = 120 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 200 } });
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        textAlign: "center",
        fontSize: size,
        fontWeight: 700,
        letterSpacing: -1,
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
      }}
    >
      {text}
    </div>
  );
};

/** The real Cliply floating button, scaled. */
export const CliplyButton: React.FC<{ size?: number; style?: React.CSSProperties; pressed?: number }> = ({ size = 96, style, pressed = 0 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.92)",
      boxShadow: `0 ${size / 8}px ${size / 3}px rgba(0,0,0,0.22), 0 0 0 ${size / 48}px rgba(0,0,0,0.06)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${1 - pressed * 0.12})`,
      ...style,
    }}
  >
    <Img src={staticFile("icon.svg")} style={{ width: size * 0.78, height: size * 0.78 }} />
  </div>
);

export const Cursor: React.FC<{ x: number; y: number; click?: number; scale?: number }> = ({ x, y, click = 0, scale = 1.6 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${scale * (1 - click * 0.15)})`, transformOrigin: "top left", zIndex: 50 }}>
    <svg width="28" height="36" viewBox="0 0 28 36">
      <path d="M2 2 L2 28 L8.5 22 L13 33 L18 31 L13.5 20.5 L22 20 Z" fill="#fff" stroke="#111" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  </div>
);

/** Real Cliply panel look: glass, 16px radius, header with + New, clip rows. */
export const Panel: React.FC<{ clips: string[]; activeIndex?: number; width?: number; scale?: number; style?: React.CSSProperties }> = ({
  clips,
  activeIndex = -1,
  width = 320,
  scale = 1.6,
  style,
}) => (
  <div
    style={{
      width,
      background: C.glass,
      borderRadius: 16,
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      color: "#333",
      fontSize: 14,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      overflow: "hidden",
      ...style,
    }}
  >
    <div style={{ padding: 16, borderBottom: "1px solid rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>Quick Access Clips</div>
      <div style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "6px 16px", fontWeight: 500, color: "#424242" }}>+ New</div>
    </div>
    <div style={{ padding: 16 }}>
      {clips.map((t, i) => (
        <div
          key={i}
          style={{
            background: i === activeIndex ? C.yellow : "rgba(255,255,255,0.7)",
            color: i === activeIndex ? "#000" : "#333",
            borderRadius: 12,
            padding: 12,
            marginBottom: i === clips.length - 1 ? 0 : 12,
            border: "1px solid rgba(0,0,0,0.1)",
            fontSize: 16,
            lineHeight: 1.5,
            transform: i === activeIndex ? "translateY(-4px)" : "none",
            boxShadow: i === activeIndex ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
          }}
        >
          {t}
        </div>
      ))}
    </div>
  </div>
);

export const Toast: React.FC<{ text: string; at: number; scale?: number }> = ({ text, at, scale = 1.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 160 } });
  if (frame < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24 * scale,
        right: 24 * scale,
        background: C.green,
        color: "#fff",
        padding: `${12 * scale}px ${24 * scale}px`,
        borderRadius: 8 * scale,
        fontSize: 14 * scale,
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        opacity: 0.95 * p,
        transform: `translateY(${(1 - p) * 60}px)`,
      }}
    >
      {text}
    </div>
  );
};

/** Typewriter: returns the substring visible at this frame. */
export const typed = (text: string, frame: number, start: number, charsPerFrame: number) => {
  const n = Math.max(0, Math.floor((frame - start) * charsPerFrame));
  return text.slice(0, Math.min(text.length, n));
};

export const Caret: React.FC<{ color?: string; height?: number }> = ({ color = C.blue, height = 1 }) => {
  const frame = useCurrentFrame();
  return <span style={{ display: "inline-block", width: 3, height: `${height}em`, background: color, marginLeft: 2, verticalAlign: "-0.15em", opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0 }} />;
};

export const fadeOut = (frame: number, durationInFrames: number, len = 12) =>
  interpolate(frame, [durationInFrames - len, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
