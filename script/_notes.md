## Production notes

- **Title card:** JAZZ IT OUT · *The Axeman of New Orleans* · 1918 – 1919. ("Jazz it out" is the letter's own phrase.)
- **Heavy chapter:** chapter 6 (Gretna, a two-year-old killed). `quiet` palette (teal only, bone titles), longer
  pauses at the same voice speed (`HEAVY="06 09" tools/voice_all.sh`), no jokes, no punch-ins, respectful images
  (the street, the courthouse, the newspaper column; never the victims' bodies). The ending (ch09) gets the longer
  pauses too. *Both were first voiced slower and re-voiced at the standard speed: one voice speed per video.*
- **Recurring motifs (callbacks):**
  - **The sheet music** (ch01 cold open → ch07 "Yes. That's our sheet music." → ch09 last line). Same image every time.
  - **The back door panel** (ch02 "Hold onto that back door" → ch04 Romano → ch06 "the hole in the door" → ch08 Boca). A
    drawn teal door with one coral panel that gets chiseled out; it reappears with a counter each time.
  - **Blamed** (ch03 Besumer → ch05 the Mafia / Italians → ch06 the Jordanos → ch09 "innocent people blamed, again and
    again"). A running list on an index card: each name gets added in teal and struck through in orange when cleared.
  - **The clock at 12:15** (ch07): a drawn clock face whose hand ticks from 12:00 to 12:15, then morning light.
- **Effects for a spooky-season episode (all within the house style):**
  - Newspaper clippings as `Doc` cards with marks drawn in the clipping's own pixels; headlines punch in.
  - **The letter** as a word-synced quote (`SyncQuote`), set on aged newsprint, with "jazz it out" and "get the axe"
    underlined in coral.
  - **Candle/lamp flicker** over night scenes (a subtle brightness wobble on the desk), and a slow **vignette breathe**
    in the night-attack beats.
  - **The map of attacks**: the 1919 *Times-Picayune* map of the scenes of the axe murders, with a coral ✕ popping on
    each address as it's named; the count grows chapter by chapter.
  - **Shadow on the wall**: the axe silhouette (a drawn teal outline, never gore) slides across the desk at chapter
    breaks of the night-attack chapters.
  - **The party night (ch07)**: hard cuts on the beat of a real 1918 Original Dixieland Jass Band record (public
    domain), card montage with a counter, and the clock reaching 12:15 — then silence and "Nobody was attacked that night."
- **Masks and parallax:** coral tint + teal trace on the pianist (cover), the Maggios, Besumer, the shotgun man in the
  1919 cartoon, the flu patient, the market cart and the Gretna ferry (trace only: ch06 is quiet). The flu ward, the
  French Market and the ferry are 2.5D parallax shots (`tools/layers.py`, the Ouija technique for photographs).
- **Music:** see `MUSIC.md`. The Davilla song itself waits on a scan of the score (HNOC request drafted).
- **Images:** see `IMAGES.md`. Archival only: no AI images in this video (your call). Masks give the coral tint and teal trace; `tools/layers.py` splits masked photos into parallax layers.

## Pauses cut in after voicing

`tools/beatcheck.py` measures the silence before every *italic* payoff line. Three got more air with `tools/pause.py`.
**Re-run these after re-voicing ch04, ch08 or ch09** (voicing writes fresh files without them):

```sh
python3 tools/pause.py ch04_sitting_up "The Axeman." 0.2
python3 tools/pause.py ch08_last_door "He just stops." 0.3
python3 tools/pause.py ch09_who "It played." 1.5
```

## The last line

"It played." gets a held breath: `python3 tools/pause.py ch09_who "It played." 1.5` puts 1.5 s of silence before it
(re-run it after any re-voice of ch09). The answer's cue resolves on "everything.", the picture sinks toward black
with only record crackle, then a hard cut: the needle drops, a low boom, IT PLAYED. in tape, the cornet player in
coral, and the 1918 record swells once the line is said. The title holds about 5 seconds before the thank-you.

## Plugs (your request)

Two friendly like-and-subscribe reminders, voiced separately so they can be cut without re-voicing a chapter:
- **Mid-video** (`script/plug_mid.txt`, ~10 s), at the end of ch04 right after "the Axeman is quiet": "Quick favor,
  while things are quiet. If you're enjoying this one, tap like and subscribe. It honestly helps a small history
  channel more than you'd think. / Okay. Back to New Orleans."
- **End** (`script/plug_end.txt`, ~7 s), over the end screen after "It played.": "Thanks so much for watching. If you
  liked this one, give it a like and subscribe for more 15 Minute History. I'll see you next time."

## Pronunciation (for ElevenLabs)

| Word | Say it |
|---|---|
| Maggio / Maggios | Mah-joe / Mah-joes |
| Besumer | Bez-oo-mer |
| Cortimiglia | Kor-tee-meel-ya |
| Iorlando | Yor-lahn-doe |
| Jordano / Jordanos | Jor-dah-no / Jor-dah-nos |
| Schiambra | Skee-ahm-bra |
| Pepitone | Pep-ih-toe-nee |
| Davilla | Dah-vil-uh |
| Laumann | Law-mun |
| Picayune | Pick-ee-yoon |
| Orleanians | Or-lee-nee-uns |
| 12:15 | twelve fifteen |

Test file: `script/tests/pronunciation.txt`. Listen before voicing the chapters.

## Fact-check flags

1. **Maggio date and details (ch02).** Most accounts give the early hours of May 23, 1918 (some say May 22). Corner of
   Upperline and Magnolia: Wikipedia, citing *Times-Picayune* May 23–24, 1918. Catherine died at the scene; Joseph died
   minutes after his brothers Jake and Andrew found them. Accounts disagree on whether the axe came first or the razor;
   the script avoids the order and the gore. "An axe that belongs to the Maggios": the victims' own axe in most accounts.
2. **Money left behind (ch02).** "Money and valuables left in plain sight were not stolen" (Wikipedia, citing Gibson
   2006). Some accounts specify jewelry; the script says "money and jewelry", which several accounts repeat. Could be
   softened to "money and valuables."
3. **Andrew Maggio (ch02).** The razor came from his barber shop; he was arrested and released (*Times-Picayune*,
   May 27, 1918, "Andrew Maggio Released; Says He is Innocent").
4. **Chalk message (ch02).** "Mrs. Maggio will sit up tonight just like Mrs. Toney." Wording varies slightly between
   retellings. The Schiambra link (attacked 1912, Joanna killed) is the police theory of the time, and the script says
   "Police guessed". The 1911 cases are questioned by recent researchers; the script says newspapers "dug them up" and
   "nobody could prove" a connection.
5. **Besumer and Lowe (ch03).** Attacked June 27, 1918 (some say June 28). Found by bakery wagon driver John Zanca. The
   German-spy claim, two days in custody, Lowe's deathbed accusation in August 1918 after failed surgery, nine months
   in jail, acquittal May 1, 1919 after about ten minutes: Wikipedia citing Katz 2010, p. 56. Lowe's relationship to
   Besumer is described variously (wife, mistress); the script says "the woman living with him."
6. **Schneider and Romano (ch04).** August 5 and August 10, 1918. Schneider eight months pregnant, baby girl two days
   later. Romano's nieces Pauline and Mary Bruno saw a "dark-skinned, heavy-set man" in a dark suit and slouch hat. The
   script omits "dark-skinned" (an unreliable witness detail that fed prejudice) and keeps "heavy-set". Bloody axe in
   the yard, back-door panel chiseled: Wikipedia.
7. **"Axeman" name and the panic (ch04).** The *Times-Picayune* ran "Police Believe Ax-Man May Be Active in the City"
   on August 6, 1918. Reports of prowlers and axes found in backyards: Katz 2010, p. 56. "Men sit up all night with
   shotguns" is a common description of the panic; treat as illustrative.
8. **Flu and armistice (ch04).** New Orleans closed schools, churches and theaters in October 1918 for the influenza
   epidemic; the armistice was November 11, 1918. "For seven months, the Axeman is quiet": August 10, 1918 → March 10,
   1919.
9. **Italian community and the Black Hand (ch05).** New Orleans had the South's largest Italian community, mostly
   Sicilian. Black Hand extortion letters were real in New Orleans in the 1900s–1910s. The Axeman took nothing, which
   the script uses against the extortion theory.
10. **1891 lynching (ch05).** Police chief David Hennessy was shot in October 1890; on March 14, 1891 a mob stormed
    Parish Prison and killed 11 Italian men, some of whom had just been acquitted and others not yet tried. Usually
    described as the largest single mass lynching in U.S. history; the script hedges with "It's often called".
11. **Gretna (ch06).** March 10, 1919 (the Exoneration Registry says about 3 a.m., March 9–10). Mary killed in her
    mother's arms. **Ages differ between sources**, so the script gives none: Mary is "two years old" in the Exoneration
    Registry, "infant" on Wikipedia and "4-year-old" in the AP item of October 12, 1919; Iorlando is 68, 69 or (AP) 76;
    Frank 17 or 18. The script says "their little daughter, Mary" and "an old man, in poor health".
    Convicted; Frank sentenced to hang, Iorlando to life. Rosie recanted December 7, 1920 (Crime Library; National
    Registry of Exonerations). "Too big, many said, to fit through the hole in the door": Wikipedia/Katz.
12. **The letter (ch07).** Dated "Hell, March 13, 1919". Secondary sources give March 13, 14 or 16 for publication.
    *The Herald* (New Orleans), March 20, 1919 ("That Ax-Man's Letter", Chronicling America, shown on screen) says the
    letter "made good Sunday reading", so the *Times-Picayune* printed it on **Sunday, March 16, 1919**, matching HNOC
    and the St. Tammany library. The script says "Three days after Gretna, a letter turns up at the newspapers"
    (written March 13) "And the Times-Picayune prints it" (no date). Quoted lines are verbatim from
    the letter as reprinted: "Esteemed Mortal", "They have never caught me and they never will", "a spirit and a demon
    from the hottest hell" (some reprints: "a fell demon"), "I am very fond of jazz music, and I swear by all the devils
    in the nether regions that every person shall be spared in whose home a jazz band is in full swing", "jazz it out",
    "will get the axe".
13. **St. Joseph's Night (ch07).** March 19, 1919 was a Wednesday (St. Joseph's Day). The letter's "12:15 on next
    Tuesday night" is the night of March 18–19, St. Joseph's Night. Consistent.
14. **The party (ch07).** Dance halls full, bands at house parties: Katz 2010, p. 59; HNOC. "Played records or pounded
    on the family piano" is from later retellings and is hedged with "reportedly".
15. **The cover (ch01).** The script describes the real cover: a family playing piano, trombone and drum, the door
    open behind them. One line of the cover's small print, the title of Davilla's earlier song, contains a racial slur;
    the display copy used in the video covers that line (`img/ch01/mysterious_axman_jazz_cover_1919_display.jpg`). The
    original file is kept unaltered next to it.
15b. **The song (ch01, ch07).** *The Mysterious Axman's Jazz (Don't Scare Me Papa)*, Joseph John Davilla, arr. Jos.
    Garrow, World's Music Publishing Co., New Orleans, 1919 (HNOC 2008.0052). HNOC says Davilla wrote it "while he
    waited for the axman." **Cover description in ch01 (band, woman at the piano looking over her shoulder) must be
    checked against the scan** and adjusted if needed.
16. **"Probably never wrote it" (ch07).** No proof either way. Most modern accounts treat the letter as a hoax. The
    script now cites the contemporary evidence: *The Herald*, March 20, 1919, called it "this joke-letter" and said "it
    looks to us that someone put one over on the Times-Picayune" (quoted as "Someone put one over on the
    Times-Picayune," it said). The same editorial says the *Times-Picayune* "gloated over it Wednesday morning by
    publishing a cartoon showing one of the many families in a state of fright, the mother... playing jazz music":
    that cartoon is the sheet-music cover art ("Courtesy of The Times-Picayune, March 19, 1919").
17. **1919 attacks (ch08).** Steve Boca, August 10, 1919 (survived); Sarah Laumann, 19, September 3, 1919 (survived,
    attacked through an open window; the script doesn't mention a door for her); Mike Pepitone, October 27, 1919
    (killed; father of six). Last attack attributed. The AP item shown on screen (October 28, 1919) reported "blows
    from an iron bar" and "two assailants"; later accounts say one large man with an axe. The video notes the first
    reports in orange (a disputed claim) and the narration keeps "a large man".
18. **Los Angeles (ch09).** A 1921 newspaper story (dates given as December 1920 or December 1921) that Pepitone's
    widow, Esther Albano, shot a man called Joseph Mumfre/Manfre in Los Angeles and said he killed her husband.
    Researchers have not found independent records confirming it; the script says "A couple of years later,
    newspapers reported..." and "The records... have never turned up."
19. **Death toll (not stated).** At least six killed (HNOC): Joseph and Catherine Maggio, Harriet Lowe, Joseph Romano,
    Mary Cortimiglia, Mike Pepitone. The script never gives a total, to avoid the widely varying 6–17 estimates.
20. **"Axeman" vs "Axman".** Period papers and the sheet music used "Axman"; the narration uses "Axeman" (the common
    spelling today, and what viewers search). The sheet-music title is read as printed.

## Sources

- Wikipedia, "Axeman of New Orleans" (citing *Times-Picayune* 1918–19 articles; Katz, *Cold Cases*, 2010; Gibson,
  *Serial Murder and Media Circuses*, 2006; Davis, *The Axeman of New Orleans*, 2017).
- The Historic New Orleans Collection, "The Mysterious Axman's Jazz (Don't Scare Me Papa)" (P. Arceneaux, 2016).
- St. Tammany Parish Library, "Historical News Articles: The Axeman's Letter."
- National Registry of Exonerations / Exoneration Registry, cases of Frank and Iorlando Jordano.
- Crime Library, "The Axeman of New Orleans"; Mental Floss; Historic Mysteries.
- Library of Congress, Chronicling America (newspaper pages reprinting the coverage).
