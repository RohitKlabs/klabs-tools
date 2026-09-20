import { CATEGORIES, TOOLS } from '../data/tools.js';

export class HomePage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = [
      '<main class="site-home">',
      '  <header class="home-header">',
      '    <a class="home-brand" href="/" data-route aria-label="Klabs Tools home"><span class="brand-mark">K</span><span><strong>Klabs Tools</strong><small>useful things for the web</small></span></a>',
      '    <span class="home-header-note">tools.klabs.in</span>',
      '  </header>',
      '  <section class="home-hero" aria-labelledby="home-title">',
      '    <div><p class="home-kicker">A growing collection of useful tools</p><h1 id="home-title">Make space for <em>better work.</em></h1></div>',
      '    <p class="home-intro">Simple browser tools for the moments when a small, thoughtful utility can save a surprising amount of time.</p>',
      '  </section>',
      '  <section class="directory" aria-labelledby="directory-title">',
      '    <div class="directory-heading"><div><p class="eyebrow">The directory</p><h2 id="directory-title">Find a tool for the job.</h2></div><label class="tool-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search tools" aria-label="Search tools" /></label></div>',
      '    <div class="directory-toolbar"><div class="category-tabs" role="tablist" aria-label="Filter tools by category">' + CATEGORIES.map((category, index) => '<button type="button" class="category-tab' + (index === 0 ? ' active' : '') + '" data-category="' + category + '" role="tab" aria-selected="' + (index === 0) + '">' + category + '</button>').join('') + '</div><span class="tool-count" aria-live="polite"></span></div>',
      '    <div class="tool-grid" data-tool-grid></div><p class="empty-tools" hidden>No tools match that search yet.</p>',
      '  </section>',
      '  <section class="home-note" aria-label="About Klabs Tools"><span class="home-note-mark">✦</span><p>Built by Klabs for curious people who prefer tools that get out of the way.</p></section>',
      '  <footer class="home-footer"><span>Klabs Tools</span><span>Small tools with room to think.</span></footer>',
      '</main>',
    ].join('');
    this.activeCategory = 'All';
    this.renderTools();
    this.bindEvents();
  }

  bindEvents() {
    this.querySelector('.tool-search input').addEventListener('input', () => this.renderTools());
    this.querySelector('.category-tabs').addEventListener('click', (event) => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      this.activeCategory = button.dataset.category;
      this.querySelectorAll('.category-tab').forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', active);
      });
      this.renderTools();
    });
  }

  renderTools() {
    const query = this.querySelector('.tool-search input')?.value.trim().toLowerCase() || '';
    const filtered = TOOLS.filter((tool) => {
      const categoryMatch = this.activeCategory === 'All' || tool.category === this.activeCategory;
      const textMatch = !query || (tool.name + ' ' + tool.category + ' ' + tool.description).toLowerCase().includes(query);
      return categoryMatch && textMatch;
    });
    this.querySelector('[data-tool-grid]').innerHTML = filtered.map((tool) => this.renderCard(tool)).join('');
    this.querySelector('.tool-count').textContent = filtered.length.toString().padStart(2, '0') + (filtered.length === 1 ? ' tool' : ' tools');
    this.querySelector('.empty-tools').hidden = filtered.length > 0;
  }

  renderCard(tool) {
    const available = tool.status === 'Available now';
    return '<article class="tool-card tool-card-' + tool.accent + (available ? '' : ' is-coming') + '">' +
      '<div class="tool-card-top"><span class="tool-icon">' + tool.icon + '</span><span class="tool-status">' + tool.status + '</span></div>' +
      '<div class="tool-card-body"><p class="tool-category">' + tool.category + '</p><h3>' + tool.name + '</h3><p>' + tool.shortDescription + '</p></div>' +
      '<div class="tool-card-actions"><a class="tool-card-link" href="' + (tool.landingPath || '#') + '" data-route>View details <b>↗</b></a>' +
      (available ? '<a class="tool-card-open" href="' + tool.appPath + '" data-route>Open tool</a>' : '<span class="tool-card-open disabled">Coming soon</span>') + '</div></article>';
  }
}
