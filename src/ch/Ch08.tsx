// Chapter 8 · The Last Door: August–October 1919 on a drawn timeline (Boca, Laumann, Pepitone), the fourth door,
// and then nothing: he just stops.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import words from '../../public/audio/ch08_last_door.words.json';
import {clamp} from '../lib/anim';
import {Highlight, JF, Note, Tag, useGFrame, usePal} from '../kit/Kit';
import {ChapterShell, chapterFrames, LEAD, makeTimeline, type Narration, type TL, useScene} from '../kit/shell';
import {Bed, Clip, Counter, Desk, Door, Dot, Pic, Shadow, Sounds, XMark} from '../kit/ax';
import {P} from '../pics';

const N = words as Narration;
export const CH08_FRAMES = chapterFrames(N, LEAD);

const NotDone: React.FC<{t: TL}> = ({t}) => {
  const pal = usePal();
  return (
    <Desk a={0} flicker>
      <Shadow a={0} b={t.at('August 10th,')} y={100} size={1000} opacity={0.65} />
      <Note text="whoever he was..." x={300} y={360} size={84} rot={-4} at={t.at('whoever')} color="#ffffff" />
      <Note text="he wasn't finished" x={420} y={520} size={100} rot={-4} at={t.at("wasn't finished.")} color={pal.subject} />
    </Desk>
  );
};

/** Three dates on a line; each attack gets its column as it's spoken. */
const Timeline: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const a = t.at('August 10th,');
  const line = interpolate(g, [a, a + 12], [0, 1], clamp);
  const cols = [
    {x: 330, at: a, date: 'AUG 10, 1919'},
    {x: 960, at: t.at('September 3rd.'), date: 'SEPT 3'},
    {x: 1590, at: t.at('October 27th.'), date: 'OCT 27'},
  ];
  return (
    <Desk a={a} flicker>
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        <line x1={180} y1={170} x2={180 + 1560 * line} y2={170} stroke={pal.mark} strokeWidth={6} strokeLinecap="round" />
      </svg>
      {cols.map((c) => g >= c.at && (
        <React.Fragment key={c.date}>
          <Dot x={c.x} y={170} at={c.at} />
          <div style={{position: 'absolute', left: c.x - 200, top: 205, width: 400, textAlign: 'center', fontFamily: JF.display, fontSize: 48, color: '#f4efe6'}}>{c.date}</div>
        </React.Fragment>
      ))}
      {/* Steve Boca: the fourth back door */}
      <Note text="Steve Boca, grocer" x={170} y={300} size={52} rot={-3} at={t.at('Steve Boca')} />
      <Door x={250} y={400} h={360} at={t.at('He survives,')} cut={t.at('chiseled')} />
      <Note text="survived · no memory" x={170} y={850} size={50} rot={-3} at={t.at('no memory')} color="#ffffff" />
      <Counter label="BACK DOORS" n={4} at={t.at('chiseled') + 6} />
      {/* Sarah Laumann */}
      <Note text="Sarah Laumann, 19" x={800} y={300} size={52} rot={-3} at={t.at('Sarah Laumann,')} />
      <Note text="living alone" x={820} y={420} size={52} rot={-3} at={t.at('living alone,')} color="#ffffff" />
      <Note text="survived" x={840} y={560} size={60} rot={-3} at={t.at('She survives')} />
      <Note text="an axe on the lawn" x={800} y={700} size={52} rot={-3} at={t.at('lawn.')} color="#ffffff" />
      {/* Mike Pepitone */}
      <Clip src={P.pepitone.src} x={1420} y={300} w={360} rot={3} at={t.at('Mike Pepitone,')} />
      <Note text="Mike Pepitone," x={1360} y={730} size={50} rot={-3} at={t.at('Mike Pepitone,')} />
      <Note text="father of six" x={1380} y={810} size={50} rot={-3} at={t.at('father of six.')} color="#ffffff" />
      <XMark x={1590} y={900} at={t.at('dies of')} size={80} />
      <Note text="(first reports: two men, an iron bar)" x={1060} y={960} size={40} rot={-2} at={t.at('dies of') + 10} color={pal.box} />
      <Tag text={P.pepitone.tag} />
    </Desk>
  );
};

/** Four doors in a row: the last attack anyone has tied to him. */
const Last: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  return (
    <Desk a={t.at("That's the last")} flicker>
      {[0, 1, 2, 3].map((i) => <Door key={i} x={260 + i * 380} y={260} h={480} at={t.at("That's the last") + i * 3} done />)}
      {g >= t.at('the last attack') && <Highlight text="THE LAST ATTACK" x={520} y={820} size={96} at={t.at('the last attack')} seed={91} rot={-2} />}
      <Counter label="BACK DOORS" n={4} at={0} />
    </Desk>
  );
};

/** He just stops: three lines, then the heartbeat goes quiet. */
const Stops: React.FC<{t: TL}> = ({t}) => {
  const g = useGFrame();
  const pal = usePal();
  const end = interpolate(g, [t.at('He just') + 30, t.at('He just') + 60], [1, 0.3], clamp);
  return (
    <Pic src={P.nightStreet.src} tag={P.nightStreet.tag} a={t.at("He doesn't get")} b={t.frames + 30} fy={800} z0={1.04} z1={1.1} look="night" flicker>
      {() => (
        <AbsoluteFill style={{opacity: end}}>
          <Note text="never caught" x={160} y={200} size={84} rot={-4} at={t.at('caught.')} color="#ffffff" />
          <Note text="never writes again" x={200} y={360} size={84} rot={-4} at={t.at('write again.')} color="#ffffff" />
          <Note text="he just stops." x={240} y={540} size={110} rot={-4} at={t.at('He just')} color={pal.subject} />
        </AbsoluteFill>
      )}
    </Pic>
  );
};

const Body: React.FC = () => {
  const t = makeTimeline(N, 30);
  const at = t.at;
  const cuts: [number, React.ReactNode][] = [
    [0, <NotDone t={t} />],
    [at('August 10th,') - 1, <Timeline t={t} />],
    [at("That's the last") - 1, <Last t={t} />],
    [at("He doesn't get") - 1, <Stops t={t} />],
  ];
  const scene = useScene(cuts);
  // a slow heartbeat under the last lines, stopping on "He just stops"
  const beats = Array.from({length: 6}, (_, i) => at("He doesn't get") + i * 34).filter((f) => f < at('He just') + 10);
  return (
    <>
      {scene}
      <Bed src="music/g_southampton.mp3" from={0} to={at("He doesn't get") + 10} vol={0.18} fadeOut={30} />
      <Sounds t={t} cuts={cuts.map(([f]) => f)}
        stamps={['the last attack']}
        writes={['whoever', "wasn't finished.", 'Mike Pepitone,', 'Steve Boca', 'no memory', 'Sarah Laumann,', 'living alone,', 'She survives', 'lawn.', 'father of six.', 'caught.', 'write again.', 'He just']}
        ticks={['August 10th,', 'September 3rd.', 'October 27th.', 'dies of']}
        extra={[[at('chiseled'), 'sfx/chisel.wav', 0.45], ...beats.map((f) => [f, 'sfx/heartbeat.wav', 0.5] as [number, string, number])]} />
    </>
  );
};

export const Ch08 = () => (
  <ChapterShell n={N} audio="audio/ch08_last_door.wav" lead={LEAD}>
    <Body />
  </ChapterShell>
);
