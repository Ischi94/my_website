# Website overhaul — review copy

The redesign follows the supplied recommendation: a clear scientific identity, research programme and evidence of contributions, with teaching and collaboration more prominent. It remains an English-first blogdown/Hugo site hosted through the existing Netlify configuration. No live deployment or original-folder edit has been performed.

## Design and editorial decisions

| Before | Review version | Reason |
| --- | --- | --- |
| Postdoctoral analytical palaeontology introduction | Quantitative biodiversity science across space and deep time | Connects Earth science, geography, ecology and palaeobiology in one research identity |
| Long mixed homepage | Research themes, four selected papers, teaching and contact | Makes the scientific programme visible quickly |
| Nine publications ending in 2024 | Twenty verified journal articles through 2026 | Reconciled with the user's complete Scholar profile, ORCID and publisher metadata |
| Percentage skill bars | Methods discussed through research contributions | Demonstrates expertise through evidence |
| Prominent old posts | Tutorials retained under Resources | Preserves useful teaching material without presenting it as current research news |
| CV and empty in-review heading | Removed from deployed content; CV redirects to About | Avoids outdated or inconsistent public biographies |
| Zurich/Erlangen biography and contact | Passau affiliation and contact | Based on the current university profile |
| Long awards list | Two substantiated distinctions | Avoids overstating uncertain descriptions or minor distinctions |
| Legacy Academia dependency | Small local Hugo layouts, responsive CSS, local fonts, compressed portrait | Keeps Hugo/blogdown while reducing front-end dependencies and making edits explicit |

The colour scheme uses deep green, white and pale green, with serif headings and readable body text. Your existing portrait is retained. No unrelated stock imagery or invented research graphics were added.

## Evidence and content boundaries

See [the reconciliation record](research-sources/RECONCILIATION.md) for sources, date decisions and all non-journal Scholar entries excluded from the bibliography. A correction is linked with its original article. The site does not claim a professorship, current research group, unverified grants or supervision counts. The research direction and teaching philosophy are proposed wording for your review.

Previous text remains recoverable in `archive/` and the Git snapshot. The previous theme remains in the repository but is no longer used to render the site.

## Verification

- Production and Netlify-style preview builds pass with the same pinned Hugo version.
- Internal page links, anchors and asset references pass; details are in `reports/link-check.json`.
- Publication DOIs are unique and every publication has a detail page and author attribution.
- Original sitemap routes are tested against generated pages and redirects.
- Preview indexing restrictions and production canonical URLs are checked separately.
- Browser checks cover desktop/homepage portrait loading, narrow mobile layouts, the full 20-paper list, navigation, the email link and rendered mathematics in an archived tutorial. No browser console errors appeared in the checked pages.
- External-link results are recorded in `reports/external-links.json`. Some journal sites reject automated requests even though the DOIs are registered and publisher metadata was retrieved. Four old tutorial references remain unavailable: Colortheft, the old Cédric Scherer 2019 roundup and Jeffrey Girard's chapter 2 and 5 pages. Their original citations are retained rather than silently replaced with unrelated material.
- Historical R analyses were not rerun: blogdown is not installed in the available R environment. The deployment builds successfully from the existing rendered HTML, as before.
- Netlify redirects are prepared and checked as configuration; their HTTP behaviour must be verified on a Netlify deploy preview. No Netlify account or live deployment was changed.

## Reviewing and deploying

Review the screenshots in `reports/`, the Markdown content and the supplied diff. `README.md` explains the editing workflow and local preview command. Transfer the reviewed changes to the original repository without replacing its `.git` folder, then use a Netlify deploy preview before publishing. The original folder remains `D:\Zurich\private\my_website`; this working copy is in the chat workspace.
