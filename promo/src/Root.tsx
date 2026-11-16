import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { FPS } from "./theme";
import { TypingFatigue } from "./scenes/TypingFatigue";
import { Overflow } from "./scenes/Overflow";
import { TheClick } from "./scenes/TheClick";
import { PasteAnywhere } from "./scenes/PasteAnywhere";
import { Outro } from "./scenes/Outro";

const S = { fatigue: 270, overflow: 60, click: 90, paste: 330, outro: 150 }; // 900 frames = 30s

export const Promo: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={S.fatigue}><TypingFatigue /></Sequence>
    <Sequence from={S.fatigue} durationInFrames={S.overflow}><Overflow /></Sequence>
    <Sequence from={S.fatigue + S.overflow} durationInFrames={S.click}><TheClick /></Sequence>
    <Sequence from={S.fatigue + S.overflow + S.click} durationInFrames={S.paste}><PasteAnywhere /></Sequence>
    <Sequence from={S.fatigue + S.overflow + S.click + S.paste} durationInFrames={S.outro}><Outro /></Sequence>
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id="Promo" component={Promo} durationInFrames={900} fps={FPS} width={1920} height={1080} />
    <Composition id="PasteLoopVertical" component={PasteAnywhere} defaultProps={{ vertical: true, perApp: 60 }} durationInFrames={300} fps={FPS} width={1080} height={1920} />
    <Composition id="TypingFatigue" component={TypingFatigue} durationInFrames={S.fatigue} fps={FPS} width={1920} height={1080} />
    <Composition id="TheClick" component={TheClick} durationInFrames={S.click} fps={FPS} width={1920} height={1080} />
    <Composition id="Outro" component={Outro} durationInFrames={S.outro} fps={FPS} width={1920} height={1080} />
  </>
);
