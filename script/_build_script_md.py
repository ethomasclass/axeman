"""Rebuild SCRIPT.md from the chapter files (narration) + the hand-written notes below the chapters."""
import glob, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
NAMES = {
    'ch01': 'Cold Open: The Sheet Music', 'ch02': 'The Back Door', 'ch03': 'A Spy, a Hatchet and a Deathbed',
    'ch04': 'A City Sitting Up at Night', 'ch05': 'Why Italian Grocers?', 'ch06': 'Gretna',
    'ch07': 'A Letter from Hell', 'ch08': 'The Last Door', 'ch09': 'So Who Was the Axeman?',
}
files = sorted(glob.glob(os.path.join(HERE, 'ch*.txt')))
words = sum(len(re.sub(r'[*{}]', '', open(f).read()).split()) for f in files)
out = ['# Jazz It Out: The Axeman of New Orleans', '',
       f'**15 Minute History** · narration script · {words:,} words · 9:53 finished (with the intro, title card, '
       'logo breaks, two plugs and the end screen)', '',
       '**Driving question (cold open, answered in the last chapter):** How did a killer get a whole city to throw him a party?',
       '**Answer:** He probably didn\'t. The attacks and the fear were real; newspapers gave the fear a name; innocent people were '
       'blamed again and again; and a letter that was almost certainly a prank gave a frightened city something to do with its fear. '
       'The party was real. The invitation almost certainly wasn\'t.', '',
       'Audience: general (no vocab cards). Chapter 6 is the heavy chapter: `quiet` palette, longer pauses (same voice speed), no jokes.', '',
       'Chapter times are from the final render (9:53; `tools/render.sh` prints them).', '', '---', '']
STARTS = ['0:00', '0:52', '2:02', '2:58', '4:10', '5:12', '6:12', '7:43', '8:25']  # from tools/render.sh
for i, f in enumerate(files):
    stem = os.path.basename(f)[:4]
    txt = open(f).read().strip()
    out += [f'## {STARTS[i]} | {NAMES.get(stem, stem)}', '', txt, '']
for name, title in (('plug_mid', 'Mid-video plug (end of ch04)'), ('plug_end', 'End plug (over the end screen)')):
    out += [f'## {title}', '', open(os.path.join(HERE, name + '.txt')).read().strip(), '']
out += ['---', '', open(os.path.join(HERE, '_notes.md')).read().strip(), '']
open(os.path.join(HERE, 'SCRIPT.md'), 'w').write('\n'.join(out))
print('SCRIPT.md', words, 'words')
