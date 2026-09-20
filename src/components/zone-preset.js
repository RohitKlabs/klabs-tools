export class ZonePreset extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<dialog class="tool-dialog preset-dialog"><div class="dialog-heading"><div><h2>Choose a field</h2></div><button class="icon-button" type="button" data-close aria-label="Close presets">×</button></div><div class="preset-list" role="listbox"><button type="button" data-shape="star" class="preset-card" role="option"><strong>Star field</strong><span>Dense points with sharp local pockets</span></button><button type="button" data-shape="crescent" class="preset-card" role="option"><strong>Crescent</strong><span>Curved field with an open inner edge</span></button><button type="button" data-shape="blobs" class="preset-card" role="option"><strong>Twin blobs</strong><span>Two separated clusters</span></button><button type="button" data-shape="scatter" class="preset-card" role="option"><strong>Scatter</strong><span>Loose random distribution</span></button></div><label class="range-label">Point count <b data-value="count">150</b></label><input data-key="count" type="range" min="20" max="400" step="10" value="150"><div class="preset-actions"><button class="button secondary" type="button" data-reroll>Reroll field <span>↻</span></button><button class="button primary" type="button" data-apply>Use preset <span>↗</span></button></div></dialog>';
    this.dialog = this.querySelector('dialog');
    this.selectedShape = 'star';
    this.querySelector('[data-close]').addEventListener('click', () => this.close());
    this.dialog.addEventListener('click', (event) => { if (event.target === this.dialog) this.close(); });
    this.addEventListener('input', (event) => { const input = event.target.closest('[data-key]'); if (!input) return; this.querySelector('[data-value="' + input.dataset.key + '"]').textContent = input.value; });
    this.querySelector('[data-apply]').addEventListener('click', () => this.selectPreset(false));
    this.querySelector('[data-reroll]').addEventListener('click', () => this.selectPreset(true));
    this.querySelectorAll('[data-shape]').forEach((button) => button.addEventListener('click', () => { this.selectedShape = button.dataset.shape; this.querySelectorAll('[data-shape]').forEach((item) => { item.classList.toggle('active', item === button); item.setAttribute('aria-selected', item === button); }); }));
  }

  open() { if (!this.dialog.open) this.dialog.showModal(); }
  close() { if (this.dialog.open) this.dialog.close(); }

  selectPreset(reroll) {
    this.dispatchEvent(new CustomEvent('preset-selected', { bubbles: true, detail: { shape: this.selectedShape, count: Number(this.querySelector('[data-key="count"]').value), reroll } }));
    this.close();
  }

  set data(state) {
    if (!state) return;
    this.selectedShape = state.shape === 'custom' ? 'star' : state.shape;
    this.querySelector('[data-key="count"]').value = state.count;
    this.querySelector('[data-value="count"]').textContent = state.count;
    this.querySelectorAll('[data-shape]').forEach((button) => { const active = button.dataset.shape === this.selectedShape; button.classList.toggle('active', active); button.setAttribute('aria-selected', active); });
  }
}
