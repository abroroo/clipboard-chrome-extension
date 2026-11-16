import { loadFont } from "@remotion/google-fonts/Inter";

const inter = loadFont("normal", { weights: ["400", "500", "600", "700", "800"] });

export const FONT = `${inter.fontFamily}, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;

export const C = {
  bg: "#0B0F17",
  bg2: "#121826",
  blue: "#067AFE",
  yellow: "#FEB300",
  green: "#21BF73",
  red: "#EF4444",
  text: "#F5F7FA",
  muted: "#8A94A6",
  glass: "rgba(255,255,255,0.95)",
};

export const FPS = 30;
export const ADDRESS = "123 Main Street, Apt 4B";
export const KOREAN = "안녕하세요, 감사합니다 🙏";
