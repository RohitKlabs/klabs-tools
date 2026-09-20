# Architecture

## Runtime shape

~~~text
index.html -> src/main.js -> AppRouter
                              ├─ HomePage -> src/data/tools.js
                              ├─ ToolLandingPage -> src/data/tools.js
                              └─ ZoneApp -> ZoneStore -> geometry/parser/shapes/export
~~~

## Entry point

index.html is the only HTML shell. It supplies SEO metadata, structured data, the router host, the no-JavaScript fallback, and the src/main.js module.

src/main.js imports the shared stylesheet, imports the custom-element classes, and registers the application elements.

## Router boundary

AppRouter owns route selection from window.location.pathname, History API navigation for internal links marked with data-route, browser back/forward through popstate, document title, meta description and canonical URL updates, and mounting the page-level custom element.

Page components own their markup and local interaction behavior. They should communicate route changes through links rather than calling router internals.

## Zone Maker data flow

ZoneApp creates a ZoneStore, mounts the stage, controls, and dialog components, and connects their events. The store owns persisted input/settings state and derived hull data. ZoneStage owns only presentation state for pan and zoom.

~~~text
control input
  -> settings-change event
  -> ZoneStore.update()
  -> debounced recompute()
  -> change event
  -> ZoneApp.render(snapshot)
  -> ZoneControls / ZoneStage / ZoneExport
~~~

Import and preset actions emit events upward. Export settings also update the shared store so the output remains synchronized with the active boundary.

## Persistence

ZoneStore serializes editable state to localStorage under zone-maker-state. Derived values such as hull, compare, and area are recalculated from the stored state and are not the source of truth.

## Build boundary

Vite writes production assets to dist/. The Pages build script copies dist/index.html to dist/404.html so GitHub Pages serves the SPA shell for direct route requests. public/ assets are copied into the root of dist/.
