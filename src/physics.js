// Orbital physics utilities
import { G, TAU, clamp } from './constants.js';

export function orbitalSpeed(massCentralKg, radiusM) {
  // v = sqrt(G * M / r)
  return Math.sqrt(G * massCentralKg / radiusM);
}

export function orbitalPeriod(radiusM, speedMps) {
  // T = 2πr / v
  return (TAU * radiusM) / speedMps;
}

export function computeTimeScale(outerPeriodSec, targetMinSec = 120, targetMaxSec = 300) {
  const target = clamp(targetMinSec + (targetMaxSec - targetMinSec) * 0.5, targetMinSec, targetMaxSec);
  // Alternatively: choose specific target in range; but we select mid for stability in Phase 2
  let scale = outerPeriodSec / target;
  scale = clamp(scale, 500, 2000);
  return { timeScale: scale, targetPeriodSec: target };
}
