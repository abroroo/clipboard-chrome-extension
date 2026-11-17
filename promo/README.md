# Cliply promo video (Remotion)

```bash
npm install
npm run studio            # live preview + scrubbing
npm run render:light:4k   # out/cliply-promo-light-4k.mp4  (3840x2160, 30s, the YouTube version)
npm run render            # out/cliply-promo.mp4           (dark, 1080p)
npm run render:vertical   # out/cliply-loop-vertical.mp4   (1080x1920 loop for Shorts)
npm run render:thumb      # out/youtube-thumbnail.png
npm run render:store      # out/store/*.png  Chrome Web Store icon, screenshots, tiles
```

## Layout

| Path | What |
|---|---|
| `src/scenes/` | One component per scene, joined in `src/Root.tsx` |
| `src/components.tsx` | Rebuilt Cliply button, panel, toast, cursor |
| `src/Marketing.tsx` | Store screenshots, tiles, YouTube thumbnail |
| `src/theme.ts` | Brand colours (dark + light) and copy |
| `public/promo-audio.wav` | Final soundtrack, generated (do not edit by hand) |
| `vo/Line1-4.mp3` | Voice-over lines (ElevenLabs) |
| `music/` | Licensed tracks kept for reference (git-ignored) |

## Sound

`python3 scripts/make-audio.py` synthesizes every sound effect and the music bed, mixes in the
voice-over with ducking, and writes `public/promo-audio.wav`. Event timings are in video frames
(30 fps) and must match the scenes. Re-run it after changing scene timing, then re-render.
