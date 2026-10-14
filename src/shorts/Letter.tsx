// YouTube Short (1080x1920): "Play jazz, or get the axe." The Axeman letter of March 1919 in about 45 seconds.
// Its own narration (script/short_letter.txt, voiced at the channel pace) and the main video's kit, laid out for a
// phone: titles high, the picture in the middle, captions low, the bottom ~400 px and the right rail left for
// YouTube's buttons. The last line cuts straight back to the first, so the Short loops.
import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/short_letter.words.json';
import {clamp} from '../lib/anim';
import {FitEdge, Finish, Highlight, JF, Note, PALETTES, PaletteCtx, type Place, StepCtx, Tint, Traced, useGFrame, usePal} from '../kit/Kit';
import {makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {Bed, Clip, Clock, clockTicks, Desk, Door, DropCard, LOOK, Shadow, sizeOf, Sounds} from '../kit/ax';
import {WRITE} from '../kit/common';
import {MASKS} from '../masks';
import {M} from '../music';
import {P} from '../pics';

const N = words as Narration;
export const SW = 1080;
export const SH = 1920;
const TAIL = 14; // frames after the last word: a beat, then the loop
export const SHORT_LETTER_FRAMES = Math.ceil(N.duration * 30) + TAIL;

/** Source tag, kept above YouTube's title and channel overlay. */
const VTag: React.FC<{text: string; y?: number}> = ({text, y = 1452}) => (
  <div style={{position: 'absolute', left: 60, top: y, width: 860, fontFamily: JF.mono, fontSize: 19, lineHeight: 1.35, letterSpacing: 1, color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase', textShadow: '0 1px 6px rgba(0,0,0,0.95)'}}>{text}</div>
);

/** A picture filling the whole vertical frame, black and white, pushing in slowly, with an optional tinted subject. */
const VPic: React.FC<{src: string; a: number; fx?: number; fy?: number; z0?: number; z1?: number; dim?: number; look?: keyof typeof LOOK;
  mask?: typeof MASKS.eagleCornet; traceAt?: number}> = ({src, a, fx, fy, z0 = 1.02, z1 = 1.1, dim = 0.35, look = 'bw', mask, traceAt = 1e7}) => {
  const f = useCurrentFrame();
  const size = sizeOf(src);
  const z = interpolate(f, [a, a + 150], [z0, z1], clamp);
  const sc = Math.max(SW / size[0], SH / size[1]) * z;
  const cx = fx ?? size[0] / 2;
  const cy = fy ?? size[1] / 2;
  const place: Place = {left: Math.min(0, Math.max(SW - size[0] * sc, SW / 2 - cx * sc)), top: Math.min(0, Math.max(SH - size[1] * sc, SH / 2 - cy * sc)), scale: sc};
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: place.left, top: place.top, width: size[0] * sc, height: size[1] * sc, filter: LOOK[look]}} />
      {mask && <Tint mask={mask.alpha} place={place} size={size} />}
      {mask && <Traced paths={mask.data.shapes.subject} place={place} at={traceAt} dur={10} width={7} part={0.92} />}
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,${dim + 0.35}) 0%, rgba(0,0,0,${dim}) 30%, rgba(0,0,0,${dim}) 62%, rgba(0,0,0,${dim + 0.45}) 100%)`}} />
    </AbsoluteFill>
  );
};

/** Caption chunks: phrases end at punctuation, and a long phrase splits into balanced pieces of up to about 23
 * characters (one or two lines), never leaving a lone trailing word. Returns word indexes. */
const SMALL = new Set(['a', 'an', 'the', 'to', 'of', 'by', 'in', 'at', 'on', 'with', 'and', 'or', 'for', 'from', 'that']);
export const captionChunks = (ws: {w: string}[]): number[][] => {
  const out: number[][] = [];
  let phrase: number[] = [];
  const flush = () => {
    if (!phrase.length) return;
    const lens = phrase.map((i) => ws[i].w.length + 1);
    const total = lens.reduce((a, b) => a + b, 0);
    const parts = Math.ceil(total / 24);
    const target = total / parts;
    let cur: number[] = [];
    let acc = 0;
    let made = 0;
    phrase.forEach((i, k) => {
      cur.push(i);
      acc += lens[k];
      if (made < parts - 1 && acc >= target * (made + 1) - 2) {
        // never end a caption on "a", "the", "by"...: carry them to the next one
        const carry: number[] = [];
        while (cur.length > 1 && SMALL.has(ws[cur[cur.length - 1]].w.toLowerCase())) carry.unshift(cur.pop()!);
        out.push(cur);
        cur = carry;
        made++;
      }
    });
    if (cur.length) out.push(cur);
    phrase = [];
  };
  ws.forEach((w, i) => {
    phrase.push(i);
    if (/[.,?!:]["”]?$/.test(w.w)) flush();
  });
  flush();
  return out;
};

/** Burned-in captions: a short phrase at a time as it's spoken, the current word in orange. */
const Captions: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const pal = usePal();
  const chunks = captionChunks(t.words);
  const start = (c: number[]) => t.wordAt(c[0]) - 1;
  const k = chunks.findIndex((c, j) => f >= start(c) && (j === chunks.length - 1 || f < start(chunks[j + 1])));
  if (k < 0) return null;
  const c = chunks[k];
  const last = t.words[c[c.length - 1]];
  if (f > Math.round(last.e * 30) + 18 && (k === chunks.length - 1 || f < start(chunks[k + 1]) - 6)) return null; // gone in a long pause
  const pop = interpolate(f, [start(c), start(c) + 4], [0.86, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 60, top: 1250, width: 860, textAlign: 'center', transform: `scale(${pop})`, transformOrigin: '50% 50%',
      ...({textWrap: 'balance'} as React.CSSProperties)}}>
      {c.map((i) => {
        const w = t.words[i];
        const on = f >= Math.round(w.s * 30) - 1;
        const text = w.w.replace(/[*{}]/g, '').toUpperCase();
        return (
          <span key={i} style={{fontFamily: JF.sans, fontWeight: 800, fontSize: 76, lineHeight: 1.12, letterSpacing: 1, color: on ? pal.box : '#f4efe6',
            WebkitTextStroke: '10px #0b0a08', paintOrder: 'stroke fill', textShadow: '0 6px 18px rgba(0,0,0,0.8)', padding: '0 12px', display: 'inline-block'}}>{text}</span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------
// Scenes

/** The hook: the threat in tape over the drawn back door, an axe-shadow crossing it. */
const Hook: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={0} flicker push={0.06}>
      <Door x={330} y={640} h={560} at={-100} done />
      <Shadow a={0} b={t.at('In March')} y={600} size={720} opacity={0.6} />
      <Highlight text="PLAY JAZZ" x={110} y={250} size={150} at={-8} seed={21} rot={-3} />
      {g >= t.at('or get') && <Highlight text="OR GET THE AXE" x={70} y={450} size={112} at={t.at('or get')} seed={23} rot={-2} />}
    </Desk>
  );
};

/** March 1919: New Orleans at night, the offer made to the whole city. */
const City: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <AbsoluteFill>
      <VPic src={P.nightStreet.src} a={t.at('In March')} fy={620} z0={1.16} z1={1.24} dim={0.25} look="night" />
      {g >= t.at('In March') && <Highlight text="MARCH 1919" x={110} y={250} size={120} at={t.at('In March')} seed={25} rot={-2} />}
      <VTag text={P.nightStreet.tag} />
    </AbsoluteFill>
  );
};

/** Almost a year of attacks: the back door chiseled open. */
const Doors: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at('Since May')} flicker>
      {g >= t.at('Since May') && <Highlight text="SINCE MAY 1918" x={110} y={240} size={110} at={t.at('Since May')} seed={27} rot={-2} />}
      <Door x={330} y={470} h={620} at={t.at('Since May')} cut={t.at('chiseling')} />
      <Note text="back doors, chiseled open" x={150} y={1150} size={58} rot={-3} at={t.at('back doors')} color="#ffffff" />
    </Desk>
  );
};

/** The 1919 map of the attacks: people attacked in their own homes. */
const Homes: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('attacking')}>
    <DropCard src={P.panelMap.src} x={180} y={370} w={720} rot={-2} at={t.at('attacking') - 1} />
    <Note text="the attacks, mapped in 1919" x={150} y={220} size={60} rot={-3} at={t.at('attacking') + 8} />
    <VTag text={P.panelMap.tag} />
  </Desk>
);

/** The panic: the Times-Picayune's cartoon of a man sitting up all night with his shotgun by the door. */
const Panic: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('And the city');
  return (
    <Desk a={a} flicker>
      <TintCard src={P.cartoon.src} mask={MASKS.cartoonGuard} at={a - 1} traceAt={a + 8} w={760} x={150} y={400} rot={-2} />
      {g >= a && <Highlight text="A CITY IN PANIC" x={110} y={230} size={104} at={a + 2} seed={45} rot={-2} />}
      <VTag text={P.cartoon.tag} />
    </Desk>
  );
};

/** The dead before the letter, written onto an index card as each is named. No pictures of victims. */
const Killed: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('A grocer');
  const rows = [
    {name: 'Joseph & Catherine Maggio', when: 'May 1918', at: a},
    {name: 'Harriet Lowe', when: 'Aug. 1918', at: t.at('A woman who')},
    {name: 'Joseph Romano', when: 'Aug. 1918', at: t.at('An elderly man.')},
    {name: 'Mary Cortimiglia', when: 'March 1919', at: t.at('a little girl,')},
  ];
  const w = 940;
  const rowH = 104;
  const k = interpolate(g, [a - 1, a + 4], [0, 1], clamp);
  return (
    <Desk a={a}>
      <div style={{position: 'absolute', left: 70, top: 380, width: w, height: 170 + rows.length * rowH, transform: `scale(${0.7 + 0.3 * k}) rotate(-2deg)`, transformOrigin: 'center'}}>
        <div style={{position: 'absolute', inset: 0, background: '#efe7d6', boxShadow: '0 18px 34px rgba(0,0,0,0.6)',
          backgroundImage: `linear-gradient(transparent 0, transparent 132px, rgba(214,74,74,0.55) 132px, rgba(214,74,74,0.55) 135px, transparent 135px), repeating-linear-gradient(transparent 0, transparent ${rowH - 2}px, rgba(70,110,160,0.35) ${rowH - 2}px, rgba(70,110,160,0.35) ${rowH}px)`,
          backgroundPosition: '0 0, 0 48px'}} />
        <div style={{position: 'absolute', left: 36, top: 30, background: pal.box, padding: '2px 18px', fontFamily: JF.display, fontSize: 64, color: '#111', transform: 'rotate(-2deg)'}}>KILLED</div>
        {rows.map((r, i) => {
          if (g < r.at) return null;
          const p = interpolate(g, [r.at, r.at + 10], [0, 1], clamp);
          return (
            <div key={i} style={{position: 'absolute', left: 40, top: 152 + i * rowH, width: w - 80, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`}}>
              <span style={{fontFamily: '"Nanum Pen Script"', fontSize: 72, lineHeight: 1, color: i === rows.length - 1 ? '#a3302a' : '#1b2a33', whiteSpace: 'nowrap'}}>{r.name}</span>
              <span style={{fontFamily: JF.mono, fontSize: 26, color: '#5a5045', whiteSpace: 'nowrap'}}>{r.when}</span>
            </div>
          );
        })}
      </div>
    </Desk>
  );
};

/** The letter: dated from Hell, signed by the Axeman. */
const Letter: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at('Then the letter')} flicker push={0.08}>
      <Clip src={P.herald.src} x={220} y={480} w={640} rot={2} at={t.at('Then the letter') - 1} push={[t.at('Then the letter'), t.at('At 12:15')]} fx={790} fy={300} zoom={1.1} />
      {g >= t.at('Hell.') && <Highlight text="FROM: HELL" x={110} y={350} size={104} at={t.at('Hell.')} seed={29} rot={-3} />}
      {g >= t.at('signed: the Axeman.') + 4 && <Highlight text="— THE AXEMAN" x={240} y={1040} size={92} at={t.at('signed: the Axeman.') + 4} seed={43} rot={-4} />}
      <VTag text={P.herald.tag} />
    </Desk>
  );
};

/** The deadline: Tuesday night, 12:15. */
const Deadline: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at('At 12:15')} flicker>
      {g >= t.at('At 12:15') && <Highlight text="TUESDAY, 12:15" x={110} y={240} size={112} at={t.at('At 12:15')} seed={31} rot={-2} />}
      <Clock cx={540} cy={780} r={330} at={t.at('At 12:15') - 2} a={1e7} b={1e7} />
    </Desk>
  );
};

/** The offer: a jazz band in full swing, and you're spared. The cornet player picked out in coral. */
const Spared: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at('Every home')}>
      <TintCard src={P.eagle.src} mask={MASKS.eagleCornet} at={t.at('Every home') - 1} traceAt={t.at('full swing')} />
      {g >= t.at('jazz band') && <Highlight text="JAZZ BAND?" x={110} y={240} size={116} at={t.at('jazz band')} seed={33} rot={-3} />}
      <VTag text={P.eagle.tag} />
    </Desk>
  );
};

/** A picture on a cream card, its subject tinted coral and traced in teal. */
const TintCard: React.FC<{src: string; mask: typeof MASKS.eagleCornet; at: number; traceAt: number; w?: number; x?: number; y?: number; rot?: number}> = ({src, mask, at, traceAt, w = 900, x = 72, y = 420, rot = 2}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const size = sizeOf(src);
  const s = w / size[0];
  const place: Place = {left: 0, top: 0, scale: s};
  const pop = interpolate(f, [at, at + 5], [0.7, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${pop})`, background: '#f4efe6', padding: 18, boxShadow: '0 24px 50px rgba(0,0,0,0.75)'}}>
      <div style={{position: 'relative', width: w, height: size[1] * s}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, width: w, height: size[1] * s, filter: LOOK.bw}} />
        <Tint mask={mask.alpha} place={place} size={size} />
        <div style={{position: 'absolute', left: 0, top: 0}}><Traced paths={mask.data.shapes.subject} place={place} at={traceAt} dur={10} width={6} part={0.92} /></div>
      </div>
    </div>
  );
};

/** Everyone else: the axe. */
const TheAxe: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Anyone who')} flicker push={0.1}>
      <Shadow a={t.at('Anyone who')} b={t.at('So New Orleans')} y={520} size={760} opacity={0.65} dir={-1} />
      <Note text="no jazz?" x={140} y={330} size={110} rot={-4} at={t.at('Anyone who')} color="#ffffff" />
      <Stamp text="THE AXE" x={110} y={640} at={t.at('get the axe.', 2) + 2} size={190} color={pal.subject} rot={-3} />
    </Desk>
  );
};

/** The party: band cards slamming down on the beat of a real 1918 record. */
const Party: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const g = useGFrame();
  const a = t.at('So New Orleans');
  const b = t.at('12:15 came');
  const beat = 11; // half a bar of "At the Jazz Band Ball"
  const pics = [P.eagle, P.cave, P.marable, P.anderson, P.odjb, P.bolden, P.cave, P.marable];
  const i = Math.max(0, Math.floor((f - a) / beat));
  return (
    <Desk a={a} push={0.12}>
      {[i - 2, i - 1, i].filter((j) => j >= 0).map((j) => {
        const p = pics[j % pics.length];
        return <DropCard key={j} src={p.src} x={70 + (j % 2) * 30} y={460 + (j % 3) * 30} w={900} rot={j % 2 ? 3 : -3} at={a + j * beat} out={b} />;
      })}
      {g >= a && <Highlight text="NEW ORLEANS" x={110} y={200} size={112} at={a} seed={35} rot={-2} />}
      {g >= t.at('jazzed it out.') && <Highlight text="JAZZED IT OUT" x={150} y={340} size={104} at={t.at('jazzed it out.')} seed={37} rot={-3} />}
    </Desk>
  );
};

/** 12:15 came and went: the record stops, the clock ticks to 12:15 in silence. */
const Midnight: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('12:15 came');
  return (
    <Desk a={a} push={0.05}>
      <Clock cx={540} cy={700} r={340} at={a - 1} a={a} b={t.end('went.')} glow={g >= t.end('went.') ? 1 : 0} />
      <Note text="12:15" x={420} y={1110} size={96} rot={-3} at={t.end('went.')} />
    </Desk>
  );
};

/** Nobody was attacked that night. */
const Nobody: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const a = t.at('Nobody was');
  return (
    <Desk a={a}>
      {g >= a && <Highlight text="NOBODY WAS" x={130} y={560} size={140} at={a} seed={39} rot={-2} />}
      {g >= a + 6 && <Highlight text="ATTACKED" x={190} y={760} size={140} at={a + 6} seed={41} rot={-3} />}
      <Note text="that night" x={360} y={1000} size={90} rot={-4} at={t.at('that night.')} />
    </Desk>
  );
};

/** The turn: a rival paper called it a "joke-letter" at the time (marked in the clipping's own pixels). */
const Prank: React.FC<{t: TL}> = ({t}) => {
  const a = t.at('The letter was');
  return (
    <Desk a={a}>
      <Clip src={P.herald.src} x={230} y={400} w={620} rot={-2} at={a - 1} push={[a, a + 70]} fx={900} fy={520} zoom={1.15}
        marks={[{at: a + 10, underline: [290, 560, 1534], width: 7}, {at: a + 14, underline: [1150, 1565, 472], width: 7}]} />
      <Note text={'1919: "joke-letter"'} x={120} y={240} size={66} rot={-3} at={a + 8} />
      <VTag text={P.herald.tag} />
    </Desk>
  );
};

/** And the Axeman? Never caught. The door again: the loop back to the start. */
const Never: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('And the Axeman?')} flicker push={0.08}>
      <Door x={330} y={520} h={560} at={-100} done />
      <Stamp text="NEVER CAUGHT" x={80} y={1110} at={t.at('never caught.')} size={116} color={pal.subject} rot={-3} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Hook t={t} />],
    [at('In March') - 1, <City t={t} />],
    [at('And the city') - 1, <Panic t={t} />],
    [at('Since May') - 1, <Doors t={t} />],
    [at('attacking') - 1, <Homes t={t} />],
    [at('A grocer') - 1, <Killed t={t} />],
    [at('Then the letter') - 1, <Letter t={t} />],
    [at('At 12:15') - 1, <Deadline t={t} />],
    [at('Every home') - 1, <Spared t={t} />],
    [at('Anyone who') - 1, <TheAxe t={t} />],
    [at('So New Orleans') - 1, <Party t={t} />],
    [at('12:15 came') - 1, <Midnight t={t} />],
    [at('Nobody was') - 1, <Nobody t={t} />],
    [at('The letter was') - 1, <Prank t={t} />],
    [at('And the Axeman?') - 1, <Never t={t} />],
  ];
  const scene = useScene(cuts);
  const party = at('So New Orleans');
  const stop = at('12:15 came');
  const end = SHORT_LETTER_FRAMES;
  return (
    <>
      {scene}
      <Captions t={t} />
      {/* dark under the threat; the 1918 record bursts in for the party and is stopped dead at 12:15 */}
      <Bed src="music/r_spirits_dark.mp3" from={0} to={party + 4} vol={0.16} fadeIn={2} fadeOut={6} />
      <Bed src={M.party} from={party - 2} to={stop + 1} vol={0.28} fadeIn={3} fadeOut={1} skip={2} />
      <Bed src="sfx/crackle.wav" from={stop} to={at('The letter was') + 10} vol={0.14} fadeIn={2} fadeOut={10} />
      <Bed src="music/r_spirits_dark.mp3" from={at('The letter was') - 4} to={end} vol={0.14} fadeIn={8} fadeOut={4} skip={40} />
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['In March', 'Since May', 'Hell.', 'At 12:15', 'jazz band', 'So New Orleans', 'jazzed it out.', 'Nobody was']}
        writes={['back doors', 'A grocer', 'A woman who', 'An elderly man.', 'a little girl,', 'Anyone who', 'that night.']}
        ticks={clockTicks(stop, t.end('went.'))}
        extra={[[at('And the city') + 2, 'sfx/stamp.wav', 0.22], [at('attacking') + 6, WRITE.src, WRITE.volume], [at('The letter was') + 6, WRITE.src, WRITE.volume], [at('axe.'), 'sfx/boom.wav', 0.42], [at('get the axe.', 2) + 2, 'sfx/boom.wav', 0.42], [at('signed: the Axeman.') + 4, 'sfx/stamp.wav', 0.3], [stop - 1, 'sfx/needle.wav', 0.5], [at('never caught.'), 'sfx/boom.wav', 0.34], [at('never caught.'), 'sfx/stamp.wav', 0.3]]} />
    </>
  );
};

export const ShortLetter: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <FitEdge.Provider value={SW - 60}>
        <AbsoluteFill style={{background: '#000'}}>
          <Body />
          <Finish vignette={0.35} />
          <Sequence from={0} layout="none"><Audio src={staticFile('audio/short_letter.wav')} /></Sequence>
        </AbsoluteFill>
      </FitEdge.Provider>
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
