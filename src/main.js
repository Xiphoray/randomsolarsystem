import { getTodaySeed } from './utils/dateSeed.js';
import { createRNG } from './random.js';
import { setupCanvases } from './canvas.js';
import { generateStarfield, drawStarfield } from './starfield.js';
import { generateSolarSystem } from './gen/system.js';
import { createCamera } from './render/camera.js';
import { drawSun, drawOrbit, drawHillSphere, drawPlanet } from './render/draw.js';
import { createHUD } from './ui/hud.js';
import { setupCameraControls } from './input/controls.js';

function getSeedFromURL() {
  const url = new URL(window.location.href);
  const s = url.searchParams.get('seed');
  if (s && /^\d{8}$/.test(s)) return s;
  return null;
}

function main() {
  // 1) Seed selection: URL override -> today (yyyyMMdd)
  const seed = getSeedFromURL() || getTodaySeed();
  const rng = createRNG(seed);

  // 2) Generate solar system parameters (Phase 2)
  const system = generateSolarSystem(rng);

  // 3) Canvases setup with DPR scaling
  let stars = [];
  let camera = null;
  // Use outer planet orbit + margin for initial fit, not theoretical system boundary
  const outerPlanet = system.planets[system.planets.length - 1];
  const fitRadius = outerPlanet.orbitRadiusM + outerPlanet.hillRadiusM * 2;
  
  const canvases = setupCanvases({
    onResize: ({ width, height, bgCtx }) => {
      // Regenerate starfield on resize to fill the new size
      stars = generateStarfield(rng, width, height);
      drawStarfield(bgCtx, stars);
      // Reinit camera on resize
      if (camera) camera.setViewport(width, height);
      else camera = createCamera(width, height, fitRadius);
    }
  });

  // 4) HUD animation with typewriter effect
  const hudEl = document.getElementById('hud');
  const hud = hudEl ? createHUD(hudEl, system) : null;

  // 4b) Camera controls (mouse wheel zoom, left-drag pan)
  const mainCanvas = document.getElementById('mainCanvas');
  const controls = setupCameraControls(mainCanvas, camera, { lerpFactor: 0.1 });

  // 4c) Reset view button
  const resetBtn = document.getElementById('resetViewBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      controls.resetView(fitRadius);
    });
  }

  // 5) Animation state for sun wavy rings (degrees per frame per requirement)
  let rotInner = 0; // inner ring: 5°/frame
  let rotOuter = 0; // outer ring: -2.7°/frame
  const toRad = Math.PI / 180;

  // 6) Time simulation (Phase 4: planet motion with time scaling)
  const dt = 1 / 30; // Fixed timestep: 30 FPS
  const timeScale = system.time.timeScale; // Speed multiplier
  let gameTime = 0; // Simulated time in seconds

  // 7) Animation loop (Phase 4: orbital motion)
  const ctx = canvases.mainCtx;
  let frameCount = 0;
  function frame() {
    frameCount++;
    // Advance HUD typewriter every 2 frames (~15 chars/sec at 30 FPS)
    if (hud && frameCount % 2 === 0) hud.tick();

    // Rotate sun wavy rings
    rotInner += 5 * toRad;
    rotOuter -= 2.7 * toRad;

    // Update game time with scaling
    gameTime += dt * timeScale;

    // Update camera smooth interpolation
    controls.update();

    // Clear main canvas
    ctx.clearRect(0, 0, canvases.size.width, canvases.size.height);

    // Draw layers (bottom to top): orbits -> hill spheres -> sun -> planets
    // Orbits
    for (const p of system.planets) {
      drawOrbit(ctx, camera, p.orbitRadiusM);
    }
    // Hill spheres (at current moving planet positions)
    for (const p of system.planets) {
      // Angular position = initial phase + (speed / radius) * gameTime
      const angle = p.phaseRad + (p.orbitSpeedMps / p.orbitRadiusM) * gameTime;
      const wx = p.orbitRadiusM * Math.cos(angle);
      const wy = p.orbitRadiusM * Math.sin(angle);
      drawHillSphere(ctx, camera, wx, wy, p.hillRadiusM);
    }
    // Sun
    drawSun(ctx, camera, system.star, rotInner, rotOuter);
    // Planets
    for (const p of system.planets) {
      const angle = p.phaseRad + (p.orbitSpeedMps / p.orbitRadiusM) * gameTime;
      const wx = p.orbitRadiusM * Math.cos(angle);
      const wy = p.orbitRadiusM * Math.sin(angle);
      drawPlanet(ctx, camera, wx, wy, p.radiusM, p.color);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Expose for debug
  window.__SOLAR__ = { seed, rng, canvases, system, camera, hud };
}

// Call main immediately if DOM already loaded, else wait
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', main, { once: true });
} else {
  main();
}
