// Canvas initialization and resize handling (DPR aware)

function isMobileLike() {
  try {
    if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
      if (navigator.userAgentData.mobile) return true;
    }
  } catch {}
  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
  const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
  return coarse || /Mobi|Android|iPhone|iPad|iPod|Phone|Tablet|Mobile/i.test(ua);
}

function getTargetCssSize() {
  // Requirements: PC -> window.innerWidth/innerHeight; Mobile -> screen.width/height
  const mobile = isMobileLike();
  if (mobile && typeof screen !== 'undefined') {
    return { width: Math.max(1, screen.width), height: Math.max(1, screen.height) };
  }
  return { width: Math.max(1, window.innerWidth), height: Math.max(1, window.innerHeight) };
}

export function setupCanvases({ bgId = 'bgCanvas', mainId = 'mainCanvas', onResize = null } = {}) {
  const bg = document.getElementById(bgId);
  const main = document.getElementById(mainId);
  if (!bg || !main) throw new Error('Canvas elements not found');

  const state = {
    dpr: Math.max(1, Math.floor(window.devicePixelRatio || 1)),
    cssWidth: 0,
    cssHeight: 0,
    bg,
    main,
    bgCtx: null,
    mainCtx: null,
  };

  function applySize() {
    const { width, height } = getTargetCssSize();
    state.cssWidth = width;
    state.cssHeight = height;
    state.dpr = Math.max(1, window.devicePixelRatio || 1);

    // Set canvas internal pixel sizes
    [bg, main].forEach((c) => {
      c.style.width = width + 'px';
      c.style.height = height + 'px';
      c.width = Math.floor(width * state.dpr);
      c.height = Math.floor(height * state.dpr);
    });

    // Scale contexts to CSS pixel coordinates
    state.bgCtx = bg.getContext('2d');
    state.mainCtx = main.getContext('2d');
    [state.bgCtx, state.mainCtx].forEach((ctx) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(state.dpr, state.dpr);
      ctx.imageSmoothingEnabled = true;
    });

    if (typeof onResize === 'function') {
      onResize({ width, height, dpr: state.dpr, bgCtx: state.bgCtx, mainCtx: state.mainCtx });
    }
  }

  applySize();

  // Re-apply on resize/orientation change
  let resizeTimer = null;
  const handle = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applySize, 100);
  };
  window.addEventListener('resize', handle, { passive: true });
  window.addEventListener('orientationchange', handle, { passive: true });

  return {
    get bgCtx() { return state.bgCtx; },
    get mainCtx() { return state.mainCtx; },
    get dpr() { return state.dpr; },
    get size() { return { width: state.cssWidth, height: state.cssHeight }; },
    resizeNow: applySize,
    destroy() {
      window.removeEventListener('resize', handle);
      window.removeEventListener('orientationchange', handle);
    }
  };
}
