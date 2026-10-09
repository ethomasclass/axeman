// Chapter 3 · A Spy, a Hatchet and a Deathbed: Louis Besumer and Harriet Lowe, June 1918; wartime spy fever;
// the victim charged with murder and acquitted in ten minutes. The BLAMED card gets its second name.
import React from 'react';
import words from '../../public/audio/ch03_spy.words.json';
import {Highlight, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, CropCard, LEAD, makeTimeline, type Narration, Stamp, type TL, useScene} from '../kit/shell';
import {AbsoluteFill} from 'remotion';
import {Bed, Blamed, Desk, DropCard, Pic, Sounds} from '../kit/ax';
import {IMG} from '../imgs';
import {MASKS} from '../masks';
import {P} from '../pics';

const N = words as Narration;
export const CH03_FRAMES = chapterFrames(N, LEAD);
const BESUMER = IMG[P.besumer.src] ?? [313, 349];

/** Five weeks later: another grocery, another back room. */
const June: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={0}>
      <CropCard src={P.besumer.src} size={BESUMER} x={1180} y={170} w={500} h={560} fx={156} fy={174} scale={1.62} rot={3} at={t.at('Louis Besumer')} mask={MASKS.besumer} traceAt={t.at('Louis Besumer') + 6}
        bw="grayscale(1) sepia(0.25) contrast(1.2)" />
      {g >= t.at('June') && <Highlight text="JUNE 27, 1918" x={110} y={110} size={96} at={t.at('June')} seed={31} rot={-2} />}
      <Note text="five weeks later" x={140} y={270} size={56} rot={-3} at={t.at('Five weeks')} color="#ffffff" />
      <Note text="another grocery" x={140} y={430} size={64} rot={-4} at={t.at('Another grocery,')} />
      <Note text="a hatchet, in the night" x={140} y={580} size={60} rot={-3} at={t.at('hatchet')} />
      <Note text="found by the bakery driver" x={140} y={760} size={54} rot={-3} at={t.at('bakery')} color="#ffffff" />
      <Note text="alive. barely." x={180} y={880} size={66} rot={-4} at={t.at('Alive.')} />
      <Tag text={P.besumer.tag} />
    </Desk>
  );
};

/** 1918 is wartime: a war parade on Canal Street, then spy fever. */
const SpyFever: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Pic src={P.parade.src} tag={P.parade.tag} a={t.at('Then things')} b={t.at("He isn't.")} z0={1.03} z1={1.12} tagTop>
      {() => (
        <>
          {g >= t.at("It's 1918.") && <Highlight text="1918: AT WAR" x={110} y={100} size={96} at={t.at("It's 1918.")} seed={33} rot={-2} />}
          <Note text="jumpy about spies" x={120} y={260} size={60} rot={-3} at={t.at('jumpy')} />
          <DropCard src={P.spyPoster.src} x={1260} y={110} w={520} rot={4} at={t.at('spies.') - 2} />
          <Note text="letters in foreign languages" x={120} y={900} size={56} rot={-3} at={t.at('foreign')} color="#ffffff" />
        </>
      )}
    </Pic>
  );
};

/** Lowe's accusations, on the card of people blamed. */
const Accused: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Harriet Lowe tells')}>
      <Blamed x={160} y={180} at={t.at('Harriet Lowe tells') + 1} w={820}
        rows={[{name: 'Andrew Maggio, the barber', at: -999, clear: -999}, {name: 'Louis Besumer: "a German spy"', at: t.at("he's a German"), clear: t.at("He isn't.")}]} />
      <Note text="he isn't." x={1150} y={300} size={80} rot={-4} at={t.at("He isn't.")} color={pal.subject} />
      <Note text="held two days, let go" x={1100} y={460} size={60} rot={-3} at={t.at('two days')} color="#ffffff" />
    </Desk>
  );
};

/** August: Lowe dies after surgery, and names Besumer. The victim is charged with murder. */
const Deathbed: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('But in August')}>
      <Blamed x={160} y={180} at={t.at('But in August')} w={820}
        rows={[{name: 'Andrew Maggio, the barber', at: -999, clear: -999}, {name: 'Louis Besumer: "a German spy"', at: -999, clear: -999},
          {name: 'Louis Besumer: murder', at: t.at('attacker.') + 8}]} />
      <Note text="before she dies," x={1060} y={180} size={56} rot={-3} at={t.at('Before she')} color="#ffffff" />
      <Note text="she names him" x={1100} y={270} size={56} rot={-3} at={t.at('names her')} color="#ffffff" />
      <Note text="the victim:" x={1060} y={410} size={58} rot={-3} at={t.at('charged')} color={pal.subject} />
      <Note text="charged with murder" x={1100} y={500} size={58} rot={-3} at={t.at('charged')} color={pal.subject} />
      <Stamp text="9 MONTHS" x={1080} y={640} at={t.at('nine months')} size={130} />
      <Note text="in jail" x={1540} y={800} size={60} rot={-4} at={t.at('in jail.')} />
    </Desk>
  );
};

/** The trial: ten minutes. */
const Verdict: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Pic src={P.courtroom.src} tag={P.courtroom.tag} a={t.at('At his trial')} b={t.at('Remember Besumer.')} z0={1.04} z1={1.12} vignette={0.8}>{() => (<>
      <AbsoluteFill style={{background: 'rgba(8,6,4,0.55)'}} />
      {g >= t.at('At his trial') && <Highlight text="MAY 1919" x={120} y={110} size={96} at={t.at('At his trial') + 2} seed={35} rot={-2} />}
      <Stamp text="10 MINUTES" x={180} y={320} at={t.at('ten minutes', 1)} size={180} />
      {g >= t.at('not guilty.') && <Highlight text="NOT GUILTY" x={260} y={600} size={110} at={t.at('not guilty.')} seed={37} rot={-3} />}
      <Note text="(barely enough time to find your coat)" x={340} y={850} size={56} rot={-3} at={t.at('find your')} color="#ffffff" />
    </>)}</Pic>
  );
};

/** Remember Besumer: the card, with his name cleared. */
const Remember: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('Remember Besumer.')}>
      <Blamed x={160} y={180} at={t.at('Remember Besumer.')} w={820}
        rows={[{name: 'Andrew Maggio, the barber', at: -999, clear: -999}, {name: 'Louis Besumer: "a German spy"', at: -999, clear: -999},
          {name: 'Louis Besumer: murder', at: -999, clear: t.at('Remember Besumer.') + 4}]} />
      <Note text="won't be the last" x={1040} y={420} size={76} rot={-4} at={t.at("won't be")} color={pal.subject} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <June t={t} />],
    [at('Then things') - 1, <SpyFever t={t} />],
    [at('Harriet Lowe tells') - 1, <Accused t={t} />],
    [at('But in August') - 1, <Deathbed t={t} />],
    [at('At his trial') - 1, <Verdict t={t} />],
    [at('Remember Besumer.') - 1, <Remember t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/j_intrigue.mp3" from={0} to={t.frames + 34} vol={0.14} />
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['June', "It's 1918.", 'not guilty.']}
        writes={['Five weeks', 'Another grocery,', 'hatchet', 'bakery', 'Alive.', 'jumpy', 'foreign', "he's a German", "He isn't.", 'two days', 'Before she', 'names her', 'attacker.', 'charged', 'in jail.', 'find your', "won't be"]}
        ticks={['Louis Besumer', 'spies.']}
        booms={['nine months', 'ten minutes']} />
    </>
  );
};

export const Ch03 = () => (
  <ChapterShell n={N} audio="audio/ch03_spy.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
