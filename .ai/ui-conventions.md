# UI conventions

## Visual system

The shared stylesheet is src/styles.css. It defines the dark default palette, light theme overrides, typography, borders, panels, focus styles, editor layout, public directory pages, and tool landing pages.

Existing tokens include --bg, --panel, and --panel-soft for surfaces; --border and --muted for low-emphasis structure; --ink for primary text; --accent and --accent-ink for actions; and --compare, --grid, --point, and --danger for stage semantics.

Reuse these tokens before adding a new color. Tool landing pages may use the existing accent modifier classes for mint, violet, and coral variations.

## Responsive behavior

The editor and public pages have different scroll models:

- editor desktop: html, body, and zone-app are viewport constrained;
- editor desktop: .sidebar owns vertical scrolling;
- editor mobile: page scrolling returns and the workspace stacks;
- home and landing routes: normal document scrolling is enabled through the router route data attribute.

Do not add global overflow rules without checking both route families.

## Interaction conventions

- Use buttons for actions and anchors for navigation.
- Give icon-only buttons an aria-label.
- Use visible focus outlines already defined by the stylesheet.
- Use dialog.showModal() for import, export, and preset workflows.
- Keep live values in nearby output-like elements where a slider changes them.
- Use aria-live for counts, errors, and changing zoom values where appropriate.

## Markup conventions

Page-level elements render semantic main, header, section, and footer structures. Components may use compact template strings to match the existing code style, but new repeated UI should remain data-driven and avoid duplicating tool metadata.
