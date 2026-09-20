export class ZoneExport extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<dialog class="tool-dialog export-dialog"><div class="dialog-heading"><div><h2>Export boundary</h2></div><button class="icon-button" type="button" data-close aria-label="Close export">×</button></div><div class="form-grid"><label>Zone name<input data-key="zoneName" value="Working zone"></label><label>Type<select data-key="zoneType"><option>work</option><option>sub</option><option>safety</option><option>avoid</option><option>avoid_around</option><option>avoid_reverse</option></select></label><label>Origin latitude<input data-key="originLat" value="46.68047665"></label><label>Origin longitude<input data-key="originLng" value="16.95546324"></label><label>X multiplier<input data-key="multiplierX" value="1"></label><label>Y multiplier<input data-key="multiplierY" value="-1"></label><label>Bearing °<input data-key="bearing" value="0"></label></div><div class="format-toggle"><label><input type="radio" name="format" value="text" checked> TEXT</label><label><input type="radio" name="format" value="csv"> CSV</label></div><div class="dialog-output-heading"><span>Generated output</span><button class="button ghost copy-button" type="button">Copy</button></div><textarea class="export-output" readonly></textarea><p class="help">Offsets are scaled by 1000, multiplied, then rotated by bearing. The original coordinates stay in the output rows.</p></dialog>';
    this.dialog = this.querySelector('dialog');
    this.addEventListener('input', this.handleInput.bind(this));
    this.addEventListener('change', this.handleInput.bind(this));
    this.querySelector('[data-close]').addEventListener('click', () => this.close());
    this.dialog.addEventListener('click', (event) => { if (event.target === this.dialog) this.close(); });
    this.querySelector('.copy-button').addEventListener('click', async () => { try { await navigator.clipboard.writeText(this.querySelector('.export-output').value); this.querySelector('.copy-button').textContent = 'Copied'; setTimeout(() => { this.querySelector('.copy-button').textContent = 'Copy'; }, 1200); } catch { this.querySelector('.copy-button').textContent = 'Select text'; this.querySelector('.export-output').select(); } });
  }

  open() { if (!this.dialog.open) this.dialog.showModal(); }
  close() { if (this.dialog.open) this.dialog.close(); }

  set data(state) {
    if (!state) return;
    for (const key of ['zoneName', 'zoneType', 'originLat', 'originLng', 'multiplierX', 'multiplierY', 'bearing']) { const input = this.querySelector('[data-key="' + key + '"]'); if (input && document.activeElement !== input) input.value = state[key]; }
    const radio = this.querySelector('input[value="' + state.exportFormat + '"]');
    if (radio) radio.checked = true;
    this.querySelector('.export-output').value = state.exportText;
  }

  handleInput(event) {
    const input = event.target.closest('[data-key]');
    const format = event.target.closest('input[type="radio"]');
    if (input) this.dispatchEvent(new CustomEvent('export-settings-change', { bubbles: true, detail: { [input.dataset.key]: input.value } }));
    if (format) this.dispatchEvent(new CustomEvent('export-settings-change', { bubbles: true, detail: { exportFormat: format.value } }));
  }
}
