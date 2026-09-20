# Klabs Tools project notes

This folder is the durable project context for contributors and coding agents. Keep it aligned with the source code when routes, tools, state contracts, or deployment behavior change.

## Documents

- architecture.md — runtime composition and event/data flow.
- routing.md — SPA routes, metadata, navigation, and fallback behavior.
- tools.md — catalog schema and the process for adding a tool.
- zone-maker.md — editor layout, store, canvas gestures, and workflows.
- ui-conventions.md — visual, responsive, accessibility, and component conventions.
- deployment.md — local build output, GitHub Pages, custom domain, and DNS.

## Current stack

| Area | Choice |
| --- | --- |
| Build tool | Vite |
| Language | JavaScript with ES modules |
| UI model | Native Web Components |
| Router | Small History API router in src/router.js |
| Styling | One shared stylesheet in src/styles.css |
| Hosting | GitHub Pages through GitHub Actions |
| Domain | tools.klabs.in |

## Working assumptions

The app is intentionally framework-light. Keep the platform primitives, preserve the direct URLs, and make new tools fit the catalog and landing-page model before adding abstractions.
