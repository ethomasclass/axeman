// Chapter 1 · cold open: the sheet music, the party night, the driving question, a hole in a back door.
// Then the channel intro and the title card (JAZZ IT OUT · The Axeman of New Orleans · 1918 – 1919).
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch01_cold_open.words.json';
import {clamp} from '../lib/anim';
import {Arrow, Finish, Highlight, JF, Loop, Note, PALETTES, PaletteCtx, StepCtx, useGFrame, usePal} from '../kit/Kit';
import {MASKS} from '../masks';
import {Sfx} from '../kit/common';
import {ChannelIntro, INTRO_FRAMES} from '../kit/Intro';
import {makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Bed, Desk, Door, DropCard, Fit, Pic, Shadow, Sounds, Strike} from '../kit/ax';
import {IMG} from '../imgs';
import {P} from '../pics';
import {DATES, SUBTITLE, TITLE} from '../project';
import {M} from '../music';

const N = words as Narration;
const SHEET = IMG[P.sheet.src] ?? [1000, 1300];
const TITLE_FRAMES = 150;
/** Narration ends; the channel intro starts 20 frames later. */
const END = Math.ceil(N.duration * 30) + 20;
export const CH01_FRAMES = END + INTRO_FRAMES + TITLE_FRAMES;

/** The sheet music, whole: the pianist picked out in coral, each instrument and the open door named as it's spoken. */
const Sheet: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Fit src={P.sheet.src} tag={P.sheet.tag} a={0} b={t.at("That's")} z0={1} z1={1.06} mask={MASKS.sheetPiano} traceAt={t.at('Piano.')}>
      {(p) => {
        const S = (fx: number, fy: number) => [p.left + fx * SHEET[0] * p.scale, p.top + fy * SHEET[1] * p.scale];
        const [tx, ty] = S(0.5, 0.105);
        const [px, py] = S(0.36, 0.46);
        const [bx, by] = S(0.82, 0.43);
        const [dx, dy] = S(0.9, 0.69);
        const [ox, oy] = S(0.69, 0.33);
        return (
          <>
            <Note text="new orleans, 1919" x={1440} y={200} size={46} rot={-4} at={t.at('New Orleans,')} color="#ffffff" />
            <Note text="the whole family" x={80} y={250} size={50} rot={-4} at={t.at('whole family')} />
            <Note text="piano" x={250} y={430} size={60} rot={-4} at={t.at('Piano.')} />
            <Arrow x1={420} y1={470} x2={px - 40} y2={py} bow={-24} at={t.at('Piano.') + 4} />
            <Note text="trombone" x={1390} y={330} size={56} rot={-4} at={t.at('Trombone.')} />
            <Arrow x1={1390} y1={390} x2={bx + 30} y2={by} bow={20} at={t.at('Trombone.') + 4} />
            <Note text="a kid on a drum" x={1370} y={700} size={50} rot={-3} at={t.at('drum.')} />
            <Arrow x1={1450} y1={690} x2={dx + 24} y2={dy - 20} bow={-18} at={t.at('drum.') + 4} />
            <Loop cx={ox} cy={oy} rx={64} ry={118} at={t.at('wide open')} seed={5} tilt={2} />
            <Note text="...and the door" x={110} y={700} size={56} rot={-4} at={t.at('the door')} color={pal.subject} />
            <Loop cx={tx} cy={ty} rx={370} ry={62} at={t.at('title:')} seed={3} tilt={-2} />
            <Note text={"don't scare me,"} x={1350} y={850} size={50} rot={-4} at={t.at("Don't Scare")} color={pal.subject} />
            <Note text="papa" x={1470} y={930} size={50} rot={-4} at={t.at('Papa.')} color={pal.subject} />
          </>
        );
      }}
    </Fit>
  );
};

/** "That's a song about a serial killer. And people bought it." */
const Song: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at("That's")} flicker>
      <DropCard src={P.sheet.src} x={170} y={110} w={560} rot={-4} at={t.at("That's") + 1} />
      <Note text="a song" x={880} y={300} size={70} rot={-4} at={t.at('song')} color="#ffffff" />
      <Note text="about a serial killer." x={880} y={420} size={78} rot={-4} at={t.at('serial')} color={pal.subject} />
      <Note text="(people bought it)" x={940} y={640} size={60} rot={-3} at={t.at('bought')} />
    </Desk>
  );
};

/** March 1919: the dance halls are packed... because a killer told them to. */
const Party: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Pic src={P.cave.src} tag={P.cave.tag} a={t.at('Because')} b={t.at('A killer')} z0={1.03} z1={1.14}>
      {() => (
        <>
          {g >= t.at('March') && <Highlight text="MARCH 1919" x={110} y={100} size={100} at={t.at('March')} seed={7} rot={-2} />}
          <Note text="every dance hall: packed" x={130} y={270} size={60} rot={-3} at={t.at('almost every')} />
          <Note text="living rooms, past midnight" x={130} y={860} size={56} rot={-3} at={t.at('living rooms')} color="#ffffff" />
          <Note text="celebrating?" x={1300} y={860} size={60} rot={-4} at={t.at("wasn't")} color="#ffffff" />
          <Strike x={1290} y={905} w={330} at={t.at('celebrating.') + 4} />
        </>
      )}
    </Pic>
  );
};

/** Hard cut to the dark: the music has stopped. */
const Told: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('A killer')} flicker push={0.06}>
      <Shadow a={t.at('A killer') - 4} b={t.at('A killer') + 60} y={80} size={1000} opacity={0.7} />
      <Note text="a killer" x={560} y={360} size={110} rot={-4} at={t.at('A killer')} color={pal.subject} />
      <Note text="told them to." x={700} y={520} size={110} rot={-4} at={t.at('told')} color={pal.subject} />
    </Desk>
  );
};

/** The driving question, stacked big. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at("So here's")}>
      <Note text="the question:" x={200} y={150} size={60} rot={-3} at={t.at('question')} color="#ffffff" />
      {g >= t.at('How') && <Highlight text="HOW DID A KILLER" x={200} y={290} size={104} at={t.at('How')} seed={11} rot={-2} />}
      {g >= t.at('whole city') && <Highlight text="GET A WHOLE CITY" x={250} y={460} size={104} at={t.at('whole city')} seed={13} rot={-2} />}
      {g >= t.at('throw') && <Highlight text="TO THROW HIM A PARTY?" x={300} y={630} size={104} at={t.at('throw')} seed={15} rot={-2} />}
    </Desk>
  );
};

/** The hook: a corner grocery, a back door, and a panel that goes missing. */
const Tease: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('It starts')} flicker>
    <Door x={790} y={150} h={720} at={t.at('It starts')} cut={t.at('hole')} />
    <Note text="a corner grocery" x={150} y={250} size={64} rot={-4} at={t.at('corner')} color="#ffffff" />
    <Note text="the back door" x={1260} y={760} size={64} rot={-4} at={t.at('back door.')} />
  </Desk>
);

/** Title card after the channel intro: the panel-burglar page dimmed behind the title. */
const Title: React.FC = () => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <AbsoluteFill style={{background: '#15130f'}}>
      <Pic src={P.canal.src} tag="" a={0} b={TITLE_FRAMES} z0={1.04} z1={1.1} look="night" vignette={0.85}>{() => null}</Pic>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(8,6,4,0.35) 30%, rgba(8,6,4,0.9) 100%)'}} />
      <Highlight text={TITLE} x={330} y={360} size={180} at={4} seed={61} rot={-2} />
      {g >= 14 && <div style={{position: 'absolute', left: 380, top: 640, fontFamily: JF.display, fontSize: 64, color: pal.mark, textShadow: '0 3px 16px rgba(0,0,0,0.8)', opacity: interpolate(g, [14, 20], [0, 1], clamp)}}>{SUBTITLE}</div>}
      <Note text={DATES} x={1340} y={760} size={52} rot={-5} at={24} />
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const frame = useCurrentFrame();
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Sheet t={t} />],
    [at("That's") - 1, <Song t={t} />],
    [at('Because') - 1, <Party t={t} />],
    [at('A killer') - 1, <Told t={t} />],
    [at("So here's") - 1, <Question t={t} />],
    [at('It starts') - 1, <Tease t={t} />],
  ];
  let scene = useScene(cuts);
  if (frame >= END + INTRO_FRAMES) scene = <Sequence from={END + INTRO_FRAMES} layout="none"><Title /></Sequence>;
  else if (frame >= END) scene = <Sequence from={END} layout="none"><ChannelIntro /></Sequence>;
  const stop = at("wasn't") + 4; // the record stops dead on "The city wasn't celebrating"
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scene}
      {frame < END && <Finish vignette={0.3} />}
      <Audio src={staticFile('audio/ch01_cold_open.wav')} />
      {/* a 1918 record, muffled as if from the next room, until the needle is pulled */}
      <Bed src={M.partyFar} from={0} to={stop} vol={0.2} fadeIn={10} fadeOut={2} skip={2} />
      <Bed src="sfx/crackle.wav" from={0} to={stop} vol={0.12} fadeIn={10} fadeOut={2} />
      <Bed src="music/r_cold_open.mp3" from={at("So here's") - 6} to={END} vol={0.16} fadeIn={12} fadeOut={20} skip={52} />
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['March', 'How', 'whole city', 'throw']}
        writes={['New Orleans,', 'whole family', 'Piano.', 'Trombone.', 'drum.', 'the door', "Don't Scare", 'song', 'serial', 'bought', 'almost every', 'living rooms', "wasn't", 'A killer', 'told', 'question', 'corner', 'back door.']}
        extra={[[stop - 2, 'sfx/needle.wav', 0.5], [at('A killer'), 'sfx/heartbeat.wav', 0.5], [at('hole'), 'sfx/chisel.wav', 0.45]]} />
      <Sfx at={END + INTRO_FRAMES + 4} src="sfx/stamp.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Ch01: React.FC = () => (
  <PaletteCtx.Provider value={PALETTES.locked}>
    <StepCtx.Provider value={2.5}>
      <Body />
    </StepCtx.Provider>
  </PaletteCtx.Provider>
);
