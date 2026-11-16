import { loadFont } from "@remotion/google-fonts/Inter";

const inter = loadFont("normal", { weights: ["400", "500", "600", "700", "800"] });

export const FONT = `${inter.fontFamily}, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;

import { createContext, useContext } from "react";

export type Mode = "dark" | "light";

const PALETTES = {
  dark: {
    bg: "#0B0F17",
    bg2: "#121826",
    bg3: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.08)",
    fieldBorder: "rgba(255,255,255,0.12)",
    blue: "#067AFE",
    yellow: "#FEB300",
    green: "#21BF73",
    red: "#EF4444",
    text: "#F5F7FA",
    text2: "#E6E9EF",
    muted: "#8A94A6",
    glass: "rgba(255,255,255,0.95)",
    glow: "radial-gradient(60% 50% at 50% 0%, rgba(6,122,254,0.18), transparent 70%), radial-gradient(40% 40% at 90% 100%, rgba(254,179,0,0.08), transparent 70%)",
    windowShadow: "0 30px 80px rgba(0,0,0,0.5)",
  },
  light: {
    bg: "#F5F7FB",
    bg2: "#FFFFFF",
    bg3: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)",
    fieldBorder: "rgba(0,0,0,0.14)",
    blue: "#067AFE",
    yellow: "#FEB300",
    green: "#21BF73",
    red: "#EF4444",
    text: "#111827",
    text2: "#1F2937",
    muted: "#6B7280",
    glass: "rgba(255,255,255,0.98)",
    glow: "radial-gradient(60% 50% at 50% 0%, rgba(6,122,254,0.14), transparent 70%), radial-gradient(40% 40% at 90% 100%, rgba(254,179,0,0.14), transparent 70%)",
    windowShadow: "0 30px 80px rgba(17,24,39,0.18)",
  },
};

export type Palette = { [K in keyof (typeof PALETTES)["dark"]]: string };

export const ModeContext = createContext<Mode>("dark");
export const useC = (): Palette => PALETTES[useContext(ModeContext)];
/** Static dark palette, for the few places that never change (e.g. the real white Cliply panel). */
export const C = PALETTES.dark;

export const FPS = 30;
export const ADDRESS = "123 Main Street, Apt 4B";
export const KOREAN = "안녕하세요, 감사합니다 🙏";
