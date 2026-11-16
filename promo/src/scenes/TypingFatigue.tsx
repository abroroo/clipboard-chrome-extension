import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, random } from "remotion";
import { Bg, Caption, Caret, fadeOut, typed } from "../components";
import { ADDRESS, C } from "../theme";

/**
 * 0–9s. The same address typed over and over.
 * Each repeat: bigger, faster, shakier. A counter climbs.
 */
const REPEATS = [
  { start: 10, cpf: 0.55, scale: 1.0 },
  { start: 70, cpf: 0.8, scale: 1.18 },
  { start: 112, cpf: 1.1, scale: 1.4 },
  { start: 145, cpf: 1.6, scale: 1.7 },
  { start: 170, cpf: 2.4, scale: 2.1 },
  { start: 190, cpf: 3.4, scale: 2.6 },
  { start: 206, cpf: 5, scale: 2.95 },
  { start: 220, cpf: 8, scale: 3.2 },
  { start: 232, cpf: 12, scale: 3.4 },
];

export const TypingFatigue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const activeIdx = Math.max(0, REPEATS.findIndex((r, i) => frame >= r.start && (i === REPEATS.length - 1 || frame < REPEATS[i + 1].start)));
  const r = REPEATS[activeIdx];
  const text = typed(ADDRESS, frame, r.start, r.cpf);

  // stress ramps up with each repeat
  const stress = interpolate(activeIdx, [0, REPEATS.length - 1], [0, 1]);
  const shakeX = stress * 10 * (random(`sx${frame}`) - 0.5);
  const shakeY = stress * 8 * (random(`sy${frame}`) - 0.5);
  const scaleIn = spring({ frame: frame - r.start, fps, config: { damping: 18, stiffness: 180 } });
  const scale = r.scale * (0.96 + 0.04 * scaleIn);

  // counter: fake "typed N times" ticking up with the stress
  const count = Math.round(interpolate(frame, [0, 60, 150, 240], [1, 3, 19, 47], { extrapolateRight: "clamp" }));
  const counterIn = spring({ frame: frame - 60, fps, config: { damping: 200 } });

  // ghost trail of previous repeats, faded
  const ghosts = REPEATS.slice(Math.max(0, activeIdx - 3), activeIdx);

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: fadeOut(frame, durationInFrames, 6) }}>
        {/* ghosts */}
        {ghosts.map((g, i) => (
          <AbsoluteFill key={g.start} style={{ justifyContent: "center", alignItems: "center", opacity: 0.08 + i * 0.05 }}>
            <div style={{ fontSize: 40 * g.scale, fontWeight: 700, letterSpacing: -1, whiteSpace: "nowrap", color: C.text }}>{ADDRESS}</div>
          </AbsoluteFill>
        ))}

        {/* the input field */}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              transform: `translate(${shakeX}px, ${shakeY}px) scale(${scale})`,
              background: C.bg2,
              border: `2px solid ${interpolate(stress, [0, 1], [0, 1]) > 0.6 ? C.red : "rgba(255,255,255,0.12)"}`,
              borderRadius: 14,
              padding: "18px 26px",
              minWidth: 520,
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: -0.5,
              whiteSpace: "nowrap",
              boxShadow: `0 0 ${40 + stress * 120}px rgba(239,68,68,${stress * 0.35})`,
            }}
          >
            {text.length === 0 ? <span style={{ color: C.muted }}>Address</span> : text}
            <Caret color={stress > 0.6 ? C.red : C.blue} />
          </div>
        </AbsoluteFill>

        {/* counter */}
        <div
          style={{
            position: "absolute",
            top: 72,
            right: 96,
            opacity: counterIn,
            transform: `translateY(${(1 - counterIn) * -16}px)`,
            fontSize: 30,
            fontWeight: 600,
            color: stress > 0.6 ? C.red : C.muted,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          Typed <span style={{ color: C.text, fontWeight: 800 }}>{count}</span> times
        </div>

        {frame < 100 ? <Caption text="Typing this again?" at={30} /> : <Caption text="And again..." at={100} />}
      </AbsoluteFill>
    </Bg>
  );
};
