// Chapter 2 · The Back Door: the Maggios, May 1918. The door motif is born; the chalk message on the sidewalk.
import React from 'react';
import words from '../../public/audio/ch02_back_door.words.json';
import {interpolate} from 'remotion';
import {clamp} from '../lib/anim';
import {Highlight, Loop, Note, useGFrame, usePal} from '../kit/Kit';
import {MASKS} from '../masks';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Bed, Blamed, Chalk, Clip, Counter, Desk, Door, DropCard, Flicker, Pavement, Shadow, Sounds, SrcView} from '../kit/ax';
import {Tag} from '../kit/Kit';
import {IMG} from '../imgs';
import {P} from '../pics';

const N = words as Narration;
export const CH02_FRAMES = chapterFrames(N, LEAD);
const PANEL = IMG[P.panelMap.src] ?? [665, 792];
const MAGGIO = IMG[P.maggio.src] ?? [537, 374];

/** The Times-Picayune's own drawing of the Maggio store: we start on the building and drift down to the street names. */
const Where: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const ring = (cx: number, cy: number, rx: number, ry: number, at: number, sw: (n: number) => number) => {
    if (g < at) return null;
    const p = interpolate(g, [at, at + 10], [0, 1], clamp);
    const d = Array.from({length: 46}, (_, i) => {
      const a = -1.9 + (i / 40) * Math.PI * 2;
      return `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * (1 + i * 0.002)).toFixed(1)},${(cy + Math.sin(a) * ry * (1 + i * 0.002)).toFixed(1)}`;
    }).join(' ');
    return <path d={d} fill="none" stroke={pal.mark} strokeWidth={sw(6)} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
  };
  return (
    <Desk a={0} push={0.02}>
      <SrcView src={P.maggio.src} card look="news" keys={[[0, 300, 150, 2.4], [t.at('Uptown') + 10, 300, 175, 2.6], [t.at('Upperline'), 330, 300, 2.9]]}>
        {(sw) => (
          <>
            {ring(312, 360, 46, 13, t.at('Upperline'), sw)}
            {ring(244, 314, 14, 46, t.at('Magnolia.'), sw)}
          </>
        )}
      </SrcView>
      {g >= t.at('May') && <Highlight text="MAY 23, 1918" x={90} y={70} size={90} at={t.at('May')} seed={21} rot={-2} />}
      <Note text="uptown new orleans" x={1260} y={90} size={56} rot={-4} at={t.at('Uptown')} color="#ffffff" />
      <Note text="upperline & magnolia" x={1230} y={880} size={58} rot={-3} at={t.at('Upperline')} />
      <Tag text={P.maggio.tag} x={620} y={1036} />
    </Desk>
  );
};

/** Joseph and Catherine Maggio, and the paper's floor plan: the store in front, the bedroom in back. */
const Grocery: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Joseph Maggio')}>
      <CropCard src={P.maggio.src} size={MAGGIO} x={140} y={170} w={540} h={540} fx={122} fy={258} scale={2.35} rot={-3} at={t.at('Joseph Maggio')} mask={MASKS.maggios} traceAt={t.at('wife Catherine')}
        bw="grayscale(1) sepia(0.28) contrast(1.18)" />
      <CropCard src={P.maggio.src} size={MAGGIO} x={820} y={250} w={960} h={330} fx={385} fy={312} scale={3.4} rot={2} at={t.at('grocery')} bw="grayscale(1) sepia(0.28) contrast(1.18)">
        {(S) => {
          const [gx, gy] = S(276, 306);
          const [bx, by] = S(392, 306);
          return (
            <>
              <Loop cx={gx} cy={gy} rx={110} ry={56} at={t.at('grocery') + 6} seed={11} tilt={-3} />
              <Loop cx={bx} cy={by} rx={230} ry={70} at={t.at('in the back.')} seed={12} tilt={2} />
            </>
          );
        }}
      </CropCard>
      <Note text="Joseph & Catherine Maggio" x={150} y={790} size={54} rot={-3} at={t.at('wife Catherine')} color={pal.subject} />
      <Note text="the store in front" x={840} y={140} size={52} rot={-3} at={t.at('grocery')} color="#ffffff" />
      <Note text="home in back" x={1240} y={650} size={58} rot={-4} at={t.at('in the back.')} />
      <Note text="italian immigrants" x={160} y={900} size={60} rot={-3} at={t.at('Italian')} />
      <Tag text={P.maggio.tag} />
    </Desk>
  );
};

/** Before dawn: the drawn door loses its panel, then the real chiseled doors from the 1919 page. */
const Panel: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Sometime')} flicker>
      <Shadow a={t.at('Sometime')} b={t.at('chisels') + 10} y={120} size={900} />
      <Door x={260} y={150} h={720} at={t.at('Sometime')} cut={t.at('chisels')} />
      <Note text="before dawn" x={130} y={70} size={56} rot={-3} at={t.at('before dawn,')} color="#ffffff" />
      <CropCard src={P.panelMap.src} size={PANEL} x={1050} y={150} w={620} h={560} fx={210} fy={665} scale={2.9} rot={3} at={t.at('Just big')} bw="grayscale(1) sepia(0.2) contrast(1.25)" />
      <Note text="just big enough to crawl through" x={880} y={790} size={54} rot={-3} at={t.at('crawl')} />
      <Note text="their own axe" x={1010} y={900} size={62} rot={-4} at={t.at('axe')} color={pal.subject} />
      <Tag text={`Back doors with chiseled panels · ${P.panelMap.tag}`} />
    </Desk>
  );
};

/** Plain and quiet: who found them, and what happened. */
const Found: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at("Joseph's brothers")}>
    <Clip src={P.maggio.src} x={460} y={140} w={1000} rot={-1} at={t.at("Joseph's brothers")} drop={false} />
    <Note text="his brothers find them" x={150} y={820} size={56} rot={-3} at={t.at('They find')} color="#ffffff" />
    <Note text="Catherine: killed · Joseph: dies minutes later" x={150} y={905} size={50} rot={-2} at={t.at('Catherine is')} color="#ffffff" />
    <Tag text={P.maggio.tag} y={40} />
  </Desk>
);

/** The money is still there: not a robbery. */
const Money: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Desk a={t.at("Here's what")}>
      <Note text="what bothers the police:" x={180} y={150} size={62} rot={-3} at={t.at('bothers')} color="#ffffff" />
      <Note text="money — still there" x={260} y={330} size={84} rot={-3} at={t.at('Money')} />
      <Note text="jewelry — still there" x={300} y={490} size={84} rot={-3} at={t.at('jewelry')} />
      <Note text="nobody took them" x={340} y={650} size={84} rot={-3} at={t.at('Nobody took')} color={pal.subject} />
      {g >= t.at('robbery.') && <Highlight text="NOT A ROBBERY" x={900} y={820} size={110} at={t.at('robbery.')} seed={23} rot={-2} />}
    </Desk>
  );
};

/** The razor was his brother's: the first name on the card of people blamed. */
const Razor: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('The razor')}>
    <Blamed x={180} y={170} at={t.at('The razor')} rows={[{name: 'Andrew Maggio, the barber', at: t.at('Andrew,'), clear: t.at('released.')}]} w={760} />
    <Note text="his razor" x={1080} y={240} size={70} rot={-4} at={t.at('razor')} />
    <Note text="arrested..." x={1080} y={420} size={70} rot={-4} at={t.at('arrested.')} color="#ffffff" />
    <Note text="...released" x={1180} y={540} size={70} rot={-4} at={t.at('released.')} color="#ffffff" />
    <Note text="nobody can prove otherwise" x={1000} y={760} size={58} rot={-3} at={t.at('prove otherwise.')} />
  </Desk>
);

/** A block away, in chalk on the sidewalk. Written on as it's read. */
const Sidewalk: React.FC<{t: TL}> = ({t}) => (
  <>
    <Pavement />
    <Chalk t={t} phrase={'"Mrs. Maggio will sit up tonight, just like Mrs. Toney."'} x={240} y={330} w={1500} size={120} />
    <Note text="a block away, in chalk" x={120} y={90} size={58} rot={-3} at={t.at('a block')} color="#ffffff" />
    <Flicker x={900} y={480} />
  </>
);

/** Old cases dug up: 1910, 1911, and the Schiambras in 1912. Connected? */
const OldCases: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Police guessed')}>
      <Note text="Mrs. Toney = Mrs. Schiambra? (1912)" x={120} y={90} size={54} rot={-3} at={t.at('Schiambra,')} color={pal.box} />
      <DropCard src={P.sciambra.src} x={180} y={230} w={560} rot={-3} at={t.at('Police guessed') + 3} />
      <DropCard src={P.davi.src} x={860} y={200} w={300} rot={3} at={t.at('old cases')} />
      <DropCard src={P.rissetto.src} x={1240} y={260} w={500} rot={-2} at={t.at('1911,') - 1} />
      <Note text="connected?" x={1300} y={820} size={80} rot={-5} at={t.at('connected?')} color={pal.box} />
      <Note text="nobody could prove it" x={260} y={900} size={56} rot={-3} at={t.at('prove that')} color="#ffffff" />
      <Tag text="Times-Picayune, 1910–1912 · Wikimedia Commons" />
    </Desk>
  );
};

/** Hold onto that back door. */
const Hold: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Hold onto')} flicker>
    <Door x={790} y={150} h={720} at={t.at('Hold onto') + 1} done label="remember this door" />
    <Counter label="BACK DOORS" n={1} at={t.at('see it')} />
  </Desk>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Where t={t} />],
    [at('Joseph Maggio') - 1, <Grocery t={t} />],
    [at('Sometime') - 1, <Panel t={t} />],
    [at("Joseph's brothers") - 1, <Found t={t} />],
    [at("Here's what") - 1, <Money t={t} />],
    [at('The razor') - 1, <Razor t={t} />],
    [at('And a block') - 1, <Sidewalk t={t} />],
    [at('Police guessed') - 1, <OldCases t={t} />],
    [at('Hold onto') - 1, <Hold t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/r_spirits_dark.mp3" from={0} to={at('And a block') + 4} vol={0.13} fadeOut={12} />
      <Bed src="sfx/crackle.wav" from={at('And a block')} to={at('Police guessed')} vol={0.0} />
      <Bed src="music/r_spirits_dark.mp3" from={at('Police guessed') - 4} to={t.frames + 34} vol={0.12} skip={60} />
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['May', 'robbery.']}
        writes={['Uptown', 'Upperline', 'wife Catherine', 'grocery', 'in the back.', 'Italian', 'before dawn,', 'crawl', 'axe', 'They find', 'Catherine is', 'bothers', 'Money', 'jewelry', 'Nobody took',
          'razor', 'Andrew,', 'arrested.', 'released.', 'prove otherwise.', 'a block', 'Schiambra,', 'connected?', 'prove that']}
        ticks={['Joseph Maggio', 'Just big', 'old cases', '1911,', 'see it']}
        extra={[[at('chisels'), 'sfx/chisel.wav', 0.45], [at('Mrs. Maggio will'), 'sfx/pencil_soft.wav', 0.3], [at('Mrs. Toney.'), 'sfx/pencil_soft.wav', 0.3]]} />
    </>
  );
};

export const Ch02 = () => (
  <ChapterShell n={N} audio="audio/ch02_back_door.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
