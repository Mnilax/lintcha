#!/usr/bin/env node
// lintcha library build (LINTCHA_08 section 3). Reads roles/**, validates front matter against tools/role-schema.json,
// rejects duplicate and reserved slugs, lints every body with site/rules.js (imported, never copied), applies the
// publication gate (publish when no rule classifies as miss under site/verdict.js, the check page's own mapping), renders
// the catalog and one page per role in every language the site has into the served tree (library/**, <lang>/library/**),
// copies each body to <slug>.md next to its page, writes <served>/library-numbers.json and build/library-report.json.
// site/numbers.json is never touched. Run after site/tools/build.js, which writes the served tree.
//   node tools/build-library.mjs             full run; any validation or gate failure aborts before anything is written
//   node tools/build-library.mjs --check     validate + lint + gate, write nothing
//   node tools/build-library.mjs --preview   render into build/preview/ even when the gate fails, for template work only;
//                                            never writes site/**, never used for the site
// Deterministic: roles sorted by category then slug with a plain code-point comparison; no timestamps, no random ids.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseRole, validate, lint, gate, bodyHash, table, Rules, schema, classify } from "./lint-role.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const SITE = path.join(ROOT, "site");
const ROLES = path.join(ROOT, "roles");
const REPORT = path.join(ROOT, "build", "library-report.json");
const check = process.argv.includes("--check");
const preview = process.argv.includes("--preview");
// the served tree: site/dist in this working tree (site/tools/build.js writes it); site/ in the deployed repository
// (wrangler.toml: [assets] directory = "./site"). Pass --served <dir> to name it.
const servedArg = (() => { const i = process.argv.indexOf("--served"); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : "site/dist"; })();
const SERVED = path.resolve(ROOT, servedArg);
const OUT_ROOT = preview ? path.join(ROOT, "build", "preview") : SERVED;
const NUMBERS_OUT = path.join(OUT_ROOT, "library-numbers.json");
// roles/, tools/ and build/ are repository-root directories and are never served
for (const d of ["roles", "tools", "build"]) {
  const p = path.join(ROOT, d);
  if (p === SERVED || p.startsWith(SERVED + path.sep)) abort(`${d}/ resolves inside the served directory ${SERVED}`);
}

function abort(msg) { console.error("build-library: ABORT: " + msg); process.exit(1); }
const byCodePoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escText = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------------------------------------------------------------- roles
function listRoles() {
  const files = [];
  for (const origin of ["house", "community"]) {
    const dir = path.join(ROLES, origin);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).sort(byCodePoint)) if (f.endsWith(".md")) files.push(path.join(dir, f));
  }
  return files;
}
const files = listRoles();
if (!files.length) abort("no role files under roles/house or roles/community");
const roles = [];
const seen = new Map();
for (const file of files) {
  const role = parseRole(file);
  const errors = validate(role);
  if (errors.length) abort(errors.join("\n  "));
  if (seen.has(role.fm.slug)) abort(`${file}: duplicate slug ${role.fm.slug}, already used by ${seen.get(role.fm.slug)}`);
  seen.set(role.fm.slug, file);
  const l = lint(role);
  roles.push({ file, fm: role.fm, body: role.body, verdicts: l.verdicts, words: l.word_count, has_schedule: l.has_schedule, failures: gate(role, l.verdicts) });
}
roles.sort((a, b) => byCodePoint(a.fm.category, b.fm.category) || byCodePoint(a.fm.slug, b.fm.slug));
for (const r of roles) console.log(table({ file: r.file, slug: r.fm.slug, origin: r.fm.origin, ok: !r.failures.length, errors: [], words: r.words, has_schedule: r.has_schedule, verdicts: r.verdicts, gate_failures: r.failures }) + "\n");
const rejected = roles.filter(r => r.failures.length);
const SIX = schema.publication_gate.six, VOCAB = schema.publication_gate.render_vocabulary;
// counts only; nothing is summed per role, and no page says "six of six"
const counts = {
  roles_total: roles.length,
  roles_house: roles.filter(r => r.fm.origin === "house").length,
  roles_community: roles.filter(r => r.fm.origin === "community").length,
  categories: [...new Set(roles.map(r => r.fm.category))].sort(byCodePoint).length
};
if (rejected.length && !preview) abort(rejected.map(r => `${path.relative(ROOT, r.file)} (${r.fm.origin}) fails the publication gate on ${r.failures.map(f => `${f.rule} ${f.name} = ${f.value}`).join(", ")}`).join("\n  "));
if (check) { console.log("check only: " + JSON.stringify(counts)); process.exit(rejected.length ? 1 : 0); }
if (rejected.length) console.log("preview: " + rejected.length + " role(s) fail the gate and would abort a real build; rendering into build/preview/ anyway");

// ---------------------------------------------------------------- i18n (chrome only; bodies are content and are never keyed)
const LANGS = ["en"].concat(fs.readdirSync(path.join(SITE, "i18n")).filter(f => /^[a-z][a-z]\.json$/.test(f)).map(f => f.replace(".json", "")).filter(l => l !== "en").sort(byCodePoint));
const i18n = {}; LANGS.forEach(l => { i18n[l] = JSON.parse(fs.readFileSync(path.join(SITE, "i18n", l + ".json"), "utf8")); });
function t(lang, key, vars) {
  const s = i18n[lang][key];
  if (typeof s !== "string") abort(`missing i18n key [${lang}] ${key}`);
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;
}
// rule names come from rules.js by id and are mapped to translated labels; a missing label is a build failure, never a fallback
for (const id of SIX) for (const lang of LANGS) if (typeof i18n[lang]["library.rule." + id] !== "string") abort(`rule ${id} (${Rules.RULE_NAMES[id]}) has no label in i18n/${lang}.json (library.rule.${id})`);
for (const v of Object.values(VOCAB)) for (const lang of LANGS) if (typeof i18n[lang]["library.verdict." + v] !== "string") abort(`verdict word ${v} has no label in i18n/${lang}.json`);
for (const id of SIX) for (const lang of LANGS) if (["R1", "R2", "R3", "R8"].includes(id) && typeof i18n[lang]["rules." + id + ".pass_unclear"] !== "string") abort(`rules.${id}.pass_unclear missing in i18n/${lang}.json`);
const siteNumbers = JSON.parse(fs.readFileSync(path.join(SITE, "numbers.json"), "utf8"));
const rulesTotal = Object.keys(siteNumbers.rules).length;   // the one figure the shared footer needs, from numbers.json

// ---------------------------------------------------------------- rendering
const read = p => fs.readFileSync(path.join(here, "templates", p), "utf8");
const TPL = { index: read("library-index.html"), role: read("library-role.html") };
// the inline theme script must be byte-identical to the one in site/templates/index.html: site/_headers carries its sha256
{ const inline = h => (/<script>([\s\S]*?)<\/script>/.exec(h) || [])[1];
  const ref = inline(fs.readFileSync(path.join(SITE, "templates", "index.html"), "utf8"));
  for (const k of Object.keys(TPL)) if (inline(TPL[k]) !== ref) abort(`templates/library-${k}.html: inline theme script differs from site/templates/index.html (CSP hash)`); }
const langRoot = lang => (lang === "en" ? "" : lang + "/");
function tokens(lang, depth, extra) {
  // depth = how many directories the page sits below /library/ (catalog 0, role page 1); root = path back to the site root:
  // /library/ is one level down, /<lang>/library/ two, a role page one more
  const up = "../".repeat(depth + 1 + (lang === "en" ? 0 : 1));
  const tok = {
    lang, root: up, rel_index: up || "./", rel_method: up + "method.html",
    catalog: depth === 0 ? "./" : "../",
    i18n_json: JSON.stringify({ lang, strings: i18n[lang], fallback: lang === "en" ? null : i18n.en }).replace(/<\//g, "<\\/"),
    footer_rules: escText(t(lang, "footer.rules", { rules: rulesTotal }))
  };
  LANGS.forEach(L => { tok["rel_" + L] = (L === lang) ? "" : up + langRoot(L) + "library/" + (extra && extra.slug ? extra.slug + "/" : ""); });
  return Object.assign(tok, extra || {});
}
function fill(tpl, lang, tok) {
  let html = tpl.replace(/\{\{t:([\w.]+)\}\}/g, (m, key) => esc(t(lang, key)));
  html = html.replace(/\{\{n:(\w+)\}\}/g, (m, k) => { if (!(k in counts)) abort("unknown library number " + k); return String(counts[k]); });
  html = html.replace(/\{\{tn:([\w.]+)\}\}/g, (m, key) => escText(t(lang, key, counts)));
  // data-i18n-attr="attr:key;..." expands to real attributes at build time, as site/tools/build.js does for the other pages
  html = html.replace(/data-i18n-attr="([^"]+)"/g, (m, spec) => spec.split(";").map(pair => { const [attr, key] = pair.split(":"); return attr.trim() + '="' + esc(t(lang, key.trim())) + '"'; }).join(" ") + " " + m);
  return html.replace(/\{\{(\w+)\}\}/g, (m, k) => { if (!(k in tok)) abort("unknown token " + k); return tok[k]; });
}
const vocab = v => VOCAB[v];
function pip(lang, id, value) {
  const word = vocab(value);
  return `<span class="pip pip-${word}" data-rule="${id}"><span class="sr">${escText(t(lang, "library.rule." + id))}: ${escText(t(lang, "library.verdict." + word))}</span></span>`;
}
function card(lang, r) {
  const chips = ["category", "surface", "origin"].map(k => `<span class="chip" data-chip="${k}">${escText(t(lang, "library." + k + "." + r.fm[k]))}</span>`).join("");
  return `<a class="card" href="${esc(r.fm.slug)}/" data-c="${esc(r.fm.category)}" data-s="${esc(r.fm.surface)}" data-o="${esc(r.fm.origin)}">
  <span class="card-title">${escText(r.fm.title)}</span>
  <span class="card-purpose">${escText(r.fm.purpose)}</span>
  <span class="chips">${chips}</span>
  <span class="pips" aria-label="${esc(t(lang, "library.card.pips"))}">${SIX.map(id => pip(lang, id, r.verdicts[id].value)).join("")}</span>
</a>`;
}
function filterRow(lang) {
  const groups = [["c", "category", schema.properties.category.enum], ["s", "surface", schema.properties.surface.enum], ["o", "origin", schema.properties.origin.enum]];
  return groups.map(([key, name, values]) => `<div class="filter-group" role="group" aria-label="${esc(t(lang, "library.filter." + name))}">
    <span class="filter-label">${escText(t(lang, "library.filter." + name))}</span>
    <button type="button" data-f="${key}" data-v="" aria-pressed="true">${escText(t(lang, "library.filter.all"))}</button>
    ${values.map(v => `<button type="button" data-f="${key}" data-v="${esc(v)}" aria-pressed="false">${escText(t(lang, "library." + name + "." + v))}</button>`).join("\n    ")}
  </div>`).join("\n  ");
}
// a fixed subset of markdown: # and ## headings, paragraphs, - lists. Nothing else is interpreted; the body is text.
function bodyHtml(body, title) {
  const blocks = body.trim().split(/\n{2,}/);
  const out = [];
  for (const b of blocks) {
    let lines = b.split("\n");
    // a heading line opens a block whether or not a blank line follows it (the reference role puts the text right under it)
    while (lines.length && /^#{1,2} /.test(lines[0])) {
      const h = lines.shift();
      if (/^# /.test(h)) { if (h.slice(2).trim() !== title) out.push(`<h2>${escText(h.slice(2))}</h2>`); }
      else out.push(`<h3>${escText(h.slice(3))}</h3>`);
    }
    if (!lines.length) continue;
    if (lines.every(l => /^- /.test(l))) { out.push("<ul>" + lines.map(l => `<li>${escText(l.slice(2))}</li>`).join("") + "</ul>"); continue; }
    out.push(`<p>${escText(lines.join(" "))}</p>`);
  }
  return out.join("\n");
}
// a silent rule says what the check page says about it (rules.<id>.pass_unclear); a violated rule shows the engine's first
// evidence span, or the check page's own line for that rule when the engine returned no span
function scorecard(lang, r) {
  return SIX.map(id => {
    const v = r.verdicts[id], word = vocab(v.value);
    let line = "";
    if (word === "silent") line = `<span class="score-line">${escText(t(lang, "rules." + id + ".pass_unclear"))}</span>`;
    else if (word === "violated") line = `<span class="score-line">${escText(v.evidence.length ? v.evidence[0].span : t(lang, "rules." + id + ".why"))}</span>`;
    return `<li class="score score-${word}" data-rule="${id}">${pip(lang, id, v.value)}<span class="score-name">${escText(t(lang, "library.rule." + id))}</span><span class="score-verdict">${escText(t(lang, "library.verdict." + word))}</span>${line}</li>`;
  }).join("\n");
}
function renderIndex(lang) {
  const tok = tokens(lang, 0, { cards: roles.map(r => card(lang, r)).join("\n"), filters: filterRow(lang) });
  return fill(TPL.index, lang, tok);
}
function renderRole(lang, r) {
  const author = r.fm.author_url ? `<a href="${esc(r.fm.author_url)}" rel="noopener">${escText(r.fm.author)}</a>` : escText(r.fm.author);
  const tok = tokens(lang, 1, { slug: r.fm.slug, title: escText(r.fm.title), purpose: escText(r.fm.purpose), author, license: escText(r.fm.license),
    version: String(r.fm.version), updated: escText(r.fm.updated), scorecard: scorecard(lang, r), body_html: bodyHtml(r.body, r.fm.title), body_raw: escText(r.body),
    raw_href: (lang === "en" ? "" : "../../../library/" + r.fm.slug + "/") + r.fm.slug + ".md",
    category: escText(t(lang, "library.category." + r.fm.category)), surface: escText(t(lang, "library.surface." + r.fm.surface)), origin: escText(t(lang, "library.origin." + r.fm.origin)) });
  return fill(TPL.role, lang, tok);
}

// ---------------------------------------------------------------- write
function clean(dir) { if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true }); }
// app.js reads CharterVerdict at load, so every rendered page must load verdict.js before app.js
function assertVerdictBeforeApp(file, html) {
  const app = html.search(/<script src="[^"]*app\.js"><\/script>/), verdict = html.search(/<script src="[^"]*verdict\.js"><\/script>/);
  if (app >= 0 && (verdict < 0 || verdict > app)) abort(`${path.relative(ROOT, file)} loads app.js without verdict.js before it`);
}
const outDirs = LANGS.map(lang => path.join(OUT_ROOT, langRoot(lang), "library"));
outDirs.forEach(clean);
for (const lang of LANGS) {
  const dir = path.join(OUT_ROOT, langRoot(lang), "library");
  fs.mkdirSync(dir, { recursive: true });
  { const html = renderIndex(lang); assertVerdictBeforeApp(path.join(dir, "index.html"), html); fs.writeFileSync(path.join(dir, "index.html"), html); }
  for (const r of roles) {
    const rd = path.join(dir, r.fm.slug);
    fs.mkdirSync(rd, { recursive: true });
    { const html = renderRole(lang, r); assertVerdictBeforeApp(path.join(rd, "index.html"), html); fs.writeFileSync(path.join(rd, "index.html"), html); }
    if (lang === "en") fs.writeFileSync(path.join(rd, r.fm.slug + ".md"), r.body);
  }
}
fs.writeFileSync(NUMBERS_OUT, JSON.stringify(counts, null, 2) + "\n");
const report = {
  engine: "site/rules.js",
  verdict: "site/verdict.js",
  publish_rule: schema.publication_gate.publish_rule,
  six_rules: SIX.map(id => ({ id, name: Rules.RULE_NAMES[id] })),
  counts,
  roles: roles.map(r => ({
    slug: r.fm.slug, origin: r.fm.origin, category: r.fm.category, surface: r.fm.surface, version: r.fm.version,
    body_sha256: bodyHash(r.body), words: r.words, has_schedule: r.has_schedule,
    verdicts: Object.fromEntries(Object.keys(r.verdicts).sort(byCodePoint).map(id => [id, r.verdicts[id].value])),
    check_page: Object.fromEntries(Object.keys(r.verdicts).sort(byCodePoint).map(id => [id, classify(id, r.verdicts[id])]))
  }))
};
fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(preview ? path.join(OUT_ROOT, "library-report.json") : REPORT, JSON.stringify(report, null, 2) + "\n");
console.log(`${preview ? "preview" : "built"} ${path.relative(ROOT, OUT_ROOT)}: ${roles.length} roles x ${LANGS.length} languages; ${JSON.stringify(counts)}`);
