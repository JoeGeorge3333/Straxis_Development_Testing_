# Web Demo (Wireframe Layout)

This repo includes a web demo that mirrors the iOS wireframe screen inside a phone frame.

## Run locally
From the project root:
- `python3 -m http.server 5173`

Then open:
- `http://localhost:5173/index.html`
- `http://localhost:5173/wireframe.html`

## What to click
- Toggle tasks (Nutrition / Water / Read / Progress Pic) to see points + progress bar update.
- Toggle W1 / W2 to simulate workouts adding points.
- Tap the calendar icon to see the stub (placeholder for a streak calendar modal).

## Wireframe page (recommended)
`wireframe.html` is closest to the iOS wireframe flow:
- Home screen matches the layout (day box, competing bar, matchup, tasks).
- Tap a task → log page (workouts: duration + outdoor; habits: tap to complete/uncomplete).
- History shows a small “Backend (simulated)” list of the endpoints that would be called.
