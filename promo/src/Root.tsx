import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { FPS, Mode, ModeContext } from "./theme";
import { TypingFatigue } from "./scenes/TypingFatigue";
import { Overflow } from "./scenes/Overflow";
import { TheClick } from "./scenes/TheClick";
import { PasteAnywhere } from "./scenes/PasteAnywhere";
import { Outro } from "./scenes/Outro";
import { Shot1, Shot2, Shot3, Shot4, Shot5, StoreIcon, TileMarquee, TileSmall } from "./Marketing";

const S = { fatigue: 270, overflow: 60, click: 90, paste: 330, outro: 150 }; // 900 frames = 30s

export const Promo: React.FC<{ mode?: Mode }> = ({ mode = "dark" }) => (
  <ModeContext.Provider value={mode}>
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={S.fatigue}><TypingFatigue /></Sequence>
    <Sequence from={S.fatigue} durationInFrames={S.overflow}><Overflow /></Sequence>
    <Sequence from={S.fatigue + S.overflow} durationInFrames={S.click}><TheClick /></Sequence>
    <Sequence from={S.fatigue + S.overflow + S.click} durationInFrames={S.paste}><PasteAnywhere /></Sequence>
    <Sequence from={S.fatigue + S.overflow + S.click + S.paste} durationInFrames={S.outro}><Outro /></Sequence>
  </AbsoluteFill>
  </ModeContext.Provider>
);

const PasteLoop: React.FC<{ mode?: Mode; vertical?: boolean; perApp?: number }> = ({ mode = "dark", ...rest }) => (
  <ModeContext.Provider value={mode}><PasteAnywhere {...rest} /></ModeContext.Provider>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Promo" component={Promo} defaultProps={{ mode: "dark" }} durationInFrames={900} fps={FPS} width={1920} height={1080} />
    <Composition id="PromoLight" component={Promo} defaultProps={{ mode: "light" }} durationInFrames={900} fps={FPS} width={1920} height={1080} />
    <Composition id="PasteLoopVertical" component={PasteLoop} defaultProps={{ mode: "dark", vertical: true, perApp: 60 }} durationInFrames={300} fps={FPS} width={1080} height={1920} />
    <Composition id="PasteLoopVerticalLight" component={PasteLoop} defaultProps={{ mode: "light", vertical: true, perApp: 60 }} durationInFrames={300} fps={FPS} width={1080} height={1920} />
    <Composition id="TypingFatigue" component={TypingFatigue} durationInFrames={S.fatigue} fps={FPS} width={1920} height={1080} />
    <Composition id="TheClick" component={TheClick} durationInFrames={S.click} fps={FPS} width={1920} height={1080} />
    {/* Chrome Web Store assets (render as stills) */}
    <Composition id="StoreIcon" component={StoreIcon} durationInFrames={1} fps={FPS} width={128} height={128} />
    <Composition id="TileSmall" component={TileSmall} durationInFrames={1} fps={FPS} width={440} height={280} />
    <Composition id="TileMarquee" component={TileMarquee} durationInFrames={1} fps={FPS} width={1400} height={560} />
    <Composition id="Shot1" component={Shot1} durationInFrames={1} fps={FPS} width={1280} height={800} />
    <Composition id="Shot2" component={Shot2} durationInFrames={1} fps={FPS} width={1280} height={800} />
    <Composition id="Shot3" component={Shot3} durationInFrames={1} fps={FPS} width={1280} height={800} />
    <Composition id="Shot4" component={Shot4} durationInFrames={1} fps={FPS} width={1280} height={800} />
    <Composition id="Shot5" component={Shot5} durationInFrames={1} fps={FPS} width={1280} height={800} />
    <Composition id="Outro" component={Outro} durationInFrames={S.outro} fps={FPS} width={1920} height={1080} />
  </>
);
