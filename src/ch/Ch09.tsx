// Chapter 9 · So Who Was the Axeman? The Los Angeles story, the suspects, the question answered, and the last
// line: "It played." Then a 12-second end screen on the band with the record playing.
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import words from '../../public/audio/ch09_who.words.json';
import plugWords from '../../public/audio/plug_end.words.json';
import {boxOf, Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {clamp} from '../lib/anim';
import {Bed, Blamed, Clip, Desk, DropCard, Fit, Sounds, SrcView, Witness} from '../kit/ax';
import {M} from '../music';
import {MASKS} from '../masks';
import {WRITE} from '../kit/common';
import {P} from '../pics';

const N = words as Narration;
const PLUG = plugWords as Narration;
/** "It played." lands, the record plays a beat, then the thank-you plug; then ~10 s of music only for YouTube's end screen. */
/** The record plays this long, under IT PLAYED., before the thank-you starts: the line gets room to land. */
const PLUG_GAP = 170;
const END_SCREEN = PLUG_GAP + Math.ceil(PLUG.duration * 30) + 240;
export const CH09_FRAMES = chapterFrames(N, LEAD) + END_SCREEN;

const Who: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={0}>
      {g >= t.at('So who') && <Highlight text="SO WHO WAS HE?" x={420} y={420} size={140} at={t.at('So who')} seed={101} rot={-2} />}
    </Desk>
  );
};

/** The Los Angeles story, from the Los Angeles Times itself: the camera reads down the page. */
const LA: React.FC<{t: TL}> = ({t}) => (
  <Desk a={t.at('A couple')} push={0.02}>
    <SrcView src={P.laTimes.src} card look="news" keys={[[t.at('A couple'), 1150, 700, 0.62], [t.at('widow'), 900, 260, 0.95], [t.at('She said'), 1350, 700, 0.8]]} />
    <Clip src={P.omaha.src} x={1400} y={110} w={360} rot={4} at={t.at('She said') + 6} />
    <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.75) 26%, transparent 46%)'}} />
    <Note text="los angeles, december 1921" x={90} y={760} size={52} rot={-3} at={t.at('Los Angeles,')} color="#ffffff" />
    <Note text="Pepitone's widow shoots a man" x={110} y={850} size={60} rot={-3} at={t.at('widow')} />
    <Note text={'"he killed my husband"'} x={140} y={925} size={54} rot={-3} at={t.at('She said')} />
    <Tag text={`${P.laTimes.tag} · ${P.omaha.tag}`} y={40} />
  </Desk>
);

const Check: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at("It's a perfect")}>
      <Note text="a perfect ending" x={220} y={220} size={90} rot={-4} at={t.at('perfect ending.')} />
      <Note text="...hard to check" x={340} y={420} size={90} rot={-4} at={t.at('hard to check.')} color={pal.box} />
      <Note text="the records that would prove it: never turned up" x={200} y={700} size={60} rot={-3} at={t.at('never turned')} color="#ffffff" />
    </Desk>
  );
};

/** The suspects, as labelled cards pinned on the desk. No faces: there are no pictures of most of them. */
const Suspects: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const cards = [
    {label: 'A LONG CRIMINAL RECORD', at: t.at('criminal record.'), x: 120, y: 150},
    {label: 'AFTER THE WOMEN', at: t.at('the women'), x: 760, y: 120},
    {label: 'THE MAFIA', at: t.at('The Mafia.'), x: 1330, y: 170},
    {label: 'COPYCATS', at: t.at('Copycats.'), x: 220, y: 480},
    {label: 'SEVERAL ATTACKERS', at: t.at('several different'), x: 860, y: 470},
  ];
  return (
    <Desk a={t.at('There are other')}>
      <Note text="other suspects:" x={120} y={40} size={56} rot={-2} at={t.at('There are other')} color="#ffffff" />
      {cards.map((c, i) => {
        if (g < c.at) return null;
        const k = interpolate(g, [c.at, c.at + 5], [0, 1], {...clamp, easing: (u) => 1 - Math.pow(1 - u, 3) * (1 - 2.2 * u * (1 - u))});
        return (
          <div key={c.label} style={{position: 'absolute', left: c.x, top: c.y, width: 500, height: 250, background: '#121110', boxShadow: '0 16px 30px rgba(0,0,0,0.6)', border: '12px solid #efe7d6',
            transform: `scale(${0.6 + 0.4 * k}) rotate(${(random(c.label) - 0.5) * 8}deg)`, opacity: Math.min(1, k * 2)}}>
            <Witness x={190} y={14} h={200} at={c.at + 2} hat={c.at + 2} body={c.at + 2} suit={c.at + 4} />
            <div style={{position: 'absolute', left: 40, top: 40, fontFamily: JF.display, fontSize: 110, color: pal.subject, opacity: 0.9}}>?</div>
            <div style={{position: 'absolute', left: 14, bottom: -24, background: boxOf(pal), fontFamily: JF.display, fontSize: 38, color: '#111', padding: '2px 12px', whiteSpace: 'nowrap'}}>{c.label}</div>
          </div>
        );
      })}
      <Note text="stitched into one monster by the newspapers" x={150} y={800} size={60} rot={-3} at={t.at('stitched')} color={pal.subject} />
      <Note text="some attacks don't match at all" x={190} y={900} size={52} rot={-3} at={t.at("don't match")} color="#ffffff" />
    </Desk>
  );
};

/** The question again, in the cold open's layout. */
const Question: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at("So let's")}>
      <Note text="back to the question:" x={200} y={150} size={60} rot={-3} at={t.at('back to')} color="#ffffff" />
      {g >= t.at('How did') && <Highlight text="HOW DID A KILLER" x={200} y={290} size={104} at={t.at('How did')} seed={11} rot={-2} />}
      {g >= t.at('whole city') && <Highlight text="GET A WHOLE CITY" x={250} y={460} size={104} at={t.at('whole city')} seed={13} rot={-2} />}
      {g >= t.at('throw him') && <Highlight text="TO THROW HIM A PARTY?" x={300} y={630} size={104} at={t.at('throw him')} seed={15} rot={-2} />}
    </Desk>
  );
};

/** What actually did it: the fear, the papers, the blamed. */
const Answer: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('He probably')}>
      <Note text="he probably didn't." x={120} y={60} size={70} rot={-3} at={t.at('He probably')} color={pal.subject} />
      <DropCard src={P.nightStreet.src} x={150} y={200} w={380} rot={-3} at={t.at('so was the fear.')} look="night" />
      <Note text="real fear" x={180} y={640} size={60} rot={-3} at={t.at('so was the fear.')} />
      <Clip src={P.axMap1918.src} x={720} y={230} w={420} rot={2} at={t.at('Newspapers that')} />
      <Note text="a name for it" x={760} y={760} size={60} rot={-3} at={t.at('Newspapers that')} />
      <Blamed x={1230} y={230} at={t.at('Innocent people')} w={600} rot={3}
        rows={[{name: 'Andrew Maggio', at: -999, clear: -999}, {name: 'Louis Besumer', at: -999, clear: -999}, {name: 'the Jordanos', at: -999, clear: -999}]} />
      <Note text="again and again" x={1300} y={800} size={60} rot={-3} at={t.at('again and again.')} color="#ffffff" />
    </Desk>
  );
};

const Letter: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={t.at('And then a letter,')}>
      <Clip src={P.herald.src} x={150} y={140} w={580} rot={-4} at={t.at('And then a letter,')} />
      <Note text="almost certainly fake" x={820} y={200} size={64} rot={-3} at={t.at('almost certainly')} color={pal.box} />
      <Note text="something to do" x={820} y={400} size={62} rot={-3} at={t.at('something to do')} />
      <Note text="with all that fear" x={860} y={490} size={62} rot={-3} at={t.at('all that fear.')} />
      <Note text="something they were good at" x={820} y={650} size={62} rot={-4} at={t.at('good at.')} color={pal.subject} />
    </Desk>
  );
};

/** The sheet music once more, then the held breath: the music resolves and the picture sinks toward black. */
const Name: React.FC<{t: TL}> = ({t}) => {
  const f = useCurrentFrame();
  const hush = interpolate(f, [t.end('everything.'), t.at('It played.') - 2], [0, 0.75], {...clamp, easing: Easing.in(Easing.quad)});
  return (
    <AbsoluteFill>
      <Fit src={P.sheet.src} tag={P.sheet.tag} a={t.at('New Orleans never')} b={t.at('It played.')} z0={1} z1={1.12}>
        {() => (
          <>
            <Note text="never learned" x={1400} y={240} size={56} rot={-4} at={t.at('never learned')} color="#ffffff" />
            <Note text="his name" x={1460} y={330} size={56} rot={-4} at={t.at('never learned') + 6} color="#ffffff" />
            <Note text="so it answered him" x={1360} y={720} size={52} rot={-4} at={t.at('So it answered')} />
          </>
        )}
      </Fit>
      <AbsoluteFill style={{background: '#000', opacity: hush}} />
    </AbsoluteFill>
  );
};

/** It played: the band, the record up full, a friendly thank-you, and the end screen. */
const Played: React.FC<{t: TL; tp: TL; plugAt: number}> = ({t, tp, plugAt}) => {
  const g = useGFrame();
  const pal = usePal();
  const at = (p: string) => plugAt + tp.at(p);
  const dim = interpolate(g, [plugAt - 6, plugAt + 6], [0, 1], clamp);
  return (
    <Fit src={P.eagle.src} tag={P.eagle.tag} a={t.at('It played.')} b={t.frames + END_SCREEN} z0={1.0} z1={1.14} mask={MASKS.eagleCornet} traceAt={t.at('It played.') + 3}>
      {() => (
        <>
          <AbsoluteFill style={{background: 'rgba(0,0,0,0.45)', opacity: dim}} />
          {g >= t.at('It played.') && g < plugAt - 6 && <Highlight text="IT PLAYED." x={90} y={80} size={190} at={t.at('It played.')} seed={103} rot={-3} />}
          <Note text="thanks so much for watching" x={120} y={110} size={70} rot={-3} at={at('Thanks')} color="#ffffff" />
          {g >= at('like') && <Highlight text="LIKE" x={140} y={270} size={110} at={at('like')} seed={105} rot={-3} />}
          {g >= at('subscribe') && <Highlight text="SUBSCRIBE" x={460} y={270} size={110} at={at('subscribe')} seed={107} rot={-2} />}
          <Note text="see you next time" x={170} y={480} size={64} rot={-3} at={at('next time.')} color={pal.subject} />
        </>
      )}
    </Fit>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const tp = makeTimeline(PLUG, 30);
  const at = t.at;
  const plugAt = t.frames + PLUG_GAP;
  const cuts: [number, React.ReactNode][] = [
    [0, <Who t={t} />],
    [at('A couple') - 1, <LA t={t} />],
    [at("It's a perfect") - 1, <Check t={t} />],
    [at('There are other') - 1, <Suspects t={t} />],
    [at("So let's") - 1, <Question t={t} />],
    [at('He probably') - 1, <Answer t={t} />],
    [at('And then a letter,') - 1, <Letter t={t} />],
    [at('New Orleans never') - 1, <Name t={t} />],
    [at('It played.') - 1, <Played t={t} tp={tp} plugAt={plugAt} />],
  ];
  const scene = useScene(cuts);
  const end = t.frames + END_SCREEN + 34;
  return (
    <>
      {scene}
      <Bed src="music/r_cold_open.mp3" from={0} to={at("So let's") + 6} vol={0.15} fadeOut={12} />
      {/* the answer's cue resolves on "everything." and leaves the held breath to the record's crackle */}
      <Bed src="music/r_ending.mp3" from={at("So let's") - 4} to={t.end('everything.') + 16} vol={0.15} fadeOut={26} skip={30} />
      <Bed src="sfx/crackle.wav" from={t.end('everything.') - 4} to={at('It played.') + 6} vol={0.16} fadeIn={14} fadeOut={4} />
      {/* the needle drops on "It played.": the record sits under the line, swells once it's said, ducks under the thank-you,
          then plays out under the end screen */}
      <Sequence from={at('It played.') - 1} layout="none">
        <Audio src={staticFile(M.ending)} volume={(f) => {
          const F = f + at('It played.') - 1;
          const said = t.end('It played.') + 4;
          const plugEnd = plugAt + Math.ceil(PLUG.duration * 30);
          return interpolate(F, [at('It played.') - 1, at('It played.') + 2, said, said + 10, plugAt - 10, plugAt + 2, plugEnd, plugEnd + 20, end - 60, end],
            [0, 0.2, 0.2, 0.4, 0.4, 0.13, 0.13, 0.32, 0.32, 0], clamp);
        }} />
      </Sequence>
      <Sequence from={plugAt} layout="none"><Audio src={staticFile('audio/plug_end.wav')} /></Sequence>
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['So who', 'How did', 'whole city', 'throw him', 'It played.']}
        writes={['Los Angeles,', 'widow', 'She said', 'perfect ending.', 'hard to check.', 'never turned', 'There are other', 'stitched', "don't match", 'back to', 'He probably', 'so was the fear.',
          'Newspapers that', 'again and again.', 'almost certainly', 'something to do', 'good at.', 'never learned', 'So it answered']}
        extra={[[at('It played.') - 3, 'sfx/needle.wav', 0.5], [at('It played.'), 'sfx/boom.wav', 0.32],
          ...['like', 'subscribe'].map((p) => [plugAt + tp.at(p), 'sfx/stamp.wav', 0.2] as [number, string, number]),
          ...['Thanks', 'next time.'].map((p) => [plugAt + tp.at(p) - 2, WRITE.src, WRITE.volume] as [number, string, number])]}
        ticks={['criminal record.', 'the women', 'The Mafia.', 'Copycats.', 'several different', 'And then a letter,', 'Innocent people']} />
    </>
  );
};

export const Ch09 = () => (
  <ChapterShell n={N} audio="audio/ch09_who.wav" lead={LEAD} extra={END_SCREEN}>
    <Body />
  </ChapterShell>
);
