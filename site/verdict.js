// lintcha verdict: the one mapping from an engine value (true, false, unclear) to what the check page shows
// (pass, miss, note). Extracted from app.js unchanged; app.js and tools/build-library.mjs both call this, so the
// role page in the library says what the check page says about the same text. rules.js is not touched.
// Works in a browser (window.CharterVerdict) and under Node (module.exports).
//
// classify(rule, res)       the mapping as it always was; every existing caller keeps this form
// classify(rule, res, job)  LINTCHA_11: with the job findings (site/job.js) one more outcome, "undecided", for R1, R2
//                           and R3 only, and only where the two-argument form would answer "note":
//                             R2, R3: the charter does not say when it runs (J3 not stated) -> undecided, never "optional"
//                             R1:     the charter does not say where the result goes (J4 not stated) -> undecided;
//                                     J4 external or to the operator leaves the two-argument answer as it is
//                           J3 scheduled or on demand leaves the two-argument answer as it is.
//                           With job absent or null the function is byte-identical to the two-argument form.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CharterVerdict = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function classify(rule, res, job) {
    var v = res.value;
    var out;
    if (rule === "R7") out = v === "false" ? "pass" : "miss";
    else if (rule === "R6") out = v === "false" ? "pass" : "note";
    else if (rule === "R8") out = v === "true" ? "pass" : (v === "false" ? "miss" : "note");
    else if (rule === "R1" || rule === "R2" || rule === "R3") out = v === "true" ? "pass" : (v === "false" ? "miss" : "note");
    else out = v === "true" ? "pass" : "miss";   // R4, R5
    if (job && out === "note") {
      if ((rule === "R2" || rule === "R3") && job.J3 && job.J3.state === "not stated") return "undecided";
      if (rule === "R1" && job.J4 && job.J4.state === "not stated") return "undecided";
    }
    return out;
  }
  return { classify: classify };
});
