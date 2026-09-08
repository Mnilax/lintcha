// lintcha static build. Node standard library only.
//   node tools/build.js [--out dist] [--origin https://your.host]
// Emits /index.html, /method.html and /<lang>/... for every i18n/<lang>.json (en, es, pt) from templates/ + i18n/ + numbers.json + data/,
// copies rules.js, gate.js, numbers.json, app.js, ui-controls.js, style.css, method.css, fonts/, the png icons and og.png (if present),
// i18n/*.json untouched, and writes robots.txt and sitemap.xml.
// Without --origin, og:url, hreflang and sitemap fall back to root-relative paths and the build says so.
"use strict";
const fs = require("fs");
const path = require("path");
const site = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : dflt; };
const OUT = path.resolve(site, opt("--out", "dist"));
const ORIGIN = (opt("--origin", "") || "").replace(/\/$/, "");
const read = p => fs.readFileSync(path.join(site, p), "utf8");
const exists = p => fs.existsSync(path.join(site, p));
// one language = one i18n/<code>.json; english first, the rest sorted. adding a language is one json file plus one
// <a> in the switcher and one hreflang link in the templates, which carry the language codes as data.
const LANGS = ["en"].concat(fs.readdirSync(path.join(site, "i18n")).filter(f => /^[a-z][a-z]\.json$/.test(f)).map(f => f.replace(".json", "")).filter(l => l !== "en").sort());
const OG_LOCALE = { en: "en_US", es: "es_419", pt: "pt_BR" };
const PAGES = [{ tpl: "index.html", file: "index.html" }, { tpl: "method.html", file: "method.html" }];
// canonical, hreflang, og:url and the sitemap name the served path: the host serves method.html at /method
const pagePath = (page, lang) => (lang === "en" ? "/" : "/" + lang + "/") + (page.file === "index.html" ? "" : page.file.replace(/\.html$/, ""));
// relative link from the page being rendered (lang) to the same page in language L
function relLink(page, lang, L) {
  const prefix = L === "en" ? (lang === "en" ? "" : "../") : (lang === "en" ? L + "/" : lang === L ? "" : "../" + L + "/");
  return page.file === "index.html" ? (prefix === "" ? "./" : prefix) : prefix + page.file;
}
const i18n = {}; LANGS.forEach(l => { i18n[l] = JSON.parse(read("i18n/" + l + ".json")); });
const numbers = JSON.parse(read("numbers.json"));
const sources = JSON.parse(read("data/sources.json"));
let rescan = exists("data/r7_rescan.json") ? JSON.parse(read("data/r7_rescan.json")) : null;
const N = numbers.corpus.final_n;
const DATE = numbers.snapshot_date;
const notes = [];
// the rescan file is a data export, not numbers.json; if its charter count disagrees with numbers.json it is
// stale for this corpus and its paragraph is dropped rather than shown with the wrong denominator
if (rescan && rescan.charters !== N) { notes.push("data/r7_rescan.json counts " + rescan.charters + " charters but numbers.json has " + N + ": the R7 rescan paragraph is omitted until python -m audit.r7_rescan and python -m audit.site_build are re-run"); rescan = null; }

function t(lang, key, vars) {
  const s = i18n[lang][key];
  if (typeof s !== "string") throw new Error("missing i18n key [" + lang + "] " + key);
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;
}
const share = (lang, x) => new Intl.NumberFormat(lang, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(x);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escText = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// variables that data-i18n-vars may reference. Everything comes from numbers.json; nothing is typed.
// app.js computes the same set at runtime from the inlined subset, so keep the two in step.
function ruleKey(name) { return name.split("_")[0]; }
// canonical rule order on every page: boundary, finished, approval, memory, quiet, input, then tools, then secrets
const CANON = ["R4", "R5", "R1", "R2", "R3", "R8", "R6", "R7"];
const canon = names => names.slice().sort((x, y) => CANON.indexOf(ruleKey(x)) - CANON.indexOf(ruleKey(y)));
function pageVars(lang) {
  const ex_ = k => (numbers.extras && numbers.extras.expansion && k in numbers.extras.expansion) ? numbers.extras.expansion[k] : null;
  const rules = numbers.rules;
  const names = canon(Object.keys(rules));
  const label = r => t(lang, "rules." + r + ".name");
  const r8 = rules.R8_injection_resistance, r7 = rules.R7_visible_secret, r1 = rules.R1_approval_gate, r6 = rules.R6_undisclosed_capability;
  const sampleN = numbers.extras && numbers.extras.sample_design ? numbers.extras.sample_design.sample_size : "";
  return {
    date: DATE, n: N, repos: numbers.corpus.repos_in_strict_corpus, cap: numbers.corpus.length_cap_words,
    full: numbers.corpus_full_robustness.final_n, labels: names.length * N, rules: names.length,
    excluded: (numbers.corpus.excluded_repos || []).length, sample_n: sampleN,
    count: r7.stage_a_strict_counts.true,
    silent: r8.stage_a_strict_counts.unclear, exposed: r8.stage_a_strict_counts.false,
    exposed_sample: r8.hand_label_sample_counts ? r8.hand_label_sample_counts.false : "",
    fam: numbers.density.thresholds["0.5"].largest_cluster_size,
    repo_share: share(lang, Math.max(...Object.values(numbers.corpus.per_repo_final_n)) / N),
    recall: share(lang, r1.recall_on_true), precision: share(lang, r6.precision_on_true),
    failed_rules: names.filter(k => rules[k].publication_row === 4).map(k => label(ruleKey(k))).join(", "),
    repos_read: ex_("repos_read"), harvested: ex_("harvested"), harvest_excluded: ex_("harvest_excluded"), harvest_failed: ex_("harvest_failed"), harvest_fetched: ex_("harvest_fetched"),
    frame: t(lang, numbers.extras && numbers.extras.sampling_frame === "code search" ? "method.corpus.frame_search" : "method.corpus.frame_curated"),
    row4_rules: names.filter(k => rules[k].publication_row === 4).map(k => label(ruleKey(k))).join(", "),
    // {method}: the method page's name; {hidden}: rules measured but not on the comparison strip (row 4 plus R7, which the strip leaves out)
    method: t(lang, "nav.method"),
    hidden: names.filter(k => rules[k].publication_row === 4 || ruleKey(k) === "R7").length,
    // {shown}: rules on the comparison block, publication rows 1 to 3 minus R7 (same filter as app.js stripRules)
    shown: names.filter(k => [1, 2, 3].indexOf(rules[k].publication_row) >= 0 && ruleKey(k) !== "R7").length,
  };
}

function fillI18n(html, lang, vars) {
  // empty elements carrying data-i18n get their text at build time; the runtime loader re-fills them idempotently
  html = html.replace(/<(\w+)([^>]*?)\sdata-i18n="([^"]+)"([^>]*)><\/\1>/g, (m, tag, pre, key, post) => {
    const vm = /data-i18n-vars="([^"]*)"/.exec(pre + post);
    const sub = {}; if (vm) vm[1].split(",").forEach(k => { sub[k.trim()] = vars[k.trim()]; });
    // data-i18n-defer lists vars that must not be prerendered: the page shows "-" until app.js fills them from numbers.json,
    // so a script failure can never show a stale figure
    const dm = /data-i18n-defer="([^"]*)"/.exec(pre + post); if (dm) dm[1].split(",").forEach(k => { sub[k.trim()] = "-"; });
    return "<" + tag + pre + ' data-i18n="' + key + '"' + post + ">" + escText(t(lang, key, vm ? sub : null)) + "</" + tag + ">";
  });
  html = html.replace(/data-i18n-attr="([^"]+)"/g, (m, spec) => {
    return spec.split(";").map(pair => { const [attr, key] = pair.split(":"); return attr.trim() + '="' + esc(t(lang, key.trim())) + '"'; }).join(" ") + " " + m;
  });
  return html;
}

// Rows are driven by numbers.json: every repository in per_repo_final_n (in corpus, with its count) plus
// excluded_repos (dropped). numbers.json carries no commit SHAs, so branch and commit are looked up by repo
// name in data/sources.json, the manifest export; a repo missing there shows "-". Discovery-only roots come
// from the export alone, since they never enter numbers.json.
function sourceRows(lang) {
  const meta = {}; sources.forEach(r => { meta[r.repo] = r; });
  const per = numbers.corpus.per_repo_final_n, ex = numbers.corpus.excluded_repos || [];
  // in-corpus repositories that yielded zero charters have no entry in per_repo_final_n; they come from the export
  const zero = sources.filter(r => r.status === "in" && !(r.repo in per) && ex.indexOf(r.repo) < 0).map(r => r.repo);
  const rows = Object.keys(per).concat(zero).sort().map(repo => ({ repo, status: "in", charters: per[repo] || 0 }))
    .concat(ex.slice().sort().map(repo => ({ repo, status: "dropped", charters: 0 })))
    .concat(sources.filter(r => r.status === "discovery" && !(r.repo in per) && ex.indexOf(r.repo) < 0).map(r => ({ repo: r.repo, status: "discovery", charters: 0 })));
  return rows.map(r => { const m = meta[r.repo] || {}; return "<tr><td>" + escText(r.repo) + "</td><td>" + escText(m.branch || "-") + "</td><td>" + escText(m.commit || "-") + "</td><td>" +
    escText(t(lang, "method.sources.status." + r.status)) + '</td><td class="num">' + r.charters + "</td></tr>"; }).join("\n");
}
const sourcesRows = sourceRows;
function ruleRows(lang) {
  const three = x => x === null || x === undefined ? "-" : share(lang, x);
  return canon(Object.keys(numbers.rules)).map(name => {
    const v = numbers.rules[name], r = name.split("_")[0];
    let rep;
    if (r === "R7") rep = rescan ? t(lang, "method.rules.reported.R7", { count: v.true, n: v.denominator, after: rescan.after.charters_with_secret_shape })
                                : t(lang, "method.rules.reported.corpus", { count: v.true, n: v.denominator, row: t(lang, "method.rules.row." + v.publication_row) });
    else if (r === "R8") rep = t(lang, "method.rules.reported.R8", { silent: v.unclear, n: v.denominator, resistant: v.true });
    else if (v.publication_row <= 3) rep = t(lang, "method.rules.reported.corpus", { count: v.true, n: v.denominator, row: t(lang, "method.rules.row." + v.publication_row) });
    else rep = t(lang, "method.rules.reported.sample", { count: v.true, n: v.denominator, lo: share(lang, v.ci95[0]), hi: share(lang, v.ci95[1]) });
    return "<tr><td>" + escText(name.replace(/_/g, " ")) + "</td><td>" + escText(t(lang, "method.rules.asks." + r)) + '</td><td class="num">' + three(v.gate_a_three_way) +
      '</td><td class="num">' + three(v.gate_b_binary_true) + '</td><td class="num">' + three(v.precision_on_true) + '</td><td class="num">' + v.publication_row + "</td><td>" + escText(rep) + "</td></tr>";
  }).join("\n");
}
function r7Detector(lang) {
  if (!rescan) return "";
  return escText(t(lang, "method.misread.r7_detector", { date: "2026-09-05", before: rescan.before.charters_with_secret_shape, after: rescan.after.charters_with_secret_shape,
                                                        n: N, emails: rescan.after.charters_with_email_address }));
}

// subset of numbers.json the check page needs when fetch is unavailable (file://); numbers.json itself is still copied as data
function numbersSubset() {
  const rules = {};
  Object.keys(numbers.rules).forEach(k => { const v = numbers.rules[k]; rules[k] = {
    publication_row: v.publication_row, true: v.true, false: v.false, unclear: v.unclear, denominator: v.denominator,
    precision_on_true: v.precision_on_true, recall_on_true: v.recall_on_true, stage_a_strict_counts: v.stage_a_strict_counts,
    hand_label_sample_counts: v.hand_label_sample_counts }; });
  return { snapshot_date: DATE,
           corpus: { final_n: N, per_repo_final_n: numbers.corpus.per_repo_final_n, excluded_repos: numbers.corpus.excluded_repos, repos_in_strict_corpus: numbers.corpus.repos_in_strict_corpus, length_cap_words: numbers.corpus.length_cap_words },
           corpus_full_robustness: { final_n: numbers.corpus_full_robustness.final_n },
           rules, density: { thresholds: { "0.5": { largest_cluster_size: numbers.density.thresholds["0.5"].largest_cluster_size } } },
           extras: { sample_design: { sample_size: numbers.extras.sample_design.sample_size }, expansion: numbers.extras.expansion || null, sampling_frame: numbers.extras.sampling_frame || null } };
}
const inlineJson = obj => JSON.stringify(obj).replace(/<\//g, "<\\/");

function abs(p) { return ORIGIN ? ORIGIN + p : p; }
function render(page, lang) {
  const root = lang === "en" ? "" : "../";
  const here = pagePath(page, lang);
  const vars = pageVars(lang);
  const tokens = {
    lang, root, url: abs(here),
    rel_method: "method.html", rel_index: "./", rel_library: "library/",
    og_image: abs("/og.png"), og_locale: OG_LOCALE[lang] || lang,
    i18n_json: inlineJson({ lang, strings: i18n[lang], fallback: lang === "en" ? null : i18n.en }),
    numbers_json: inlineJson(numbersSubset()),
  };
  // per-language tokens: alt_<code> (absolute alternate url) and rel_<code> (relative link from this page)
  LANGS.forEach(L => { tokens["alt_" + L] = abs(pagePath(page, L)); tokens["rel_" + L] = relLink(page, lang, L); });
  let html = read("templates/" + page.tpl);
  html = html.replace(/\{\{t:([\w.]+)\}\}/g, (m, key) => esc(t(lang, key)));
  html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => { if (!(k in tokens)) throw new Error("unknown token " + k); return tokens[k]; });
  html = fillI18n(html, lang, vars);
  html = html.replace('<tbody data-build="sources"></tbody>', '<tbody data-build="sources">\n' + sourcesRows(lang) + "\n</tbody>");
  html = html.replace('<tbody data-build="rules"></tbody>', '<tbody data-build="rules">\n' + ruleRows(lang) + "\n</tbody>");
  html = html.replace('<p data-build="r7_detector"></p>', rescan ? '<p data-build="r7_detector">' + r7Detector(lang) + "</p>" : "");
  if (!(numbers.extras && numbers.extras.expansion)) html = html.replace(/<p data-i18n="method\.corpus\.p4"[^>]*>[^<]*<\/p>\r?\n?/, "");
  return html;
}

function copy(rel, dest) {
  const src = path.join(site, rel); const dst = path.join(OUT, dest || rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst);
}

// clean the output folder; on Windows a directory held open by a server or explorer refuses rmdir, so fall back
// to deleting files one by one and leave the empty directories in place
function clean(dir) {
  if (!fs.existsSync(dir)) return;
  try { fs.rmSync(dir, { recursive: true, force: true }); return; } catch (e) { /* fall through */ }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) clean(p); else fs.rmSync(p, { force: true });
  }
}
// no mock figures in the templates: every count on the page comes from numbers.json, so the template source may not
// contain a bare integer of three or more digits outside attribute values (dates, sizes and viewBoxes live in attributes)
for (const page of PAGES) {
  const src = read("templates/" + page.tpl).replace(/<[^>]*>/g, " ").replace(/\{\{[^}]*\}\}/g, " ");
  const m = src.match(/\b\d{3,}\b/);
  if (m) throw new Error("templates/" + page.tpl + " carries a literal figure in text: " + m[0]);
}
clean(OUT);
LANGS.filter(l => l !== "en").forEach(l => fs.mkdirSync(path.join(OUT, l), { recursive: true }));
for (const page of PAGES) for (const lang of LANGS) {
  const out = path.join(OUT, lang === "en" ? page.file : path.join(lang, page.file));
  fs.writeFileSync(out, render(page, lang));
}
// app.js reads CharterVerdict at load (verdict.js), so a page that loads app.js without verdict.js before it throws on
// every visit; the build refuses to emit one
function assertVerdictBeforeApp(file) {
  const html = fs.readFileSync(file, "utf8");
  const app = html.search(/<script src="[^"]*app\.js"><\/script>/), verdict = html.search(/<script src="[^"]*verdict\.js"><\/script>/);
  if (app >= 0 && (verdict < 0 || verdict > app)) throw new Error(path.relative(site, file) + " loads app.js without verdict.js before it");
}
for (const page of PAGES) for (const lang of LANGS) assertVerdictBeforeApp(path.join(OUT, lang === "en" ? page.file : path.join(lang, page.file)));
["rules.js", "gate.js", "verdict.js", "job.js", "numbers.json", "app.js", "ui-controls.js", "style.css", "method.css", "library.js", "library.css"].forEach(f => copy(f));
// the library (LINTCHA_08) is rendered by tools/build-library.mjs straight into the served tree (this OUT) after this pass:
// library/**, <lang>/library/** and library-numbers.json. site/numbers.json stays a byte copy of the frozen audit output.
// roles/, tools/ and build/ live at the repository root and are never served: the assertion below fails the build otherwise.
for (const d of ["roles", "tools", "build"]) {
  const p = path.resolve(site, "..", d);
  if (p === OUT || p.startsWith(OUT + path.sep)) throw new Error(d + "/ resolves inside the served directory " + OUT);
}
notes.push("library pages are rendered by tools/build-library.mjs into " + OUT + "; run it after this build");
// brand assets, generated outside this build: copied when present, noted when absent, never substituted
["og.png", "icon-512.png", "icon-180.png", "icon-32.png"].forEach(f => { if (exists(f)) copy(f); else notes.push(f + " is absent: referenced by the pages, generated outside this build"); });
fs.writeFileSync(path.join(OUT, "manifest.webmanifest"), JSON.stringify({ name: "lintcha", short_name: "lintcha", start_url: "/", display: "browser", background_color: "#EFEAE0", theme_color: "#EFEAE0",
  icons: [{ src: "/icon-512.png", sizes: "512x512", type: "image/png" }, { src: "/icon-180.png", sizes: "180x180", type: "image/png" }, { src: "/icon-32.png", sizes: "32x32", type: "image/png" }] }, null, 1) + "\n");
fs.readdirSync(path.join(site, "fonts")).forEach(f => copy("fonts/" + f));
LANGS.forEach(l => copy("i18n/" + l + ".json"));
fs.writeFileSync(path.join(OUT, "robots.txt"), "User-agent: *\nAllow: /\n" + (ORIGIN ? "Sitemap: " + ORIGIN + "/sitemap.xml\n" : ""));
const urls = [];
// library pages, from the role sources at the repository root: the catalog and one page per role, per language
const libraryPaths = [];
const roleSlugs = [];
for (const origin of ["house", "community"]) {
  const dir = path.resolve(site, "..", "roles", origin); if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) if (f.endsWith(".md")) roleSlugs.push(f.replace(/\.md$/, ""));
}
roleSlugs.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
if (roleSlugs.length) for (const lang of LANGS) {
  const prefix = lang === "en" ? "/library/" : "/" + lang + "/library/";
  libraryPaths.push({ lang, p: prefix });
  for (const s of roleSlugs) libraryPaths.push({ lang, p: prefix + s + "/" });
}
for (const lp of libraryPaths) {
  const sib = L => lp.p.replace(/^\/(es|pt)\//, "/").replace(/^\//, L === "en" ? "/" : "/" + L + "/");
  urls.push("  <url>\n    <loc>" + esc(abs(lp.p)) + "</loc>\n" +
    LANGS.map(L => '    <xhtml:link rel="alternate" hreflang="' + L + '" href="' + esc(abs(sib(L))) + '"/>\n').join("") +
    '    <xhtml:link rel="alternate" hreflang="x-default" href="' + esc(abs(sib("en"))) + '"/>\n  </url>');
}
for (const page of PAGES) for (const lang of LANGS) {
  const loc = abs(pagePath(page, lang));
  urls.push("  <url>\n    <loc>" + esc(loc) + "</loc>\n" +
    LANGS.map(L => '    <xhtml:link rel="alternate" hreflang="' + L + '" href="' + esc(abs(pagePath(page, L))) + '"/>\n').join("") +
    '    <xhtml:link rel="alternate" hreflang="x-default" href="' + esc(abs(pagePath(page, "en"))) + '"/>\n  </url>');
}
fs.writeFileSync(path.join(OUT, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + urls.join("\n") + "\n</urlset>\n");
if (!ORIGIN) notes.push("no --origin given: og:url, hreflang and sitemap.xml carry root-relative paths. pass --origin https://your.host at deploy time so cards and alternates resolve");
// byte checks on the two files that must never change
// block 7.1: security headers for the static host. The no-flash theme script is inline and must stay first in <head>
// (CONTROLS_CONTRACT.md), so script-src carries its sha256 instead of 'unsafe-inline'. The hash is computed from the
// exact script text in the built pages, so an edit to the script cannot silently break the policy.
const crypto = require("crypto");
const inlineHashes = new Set();
const hashPages = [];
for (const page of PAGES) for (const lang of LANGS) hashPages.push(path.join(OUT, lang === "en" ? page.file : path.join(lang, page.file)));
// library pages carry the same inline script (build-library.mjs asserts it against templates/index.html), so their hash is the same
for (const file of hashPages) {
  const html = fs.readFileSync(file, "utf8");
  const re = /<script>([\s\S]*?)<\/script>/g; let m;
  while ((m = re.exec(html))) inlineHashes.add("'sha256-" + crypto.createHash("sha256").update(m[1], "utf8").digest("base64") + "'");
}
const csp = "default-src 'self'; script-src 'self' " + [...inlineHashes].join(" ") + "; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'; object-src 'none'";
const headers = ["/*", "  Content-Security-Policy: " + csp, "  X-Content-Type-Options: nosniff", "  Referrer-Policy: no-referrer",
  "  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()", "  Cross-Origin-Opener-Policy: same-origin", ""].join("\n");
fs.writeFileSync(path.join(site, "_headers"), headers);
fs.writeFileSync(path.join(OUT, "_headers"), headers);
for (const f of ["rules.js", "numbers.json"]) {
  if (!fs.readFileSync(path.join(site, f)).equals(fs.readFileSync(path.join(OUT, f)))) throw new Error(f + " changed during copy");
}
console.log("built " + OUT + ": " + PAGES.length * LANGS.length + " pages, " + LANGS.length + " languages, origin " + (ORIGIN || "(none)"));
notes.forEach(n => console.log("note: " + n));
