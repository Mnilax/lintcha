// Calibration of the input gate (gate.js) against the strict corpus, raw text (the browser path).
//   node tools/gate_calibrate.js ../work_v4 ../out_v4/gate_calibration.md
// Requirement: every corpus charter comes back as profile. Reports the distribution of every measure the gate uses,
// the margin between the corpus and each threshold, and lists any charter that does not come back as profile.
"use strict";
const fs = require("fs");
const path = require("path");
const G = require(path.resolve(__dirname, "..", "gate.js"));
const work = path.resolve(process.argv[2] || "../work_v4");
const outPath = path.resolve(process.argv[3] || "../out_v4/gate_calibration.md");
const jsonl = f => fs.readFileSync(f, "utf8").split("\n").filter(Boolean).map(l => JSON.parse(l));
const raws = jsonl(path.join(work, "charters_raw.jsonl"));
const meta = new Map(jsonl(path.join(work, "charters.jsonl")).map(c => [c.id, c]));
const T = G.thresholds;
const rows = raws.map(r => { const c = G.classify(r.raw); return { id: r.id, repo: (meta.get(r.id) || {}).repo, state: c.state, reasons: c.reasons, m: c.measures }; });
const q = (arr, p) => { const s = arr.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))]; };
const stat = (name, arr, fmt) => `| ${name} | ${fmt(Math.min(...arr))} | ${fmt(q(arr, 0.01))} | ${fmt(q(arr, 0.05))} | ${fmt(q(arr, 0.5))} | ${fmt(Math.max(...arr))} |`;
const f3 = x => x.toFixed(3);
const notProfile = rows.filter(r => r.state !== "profile");
const noVerb = rows.filter(r => !r.m.verb), noObject = rows.filter(r => r.m.verb && !r.m.object);
const probes = [
  "You are the reporter", "выавава",
  "You are the release watcher. Every weekday you check the deploy log and write up what broke. Post it to the engineering channel.", "xd xd fdfldfkdfkl jojo freak go go im journalist",
  "Eres el reportero. Cada día laborable lees el tablero y publicas un resumen de lo que cambió en el canal del equipo antes de las nueve. Nunca envías nada fuera del canal. Cuando una tarjeta no tiene dueño, preguntas en el hilo y esperas una respuesta. Guardas un archivo de lo que publicaste.",
  "You are the reporter. Every weekday you read the tracker and post a summary of what moved to the team channel before nine. You never send anything outside the channel. When a card has no owner, you ask in the thread and wait for an answer. You keep a file of what you posted."
];
const lines = [];
lines.push("# Input gate calibration (gate.js) against the strict corpus, raw text");
lines.push("");
lines.push(`Corpus: ${rows.length} charters from \`${path.basename(work)}/charters_raw.jsonl\`. Thresholds: words < ${T.MIN_WORDS} is thin, words < ${T.THIN_WORDS} without a work verb and an object is thin; function-word ratio < ${T.FN_RATIO_MIN} (tested from ${T.FN_RATIO_WORDS} words) is not readable; odd-token share > ${T.ODD_SHARE_MAX} (tested from ${T.ODD_MIN_TOKENS} letter tokens) is not readable; Latin share < ${T.LATIN_MAJORITY} is not readable; an object must follow the verb within ${T.OBJECT_WINDOW} tokens. Work vocabulary: ${G.verbCount} stems plus inflections.`);
lines.push("");
lines.push(`States: profile ${rows.length - notProfile.length}, too_thin ${rows.filter(r => r.state === "too_thin").length}, not_readable ${rows.filter(r => r.state === "not_readable").length}.`);
lines.push("");
lines.push("| measure | min | p1 | p5 | median | max |");
lines.push("|---|---|---|---|---|---|");
lines.push(stat("words (normalizer count)", rows.map(r => r.m.words), String));
lines.push(stat("function-word ratio", rows.map(r => r.m.fn_ratio), f3));
lines.push(stat("odd-token share", rows.map(r => r.m.odd_share), f3));
lines.push(stat("Latin share of letters", rows.map(r => r.m.latin_share), f3));
lines.push("");
lines.push(`Margins: corpus minimum function-word ratio ${f3(Math.min(...rows.map(r => r.m.fn_ratio)))} against the threshold ${T.FN_RATIO_MIN}; corpus maximum odd-token share ${f3(Math.max(...rows.map(r => r.m.odd_share)))} against ${T.ODD_SHARE_MAX}; corpus minimum Latin share ${f3(Math.min(...rows.map(r => r.m.latin_share)))} against ${T.LATIN_MAJORITY}. Charters without a work verb: ${noVerb.length}; with a verb but no object in the window: ${noObject.length}.`);
lines.push("");
lines.push("## charters that do not come back as profile");
lines.push("");
if (!notProfile.length) lines.push("None.");
else { lines.push("| id | repository | state | reasons | words | fn ratio | odd share | latin | verb |"); lines.push("|---|---|---|---|---|---|---|---|---|");
  notProfile.forEach(r => lines.push(`| ${r.id} | ${r.repo} | ${r.state} | ${r.reasons.join(", ")} | ${r.m.words} | ${f3(r.m.fn_ratio)} | ${f3(r.m.odd_share)} | ${f3(r.m.latin_share)} | ${r.m.verb || ""} |`)); }
lines.push("");
lines.push("## the five lowest function-word ratios and the five highest odd-token shares");
lines.push("");
lines.push("| id | repository | fn ratio | odd share | words |");
lines.push("|---|---|---|---|---|");
rows.slice().sort((a, b) => a.m.fn_ratio - b.m.fn_ratio).slice(0, 5).forEach(r => lines.push(`| ${r.id} | ${r.repo} | ${f3(r.m.fn_ratio)} | ${f3(r.m.odd_share)} | ${r.m.words} |`));
rows.slice().sort((a, b) => b.m.odd_share - a.m.odd_share).slice(0, 5).forEach(r => lines.push(`| ${r.id} | ${r.repo} | ${f3(r.m.fn_ratio)} | ${f3(r.m.odd_share)} | ${r.m.words} |`));
lines.push("");
lines.push("## probes (not corpus)");
lines.push("");
lines.push("| input | state | reasons | words | fn ratio | odd share | latin |");
lines.push("|---|---|---|---|---|---|---|");
probes.forEach(p => { const c = G.classify(p); lines.push(`| ${p.length > 48 ? p.slice(0, 45) + "..." : p} | ${c.state} | ${c.reasons.join(", ") || "-"} | ${c.measures.words} | ${f3(c.measures.fn_ratio)} | ${f3(c.measures.odd_share)} | ${f3(c.measures.latin_share)} |`); });
lines.push("");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join("\n") + "\n");
fs.writeFileSync(outPath.replace(/\.md$/, ".json"), JSON.stringify({ corpus: path.basename(work), n: rows.length, thresholds: T, verb_stems: G.verbCount,
  states: { profile: rows.length - notProfile.length, too_thin: rows.filter(r => r.state === "too_thin").length, not_readable: rows.filter(r => r.state === "not_readable").length },
  min_fn_ratio: Math.min(...rows.map(r => r.m.fn_ratio)), max_odd_share: Math.max(...rows.map(r => r.m.odd_share)), min_latin_share: Math.min(...rows.map(r => r.m.latin_share)),
  not_profile: notProfile }, null, 2) + "\n");
console.log(lines.slice(0, 16).join("\n"));
if (notProfile.length) { console.log("\nNOT PROFILE: " + notProfile.length); notProfile.slice(0, 40).forEach(r => console.log(r.id, r.repo, r.state, r.reasons.join(","), "words", r.m.words, "fn", f3(r.m.fn_ratio), "odd", f3(r.m.odd_share), "verb", r.m.verb)); }
process.exit(notProfile.length ? 1 : 0);
