# Jazz It Out: The Axeman of New Orleans

A 9:53 **15 Minute History** video about the Axeman of New Orleans (1918–1919), for a general audience. It
answers one question: *how did a killer get a whole city to throw him a party?* This page says where everything is
and how to change or rebuild it.

Built from the `15-minute-history` skill's template. The channel's style guide, music and effects library, and
look books live in [`ethomasclass/15minhistorystyle`](https://github.com/ethomasclass/15minhistorystyle). This video's
documents and reusable kit are copied there too, under `examples/07_Axeman/` and `techniques/components/axeman/`.

## Keys

The narration uses ElevenLabs. Its key goes in `.env`, which git ignores:

```
ELEVENLABS_API_KEY=...
VOICE_ID=mI4rIAStSQeKeqsz4FwM   # the channel's narrator
```

Rendering needs no keys, because the voice, images and music are all committed. The ElevenLabs key was pasted into a
chat once, so rotate it in the ElevenLabs dashboard.

## Where things are

| What | Where |
|---|---|
| YouTube master, 1080p, −14 LUFS (Git LFS) | `renders/Axeman_1080p.mp4` |
| 720p copy / 480p preview | `renders/Axeman_720p.mp4` / `review/Axeman_preview_480p.mp4` |
| Thumbnails (two concepts) | `renders/thumbnails/Axeman_A.png` (the shotgun man), `Axeman_B.png` (the sheet music and the door) |
| Title, description, chapters, tags | `review/YouTube_description.md` |
| Script with chapter times, fact-check flags (1–20) and sources | `script/SCRIPT.md` (rebuilt by `script/_build_script_md.py` from the chapter files and `_notes.md`) |
| Narration text, one file per chapter, plus the two plugs | `script/ch01_cold_open.txt` … `ch09_who.txt`, `plug_mid.txt`, `plug_end.txt` |
| Pronunciation test | `script/tests/Axeman_pronunciation_test.mp3` |
| Images with sources and credits | `script/IMAGES.md`, `public/img/credits.json` |
| Music plan / public-domain records | `script/MUSIC.md` / `script/PD_MUSIC.md` |
| Music options you were played | `review/music_options/` |
| Voice and word timings | `public/audio/chNN_*.wav` + `.words.json` |
| Masks and parallax layers | `public/img/masks/`, `public/img/layers/` |

## How it's built

1. **Narration:**
   - Run `tools/voice_all.sh` (ElevenLabs v3, the locked pace). `HEAVY="06 09"` gives the heavy chapter and the
     ending longer pauses.
   - One voice speed throughout (stretch 1.15). Chapters 6 and 9 were first voiced slower (1.08) and re-voiced to
     match, because the speed change made the voice sound different. Each `.words.json` records its `"pace"`, and
     `tools/render.sh` warns if they ever differ.
   - Every scene is keyed to a spoken phrase (`t.at('phrase')`), so re-voicing re-times the video.
   - Three pauses were added after voicing with `tools/pause.py`. **Run them again after re-voicing those
     chapters**:
   - `ch04_sitting_up "The Axeman." 0.2`
   - `ch08_last_door "He just stops." 0.3`
   - `ch09_who "It played." 1.5`
2. **Look:**
   - The template kit, with line boil, text fit and the tape shadow.
   - `src/kit/ax.tsx`: the drawn motifs (`Door`, `Blamed`, `Clock`, `Witness`, `Chalk`, `Shadow`), `Parallax` for
     photographs, `Clip` for clippings, and Ouija's `Desk`, `DropCard`, `SyncQuote` and `SrcView`.
   - Chapter 6 is `quiet`: teal only, no jokes.
3. **Masks:**
   - Photographs: `tools/mask.py` (rembg).
   - Halftone clippings and line art: `tools/polymask.py`, polygons traced by hand, because rembg can't cut those.
   - `tools/layers.py` splits masked photos into the subject plus an inpainted background for `Parallax`.
4. **Music:**
   - 12 reused library cues.
   - Three public-domain 1917–18 Original Dixieland Jazz Band records (`public/music/pd/party_far.mp3`, `party.mp3`,
     `ending.mp3`). These are normalized edits; the raw transfers are re-downloadable from the URLs in `PD_MUSIC.md`.
5. **Render:** `tools/render.sh` renders every chapter, joins them, masters to −14 LUFS (`tools/master.py`) and makes
   the 720p. `tools/render.sh 05 09` re-renders only those chapters and rejoins. A full render takes about 45 minutes
   on 4 cores.
6. **Checks:**
   - `npx tsc --noEmit -p .`
   - `tools/anchors.py`
   - `tools/stills.mjs` + `tools/sheet.py`
   - `tools/probe_text.mjs` (text off the frame edge)
   - `tools/beatcheck.py` (do the payoff lines land?)
   - `tools/youtube_check.py`

## Setup

```sh
npm install
pip install pillow numpy imageio-ffmpeg opencv-python-headless   # + rembg onnxruntime to remake masks
export REMOTION_CHROME=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)
npx remotion studio            # preview any chapter
tools/render.sh                # full render + master → out/Axeman_1080p.mp4, renders/Axeman_720p.mp4
git lfs install                # the 1080p master is stored in Git LFS
```

## Things to know

- **No AI images.** Every picture is archival (public domain, with credits in `public/img/credits.json`). The
  narration is the channel's ElevenLabs voice clone, as in every video.
- **The sheet-music cover:**
  - The cover printed a racist subtitle ("Coon Novelty Song"). The on-screen copy
    (`public/img/ch01/mysterious_axman_jazz_cover_1919_display.jpg`) has that line painted out.
  - The original file is kept unaltered next to it.
- **Content ID:** public-domain records can still be claimed. *Tiger Rag* (the ending) is the likeliest; dispute it
  with the Library of Congress source in `PD_MUSIC.md`.
- **Open items:**
  - **The Davilla song:** the Historic New Orleans Collection request for the score is in your Gmail drafts. Once the
    pages arrive, record a solo piano version (public-domain composition, our own performance) for ch01, ch07 and
    ch09.
  - **Thumbnail:** pick A or B.
  - **Fact-check flags:** `SCRIPT.md` has 20 flags, each with its sources and how the script hedges. Read them before
    publishing. The softest claims are "money and jewelry" (flag 2) and the shotguns (flag 7, illustrative).
- **Runtime limit:** the video must stay under 10:00. It's 9:53 now, which leaves about 7 seconds for any added
  pause or a longer end screen.
