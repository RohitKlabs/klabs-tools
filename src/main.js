import './styles.css';
import { ZoneApp } from './components/zone-app.js';
import { HomePage } from './components/home-page.js';
import { ToolLandingPage } from './components/tool-landing-page.js';
import { AppRouter } from './router.js';
customElements.define('zone-app', ZoneApp);
customElements.define('home-page', HomePage);
customElements.define('tool-landing-page', ToolLandingPage);
customElements.define('app-router', AppRouter);
