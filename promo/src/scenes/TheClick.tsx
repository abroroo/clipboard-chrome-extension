import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Caption, CliplyButton, Cursor, Panel, Toast, fadeOut } from "../components";
import { ADDRESS, KOREAN } from "../theme";

/**
 * 11–14s. Out of the silence: the Cliply button pops in. One click. Panel. One more click. Copied.
 */
const CLIPS = [ADDRESS, KOREAN, "Thanks for reaching out! I'll get back to you by EOD."];

export const TheClick: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const BTN_IN = 6, CLICK1 = 34, CLICK2 = 62;
  const btnIn = spring({ frame: frame - BTN_IN, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const press1 = spring({ frame: frame - CLICK1, fps, config: { damping: 12, stiffness: 400 }, durationInFrames: 10 });
  const pressed1 = frame >= CLICK1 && frame < CLICK1 + 8 ? 1 - press1 : 0;
  const panelIn = spring({ frame: frame - (CLICK1 + 4), fps, config: { damping: 16, stiffness: 150 } });
  const press2 = frame >= CLICK2 ? 1 : 0;

  // cursor path: enters from bottom-right, to button, then to the first clip
  const BTN = { x: 1380, y: 540 };
  const CLIP1 = { x: 1010, y: 450 };
  const cx = interpolate(frame, [12, CLICK1 - 4, CLICK1 + 10, CLICK2 - 4], [1700, BTN.x + 10, BTN.x + 10, CLIP1.x], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = interpolate(frame, [12, CLICK1 - 4, CLICK1 + 10, CLICK2 - 4], [1000, BTN.y + 10, BTN.y + 10, CLIP1.y], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ease = (t: number) => t; // interpolate already linear; spring on press handles feel

  // ring pulse around button while idle
  const ring = interpolate((frame - BTN_IN) % 30, [0, 30], [0, 1]);

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: fadeOut(frame, durationInFrames, 8) }}>
        {/* idle pulse */}
        {frame > BTN_IN && frame < CLICK1 && (
          <div
            style={{
              position: "absolute",
              left: BTN.x - 48,
              top: BTN.y - 48,
              width: 96,
              height: 96,
              borderRadius: "50%",
              border: "3px solid #067AFE",
              transform: `scale(${1 + ring * 1.1})`,
              opacity: 1 - ring,
            }}
          />
        )}

        {/* button */}
        <div style={{ position: "absolute", left: BTN.x - 48, top: BTN.y - 48, transform: `scale(${btnIn})` }}>
          <CliplyButton size={96} pressed={pressed1} />
        </div>

        {/* panel, anchored left of the button like the real one */}
        {frame > CLICK1 + 2 && (
          <div
            style={{
              position: "absolute",
              left: BTN.x - 96 - 320 * 1.5,
              top: BTN.y - 230,
              opacity: panelIn,
              transform: `translateX(${(1 - panelIn) * 30}px) scale(${0.92 + 0.08 * panelIn})`,
              transformOrigin: "right center",
            }}
          >
            <Panel clips={CLIPS} activeIndex={press2 ? 0 : -1} scale={1.5} />
          </div>
        )}

        <Toast text="Copied to clipboard!" at={CLICK2 + 3} scale={1.6} />
        <Cursor x={ease(cx)} y={ease(cy)} click={frame >= CLICK1 && frame < CLICK1 + 6 ? 1 : frame >= CLICK2 && frame < CLICK2 + 6 ? 1 : 0} />

        <Caption text="Or just click." at={CLICK1 + 6} bottom={110} />
      </AbsoluteFill>
    </Bg>
  );
};
