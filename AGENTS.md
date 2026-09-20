# Klabs Tools contributor and agent guide

## Project purpose

Klabs Tools is a Vite-powered single-page application for small browser utilities. It uses native Web Components and ES modules. React is not used.

The production site is intended for https://tools.klabs.in/.

The first working tool is Zone Maker, a canvas editor for creating, tuning, and exporting geographic work zones from point data.

## Start here

Read these files before making a structural change:

- .ai/README.md — documentation map and project rules.
- .ai/architecture.md — application composition and data flow.
- .ai/routing.md — route table and navigation behavior.
- .ai/tools.md — tool catalog and how to add a tool.
- .ai/zone-maker.md — editor behavior, state, canvas gestures, and dialogs.
- .ai/deployment.md — GitHub Pages and custom-domain workflow.

## Development commands

Use the project scripts from the repository root:

~~~bash
npm install
npm run dev
npm run build
npm run build:pages
npm run preview
~~~

npm run build:pages builds Vite output and creates dist/404.html as the GitHub Pages fallback for client-side routes.

## Source and generated files

- Edit application code in src/.
- Edit static public assets in public/.
- Edit deployment configuration in vite.config.js, .github/workflows/, and scripts/.
- Treat dist/ as generated output. Do not hand-edit files there.
- public/CNAME controls the deployed custom domain.
- public/favicon.svg is the current site favicon.

## Architecture rules

- Keep UI pieces as native custom elements. Define each element once.
- Keep shared tool metadata in src/data/tools.js rather than duplicating names, routes, and descriptions in components.
- Keep route selection in src/router.js; components should not implement their own URL router.
- Keep domain logic in src/lib/; avoid putting geometry, parsing, or export calculations in templates.
- Use bubbling CustomEvent instances for child-to-parent events.
- Preserve the Zone Maker split: canvas stage on desktop left, independently scrollable control rail on desktop right, canvas first on mobile.
- Keep view-only canvas state such as zoom and pan inside ZoneStage; do not put it into exported zone data.
- Use the existing debounced update path for range controls so continuous slider movement stays responsive.

## Adding a new tool

1. Add the tool metadata to src/data/tools.js.
2. Add its landing component if the tool needs more than the shared landing layout.
3. Add a route in src/router.js if it has a public landing page or app page.
4. Register new custom elements in src/main.js or the owning component module.
5. Add styles in the public-route section of src/styles.css or a clearly scoped component section.
6. Update .ai/tools.md when the catalog or route contract changes.
7. Run npm run build:pages and check the generated route fallback.

## Validation expectations

Before handing off a change:

~~~bash
npm run build:pages
~~~

For route changes, verify /, the relevant landing route, and the direct app route return successfully from the dev server or preview server. For editor changes, check mouse drag, wheel zoom, touch pan, pinch zoom, import, preset, export, theme switching, and responsive layout as applicable.

## Style and content

- Keep the visual language quiet, dense, and utility-focused.
- Prefer semantic headings, links, labels, and buttons.
- Preserve keyboard focus styles and accessible names for icon-only controls.
- Use the existing CSS variables and typography before introducing new visual tokens.
- Keep public route titles and descriptions synchronized with src/router.js and index.html structured data.

## GitHub Pages

The deployment workflow runs when a version tag beginning with `v` is pushed, such as `v0.0.1`; normal pushes to main do not deploy. It can also be started manually with workflow dispatch. It installs from package-lock.json, runs npm run build:pages, uploads dist, and deploys through GitHub Pages. The repository uses the custom domain tools.klabs.in.

Release deployment example:

~~~bash
git push origin main
git tag -a v0.0.1 -m "Release v0.0.1"
git push origin v0.0.1
~~~
