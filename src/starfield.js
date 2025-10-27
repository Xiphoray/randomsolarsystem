// Starfield generation and drawing (static background)
import { randInt, randFloat } from './random.js';

export function generateStarfield(rng, width, height) {
  const count = randInt(rng, 200, 500);
  const stars = new Array(count);
  for (let i = 0; i < count; i++) {
    stars[i] = {
      x: randFloat(rng, 0, width),
      y: randFloat(rng, 0, height),
      size: randInt(rng, 1, 2), // px size 1~2
      alpha: randFloat(rng, 0.6, 0.8),
    };
  }
  return stars;
}

export function drawStarfield(ctx, stars) {
  if (!ctx || !stars) return;
  // Clear to black (in case canvas got resized)
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // ensure identity for clearRect in CSS pixels handled by outer scale
  ctx.restore();

  // Drawing in CSS pixel units due to ctx scaled in setup
  ctx.fillStyle = '#000000';
  const { canvas } = ctx;
  const cssW = parseInt(canvas.style.width || canvas.width, 10) || canvas.width;
  const cssH = parseInt(canvas.style.height || canvas.height, 10) || canvas.height;
  ctx.fillRect(0, 0, cssW, cssH);

  // Draw stars as small squares for performance
  for (const s of stars) {
    ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(3)})`;
    // Center the square around (x,y)
    const half = s.size / 2;
    ctx.fillRect(s.x - half, s.y - half, s.size, s.size);
  }
}
