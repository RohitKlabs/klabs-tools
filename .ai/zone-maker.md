# Zone Maker

## Page structure

The editor is mounted by <zone-app> at /tools/zone-maker/app.

Desktop layout:

- canvas/stage on the left;
- controls and dataset actions on the right;
- right rail scrolls independently;
- viewport remains fixed without page scrolling.

Mobile layout:

- canvas first;
- controls below the canvas;
- document scrolling is restored for the stacked layout.

## Components

| Element | File | Responsibility |
| --- | --- | --- |
| zone-app | src/components/zone-app.js | Composition, store wiring, top-level actions |
| zone-stage | src/components/zone-stage.js | Canvas drawing, pan, wheel zoom, pinch zoom |
| zone-controls | src/components/zone-controls.js | Live boundary controls and stats |
| point-import | src/components/point-import.js | Import dialog and parser integration |
| zone-preset | src/components/zone-preset.js | Preset selection and point count |
| zone-export | src/components/zone-export.js | Export settings and generated output |

## Store state

The persisted editable state includes shape and point count, concavity and length threshold, convex-only and comparison toggles, point data and theme, and export format plus export metadata.

The store derives the active hull, convex comparison hull, area, and export text. Changes to range controls are emitted immediately for UI feedback and recomputed after a short debounce.

## Canvas view model

~~~js
ZOOM_CONFIG = {
  min: 0.5,
  max: 3,
  step: 0.25,
  default: 1,
}
~~~

Supported gestures:

- header plus/minus/reset buttons;
- mouse wheel zoom around the cursor;
- primary mouse drag for x/y pan;
- one-finger touch pan;
- two-finger pinch zoom with midpoint movement;
- no rotation gesture.

Pan and zoom are view-only. They must not alter source points, hull calculations, or exported coordinates.

## Geometry and export modules

- src/lib/shapes.js generates example point fields.
- src/lib/parser.js accepts JSON pairs, coordinate rows, and x/y tables.
- src/lib/geometry.js calculates convex/concave hulls, area, and canvas fitting.
- src/lib/export.js converts the hull into text or semicolon-delimited CSV-like output.

## Editor changes checklist

When changing the editor, check the desktop fixed viewport, right-rail scrolling, mobile stacking, keyboard focus, pointer capture cleanup, pinch behavior, local-storage restore, and export synchronization.
