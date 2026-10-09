// Channel brand stills: the finished "15 Minute History" wordmark at the sizes YouTube and design tools want.
// Render with:  node tools/brand.mjs <outdir>
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Finish, PALETTES, PaletteCtx} from './kit/Kit';
import {DarkPaper} from './kit/common';
import {Wordmark} from './kit/Intro';

const Done: React.FC = () => <Wordmark clockAt={-100} numAt={-100} minAt={-100} hisAt={-100} />;

/** The 1920x1080 wordmark, placed where the intro leaves it. `bg` false gives a transparent PNG. */
const Mark: React.FC<{bg: boolean}> = ({bg}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill style={{background: bg ? '#0d0c09' : 'transparent'}}>
      {bg && <DarkPaper />}
      <Done />
      {bg && <Finish vignette={0.45} />}
    </AbsoluteFill>
  </PaletteCtx.Provider>
);

/** Wordmark scaled and centred on any canvas (centre of the mark is about x 915, y 540; it spans ~1460 x 560). */
const Fit: React.FC<{w: number; h: number; scale: number; bg: boolean; grain?: boolean}> = ({w, h, scale, bg, grain = true}) => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <AbsoluteFill style={{background: bg ? '#0d0c09' : 'transparent', overflow: 'hidden'}}>
      {bg && <DarkPaper />}
      <div style={{position: 'absolute', left: w / 2 - 915, top: h / 2 - 540, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: '915px 540px'}}>
        <Done />
      </div>
      {bg && grain && <Finish vignette={0.45} />}
    </AbsoluteFill>
  </PaletteCtx.Provider>
);

/** Just the clock and "15": profile picture / watermark. */
const Clock: React.FC<{size: number; bg: boolean}> = ({size, bg}) => {
  const s = size / 600;
  return (
    <PaletteCtx.Provider value={PALETTES.locked}>
      <AbsoluteFill style={{background: bg ? '#0d0c09' : 'transparent', overflow: 'hidden'}}>
        {bg && <DarkPaper />}
        <div style={{position: 'absolute', left: size / 2 - 440, top: size / 2 - 540, width: 1920, height: 1080, transform: `scale(${s})`, transformOrigin: '440px 540px',
          clipPath: 'inset(0 1150px 0 0)'}}>
          <Done />
        </div>
        {bg && <Finish vignette={0.35} />}
      </AbsoluteFill>
    </PaletteCtx.Provider>
  );
};

export const BRAND = [
  {id: 'Brand-Wordmark', w: 1920, h: 1080, C: () => <Mark bg />, png: false},
  {id: 'Brand-Wordmark-Transparent', w: 1920, h: 1080, C: () => <Mark bg={false} />, png: true},
  {id: 'Brand-Avatar', w: 800, h: 800, C: () => <Clock size={800} bg />, png: true},
  {id: 'Brand-Clock-Transparent', w: 800, h: 800, C: () => <Clock size={800} bg={false} />, png: true},
  {id: 'Brand-Watermark', w: 150, h: 150, C: () => <Clock size={150} bg={false} />, png: true},
  // YouTube banner: 2560x1440, everything important inside the 1546x423 centre safe area
  {id: 'Brand-Banner', w: 2560, h: 1440, C: () => <Fit w={2560} h={1440} scale={0.7} bg />, png: false},
  {id: 'Brand-Square', w: 1080, h: 1080, C: () => <Fit w={1080} h={1080} scale={0.66} bg />, png: false},
];
