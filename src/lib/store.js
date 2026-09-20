import { SHAPES } from './shapes.js';
import { concaveHull, convexHull, polygonArea } from './geometry.js';
import { exportRows, rowsToText } from './export.js';
const defaults = { shape: 'star', count: 150, concavity: 30, lengthThreshold: 0, convexOnly: false, showCompare: false, points: [], theme: 'dark', exportFormat: 'text', zoneName: 'Working zone', zoneType: 'work', originLat: '46.68047665', originLng: '16.95546324', multiplierX: '1', multiplierY: '-1', bearing: '0' };
export class ZoneStore extends EventTarget {
  constructor() {
    super();
    const saved = JSON.parse(localStorage.getItem('zone-maker-state') || 'null');
    this.state = { ...defaults, ...saved };
    this.derived = { hull: [], compare: [], area: 0 };
    this.debounceTimer = 0;
    if (!this.state.points.length) this.regenerate(false);
    this.recompute();
  }

  update(patch, { debounce = false } = {}) {
    this.state = { ...this.state, ...patch };
    localStorage.setItem('zone-maker-state', JSON.stringify(this.state));
    if (debounce) {
      this.emit();
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.recompute(), 90);
    } else {
      this.recompute();
    }
  }

  regenerate(announce = true) {
    this.state.points = SHAPES[this.state.shape] ? SHAPES[this.state.shape](this.state.count) : SHAPES.star(this.state.count);
    if (announce) this.update({ points: this.state.points });
  }

  recompute() {
    const { points, convexOnly, concavity, lengthThreshold } = this.state;
    const hull = points.length >= 3 ? (convexOnly ? convexHull(points) : concaveHull(points, concavity, lengthThreshold)) : [];
    this.derived = { hull, compare: points.length >= 3 ? convexHull(points) : [], area: polygonArea(hull) };
    this.emit();
  }

  snapshot() {
    const rows = exportRows({ hull: this.derived.hull, name: this.state.zoneName, type: this.state.zoneType, latitude: this.state.originLat, longitude: this.state.originLng, multiplierX: this.state.multiplierX, multiplierY: this.state.multiplierY, bearing: this.state.bearing });
    return { ...this.state, ...this.derived, exportText: rowsToText(rows, this.state.exportFormat) };
  }

  emit() { this.dispatchEvent(new CustomEvent('change', { detail: this.snapshot() })); }
}
