// HUD text display with typewriter animation
export function createHUD(containerEl, system) {
  const lines = [];
  let animIndex = 0;
  let charIndex = 0;
  let animDone = false;

  // Build initial lines: STAR info
  function formatNum(x) {
    if (typeof x !== 'number') return String(x);
    return Math.floor(x).toLocaleString('en-US', { useGrouping: false });
  }

  lines.push(`STAR:${system.name} ${system.code}`);
  lines.push(`CLASS:${system.star.class}`);
  lines.push(`RADIUS:${formatNum(system.star.radiusKm)}`);
  lines.push(`MASS:${formatNum(system.star.massKg)}`);
  // BODIES: initially 0/total (no planets visited yet in Phase 3)
  lines.push(`BODIES:0/${system.planets.length}`);

  // Planet lines will be added dynamically (Phase 3 displays all immediately after init)
  for (const p of system.planets) {
    lines.push(''); // blank separator
    lines.push(`BODY:${p.name}`);
    lines.push(`TYPE:${p.geo}`);
    lines.push(`ATMO:${p.atmo}`);
    lines.push(`FAUNA:${p.fauna}`);
    lines.push(`FLORA:${p.flora}`);
  }

  function tick() {
    if (animDone) return;
    if (animIndex >= lines.length) {
      animDone = true;
      return;
    }
    const line = lines[animIndex];
    if (charIndex < line.length) {
      charIndex += 1;
    } else {
      animIndex += 1;
      charIndex = 0;
    }
    render();
  }

  function render() {
    const displayed = [];
    for (let i = 0; i < animIndex; i++) {
      displayed.push(lines[i]);
    }
    if (animIndex < lines.length) {
      const partial = lines[animIndex].slice(0, charIndex);
      displayed.push(partial);
    }
    containerEl.textContent = displayed.join('\n');
    // Auto-scroll to bottom
    containerEl.scrollTop = containerEl.scrollHeight;
  }

  return {
    tick,
    get done() { return animDone; }
  };
}
