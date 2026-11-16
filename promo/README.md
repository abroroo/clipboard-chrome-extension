# Cliply promo video (Remotion)

```bash
npm install
npm run studio          # live preview + scrubbing
npm run render          # out/cliply-promo.mp4   (1920x1080, 30s)
npm run render:vertical # out/cliply-loop-vertical.mp4 (1080x1920, 10s loop for Shorts/TikTok)
```

Scenes live in `src/scenes/`, one component each, joined in `src/Root.tsx`.
Brand tokens and copy (address, Korean phrase) are in `src/theme.ts`.
The real Cliply button/panel/toast are rebuilt in `src/components.tsx`.

No audio yet. Suggested sound design: typewriter that speeds up (0–9s), hard cut to silence (9–11s),
single soft click (12s), one "pop" per paste (14–25s), warm swell on the outro.
