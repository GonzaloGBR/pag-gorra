import type { buildCapPlacements } from '../data/products';

export type CapPlacement = ReturnType<typeof buildCapPlacements>[number];

export interface WorldBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const EDGE_PADDING = 56;
const CLICK_THRESHOLD = 10;
/** Arrastre: menor = movimiento más pesado / lento */
const DRAG_SCALE = 0.38;
/** Rueda: suele mandar deltas grandes → aún más bajo que el arrastre */
const WHEEL_SCALE = 0.3;
/** Flechas del teclado */
const KEY_SCALE = 0.38;
/** Inercia al soltar (más bajo = frena antes, sensación más pesada) */
const FRICTION = 0.86;
const VELOCITY_STOP = 0.28;

export function computeWorldBounds(placements: CapPlacement[]): WorldBounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of placements) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x + p.w);
    maxY = Math.max(maxY, p.y + p.h);
  }

  return {
    minX: minX - EDGE_PADDING,
    minY: minY - EDGE_PADDING,
    maxX: maxX + EDGE_PADDING,
    maxY: maxY + EDGE_PADDING,
  };
}

export function clampCamera(
  camX: number,
  camY: number,
  viewportW: number,
  viewportH: number,
  bounds: WorldBounds,
): { x: number; y: number } {
  const worldW = bounds.maxX - bounds.minX;
  const worldH = bounds.maxY - bounds.minY;

  let x = camX;
  let y = camY;

  if (worldW <= viewportW) {
    x = bounds.minX + (worldW - viewportW) / 2;
  } else {
    x = Math.min(Math.max(x, bounds.minX), bounds.maxX - viewportW);
  }

  if (worldH <= viewportH) {
    y = bounds.minY + (worldH - viewportH) / 2;
  } else {
    y = Math.min(Math.max(y, bounds.minY), bounds.maxY - viewportH);
  }

  return { x, y };
}

export function initInfiniteCanvas(
  root: HTMLElement,
  placements: CapPlacement[],
): () => void {
  const viewport = root.querySelector<HTMLElement>('[data-viewport]');
  const world = root.querySelector<HTMLElement>('[data-world]');
  if (!viewport || !world) return () => {};

  const bounds = computeWorldBounds(placements);
  let camX = 0;
  let camY = 0;
  let dragging = false;
  let pointerId: number | null = null;
  let lastX = 0;
  let lastY = 0;
  let dragStartX = 0;
  let dragStartY = 0;
  let velX = 0;
  let velY = 0;
  let raf = 0;
  let animating = false;
  /** Evita recentrar la cámara por focus tras arrastrar o usar rueda. */
  let blockFocusPanUntil = 0;
  let wheelAccumX = 0;
  let wheelAccumY = 0;
  let wheelRaf = 0;

  const applyTransform = () => {
    world.style.transform = `translate3d(${-camX}px, ${-camY}px, 0)`;
  };

  const clampAndApply = () => {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const beforeX = camX;
    const beforeY = camY;
    const clamped = clampCamera(camX, camY, vw, vh, bounds);
    if (clamped.x !== beforeX) velX = 0;
    if (clamped.y !== beforeY) velY = 0;
    camX = clamped.x;
    camY = clamped.y;
    applyTransform();
  };

  const frame = () => {
    if (!dragging) {
      if (Math.abs(velX) < VELOCITY_STOP && Math.abs(velY) < VELOCITY_STOP) {
        velX = 0;
        velY = 0;
        animating = false;
        return;
      }
      camX += velX;
      camY += velY;
      velX *= FRICTION;
      velY *= FRICTION;
    }
    clampAndApply();
    if (animating) raf = requestAnimationFrame(frame);
  };

  const startAnimation = () => {
    if (animating) return;
    animating = true;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  };

  const stopAnimation = () => {
    animating = false;
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const centerCamera = () => {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const worldW = bounds.maxX - bounds.minX;
    const worldH = bounds.maxY - bounds.minY;
    camX = bounds.minX + Math.max(0, (worldW - vw) / 2);
    camY = bounds.minY + Math.max(0, (worldH - vh) / 2);
    clampAndApply();
  };

  centerCamera();

  const resize = () => clampAndApply();

  const navigateToCapAt = (clientX: number, clientY: number) => {
    const el = document.elementFromPoint(clientX, clientY);
    const cap = el?.closest<HTMLElement>('[data-cap-item]');
    const slug = cap?.getAttribute('data-slug');
    if (slug) {
      window.location.href = `/producto/${slug}`;
    }
  };

  const blurFocusedCap = () => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.closest('[data-cap-item]')) {
      active.blur();
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    stopAnimation();
    cancelAnimationFrame(wheelRaf);
    wheelAccumX = 0;
    wheelAccumY = 0;
    blockFocusPanUntil = performance.now() + 600;
    blurFocusedCap();
    dragging = true;
    pointerId = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    velX = 0;
    velY = 0;
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add('is-dragging');
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = (e.clientX - lastX) * DRAG_SCALE;
    const dy = (e.clientY - lastY) * DRAG_SCALE;
    lastX = e.clientX;
    lastY = e.clientY;
    camX -= dx;
    camY -= dy;
    velX = -dx;
    velY = -dy;
    clampAndApply();
  };

  const endDrag = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return;
    const moved = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);

    dragging = false;
    pointerId = null;
    viewport.releasePointerCapture(e.pointerId);
    viewport.classList.remove('is-dragging');

    blockFocusPanUntil = performance.now() + 600;

    if (moved < CLICK_THRESHOLD) {
      navigateToCapAt(e.clientX, e.clientY);
      velX = 0;
      velY = 0;
    } else {
      startAnimation();
    }
  };

  const onCapKeyDown = (e: KeyboardEvent) => {
    const cap = (e.target as HTMLElement).closest<HTMLElement>('[data-cap-item]');
    if (!cap) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const slug = cap.getAttribute('data-slug');
      if (slug) window.location.href = `/producto/${slug}`;
    }
  };

  const wheelDelta = (value: number, mode: number) => {
    if (mode === WheelEvent.DOM_DELTA_LINE) return value * 16;
    if (mode === WheelEvent.DOM_DELTA_PAGE) return value * viewport.clientHeight * 0.85;
    return value;
  };

  const flushWheel = () => {
    wheelRaf = 0;
    if (wheelAccumX === 0 && wheelAccumY === 0) return;
    stopAnimation();
    velX = 0;
    velY = 0;
    camX += wheelAccumX;
    camY += wheelAccumY;
    wheelAccumX = 0;
    wheelAccumY = 0;
    blockFocusPanUntil = performance.now() + 400;
    clampAndApply();
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    wheelAccumX += wheelDelta(e.deltaX, e.deltaMode) * WHEEL_SCALE;
    wheelAccumY += wheelDelta(e.deltaY, e.deltaMode) * WHEEL_SCALE;
    if (!wheelRaf) {
      wheelRaf = requestAnimationFrame(flushWheel);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const step = (e.shiftKey ? 120 : 48) * KEY_SCALE;
    let handled = false;
    if (e.key === 'ArrowLeft') {
      camX -= step;
      handled = true;
    }
    if (e.key === 'ArrowRight') {
      camX += step;
      handled = true;
    }
    if (e.key === 'ArrowUp') {
      camY -= step;
      handled = true;
    }
    if (e.key === 'ArrowDown') {
      camY += step;
      handled = true;
    }
    if (handled) {
      e.preventDefault();
      velX = 0;
      velY = 0;
      clampAndApply();
    }
  };

  const onFocusIn = (e: FocusEvent) => {
    if (performance.now() < blockFocusPanUntil || dragging) return;

    const cap = (e.target as HTMLElement).closest<HTMLElement>('[data-cap-item]');
    if (!cap) return;

    // Solo Tab/teclado: un clic no debe saltar la cámara.
    if (!cap.matches(':focus-visible')) return;

    stopAnimation();
    velX = 0;
    velY = 0;

    const capX = cap.offsetLeft;
    const capY = cap.offsetTop;
    const capW = cap.offsetWidth;
    const capH = cap.offsetHeight;

    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;

    camX = capX + capW / 2 - vw / 2;
    camY = capY + capH / 2 - vh / 2;
    clampAndApply();
  };

  const onMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    const cap = (e.target as HTMLElement).closest('[data-cap-item]');
    if (cap) e.preventDefault();
  };

  viewport.addEventListener('mousedown', onMouseDown, true);
  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('wheel', onWheel, { passive: false });
  viewport.addEventListener('keydown', onCapKeyDown);
  viewport.addEventListener('focusin', onFocusIn);
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', onKeyDown);

  return () => {
    stopAnimation();
    cancelAnimationFrame(wheelRaf);
    delete root.dataset.canvasInit;
    viewport.removeEventListener('mousedown', onMouseDown, true);
    viewport.removeEventListener('pointerdown', onPointerDown);
    viewport.removeEventListener('pointermove', onPointerMove);
    viewport.removeEventListener('pointerup', endDrag);
    viewport.removeEventListener('pointercancel', endDrag);
    viewport.removeEventListener('wheel', onWheel);
    viewport.removeEventListener('keydown', onCapKeyDown);
    viewport.removeEventListener('focusin', onFocusIn);
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', onKeyDown);
  };
}
