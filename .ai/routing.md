# Routing

## Current route table

| URL | Route key | Rendered element | Purpose |
| --- | --- | --- | --- |
| / | home | <home-page> | Tool directory and discovery page |
| /tools/zone-maker | zoneMakerLanding | <tool-landing-page tool="zone-maker"> | Public Zone Maker landing page |
| /tools/zone-maker/app | zoneMaker | <zone-app> | Direct interactive editor |

Unknown paths currently fall back to the home page. If a real not-found page is introduced later, update getRoute() and SEO behavior together.

## Internal navigation

Internal links that should be handled without a full page reload use data-route:

~~~html
<a href="/tools/zone-maker" data-route>Zone Maker</a>
~~~

The router ignores modified clicks, non-left clicks, and off-origin URLs so normal browser behavior remains available for new tabs and external links.

## Metadata

Each route has a title and description in src/router.js. The router updates those values at runtime and creates or updates the canonical link. index.html contains the initial home metadata and static collection structured data used before JavaScript mounts.

When adding a route:

1. Add a route entry with a stable path, title, and description.
2. Add the route branch in getRoute().
3. Add the rendered custom element branch in AppRouter.render().
4. Add the route to this table.
5. Check direct navigation through the Pages fallback.

## GitHub Pages fallback

GitHub Pages is static hosting. npm run build:pages creates dist/404.html from the same shell as dist/index.html. This lets direct requests such as /tools/zone-maker/app load the client router after Pages returns the fallback document.
