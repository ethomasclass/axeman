// The Axeman's scene kit, on top of the template kit. Gathered from earlier videos (Grip Tighter's Doc marks,
// Ouija's Desk / DropCard / SyncQuote / SrcView) plus this video's own motifs:
//   Door      the drawn back door whose lower panel gets chiseled out (comes back with a counter, ch02/04/06/08)
//   Blamed    an index card of people blamed, each struck through when cleared (ch03/05/06/09)
//   Clock     a drawn clock whose minute hand ticks from 12:00 to 12:15 (ch07)
//   Shadow    an axe-shaped shadow sliding across the desk (night beats; never gore)
//   Flicker   a lamp/candle flicker over a night scene, staying black and white
//   Witness   a faceless police-sketch figure drawn detail by detail as the witness description is read (ch04)
//   Chalk     a chalk message written on the pavement word by word with the voice (ch02)
//   Parallax  a photograph as 2.5D: subject layer over an inpainted background (tools/layers.py)
//   Fit       a whole picture fitted on the desk (no crop) with optional tint and trace; Clip for a clipping with marks
//   Bed / Sounds  music beds with fades and skip, and the per-chapter sound lists (whoosh, stamp, write, tick, boom)
// Every drawn line here boils (BoilDefs / boilUrl from Kit.tsx).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {noise2D} from '@remotion/noise';
import {IMG} from '../imgs';
import {clamp} from '../lib/anim';
import {FPS} from '../lib/theme';
import {BoilDefs, boilUrl, boxOf, JF, Note, PALETTES, Picture, type Place, Tag, Tint, Traced, useBoilId, useGFrame, usePal} from './Kit';
import {DarkPaper, Sfx, WRITE} from './common';
import type {MaskRef} from './maskref';
import {fill, hasFile, type TL} from './shell';

export const sizeOf = (src: string): [number, number] => {
  const s = IMG[src];
  if (!s) throw new Error(`No size for ${src}: run python3 tools/img_sizes.py`);
  return s;
};
const has = (src: string) => hasFile(src) && !!IMG[src];

export const LOOK = {
  bw: 'grayscale(1) contrast(1.2) brightness(0.96)',
  news: 'grayscale(1) sepia(0.28) contrast(1.18) brightness(0.98)',
  night: 'grayscale(1) contrast(1.3) brightness(0.72)',
};

/** Labelled placeholder for a picture that hasn't arrived yet. */
export const StandIn: React.FC<{x: number; y: number; w: number; h: number; rot?: number; label: string}> = ({x, y, w, h, rot = 0, label}) => {
  const pal = usePal();
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `rotate(${rot}deg)`, border: `4px dashed ${pal.mark}`, opacity: 0.6,
      display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: JF.mono, fontSize: 20, letterSpacing: 2, color: '#fff', textTransform: 'uppercase', padding: 20}}>
      picture to come<br />{label.split('/').pop()}
    </div>
  );
};

/** Lamp flicker over a night scene: the light breathes and now and then dips, staying black and white. */
export const Flicker: React.FC<{strength?: number; x?: number; y?: number}> = ({strength = 1, x = 960, y = 420}) => {
  const f = useCurrentFrame();
  const n = Math.abs(noise2D('lamp', f * 0.25, 0)) * 0.12 + Math.abs(noise2D('lamp2', f * 1.1, 3)) * 0.05;
  const dip = random(`dip${Math.floor(f / 5)}`) > 0.93 ? 0.12 : 0;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: strength,
      background: `radial-gradient(circle 1150px at ${x}px ${y}px, rgba(0,0,0,${0.02 + n + dip}) 0%, rgba(0,0,0,${0.3 + n + dip}) 100%)`}} />
  );
};

/** The dark desk with a slow handheld drift and push; children ride on it. `still` stays put (titles that shouldn't wobble). */
export const Desk: React.FC<{a?: number; push?: number; flicker?: boolean; children?: React.ReactNode; still?: React.ReactNode}> = ({a = 0, push = 0.04, flicker, children, still}) => {
  const f = useCurrentFrame();
  const z = 1 + Math.max(0, f - a) * (push / 240);
  const d = {x: noise2D('dkx', f * 0.018, 0) * 3, y: noise2D('dky', 0, f * 0.018) * 3, r: noise2D('dkr', f * 0.012, 3) * 0.18};
  return (
    <AbsoluteFill style={{background: '#0d0c09', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${d.x}px, ${d.y}px) rotate(${d.r}deg) scale(${Math.min(z, 1 + push)})`}}>
        <DarkPaper />
        {children}
      </AbsoluteFill>
      {flicker && <Flicker />}
      {still}
    </AbsoluteFill>
  );
};

/**
 * Full-bleed archival picture: B&W, slow push from z0 to z1 between frames a and b, a little handheld drift,
 * optional coral subject + teal trace, a source tag. `children(place)` draw over it in screen space.
 */
export const Pic: React.FC<{src: string; tag: string; a: number; b: number; fx?: number; fy?: number; z0?: number; z1?: number; look?: keyof typeof LOOK;
  mask?: MaskRef; tint?: string | null; traceAt?: number; vignette?: number; flicker?: boolean; tagTop?: boolean; children?: (p: Place) => React.ReactNode}> = ({
  src, tag, a, b, fx, fy, z0 = 1.02, z1 = 1.1, look = 'bw', mask, tint, traceAt, vignette = 0.62, flicker, tagTop, children,
}) => {
  const f = useCurrentFrame();
  if (!has(src)) return <AbsoluteFill><DarkPaper /><StandIn x={260} y={200} w={1400} h={680} label={src} /><Tag text={tag} /></AbsoluteFill>;
  const size = sizeOf(src);
  const z = interpolate(f, [a, b], [z0, z1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const p0 = fill(size, fx ?? size[0] / 2, fy ?? size[1] / 2, z);
  const place = {...p0, left: p0.left + noise2D('pcx', f * 0.018, 0) * 3, top: p0.top + noise2D('pcy', 0, f * 0.018) * 3};
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      <Picture src={src} place={place} size={size} bw={LOOK[look]} />
      {mask && tint !== null && <Tint mask={mask.alpha} place={place} size={size} color={tint ?? undefined} strength={interpolate(f, [(traceAt ?? a + 4) - 2, (traceAt ?? a + 4) + 6], [0, 1], clamp)} />}
      {mask && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt ?? a + 4} dur={12} width={5} part={0.93} />}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,${vignette}) 100%)`}} />
      {flicker && <Flicker />}
      {children?.(place)}
      <Tag text={tag} y={tagTop ? 40 : undefined} />
    </AbsoluteFill>
  );
};

/**
 * The Ouija parallax, for archival pictures: the subject (cut out by tools/mask.py, split by tools/layers.py) floats
 * at `depth` over the picture with the subject painted out, so a slow push and pan reads as depth. The subject keeps
 * its coral tint and teal trace. Falls back to the flat Pic until the layers exist.
 */
export const Parallax: React.FC<{src: string; tag: string; layer: string; mask: MaskRef; a: number; b: number; fx?: number; fy?: number; z0?: number; z1?: number;
  pan?: [number, number]; depth?: number; look?: keyof typeof LOOK; tint?: string | null; traceAt?: number; vignette?: number; flicker?: boolean; tagTop?: boolean;
  children?: (p: Place) => React.ReactNode}> = ({src, tag, layer, mask, a, b, fx, fy, z0 = 1.05, z1 = 1.14, pan = [-0.02, 0.02], depth = 1.06, look = 'bw', tint, traceAt,
  vignette = 0.62, flicker, tagTop, children}) => {
  const f = useCurrentFrame();
  const fgSrc = `img/layers/${layer}_fg.png`, bgSrc = `img/layers/${layer}_bg.jpg`;
  if (!has(src) || !hasFile(fgSrc) || !hasFile(bgSrc)) {
    return <Pic src={src} tag={tag} a={a} b={b} fx={fx} fy={fy} z0={z0} z1={z1} look={look} mask={mask} tint={tint} traceAt={traceAt} vignette={vignette} flicker={flicker} tagTop={tagTop}>{children}</Pic>;
  }
  const [W, H] = sizeOf(src);
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const z = z0 + (z1 - z0) * u;
  const base = Math.max(1920 / W, 1080 / H) * z;
  // camera centre in source pixels, kept where the background still covers the frame
  const cx0 = (fx ?? W / 2) + (pan[0] + (pan[1] - pan[0]) * u) * W;
  const cx = Math.min(W - 960 / base, Math.max(960 / base, cx0));
  const cy = Math.min(H - 540 / base, Math.max(540 / base, fy ?? H / 2));
  const dr = {x: noise2D(`${layer}x`, f * 0.018, 0) * 3, y: noise2D(`${layer}y`, 0, f * 0.018) * 3};
  const place = (d: number): Place => {
    const sc = base * d;
    return {left: 960 - cx * sc + dr.x * d, top: 540 - cy * sc + dr.y * d, scale: sc};
  };
  const bg = place(1);
  const fg = place(depth);
  const img = (p: string, pl: Place, extra?: React.CSSProperties) => (
    <Img src={staticFile(p)} style={{position: 'absolute', left: pl.left, top: pl.top, width: W * pl.scale, height: H * pl.scale, filter: LOOK[look], ...extra}} />
  );
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      {img(bgSrc, bg)}
      {/* contact shadow: the lifted subject darkens what's behind it */}
      {img(fgSrc, fg, {filter: 'brightness(0) blur(14px)', opacity: 0.35, transform: 'translate(8px, 12px)'})}
      {img(fgSrc, fg)}
      {tint !== null && <Tint mask={mask.alpha} place={fg} size={[W, H]} color={tint ?? undefined} strength={interpolate(f, [(traceAt ?? a + 4) - 2, (traceAt ?? a + 4) + 6], [0, 1], clamp)} />}
      <Traced paths={mask.data.shapes.subject} place={fg} at={traceAt ?? a + 4} dur={12} width={5} part={0.93} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,${vignette}) 100%)`}} />
      {flicker && <Flicker />}
      {children?.(fg)}
      <Tag text={tag} y={tagTop ? 40 : undefined} />
    </AbsoluteFill>
  );
};

/** A tall picture fitted whole over a blurred, darkened copy of itself (portraits, sheet music on a 16:9 frame). */
export const Fit: React.FC<{src: string; tag: string; a: number; b: number; z0?: number; z1?: number; look?: keyof typeof LOOK; card?: boolean; x?: number;
  mask?: MaskRef; tint?: string | null; traceAt?: number; children?: (p: Place) => React.ReactNode}> = ({
  src, tag, a, b, z0 = 1, z1 = 1.06, look = 'bw', card = true, x, mask, tint, traceAt, children,
}) => {
  const f = useCurrentFrame();
  if (!has(src)) return <AbsoluteFill><DarkPaper /><StandIn x={660} y={90} w={600} h={900} label={src} /><Tag text={tag} /></AbsoluteFill>;
  const size = sizeOf(src);
  const z = interpolate(f, [a, b], [z0, z1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const s = Math.min(940 / size[1], 1700 / size[0]) * z;
  const w = size[0] * s, h = size[1] * s;
  const left = (x ?? 960 - w / 2) + noise2D('ftx', f * 0.018, 0) * 3;
  const top = 540 - h / 2 + noise2D('fty', 0, f * 0.018) * 3;
  return (
    <AbsoluteFill style={{background: '#0b0a08', overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', inset: -40, width: 2000, height: 1160, objectFit: 'cover', filter: `${LOOK[look]} blur(22px) brightness(0.35)`}} />
      {card && <div style={{position: 'absolute', left: left - 14, top: top - 14, width: w + 28, height: h + 28, background: '#f4efe6', boxShadow: '0 20px 50px rgba(0,0,0,0.8)'}} />}
      <Img src={staticFile(src)} style={{position: 'absolute', left, top, width: w, height: h, filter: LOOK[look]}} />
      {mask && tint !== null && traceAt !== undefined && <Tint mask={mask.alpha} place={{left, top, scale: s}} size={size} color={tint ?? undefined} strength={interpolate(f, [traceAt - 2, traceAt + 6], [0, 1], clamp)} />}
      {mask && traceAt !== undefined && <Traced paths={mask.data.shapes.subject} place={{left, top, scale: s}} at={traceAt} dur={12} width={5} part={0.93} />}
      {children?.({left, top, scale: s})}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)'}} />
      <Tag text={tag} />
    </AbsoluteFill>
  );
};

const CardInner: React.FC<{src: string; x: number; y: number; w: number; h?: number; pos?: string; rot: number; at: number; filter: string; out: number; children?: React.ReactNode}> = ({
  src, x, y, w, h, pos = '50% 50%', rot, at, filter, out, children,
}) => {
  const f = useCurrentFrame();
  if (f < at || f >= out) return null;
  const sp = spring({frame: f - at, fps: FPS, config: {stiffness: 260, damping: 15, mass: 0.9}});
  const air = 1 - Math.min(sp, 1);
  const scale = 1 + air * 0.4 - Math.max(sp - 1, 0) * 0.6;
  return (
    <div style={{position: 'absolute', left: x, top: y - air * 60, width: w, transform: `scale(${scale}) rotate(${rot + air * 7}deg)`, opacity: Math.min(1, (f - at + 1) / 2)}}>
      <div style={{position: 'relative', background: '#f4efe6', padding: Math.max(8, w * 0.03),
        boxShadow: `0 ${14 + air * 70}px ${12 + air * 60}px rgba(0,0,0,${0.7 - air * 0.35}), 0 2px 3px rgba(0,0,0,${0.5 * (1 - air)})`}}>
        <Img src={staticFile(src)} style={{width: '100%', height: h, objectFit: 'cover', objectPosition: pos, display: 'block', filter}} />
        {children}
      </div>
    </div>
  );
};

/** A picture dropped onto the desk at frame `at`, with weight (spring, contact shadow, motion blur while it falls). */
export const DropCard: React.FC<{src: string; x: number; y: number; w: number; h?: number; pos?: string; rot?: number; at: number; out?: number; look?: keyof typeof LOOK; children?: React.ReactNode}> = ({
  src, x, y, w, h, pos, rot = 0, at, out = Infinity, look = 'bw', children,
}) => {
  const f = useCurrentFrame();
  if (f < at || f >= out) return null;
  if (!has(src)) return <StandIn x={x} y={y} w={w} h={h ?? w * 0.75} rot={rot} label={src} />;
  const inner = <CardInner src={src} x={x} y={y} w={w} h={h} pos={pos} rot={rot} at={at} filter={LOOK[look]} out={out}>{children}</CardInner>;
  return f < at + 10 ? <CameraMotionBlur shutterAngle={200} samples={6}>{inner}</CameraMotionBlur> : inner;
};

// ---------------------------------------------------------------------------------------------
// Documents marked in their own pixels (from Grip Tighter): newspaper clippings, the letter, the map.

export type DocMark = {at: number; box?: [number, number, number, number]; ellipse?: [number, number, number, number]; underline?: [number, number, number];
  tint?: boolean; until?: number; pad?: number; seed?: number; width?: number; noTrace?: boolean; rot?: number; color?: string};

const markPath = (m: DocMark) => {
  const j = (k: string) => random(`dm${m.seed ?? 1}${k}`) - 0.5;
  if (m.underline) {
    const [x1, x2, y] = m.underline;
    return Array.from({length: 10}, (_, i) => `${i ? 'L' : 'M'}${x1 + ((x2 - x1) * i) / 9},${y + j(`u${i}`) * 6 + i * 0.4}`).join(' ');
  }
  if (m.ellipse) {
    const [cx, cy, rx, ry] = m.ellipse;
    return Array.from({length: 40}, (_, i) => {
      const a = -Math.PI * 0.6 + (i / 39) * Math.PI * 2 * 1.04;
      const w = 1 + j(`e${i % 7}`) * 0.08;
      return `${i ? 'L' : 'M'}${cx + rx * w * Math.cos(a)},${cy + ry * w * Math.sin(a)}`;
    }).join(' ');
  }
  const [x0, y0, x1, y1] = m.box!;
  const p = m.pad ?? 8;
  const pts = [[x0 - p, y0 - p], [x1 + p, y0 - p], [x1 + p, y1 + p], [x0 - p, y1 + p], [x0 - p + 6, y0 - p - 4]];
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x + j(`bx${i}`) * 8},${y + j(`by${i}`) * 8}`).join(' ');
};

const DocMarks: React.FC<{marks: DocMark[]; size: [number, number]; w: number; h: number; inset: number}> = ({marks, size, w, h, inset}) => {
  const g = useGFrame();
  const pal = usePal();
  const quiet = pal === PALETTES.quiet;
  const tc = quiet ? pal.mark : pal.subject;
  const [om, oc] = quiet ? [0.45, 0.35] : [0.75, 0.5];
  return (
    <>
      {marks.map((m, i) => {
        if (!m.tint || (!m.box && !m.ellipse) || g < m.at + 2 || g >= (m.until ?? 1e7)) return null;
        const o = interpolate(g, [m.at + 2, m.at + 8], [0, 1], clamp);
        const r = m.box ? m.box : [m.ellipse![0] - m.ellipse![2], m.ellipse![1] - m.ellipse![3], m.ellipse![0] + m.ellipse![2], m.ellipse![1] + m.ellipse![3]];
        const pad = m.box ? (m.pad ?? 8) * 0.5 : 0;
        const st: React.CSSProperties = {position: 'absolute', left: inset + ((r[0] - pad) / size[0]) * w, top: inset + ((r[1] - pad) / size[1]) * h,
          width: ((r[2] - r[0] + 2 * pad) / size[0]) * w, height: ((r[3] - r[1] + 2 * pad) / size[1]) * h, background: tc, borderRadius: m.ellipse ? '50%' : 6};
        return (
          <React.Fragment key={`t${i}`}>
            <div style={{...st, mixBlendMode: 'multiply', opacity: om * o}} />
            <div style={{...st, mixBlendMode: 'color', opacity: oc * o}} />
          </React.Fragment>
        );
      })}
      <svg style={{position: 'absolute', left: inset, top: inset, overflow: 'visible'}} width={w} height={h} viewBox={`0 0 ${size[0]} ${size[1]}`} preserveAspectRatio="none">
        {marks.map((m, i) => {
          if (g < m.at || m.noTrace) return null;
          const p = interpolate(g, [m.at, m.at + (m.underline ? 8 : 12)], [0, 1], clamp);
          return <path key={i} d={markPath(m)} fill="none" stroke={m.color ?? pal.mark} strokeWidth={m.width ?? 5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"
            pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
        })}
      </svg>
    </>
  );
};

/**
 * A clipping or page on the desk: cream card, light sepia, pops (or drops) on, then pushes in toward (fx, fy).
 * `marks` draw on the paper itself in source pixels. `children(S)` get a source→screen mapper for overlays.
 */
export const Clip: React.FC<{src: string; x: number; y: number; w: number; at: number; out?: number; rot?: number; push?: [number, number]; fx?: number; fy?: number; zoom?: number;
  look?: keyof typeof LOOK; drop?: boolean; marks?: DocMark[]; children?: (S: (sx: number, sy: number) => number[]) => React.ReactNode}> = ({
  src, x, y, w, at, out = Infinity, rot = 0, push, fx, fy, zoom = 1.25, look = 'news', drop = true, marks, children,
}) => {
  const frame = useCurrentFrame();
  const g = useGFrame();
  if (frame < at || frame >= out) return null;
  if (!has(src)) return <StandIn x={x} y={y} w={w} h={w * 0.7} rot={rot} label={src} />;
  const size = sizeOf(src);
  const h = (w * size[1]) / size[0];
  const sp = drop ? spring({frame: frame - at, fps: FPS, config: {stiffness: 260, damping: 15, mass: 0.9}}) : interpolate(g, [at, at + 5], [0, 1], clamp);
  const air = 1 - Math.min(sp, 1);
  const z = push ? interpolate(frame, push, [1, zoom], {...clamp, easing: Easing.inOut(Easing.sin)}) : 1;
  const ox = fx ?? size[0] / 2;
  const oy = fy ?? size[1] / 2;
  const sc = w / size[0];
  const flat = (sx: number, sy: number) => [x + ox * sc + (sx - ox) * sc * z, y + oy * sc + (sy - oy) * sc * z];
  const [lx, ty] = flat(0, 0);
  const pad = 16;
  const cw = w * z + pad * 2;
  const ch = h * z + pad * 2;
  const cx = lx - pad + cw / 2;
  const cy = ty - pad + ch / 2;
  const a = (rot * Math.PI) / 180;
  const S = (sx: number, sy: number) => {
    const [px, py] = flat(sx, sy);
    return [cx + (px - cx) * Math.cos(a) - (py - cy) * Math.sin(a), cy + (px - cx) * Math.sin(a) + (py - cy) * Math.cos(a)];
  };
  const card = (
    <div style={{position: 'absolute', left: lx - pad, top: ty - pad - air * 60, width: cw, height: ch, background: '#f4efe6',
      boxShadow: `0 ${14 + air * 70}px ${16 + air * 60}px rgba(0,0,0,${0.7 - air * 0.35})`,
      transform: `scale(${1 + air * 0.35}) rotate(${rot + air * 6}deg)`, opacity: Math.min(1, (frame - at + 1) / 2)}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: pad, top: pad, width: w * z, height: h * z, filter: LOOK[look]}} />
      {marks && air < 0.02 && <DocMarks marks={marks} size={size} w={w * z} h={h * z} inset={pad} />}
    </div>
  );
  return (
    <>
      {drop && frame < at + 10 ? <CameraMotionBlur shutterAngle={200} samples={6}>{card}</CameraMotionBlur> : card}
      {air < 0.02 && children?.(S)}
    </>
  );
};

/**
 * A big picture seen through a moving camera: `keys` are [frame, x, y, s] (s = screen px per source px), eased
 * between keys. Children are drawn in source pixels (use `sw` for a constant-width stroke).
 */
export const SrcView: React.FC<{src: string; keys: [number, number, number, number][]; look?: keyof typeof LOOK; card?: boolean;
  children?: (sw: (px: number) => number) => React.ReactNode}> = ({src, keys, look = 'bw', card = false, children}) => {
  const f = useCurrentFrame();
  if (!has(src)) return <StandIn x={260} y={200} w={1400} h={680} label={src} />;
  const size = sizeOf(src);
  let k0 = keys[0], k1 = keys[0];
  for (let i = 0; i < keys.length; i++) {
    if (f >= keys[i][0]) { k0 = keys[i]; k1 = keys[Math.min(i + 1, keys.length - 1)]; }
  }
  const u = k1[0] > k0[0] ? interpolate(f, [k0[0], k1[0]], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 1;
  const [x, y] = [1, 2].map((i) => k0[i] + (k1[i] - k0[i]) * u);
  const s = Math.exp(Math.log(k0[3]) + (Math.log(k1[3]) - Math.log(k0[3])) * u);
  const d = {x: noise2D('svx', f * 0.018, 0) * 3, y: noise2D('svy', 0, f * 0.018) * 3};
  const pad = card ? 18 / s : 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${960 - x * s + d.x}px, ${540 - y * s + d.y}px) scale(${s})`}}>
      {card && <div style={{position: 'absolute', left: -pad, top: -pad, width: size[0] + 2 * pad, height: size[1] + 2 * pad, background: '#f4efe6', boxShadow: `0 ${18 / s}px ${40 / s}px rgba(0,0,0,0.7)`}} />}
      <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: size[0], height: size[1], filter: LOOK[look]}} />
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={size[0]} height={size[1]}>{children?.((px) => px / s)}</svg>
    </div>
  );
};

/** A quote that appears word by word exactly as the narrator speaks `phrase` (the words as written in the script). */
export const SyncQuote: React.FC<{t: TL; phrase: string; nth?: number; x: number; y: number; w: number; size?: number; color?: string; marks?: Record<number, string>; open?: boolean; close?: boolean}> = ({
  t, phrase, nth = 1, x, y, w, size = 64, color = '#f4efe6', marks = {}, open = true, close = true,
}) => {
  const f = useCurrentFrame();
  const i0 = t.idx(phrase, nth);
  const n = phrase.split(/\s+/).length;
  const words = t.words.slice(i0, i0 + n);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: JF.heavy, fontWeight: 900, fontSize: size, lineHeight: 1.28, textShadow: '0 3px 14px #000'}}>
      {words.map((wd, i) => {
        const at = Math.round(wd.s * FPS) - 2;
        const k = interpolate(f, [at, at + 5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const u = marks[i];
        const p = u ? interpolate(f, [at + 4, at + 10], [0, 1], clamp) : 0;
        const word = wd.w.replace(/^["“]+|["”]+$/g, '').replace(/[*{}]/g, '');
        return (
          <span key={i} style={{position: 'relative', display: 'inline-block', paddingRight: '0.26em', color, opacity: k, transform: `translateY(${(1 - k) * 12}px)`}}>
            {(i === 0 && open ? '“' : '') + word + (i === n - 1 && close ? '”' : '')}
            {u && p > 0 && <span style={{position: 'absolute', left: -3, bottom: -2, height: 7, borderRadius: 4, background: u, width: `calc(${p} * (100% - 0.2em))`}} />}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// Motifs

/** An orange strike-through drawn across something (a cleared name, a rejected theory). */
export const Strike: React.FC<{x: number; y: number; w: number; at: number; width?: number}> = ({x, y, w, at, width = 8}) => {
  const g = useGFrame();
  const pal = usePal();
  const bid = useBoilId();
  if (g < at) return null;
  const p = interpolate(g, [at, at + 5], [0, 1], clamp);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <BoilDefs id={bid} />
      <path filter={boilUrl(bid, g)} d={`M${x},${y + 6} Q${x + w / 2},${y - 8} ${x + w},${y}`} fill="none" stroke={boxOf(pal)} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** A coral ✕ stamped on (a death, a scene on the map). */
export const XMark: React.FC<{x: number; y: number; at: number; size?: number; color?: string}> = ({x, y, at, size = 70, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.35, 1], clamp);
  return <div style={{position: 'absolute', left: x - size * 0.36, top: y - size * 0.62, fontFamily: JF.sans, fontWeight: 800, fontSize: size, lineHeight: 1, color: color ?? pal.subject,
    transform: `scale(${k})`, textShadow: '0 0 3px #111, 0 2px 10px rgba(0,0,0,0.8)'}}>✕</div>;
};

/** A teal pin that pops on (map places, attack sites). */
export const Dot: React.FC<{x: number; y: number; at: number; r?: number; color?: string}> = ({x, y, at, r = 13, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.35, 1], clamp);
  return <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: color ?? pal.mark, border: '4px solid #111',
    boxShadow: '0 0 0 4px rgba(47,224,196,0.35)', transform: `scale(${k})`}} />;
};

/** Top-right counter in mono caps ("BACK DOORS 2"). */
export const Counter: React.FC<{label: string; n: number | string; at: number; color?: string}> = ({label, n, at, color}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 3, at + 6], [0, 1.3, 1], clamp);
  return (
    <div style={{position: 'absolute', right: 60, top: 46, fontFamily: JF.mono, fontSize: 32, letterSpacing: 2, color: '#fff', transform: `scale(${k})`, transformOrigin: 'right top', textShadow: '0 2px 10px #000', whiteSpace: 'nowrap'}}>
      {label} <span style={{color: color ?? pal.subject}}>{n}</span>
    </div>
  );
};

const jit = (seed: string, i: number, amp: number) => (random(`${seed}${i}`) - 0.5) * amp;
const wobblyRect = (x: number, y: number, w: number, h: number, seed: string, amp = 6) => {
  const pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x + 4, y - 3]];
  return pts.map(([px, py], i) => `${i ? 'L' : 'M'}${(px + jit(seed + 'x', i, amp)).toFixed(1)},${(py + jit(seed + 'y', i, amp)).toFixed(1)}`).join(' ');
};
/** A ragged hole: a rectangle whose edges are splintered, as if chiseled out of the wood. */
const raggedRect = (x: number, y: number, w: number, h: number, seed: string) => {
  const pts: number[][] = [];
  const side = (x0: number, y0: number, x1: number, y1: number, n: number, k: string) => {
    for (let i = 0; i < n; i++) {
      const u = i / n;
      const nx = -(y1 - y0), ny = x1 - x0, l = Math.hypot(nx, ny);
      const d = (i % 2 ? 1 : -0.4) * Math.abs(jit(seed + k, i, 16));
      pts.push([x0 + (x1 - x0) * u + (nx / l) * d, y0 + (y1 - y0) * u + (ny / l) * d]);
    }
  };
  side(x, y, x + w, y, 9, 't'); side(x + w, y, x + w, y + h, 11, 'r'); side(x + w, y + h, x, y + h, 9, 'b'); side(x, y + h, x, y, 11, 'l');
  return pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ') + ' Z';
};

/**
 * The back door: a teal pen drawing (jamb, sill, four bevelled panels, hinges, knob and keyhole), every line gone
 * over twice like a quick sketch. At `cut` the lower-left panel flashes coral and falls out, leaving a ragged dark
 * hole with chisel marks. `h` is the door's height; (x, y) its top-left.
 */
export const Door: React.FC<{x: number; y: number; h: number; at: number; cut?: number; done?: boolean; label?: string}> = ({x, y, h, at, cut = 1e7, done = false, label}) => {
  const g = useGFrame();
  const bid = useBoilId();
  const f = useCurrentFrame();
  const pal = usePal();
  if (g < at) return null;
  const w = h * 0.46;
  const sw = Math.max(3, h / 120);
  const draw = interpolate(g, [at, at + 12], [0, 1], clamp);
  const draw2 = interpolate(g, [at + 4, at + 16], [0, 1], clamp);
  const pw = w * 0.34, ph = h * 0.3;
  const px = x + w * 0.11, py = y + h * 0.56; // lower-left panel: the one that gets chiseled out
  const panels: [number, number, number, number][] = [[x + w * 0.11, y + h * 0.08, pw, h * 0.38], [x + w * 0.55, y + h * 0.08, pw, h * 0.38], [x + w * 0.55, py, pw, ph]];
  const out = done ? 1 : interpolate(f, [cut, cut + 14], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const flash = done ? 0 : interpolate(g, [cut - 4, cut, cut + 6], [0, 1, 0], clamp);
  const gone = done || g >= cut;
  const st = (p: number, width = sw, op = 1) => ({fill: 'none', stroke: pal.mark, strokeWidth: width, strokeOpacity: op, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const,
    pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p});
  const twice = (d: (k: string) => string, key: string, width = sw) => (
    <React.Fragment key={key}>
      <path d={d(key)} {...st(draw, width)} />
      <path d={d(key + 'b')} {...st(draw2, width * 0.45, 0.55)} />
    </React.Fragment>
  );
  const bevel = (a: number, b: number, c: number, d: number, k: string) => wobblyRect(a + c * 0.14, b + d * 0.08, c * 0.72, d * 0.84, k, 3);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <BoilDefs id={bid} />
      <g filter={boilUrl(bid, g)}>
      {/* jamb and sill */}
      {twice((k) => `M${x - w * 0.08},${y + h + 2} L${x - w * 0.08 + jit(k, 1, 4)},${y - h * 0.04} L${x + w * 1.08 + jit(k, 2, 4)},${y - h * 0.04 + jit(k, 3, 4)} L${x + w * 1.08},${y + h + 2}`, 'jamb', sw * 0.8)}
      {twice((k) => `M${x - w * 0.2},${y + h + sw * 2 + jit(k, 1, 3)} L${x + w * 1.2},${y + h + sw * 2 + jit(k, 2, 3)}`, 'sill', sw * 1.1)}
      {/* the opening behind the panel: dark and splintered once the panel is gone */}
      {gone && (
        <g opacity={done ? 1 : Math.min(1, out * 2)}>
          <path d={raggedRect(px, py, pw, ph, 'hole')} fill="#050403" stroke={pal.subject} strokeWidth={sw * 0.9} strokeLinejoin="round" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const ex = i < 3 ? px + pw * (0.2 + i * 0.3) : px + (i === 3 ? -6 : pw + 6), ey = i < 3 ? py - 4 : py + ph * (0.3 + (i - 3) * 0.25);
            const dx = i < 3 ? jit('cm', i, 10) : (i === 3 ? -14 : 14), dy = i < 3 ? -16 : jit('cm', i, 8);
            return <line key={i} x1={ex} y1={ey} x2={ex + dx} y2={ey + dy} stroke={pal.subject} strokeWidth={sw * 0.6} strokeLinecap="round" />;
          })}
        </g>
      )}
      {twice((k) => wobblyRect(x, y, w, h, k), 'frame', sw * 1.15)}
      {panels.map(([a, b, c, d], i) => (
        <React.Fragment key={i}>
          {twice((k) => wobblyRect(a, b, c, d, k), `p${i}`)}
          <path d={bevel(a, b, c, d, `bv${i}`)} {...st(draw2, sw * 0.5, 0.45)} />
        </React.Fragment>
      ))}
      {/* hinges, knob, keyhole */}
      {[0.14, 0.82].map((v, i) => <path key={i} d={wobblyRect(x - sw * 1.5, y + h * v, sw * 4, h * 0.07, `hg${i}`, 2)} {...st(draw2, sw * 0.7)} />)}
      <circle cx={x + w * 0.88} cy={y + h * 0.52} r={sw * 1.8} fill={pal.mark} opacity={draw} />
      <path d={`M${x + w * 0.88},${y + h * 0.56} l0,${h * 0.03}`} stroke={pal.mark} strokeWidth={sw * 0.8} strokeLinecap="round" opacity={draw2} />
      {/* the panel itself: falls away at `cut` */}
      {out < 1 && (
        <g transform={`translate(0 ${out * h * 0.5}) rotate(${out * 24} ${px + pw / 2} ${py + ph / 2})`} opacity={1 - out}>
          {g >= cut - 4 && <path d={wobblyRect(px, py, pw, ph, 'p3')} fill={pal.subject} fillOpacity={0.3 + flash * 0.55} stroke="none" />}
          {twice((k) => wobblyRect(px, py, pw, ph, k), 'p3')}
          <path d={bevel(px, py, pw, ph, 'bv3')} {...st(draw2, sw * 0.5, 0.45)} />
        </g>
      )}
      </g>
      {label && g >= at + 8 && <text x={x + w / 2} y={y + h + 80} textAnchor="middle" fontFamily='"Nanum Pen Script"' fontSize={62} fill={pal.mark}
        style={{paintOrder: 'stroke', stroke: '#111', strokeWidth: 6}}>{label}</text>}
    </svg>
  );
};

/** An index card on the desk headed BLAMED: names are written on as they're accused and struck through when cleared. */
export const Blamed: React.FC<{x: number; y: number; at: number; rot?: number; rows: {name: string; at: number; clear?: number}[]; w?: number}> = ({x, y, at, rot = -3, rows, w = 620}) => {
  const g = useGFrame();
  const pal = usePal();
  if (g < at) return null;
  const k = interpolate(g, [at, at + 5], [0, 1], {...clamp, easing: (u) => 1 - Math.pow(1 - u, 3) * (1 - 2.2 * u * (1 - u))});
  const rowH = 86;
  const h = 150 + rows.length * rowH;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${0.6 + 0.4 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2), transformOrigin: 'center'}}>
      <div style={{position: 'absolute', inset: 0, background: '#efe7d6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
        backgroundImage: 'linear-gradient(transparent 0, transparent 118px, rgba(214,74,74,0.55) 118px, rgba(214,74,74,0.55) 121px, transparent 121px), repeating-linear-gradient(transparent 0, transparent 84px, rgba(70,110,160,0.35) 84px, rgba(70,110,160,0.35) 86px)',
        backgroundPosition: '0 0, 0 36px'}} />
      <div style={{position: 'absolute', left: 34, top: 26, background: boxOf(pal), padding: '2px 16px', fontFamily: JF.display, fontSize: 58, color: '#111', transform: 'rotate(-2deg)'}}>BLAMED</div>
      {rows.map((r, i) => {
        if (g < r.at) return null;
        const p = interpolate(g, [r.at, r.at + 10], [0, 1], clamp);
        const top = 136 + i * rowH;
        const sp = r.clear !== undefined ? interpolate(g, [r.clear, r.clear + 5], [0, 1], clamp) : 0;
        return (
          <div key={i} style={{position: 'absolute', left: 40, top, width: w - 80, height: rowH}}>
            <div style={{fontFamily: '"Nanum Pen Script"', fontSize: 66, lineHeight: 1, color: '#1b2a33', whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`}}>{r.name}</div>
            {sp > 0 && (
              <svg style={{position: 'absolute', left: -10, top: 0, overflow: 'visible'}} width={w - 60} height={rowH}>
                <path d={`M0,${38} Q${(w - 60) / 2},${26} ${(w - 60) * sp},${32}`} fill="none" stroke={boxOf(pal)} strokeWidth={9} strokeLinecap="round" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};

/** A drawn clock: teal rim and ticks, cream hands. The minute hand steps from `m0` to `m1` minutes past 12 between frames a and b. */
export const Clock: React.FC<{cx: number; cy: number; r: number; at: number; a: number; b: number; m0?: number; m1?: number; glow?: number}> = ({cx, cy, r, at, a, b, m0 = 0, m1 = 15, glow = 0}) => {
  const g = useGFrame();
  const bid = useBoilId();
  const pal = usePal();
  if (g < at) return null;
  const draw = interpolate(g, [at, at + 10], [0, 1], clamp);
  const m = b > a ? Math.floor(interpolate(g, [a, b], [m0, m1], clamp)) : m0;
  const ma = (m / 60) * Math.PI * 2 - Math.PI / 2;
  const ha = ((m / 60) / 12) * Math.PI * 2 - Math.PI / 2;
  const ring = Array.from({length: 77}, (_, i) => {
    const t = (i / 70) * Math.PI * 2 - Math.PI / 2;
    const w = 1 + jit('ck', i, 0.02) + (i / 70) * 0.025;
    return `${i ? 'L' : 'M'}${(cx + Math.cos(t) * r * w).toFixed(1)},${(cy + Math.sin(t) * r * w).toFixed(1)}`;
  }).join(' ');
  const wedge = m > 0 ? `M${cx},${cy} L${cx},${cy - r * 0.9} A${r * 0.9},${r * 0.9} 0 0 1 ${cx + Math.cos(ma) * r * 0.9},${cy + Math.sin(ma) * r * 0.9} Z` : '';
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <BoilDefs id={bid} />
      {glow > 0 && <circle cx={cx} cy={cy} r={r * 1.5} fill={pal.subject} opacity={0.12 * glow} />}
      {wedge && <path d={wedge} fill={pal.subject} opacity={0.75} />}
      <g filter={boilUrl(bid, g)}>
      <path d={ring} fill="none" stroke={pal.mark} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <path d={ring} transform={`rotate(4 ${cx} ${cy}) translate(${cx * 0.012} ${cy * 0.012}) scale(0.988)`} fill="none" stroke={pal.mark} strokeOpacity={0.5} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {draw >= 1 && Array.from({length: 12}, (_, i) => {
        const t = (i / 12) * Math.PI * 2;
        const r0 = i % 3 === 0 ? 0.74 : 0.84;
        return <line key={i} x1={cx + Math.sin(t) * r * r0} y1={cy - Math.cos(t) * r * r0} x2={cx + Math.sin(t) * r * 0.95} y2={cy - Math.cos(t) * r * 0.95} stroke={pal.mark} strokeWidth={i % 3 === 0 ? 9 : 5} strokeLinecap="round" />;
      })}
      {draw >= 1 && [[12, 0], [3, 1], [6, 2], [9, 3]].map(([n, q]) => {
        const t = (q / 4) * Math.PI * 2;
        return <text key={n} x={cx + Math.sin(t) * r * 0.58} y={cy - Math.cos(t) * r * 0.58 + r * 0.075} textAnchor="middle" fontFamily='"Abril Fatface"' fontSize={r * 0.2} fill="#f4efe6" opacity={0.9}>{n}</text>;
      })}
      {draw >= 1 && (
        <>
          <line x1={cx} y1={cy} x2={cx + Math.cos(ha) * r * 0.5} y2={cy + Math.sin(ha) * r * 0.5} stroke="#f4efe6" strokeWidth={14} strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={cx + Math.cos(ma) * r * 0.8} y2={cy + Math.sin(ma) * r * 0.8} stroke="#f4efe6" strokeWidth={9} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={14} fill="#f4efe6" />
        </>
      )}
      </g>
    </svg>
  );
};

/** The minute the clock shows at frame f (for tick sounds): one tick per minute step. */
export const clockTicks = (a: number, b: number, m0 = 0, m1 = 15) => Array.from({length: m1 - m0}, (_, i) => Math.round(a + ((i + 1) / (m1 - m0)) * (b - a)));

/** An axe-shaped shadow sliding across the frame between frames a and b, as if someone passed a lamp. Never gore: just a shape. */
export const Shadow: React.FC<{a: number; b: number; y?: number; size?: number; opacity?: number; dir?: 1 | -1}> = ({a, b, y = 140, size = 900, opacity = 0.55, dir = 1}) => {
  const f = useCurrentFrame();
  if (f < a || f > b) return null;
  const u = interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const x = dir > 0 ? -size + u * (1920 + size * 1.4) : 1920 + size * 0.4 - u * (1920 + size * 1.4);
  const o = interpolate(u, [0, 0.15, 0.85, 1], [0, opacity, opacity, 0], clamp);
  const s = size / 100;
  return (
    <>
    {/* the lamp light the shadow falls across: without it a shadow on the dark desk can't be seen */}
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: o / opacity,
      background: 'radial-gradient(ellipse 900px 620px at 50% 46%, rgba(255,250,238,0.2) 0%, rgba(255,250,238,0.07) 55%, transparent 100%)'}} />
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', opacity: o, filter: 'blur(12px)'}} width={size} height={size}>
      <g transform={`scale(${s}) rotate(${-18 + u * 10} 50 50)`}>
        <path d="M47,14 C49,40 51,70 48,106 L55,106 C57,70 56,40 54,14 Z" fill="#030201" />
        <path d="M45,8 L57,8 L59,24 L45,26 C38,27 30,31 22,40 C18,44 15,50 13,56 C9,44 9,26 14,12 C16,6 20,2 24,0 C30,6 37,8 45,8 Z" fill="#030201" />
        <path d="M57,10 L64,13 L64,21 L58,23 Z" fill="#030201" />
      </g>
    </svg>
    </>
  );
};

// ---------------------------------------------------------------------------------------------
// Sound

/** A music cue under part of a chapter (chapter narration frames), faded in and out; `skip` starts that many seconds in. */
export const Bed: React.FC<{src: string; from: number; to: number; vol?: number; fadeIn?: number; fadeOut?: number; skip?: number}> = ({src, from, to, vol = 0.15, fadeIn = 20, fadeOut = 20, skip = 0}) =>
  hasFile(src) ? (
    <Sequence from={Math.max(0, from)} durationInFrames={Math.max(1, to - from)} layout="none">
      <Audio src={staticFile(src)} startFrom={Math.round(skip * 30)} volume={(f) => interpolate(f, [0, fadeIn, Math.max(fadeIn + 1, to - from - fadeOut), to - from], [0, vol, vol, 0], clamp)} />
    </Sequence>
  ) : null;

/** The house sound rules from lists of cue words: a whoosh per cut, a stamp per title, the marker per note, a tick per pop. */
export const Sounds: React.FC<{t: TL; cuts: number[]; stamps?: string[]; writes?: string[]; ticks?: (string | number)[]; booms?: string[]; extra?: [number, string, number][]}> = ({
  t, cuts, stamps = [], writes = [], ticks = [], booms = [], extra = [],
}) => (
  <>
    {cuts.slice(1).map((f, i) => <Sfx key={`w${i}`} at={f} src="sfx/whoosh.wav" volume={0.13} />)}
    {stamps.map((c, i) => <Sfx key={`s${i}`} at={t.at(c)} src="sfx/stamp.wav" volume={0.22} />)}
    {writes.map((c, i) => <Sfx key={`n${i}`} at={t.at(c) - 2} src={WRITE.src} volume={WRITE.volume} />)}
    {ticks.map((c, i) => <Sfx key={`t${i}`} at={typeof c === 'number' ? c : t.at(c)} src="sfx/tick.wav" volume={0.2} />)}
    {booms.map((c, i) => <Sfx key={`b${i}`} at={t.at(c)} src="sfx/boom.wav" volume={0.42} />)}
    {extra.map(([f, src, v], i) => <Sfx key={`x${i}`} at={f} src={src} volume={v} />)}
  </>
);

export {Note};

// ---------------------------------------------------------------------------------------------
// One-off pieces

/** Chalk on a dark sidewalk: the message writes on word by word as the narrator reads it. */
export const Chalk: React.FC<{t: TL; phrase: string; x: number; y: number; w: number; size?: number}> = ({t, phrase, x, y, w, size = 92}) => {
  const f = useCurrentFrame();
  const i0 = t.idx(phrase);
  const n = phrase.split(/\s+/).length;
  const words = t.words.slice(i0, i0 + n);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: '"Nanum Pen Script"', fontSize: size, lineHeight: 1.05, color: '#ece9e2', transform: 'rotate(-3deg)',
      textShadow: '0 0 1px rgba(255,255,255,0.6), 0 0 6px rgba(255,255,255,0.15)', filter: 'url(#chalk)'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="chalk"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="3" /><feComponentTransfer><feFuncA type="table" tableValues="0 0.9 1" /></feComponentTransfer></filter>
      </svg>
      {words.map((wd, i) => {
        const at = Math.round(wd.s * FPS) - 2;
        const k = interpolate(f, [at, at + 6], [0, 1], clamp);
        return <span key={i} style={{display: 'inline-block', paddingRight: '0.3em', clipPath: `inset(-20% ${(1 - k) * 100}% -20% -5%)`}}>{wd.w.replace(/["“”]/g, '')}</span>;
      })}
    </div>
  );
};

/** The sidewalk: dark grey pavement with grain and the joints of the slabs. */
export const Pavement: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #3a3834 0%, #23211e 60%, #121110 100%)'}}>
    <AbsoluteFill style={{opacity: 0.5, mixBlendMode: 'overlay'}}>
      <svg width="100%" height="100%"><filter id="pave"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed="9" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#pave)" /></svg>
    </AbsoluteFill>
    <svg style={{position: 'absolute', inset: 0}} width={1920} height={1080}>
      {[-200, 700, 1600].map((x, i) => <line key={i} x1={x} y1={0} x2={x + 320} y2={1080} stroke="#0b0a09" strokeWidth={7} opacity={0.7} />)}
      <line x1={0} y1={820} x2={1920} y2={760} stroke="#0b0a09" strokeWidth={7} opacity={0.7} />
    </svg>
  </AbsoluteFill>
);

/**
 * The witnesses' description as a police sketch: a faceless, heavy-set man in a slouch hat and dark suit, drawn in teal
 * and gone over twice. `parts` reveal the hat, the body and the suit as each is spoken (frames; omit to draw all at `at`).
 */
export const Witness: React.FC<{x: number; y: number; h: number; at: number; hat?: number; body?: number; suit?: number}> = ({x, y, h, at, hat, body, suit}) => {
  const g = useGFrame();
  const bid = useBoilId();
  const pal = usePal();
  if (g < at) return null;
  const s = h / 100;
  const p = (from: number | undefined) => interpolate(g, [from ?? at, (from ?? at) + 12], [0, 1], clamp);
  const line = (d: string, k: number, from?: number, op = 1, w = 0.9) => (
    <path d={d} fill="none" stroke={pal.mark} strokeWidth={w} strokeOpacity={op} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p(from) * (k ? 0.96 : 1)}
      transform={k ? 'translate(0.5 0.4)' : undefined} />
  );
  const both = (d: string, from?: number, w = 0.9) => <>{line(d, 0, from, 1, w)}{line(d, 1, from, 0.45, w * 0.45)}</>;
  // the figure lives in a 64 x 100 box
  const HEAD = 'M27,17 C26,23 28,28 32,28 C36,28 38,23 37,17';
  const CROWN = 'M27,17 C26.5,10.5 37.5,10.5 37,17'; // top of the head, until the hat covers it
  const HAT = 'M12,17 C18,13 25,13 32,13 C40,13 47,14 52,18 C47,20 42,18 32,18 C22,18 17,20 12,17 Z M21,14 C21,7 25,4 32,4 C39,4 43,7 43,14 M30,4.5 C31,7 33,7 34,4.5 M21.5,11.5 C28,13 36,13 42.5,11.5';
  const COAT = 'M18,32 C22,29 27,28.5 32,30 C37,28.5 42,29 46,32 L52,60 L47,61 L46,82 L18,82 L17,61 L12,60 Z M32,30 L28,44 L32,56 L36,44 Z';
  const LEGS = 'M20,82 L20,98 L30,98 L31,84 M33,84 L34,98 L44,98 L44,82';
  const SUIT = 'M28,44 L22,40 M36,44 L42,40 M24,58 L30,58 M24,62 L30,62 M32,58 L32,80 M14,60 C13,52 15,44 18,36 M50,60 C51,52 49,44 46,36';
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={64 * s} height={100 * s}>
      <BoilDefs id={bid} />
      <g filter={boilUrl(bid, g)}><g transform={`scale(${s})`}>
        {/* the face stays blank: nobody saw it */}
        <path d={`${HEAD} Z`} fill="#0d0c09" opacity={p(body) * 0.8} />
        {both(HEAD, body)}
        <g opacity={1 - p(hat)}>{both(CROWN, body)}</g>
        {both(HAT, hat, 1)}
        {both(COAT, body, 1.1)}
        {both(LEGS, body)}
        {both(SUIT, suit, 0.7)}
        <text x={32} y={25} textAnchor="middle" fontFamily='"Nanum Pen Script"' fontSize={9} fill={pal.mark} opacity={p(body) * 0.85}>?</text>
      </g></g>
    </svg>
  );
};

/** A plain bone statement in Playfair that just fades in: for facts in the heavy chapter, no marks. */
export const Plain: React.FC<{text: string; x: number; y: number; at: number; size?: number; w?: number; color?: string; out?: number}> = ({text, x, y, at, size = 60, w = 1500, color = '#EDE7DC', out = 1e7}) => {
  const g = useGFrame();
  if (g < at || g >= out) return null;
  return <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: JF.heavy, fontWeight: 900, fontSize: size, lineHeight: 1.25, color, textShadow: '0 3px 14px #000',
    opacity: interpolate(g, [at, at + 8], [0, 1], clamp)}}>{text}</div>;
};
