# Tool catalog

## Catalog source

src/data/tools.js is the single source for directory cards and landing-page content. The TOOLS array currently contains:

| Slug | Name | Category | State | Landing | App |
| --- | --- | --- | --- | --- | --- |
| zone-maker | Zone Maker | Spatial | Available now | /tools/zone-maker | /tools/zone-maker/app |
| json-viewer | JSON Viewer | Data | Coming soon | — | — |
| text-toolkit | Text Toolkit | Text | Coming soon | — | — |
| color-lab | Color Lab | Design | Coming soon | — | — |

## Tool metadata contract

~~~js
{
  slug: 'example-tool',
  name: 'Example Tool',
  category: 'Data',
  status: 'Available now',
  icon: '{}',
  accent: 'mint',
  description: 'Long description used by the landing page.',
  shortDescription: 'Short description used by directory cards.',
  landingPath: '/tools/example-tool',
  appPath: '/tools/example-tool/app',
  features: ['First capability', 'Second capability', 'Third capability'],
}
~~~

status === 'Available now' controls whether the directory shows an Open tool link and whether the landing page shows its primary CTA. Coming-soon tools can still appear in search and category filters.

## Adding an available tool

1. Add complete metadata to TOOLS.
2. Implement and register the tool custom element.
3. Add the landing route and page branch in src/router.js, or generalize the landing route to use the catalog slug.
4. Set appPath to the direct workspace URL.
5. Add route and SEO documentation.
6. Run npm run build:pages.

## Adding a coming-soon tool

Only catalog metadata is required. Leave landingPath and appPath unset until the public page and tool are ready. The current card renders the details action as # when no landing path exists, so replace that behavior with a disabled state if coming-soon cards become clickable.
