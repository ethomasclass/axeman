# Public-domain period jazz (1917–1924) for *Jazz It Out*

The files are in `public/music/pd/`. They are MP3s transcoded straight from the archive's master files: LoC National Jukebox WAV, or Internet Archive Great 78 24-bit/96 kHz FLAC, resampled to 44.1 kHz. **There was no EQ, no denoise, no trim and no normalization**, so these are still raw transfers. Do any cleanup in the edit (see "Using them" below), not on these files. Each MP3's ID3 comment holds its label, matrix and source ID.

Measured 2026-10-08 on the final MP3s with ffmpeg `ebur128` (integrated loudness). The "Bed" figure applies the music catalog's rule: about 0.15 for a −12 LUFS cue, doubled for every 6 dB quieter. Treat it as a starting point.

## The tracks

| File | Title | Performer | Label & catalog (matrix) | Recorded | Source | Dur | LUFS | Bed | Transfer | Character / mood | Suits |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `odjb_livery_stable_blues_1917.mp3` | Livery Stable Blues | Original Dixieland Jass Band (LaRocca, Shields, Edwards, Ragas, Sbarbaro) | Victor 18255-B (B-19331-1) | 1917-02-26, New York | [LoC jukebox-186254](https://www.loc.gov/item/jukebox-186254/) | 3:08 | −23.5 | ~0.56 | LoC Packard Campus archival WAV, raw | The first jazz record ever issued. Barnyard novelty: the clarinet crows like a rooster, the cornet whinnies, the trombone moos. Comic and a bit crude. Quiet transfer, mild hiss, fairly clean. | ch07, under "plenty of respectable people think it's just noise". Also a wry ending. |
| `odjb_dixie_jass_band_one_step_1917.mp3` | Dixie Jass Band One-Step | Original Dixieland Jass Band | Victor 18255-A (B-19332-3) | 1917-02-26, New York | [LoC jukebox-186256](https://www.loc.gov/item/jukebox-186256/) | 2:37 | −21.8 | ~0.46 | LoC archival WAV, raw | Driving, breathless one-step with all horns going at once. Pure 1917 dance-floor energy. Fairly clean. | The party night, opening the "dance halls were packed" montage. |
| `odjb_tiger_rag_1918.mp3` | Tiger Rag | Original Dixieland Jazz Band | Victor 18472-B (B-21701-3) | 1918-03-25, New York | [LoC jukebox-28588](https://www.loc.gov/item/jukebox-28588/) | 3:11 | −16.0 | ~0.24 | LoC archival WAV, raw | The New Orleans anthem. Fast and raucous, with the "hold that tiger" trombone roars. The most recognisable cue here, and the most likely to draw a Content ID match (see below). | The peak of the party night (12:15, "jazz it out"). |
| `odjb_at_the_jazz_band_ball_1918.mp3` | At the Jazz Band Ball | Original Dixieland Jazz Band | Victor 18457-A (B-21583-1) | 1918-03-19, New York | [LoC jukebox-28219](https://www.loc.gov/item/jukebox-28219/) | 2:41 | −15.6 | ~0.23 | LoC archival WAV, raw | Bright, bouncy and joyful. The title fits on the nose. Clean for its age. | The party night: house parties and "bands played in living rooms". |
| `odjb_clarinet_marmalade_1918.mp3` | Clarinet Marmalade Blues | Original Dixieland Jazz Band | Victor 18513-B (B-22066-2) | 1918-07-17, New York | [LoC jukebox-29613](https://www.loc.gov/item/jukebox-29613/) | 2:46 | −15.7 | ~0.23 | LoC archival WAV, raw | A swirling showcase for Larry Shields' clarinet. Giddy and slightly unhinged. | Second party cue. Also the cold open's "almost every dance hall… packed" line. |
| `biese_mystery_1919.mp3` | Mystery! (medley fox trot: *Mystery!* / *Freckles*) | Paul Biese's Novelty Orchestra | Victor 18647 (B-23379-1) | 1919-12-16, New York | [LoC jukebox-188628](https://www.loc.gov/item/jukebox-188628/) | 3:19 | −17.7 | ~0.29 | LoC archival WAV (2-channel), raw | Smoother, saxophone-heavy dance-orchestra sound from late 1919, more polished than the ODJB. The title is the point. Check the mood by ear before placing it. | ch09 "Who": the unsolved question, and the ending. |
| `sweatman_thats_got_em_1919.mp3` | That's Got 'Em | Wilbur Sweatman's Original Jazz Band | Columbia A2721 (78294-1) | 1919-02-08, New York | [LoC jukebox-660616](https://www.loc.gov/item/jukebox-660616/) (UCSB disc) | 3:04 | −16.6 | ~0.25 | UCSB transfer via LoC, flat and raw | Sweatman's clarinet, half ragtime and half jazz, perky and twitchy. **Heavy surface hiss.** Has inter-sample peaks over 0 dBTP, which is fine at bed level. | The newsroom panic: the letter hits the papers, and the city buzzes. Also good in transitions. |
| `louisiana_five_yelping_hound_blues_1919.mp3` | Yelping Hound Blues | Louisiana Five (Alcide Nuñez, clarinet; Charles Panelli, trombone; Joe Cawley, piano; Karl Berger, banjo; Anton Lada, drums) | Columbia A2742 (78377-3) | 1919-04-01, New York | [LoC jukebox-660897](https://www.loc.gov/item/jukebox-660897/) (UCSB disc) | 3:26 | −15.9 | ~0.24 | UCSB transfer via LoC, flat and raw | Clarinet "yelps" over a banjo and piano chug, with no cornet, so the sound is thinner and more rickety. New Orleans clarinetist Nuñez. **Heavy surface hiss.** | The party night, lower-key: street or house-party texture. |
| `europe_369th_memphis_blues_1919.mp3` | Memphis Blues | Lieut. Jim Europe's 369th U.S. Infantry "Hell Fighters" Band | Pathé 22085 (vertical-cut; mx 22085 B) | 1919-03-07, New York (11 days before the jazz night) | [IA Great 78 gbia0298581b](https://archive.org/details/78_memphis-blues_lieut-jim-europes-369th-u-s-inf-hell-fighters-band-handy_gbia0298581b) | 2:51 | −19.0 | ~0.34 | Great 78 raw transfer (one stylus, 80 rpm, unrestored) | A big brass-band blues with syncopated military swagger and a wall of brass. **Pathé vertical-cut, so very heavy broadband hiss and a dull top end.** | The newsroom panic, or any "the whole city" beat. Also period context: jazz arriving with the troops home in 1919. |
| `morton_35th_street_blues_1924.mp3` | 35th Street Blues | Jelly Roll Morton (piano solo) | Orig. master 8072, issued Paramount 12216 / Puritan 12216 (this disc is an SD reissue) | 1924, Chicago | [IA Great 78 gbia0031612b](https://archive.org/details/78_35th-street-blues_jelly-roll-morton-morton_gbia0031612b) | 2:45 | −19.7 | ~0.36 | Great 78 raw transfer (4 styli; GB-preferred EQ version) | Solo New Orleans piano: a rolling blues with stride left hand, wistful rather than wild. Some low-frequency rumble (add a highpass around 60–80 Hz). Last ~2.5 s is run-out. | **Cold open under the sheet music** (the woman at the piano). Also ch07's "pounded on the family piano", and the ending. |

## Top picks

1. **Cold open, under the sheet music:** `morton_35th_street_blues_1924` (solo piano, matching the cover art), low.
2. **The party night (ch07):** `odjb_dixie_jass_band_one_step_1917` into `odjb_tiger_rag_1918` at 12:15. `odjb_at_the_jazz_band_ball_1918` and `odjb_clarinet_marmalade_1918` are alternates. ODJB Victor records were exactly what a 1919 household without a band would have put on the Victrola ("people… played records").
3. **The "it's just noise" line:** `odjb_livery_stable_blues_1917` (barnyard clarinet).
4. **Newsroom panic (letter printed):** `sweatman_thats_got_em_1919` or `europe_369th_memphis_blues_1919`.
5. **Ending / "Who" (ch09):** `biese_mystery_1919`, or a reprise of the Morton piano.

**Period accuracy.** Only the 1917–18 ODJB sides were on sale on March 18–19, 1919. Sweatman (recorded Feb 1919) and the 369th (recorded Mar 7, 1919) were recorded before the night but probably released after it. The Louisiana Five (Apr 1919), Biese (Dec 1919) and Morton (1924) came later. Use those later records as mood, and don't present them as "what they heard that night".

## Public-domain basis

- **Sound recordings.** Under 17 U.S.C. §1401(a)(2)(B) (Music Modernization Act, 2018):
  - Recordings first published before 1923 left protection at the end of 2021 and are US public domain since **Jan 1, 2022**. That covers every track above except Morton.
  - Recordings first published in 1923–1946 get 100 years from publication. So the 1924 Morton recording is PD since **Jan 1, 2025**.
- **Compositions.** All the underlying compositions were published 1912–1924. That is more than 95 years ago, so they are PD as well.
- **The Morton disc.** The Great 78 copy of *35th Street Blues* is a later SD reissue pressing of the 1924 master. A faithful dub adds no new copyrightable authorship, so the PD date runs from the 1924 first publication.
- **LoC wording.** The LoC pages still carry the old "courtesy of Sony Music Entertainment" rights advisory and a `rights_restricted` flag in their JSON. That is a leftover from the Jukebox's original license. The recordings themselves are PD under §1401.

## Content ID

These files are unrestored archival transfers, not commercial remasters. That is the best position for a dispute: you can cite the LoC item, matrix and take, or the Great 78 identifier. The Great 78 files are the rawest, since they are George Blood multi-stylus flat transfers.

Content ID matches the *performance*, though, so any transfer of the same take can still match a label's or a reissue uploader's claim. *Tiger Rag* and *Livery Stable Blues* are the most likely to be claimed. Keep this file and the source URLs for disputes.

**Where the masters came from.** LoC WAV masters live at `https://tile.loc.gov/storage-services/master/mbrsrs/mbrsjukebox/<id>/<id>.wav`. The IDs are:

| Track | LoC master ID |
|---|---|
| Livery Stable Blues | `dlc_victor_18255_01_b19331_01` |
| Dixie Jass Band One-Step | `dlc_victor_18255_01_b19332_03` |
| Tiger Rag | `dlc_victor_18472_01_b21701_03` |
| At the Jazz Band Ball | `dlc_victor_18457_01_b21583_01` |
| Clarinet Marmalade Blues | `dlc_victor_18513_01_b22066_02` |
| Mystery! | `dlc_victor_18647_01_b23379_01` |
| That's Got 'Em | `ucsb_col_a2721_01_78294_01` |
| Yelping Hound Blues | `ucsb_col_a2742_01_78377_03` |

The two Great 78 tracks came from each item's preferred `.flac`.

These were fetched directly from loc.gov, not from the `loc-jukebox-*` mirror items on archive.org. Those mirrors were uploaded by a third party on 2026-10-08.

## Using them

- These are mono 78s with hiss. Under narration, a lowpass around 6–7 kHz and a highpass around 80 Hz in the edit (Remotion/ffmpeg) will tame them without "remastering" the files.
- The two Columbia/UCSB sides and the Pathé side are the noisiest. You can also lean into the noise as period texture under the sheet music or the newspaper scans.
- The Columbia sides have true peaks of +1.7 and +2.6 dBTP. Bed levels of about 0.25 remove that.

## Checked and not used

- **Europe 369th, *Darktown Strutters' Ball*** (Pathé 22081, Great 78): −30 LUFS and very noisy.
- **Louisiana Five, *Heart Sickness Blues*** (Medallion 847, Great 78 `gbia0534442a`): −27 LUFS. The archive notes say "stylus wound up; swishing". *Laughing Blues* was not found in either archive.
- **Frank Banta, *Wild Cherry Rag*** (Gennett 4735, 1921, a genuine pre-1926 piano solo): the hiss nearly buries the piano.
- **Jelly Roll Morton, *London Blues*** (Session No. 3 reissue, mx 535): cleaner than *35th Street Blues*, but its recording date couldn't be confirmed (DAHR was blocked), so it was skipped.
- **Morton, *King Porter Stomp*** (archive.org `JV-630-1923-…`, said to be Gennett 5289, 1923-07-17): the MP3 has an unknown source and may be a CD-remaster rip, which makes it a Content ID risk. The 1923 Gennett solos *King Porter*, *Wolverine Blues* and others are not on Great 78 or the Jukebox.
- **Lawrence Cook "piano roll" *Tiger Rag* 78s** (1951–53): these are NOT public domain. A modern recording of a roll is a new sound recording.
- **`airellebigbandarchive` and `hifidelity` copies on archive.org:** unknown provenance and processing, so the LoC masters were used instead.

## *The Mysterious Axman's Jazz (Don't Scare Me Papa)*: no pre-1926 recording found

- DAHR title searches for "axman" and "axeman" returned "No records match". Later DAHR queries ("scare me papa", talent "Davilla") hit a CAPTCHA.
- archive.org search across all collections found nothing, and neither did the LoC audio search.
- HNOC's page for the sheet music (HNOC 2008.0052) says the cover advertises a piano-roll version. Even if a roll survives, a roll is not a sound recording, and any recording of it played back today would be a new, copyrighted recording.
- The 1919 score itself is PD, so the practical route is a **new performance from the HNOC scan**: the channel's own piano render, or a commissioned recording.
- Side lead from the LoC search: *The Herald* (New Orleans), March 20, 1919, on Chronicling America: https://www.loc.gov/item/sn88064020/1919-03-20/ed-1/. This is a contemporary report window for the jazz night.
