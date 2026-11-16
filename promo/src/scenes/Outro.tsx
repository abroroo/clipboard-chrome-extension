import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, CliplyButton } from "../components";
import { C } from "../theme";

/** 25–30s. Logo, name, tagline, Chrome CTA. */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const name = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const tag = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const cta = spring({ frame: frame - 32, fps, config: { damping: 14, stiffness: 150 } });
  const shine = interpolate(frame, [40, 80], [-300, 700], { extrapolateRight: "clamp" });

  return (
    <Bg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 0 }}>
        <div style={{ transform: `scale(${logo}) rotate(${(1 - logo) * -20}deg)` }}>
          <CliplyButton size={160} />
        </div>
        <div style={{ marginTop: 36, fontSize: 96, fontWeight: 800, letterSpacing: -3, opacity: name, transform: `translateY(${(1 - name) * 20}px)` }}>
          Cliply
        </div>
        <div style={{ marginTop: 6, fontSize: 40, fontWeight: 500, color: C.muted, opacity: tag, transform: `translateY(${(1 - tag) * 20}px)` }}>
          Save once. <span style={{ color: C.text }}>Paste anywhere.</span>
        </div>
        <div
          style={{
            marginTop: 54,
            position: "relative",
            overflow: "hidden",
            background: C.blue,
            color: "#fff",
            fontSize: 30,
            fontWeight: 700,
            padding: "20px 44px",
            borderRadius: 999,
            boxShadow: "0 20px 60px rgba(6,122,254,0.45)",
            opacity: cta,
            transform: `scale(${0.8 + 0.2 * cta})`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff" /><circle cx="12" cy="12" r="4" fill={C.blue} /><path d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5L4.6 5.1A10 10 0 0 1 12 2Z" fill="#EF4444" /><path d="M3.34 7A10 10 0 0 0 10.6 21.9L13.7 16.6A5 5 0 0 1 7.67 9.5L3.34 7Z" fill="#21BF73" /><path d="M20.66 7A10 10 0 0 1 12 22c-.47 0-.94 0-1.4-.1l3.1-5.3A5 5 0 0 0 16.33 9.5h4.33Z" fill="#FEB300" /></svg>
          Free on Chrome Web Store
          <div style={{ position: "absolute", top: 0, bottom: 0, left: shine, width: 120, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", transform: "skewX(-20deg)" }} />
        </div>
      </AbsoluteFill>
    </Bg>
  );
};
