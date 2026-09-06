// lintcha input gate. Decides, before any rule runs, whether the pasted text is a bot profile at all.
// Pure function over the raw paste. No dependencies beyond the normalizer in rules.js (which is not a rule). Works in
// a browser and under Node. Deterministic, no network, names no language.
//
// Three states:
//   profile       reads as a role description: the rules run
//   too_thin      under 20 words, or under 40 words with no work verb or no object: no clauses
//   not_readable  gibberish, or the majority script is not Latin, or no English function words: the rules do not run
//
// The two numeric thresholds were calibrated against the 1102 corpus charters (raw text, the browser path) with
// tools/gate_calibrate.js; the calibration report is out_v4/gate_calibration.md. Every corpus charter comes back as
// profile. The figures below are gate parameters, not corpus figures, and nothing on the site prints them.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(typeof require === "function" ? require("./rules.js") : null);
  else root.CharterGate = factory(root.CharterRules || null);
})(typeof self !== "undefined" ? self : this, function (Rules) {
  "use strict";

  var MIN_WORDS = 20;          // under this, short alone is too thin
  var THIN_WORDS = 40;         // from 20 to 39 words the text needs a work verb with an object; the corpus floor of 40 was an
                               // inclusion test against fragments and is too high for live input
  var FN_RATIO_MIN = 0.03;     // English function words / words. Corpus minimum 0.048, p1 0.075 (calibration report); gibberish sits at 0
  var FN_RATIO_WORDS = 5;      // under this many words the ratio is noise and is not tested
  var ODD_SHARE_MAX = 0.2;     // share of letter-only tokens with no vowel or a run of four or more consonants. Corpus maximum 0.094
  var ODD_MIN_TOKENS = 3;
  var LATIN_MAJORITY = 0.5;    // Latin letters / all letters; below it the majority script is not Latin
  var OBJECT_WINDOW = 6;       // tokens after an action verb in which its object must appear

  var FUNCTION_WORDS = ["the", "a", "an", "to", "and", "of", "is", "in", "for", "with", "on", "that", "it", "you", "your"];

  // work vocabulary: what a bot is told to do. Stems only, no all-purpose verbs (take, make, use, keep, say...); inflections
  // (-s, -es, -ed, -d, -ing, -ies, -ied, doubled consonant) are generated below. Every corpus charter carries one of these.
  var VERB_STEMS = ["read", "write", "send", "check", "draft", "post", "review", "collect", "summarise", "summarize",
    "monitor", "reply", "respond", "answer", "build", "track", "search", "fetch", "scan", "report", "update",
    "create", "run", "list", "find", "watch", "log", "notify", "alert", "flag", "tag", "sort", "file", "save",
    "store", "fix", "test", "deploy", "generate", "produce", "compile", "analyse", "analyze", "translate", "edit",
    "delete", "remove", "add", "ask", "call", "message", "email", "publish", "schedule", "plan", "manage", "handle",
    "help", "assist", "research", "gather", "extract", "parse", "format", "organise", "organize", "label",
    "classify", "triage", "escalate", "forward", "share", "open", "close", "merge", "commit", "push", "pull",
    "browse", "visit", "compare", "verify", "validate", "confirm", "remind", "note", "record", "transcribe", "order",
    "book", "buy", "pay", "trade", "process", "execute", "implement", "maintain", "operate", "perform", "provide",
    "deliver", "prepare", "propose", "suggest", "recommend", "describe", "explain", "document", "outline", "clean",
    "refactor", "debug", "inspect", "audit", "evaluate", "assess", "measure", "count", "calculate", "compute",
    "convert", "upload", "download", "install", "configure", "apply", "follow", "return", "output", "print", "show",
    "display", "render", "present", "highlight", "identify", "detect", "resolve", "solve", "contact", "ping",
    "invite", "assign", "delegate", "route", "dispatch", "queue", "archive", "index", "link", "attach", "insert",
    "append", "replace", "rewrite", "rename", "move", "copy", "sync", "restore", "start", "stop", "pause", "resume",
    "retry", "trigger", "launch", "spawn", "invoke", "query", "request", "submit", "approve", "reject", "accept",
    "decline", "sign", "grade", "score", "rank", "select", "filter", "group", "split", "join", "combine",
    "aggregate", "digest", "brief", "recap", "announce", "broadcast", "tweet", "chat", "greet", "teach", "coach",
    "guide", "advise", "consult", "diagnose", "serve", "support", "moderate", "enforce", "protect", "block", "ban",
    "warn", "remember", "recall", "learn", "study", "explore", "investigate", "examine", "observe", "listen",
    "receive", "design", "sketch", "code", "program", "script", "automate", "orchestrate", "coordinate", "supervise",
    "administer", "curate", "annotate", "caption", "clarify", "revise", "proofread", "polish", "finalise",
    "finalize", "ship", "release", "tune", "optimise", "optimize", "benchmark", "simulate", "model", "forecast",
    "predict", "estimate", "invoice", "bill", "charge", "refund", "stream", "compose", "reserve", "cancel",
    "reschedule", "acknowledge", "iterate", "negotiate", "interpret", "localise", "localize", "narrate", "condense",
    "expand", "elaborate", "navigate", "control", "adjust", "calibrate", "align", "prioritise", "prioritize", "mine",
    "harvest", "crawl", "scrape", "poll", "subscribe", "register", "onboard", "provision", "grant", "revoke",
    "rotate", "encrypt", "decrypt", "authenticate", "authorise", "authorize", "connect", "boot", "reboot", "restart",
    "terminate", "abort", "purge", "prune", "trim", "load", "import", "export", "migrate", "transfer", "transform",
    "encode", "decode", "compress", "bundle", "package", "distribute", "comment", "mention", "reference", "cite",
    "quote", "paraphrase", "rephrase", "reword", "echo", "collaborate", "contribute", "repair", "patch", "upgrade",
    "rollback", "revert", "reset", "recover", "tally", "categorise", "categorize", "structure", "style", "correct",
    "improve", "enhance", "extend", "integrate", "wire", "plug", "hook", "map", "trace", "profile", "sample",
    "survey", "interview", "probe", "discover", "vote", "elect", "nominate", "mediate", "dictate", "spell",
    "punctuate", "capitalise", "capitalize", "lint", "transpile", "minify", "cache", "invalidate", "flush",
    "persist", "serialise", "serialize", "deserialise", "deserialize", "escape", "sanitise", "sanitize", "redact",
    "mask", "retrieve", "lookup", "bookmark", "clip", "snip", "crop", "resize", "scale", "transcode"];

  var STOP = {};
  (FUNCTION_WORDS.concat(["i", "me", "my", "we", "us", "our", "he", "him", "his", "she", "her", "they", "them", "their",
    "this", "these", "those", "there", "here", "what", "which", "who", "whom", "whose", "when", "where", "why", "how",
    "not", "no", "never", "always", "only", "also", "then", "than", "so", "as", "at", "by", "from", "into", "onto",
    "or", "but", "if", "nor", "yet", "be", "been", "being", "am", "are", "was", "were", "do", "does", "did", "have",
    "has", "had", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "any", "all", "each",
    "every", "some", "none", "both", "either", "neither", "one", "two", "first", "last", "next", "same", "other",
    "another", "such", "very", "just", "too", "more", "most", "less", "least", "much", "many", "few", "own", "up",
    "down", "out", "off", "over", "under", "again", "once", "before", "after", "about", "above", "below", "between",
    "through", "during", "without", "within", "against", "toward", "towards", "until", "while", "because", "though",
    "although", "unless", "whether", "please", "always", "ever", "still", "even", "back", "away", "well", "now"])).forEach(function (w) { STOP[w] = true; });

  var VERBS = {};
  VERB_STEMS.forEach(function (s) {
    var forms = [s, s + "s", s + "es", s + "ed", s + "d", s + "ing"];
    if (/y$/.test(s)) forms.push(s.slice(0, -1) + "ies", s.slice(0, -1) + "ied");
    if (/e$/.test(s)) forms.push(s.slice(0, -1) + "ing");
    if (/[^aeiou][aeiou][^aeiouwxy]$/.test(s)) forms.push(s + s.slice(-1) + "ed", s + s.slice(-1) + "ing");
    forms.forEach(function (f) { VERBS[f] = true; });
  });

  function ownNormalize(raw) {
    var text = String(raw || "").replace(/\s+/g, " ").trim().toLowerCase();
    return { text: text, word_count: text ? text.split(" ").length : 0 };
  }
  function normalize(raw) {
    if (Rules && Rules.normalize) { var n = Rules.normalize(raw); return { text: n.text, word_count: n.word_count }; }
    return ownNormalize(raw);
  }
  function wordTokens(text) { return text.split(/[^a-z0-9'-]+/).filter(function (w) { return /[a-z]/.test(w); }); }

  function letters(raw) {
    var all = raw.match(/\p{L}/gu) || [];
    var latin = raw.match(/[A-Za-zÀ-ɏ]/g) || [];
    return { all: all.length, latin: latin.length };
  }
  function oddToken(w) {
    if (!/^[a-z]+$/.test(w) || w.length < 2) return false;
    if (!/[aeiouy]/.test(w)) return true;
    return /[bcdfghjklmnpqrstvwxz]{4,}/.test(w);
  }
  function verbObject(tokens) {
    var verbAt = -1, objAt = -1;
    for (var i = 0; i < tokens.length; i++) {
      if (!VERBS[tokens[i]]) continue;
      if (verbAt < 0) verbAt = i;
      for (var j = i + 1; j <= i + OBJECT_WINDOW && j < tokens.length; j++) {
        var w = tokens[j];
        if (STOP[w] || VERBS[w] || w.length < 2) continue;
        return { verb: tokens[i], object: w };
      }
    }
    return { verb: verbAt >= 0 ? tokens[verbAt] : null, object: null };
  }

  function classify(raw) {
    raw = String(raw || "");
    var n = normalize(raw), tokens = wordTokens(n.text), words = n.word_count;
    var L = letters(raw);
    var fn = 0; tokens.forEach(function (w) { if (FUNCTION_WORDS.indexOf(w) >= 0) fn++; });
    var letterTokens = tokens.filter(function (w) { return /^[a-z]+$/.test(w) && w.length >= 2; });
    var odd = letterTokens.filter(oddToken).length;
    var vo = verbObject(tokens);
    var m = {
      words: words,
      latin_share: L.all ? L.latin / L.all : 1,
      fn_ratio: tokens.length ? fn / tokens.length : 0,
      odd_share: letterTokens.length ? odd / letterTokens.length : 0,
      verb: vo.verb, object: vo.object
    };
    var reasons = [];
    if (L.all && m.latin_share < LATIN_MAJORITY) reasons.push("script");
    if (tokens.length >= FN_RATIO_WORDS && m.fn_ratio < FN_RATIO_MIN) reasons.push("function_words");
    if (letterTokens.length >= ODD_MIN_TOKENS && m.odd_share > ODD_SHARE_MAX) reasons.push("gibberish");
    if (reasons.length) return { state: "not_readable", reasons: reasons, measures: m };
    if (words < MIN_WORDS) reasons.push("short");
    else if (words < THIN_WORDS) {
      if (!vo.verb) reasons.push("no_verb");
      else if (!vo.object) reasons.push("no_object");
    }
    if (reasons.length) return { state: "too_thin", reasons: reasons, measures: m };
    return { state: "profile", reasons: [], measures: m };
  }

  return { classify: classify, thresholds: { MIN_WORDS: MIN_WORDS, THIN_WORDS: THIN_WORDS, FN_RATIO_MIN: FN_RATIO_MIN, FN_RATIO_WORDS: FN_RATIO_WORDS,
    ODD_SHARE_MAX: ODD_SHARE_MAX, ODD_MIN_TOKENS: ODD_MIN_TOKENS, LATIN_MAJORITY: LATIN_MAJORITY, OBJECT_WINDOW: OBJECT_WINDOW },
    FUNCTION_WORDS: FUNCTION_WORDS, VERB_STEMS: VERB_STEMS, verbCount: VERB_STEMS.length };
});
