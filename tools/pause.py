"""Insert a dramatic pause before a phrase in a voiced chapter: silence goes into the WAV, every later word timing
shifts, and the duration grows. Run it again after any re-voice of that chapter (voice.py writes fresh files).

  python3 tools/pause.py ch09_who "It played." 1.5
"""
import json, os, re, sys, wave
HERE = os.path.dirname(os.path.abspath(__file__))
AUD = os.path.join(HERE, "..", "public", "audio")
stem, phrase, sec = sys.argv[1], sys.argv[2], float(sys.argv[3])
jp, wp = os.path.join(AUD, stem + ".words.json"), os.path.join(AUD, stem + ".wav")
d = json.load(open(jp))
if any(p["before"] == phrase for p in d.get("pauses", [])):
    sys.exit(f"{stem}: a pause before {phrase!r} is already in; re-voice first to change it")
n = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
toks, p = [n(w["w"]) for w in d["words"]], [n(x) for x in phrase.split()]
i = next(k for k in range(len(toks)) if toks[k:k + len(p)] == p)
cut = (d["words"][i - 1]["e"] + d["words"][i]["s"]) / 2 if i else d["words"][0]["s"]
with wave.open(wp) as w:
    params, rate, width, ch = w.getparams(), w.getframerate(), w.getsampwidth(), w.getnchannels()
    data = w.readframes(w.getnframes())
at = int(cut * rate) * width * ch
data = data[:at] + b"\0" * (int(sec * rate) * width * ch) + data[at:]
with wave.open(wp, "wb") as w:
    w.setparams(params)
    w.writeframes(data)
for w in d["words"][i:]:
    w["s"] = round(w["s"] + sec, 3)
    w["e"] = round(w["e"] + sec, 3)
d["duration"] = round(d["duration"] + sec, 3)
d.setdefault("pauses", []).append({"before": phrase, "sec": sec, "at": round(cut, 3)})
json.dump(d, open(jp, "w"))
print(f"{stem}: {sec}s of silence at {cut:.2f}s, before {phrase!r}; duration now {d['duration']:.2f}s")
