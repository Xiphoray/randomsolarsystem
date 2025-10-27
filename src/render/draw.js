// Drawing utilities for solar system objects
import { TAU } from '../constants.js';

// Draw sun: yellow filled circle + two rotating wavy rings
export function drawSun(ctx, cam, star, rotationInner, rotationOuter) {
  const { x, y } = cam.worldToScreen(0, 0); // star at world origin
  const rPx = cam.radiusToPixels(star.radiusM);

  // Main body: yellow filled circle
  ctx.fillStyle = '#FFD700'; // gold
  ctx.beginPath();
  ctx.arc(x, y, rPx, 0, TAU);
  ctx.fill();

  // Inner wavy ring: r = 1.1R, waves=8, rot=rotationInner, amplitude=0.05R
  drawWavyRing(ctx, x, y, rPx * 1.1, 8, rPx * 0.05, rotationInner, '#FFA500');
  // Outer wavy ring: r = 1.2R, waves=6, rot=rotationOuter, amplitude=0.05R
  drawWavyRing(ctx, x, y, rPx * 1.2, 6, rPx * 0.05, rotationOuter, '#FF8C00');
}

function drawWavyRing(ctx, cx, cy, radius, waveCount, amplitude, rotationRad, color) {
  if (radius <= 0) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const steps = Math.max(32, Math.floor(waveCount * 8));
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU;
    const angle = t + rotationRad;
    const wave = Math.sin(waveCount * t) * amplitude;
    const r = radius + wave;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
}

// Draw orbit: dashed circle in cyan/turquoise
export function drawOrbit(ctx, cam, orbitRadiusM) {
  const { x, y } = cam.worldToScreen(0, 0);
  const rPx = cam.radiusToPixels(orbitRadiusM);
  if (rPx < 0.5) return;

  ctx.strokeStyle = 'rgba(64, 224, 208, 0.6)'; // turquoise with 0.6 alpha
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 10]); // 5px dash, 10px gap
  ctx.beginPath();
  ctx.arc(x, y, rPx, 0, TAU);
  ctx.stroke();
  ctx.setLineDash([]); // reset
}

// Draw hill sphere: translucent red circle
export function drawHillSphere(ctx, cam, planetWorldX, planetWorldY, hillRadiusM) {
  const { x, y } = cam.worldToScreen(planetWorldX, planetWorldY);
  const rPx = cam.radiusToPixels(hillRadiusM);
  if (rPx < 0.5) return;

  ctx.fillStyle = 'rgba(255, 100, 100, 0.15)';
  ctx.beginPath();
  ctx.arc(x, y, rPx, 0, TAU);
  ctx.fill();
}

// Draw planet: filled circle with random color
export function drawPlanet(ctx, cam, planetWorldX, planetWorldY, planetRadiusM, planetColor) {
  const { x, y } = cam.worldToScreen(planetWorldX, planetWorldY);
  const rPx = cam.radiusToPixels(planetRadiusM);
  if (rPx < 0.5) return;

  ctx.fillStyle = planetColor || '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, rPx, 0, TAU);
  ctx.fill();
}
