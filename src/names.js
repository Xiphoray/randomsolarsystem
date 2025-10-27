// Lexicons and name/code generators
import { randInt, randFloat, choice } from './random.js';

const STAR_NAME_PREFIX = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'];
const STAR_NAME_SUFFIX = ['Centauri', 'Eridani', 'Draconis', 'Phoenicis'];

// Planet names (from requirement, plus a few mythological extras in list)
const PLANET_NAMES_BASE = [
  'Mercury','Venus','Terra','Mars','Jupiter','Saturn','Uranus','Neptune','Ceres','Pluto','Eris',
  'Titan','Europa','Callisto','Ganymede','Io','Enceladus','Triton','Charon','Makemake',
  'Zeus','Hera','Poseidon','Athena','Apollo','Artemis','Ares','Hephaestus','Hermes','Dionysus','Hades','Demeter','Hestia','Aphrodite','Persephone','Prometheus','Atlas','Helios'
];

const GEO_TYPES = ['岩石','铁核','硅酸盐','冰冻','金属','碳基','硫化物','玄武岩','花岗岩'];
const ATMOS = ['无','稀薄','氮氧','二氧化碳','甲烷','氨气','氢气','氦气','硫化氢'];
const FAUNA = ['无','微生物','节肢类','爬行类','哺乳类','智慧生物','机械生命','能量体'];
const FLORA = ['无','单细胞藻类','苔藓','蕨类','裸子植物','被子植物','真菌','晶体生命'];

function romanize(num) {
  if (num <= 0) return '';
  const map = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
  ];
  let n = Math.floor(num);
  let out = '';
  for (const [v, s] of map) {
    while (n >= v) { out += s; n -= v; }
  }
  return out;
}

export function pickSystemName(rng) {
  const p = choice(rng, STAR_NAME_PREFIX);
  const s = choice(rng, STAR_NAME_SUFFIX);
  return `${p} ${s}`;
}

export function pickSystemCode(rng) {
  const A = 65;
  const c1 = String.fromCharCode(A + randInt(rng, 0, 25));
  const c2 = String.fromCharCode(A + randInt(rng, 0, 25));
  const num = String(randInt(rng, 0, 9999)).padStart(4, '0');
  return `${c1}${c2}-${num}`;
}

export function pickPlanetName(rng, used) {
  // prefer unique names; sometimes append roman numeral to expand
  for (let tries = 0; tries < 100; tries++) {
    const base = choice(rng, PLANET_NAMES_BASE);
    const withRoman = randFloat(rng, 0, 1) < 0.25 ? `${base} ${romanize(randInt(rng, 1, 12))}` : base;
    if (!used.has(withRoman)) {
      used.add(withRoman);
      return withRoman;
    }
  }
  // fallback: add numeric suffix
  let i = 1;
  while (true) {
    const name = `${choice(rng, PLANET_NAMES_BASE)}-${i++}`;
    if (!used.has(name)) { used.add(name); return name; }
  }
}

function pickMaybeCombo(rng, arr) {
  if (randFloat(rng, 0, 1) < 0.18) {
    const a = choice(rng, arr);
    let b = choice(rng, arr);
    if (b === a) b = choice(rng, arr);
    return `${a}+${b}`;
  }
  return choice(rng, arr);
}

export function pickGeo(rng) { return pickMaybeCombo(rng, GEO_TYPES); }
export function pickAtmo(rng) { return pickMaybeCombo(rng, ATMOS); }
export function pickFauna(rng) { return pickMaybeCombo(rng, FAUNA); }
export function pickFlora(rng) { return pickMaybeCombo(rng, FLORA); }
