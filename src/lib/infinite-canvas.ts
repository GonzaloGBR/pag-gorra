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
/** < 1 = arrastre y rueda más lentos / suaves */
const MOVE_SCALE = 0.78;
/** Inercia al soltar (más alto = desliza más tiempo) */
const FRICTION = 0.91;
const VELOCITY_STOP = 0.35;

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

  const applyTransform = () => {
    world.style.transform = `translate3d(${-camX}px, ${-camY}px, 0)`;
  };

  const clampAndApply = () => {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const clamped = clampCamera(camX, camY, vw, vh, bounds);
    camX = clamped.x;
    camY = clamped.y;
    applyTransform();
  };

  const tickInertia = () => {
    if (dragging) return;

    if (Math.abs(velX) < VELOCITY_STOP && Math.abs(velY) < VELOCITY_STOP) {
      velX = 0;
      velY = 0;
      return;
    }

    camX += velX;
    camY += velY;
    velX *= FRICTION;
    velY *= FRICTION;
    clampAndApply();
    raf = requestAnimationFrame(tickInertia);
  };

  const startInertia = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tickInertia);
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

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    cancelAnimationFrame(raf);
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
    const dx = (e.clientX - lastX) * MOVE_SCALE;
    const dy = (e.clientY - lastY) * MOVE_SCALE;
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

    if (moved < CLICK_THRESHOLD) {
      navigateToCapAt(e.clientX, e.clientY);
      velX = 0;
      velY = 0;
    } else {
      startInertia();
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

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    velX = 0;
    velY = 0;
    camX += e.deltaX * MOVE_SCALE;
    camY += e.deltaY * MOVE_SCALE;
    clampAndApply();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const step = (e.shiftKey ? 120 : 48) * MOVE_SCALE;
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

  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('wheel', onWheel, { passive: false });
  viewport.addEventListener('keydown', onCapKeyDown);
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', onKeyDown);

  return () => {
    cancelAnimationFrame(raf);
    viewport.removeEventListener('pointerdown', onPointerDown);
    viewport.removeEventListener('pointermove', onPointerMove);
    viewport.removeEventListener('pointerup', endDrag);
    viewport.removeEventListener('pointercancel', endDrag);
    viewport.removeEventListener('wheel', onWheel);
    viewport.removeEventListener('keydown', onCapKeyDown);
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', onKeyDown);
  };
}
