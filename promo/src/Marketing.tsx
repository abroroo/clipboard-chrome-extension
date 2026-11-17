import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Bg, CliplyButton, Cursor, Panel, Toast } from "./components";
import { ADDRESS, C, FONT, KOREAN, ModeContext, useC } from "./theme";

const CLIPS = [ADDRESS, KOREAN, "Thanks for reaching out! I'll get back to you by EOD.", "https://cal.com/adam/15min"];

const Light: React.FC<{ children: React.ReactNode }> = ({ children }) => <ModeContext.Provider value="light">{children}</ModeContext.Provider>;

/** A faint generic web page behind the UI so screenshots read as "on any site". */
const MockPage: React.FC<{ title?: string; top?: number }> = ({ title = "Checkout", top = 230 }) => {
  const c = useC();
  return (
    <AbsoluteFill style={{ padding: `${top}px 72px 0`, color: c.text2, opacity: 0.5 }}>
      <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 22 }}>{title}</div>
      {["Full name", "Email", "Street address", "City"].map((l) => (
        <div key={l} style={{ marginBottom: 18, width: 560 }}>
          <div style={{ fontSize: 14, color: c.muted, marginBottom: 6 }}>{l}</div>
          <div style={{ height: 46, border: `1.5px solid ${c.fieldBorder}`, borderRadius: 10, background: c.bg2 }} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Headline: React.FC<{ text: string; sub?: string; top?: number; left?: number; size?: number; align?: "left" | "center" }> = ({ text, sub, top = 72, left = 72, size = 56, align = "left" }) => {
  const c = useC();
  return (
    <div style={{ position: "absolute", top, left: align === "center" ? 0 : left, right: align === "center" ? 0 : undefined, textAlign: align, fontFamily: FONT }}>
      <div style={{ fontSize: size, fontWeight: 800, letterSpacing: -1.5, color: c.text, lineHeight: 1.05 }}>{text}</div>
      {sub && <div style={{ fontSize: size * 0.45, color: c.muted, marginTop: 12, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
};

const ButtonAndPanel: React.FC<{ x: number; y: number; side?: "left" | "right"; active?: number; pinned?: number; search?: string; scale?: number; clips?: string[] }> = ({ x, y, side = "right", active = -1, pinned = -1, search, scale = 1.25, clips = CLIPS }) => (
  <>
    <div style={{ position: "absolute", left: x - 30, top: y - 30 }}><CliplyButton size={60} /></div>
    <div style={{ position: "absolute", left: side === "right" ? x - 44 - 320 * scale : x + 44, top: y - 150 }}>
      <Panel clips={clips} activeIndex={active} pinnedIndex={pinned} search={search} scale={scale} />
    </div>
  </>
);

/* ---------- 1280x800 screenshots ---------- */

export const Shot1: React.FC = () => (
  <Light><Bg><MockPage />
    <Headline text="Save once. Paste anywhere." sub="Your most-typed text, one click away on every site." />
    <ButtonAndPanel x={1180} y={420} active={0} />
    <Cursor x={1010} y={395} scale={1.4} />
    <Toast text="Pasted & copied!" at={0} scale={1.3} />
  </Bg></Light>
);

export const Shot2: React.FC = () => (
  <Light><Bg>
    <AbsoluteFill style={{ padding: "48px 72px" }}>
      <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 22, color: "#111827" }}>Checkout</div>
      {[["Full name", "Adam K."], ["Street address", ADDRESS], ["City", "Seoul"]].map(([l, v], i) => (
        <div key={l} style={{ marginBottom: 18, width: 560 }}>
          <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 6 }}>{l}</div>
          <div style={{ height: 46, border: `2px solid ${i === 1 ? C.blue : "rgba(0,0,0,0.14)"}`, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", padding: "0 14px", fontSize: 18, color: "#111827", boxShadow: i === 1 ? "0 0 0 4px rgba(6,122,254,0.15)" : "none" }}>
            {i === 1 ? <span style={{ background: "rgba(6,122,254,0.15)", borderRadius: 6, padding: "0 6px" }}>{v}</span> : v}
          </div>
        </div>
      ))}
    </AbsoluteFill>
    <Headline text="Click a clip. It lands in the field." sub="Works in forms, email, chat, docs. Also copies to your clipboard." top={560} left={72} size={44} />
    <ButtonAndPanel x={1180} y={300} active={0} clips={CLIPS.slice(0, 3)} />
    <Cursor x={1010} y={275} scale={1.4} />
  </Bg></Light>
);

export const Shot3: React.FC = () => (
  <Light><Bg><MockPage title="Support inbox" />
    <Headline text="Drag it anywhere." sub="Snaps to the nearest edge and remembers where you left it." top={72} left={0} align="center" />
    {/* ghost trail: where the button came from */}
    {[[1180, 300, 0.12], [900, 330, 0.18], [620, 380, 0.26], [340, 440, 0.38]].map(([gx, gy, o]) => (
      <div key={gx} style={{ position: "absolute", left: gx - 30, top: gy - 30, opacity: o }}><CliplyButton size={60} /></div>
    ))}
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1280} height={800}>
      <path d="M1150 300 C 900 300, 500 380, 150 495" fill="none" stroke={C.blue} strokeWidth={3} strokeDasharray="10 12" opacity={0.5} />
    </svg>
    <div style={{ position: "absolute", left: 70, top: 470 }}><CliplyButton size={60} /></div>
    <Cursor x={115} y={515} scale={1.4} />
  </Bg></Light>
);

export const Shot4: React.FC = () => (
  <Light><Bg><MockPage title="Compose" />
    <Headline text="Pin. Edit. Search." sub="Favourites stay on top. Search appears when the list grows." />
    <ButtonAndPanel x={1180} y={440} pinned={0} search="thanks" clips={[CLIPS[2], CLIPS[0], KOREAN]} />
  </Bg></Light>
);

export const Shot5: React.FC = () => {
  const Kbd: React.FC<{ k: string }> = ({ k }) => (
    <span style={{ display: "inline-block", fontSize: 44, fontWeight: 700, padding: "10px 22px", border: "2px solid rgba(0,0,0,0.15)", borderBottomWidth: 6, borderRadius: 14, background: "#fff", color: "#111827", margin: "0 6px" }}>{k}</span>
  );
  const Card: React.FC<{ title: string; body: string; icon: string }> = ({ title, body, icon }) => (
    <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 20, padding: 28, width: 330, boxShadow: "0 16px 40px rgba(17,24,39,0.08)" }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 17, color: "#6B7280", lineHeight: 1.45 }}>{body}</div>
    </div>
  );
  return (
    <Light><Bg>
      <Headline text="Fast by default." top={72} align="center" />
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, textAlign: "center", fontFamily: FONT }}>
        <span style={{ fontSize: 24, color: "#6B7280", marginRight: 14 }}>Toggle with</span><Kbd k="Alt" /><span style={{ fontSize: 32, color: "#6B7280" }}>+</span><Kbd k="C" />
      </div>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28, fontFamily: FONT }}>
        <Card icon="☁️" title="Synced" body="Clips follow your Chrome profile to every device." />
        <Card icon="🙈" title="Hide per site" body="Keep it out of the way on apps where you don't need it." />
        <Card icon="⬇️" title="Export & import" body="Your clips are yours. Back them up as JSON any time." />
      </div>
      <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center", fontSize: 18, color: "#9CA3AF", fontFamily: FONT }}>Free · No account · Nothing leaves your browser</div>
    </Bg></Light>
  );
};

/* ---------- tiles ---------- */

const TileBase: React.FC<{ w: number; h: number; logo: number; title: number; sub: number; gap?: number }> = ({ w, h, logo, title, sub, gap = 28 }) => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: C.glow }} />
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap }}>
      <CliplyButton size={logo} />
      <div>
        <div style={{ fontSize: title, fontWeight: 800, letterSpacing: -title * 0.03, color: C.text, lineHeight: 1 }}>Cliply</div>
        <div style={{ fontSize: sub, color: C.muted, marginTop: sub * 0.35, fontWeight: 500 }}>Save once. <span style={{ color: C.text }}>Paste anywhere.</span></div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

export const TileSmall: React.FC = () => <TileBase w={440} h={280} logo={110} title={64} sub={20} />;
export const TileMarquee: React.FC = () => <TileBase w={1400} h={560} logo={220} title={140} sub={44} gap={56} />;

/** 128x128 store icon: the real logo on a white rounded square (no alpha). */
export const StoreIcon: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center" }}>
    <Img src={staticFile("icon.svg")} style={{ width: 112, height: 112 }} />
  </AbsoluteFill>
);
