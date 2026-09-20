import { fitToCanvas, toCanvas } from '../lib/geometry.js';

// View-only zoom settings. This scale never changes stored points or exports.
export const ZOOM_CONFIG = Object.freeze({
  min: 0.5,
  max: 3,
  step: 0.25,
  default: 1,
});

export class ZoneStage extends HTMLElement {
  constructor() {
    super();
    this.zoom = ZOOM_CONFIG.default;
    this.pan = { x: 0, y: 0 };
    this.pointer = null;
    this.activePointers = new Map();
    this.pinch = null;
  }

  connectedCallback() {
    this.innerHTML = '<canvas width="1000" height="640" aria-label="Interactive zone canvas. Drag to pan, use the mouse wheel or pinch to zoom."></canvas><div class="legend"><span><i class="swatch points"></i>input points</span><span><i class="swatch hull"></i>active boundary</span><span class="compare-legend"><i class="swatch compare"></i>convex reference</span></div>';
    this.canvas = this.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.addEventListener('pointerdown', (event) => this.startPan(event));
    this.canvas.addEventListener('pointermove', (event) => this.movePan(event));
    this.canvas.addEventListener('pointerup', (event) => this.endPan(event));
    this.canvas.addEventListener('pointercancel', (event) => this.endPan(event));
    this.canvas.addEventListener('lostpointercapture', (event) => this.endPan(event));
    this.canvas.addEventListener('wheel', (event) => this.zoomFromWheel(event), { passive: false });
    new ResizeObserver(() => this.draw()).observe(this);
  }

  set data(value) { this.current = value; this.updateLegend(); this.draw(); }

  updateLegend() { if (this.current) this.querySelector('.compare-legend').hidden = !this.current.showCompare || this.current.convexOnly; }

  setZoom(action) {
    const currentZoom = this.zoom;
    let nextZoom = currentZoom;
    if (action === 'in') nextZoom += ZOOM_CONFIG.step;
    if (action === 'out') nextZoom -= ZOOM_CONFIG.step;
    if (action === 'reset') {
      this.zoom = ZOOM_CONFIG.default;
      this.pan = { x: 0, y: 0 };
      this.draw();
      this.emitViewChange();
      return this.zoom;
    }
    this.zoomTo(nextZoom, this.canvas.clientWidth / 2, this.canvas.clientHeight / 2, currentZoom, this.pan);
    return this.zoom;
  }

  getZoomState() {
    return {
      zoom: this.zoom,
      canZoomIn: this.zoom < ZOOM_CONFIG.max,
      canZoomOut: this.zoom > ZOOM_CONFIG.min,
      canReset: this.zoom !== ZOOM_CONFIG.default || this.pan.x !== 0 || this.pan.y !== 0,
    };
  }

  emitViewChange() {
    this.dispatchEvent(new CustomEvent('view-change', { bubbles: true }));
  }

  clampZoom(value) {
    return Math.min(ZOOM_CONFIG.max, Math.max(ZOOM_CONFIG.min, value));
  }

  canvasPoint(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return [clientX - rect.left, clientY - rect.top];
  }

  zoomTo(nextZoom, focalX, focalY, baseZoom = this.zoom, basePan = this.pan) {
    const zoom = this.clampZoom(nextZoom);
    if (zoom === baseZoom && basePan === this.pan) return false;
    const centerX = this.canvas.clientWidth / 2;
    const centerY = this.canvas.clientHeight / 2;
    const ratio = zoom / baseZoom;
    this.pan = {
      x: focalX + (centerX + basePan.x - focalX) * ratio - centerX,
      y: focalY + (centerY + basePan.y - focalY) * ratio - centerY,
    };
    this.zoom = zoom;
    this.draw();
    this.emitViewChange();
    return true;
  }

  zoomFromWheel(event) {
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? this.canvas.clientHeight : 1;
    const [focalX, focalY] = this.canvasPoint(event.clientX, event.clientY);
    const nextZoom = this.zoom * Math.exp(-event.deltaY * unit * 0.0015);
    this.zoomTo(nextZoom, focalX, focalY);
    event.preventDefault();
  }

  startPan(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    this.activePointers.set(event.pointerId, event);
    this.canvas.setPointerCapture(event.pointerId);
    event.preventDefault();
    if (this.activePointers.size === 1) {
      this.pointer = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        panX: this.pan.x,
        panY: this.pan.y,
      };
      this.canvas.classList.add('is-panning');
    } else if (this.activePointers.size === 2) {
      this.startPinch();
    }
  }

  movePan(event) {
    if (!this.activePointers.has(event.pointerId)) return;
    this.activePointers.set(event.pointerId, event);
    if (this.pinch && this.activePointers.size >= 2) {
      this.movePinch();
    } else if (this.pointer && event.pointerId === this.pointer.id) {
      this.pan.x = this.pointer.panX + event.clientX - this.pointer.startX;
      this.pan.y = this.pointer.panY + event.clientY - this.pointer.startY;
      this.draw();
      this.emitViewChange();
    }
    event.preventDefault();
  }

  endPan(event) {
    this.activePointers.delete(event.pointerId);
    if (this.pinch && this.activePointers.size < 2) {
      this.pinch = null;
      this.pointer = null;
      this.canvas.classList.remove('is-panning');
      const remaining = this.activePointers.values().next().value;
      if (remaining) {
        this.pointer = { id: remaining.pointerId, startX: remaining.clientX, startY: remaining.clientY, panX: this.pan.x, panY: this.pan.y };
        this.canvas.classList.add('is-panning');
      }
    } else if (this.pointer && event.pointerId === this.pointer.id) {
      this.pointer = null;
      this.canvas.classList.remove('is-panning');
    }
    event.preventDefault();
  }

  startPinch() {
    const [first, second] = [...this.activePointers.values()];
    const midpoint = [(first.clientX + second.clientX) / 2, (first.clientY + second.clientY) / 2];
    const [midX, midY] = this.canvasPoint(midpoint[0], midpoint[1]);
    this.pinch = {
      distance: Math.max(1, Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY)),
      midpoint: [midX, midY],
      zoom: this.zoom,
      pan: { ...this.pan },
    };
    this.pointer = null;
    this.canvas.classList.remove('is-panning');
  }

  movePinch() {
    const [first, second] = [...this.activePointers.values()];
    const distance = Math.max(1, Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY));
    const midpoint = [(first.clientX + second.clientX) / 2, (first.clientY + second.clientY) / 2];
    const [midX, midY] = this.canvasPoint(midpoint[0], midpoint[1]);
    const [startMidX, startMidY] = this.pinch.midpoint;
    const nextZoom = this.pinch.zoom * distance / this.pinch.distance;
    const zoomed = this.zoomTo(nextZoom, startMidX, startMidY, this.pinch.zoom, this.pinch.pan);
    const nextPan = {
      x: this.pan.x + midX - startMidX,
      y: this.pan.y + midY - startMidY,
    };
    if (zoomed || nextPan.x !== this.pan.x || nextPan.y !== this.pan.y) {
      this.pan = nextPan;
      this.draw();
      this.emitViewChange();
    }
  }

  draw() {
    if (!this.context || !this.current) return;
    const rect = this.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height - this.querySelector('.legend').offsetHeight));
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.height = height + 'px';
    const ctx = this.context;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = getComputedStyle(this).getPropertyValue('--grid').trim() || 'rgba(255,255,255,.08)';
    const grid = Math.max(32, Math.round(Math.min(width, height) / 16));
    for (let x = 0; x <= width; x += grid) { ctx.beginPath(); ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, height); ctx.stroke(); }
    for (let y = 0; y <= height; y += grid) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(width, y + .5); ctx.stroke(); }
    const transform = fitToCanvas(this.current.points, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const drawPoint = (point) => {
      const [fitX, fitY] = toCanvas(transform, point);
      return [centerX + (fitX - centerX) * this.zoom + this.pan.x, centerY + (fitY - centerY) * this.zoom + this.pan.y];
    };
    ctx.fillStyle = getComputedStyle(this).getPropertyValue('--point').trim() || '#eef2f8';
    this.current.points.forEach((point) => { const [x, y] = drawPoint(point); ctx.beginPath(); ctx.arc(x, y, Math.max(2, Math.min(3.2, width / 320) * this.zoom), 0, Math.PI * 2); ctx.fill(); });
    const drawHull = (points, color, lineWidth, dashed = false) => { if (points.length < 2) return; ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lineWidth * this.zoom; ctx.lineJoin = 'round'; ctx.setLineDash(dashed ? [7 * this.zoom, 6 * this.zoom] : []); ctx.beginPath(); points.forEach((point, index) => { const [x, y] = drawPoint(point); index ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.stroke(); ctx.restore(); };
    if (this.current.showCompare && !this.current.convexOnly) drawHull(this.current.compare, getComputedStyle(this).getPropertyValue('--compare').trim() || '#70e1d6', 1.5, true);
    drawHull(this.current.hull, getComputedStyle(this).getPropertyValue('--accent').trim() || '#f2b84b', 2.6);
  }
}
