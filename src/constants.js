// Physical constants and small helpers
export const G = 6.674e-11; // m^3/(kg*s^2)
export const KM = 1000; // 1 km in meters
export const TAU = Math.PI * 2; // 2π

export function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
