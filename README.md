# Laymon Hair Salon — Danforth Village, Toronto

Premium single-page site for Laymon Hair Salon, 2588 Danforth Ave, Toronto.
Appointment-led cuts, colour, balayage, texture services, extensions, braids,
threading, waxing, facials, and beauty care. Open daily 11 AM – 7 PM.
Call: +1 647-347-9099

## Live site

https://loganxaaryan-a11y.github.io/laymon-hair-salon/

## Develop

```sh
npm ci
npm run dev
```

## Publish

Pushing to `main` builds and deploys automatically via
`.github/workflows/pages.yml` (GitHub Pages, GitHub Actions source).
No manual build or upload step.

## Notes

- Vite base is `./`, and image paths use `import.meta.env.BASE_URL`,
  so the site works under the `/laymon-hair-salon/` subpath (not just a
  custom domain root). The original build used absolute `/images/...`
  paths and a `/`-only router route, which both break on Pages — fixed here.
- Image credits: see `CREDITS.md` (Unsplash License).
