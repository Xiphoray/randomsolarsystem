// Solar system parameter generation (Phase 2)
import { KM, clamp } from '../constants.js';
import { randFloat, randInt } from '../random.js';
import { pickSystemName, pickSystemCode, pickPlanetName, pickGeo, pickAtmo, pickFauna, pickFlora } from '../names.js';
import { orbitalSpeed, orbitalPeriod, computeTimeScale } from '../physics.js';

function classifyStar(massKg) {
  // D: 1e28~1e29, C: 1e29~2e29, B: 2e29~3e29, A: 3e29~4e29, S: 4e29~5e29
  if (massKg < 1e29) return 'D';
  if (massKg < 2e29) return 'C';
  if (massKg < 3e29) return 'B';
  if (massKg < 4e29) return 'A';
  return 'S';
}

function pickOrbits(rng, starRadiusM, planetCount) {
  const minR = starRadiusM * 3; // > 3R
  const maxR = starRadiusM * 30; // < 30R (updated from 100R)
  const eps = 1e-6;
  const a0 = minR * (1 + eps);

  // Each orbit has independent random spacing factor: 1.1x ~ 2.0x previous orbit
  const orbits = new Array(planetCount);
  orbits[0] = a0;
  
  for (let i = 1; i < planetCount; i++) {
    // Random growth factor for this specific orbit spacing (min 1.1x for overlap prevention)
    const k = randFloat(rng, 1.1, 2.0);
    let candidate = orbits[i - 1] * k;
    
    // Ensure not exceeding maxR
    if (candidate > maxR * 0.95) {
      candidate = maxR * 0.95;
    }
    
    orbits[i] = candidate;
    
    // Stop if we've hit the boundary
    if (candidate >= maxR * 0.95) {
      // Return only the orbits we successfully placed
      return orbits.slice(0, i + 1);
    }
  }
  
  return orbits;
}

function computeHillRadius(aM, planetMassKg, starMassKg) {
  // r_Hill ≈ a × 0.01 × ∛(m_planet / m_sun)
  return aM * 0.01 * Math.cbrt(planetMassKg / starMassKg);
}

function pickPlanetPhysicals(rng, starMassKg) {
  // radius in 1,000..20,000 km, density 3,000..8,000 kg/m^3; mass bounded to [1e-6, 1e-3] of star mass
  const fMin = 1e-6, fMax = 1e-3;
  for (let tries = 0; tries < 50; tries++) {
    const radiusKm = randInt(rng, 1000, 20000);
    const rM = radiusKm * KM;
    const volume = (4 / 3) * Math.PI * rM * rM * rM;
    const rhoLow = Math.max(3000, (starMassKg * fMin) / volume);
    const rhoHigh = Math.min(8000, (starMassKg * fMax) / volume);
    if (rhoLow <= rhoHigh) {
      const density = randFloat(rng, rhoLow, rhoHigh);
      const mass = density * volume;
      return { radiusKm, radiusM: rM, densityKgPerM3: density, massKg: mass };
    }
  }
  // Fallback: choose middle values
  const radiusKm = 8000;
  const rM = radiusKm * KM;
  const volume = (4 / 3) * Math.PI * rM * rM * rM;
  const density = clamp((starMassKg * 1e-5) / volume, 3000, 8000);
  const mass = density * volume;
  return { radiusKm, radiusM: rM, densityKgPerM3: density, massKg: mass };
}

export function generateSolarSystem(rng) {
  // Star
  const starRadiusKm = randInt(rng, 30000, 70000);
  const starRadiusM = starRadiusKm * KM;
  const starMassKg = randFloat(rng, 1e28, 5e29);
  const starClass = classifyStar(starMassKg);

  const systemName = pickSystemName(rng);
  const systemCode = pickSystemCode(rng);

  // Planet count 3~7
  const planetCount = randInt(rng, 3, 7);
  const orbits = pickOrbits(rng, starRadiusM, planetCount);

  // Build planets
  const usedNames = new Set();
  const planets = [];
  for (let i = 0; i < orbits.length; i++) {
    const aM = orbits[i];
    const phys = pickPlanetPhysicals(rng, starMassKg);
    const v = orbitalSpeed(starMassKg, aM); // m/s
    const T = orbitalPeriod(aM, v); // s
    const hillM = computeHillRadius(aM, phys.massKg, starMassKg);
    // Generate random planet color
    const hue = randInt(rng, 0, 360);
    const sat = randInt(rng, 40, 90);
    const light = randInt(rng, 40, 70);
    const color = `hsl(${hue}, ${sat}%, ${light}%)`;
    
    planets.push({
      name: pickPlanetName(rng, usedNames),
      geo: pickGeo(rng),
      atmo: pickAtmo(rng),
      fauna: pickFauna(rng),
      flora: pickFlora(rng),
      color: color,
      massKg: phys.massKg,
      densityKgPerM3: phys.densityKgPerM3,
      radiusKm: phys.radiusKm,
      radiusM: phys.radiusM,
      orbitRadiusM: aM,
      orbitRadiusKm: aM / KM,
      orbitSpeedMps: v,
      orbitSpeedKmps: v / 1000,
      orbitPeriodSec: T,
      phaseRad: randFloat(rng, 0, Math.PI * 2),
      hillRadiusM: hillM,
      hillRadiusKm: hillM / KM,
    });
  }

  // Ensure Hill spheres do not overlap with neighbors (should be naturally true with spacing >=1.4)
  for (let i = 1; i < planets.length; i++) {
    const prev = planets[i - 1];
    const cur = planets[i];
    const radialGap = cur.orbitRadiusM - prev.orbitRadiusM;
    if (radialGap <= prev.hillRadiusM + cur.hillRadiusM) {
      // If violated, push current orbit outward minimally
      const needed = prev.hillRadiusM + cur.hillRadiusM + 1;
      const newA = prev.orbitRadiusM + needed;
      cur.orbitRadiusM = newA;
      cur.orbitRadiusKm = newA / KM;
      // Recompute speed/period
      const v = orbitalSpeed(starMassKg, newA);
      cur.orbitSpeedMps = v;
      cur.orbitSpeedKmps = v / 1000;
      cur.orbitPeriodSec = orbitalPeriod(newA, v);
      cur.hillRadiusM = computeHillRadius(newA, cur.massKg, starMassKg);
      cur.hillRadiusKm = cur.hillRadiusM / KM;
    }
  }

  // Time scaling by outermost period
  const outer = planets[planets.length - 1];
  const time = computeTimeScale(outer.orbitPeriodSec, 120, 300);

  const systemRadiusM = starRadiusM * 30;

  return {
    name: systemName,
    code: systemCode,
    star: {
      class: starClass,
      massKg: starMassKg,
      radiusKm: starRadiusKm,
      radiusM: starRadiusM,
    },
    systemRadiusM,
    planets,
    time,
  };
}
