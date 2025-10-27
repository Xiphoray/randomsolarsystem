// Random utilities wrapping seedrandom.js with a safe fallback

function hashStringTo32Bits(str) {
  // Simple 32-bit hash (FNV-1a)
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function lcg(seedStr) {
  // Minimal LCG fallback: not cryptographically secure; deterministic for our visuals
  let state = (hashStringTo32Bits(seedStr) || 1) >>> 0;
  const m = 0x100000000; // 2^32
  const a = 1664525;
  const c = 1013904223;
  return function next() {
    state = (Math.imul(a, state) + c) >>> 0;
    return (state >>> 0) / m; // [0,1)
  };
}

export function createRNG(seedStr) {
  // Prefer seedrandom.js if available
  const sr = (typeof window !== 'undefined' && (window.seedrandom || window.Math?.seedrandom))
    ? (window.seedrandom || window.Math.seedrandom)
    : null;
  if (sr) {
    try {
      const rng = sr(seedStr);
      if (typeof rng === 'function') return rng; // seedrandom@3 style
      if (typeof rng === 'object' && typeof rng.double === 'function') return () => rng.double();
    } catch (e) {
      console.warn('seedrandom init failed, falling back to LCG:', e);
    }
  } else {
    console.warn('seedrandom.js not found, using fallback LCG.');
  }
  return lcg(seedStr);
}

export function randFloat(rng, min = 0, max = 1) {
  return min + (max - min) * rng();
}

export function randInt(rng, min, maxInclusive) {
  const x = rng();
  return Math.floor(min + (maxInclusive - min + 1) * x);
}

export function choice(rng, arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(rng() * arr.length)];
}

export function chance(rng, p = 0.5) {
  return rng() < p;
}
