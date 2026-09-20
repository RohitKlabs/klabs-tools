# Contributing workflow

## Branches and pull requests

Keep main deployable because pushes to it publish the GitHub Pages site. Start each change from the latest main and use a separate branch:

~~~bash
git switch main
git pull --ff-only origin main
git switch -c feature/short-description
~~~

Use feature/, fix/, docs/, or chore/ prefixes as appropriate. Push the branch and open a pull request targeting main:

~~~bash
git push -u origin feature/short-description
~~~

Merge through the pull request after review and checks pass. Routine work should not be committed directly to main.

## Validation

Run the Pages build before opening the pull request:

~~~bash
npm run build:pages
~~~

For route changes, check the home page, tool landing page, and direct app URL. For Zone Maker changes, check import, preset, export, canvas zoom, mouse pan, touch pan, pinch zoom, responsive layout, and theme behavior as applicable.

Do not commit dist/ or node_modules/. They are generated and installed locally, respectively.
