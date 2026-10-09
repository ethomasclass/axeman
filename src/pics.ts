// Every archival picture the chapters use, by role: the file in public/ and its on-screen source tag.
// Swap a file here and every scene that uses it follows. Sizes come from src/imgs.ts (tools/img_sizes.py);
// credits and source pages are in public/img/credits.json and script/IMAGES.md.
export type Pic = {src: string; tag: string};

const TP = 'Times-Picayune';

export const P = {
  // the sheet music: the 1919 cover (a Times-Picayune cartoon of March 19, 1919). The display copy covers one line of
  // small print, the title of Davilla's earlier song, which contains a racial slur.
  sheet: {src: 'img/ch01/mysterious_axman_jazz_cover_1919_display.jpg', tag: "The Mysterious Axman's Jazz (Don't Scare Me Papa), sheet music, World's Music Publishing Co., 1919 · Wikimedia Commons"},
  // bands, dance halls, the party night
  cave: {src: 'img/ch07/the_cave_grunewald_hotel_cabaret_1910s.jpg', tag: 'The Cave, cabaret at the Grunewald Hotel, New Orleans, postcard, 1910s · Wikimedia Commons'},
  odjb: {src: 'img/ch01/odjb_publicity_card_1917-18.jpg', tag: 'Original Dixieland Jazz Band, publicity card, 1917–18 · Wikimedia Commons'},
  eagle: {src: 'img/ch01/eagle_band_nola_1916.jpg', tag: 'The Eagle Band, New Orleans, 1916 · Wikimedia Commons'},
  marable: {src: 'img/ch07/fate_marable_band_ss_sidney_1918.jpg', tag: "Fate Marable's New Orleans band on the S.S. Sidney, 1918 · Wikimedia Commons"},
  anderson: {src: 'img/ch07/anderson_band_1919.jpg', tag: 'A New Orleans dance band, 1919 · Wikimedia Commons'},
  bolden: {src: 'img/ch01/buddy_bolden_band_c1905.jpg', tag: "Buddy Bolden's band, New Orleans, c. 1905 · Wikimedia Commons"},
  // ch02 · the Maggios and the old cases
  maggio: {src: 'img/ch02/maggio_clipping_1918.jpg', tag: `The Maggio grocery, Upperline and Magnolia, ${TP}, May 1918 · Wikimedia Commons`},
  panelMap: {src: 'img/ch06/axeman_attack_map_march1919.jpg', tag: `"The 'Panel Burglar' Theory of the Ax Murders Told in Pictures," ${TP}, March 1919 · Wikimedia Commons`},
  grocery: {src: 'img/ch02/grocery_facade_genthe_c1920.jpg', tag: 'Arnold Genthe, Facade of a grocery store, c. 1920 · Library of Congress'},
  davi: {src: 'img/ch02/davi_clipping_1911.jpg', tag: `${TP}, June 1911 · Wikimedia Commons`},
  rissetto: {src: 'img/ch02/rissetto_clipping_1910.jpg', tag: `${TP}, September 1910 · Wikimedia Commons`},
  sciambra: {src: 'img/ch02/sciambra_clipping_1912.jpg', tag: `The Schiambra home, ${TP}, May 1912 · Wikimedia Commons`},
  // ch03 · Besumer, the war
  besumer: {src: 'img/ch03/besumer_clipping_1918.jpg', tag: `Louis Besumer, ${TP}, 1918 · Wikimedia Commons`},
  parade: {src: 'img/ch03/liberty_loan_parade_canal_st_nola_1918.jpg', tag: 'Charles L. Franck, Fourth Liberty Loan parade, Canal Street, New Orleans, 1918 · Wikimedia Commons'},
  spyPoster: {src: 'img/ch03/dont_talk_spies_poster_1918.jpg', tag: '"Don\'t Talk: Spies Are Listening," poster, 1918 · Library of Congress'},
  courtroom: {src: 'img/ch03/courtroom_providence_1910.jpg', tag: 'Court room, Providence, c. 1910 · Library of Congress (Bain News Service)'},
  // ch04 · the panic and the quiet
  axMap1918: {src: 'img/ch04/axeman_map_sept1918.jpg', tag: `Map of the ax attacks, ${TP}, September 3, 1918 · Wikimedia Commons`},
  nightStreet: {src: 'img/ch08/canal_street_illuminated_night_1903.jpg', tag: 'Canal Street at night, New Orleans, 1903 · Wikimedia Commons'},
  cartoon: {src: 'img/ch07/axeman_cartoon_1919.jpg', tag: `"Horrors!", cartoon, ${TP}, 1918–19 · Wikimedia Commons`},
  flu: {src: 'img/ch04/influenza_naval_hospital_nola_1918.jpg', tag: 'Treating an influenza patient, Naval Hospital, New Orleans, 1918 · U.S. Navy Medicine'},
  fluAd: {src: 'img/ch04/grunewald_flu_ad_nola_1918.jpg', tag: "Grunewald's advertisement, New Orleans, October 1918 · Wikimedia Commons"},
  armistice: {src: 'img/ch04/armistice_canal_street_nola_1918.jpg', tag: 'John Gasquet, Armistice Day on Canal Street, New Orleans, November 11, 1918 · Wikimedia Commons'},
  // ch05 · Italian New Orleans
  market: {src: 'img/ch05/french_market_corner_boys_cart_c1900.jpg', tag: 'A corner of the French Market, New Orleans, c. 1900 · Library of Congress (Detroit Publishing Co.)'},
  littleItaly: {src: 'img/ch05/little_italy_vieux_carre_genthe_c1920.jpg', tag: 'Arnold Genthe, Little Italy in the Vieux Carré, New Orleans, c. 1920 · Library of Congress'},
  blackHand: {src: 'img/ch05/black_hand_members_arrested_fairmont_wv_c1909.jpg', tag: '"Members of Black Hand arrested," Fairmont, West Virginia, c. 1909 · Library of Congress (Bain News Service)'},
  lynching1891: {src: 'img/ch05/parish_prison_lynching_1891_engraving.jpg', tag: 'The mob at Parish Prison, New Orleans, March 14, 1891, engraving (published 1912) · Wikimedia Commons'},
  // ch06 · Gretna
  ferry: {src: 'img/ch06/river_transfer_boat_nola_1905.jpg', tag: 'A transfer boat on the Mississippi at New Orleans, c. 1905 · Library of Congress (Detroit Publishing Co.)'},
  freed: {src: 'img/ch06/ax_murder_freed_cortimiglia_birmingham_1919-03-15.jpg', tag: 'Birmingham Age-Herald, March 15, 1919 · Library of Congress, Chronicling America'},
  sentence: {src: 'img/ch06/murderer_of_child_death_sentence_montgomery_1919-10-12.jpg', tag: 'Montgomery Advertiser, October 12, 1919 · Library of Congress, Chronicling America'},
  courtroom2: {src: 'img/ch06/courtroom_wayne_county_building_1902.jpg', tag: 'A courtroom, c. 1902 · Library of Congress (Detroit Publishing Co.)'},
  // ch07 · the letter
  frontPage: {src: 'img/ch07/front_page_morgan_city_daily_review_1919-03-14.jpg', tag: 'Morgan City Daily Review, Louisiana, March 14, 1919 · Library of Congress, Chronicling America'},
  herald: {src: 'img/ch07/that_axmans_letter_herald_nola_1919-03-20.jpg', tag: '"That Ax-Man\'s Letter," The Herald, New Orleans, March 20, 1919 · Library of Congress, Chronicling America'},
  // ch08 · the last attacks
  pepitone: {src: 'img/ch08/pepitone_murdered_birmingham_1919-10-28.jpg', tag: 'Birmingham Age-Herald, October 28, 1919 · Library of Congress, Chronicling America'},
  // ch09 · who
  laTimes: {src: 'img/ch09/manfre_slaying_la_times_1921-12-25.jpg', tag: 'Los Angeles Times, December 25, 1921 · Wikimedia Commons'},
  omaha: {src: 'img/ch09/solution_of_axe_murders_omaha_bee_1921-12-16.jpg', tag: 'Omaha Bee, December 16, 1921 · Library of Congress, Chronicling America'},
  canal: {src: 'img/ch09/canal_street_nola_1910.jpg', tag: 'Canal Street, New Orleans, c. 1910 · Library of Congress (Detroit Publishing Co.)'},
} satisfies Record<string, Pic>;
