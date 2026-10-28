# The Salon — Generic Hair Salon Demo, Toronto

Generic single-page salon site used as a portfolio demo. Appointment-led
cuts, colour, balayage, texture services, extensions, braids, threading,
waxing, facials, and beauty care. Open daily 11 AM – 7 PM.
Contact details shown on the site are placeholders (fictional 555 number,
city-level location only).

## Live site

https://loganxaaryan-a11y.github.io/laymon-hair-salon/

## Develop

```sh
npm ci
npm run dev
```

## Publish

GitHub Pages serves the `gh-pages` branch (root). To publish:

```sh
npm run build
# copy dist/ to the gh-pages branch, commit, push
```

No auto-deploy workflow is wired up; publishing is a manual build + push.

## Notes

- Vite base is `./`, and image paths use `import.meta.env.BASE_URL`,
  so the site works under the `/laymon-hair-salon/` subpath (not just a
  custom domain root). The original build used absolute `/images/...`
  paths and a `/`-only router route, which both break on Pages — fixed here.
- Image credits: see `CREDITS.md` (Unsplash License).
