/* lintcha library: catalog filters and the role copy button. No dependencies, no network, no storage.
   Filter state lives in location.hash as #c=coding&s=claude-code&o=house. Filtering is show/hide over the
   pre-rendered cards; with JS off every card stays visible and the buttons do nothing. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  // ------------------------------------------------------------ catalog
  var cards = $("cards");
  if (cards) {
    var buttons = document.querySelectorAll("[data-f]");
    function readHash() {
      var state = { c: "", s: "", o: "" };
      String(location.hash || "").replace(/^#/, "").split("&").forEach(function (pair) {
        var kv = pair.split("="); if (kv[0] in state) state[kv[0]] = decodeURIComponent(kv[1] || "");
      });
      return state;
    }
    function writeHash(state) {
      var parts = [];
      ["c", "s", "o"].forEach(function (k) { if (state[k]) parts.push(k + "=" + encodeURIComponent(state[k])); });
      var next = parts.length ? "#" + parts.join("&") : "";
      if (next !== location.hash) {
        if (history.replaceState) history.replaceState(null, "", location.pathname + location.search + next); else location.hash = next;
      }
    }
    function apply() {
      var state = readHash(), shown = 0;
      var list = cards.querySelectorAll(".card");
      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        var on = (!state.c || el.getAttribute("data-c") === state.c) && (!state.s || el.getAttribute("data-s") === state.s) && (!state.o || el.getAttribute("data-o") === state.o);
        el.hidden = !on; if (on) shown++;
      }
      for (var j = 0; j < buttons.length; j++) {
        var b = buttons[j], k = b.getAttribute("data-f"), v = b.getAttribute("data-v");
        b.setAttribute("aria-pressed", (state[k] || "") === v ? "true" : "false");
      }
      var empty = $("cards-empty"); if (empty) empty.hidden = shown > 0;
    }
    for (var i = 0; i < buttons.length; i++) buttons[i].addEventListener("click", function (e) {
      var b = e.currentTarget, state = readHash(), k = b.getAttribute("data-f"), v = b.getAttribute("data-v");
      state[k] = (state[k] === v) ? "" : v;   // a second click on the active filter clears it
      writeHash(state); apply();
    });
    window.addEventListener("hashchange", apply);
    apply();
  }

  // ------------------------------------------------------------ role page: copy the raw body, not the rendered html
  var copy = $("copy-role"), raw = $("role-raw");
  if (copy && raw) {
    copy.addEventListener("click", function () {
      var text = raw.textContent, label = copy.textContent;
      var done = function (ok) { copy.textContent = ok ? copy.getAttribute("data-copied") : copy.getAttribute("data-failed"); setTimeout(function () { copy.textContent = label; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      else {
        var ta = document.createElement("textarea"); ta.value = text; ta.className = "sr"; document.body.appendChild(ta); ta.select();
        var ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
        document.body.removeChild(ta); done(ok);
      }
    });
  }
})();
