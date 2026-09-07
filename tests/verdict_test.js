// Shared verdict test: site/verdict.js classify() is the one mapping from engine values to what the check page shows,
// and the library build uses it. This test pins the mapping against the engine's values for every role under roles/**,
// and checks that app.js has no mapping of its own, so an edit to either side is caught.
//   node tests/verdict_test.js
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const R = require(path.join(ROOT, "site", "rules.js"));
const V = require(path.join(ROOT, "site", "verdict.js"));

// the mapping as the check page documents it: R4, R5 need true; R1, R2, R3, R8 miss only on false; R6 never misses; R7 misses on true
const EXPECTED = {
  R4: { true: "pass", false: "miss", unclear: "miss" },
  R5: { true: "pass", false: "miss", unclear: "miss" },
  R1: { true: "pass", false: "miss", unclear: "note" },
  R2: { true: "pass", false: "miss", unclear: "note" },
  R3: { true: "pass", false: "miss", unclear: "note" },
  R8: { true: "pass", false: "miss", unclear: "note" },
  R6: { true: "note", false: "pass", unclear: "note" },
  R7: { true: "miss", false: "pass", unclear: "miss" }
};
let failures = 0, checks = 0;
const fail = m => { failures++; console.error("FAIL " + m); };

// 1. the table itself, every value
for (const id of Object.keys(EXPECTED)) for (const v of ["true", "false", "unclear"]) {
  checks++;
  const got = V.classify(id, { value: v });
  if (got !== EXPECTED[id][v]) fail(`${id} ${v}: verdict.js says ${got}, the check page's table says ${EXPECTED[id][v]}`);
}
// 2. every role under roles/**: engine values through classify() equal the table
const files = [];
for (const origin of ["house", "community"]) {
  const dir = path.join(ROOT, "roles", origin);
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir).sort()) if (f.endsWith(".md")) files.push(path.join(dir, f));
}
for (const file of files) {
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const body = raw.split(/^---\n/m)[2];
  const res = R.scan(body).results;
  for (const id of Object.keys(res)) {
    checks++;
    const got = V.classify(id, res[id]), want = EXPECTED[id][res[id].value];
    if (got !== want) fail(`${path.relative(ROOT, file)} ${id}=${res[id].value}: classify gives ${got}, expected ${want}`);
  }
}
// 3. app.js carries no mapping of its own and reads the shared one
const app = fs.readFileSync(path.join(ROOT, "site", "app.js"), "utf8");
checks++; if (/function classify\s*\(/.test(app)) fail("site/app.js defines its own classify()");
checks++; if (!/CharterVerdict\.classify/.test(app)) fail("site/app.js does not use CharterVerdict.classify");
// 4. the library build imports it rather than reimplementing it
const lint = fs.readFileSync(path.join(ROOT, "tools", "lint-role.mjs"), "utf8");
checks++; if (!/verdict\.js/.test(lint)) fail("tools/lint-role.mjs does not import site/verdict.js");
checks++; if (/=== "miss"\s*:|\? "pass" : "miss"/.test(lint)) fail("tools/lint-role.mjs carries its own value-to-verdict mapping");
console.log(`verdict test: ${checks} checks over ${files.length} roles, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
