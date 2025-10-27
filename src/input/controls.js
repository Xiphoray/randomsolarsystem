// Camera controls: mouse wheel zoom + left-drag pan with smooth interpolation
export function setupCameraControls(canvas, camera, options = {}) {
  const LERP_FACTOR = options.lerpFactor || 0.1; // Smooth transition speed
  const ZOOM_SPEED = options.zoomSpeed || 0.001;

  const target = {
    scale: camera.scale,
    cx: camera.center.x,
    cy: camera.center.y,
  };

  let dragging = false;
  let lastX = 0, lastY = 0;

  // Mouse wheel: zoom in/out
  function onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY;
    // Zoom factor: exponential for smooth feel
    const factor = Math.exp(-delta * ZOOM_SPEED);
    target.scale *= factor;
  }

  // Mouse down: start drag
  function onMouseDown(e) {
    if (e.button === 0) { // Left click
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.style.cursor = 'grabbing';
    }
  }

  // Mouse move: pan camera
  function onMouseMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    // Convert screen delta to world delta
    const worldDx = -dx / camera.scale;
    const worldDy = dy / camera.scale; // y inverted
    target.cx += worldDx;
    target.cy += worldDy;
  }

  // Mouse up: stop drag
  function onMouseUp(e) {
    if (e.button === 0) {
      dragging = false;
      canvas.style.cursor = 'grab';
    }
  }

  // Apply smooth interpolation each frame
  function update() {
    camera.scale += (target.scale - camera.scale) * LERP_FACTOR;
    const curr = camera.center;
    camera.centerXY = {
      x: curr.x + (target.cx - curr.x) * LERP_FACTOR,
      y: curr.y + (target.cy - curr.y) * LERP_FACTOR,
    };
  }

  // Reset to initial view (fit all)
  function resetView(systemRadiusM) {
    target.cx = 0;
    target.cy = 0;
    camera.fit(systemRadiusM);
    target.scale = camera.scale;
  }

  canvas.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseleave', onMouseUp); // Stop drag if mouse leaves
  canvas.style.cursor = 'grab';

  return { update, resetView, destroy() {
    canvas.removeEventListener('wheel', onWheel);
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('mouseleave', onMouseUp);
  }};
}
