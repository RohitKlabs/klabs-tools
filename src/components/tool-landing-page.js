import { getTool } from '../data/tools.js';

export class ToolLandingPage extends HTMLElement {
  connectedCallback() {
    const tool = getTool(this.getAttribute('tool'));
    if (!tool) return;

    const available = tool.status === 'Available now';
    const features = tool.features || ['A focused experience', 'Fast and easy to use', 'Built for the browser'];
    this.innerHTML = [
      '<main class="tool-landing">',
      '  <header class="landing-header">',
      '    <a class="home-brand" href="/" data-route aria-label="Klabs Tools home"><span class="brand-mark">K</span><span><strong>Klabs Tools</strong><small>useful things for the web</small></span></a>',
      '    <a class="landing-back" href="/" data-route><span>←</span> All tools</a>',
      '  </header>',
      '  <section class="landing-hero landing-accent-' + tool.accent + '" aria-labelledby="tool-landing-title">',
      '    <div class="landing-hero-copy">',
      '      <div class="landing-breadcrumb"><a href="/" data-route>Tools</a><span>/</span><span>' + tool.category + '</span></div>',
      '      <div class="landing-tool-mark" aria-hidden="true">' + tool.icon + '</div>',
      '      <p class="home-kicker">' + tool.status + '</p>',
      '      <h1 id="tool-landing-title">' + tool.name + '</h1>',
      '      <p class="landing-summary">' + tool.description + '</p>',
      available ? '      <a class="landing-cta" href="' + tool.appPath + '" data-route>Open the tool <span>↗</span></a>' : '      <span class="landing-soon">This tool is in the works</span>',
      '    </div>',
      '    <div class="landing-preview" aria-label="Tool preview">',
      '      <div class="preview-window-bar"><span></span><span></span><span></span><small>' + tool.name.toLowerCase().replaceAll(' ', '-') + '</small></div>',
      '      <div class="preview-surface">',
      available ? '        <div class="preview-grid"></div><div class="preview-shape"></div><i class="preview-point point-one"></i><i class="preview-point point-two"></i><i class="preview-point point-three"></i><i class="preview-point point-four"></i>' : '        <div class="preview-placeholder"><strong>' + tool.icon + '</strong><span>Preview coming soon</span></div>',
      '      </div>',
      '    </div>',
      '  </section>',
      '  <section class="landing-details" aria-labelledby="tool-details-title">',
      '    <div><p class="eyebrow">Why it exists</p><h2 id="tool-details-title">A focused workspace for a common job.</h2></div>',
      '    <div class="landing-feature-list">' + features.map((feature, index) => '<div class="landing-feature"><span>0' + (index + 1) + '</span><strong>' + feature + '</strong></div>').join('') + '</div>',
      '  </section>',
      '  <footer class="home-footer"><span>Klabs Tools</span><span>Small tools with room to think.</span></footer>',
      '</main>',
    ].join('');
  }
}
