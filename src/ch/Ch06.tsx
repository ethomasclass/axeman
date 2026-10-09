// Chapter 6 · Gretna (the heavy chapter: quiet palette, no jokes, plain statements, slower voice).
// The Cortimiglias, March 1919; Rosie's false accusation; the Jordanos convicted, then freed.
import React from 'react';
import words from '../../public/audio/ch06_gretna.words.json';
import {Highlight, Note, Tag, useGFrame} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {AbsoluteFill} from 'remotion';
import {Bed, Blamed, Counter, Desk, Door, DropCard, Parallax, Pic, Plain, Sounds} from '../kit/ax';
import {MASKS} from '../masks';
import {P} from '../pics';

const N = words as Narration;
export const CH06_FRAMES = chapterFrames(N, LEAD);

const PAST = [{name: 'Andrew Maggio, the barber', at: -999, clear: -999}, {name: 'Louis Besumer', at: -999, clear: -999}];

const River: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Parallax src={P.ferry.src} tag={P.ferry.tag} layer="ferry" mask={MASKS.ferry} a={0} b={t.at('Charles and Rosie')} fx={1500} fy={1250} z0={1.06} z1={1.14} pan={[0.03, -0.02]} depth={1.06} tint={null} traceAt={t.at('Mississippi')}>
      {() => (
        <>
          {g >= t.at('Gretna,') && <Highlight text="GRETNA · MARCH 10, 1919" x={110} y={100} size={86} at={t.at('Gretna,')} seed={71} rot={-2} />}
          <Note text="just across the river" x={140} y={250} size={58} rot={-3} at={t.at('across')} color="#ffffff" />
        </>
      )}
    </Parallax>
  );
};

/** What happened, said plainly. The door is drawn, nothing else. */
const Night: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('Charles and Rosie')} push={0.02}>
    <Door x={1360} y={200} h={560} at={t.at('back door.') - 4} cut={t.at('back door.') + 4} />
    <Counter label="BACK DOORS" n={3} at={t.at('back door.') + 12} />
    <Plain text="Charles and Rosie Cortimiglia, and their little daughter, Mary." x={140} y={200} w={1100} size={56} at={t.at('Charles and Rosie') + 2} />
    <Plain text="Charles and Rosie are badly hurt." x={140} y={520} w={1100} size={56} at={t.at('badly hurt.')} />
    <Plain text="Mary is killed." x={140} y={680} w={1100} size={56} at={t.at('Mary is killed')} />
  </Desk>
);

/** The neighbor who ran to help, and Rosie's accusation, on the card of the blamed. */
const Accused: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('A neighbor,')} push={0.02}>
    <Blamed x={150} y={140} at={t.at('A neighbor,')} w={760}
      rows={[...PAST, {name: 'Iorlando Jordano', at: t.at('Jordano and his')}, {name: 'Frank Jordano, 18', at: t.at('Frank.')}]} />
    <Note text="the neighbor who ran to help" x={990} y={180} size={50} rot={-3} at={t.at('runs across')} />
    <Note text="her husband: not true" x={990} y={420} size={54} rot={-3} at={t.at("isn't true.")} color="#ffffff" />
    <Note text="Iorlando: old, in poor health" x={990} y={560} size={50} rot={-3} at={t.at('old man,')} />
    <Note text="Frank: over six feet tall" x={990} y={700} size={50} rot={-3} at={t.at('six feet')} />
    <Note text="too big for the hole in the door" x={990} y={840} size={50} rot={-3} at={t.at('Too big,')} />
  </Desk>
);

const Court: React.FC<{t: TL}> = ({t}) => (
  <Pic src={P.courtroom2.src} tag={`${P.courtroom2.tag} · ${P.sentence.tag}`} a={t.at("They're convicted")} b={t.at('In December')} z0={1.02} z1={1.08} vignette={0.8}>
    {() => (
      <>
        <AbsoluteFill style={{background: 'rgba(8,6,4,0.5)'}} />
        <DropCard src={P.sentence.src} x={1100} y={160} w={680} rot={2} at={t.at('Frank is')} look="news" />
        <Plain text="Convicted anyway." x={120} y={160} size={72} at={t.at("They're convicted")} w={900} />
        <Plain text="Frank: sentenced to hang." x={120} y={600} size={60} at={t.at('Frank is')} w={900} />
        <Plain text="His father: life in prison." x={120} y={720} size={60} at={t.at('His father')} w={900} />
      </>
    )}
  </Pic>
);

const Recant: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('In December')} push={0.02}>
    <Blamed x={150} y={140} at={t.at('In December')} w={760}
      rows={[...PAST, {name: 'Iorlando Jordano', at: -999, clear: t.at('set free.')}, {name: 'Frank Jordano, 18', at: -999, clear: t.at('set free.') + 4}]} />
    <Note text="December 1920" x={1060} y={220} size={60} rot={-3} at={t.at('In December')} color="#ffffff" />
    <Note text="Rosie: she lied" x={1060} y={380} size={70} rot={-3} at={t.at('she lied.')} />
    <Note text="set free" x={1100} y={540} size={70} rot={-3} at={t.at('set free.')} />
  </Desk>
);

const After: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('A child was dead.')} push={0.015}>
    <Plain text="A child was dead." x={220} y={300} size={70} at={t.at('A child was dead.')} />
    <Plain text="Two innocent men had nearly died for it." x={220} y={430} size={70} at={t.at('Two innocent')} />
    <Plain text="And the Axeman was still out there." x={220} y={620} size={70} at={t.at('And the Axeman')} color="#2FE0C4" />
  </Desk>
);

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <River t={t} />],
    [at('Charles and Rosie') - 1, <Night t={t} />],
    [at('A neighbor,') - 1, <Accused t={t} />],
    [at("They're convicted") - 1, <Court t={t} />],
    [at('In December') - 1, <Recant t={t} />],
    [at('A child was dead.') - 1, <After t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/w_aftermath.mp3" from={0} to={at('In December') + 10} vol={0.11} fadeOut={30} />
      <Bed src="music/j_grief.mp3" from={at('In December') - 10} to={t.frames + 34} vol={0.13} fadeIn={30} />
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['Gretna,']}
        writes={['across', 'Jordano and his', 'Frank.', 'runs across', "isn't true.", 'old man,', 'six feet', 'Too big,', 'In December', 'she lied.', 'set free.']} />
    </>
  );
};

export const Ch06 = () => (
  <ChapterShell n={N} audio="audio/ch06_gretna.wav" lead={LEAD} quiet>
    <Body />
  </ChapterShell>
);
