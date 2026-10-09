// Chapter 5 · Why Italian Grocers? Sicilian New Orleans, the Black Hand theory and its problem, 1891, and the
// same evidence read two ways.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch05_why_grocers.words.json';
import {Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Bed, Desk, Parallax, Pic, Sounds, Strike} from '../kit/ax';
import {MASKS} from '../masks';
import {P} from '../pics';

const N = words as Narration;
export const CH05_FRAMES = chapterFrames(N, LEAD);

const Market: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Parallax src={P.market.src} tag={P.market.tag} layer="market_cart" mask={MASKS.marketCart} a={0} b={t.at('To a lot')} fx={1500} fy={1450} z0={1.08} z1={1.2} pan={[0.03, -0.03]} depth={1.07} traceAt={t.at('small groceries')}>
      {() => (
        <>
          {g >= t.at('why corner') && <Highlight text="WHY GROCERS?" x={110} y={100} size={100} at={t.at('why corner')} seed={51} rot={-2} />}
          <Note text="why italian families?" x={130} y={260} size={60} rot={-3} at={t.at('Italian families?')} />
          <Note text="one of the South's biggest italian communities" x={110} y={820} size={54} rot={-2} at={t.at('biggest')} color="#ffffff" />
          <Note text="mostly from sicily" x={1260} y={260} size={62} rot={-4} at={t.at('Sicily.')} />
          <Note text="corner groceries, family in back" x={880} y={900} size={50} rot={-3} at={t.at('small groceries')} />
        </>
      )}
    </Parallax>
  );
};

const BlackHand: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Pic src={P.blackHand.src} tag={P.blackHand.tag} a={t.at('To a lot')} b={t.at("But there's a problem.")} z0={1.04} z1={1.14} vignette={0.7}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,6,4,0.8) 0%, rgba(8,6,4,0.45) 45%, transparent 75%)'}} />
          <Note text="the newspapers said:" x={110} y={90} size={56} rot={-3} at={t.at('newspapers,')} color="#ffffff" />
          {g >= t.at('The Mafia.') && <Highlight text="THE MAFIA" x={120} y={210} size={104} at={t.at('The Mafia.')} seed={53} rot={-2} />}
          {g >= t.at('Black Hand:') && <Highlight text="THE BLACK HAND" x={160} y={390} size={92} at={t.at('Black Hand:')} seed={55} rot={-3} />}
          <Note text="letters demanding money" x={180} y={570} size={58} rot={-3} at={t.at('letters')} />
          <Note text="pay... or else" x={220} y={690} size={64} rot={-4} at={t.at('threatened')} color={pal.subject} />
          <Note text="(that really did happen)" x={200} y={830} size={54} rot={-3} at={t.at('really did')} color="#ffffff" />
        </>
      )}
    </Pic>
  );
};

/** Two columns: what the Black Hand wanted, what the Axeman took. */
const Problem: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  return (
    <Desk a={t.at("But there's a problem.")}>
      <Note text="but there's a problem" x={120} y={90} size={60} rot={-3} at={t.at('problem.')} color="#ffffff" />
      <div style={{position: 'absolute', left: 958, top: 250, width: 4, height: 680, background: '#f4efe6', opacity: 0.6}} />
      {g >= t.at('The Black Hand wanted') && <Highlight text="BLACK HAND" x={180} y={300} size={96} at={t.at('The Black Hand wanted')} seed={57} rot={-2} />}
      <Note text="wanted money" x={240} y={500} size={84} rot={-4} at={t.at('wanted money.')} />
      {g >= t.at('The Axeman never') && <Highlight text="AXEMAN" x={1120} y={300} size={96} at={t.at('The Axeman never')} seed={59} rot={-2} />}
      <Note text="took nothing" x={1160} y={500} size={84} rot={-4} at={t.at('never took')} color={pal.subject} />
      <Note text="extortion?" x={600} y={800} size={70} rot={-4} at={t.at('never took') + 12} color={pal.box} />
      <Strike x={590} y={850} w={330} at={t.at('never took') + 22} />
    </Desk>
  );
};

/** 1891: the darker history. No jokes; the engraving and the facts. */
const Lynching: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Pic src={P.lynching1891.src} tag={P.lynching1891.tag} a={t.at("there's a darker")} b={t.at('plenty of')} z0={1.02} z1={1.1} vignette={0.75}>
      {() => (
        <>
          {g >= t.at('In 1891,') && <Highlight text="1891" x={110} y={100} size={110} at={t.at('In 1891,')} seed={61} rot={-2} />}
          <Note text="a mob breaks into the jail" x={130} y={280} size={60} rot={-3} at={t.at('a mob')} color="#ffffff" />
          <Note text="11 Italian men killed" x={130} y={410} size={66} rot={-3} at={t.at('killed 11')} />
          <Note text="some had just been found not guilty" x={130} y={850} size={56} rot={-2} at={t.at('not guilty.')} color="#ffffff" />
        </>
      )}
    </Pic>
  );
};

/** A column heading typed out while the narrator says it. */
const TypeHead: React.FC<{text: string; x: number; a: number; b: number; color: string}> = ({text, x, a, b, color}) => {
  const g = useGFrame();
  if (g < a) return null;
  const n = Math.round(interpolate(g, [a, b], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return <div style={{position: 'absolute', left: x, top: 170, fontFamily: JF.mono, fontSize: 30, letterSpacing: 3, color}}>{text.slice(0, n)}{n < text.length ? '_' : ''}</div>;
};

/** The same attacks, seen from two sides. Each heading types out as the narrator names that side. */
const TwoViews: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('plenty of')}>
      <div style={{position: 'absolute', left: 958, top: 120, width: 4, height: 840, background: '#f4efe6', opacity: 0.6}} />
      <TypeHead text="MANY NEW ORLEANIANS SAW" x={140} a={t.at('plenty of')} b={t.at('saw the Mafia.')} color={pal.mark} />
      <Note text="the mafia" x={200} y={300} size={110} rot={-4} at={t.at('saw the Mafia.')} color={pal.box} />
      <TypeHead text="ITALIAN FAMILIES SAW" x={1060} a={t.at('A lot of Italian')} b={t.at('something else.')} color={pal.subject} />
      <Note text="we're the ones" x={1080} y={300} size={90} rot={-4} at={t.at('They were')} color={pal.subject} />
      <Note text="being hunted" x={1120} y={440} size={90} rot={-4} at={t.at('being hunted.')} color={pal.subject} />
      <Note text="...and nobody protecting us" x={1060} y={660} size={56} rot={-3} at={t.at('protecting')} color="#ffffff" />
    </Desk>
  );
};

const Same: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at('Same evidence.')}>
      <AbsoluteFill />
      {g >= t.at('Same evidence.') && <Highlight text="SAME EVIDENCE" x={340} y={360} size={130} at={t.at('Same evidence.')} seed={63} rot={-2} />}
      <Note text="two very different stories" x={480} y={600} size={84} rot={-4} at={t.at('Two very')} />
    </Desk>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <Market t={t} />],
    [at('To a lot') - 1, <BlackHand t={t} />],
    [at("But there's a problem.") - 1, <Problem t={t} />],
    [at("there's a darker") - 1, <Lynching t={t} />],
    [at('plenty of') - 1, <TwoViews t={t} />],
    [at('Same evidence.') - 1, <Same t={t} />],
  ];
  const scene = useScene(cuts);
  return (
    <>
      {scene}
      <Bed src="music/r_nativism.mp3" from={0} to={t.frames + 34} vol={0.13} />
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['why corner', 'The Mafia.', 'Black Hand:', 'The Black Hand wanted', 'The Axeman never', 'In 1891,', 'Same evidence.']}
        writes={['Italian families?', 'biggest', 'Sicily.', 'small groceries', 'newspapers,', 'letters', 'threatened', 'really did', 'problem.', 'wanted money.', 'never took', 'a mob', 'killed 11', 'not guilty.',
          'saw the Mafia.', 'They were', 'being hunted.', 'protecting', 'Two very']} />
    </>
  );
};

export const Ch05 = () => (
  <ChapterShell n={N} audio="audio/ch05_why_grocers.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
