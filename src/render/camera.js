// Camera: world (meters) <-> screen (pixels)
import { clamp } from '../constants.js';

export function createCamera(viewWidth, viewHeight, worldRadiusM) {
  const state = {
    cx: 0, // world center x (meters)
    cy: 0, // world center y (meters)
    scale: 1, // pixels per meter
    viewWidth,
    viewHeight,
  };

  function fit(radiusM) {
    const minEdge = Math.max(1, Math.min(state.viewWidth, state.viewHeight));
    // Fit diameter into 90% of min dimension
    state.scale = (minEdge * 0.9) / (2 * Math.max(1, radiusM));
  }

  function setViewport(w, h) {
    state.viewWidth = Math.max(1, w);
    state.viewHeight = Math.max(1, h);
  }

  // Initialize: center at star (0,0), fit entire system
  fit(worldRadiusM);

  return {
    get center() { return { x: state.cx, y: state.cy }; },
    set centerXY(v) { state.cx = v.x; state.cy = v.y; },
    get scale() { return state.scale; },
    set scale(val) { state.scale = clamp(val, 1e-12, 1e12); },
    setViewport,
    fit,
    worldToScreen(wx, wy) {
      // World origin at star center; canvas y+ is down, so invert y
      const x = (wx - state.cx) * state.scale + state.viewWidth / 2;
      const y = (state.cy - wy) * state.scale + state.viewHeight / 2;
      return { x, y };
    },
    radiusToPixels(rMeters) {
      return rMeters * state.scale;
    }
  };
}
