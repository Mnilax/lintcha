# lintcha

Paste the text you would put in an AI bot's profile. Get back what is already
there and the lines that are missing.

Live at https://lintcha.com

## What this repository is

The site only. Static files, no build step, no server, no dependencies.
The audit that produced the numbers lives in a separate working folder and is
not published here.

```
index.html            the check page, English
es/ pt/               the same page, Spanish and Brazilian Portuguese
method.html           corpus, sources, the publication gate, limits
rules.js              the rule engine, generated from the audit's Python code
                      and never edited by hand
numbers.json          frozen audit output, the single source of every figure
app.js                page logic
ui-controls.js        theme toggle and language select
i18n/                 en, es, pt string files, identical key sets
fonts/                Archivo and IBM Plex Mono, self-hosted
```

## Rules that hold

1. `rules.js` is generated, never edited here. Editing it breaks parity with
   the audit and every number on the page becomes a claim nothing supports.
2. No figure is typed into markup or into a string file. Every count,
   denominator and share is read from `numbers.json` at render time.
   Swapping in a newer `numbers.json` must change every number on the site
   with no edit to markup or translations.
3. Zero external requests. No CDN, no font host, no analytics, no third-party
   script. The page works with the network switched off.
4. The only browser storage is the visitor's own theme and language choice.
5. `i18n/*.json` must have identical key sets. The coverage check fails the
   build otherwise.

## Run it locally

```
python -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` straight from disk also
works: the numbers come from an inline data island, so `file://` is fine.

## Deploy

Cloudflare Pages, connected to this repository.

```
Framework preset          None
Build command             (empty)
Build output directory    /
```

Custom domains: `lintcha.com` and `www.lintcha.com`.

## Before shipping a change

```
node tests/parity.js        12768 of 12768 labels must match
node tools/i18n_check.js    all three languages, identical key sets
```
