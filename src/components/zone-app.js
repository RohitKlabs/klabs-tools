import { ZoneStore } from '../lib/store.js';
import { ZoneStage, ZOOM_CONFIG } from './zone-stage.js';
import { ZoneControls } from './zone-controls.js';
import { PointImport } from './point-import.js';
import { ZoneExport } from './zone-export.js';
import { ZonePreset } from './zone-preset.js';

customElements.define('zone-stage', ZoneStage);
customElements.define('zone-controls', ZoneControls);
customElements.define('point-import', PointImport);
customElements.define('zone-export', ZoneExport);
customElements.define('zone-preset', ZonePreset);

export class ZoneApp extends HTMLElement {
  connectedCallback() {
    this.store = new ZoneStore();
    this.innerHTML = '<div class="app-shell"><header class="topbar"><div class="brand"><span class="brand-mark">ZM</span><div><strong>Zone Maker</strong><span>boundary workspace</span></div></div><div class="top-actions"><div class="zoom-controls" aria-label="Canvas zoom"><button type="button" data-zoom="out" aria-label="Zoom out">−</button><output data-zoom-value aria-live="polite">100%</output><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="reset" aria-label="Reset zoom">Reset</button></div><span class="save-state">autosaved</span><button class="theme-toggle" type="button">Light mode <span>◐</span></button></div></header><main class="workspace"><aside class="sidebar"><nav class="workflow-actions" aria-label="Dataset actions"><button class="workflow-button" type="button" data-tool="preset"><span class="workflow-icon" aria-hidden="true">✦</span><strong>Preset</strong></button><button class="workflow-button" type="button" data-tool="import"><span class="workflow-icon" aria-hidden="true">↥</span><strong>Import</strong></button><button class="workflow-button" type="button" data-tool="export"><span class="workflow-icon" aria-hidden="true">↧</span><strong>Export</strong></button></nav><section class="panel control-panel"><zone-controls></zone-controls></section><zone-preset></zone-preset><point-import></point-import><zone-export></zone-export></aside><section class="stage-shell"><zone-stage></zone-stage></section></main></div>';
    this.stage = this.querySelector('zone-stage');
    this.controls = this.querySelector('zone-controls');
    this.preset = this.querySelector('zone-preset');
    this.importer = this.querySelector('point-import');
    this.exporter = this.querySelector('zone-export');
    this.zoomValue = this.querySelector('[data-zoom-value]');
    this.querySelector('.workflow-actions').addEventListener('click', (event) => { const button = event.target.closest('[data-tool]'); if (!button) return; const tools = { preset: this.preset, import: this.importer, export: this.exporter }; tools[button.dataset.tool].open(button); });
    this.querySelector('.zoom-controls').addEventListener('click', (event) => { const button = event.target.closest('[data-zoom]'); if (!button || button.disabled) return; this.stage.setZoom(button.dataset.zoom); this.updateZoomControls(); });
    this.addEventListener('view-change', () => this.updateZoomControls());
    this.addEventListener('preset-selected', (event) => { this.store.update({ shape: event.detail.shape, count: event.detail.count }); this.store.regenerate(); });
    this.addEventListener('points-imported', (event) => this.store.update({ points: event.detail, count: event.detail.length, shape: 'custom' }));
    this.addEventListener('settings-change', (event) => { const { debounce, ...patch } = event.detail; this.store.update(patch, { debounce }); });
    this.addEventListener('export-settings-change', (event) => this.store.update(event.detail));
    this.querySelector('.theme-toggle').addEventListener('click', () => { this.store.update({ theme: this.store.state.theme === 'dark' ? 'light' : 'dark' }); });
    this.render(this.store.snapshot());
    this.store.addEventListener('change', (event) => this.render(event.detail));
    this.updateZoomControls();
  }

  updateZoomControls() {
    const state = this.stage.getZoomState();
    this.zoomValue.value = Math.round(state.zoom * 100) + '%';
    this.zoomValue.textContent = Math.round(state.zoom * 100) + '%';
    this.querySelector('[data-zoom="in"]').disabled = !state.canZoomIn;
    this.querySelector('[data-zoom="out"]').disabled = !state.canZoomOut;
    this.querySelector('[data-zoom="reset"]').disabled = !state.canReset;
  }

  render(state) {
    this.dataset.theme = state.theme;
    const themeButton = this.querySelector('.theme-toggle');
    if (themeButton) { themeButton.firstChild.textContent = (state.theme === 'dark' ? 'Light mode' : 'Dark mode') + ' '; themeButton.setAttribute('aria-label', state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); }
    this.stage.data = state;
    this.controls.data = state;
    this.preset.data = state;
    this.exporter.data = state;
  }
}
