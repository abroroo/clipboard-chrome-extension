import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Caption, CliplyButton, fadeOut } from "../components";
import { ADDRESS, C, KOREAN } from "../theme";

/**
 * 14–25s. The snippet jumps across 5 stylized apps. ~2.2s each.
 * Vertical mode stacks the window and caption for 9:16.
 */
type App = { name: string; accent: string; snippet: string; render: (snippet: string, p: number) => React.ReactNode };

const Field: React.FC<{ label?: string; value?: React.ReactNode; accent: string; wide?: boolean }> = ({ label, value, accent, wide }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 15, color: "#8A94A6", marginBottom: 6, fontWeight: 500 }}>{label}</div>}
    <div
      style={{
        border: `2px solid ${value ? accent : "rgba(255,255,255,0.12)"}`,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 10,
        padding: "12px 16px",
        fontSize: 22,
        minHeight: 50,
        width: wide ? "100%" : 420,
        color: "#F5F7FA",
        boxShadow: value ? `0 0 0 4px ${accent}22` : "none",
      }}
    >
      {value}
    </div>
  </div>
);

const Snip: React.FC<{ text: string; p: number; accent: string }> = ({ text, p, accent }) => (
  <span style={{ display: "inline-block", transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: "left center", opacity: p, background: `${accent}33`, borderRadius: 6, padding: "0 6px" }}>
    {text}
  </span>
);

const APPS: App[] = [
  {
    name: "Mail",
    accent: C.blue,
    snippet: ADDRESS,
    render: (s, p) => (
      <>
        <Field label="To" value="orders@store.example" accent={C.blue} wide />
        <Field label="Subject" value="Shipping address" accent={C.blue} wide />
        <Field label="Message" value={<span>Hi, please ship it to <Snip text={s} p={p} accent={C.blue} /></span>} accent={C.blue} wide />
      </>
    ),
  },
  {
    name: "Checkout",
    accent: C.yellow,
    snippet: ADDRESS,
    render: (s, p) => (
      <>
        <Field label="Full name" value="Adam K." accent={C.yellow} wide />
        <Field label="Street address" value={p > 0.01 ? <Snip text={s} p={p} accent={C.yellow} /> : undefined} accent={C.yellow} wide />
        <div style={{ display: "flex", gap: 14 }}>
          <Field label="City" value="Seoul" accent={C.yellow} />
          <Field label="ZIP" value="04524" accent={C.yellow} />
        </div>
      </>
    ),
  },
  {
    name: "Chat",
    accent: C.green,
    snippet: KOREAN,
    render: (s, p) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
        {["Hey! Got your package 📦", "Let me know if it all looks right"].map((m, i) => (
          <div key={i} style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.08)", borderRadius: 16, padding: "12px 18px", fontSize: 22, maxWidth: "70%" }}>{m}</div>
        ))}
        <div style={{ marginTop: "auto" }}>
          <Field value={p > 0.01 ? <Snip text={s} p={p} accent={C.green} /> : <span style={{ color: "#8A94A6" }}>Message…</span>} accent={C.green} wide />
        </div>
      </div>
    ),
  },
  {
    name: "Docs",
    accent: "#A78BFA",
    snippet: ADDRESS,
    render: (s, p) => (
      <div style={{ fontSize: 24, lineHeight: 1.7, color: "#E6E9EF" }}>
        <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 10 }}>Invoice #0142</div>
        <div>Billed to:</div>
        <div><Snip text={s} p={p} accent="#A78BFA" /></div>
        <div style={{ color: "#8A94A6", marginTop: 18 }}>Due in 14 days · Net 14</div>
      </div>
    ),
  },
  {
    name: "Support",
    accent: "#F472B6",
    snippet: "Thanks for reaching out! I'll get back to you by EOD.",
    render: (s, p) => (
      <>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 18px", fontSize: 21, marginBottom: 16 }}>
          <span style={{ color: "#8A94A6" }}>Customer · </span>Hi, where is my order?
        </div>
        <Field label="Reply" value={p > 0.01 ? <Snip text={s} p={p} accent="#F472B6" /> : undefined} accent="#F472B6" wide />
      </>
    ),
  },
];

const Window: React.FC<{ app: App; width: number; height: number }> = ({ app, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const PASTE = 16;
  const p = spring({ frame: frame - PASTE, fps, config: { damping: 10, stiffness: 220, mass: 0.6 } });
  const pop = spring({ frame: frame - PASTE, fps, config: { damping: 8, stiffness: 300 }, durationInFrames: 14 });
  return (
    <div
      style={{
        width,
        height,
        background: C.bg2,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ height: 52, display: "flex", alignItems: "center", padding: "0 18px", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
        <div style={{ marginLeft: 14, fontSize: 15, color: "#8A94A6", fontWeight: 500 }}>{app.name}</div>
      </div>
      <div style={{ padding: 28, height: height - 52 }}>{app.render(app.snippet, p)}</div>
      {/* the pop: a small Cliply button pulse in the title bar when pasting */}
      <div style={{ position: "absolute", right: 14, top: 6, transform: `scale(${0.8 + 0.4 * (1 - Math.abs(pop - 0.5) * 2)})`, opacity: frame >= PASTE - 2 ? 1 : 0.5 }}>
        <CliplyButton size={40} />
      </div>
    </div>
  );
};

export const PasteAnywhere: React.FC<{ vertical?: boolean; perApp?: number }> = ({ vertical = false, perApp = 66 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width: W, height: H } = useVideoConfig();
  const winW = vertical ? 940 : 1180;
  const winH = vertical ? 760 : 620;

  return (
    <Bg>
      <AbsoluteFill style={{ opacity: fadeOut(frame, durationInFrames, 8) }}>
        {APPS.map((app, i) => {
          const start = i * perApp;
          const local = frame - start;
          if (local < -10 || local > perApp + 20) return null;
          // start entering 8 frames early so there is never an empty frame between apps
          const inP = i === 0 ? spring({ frame: local, fps, config: { damping: 18, stiffness: 120 } }) : spring({ frame: local + 8, fps, config: { damping: 18, stiffness: 120 } });
          const outP = interpolate(local, [perApp - 10, perApp], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const x = interpolate(inP, [0, 1], [W, 0]) - outP * W;
          return (
            <Sequence key={app.name} from={Math.max(0, start - 10)} durationInFrames={perApp + 12} layout="none">
              <div style={{ position: "absolute", left: (W - winW) / 2 + x, top: vertical ? 300 : (H - winH) / 2 - 40, transform: `scale(${0.96 + 0.04 * inP})` }}>
                <Window app={app} width={winW} height={winH} />
              </div>
            </Sequence>
          );
        })}
        <Caption text="Paste anywhere." at={4} bottom={vertical ? 400 : 90} size={vertical ? 84 : 56} />
      </AbsoluteFill>
    </Bg>
  );
};
