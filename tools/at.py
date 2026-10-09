"""Seconds into a chapter composition for phrases (+ offset), for picking still times.
  python3 tools/at.py ch02_back_door 1.0 "Here's what" "robbery." ...   (adds the logo lead for chapters 2+)"""
import json, re, sys
stem, off, *phrases = sys.argv[1:]
w = json.load(open(f'public/audio/{stem}.words.json'))['words']
n = lambda s: re.sub('[^a-z0-9]', '', s.lower())
toks = [n(x['w']) for x in w]
lead = 0 if stem.startswith('ch01') else 44 / 30
out = []
for ph in phrases:
    p = [n(x) for x in ph.split()]
    i = next(i for i in range(len(toks)) if toks[i:i + len(p)] == p)
    out.append(f"{w[i]['s'] + lead + float(off):.1f}")
print(' '.join(out))
