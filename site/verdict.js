// lintcha verdict: the one mapping from an engine value (true, false, unclear) to what the check page shows
// (pass, miss, note). Extracted from app.js unchanged; app.js and tools/build-library.mjs both call this, so the
// role page in the library says what the check page says about the same text. rules.js is not touched.
// Works in a browser (window.CharterVerdict) and under Node (module.exports).
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.CharterVerdict = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  function classify(rule, res) {
    var v = res.value;
    if (rule === "R7") return v === "false" ? "pass" : "miss";
    if (rule === "R6") return v === "false" ? "pass" : "note";
    if (rule === "R8") return v === "true" ? "pass" : (v === "false" ? "miss" : "note");
    if (rule === "R1" || rule === "R2" || rule === "R3") return v === "true" ? "pass" : (v === "false" ? "miss" : "note");
    return v === "true" ? "pass" : "miss";   // R4, R5
  }
  return { classify: classify };
});
