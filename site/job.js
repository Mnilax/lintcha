// lintcha job block (LINTCHA_11). Four checks over the normalized English text, the same shape as the detectors:
// regular expressions, pure, deterministic, no network. They are not rules: never scored, never counted, never
// compared to the corpus, never on a library scorecard. Their only consumer is the check page, which turns a gap
// into a question for the operator, never into a sentence.
//
//   J1 input        what it reads or receives            stated | not stated
//   J2 action       what it does with that               stated | not stated
//   J3 trigger      when it runs                         scheduled | on demand | not stated
//   J4 destination  where the result goes                external | to the operator | not stated
//
// detect(text) takes the normalized lowercase text (CharterRules.normalize(raw).text) and returns
//   { J1: { state, evidence }, J2: {...}, J3: {...}, J4: {...} }
// J3 reuses Rules.hasSchedule for the scheduled case and imports nothing else from rules.js.
// Shared verbs (check, review, log) count for J1 only when the object names a source; otherwise for J2.
// A negated delivery ("never send anything outside") is not a destination.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(typeof require === "function" ? require("./rules.js") : null);
  else root.CharterJob = factory(root.CharterRules || null);
})(typeof self !== "undefined" ? self : this, function (Rules) {
  "use strict";
  var OBJ = "(the |my |our |your |his |her |their |its |a |an |each |every |all |any |new |incoming |unread |these |those |this |that |what |whatever |anything |everything |something )";
  var SOURCE = "(inbox|inboxes|tracker|trackers|feed|feeds|page|pages|ticket|tickets|email|emails|channel|channels|repository|repositories|repo|repos|calendar|calendars|thread|threads|document|documents|doc|docs)";
  var SHARED = "(check|checks|checking|review|reviews|reviewing|log|logs|logging)";
  var PLACE = "(channel|channels|thread|threads|inbox|inboxes|email|mail|mailbox|slack|discord|telegram|whatsapp|sheet|sheets|spreadsheet|doc|docs|document|documents|file|files|folder|folders|repo|repository|issue|issues|ticket|tickets|tracker|board|page|pages|wiki|notion|drive|dashboard|log|ledger|table|database|db|queue|feed|dm|dms|chat|room|team|teammate|reviewer|responder|list|calendar|pr|pull request|branch|comment|comments|website|site|blog|newsletter|them|him|her|whoever|someone|somebody|anyone|people|customer|customers|client|clients)";
  var OPERATOR = "(me|you|us|the operator|the owner|the user|a person|the person|a human|the human|the asker|the requester|whoever asked)";
  var DELIVER = "(post|posts|posting|send|sends|sending|deliver|delivers|delivering|publish|publishes|publishing|write|writes|writing|save|saves|saving|put|puts|putting|drop|drops|dropping|forward|forwards|forwarding|report|reports|reporting|hand|hands|handing|return|returns|returning|email|emails|emailing|message|messages|messaging|share|shares|sharing|append|appends|appending|file|files|filing|log|logs|logging|upload|uploads|uploading|push|pushes|pushing|leave|leaves|leaving|add|adds|adding|attach|attaches|attaching|route|routes|routing|escalate|escalates|escalating|dm|dms|ping|pings|reply|replies|replying|respond|responds|responding|address|addresses|addressed|hand back|hands back|handing back)";
  var THING = "( it| them| this| that| everything| anything| each| every| the results?| a results?| (the|a|an|my|our|your|each|every|its|their) [a-z][a-z'-]*| [a-z]+)?";
  var PREP = " (to|into|in|on|at|back to|for|with|as) ";
  var THING_EXT = "(" + THING.slice(1, -2) + "| (what|whatever|anything|everything)( [a-z][a-z'-]*){0,6})?";
  var P = {
    // J1: an intake verb followed by an object, a shared verb followed by a source, or an intake phrase
    J1_INPUT: "\\b((read|reads|reading|scan|scans|scanning|monitor|monitors|monitoring|watch|watches|watching|open|opens|opening|receive|receives|receiving|fetch|fetches|fetching|pull|pulls|pulling|collect|collects|collecting|gather|gathers|gathering|parse|parses|parsing|ingest|ingests|ingesting|track|tracks|tracking|follow|follows|following|inspect|inspects|inspecting|listen to|listens to|listening to|go through|goes through|going through|look at|looks at|looking at|look through|looks through|looking through|go over|goes over|going over|take in|takes in|are given|is given|is handed|are handed|get|gets|given) " + OBJ + "?[a-z][a-z'-]*)|\\b(" + SHARED + " " + OBJ + "?" + SOURCE + ")|\\b(input is|inputs are|the input|its input|your input|source is|sources are|the sources?|reads from|read from|arrives? in|arriving in|comes? in (through|via|from)|incoming (messages?|emails?|mail|tickets?|requests?|links?|items?|files?|posts?|pages?|feeds?|alerts?)|everything (you|it) reads?|what (you|it) reads?|(from|in) (my|the|our|your) (inbox|feed|feeds|queue|tracker|channel|folder|mailbox|newsletters?|logs?|dashboard|calendar))\\b",
    // J2: a work verb followed by an object, a shared verb followed by something that is not a source, or a product phrase
    J2_ACTION: "\\b((summari[sz]e|summari[sz]es|summari[sz]ing|write|writes|writing|draft|drafts|drafting|compile|compiles|compiling|produce|produces|producing|extract|extracts|extracting|pull out|pulls out|pulling out|flag|flags|flagging|label|labels|labelling|labeling|classify|classifies|classifying|sort|sorts|sorting|tag|tags|tagging|answer|answers|answering|reply to|replies to|replying to|translate|translates|translating|triage|triages|triaging|clean|cleans|cleaning|fix|fixes|fixing|note|notes|noting|record|records|recording|list|lists|listing|rank|ranks|ranking|compare|compares|comparing|verify|verifies|verifying|validate|validates|validating|route|routes|routing|forward|forwards|forwarding|escalate|escalates|escalating|build|builds|building|generate|generates|generating|create|creates|creating|update|updates|updating|edit|edits|editing|rewrite|rewrites|rewriting|format|formats|formatting|convert|converts|converting|transform|transforms|transforming|merge|merges|merging|dedupe|dedupes|deduplicate|deduplicates|prepare|prepares|preparing|assemble|assembles|assembling|score|scores|scoring|grade|grades|grading|highlight|highlights|highlighting|identify|identifies|identifying|find|finds|finding|spot|spots|spotting|detect|detects|detecting|decide|decides|deciding|judge|judges|judging|explain|explains|explaining|describe|describes|describing|turn|turns|turning|make|makes|making|give|gives|giving) " + OBJ + "?[a-z][a-z'-]*)|\\b(" + SHARED + " (?!" + OBJ + "?" + SOURCE + "\\b)" + OBJ + "?[a-z][a-z'-]*)|\\b(the (output|deliverable|result) is|outputs? (is|are)|hands? back|handing back|turn(s|ing)? (it|them|that|this|each) into|(write|writes|produce|produces|draft|drafts|send|sends|post|posts) (me |us )?(a|an|one|the) [a-z -]{0,20}(summary|report|digest|note|list|brief|memo|table|timeline|verdict|answer|reply|draft|log|record|readout|scorecard|changelog|page))\\b",
    // J3, on demand said out loud (the scheduled case is Rules.hasSchedule)
    J3_ON_DEMAND: "\\b(on demand|on-demand|when asked|when i ask|when someone asks|when (the user|a user|the owner|the operator|a person) asks|on request|upon request|when requested|by request|when i run (it|you)|when (it is|it's|you are|you're) run|when run manually|run manually|manually|ad hoc|ad-hoc|when invoked|when called|when i (call|ping|message|prompt|trigger|start|launch|say|tell|type|send) (it|you|a message|a prompt|go)|only when (i|the user|the owner|someone|a person) (ask|asks|say|says|tell|tells|prompt|prompts|start|starts)|whenever i ask|each time i ask|every time i ask|on my (request|command|say-so|signal|prompt)|when prompted|when (given|handed) (a|an|the)|when (a|the) (user|person|operator) (sends|types|posts|opens) (a|an|the|one)|not on a schedule|no schedule|does not run on a schedule|never on a schedule|runs? when (i|you|someone|the user) (ask|asks|say|says|tell|tells|start|starts))\\b",
    // J4 external: a delivery verb, an optional short object, a preposition, and a place outside the operator; or a result phrase
    J4_EXTERNAL: "\\b(" + DELIVER + THING_EXT + PREP + OBJ + "?(team |engineering |support |ops |shared |main |private |named |same |dedicated |internal |group |project |daily |weekly |morning )?" + PLACE + ")|\\b(the (output|result|results|report|summary|note|digest|verdict|answer) (goes|go|lands|land|is sent|are sent|is posted|are posted|is delivered|are delivered|is written|are written|is saved|are saved) (to|into|in|on|at) (the |my |our |your |a |an )?" + PLACE + "|(goes|go|lands|land) (to|into|in|on) (the |my |our |your |a |an )?(channel|inbox|thread|sheet|doc|file|folder|repo|tracker|board|dashboard|log|ledger|table|queue|feed|dm|chat|room|team|list|calendar)|(is|are|gets|get|will be) (posted|sent|published|delivered|forwarded|uploaded|emailed|shared|pushed|filed|broadcast))\\b",
    // J4 to the operator: the result goes back to whoever runs it
    J4_OPERATOR: "\\b(" + DELIVER + THING + PREP + OPERATOR + ")|\\b(reply (only )?with|respond (only )?with|answer (only )?with|hands? (it |them |the [a-z]+ )?back|handed back to|hand back to|report back|addressed to (a|the|my|our) (person|human|operator|owner|team|user|reviewer)|for a person who|(returns?|goes|go) (back )?to (me|you|us|the operator|the owner|the user|a person|the person|a human|the human)|show (me|us|the operator|the owner)|give (me|us) (a|an|the|one)|send me (a|an|one|the|every|each)|tell (me|us))\\b"
  };
  var R = {};
  Object.keys(P).forEach(function (k) { R[k] = new RegExp(P[k]); });
  function first(re, text) { var m = re.exec(text); return m ? { span: m[0].slice(0, 80), offset: m.index } : null; }
  // The evidence of a check is always the match that decided its state, never the span of a losing class; a deciding
  // class with no usable span (J3 scheduled comes from Rules.hasSchedule, which returns a boolean) gives null.
  function detect(text) {
    text = String(text || "");
    var j1 = first(R.J1_INPUT, text), j2 = first(R.J2_ACTION, text);
    var scheduled = Rules && Rules.hasSchedule ? Rules.hasSchedule(text) : false;
    var demand = scheduled ? null : first(R.J3_ON_DEMAND, text);
    var ext = first(R.J4_EXTERNAL, text), op = ext ? null : first(R.J4_OPERATOR, text);
    var j3 = scheduled ? { state: "scheduled", evidence: null } : (demand ? { state: "on demand", evidence: demand } : { state: "not stated", evidence: null });
    var j4 = ext ? { state: "external", evidence: ext } : (op ? { state: "to the operator", evidence: op } : { state: "not stated", evidence: null });
    return {
      J1: { state: j1 ? "stated" : "not stated", evidence: j1 },
      J2: { state: j2 ? "stated" : "not stated", evidence: j2 },
      J3: j3,
      J4: j4
    };
  }
  return { detect: detect, PATTERNS: P, IDS: ["J1", "J2", "J3", "J4"] };
});
