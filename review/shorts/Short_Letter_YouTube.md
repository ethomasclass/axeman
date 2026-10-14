# YouTube Short: "Play jazz, or get the axe."

File: `renders/shorts/Axeman_Short_Letter.mp4` (1080×1920, 56.3 s, −14 LUFS). Script: `script/short_letter.txt`.
Built from `src/shorts/Letter.tsx` (`npx remotion render src/index.ts Short-Letter`, then `tools/master.py`).

## Caption (the Short's title)

```
A killer told New Orleans: play jazz or get the axe 🎷🪓
```

Alternates:
- `The serial killer who demanded jazz (true story)`
- `1919: Play jazz… or get the axe`

## Description

```
New Orleans, 1919. For almost a year, someone had been chiseling through back doors at night and attacking families in their beds with an axe. Then a letter signed "the Axeman" made the whole city an offer: every home with a jazz band playing would be spared.

So New Orleans jazzed it out. But was the letter even real? 🎷

Full story: "Jazz It Out: The Axeman of New Orleans" on 15 Minute History.

Images: Times-Picayune and The Herald (1919, Library of Congress, Chronicling America), Wikimedia Commons. All public domain. Music: Original Dixieland Jazz Band, "At the Jazz Band Ball" (Victor, 1918), public domain.

#Shorts #History #TrueCrime #NewOrleans #Jazz
```

## Pinned comment

```
Would you have trusted the Axeman's promise? 🎷🪓 Full story on the channel.
```

## Cover (vertical thumbnail)

- `renders/shorts/Axeman_Short_Cover_A.png`: the deal. The 1919 sheet music with the pianist in coral, the clock at
  12:15, an axe's shadow, PLAY JAZZ / OR GET THE AXE. **Recommended.**
- `renders/shorts/Axeman_Short_Cover_B.png`: the shotgun man. The Times-Picayune cartoon, PLAY JAZZ / OR ELSE
  (matches the main video's thumbnail A).

Both are 1080×1920 PNGs drawn by `src/shorts/LetterThumb.tsx`
(`npx remotion still src/index.ts Short-Thumb-A <out.png> --frame=0`). Upload one as the Short's cover where the
app offers it. If YouTube only shows the frame picker, choose frame 0: it already shows PLAY JAZZ over the door.

## Upload settings

- **Related video:** set it to the full video (*Jazz It Out*). It shows as a tappable link under the Short, the best
  way to send viewers to the long version.
- The last line cuts straight back to the first, so the Short loops cleanly.
- Category Education, not made for kids, same as the main video.

## Fact notes (same sourcing as the main video's SCRIPT.md flags)

- "Since May 1918": the Maggio murders, May 23, 1918, the first attack of the series (flag 1).
- The KILLED card: Joseph and Catherine Maggio (May 1918); Harriet Lowe, attacked in June, died in August 1918 after
  surgery ("a woman who died weeks later", flag 5); Joseph Romano, struck August 10, died two days later (flag 6);
  Mary Cortimiglia, Gretna, March 10, 1919, killed in her mother's arms. Her age differs between sources, so the
  Short says "a little girl" like the main video (flag 11). The letter is dated March 13: "three days before".
- "Usually with an axe": an axe in most attacks; Besumer and Lowe were attacked with a hatchet.
