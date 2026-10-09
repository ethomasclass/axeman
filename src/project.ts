// Everything that changes from one video to the next, in one place.

/** File-name stem for renders: out/<SLUG>_1080p.mp4, renders/<SLUG>_720p.mp4, renders/thumbnails/<SLUG>_A.png. */
export const SLUG = 'Axeman';

/** Title card after the channel intro: a highlighter title, a teal subtitle and a handwritten date range. */
export const TITLE = 'JAZZ IT OUT';
export const SUBTITLE = 'The Axeman of New Orleans';
export const DATES = '1918 – 1919';

/**
 * Archival pictures that flip past at the start of the channel intro (five reads best). Paths in public/.
 * Use strong, recognisable images from this video; they show in black and white.
 */
export const INTRO_CARDS = ['img/ch01/mysterious_axman_jazz_cover_1919_display.jpg', 'img/ch02/maggio_clipping_1918.jpg', 'img/ch07/axeman_cartoon_1919.jpg', 'img/ch06/river_transfer_boat_nola_1905.jpg', 'img/ch01/eagle_band_nola_1916.jpg'];

/** Thumbnail portrait (split concept): source file, its pixel size, and where the head sits in source pixels. */
export const THUMB_PORTRAIT = {
  src: 'img/demo/sully_jackson_1845.jpg',
  size: [1920, 2288] as [number, number],
  /** horizontal centre of the face, the top of the hair, and the mouth (source pixels) */
  faceX: 972,
  hairTop: 206,
  mouthY: 1250,
  /** crown base, left and right edge, in source pixels: the width of the head just below the hair top */
  crownLeft: 660,
  crownRight: 1200,
  crownY: 275,
  /** how big the portrait sits: the whole head plus room above for the crown, the chin above y 840 */
  scale: 0.55,
  top: 80,
};
export const THUMB_WORDS = {left: 'PLAY JAZZ', right: 'OR ELSE'};
