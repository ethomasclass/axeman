// This video's subject masks: photographs cut out by tools/mask.py (rembg), clippings and drawings traced by hand
// in tools/polymask.py. Each gives the coral tint (alpha PNG) and the teal trace (outline JSON).
import {maskRef} from './kit/maskref';
import sully from '../public/img/masks/sully.json';
import sheetPiano from '../public/img/masks/sheet_piano.json';
import besumer from '../public/img/masks/besumer.json';
import cartoonGuard from '../public/img/masks/cartoon_guard.json';
import maggios from '../public/img/masks/maggios.json';
import marketCart from '../public/img/masks/market_cart.json';
import fluPatient from '../public/img/masks/flu_patient.json';
import ferry from '../public/img/masks/ferry.json';
import eagleCornet from '../public/img/masks/eagle_cornet.json';

export const MASKS = {
  sully: maskRef('sully', sully),
  sheetPiano: maskRef('sheet_piano', sheetPiano),
  besumer: maskRef('besumer', besumer),
  cartoonGuard: maskRef('cartoon_guard', cartoonGuard),
  maggios: maskRef('maggios', maggios),
  marketCart: maskRef('market_cart', marketCart),
  fluPatient: maskRef('flu_patient', fluPatient),
  ferry: maskRef('ferry', ferry),
  eagleCornet: maskRef('eagle_cornet', eagleCornet),
};
