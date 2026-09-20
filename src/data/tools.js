export const TOOLS = [
  {
    slug: 'zone-maker',
    name: 'Zone Maker',
    category: 'Spatial',
    status: 'Available now',
    icon: '⌁',
    accent: 'amber',
    description: 'Turn scattered points into clear, editable boundaries for planning, analysis, and export.',
    shortDescription: 'Build geographic work zones from point data.',
    landingPath: '/tools/zone-maker',
    appPath: '/tools/zone-maker/app',
    features: ['Paste or import point data', 'Tune the boundary in real time', 'Pan, zoom, and export the result'],
  },
  {
    slug: 'json-viewer',
    name: 'JSON Viewer',
    category: 'Data',
    status: 'Coming soon',
    icon: '{}',
    accent: 'mint',
    description: 'Explore deeply nested JSON with a calm, readable interface built for quick inspection.',
    shortDescription: 'Inspect and understand structured data.',
  },
  {
    slug: 'text-toolkit',
    name: 'Text Toolkit',
    category: 'Text',
    status: 'Coming soon',
    icon: 'Aa',
    accent: 'violet',
    description: 'Small, focused utilities for cleaning, transforming, and checking everyday text.',
    shortDescription: 'Clean and transform text in seconds.',
  },
  {
    slug: 'color-lab',
    name: 'Color Lab',
    category: 'Design',
    status: 'Coming soon',
    icon: '◌',
    accent: 'coral',
    description: 'Test palettes, check contrast, and find combinations that feel right for your interface.',
    shortDescription: 'Explore useful color combinations.',
  },
];

export const CATEGORIES = ['All', ...new Set(TOOLS.map((tool) => tool.category))];

export function getTool(slug) {
  return TOOLS.find((tool) => tool.slug === slug);
}
