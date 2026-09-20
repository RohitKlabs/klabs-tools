export class ZoneControls extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<section class="control-block"><div class="section-heading"><h2>Boundary controls</h2></div><label class="range-label">Concavity <b data-value="concavity">30</b></label><input data-key="concavity" type="range" min="0" max="100" value="30"><p class="help">Low values trace local detail. High values simplify toward a convex wrapper.</p><label class="range-label">Length threshold <b data-value="lengthThreshold">0</b></label><input data-key="lengthThreshold" type="range" min="0" max="60" value="0"><p class="help">Ignore short edges to smooth small pockets and jitter.</p><label class="check"><input data-key="convexOnly" type="checkbox"> <span>Force pure convex hull</span></label><label class="check"><input data-key="showCompare" type="checkbox"> <span>Show convex reference</span></label></section><section class="stats"><div><strong data-stat="points">0</strong><span>input points</span></div><div><strong data-stat="hull">0</strong><span>hull vertices</span></div><div><strong data-stat="area">0</strong><span>area units²</span></div></section>';
    this.addEventListener('input', this.handleInput.bind(this));
    this.addEventListener('change', this.handleInput.bind(this));
  }

  set data(state) {
    this.current = state;
    if (!state) return;
    for (const key of ['concavity', 'lengthThreshold', 'convexOnly', 'showCompare']) {
      const input = this.querySelector('[data-key="' + key + '"]');
      if (input) input[input.type === 'checkbox' ? 'checked' : 'value'] = state[key];
      const output = this.querySelector('[data-value="' + key + '"]');
      if (output) output.textContent = state[key];
    }
    this.querySelector('[data-stat="points"]').textContent = state.points.length;
    this.querySelector('[data-stat="hull"]').textContent = state.hull.length;
    this.querySelector('[data-stat="area"]').textContent = state.area.toFixed(1);
  }

  handleInput(event) {
    const input = event.target.closest('[data-key]');
    if (!input) return;
    const value = input.type === 'checkbox' ? input.checked : Number(input.value);
    const output = this.querySelector('[data-value="' + input.dataset.key + '"]');
    if (output) output.textContent = value;
    this.dispatchEvent(new CustomEvent('settings-change', { bubbles: true, detail: { [input.dataset.key]: value, debounce: input.type === 'range' } }));
  }
}
