import { parsePoints } from '../lib/parser.js';

export class PointImport extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<dialog class="tool-dialog"><div class="dialog-heading"><div><h2>Import points</h2></div><button class="icon-button" type="button" data-close aria-label="Close import">×</button></div><p class="help">Paste JSON pairs, x/y rows, or a table with columns named x and y.</p><textarea placeholder="x,y\n12,45\n30,60\n18,72"></textarea><div class="import-footer"><span class="error" aria-live="polite"></span><button class="button primary" type="button" data-import>Plot points <span>↗</span></button></div><details class="examples"><summary>Example formats</summary><div class="example-list"><code>12, 45<br>30, 60<br>18, 72</code><code>[[12,45],[30,60],[18,72]]</code><code>id,x,y<br>a,12,45<br>b,30,60</code></div></details></dialog>';
    this.dialog = this.querySelector('dialog');
    const title = this.dialog.querySelector('h2');
    title.id = 'import-title';
    this.dialog.setAttribute('aria-labelledby', title.id);
    const textarea = this.dialog.querySelector('textarea');
    textarea.id = 'point-data';
    textarea.setAttribute('aria-label', 'Point data');
    textarea.setAttribute('aria-describedby', 'point-data-help');
    textarea.insertAdjacentHTML('beforebegin', '<label class="field-label" for="point-data">Point data</label><span id="point-data-help" class="field-help">At least 3 valid coordinate pairs are required.</span>');
    this.dialog.querySelector('.error').setAttribute('role', 'alert');
    this.querySelector('[data-close]').addEventListener('click', () => this.close());
    this.querySelector('[data-import]').addEventListener('click', () => this.importPoints());
    this.dialog.addEventListener('click', (event) => { if (event.target === this.dialog) this.close(); });
    this.dialog.addEventListener('cancel', (event) => { event.preventDefault(); this.close(); });
  }

  open(trigger) { this.lastTrigger = trigger; if (!this.dialog.open) { this.dialog.showModal(); this.querySelector('textarea').focus(); } }
  close() { if (this.dialog.open) this.dialog.close(); this.lastTrigger?.focus(); }

  importPoints() {
    const points = parsePoints(this.querySelector('textarea').value);
    const error = this.querySelector('.error');
    if (!points) { error.textContent = 'Need at least 3 valid coordinate pairs. Check the examples below and try again.'; return; }
    error.textContent = '';
    this.dispatchEvent(new CustomEvent('points-imported', { bubbles: true, detail: points }));
    this.close();
  }
}
