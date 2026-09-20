export class ZonePreset extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<dialog class="tool-dialog preset-dialog"><div class="dialog-heading"><div><h2>Choose a field</h2></div><button class="icon-button" type="button" data-close aria-label="Close presets">×</button></div><div class="preset-list" role="group" aria-label="Field presets"><button type="button" data-shape="star" class="preset-card" aria-pressed="false"><strong>Star field</strong><span>Dense points with sharp local pockets</span></button><button type="button" data-shape="crescent" class="preset-card" aria-pressed="false"><strong>Crescent</strong><span>Curved field with an open inner edge</span></button><button type="button" data-shape="blobs" class="preset-card" aria-pressed="false"><strong>Twin blobs</strong><span>Two separated clusters</span></button><button type="button" data-shape="scatter" class="preset-card" aria-pressed="false"><strong>Scatter</strong><span>Loose random distribution</span></button></div><label class="range-label" for="preset-count">Point count <b data-value="count">150</b></label><input data-key="count" id="preset-count" type="range" min="20" max="400" step="10" value="150"><div class="preset-actions"><button class="button secondary" type="button" data-reroll>Reroll field <span>↻</span></button><button class="button primary" type="button" data-apply>Use preset <span>↗</span></button></div></dialog>';
    this.dialog = this.querySelector('dialog');
    const title = this.dialog.querySelector('h2');
    title.id = 'preset-title';
    this.dialog.setAttribute('aria-labelledby', title.id);
    this.dialog.querySelector('[data-key="count"]').setAttribute('aria-label', 'Point count');
    this.selectedShape = 'star';
    this.setPresetButtons();
    this.querySelector('[data-close]').addEventListener('click', () => this.close());
    this.dialog.addEventListener('click', (event) => { if (event.target === this.dialog) this.close(); });
    this.dialog.addEventListener('cancel', (event) => { event.preventDefault(); this.close(); });
    this.addEventListener('input', (event) => { const input = event.target.closest('[data-key]'); if (!input) return; this.querySelector('[data-value="' + input.dataset.key + '"]').textContent = input.value; });
    this.querySelector('[data-apply]').addEventListener('click', () => this.selectPreset(false));
    this.querySelector('[data-reroll]').addEventListener('click', () => this.selectPreset(true));
    this.querySelectorAll('[data-shape]').forEach((button) => button.addEventListener('click', () => { this.selectedShape = button.dataset.shape; this.setPresetButtons(); }));
  }

  setPresetButtons() {
    this.querySelectorAll('[data-shape]').forEach((button) => {
      const active = button.dataset.shape === this.selectedShape;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active);
    });
  }

  open(trigger) { this.lastTrigger = trigger; if (!this.dialog.open) { this.dialog.showModal(); this.dialog.querySelector('[data-shape].active')?.focus(); } }
  close() { if (this.dialog.open) this.dialog.close(); this.lastTrigger?.focus(); }

  selectPreset(reroll) {
    this.dispatchEvent(new CustomEvent('preset-selected', { bubbles: true, detail: { shape: this.selectedShape, count: Number(this.querySelector('[data-key="count"]').value), reroll } }));
    this.close();
  }

  set data(state) {
    if (!state) return;
    this.selectedShape = state.shape === 'custom' ? 'star' : state.shape;
    this.querySelector('[data-key="count"]').value = state.count;
    this.querySelector('[data-value="count"]').textContent = state.count;
    this.setPresetButtons();
  }
}
