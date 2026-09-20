const ROUTES = {
  home: {
    path: '/',
    title: 'Klabs Tools · Useful tools for better work',
    description: 'A growing collection of simple, thoughtful browser tools from Klabs.',
  },
  zoneMakerLanding: {
    path: '/tools/zone-maker',
    title: 'Zone Maker · Build clear geographic boundaries',
    description: 'Turn scattered points into clear, editable geographic boundaries with Zone Maker.',
  },
  zoneMaker: {
    path: '/tools/zone-maker/app',
    title: 'Zone Maker Workspace · Klabs Tools',
    description: 'Build, inspect, and export geographic work zones from scattered points.',
  },
};

function normalizePath(pathname) {
  const path = pathname.replace(/\/+$/, '');
  return path || '/';
}

export function getRoute(pathname = window.location.pathname) {
  const path = normalizePath(pathname);
  if (path === ROUTES.zoneMaker.path) return 'zoneMaker';
  if (path === ROUTES.zoneMakerLanding.path) return 'zoneMakerLanding';
  return 'home';
}

export function routeInfo(routeName) {
  return ROUTES[routeName] || ROUTES.home;
}

export class AppRouter extends HTMLElement {
  connectedCallback() {
    this.handleNavigation = () => this.render(getRoute());
    this.addEventListener('click', (event) => {
      const link = event.target.closest('a[data-route]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      history.pushState({}, '', url.pathname + url.search + url.hash);
      this.render(getRoute(url.pathname));
    });
    window.addEventListener('popstate', this.handleNavigation);
    this.render(getRoute());
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.handleNavigation);
  }

  render(routeName) {
    const route = routeInfo(routeName);
    this.dataset.route = routeName;
    document.title = route.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', route.description);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = new URL(route.path, window.location.origin).href;
    this.innerHTML = routeName === 'zoneMaker'
      ? '<zone-app></zone-app>'
      : routeName === 'zoneMakerLanding'
        ? '<tool-landing-page tool="zone-maker"></tool-landing-page>'
        : '<home-page></home-page>';
    window.scrollTo(0, 0);
  }
}
