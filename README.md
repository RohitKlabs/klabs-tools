# Klabs Tools

Klabs Tools is a collection of focused browser utilities from [Klabs](https://klabs.in/). Each utility has a public landing page and a direct workspace while keeping the experience fast, private, and usable without a backend.

Live site: [tools.klabs.in](https://tools.klabs.in/)

## Available tools

### Zone Maker

Zone Maker turns geographic point data into editable work zones. It includes:

- CSV and JSON point import
- Presets for selecting a field and point values
- Interactive zone geometry and statistics
- Canvas zoom with mouse wheel, touch gestures, and controls
- Mouse and touch panning
- Export options for generated zone data
- Responsive controls for desktop and touch devices

Open the [Zone Maker landing page](https://tools.klabs.in/tools/zone-maker) or go directly to the [Zone Maker workspace](https://tools.klabs.in/tools/zone-maker/app).

The directory also includes planned entries for JSON Viewer, Text Toolkit, and Color Lab.

## Technology

- Vite
- JavaScript ES modules
- Native Web Components and Custom Elements
- History API routing
- HTML Canvas for the Zone Maker stage
- GitHub Pages through GitHub Actions

React and other UI frameworks are intentionally not used. The code is organized into custom elements, shared libraries, route metadata, and a central tool catalog so new utilities can be added without turning the application into a monolith.

## Run locally

Requirements: Node.js 20 or newer and npm.

~~~bash
npm install
npm run dev
~~~

Vite will print the local development URL. The main routes are:

| Route | Purpose |
| --- | --- |
| / | Tool directory and discovery page |
| /tools/zone-maker | Zone Maker landing page |
| /tools/zone-maker/app | Direct Zone Maker workspace |

Useful production commands:

~~~bash
npm run build
npm run build:pages
npm run preview
~~~

npm run build:pages creates the Vite output in dist/ and adds the SPA fallback required by GitHub Pages. The dist/ directory is generated and should not be committed.

## Project structure

~~~text
src/
  components/  Native custom elements and page components
  data/        Shared tool catalog and metadata
  lib/         Parsing, geometry, export, shapes, and state logic
  main.js      Application bootstrap and custom-element registration
  router.js    History API route selection and page metadata
  styles.css   Shared application styling
public/        Static files copied into the production build
scripts/       Build helpers, including the Pages fallback
.ai/           Architecture and contributor documentation
.github/       GitHub Actions workflows
~~~

## Contributing workflow

Keep main deployable and use a separate branch for every change. Create a branch from the latest main, make the change, validate it locally, and open a pull request back to main.

~~~bash
git switch main
git pull --ff-only origin main
git switch -c feature/short-description

# make changes
npm run build:pages

git add .
git commit -m "Describe the change"
git push -u origin feature/short-description
~~~

Use a pull request for review and merge it into main only after the checks and review are complete. Do not commit dist/ or node_modules/; both are generated or installed locally.

Suggested branch prefixes are feature/, fix/, docs/, and chore/.

## Deployment and releases

GitHub Actions deploys GitHub Pages on pushes to main. A manual workflow_dispatch is also available. The custom domain is configured through public/CNAME as tools.klabs.in.

After a pull request is merged, main deploys automatically. To mark a deployed commit as a release, create and push an annotated version tag:

~~~bash
git switch main
git pull --ff-only origin main
git tag -a v0.0.2 -m "Release v0.0.2"
git push origin v0.0.2
~~~

Version tags identify releases; they do not trigger a second Pages deployment because the repository github-pages environment is protected for main.

More detailed project guidance is available in [AGENTS.md](AGENTS.md) and [.ai/README.md](.ai/README.md).

## License

No open-source license has been declared yet.

