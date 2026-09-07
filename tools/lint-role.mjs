#!/usr/bin/env node
// lintcha library: thin CLI over site/rules.js for one or more role files. Used by build-library.mjs and by CI.
//   node tools/lint-role.mjs roles/house/code-reviewer.md [more files]   markdown table on stdout
//   node tools/lint-role.mjs --json <files>                               one JSON object per file, one line each
// Exit code: 0 when every file validates and clears its publication gate, 1 otherwise. The engine is imported, never
// copied or patched; this file only reads its output. No dependency, no network, no digit reaches any page from here.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const require = createRequire(import.meta.url);
export const Rules = require(path.join(ROOT, "site", "rules.js"));
export const Verdict = require(path.join(ROOT, "site", "verdict.js"));   // the check page's own mapping, shared, never reimplemented here
export const schema = JSON.parse(fs.readFileSync(path.join(here, "role-schema.json"), "utf8"));
const GATE = schema.publication_gate;

// ---------------------------------------------------------------- front matter (a fixed subset of YAML: `key: value` lines)
export function parseRole(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) return { file, errors: [`${file}: no front matter block (--- ... ---) at the top`] };
  const errors = [], fm = {}, order = [];
  for (const line of m[1].split("\n")) {
    if (!line.trim()) continue;
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (!kv) { errors.push(`${file}: front matter line not key: value: ${JSON.stringify(line)}`); continue; }
    let v = kv[2].trim();
    if (/^".*"$/.test(v) || /^'.*'$/.test(v)) v = v.slice(1, -1);          // quoted: taken verbatim, a hash inside is data
    else v = v.replace(/\s+#.*$/, "").trim();                              // unquoted: a trailing comment is stripped
    if (kv[1] in fm) errors.push(`${file}: duplicate front matter field ${kv[1]}`);
    fm[kv[1]] = v; order.push(kv[1]);
  }
  return { file, fm, order, body: m[2].replace(/^\n+/, "").replace(/\s+$/, "") + "\n", errors };
}

function isRealDate(s) {
  const [y, mo, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

export function validate(role) {
  const errors = role.errors.slice();
  if (!role.fm) return errors;
  const { fm, file } = role;
  const props = schema.properties;
  for (const k of schema.required) if (!(k in fm)) errors.push(`${file}: missing required field ${k}`);
  for (const k of Object.keys(fm)) if (!(k in props)) errors.push(`${file}: unknown field ${k}`);
  const expectOrder = schema.order.filter(k => k in fm);
  if (expectOrder.join(",") !== role.order.filter(k => k in props).join(",")) errors.push(`${file}: front matter order must be ${schema.order.join(", ")}`);
  for (const k of Object.keys(props)) {
    if (!(k in fm)) continue;
    const p = props[k], v = fm[k];
    if (p.type === "integer") {
      if (!/^\d+$/.test(v)) { errors.push(`${file}: ${k} must be an integer`); continue; }
      if (p.minimum !== undefined && Number(v) < p.minimum) errors.push(`${file}: ${k} must be at least ${p.minimum}`);
      fm[k] = Number(v);
      continue;
    }
    if (p.enum && !p.enum.includes(v)) errors.push(`${file}: ${k} must be one of ${p.enum.join(" | ")}, got ${JSON.stringify(v)}`);
    if (p.pattern && !new RegExp(p.pattern).test(v)) errors.push(`${file}: ${k} does not match ${p.pattern}`);
    if (p.minLength !== undefined && v.length < p.minLength) errors.push(`${file}: ${k} is empty`);
    if (p.maxLength !== undefined && v.length > p.maxLength) errors.push(`${file}: ${k} is longer than ${p.maxLength} characters`);
  }
  if (fm.slug && path.basename(file, ".md") !== fm.slug) errors.push(`${file}: slug ${fm.slug} does not match the file name`);
  if (fm.slug && schema.reserved_slugs.includes(fm.slug)) errors.push(`${file}: slug ${fm.slug} collides with an existing route`);
  if (fm.origin) {
    const dir = path.basename(path.dirname(file));
    if (dir !== fm.origin) errors.push(`${file}: origin ${fm.origin} but the file sits under roles/${dir}/`);
  }
  if (fm.updated && /^\d{4}-\d{2}-\d{2}$/.test(fm.updated) && !isRealDate(fm.updated)) errors.push(`${file}: updated is not a calendar date`);
  if (/<\/?[a-z][a-z0-9-]*(\s[^>]*)?>/i.test(role.body)) errors.push(`${file}: body contains HTML`);
  if (/!\[/.test(role.body)) errors.push(`${file}: body contains an image`);
  if (!role.body.trim()) errors.push(`${file}: body is empty`);
  if (role.body.trim() && schema.body_words) {
    const n = Rules.normalize(role.body).word_count;
    if (n < schema.body_words.min || n > schema.body_words.max) errors.push(`${file}: body is ${n} words by the normalizer, outside ${schema.body_words.min} to ${schema.body_words.max}`);
  }
  return errors;
}

// ---------------------------------------------------------------- engine
export function lint(role) {
  const out = Rules.scan(role.body);
  const verdicts = {};
  for (const id of Object.keys(out.results)) {
    const r = out.results[id];
    verdicts[id] = { value: r.value, evidence: (r.evidence || []).map(e => ({ span: e.span, offset: e.offset })) };
    if (r.undisclosed) verdicts[id].undisclosed = r.undisclosed;
    if (r.families) verdicts[id].families = r.families;
    if (r.address_count !== undefined) verdicts[id].address_count = r.address_count;
  }
  return { verdicts, word_count: out.normalized.word_count, has_schedule: Rules.hasSchedule(out.normalized.text) };
}
export const classify = (id, v) => Verdict.classify(id, v);
// publish when no rule classifies as miss under the check page's mapping; reject on any miss (house and community alike)
export function gate(role, verdicts) {
  const failures = [];
  for (const id of Object.keys(verdicts).sort()) if (classify(id, verdicts[id]) === "miss") failures.push({ rule: id, name: Rules.RULE_NAMES[id], value: verdicts[id].value });
  return failures;
}
export const bodyHash = (body) => crypto.createHash("sha256").update(body, "utf8").digest("hex");

export function report(file) {
  const role = parseRole(file);
  const errors = validate(role);
  if (errors.length) return { file, ok: false, errors };
  const l = lint(role);
  const failures = gate(role, l.verdicts);
  return { file, slug: role.fm.slug, origin: role.fm.origin, ok: failures.length === 0, errors: [], words: l.word_count, has_schedule: l.has_schedule,
    verdicts: l.verdicts, gate_failures: failures, version: role.fm.version, body_hash: bodyHash(role.body) };
}

export function table(rep) {
  const lines = [];
  if (!rep.ok && rep.errors.length) { lines.push(`### ${rep.file}: rejected`); rep.errors.forEach(e => lines.push(`- ${e}`)); return lines.join("\n"); }
  lines.push(`### ${rep.slug} (${rep.origin}), ${rep.words} words, ${rep.has_schedule ? "scheduled" : "on demand"}`);
  lines.push("");
  lines.push("| rule | engine value | check page verdict | in the six | evidence |");
  lines.push("|---|---|---|---|---|");
  for (const id of ["R4", "R5", "R1", "R2", "R3", "R8", "R6", "R7"]) {
    const v = rep.verdicts[id];
    const ev = v.evidence.length ? v.evidence.map(e => `"${e.span}" @${e.offset}`).join("; ") : "";
    lines.push(`| ${id} ${Rules.RULE_NAMES[id]} | ${v.value} | ${classify(id, v)} | ${GATE.six.includes(id) ? "yes" : "no"} | ${ev} |`);
  }
  lines.push("");
  lines.push(rep.gate_failures.length ? `Publication gate: REJECT, miss on ${rep.gate_failures.map(f => `${f.rule} ${f.name} = ${f.value}`).join(", ")}` : "Publication gate: publish (no rule classifies as miss)");
  return lines.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const files = args.filter(a => !a.startsWith("--"));
  if (!files.length) { console.error("usage: node tools/lint-role.mjs [--json] <role.md> [...]"); process.exit(2); }
  let bad = 0;
  for (const f of files) {
    const rep = report(f);
    if (!rep.ok) bad++;
    console.log(json ? JSON.stringify(rep) : table(rep) + "\n");
  }
  process.exit(bad ? 1 : 0);
}
