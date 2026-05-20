# Tenerife Travel Itinerary

A responsive static travel itinerary website for GitHub Pages, built with plain HTML, CSS, and vanilla JavaScript.

## Files

- `index.html` - Page structure and static fallback shell.
- `style.css` - Tenerife-inspired responsive design.
- `script.js` - Dynamic rendering, accordion behavior, smooth scroll, and gallery handling.
- `data.json` - Editable trip content.

## Run Locally

Because the itinerary is loaded from `data.json`, use a local static server instead of opening `index.html` directly:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

Push these files to a GitHub repository and enable GitHub Pages from the repository settings. No build step, backend, framework, or API key is required.

## Editing The Trip

Update `data.json` to change dates, activities, images, Google Maps links, parking links, weather notes, and travel tips. The site renders everything dynamically from that file.
