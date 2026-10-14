// Vertical covers (1080x1920) for the "Play jazz, or get the axe." Short, in the channel's thumbnail style.
// Everything is drawn at frame 0: render with `npx remotion still src/index.ts Short-Thumb-A <out.png> --frame=0`.
//   A · the deal: the 1919 sheet music (pianist in coral), the clock at 12:15, an axe's shadow, the threat in tape.
//   B · the shotgun man: the Times-Picayune cartoon of a man sitting up by his door, "PLAY JAZZ / OR ELSE".
// Key text stays in the middle of the frame, clear of the edges a Shorts shelf or grid tile can crop.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FitEdge, Finish, Highlight, Note, PALETTES, PaletteCtx, type Place, StepCtx, Tint, Traced} from '../kit/Kit';
import {DarkPaper} from '../kit/common';
import {Clock, LOOK, sizeOf} from '../kit/ax';
import {MASKS} from '../masks';
import {P} from '../pics';

/** Channel logo, top-left: the brand wordmark (brand/logo/wordmark-transparent.png in the style repo). */
const Logo: React.FC = () => (
  <div style={{position: 'absolute', left: 50, top: 60, padding: '14px 22px', borderRadius: 14, background: 'rgba(13,12,9,0.82)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)'}}>
    <Img src={staticFile('img/brand/wordmark.png')} style={{display: 'block', height: 110}} />
  </div>
);

/** A picture on a cream card with its subject tinted coral and traced in teal. */
const TintCard: React.FC<{src: string; mask: typeof MASKS.sheetPiano; x: number; y: number; w: number; rot: number; filter?: string}> = ({src, mask, x, y, w, rot, filter = LOOK.bw}) => {
  const size = sizeOf(src);
  const s = w / size[0];
  const place: Place = {left: 0, top: 0, scale: s};
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, background: '#f4efe6', padding: 20, boxShadow: '0 30px 60px rgba(0,0,0,0.8)'}}>
      <div style={{position: 'relative', width: w, height: size[1] * s}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: w, height: size[1] * s, filter}} />
        <Tint mask={mask.alpha} place={place} size={size} />
        <div style={{position: 'absolute', left: 0, top: 0}}><Traced paths={mask.data.shapes.subject} place={place} at={-30} dur={1} width={8} part={0.93} /></div>
      </div>
    </div>
  );
};

/** The axe's shadow, as if a lamp had thrown it across the desk (the same shape as the video's Shadow). */
const AxeShadow: React.FC<{x: number; y: number; size: number; rot?: number; opacity?: number}> = ({x, y, size, rot = -12, opacity = 0.7}) => (
  <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', opacity, filter: 'blur(9px)'}} width={size} height={size}>
    <g transform={`scale(${size / 100}) rotate(${rot} 50 50)`}>
      <path d="M47,14 C49,40 51,70 48,106 L55,106 C57,70 56,40 54,14 Z" fill="#030201" />
      <path d="M45,8 L57,8 L59,24 L45,26 C38,27 30,31 22,40 C18,44 15,50 13,56 C9,44 9,26 14,12 C16,6 20,2 24,0 C30,6 37,8 45,8 Z" fill="#030201" />
      <path d="M57,10 L64,13 L64,21 L58,23 Z" fill="#030201" />
    </g>
  </svg>
);

const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <FitEdge.Provider value={1020}>
        <AbsoluteFill>
          <DarkPaper />
          {/* a warm lamp pool in the middle of the desk */}
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 760px 900px at 50% 52%, rgba(255,236,200,0.16) 0%, rgba(255,236,200,0.05) 55%, transparent 100%)'}} />
          {children}
          <Finish vignette={0.45} />
        </AbsoluteFill>
      </FitEdge.Provider>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);

/** A: the deal. */
export const ShortThumbA: React.FC = () => (
  <Frame>
    <TintCard src={P.sheet.src} mask={MASKS.sheetPiano} x={170} y={470} w={720} rot={-3} />
    <AxeShadow x={-60} y={880} size={760} rot={-28} opacity={0.62} />
    {/* the deadline, on its own dark face so the card doesn't show through */}
    <div style={{position: 'absolute', left: 870 - 145, top: 1165 - 145, width: 290, height: 290, borderRadius: '50%', background: '#0d0c09', boxShadow: '0 18px 40px rgba(0,0,0,0.75)'}} />
    <Clock cx={870} cy={1165} r={122} at={-60} a={-50} b={-40} glow={1} />
    <Highlight text="PLAY JAZZ" x={80} y={250} size={176} at={-30} seed={21} rot={-3} />
    <Highlight text="OR GET THE AXE" x={70} y={1390} size={118} at={-30} seed={23} rot={-2} />
    <Note text="the axeman's letter · new orleans, 1919" x={90} y={1590} size={52} rot={-3} at={-30} />
    <Logo />
  </Frame>
);

/** B: the shotgun man (the vertical version of the main video's thumbnail A). */
export const ShortThumbB: React.FC = () => (
  <Frame>
    <TintCard src={P.cartoon.src} mask={MASKS.cartoonGuard} x={110} y={540} w={800} rot={3} filter="grayscale(1) contrast(1.35) brightness(0.98)" />
    <Highlight text="PLAY JAZZ" x={80} y={250} size={176} at={-30} seed={7} rot={-3} />
    <Highlight text="OR ELSE" x={200} y={1470} size={170} at={-30} seed={9} rot={-2} />
    <Note text="the axeman's letter, 1919" x={150} y={1700} size={56} rot={-3} at={-30} />
    <Logo />
  </Frame>
);
