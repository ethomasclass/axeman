// Charts in the channel's look: dark desk paper, hand-jittered teal strokes, graphics stepping at 12 fps,
// ONE subject in coral (the point of the chart) and every other mark in bone greys. Labels sit on the marks
// (no legends), numbers in Abril, words in Nanum Pen Script, sources in the mono tag.
import React from 'react';
import {interpolate, random} from 'remotion';
import {clamp, FONT, PAL, useGFrame} from './look';

/** Bone greys for the non-subject marks, light to dark. Checked against the desk: all >= 3:1. */
export const GREYS = ['rgba(237,231,220,0.62)', 'rgba(237,231,220,0.40)', 'rgba(237,231,220,0.24)'];
const DESK = '#16140f';

const fmt = (n: number) => n.toLocaleString('en-US');

/** A pie that sweeps on slice by slice. Labels are written next to each slice with a short leader line. */
export type Slice = {label: string; value: number; subject?: boolean; pct?: string; note?: string; labelAt?: [number, number]};
export const Pie: React.FC<{cx: number; cy: number; r: number; slices: Slice[]; at: number; per?: number; title?: string; seed?: number}> = ({
  cx, cy, r, slices, at, per = 10, seed = 1,
}) => {
  const g = useGFrame();
  const total = slices.reduce((s, x) => s + x.value, 0);
  let a0 = -Math.PI / 2;
  const pt = (a: number, rr = r) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  // teal hand-traced rim: a slightly open loop that draws on first
  const rim = Array.from({length: 73}, (_, i) => {
    const a = -Math.PI / 2 + (i / 72) * Math.PI * 2 * 0.985;
    const rr = r + 14 + (random(`rim${seed}${i}`) - 0.5) * 6;
    return `${i ? 'L' : 'M'}${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`;
  }).join(' ');
  const rimP = interpolate(g, [at, at + 12], [0, 1], clamp);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={rim} fill="none" stroke={PAL.teal} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - rimP} />
      {slices.map((s, i) => {
        const frac = s.value / total;
        const start = a0;
        a0 += frac * Math.PI * 2;
        const p = interpolate(g, [at + 8 + i * per, at + 8 + i * per + per * 0.8], [0, 1], clamp);
        if (p <= 0) return null;
        const end = start + frac * Math.PI * 2 * p;
        const [x1, y1] = pt(start);
        const [x2, y2] = pt(end);
        const large = end - start > Math.PI ? 1 : 0;
        const fill = s.subject ? PAL.coral : GREYS[i % GREYS.length];
        const d = frac >= 0.999 ? `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0` : `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
        const mid = start + frac * Math.PI;
        const [lx, ly] = s.labelAt ?? pt(mid, r + 90);
        const [ex, ey] = pt(mid, r * 0.82);
        const showLabel = p >= 1;
        const right = lx >= cx;
        return (
          <g key={s.label}>
            <path d={d} fill={fill} stroke={DESK} strokeWidth={5} strokeLinejoin="round" />
            {showLabel && (
              <>
                <line x1={ex} y1={ey} x2={lx + (right ? -16 : 16)} y2={ly - 14} stroke={PAL.teal} strokeWidth={4} strokeLinecap="round" />
                <text x={lx} y={ly} textAnchor={right ? 'start' : 'end'} style={{fontFamily: FONT.display, fontSize: 64, fill: s.subject ? PAL.coral : PAL.cream}}>{s.pct ?? `${Math.round(frac * 100)}%`}</text>
                <text x={lx} y={ly + 62} textAnchor={right ? 'start' : 'end'} style={{fontFamily: FONT.hand, fontSize: 46 * 1.55 * 0.8, fill: PAL.teal, paintOrder: 'stroke', stroke: '#111', strokeWidth: 6}}>{s.label}</text>
                {s.note && <text x={lx} y={ly + 118} textAnchor={right ? 'start' : 'end'} style={{fontFamily: FONT.hand, fontSize: 40 * 1.55 * 0.8, fill: 'rgba(255,255,255,0.85)', paintOrder: 'stroke', stroke: '#111', strokeWidth: 6}}>{s.note}</text>}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/** Vertical bars on one baseline; bars grow in order. `subject` marks the bar(s) in coral; the rest are bone. */
export type Bar = {label: string; value: number; subject?: boolean; show?: string};
export const Bars: React.FC<{x: number; y: number; w: number; h: number; bars: Bar[]; max: number; at: number; per?: number; valueEvery?: number[]; unit?: string; seed?: number}> = ({
  x, y, w, h, bars, max, at, per = 4, valueEvery, unit = '', seed = 2,
}) => {
  const g = useGFrame();
  const slot = w / bars.length;
  const bw = slot * 0.62;
  const base = Array.from({length: 24}, (_, i) => `${i ? 'L' : 'M'}${x - 20 + ((w + 40) * i) / 23},${y + h + (random(`b${seed}${i}`) - 0.5) * 4}`).join(' ');
  const baseP = interpolate(g, [at, at + 8], [0, 1], clamp);
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={base} fill="none" stroke={PAL.teal} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - baseP} />
      {bars.map((b, i) => {
        const p = interpolate(g, [at + 6 + i * per, at + 6 + i * per + 8], [0, 1], clamp);
        const bh = (b.value / max) * h * p;
        const bx = x + i * slot + (slot - bw) / 2;
        const showVal = p >= 1 && (!valueEvery || valueEvery.includes(i));
        return (
          <g key={b.label}>
            {p > 0 && <path d={`M${bx},${y + h} L${bx},${y + h - bh + 4} Q${bx},${y + h - bh} ${bx + 4},${y + h - bh} L${bx + bw - 4},${y + h - bh} Q${bx + bw},${y + h - bh} ${bx + bw},${y + h - bh + 4} L${bx + bw},${y + h} Z`}
              fill={b.subject ? PAL.coral : GREYS[0]} />}
            <text x={bx + bw / 2} y={y + h + 46} textAnchor="middle" style={{fontFamily: FONT.mono, fontSize: 28, letterSpacing: 1, fill: 'rgba(255,255,255,0.85)', opacity: p > 0 ? 1 : 0.35}}>{b.label}</text>
            {showVal && <text x={bx + bw / 2} y={y + h - bh - 16} textAnchor="middle" style={{fontFamily: FONT.display, fontSize: b.subject ? 46 : 38, fill: b.subject ? PAL.coral : PAL.cream}}>{b.show ?? fmt(b.value) + unit}</text>}
          </g>
        );
      })}
    </svg>
  );
};

/** One horizontal bar split into parts (part-to-whole without a pie): e.g. cotton vs. everything else exported. */
export const SplitBar: React.FC<{x: number; y: number; w: number; h: number; parts: {label: string; value: number; subject?: boolean}[]; at: number}> = ({x, y, w, h, parts, at}) => {
  const g = useGFrame();
  const total = parts.reduce((s, p) => s + p.value, 0);
  let cx = x;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {parts.map((pt, i) => {
        const pw = (pt.value / total) * w;
        const p = interpolate(g, [at + i * 10, at + i * 10 + 10], [0, 1], clamp);
        const x0 = cx;
        cx += pw;
        return (
          <g key={pt.label}>
            {p > 0 && <rect x={x0 + 2} y={y} width={Math.max(0, pw * p - 4)} height={h} rx={4} fill={pt.subject ? PAL.coral : GREYS[1]} />}
            {p >= 1 && (
              <>
                <text x={x0 + 24} y={y + h / 2 + 24} style={{fontFamily: FONT.display, fontSize: 72, fill: pt.subject ? PAL.ink : PAL.cream}}>{Math.round((pt.value / total) * 100)}%</text>
                <text x={x0 + 8} y={y + h + 74} style={{fontFamily: FONT.hand, fontSize: 46 * 1.55 * 0.8, fill: pt.subject ? PAL.coral : PAL.teal, paintOrder: 'stroke', stroke: '#111', strokeWidth: 6}}>{pt.label}</text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/** Horizontal comparison bars (one row each), with an optional stacked row: value of enslaved people vs. railroads + factories. */
export type HRow = {label: string; parts: {label: string; value: number; subject?: boolean}[]};
export const HBars: React.FC<{x: number; y: number; w: number; rowH: number; gap: number; rows: HRow[]; max: number; at: number; unit?: (v: number) => string}> = ({
  x, y, w, rowH, gap, rows, max, at, unit = (v) => `$${(v / 1e9).toFixed(1)} billion`,
}) => {
  const g = useGFrame();
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {rows.map((row, ri) => {
        const ry = y + ri * (rowH + gap);
        const p = interpolate(g, [at + ri * 14, at + ri * 14 + 12], [0, 1], clamp);
        let cx = x;
        const sum = row.parts.reduce((s, q) => s + q.value, 0);
        return (
          <g key={row.label}>
            <text x={x} y={ry - 18} style={{fontFamily: FONT.hand, fontSize: 48 * 1.55 * 0.8, fill: row.parts.some((q) => q.subject) ? PAL.coral : PAL.teal, paintOrder: 'stroke', stroke: '#111', strokeWidth: 6}}>{row.label}</text>
            {row.parts.map((q, qi) => {
              const pw = (q.value / max) * w * p;
              const x0 = cx;
              cx += pw;
              return (
                <g key={q.label}>
                  {pw > 0 && <rect x={x0 + (qi ? 3 : 0)} y={ry} width={Math.max(0, pw - (qi ? 3 : 0))} height={rowH} rx={4} fill={q.subject ? PAL.coral : GREYS[qi % 2 ? 1 : 0]} />}
                  {p >= 1 && row.parts.length > 1 && <text x={x0 + 18} y={ry + rowH / 2 + 14} style={{fontFamily: FONT.mono, fontSize: 30, letterSpacing: 1, fill: PAL.ink}}>{q.label.toUpperCase()}</text>}
                </g>
              );
            })}
            {p >= 1 && <text x={x + (sum / max) * w + 24} y={ry + rowH / 2 + 22} style={{fontFamily: FONT.display, fontSize: 60, fill: row.parts.some((q) => q.subject) ? PAL.coral : PAL.cream}}>{unit(sum)}</text>}
          </g>
        );
      })}
    </svg>
  );
};

/** Big number ticking up (for the running census counter). */
export const CountUp: React.FC<{from: number; to: number; at: number; dur?: number; x: number; y: number; size?: number; color?: string; label?: string}> = ({
  from, to, at, dur = 24, x, y, size = 120, color = PAL.cream, label,
}) => {
  const g = useGFrame();
  const v = Math.round(interpolate(g, [at, at + dur], [from, to], clamp));
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{fontFamily: FONT.display, fontSize: size, color, lineHeight: 1, textShadow: '0 6px 24px rgba(0,0,0,0.7)'}}>{fmt(v)}</div>
      {label && <div style={{fontFamily: FONT.mono, fontSize: 28, letterSpacing: 2, color: 'rgba(255,255,255,0.85)', marginTop: 14, textTransform: 'uppercase'}}>{label}</div>}
    </div>
  );
};
