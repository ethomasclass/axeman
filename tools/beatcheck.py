"""Do the payoff lines land? Checks every *italic* line in script/chNN_*.txt against the rendered chapters.

  python3 tools/beatcheck.py                 # every chapter rendered in out/ch/
  python3 tools/beatcheck.py 07 09           # only these

For each beat (the first word of an *italic* span) it prints:
  gap   silence in the narration before the word (from the word timings). Flagged under 0.3 s; the big
        payoffs want 0.4 s or more (tools/pause.py adds it). Emphasis mid-sentence needs none.
  room  how much quieter the pause before the word is than the chapter's typical level, in dB (the pause up to
        1 s, leaving out the last 0.1 s, where a needle drop or breath into the line belongs).
        Under 3 dB means the mix runs straight into the line with no breath.
  hit   where the loudest 100 ms in the next 1.5 s falls, relative to the word. A sting or boom that peaks
        before the word (negative) steps on the line; it should land on it or just after.
and writes out/beats.png: one strip per beat, 3 s either side, with the word marked.
"""
import glob, json, os, re, subprocess, sys

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SR = 8000
WIN = SR // 10  # 100 ms
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())


def audio(path):
    raw = subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768


def db(x):
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-6)


def beats_for(stem):
    text = open(os.path.join(ROOT, 'script', stem + '.txt')).read()
    words = json.load(open(os.path.join(ROOT, 'public', 'audio', stem + '.words.json')))['words']
    toks = [norm(w['w']) for w in words]
    out, pos = [], 0
    for span in re.findall(r"\*([^*]+)\*", text):
        p = [norm(x) for x in span.split()][:3]
        i = next((i for i in range(pos, len(toks)) if toks[i:i + len(p)] == p), None)
        if i is None:
            print(f'  ? {stem}: "{span}" not found in the word timings')
            continue
        pos = i + 1
        out.append((span, words[i]['s'], words[i]['s'] - (words[i - 1]['e'] if i else 0)))
    return out


def main():
    want = sys.argv[1:]
    files = sorted(glob.glob(os.path.join(ROOT, 'out', 'ch', 'ch*.mp4')))
    strips, font = [], ImageFont.load_default()
    print(f"{'beat':52s}  gap   room   hit")
    for f in files:
        n = re.search(r'ch(\d+)\.mp4', f)[1]
        if want and n not in want:
            continue
        stem = os.path.basename(glob.glob(os.path.join(ROOT, 'script', f'ch{n}_*.txt'))[0])[:-4]
        lead = 0 if n == '01' else 44 / 30
        a = audio(f)
        frames = a[:len(a) // WIN * WIN].reshape(-1, WIN)
        typical = np.median(20 * np.log10(np.sqrt((frames ** 2).mean(1)) + 1e-6))
        for span, s, gap in beats_for(stem):
            t = int((s + lead) * SR)
            span_s = min(max(gap, 0.3), 1.0)
            room = typical - db(a[max(0, t - int(span_s * SR)):t - int(0.1 * SR)])
            after = a[t - WIN // 2:t + int(1.5 * SR)]
            levels = [db(after[k:k + WIN]) for k in range(0, len(after) - WIN, WIN // 4)]
            hit = (int(np.argmax(levels)) * WIN / 4 - WIN / 2) / SR
            flags = ('  <- tight' if gap < 0.3 else '') + ('  <- no room' if room < 3 else '')
            label = f'ch{n} {span[:44]}'
            print(f'{label:52s} {gap:4.2f}s {room:5.1f}dB {hit:+4.2f}s{flags}')
            strips.append((label, a[max(0, t - 3 * SR):t + 3 * SR], min(t, 3 * SR), gap, room))
    if not strips:
        print('no rendered chapters in out/ch/')
        return
    W, H = 1400, 120
    img = Image.new('RGB', (W, H * len(strips)), (20, 18, 15))
    d = ImageDraw.Draw(img)
    for r, (label, seg, mark, gap, room) in enumerate(strips):
        y0 = r * H
        cols = np.array_split(seg, W)
        for x, c in enumerate(cols):
            if len(c):
                h = min(1, float(np.abs(c).max()) * 1.6) * (H / 2 - 18)
                d.line([(x, y0 + H / 2 - h), (x, y0 + H / 2 + h)], fill=(64, 224, 208))
        bx = int(mark / len(seg) * W)
        gx = int((mark - gap * SR) / len(seg) * W)
        d.rectangle([gx, y0 + 16, bx, y0 + H - 4], outline=(255, 111, 97))
        d.line([(bx, y0), (bx, y0 + H)], fill=(255, 166, 0), width=2)
        d.text((6, y0 + 3), f'{label}   gap {gap:.2f}s   room {room:.1f} dB', fill=(244, 239, 230), font=font)
        d.line([(0, y0 + H - 1), (W, y0 + H - 1)], fill=(60, 55, 50))
    out = os.path.join(ROOT, 'out', 'beats.png')
    img.save(out)
    print('wrote', os.path.relpath(out, ROOT))


main()
