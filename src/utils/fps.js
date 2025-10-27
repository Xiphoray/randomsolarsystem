// FPS counter for performance monitoring (optional debug tool)
export function createFPSCounter() {
  let lastTime = performance.now();
  let frames = 0;
  let fps = 0;

  function update() {
    frames++;
    const now = performance.now();
    const delta = now - lastTime;
    
    if (delta >= 1000) { // Update every second
      fps = Math.round((frames * 1000) / delta);
      frames = 0;
      lastTime = now;
    }
    
    return fps;
  }

  function draw(ctx, x = 10, y = 10) {
    const currentFPS = update();
    ctx.save();
    ctx.font = '12px monospace';
    ctx.fillStyle = currentFPS < 25 ? '#ff0000' : '#00ff00';
    ctx.fillText(`FPS: ${currentFPS}`, x, y);
    ctx.restore();
  }

  return { update, draw };
}
