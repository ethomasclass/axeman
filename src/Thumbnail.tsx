// YouTube thumbnail concepts, drawn at 1920x1080 with the video's own kit and exported at 1280x720
// (tools/thumbs.mjs renders frame 140 so every write-on has finished).
//   A · the shotgun man: the Times-Picayune's 1919 cartoon of a man sitting up by the back door, picked out in coral.
//   B · the sheet music: the cover on the desk, the pianist in coral, the title in tape.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Wordmark} from './kit/Intro';
import {Finish, Highlight, Note, PALETTES, PaletteCtx, type Place, Tint, Traced} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {Door} from './kit/ax';
import {IMG} from './imgs';
import {MASKS} from './masks';
import {P} from './pics';

export const THUMB_FRAMES = 150;
const CORAL = '#FF6F61';

/** Channel logo, top-left (YouTube covers the bottom-right with the running time). */
const Logo: React.FC = () => {
  const s = 0.27;
  return (
    <div style={{position: 'absolute', left: 36, top: 30, width: 1440 * s, height: 530 * s, overflow: 'hidden', borderRadius: 14, background: 'rgba(13,12,9,0.78)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)'}}>
      <div style={{position: 'absolute', left: -170 * s, top: -275 * s, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <Wordmark clockAt={0} numAt={0} minAt={0} hisAt={0} />
      </div>
    </div>
  );
};

/** A picture on a cream card with its subject tinted coral and traced in teal. */
const TintCard: React.FC<{src: string; mask: typeof MASKS.sully; x: number; y: number; h: number; rot: number; filter?: string}> = ({src, mask, x, y, h, rot, filter = 'grayscale(1) contrast(1.25)'}) => {
  const size = IMG[src];
  const s = h / size[1];
  const place: Place = {left: 0, top: 0, scale: s};
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, background: '#f4efe6', padding: 18, boxShadow: '0 24px 50px rgba(0,0,0,0.75)'}}>
      <div style={{position: 'relative', width: size[0] * s, height: h, overflow: 'visible'}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: size[0] * s, height: h, filter}} />
        <Tint mask={mask.alpha} place={place} size={size} color={CORAL} />
        <div style={{position: 'absolute', left: 0, top: 0}}><Traced paths={mask.data.shapes.subject} place={place} at={0} dur={1} width={7} part={0.93} /></div>
      </div>
    </div>
  );
};

/** A: the man sitting up with his shotgun by the door, and the threat in tape. */
export const ThumbA: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill>
      <DarkPaper />
      <TintCard src={P.cartoon.src} mask={MASKS.cartoonGuard} x={980} y={70} h={900} rot={3} filter="grayscale(1) contrast(1.35) brightness(0.98)" />
      <Highlight text="PLAY JAZZ" x={90} y={330} size={190} at={0} seed={7} rot={-3} />
      <Highlight text="OR ELSE" x={150} y={590} size={190} at={0} seed={9} rot={-2} />
      <Note text="new orleans, 1919" x={170} y={860} size={70} rot={-4} at={0} />
      <Logo />
      <Finish vignette={0.35} />
    </AbsoluteFill>
  </PaletteCtx.Provider>
);

/** B: the sheet music, the pianist in coral, the door that was never safe. */
export const ThumbB: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill>
      <DarkPaper />
      <TintCard src={P.sheet.src} mask={MASKS.sheetPiano} x={1060} y={60} h={940} rot={-3} />
      <Door x={110} y={250} h={560} at={-100} done />
      <Highlight text="JAZZ" x={500} y={300} size={200} at={0} seed={11} rot={-3} />
      <Highlight text="OR THE AXE" x={420} y={560} size={130} at={0} seed={13} rot={-2} />
      <Note text="the killer who asked for a party" x={60} y={905} size={50} rot={-3} at={0} />
      <Logo />
      <Finish vignette={0.35} />
    </AbsoluteFill>
  </PaletteCtx.Provider>
);
