# Deployment

## GitHub repository

The repository remote is:

~~~text
git@github.com:RohitKlabs/klabs-tools.git
~~~

## Build output

Vite writes the production site to dist/. The current Pages-ready command is:

~~~bash
npm run build:pages
~~~

That command runs vite build, writes assets to dist/, and copies dist/index.html to dist/404.html for SPA fallback.

The build also copies these public files:

- CNAME containing tools.klabs.in;
- .nojekyll;
- favicon.svg.

## Automation

.github/workflows/deploy-pages.yml runs on pushes to `main` and can also be started with a manual dispatch. Version tags such as `v0.0.1` are release markers only; they do not trigger a separate deployment because the GitHub Pages environment is protected for the main branch. It uses Node 20, npm ci, npm run build:pages, actions/upload-pages-artifact, and actions/deploy-pages.

To publish a change and then mark it as a release, push `main` first. The push deploys the site, and the tag identifies the released commit:

~~~bash
git push origin main
git tag -a v0.0.1 -m "Release v0.0.1"
git push origin v0.0.1
~~~

Use the next version tag, such as `v0.0.2`, for later releases. A manual workflow dispatch remains available for an intentional deployment without creating a tag.

In the GitHub repository, set Settings → Pages → Source to GitHub Actions.

## DNS

The custom subdomain should point to the repository’s GitHub Pages host:

~~~text
Type: CNAME
Name: tools
Value: RohitKlabs.github.io
~~~

The exact value should match the GitHub Pages domain shown in repository settings if the account configuration differs.

## Manual verification

After a build:

~~~bash
npm run preview
~~~

Check the home page, /tools/zone-maker, and /tools/zone-maker/app. Also confirm that dist/index.html and dist/404.html exist and that dist/CNAME contains tools.klabs.in.

## Generated files

Do not make source edits directly inside dist/. Rebuild it with npm run build:pages. Whether dist/ is committed is a repository policy decision; the GitHub Actions workflow does not require committed build output.
