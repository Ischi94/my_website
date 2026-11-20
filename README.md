# Gregor Mathes — academic website

English-first academic website built with **Hugo 0.147.9**, with R/blogdown sources retained for tutorials. Netlify publishes `public/`. The production address remains https://gregor-mathes.netlify.app/.

## Everyday editing

- `content/about.md`: biography, distinctions and contact information.
- `content/research.md`: research programme and supporting publication links.
- `content/teaching.md`: teaching and mentoring; update the semester explicitly.
- `content/resources.md` and `content/post/`: archived R/statistics tutorials.
- `layouts/index.html`: homepage structure and introduction.
- `assets/css/site.css`: responsive presentation, colours and typography.
- `assets/images/portrait.jpg`: original portrait; Hugo creates compressed WebP variants.
- `config/_default/menus.toml`: navigation.
- `config/_default/params.toml`: professional links and default description.

## Publications

`research-sources/crossref/` contains publisher-deposited metadata retrieved on 19 November 2026. `research-sources/orcid-works.json` records the ORCID discovery snapshot. Google Scholar was reviewed in the browser; see `research-sources/RECONCILIATION.md`.

Run `node scripts/update-publications.mjs` to regenerate `data/publications.json`, the BibTeX download and publication page metadata from the reviewed Crossref records. This uses no network. Existing publication paths and abstracts are preserved. The `selected` mapping near the top of that script controls the four homepage papers.

For new work, first verify the final journal version and the author's identity. Add the DOI metadata JSON to `research-sources/crossref/`, then regenerate. Do not treat every Scholar or ORCID entry as a peer-reviewed paper. Conference abstracts, thesis material, preprints and duplicate versions are excluded. The correction to GEB e13905 is attached to the original article, not counted as another research paper. Use the journal-volume year when assigned, with an earlier online year shown separately.

`scripts/fetch-bibliography.ps1` can retrieve missing DOI metadata from the saved ORCID snapshot and the additional Current Biology DOI. It does not silently refresh the approved bibliography from a changing online profile.

## Build and preview

With Hugo 0.147.9 on your PATH:

```sh
hugo --gc --minify
hugo server --disableFastRender
```

Open the local address printed by Hugo. For this review copy, a portable Hugo executable is available at `../tools/hugo/hugo.exe`.

RStudio users can install `blogdown` and use `blogdown::serve_site()`. `.Rprofile` pins the same Hugo version as Netlify. Changing an R tutorial requires its R packages and re-knitting its `.Rmd` into its accompanying `.html`; the Netlify build uses the checked-in HTML and does not run R. Both source and rendered versions were updated for the date/link repairs in this overhaul.

The current R installation did not contain blogdown. The Hugo production and preview builds were tested; R re-execution of historical tutorial analyses was not.

## Checks

```sh
hugo --gc --minify
node scripts/check-site.mjs
```

The checker follows local page links and anchors, verifies assets, checks publication uniqueness and rejects deployed CV files and obsolete homepage content. Results go to `reports/link-check.json`. Run `scripts/check-external-links.ps1` in PowerShell 7 to check external destinations; publisher bot-blocking responses are not proof that a DOI is broken.

## Netlify

Keep the existing Netlify site and Git integration. `netlify.toml` pins Hugo, builds static output, and sets preview/branch base URLs. Preview environments emit `noindex, nofollow` and disallow crawling. Production emits canonical URLs, a sitemap, social metadata and structured data. Publish only `public/`, never the repository root.

Review a Netlify deploy preview before merging or publishing. Netlify account settings and live deployment were not changed in this task. After deployment, verify the production homepage, publication bibliography, old tutorial routes, `/authors/admin/`, and `/files/cv.pdf`. The CV routes should return redirects to `/about/`; the retired files must not be present in the deployment.

## Legacy material and recovery

The former homepage widgets, author biography and CV files are retained in `archive/`, outside Hugo's content and static directories. The old Academia theme is retained but inactive; the site now uses small local Hugo templates with no theme package or JavaScript framework dependency. Historical tutorial assets and mathematical typesetting remain available.

The original sitemap is stored under `research-sources/`. Retired author and taxonomy routes redirect to useful destinations through both Hugo aliases and Netlify redirects. `scripts/preserve-routes.mjs` documents the migration; it is a one-time migration helper, not part of the build.

The review copy is a separate Git repository with an initial snapshot of the supplied files. The original `D:\Zurich\private\my_website` and its Git history were not modified. Review the supplied patch before transferring changes. Do not replace the original repository's `.git` directory with this review copy's `.git`.
