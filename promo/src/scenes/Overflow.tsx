import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, random } from "remotion";
import { ADDRESS, C, FONT } from "../theme";

/**
 * 9–11s. Text floods the screen, then a hard cut to black. Silence.
 */
export const Overflow: React.FC = () => {
  const frame = useCurrentFrame();
  const CUT = 36; // frame where everything cuts to black
  const rows = 14;
  const zoom = interpolate(frame, [0, CUT], [1, 1.35], { extrapolateRight: "clamp" });
  const flash = interpolate(frame, [CUT - 3, CUT], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (frame >= CUT) {
    return <AbsoluteFill style={{ background: "#000" }} />;
  }

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, justifyContent: "center" }}>
        {Array.from({ length: rows }).map((_, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const speed = 6 + random(`row${i}`) * 10;
          const x = dir * frame * speed - 400;
          const visible = frame > i * 1.5;
          return (
            <div
              key={i}
              style={{
                whiteSpace: "nowrap",
                fontSize: 84,
                fontWeight: 800,
                letterSpacing: -2,
                lineHeight: 1,
                color: i % 3 === 0 ? C.red : C.text,
                opacity: visible ? 0.9 : 0,
                transform: `translateX(${x}px)`,
              }}
            >
              {Array.from({ length: 6 }).map(() => ADDRESS).join("   ·   ")}
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};
