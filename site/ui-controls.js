/* lintcha ui controls: theme toggle and language select.
   Style-agnostic on purpose. It sets attributes and fires events, it does not paint.
   Any skin can restyle [data-theme] and .lc-select without touching this file. */
(function (global) {
  "use strict";

  var THEME_KEY = "lintcha:theme";
  var LANG_KEY = "lintcha:lang";
  var LANGS = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "es", label: "Español", dir: "ltr" },
    { code: "pt", label: "Português", dir: "ltr" }
  ];
  var DEFAULT_LANG = "en";

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* ---------- theme ---------- */

  function systemTheme() {
    return global.matchMedia && global.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    var t = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", t);
    if (persist !== false) store(THEME_KEY, t);
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
      var on = btn.getAttribute("data-label-dark") || "Dark";
      var off = btn.getAttribute("data-label-light") || "Light";
      var face = btn.querySelector("[data-theme-label]");
      if (face) face.textContent = t === "dark" ? on : off;   /* the face names the theme that is active */
    }
    document.dispatchEvent(new CustomEvent("lintcha:theme", { detail: { theme: t } }));
    return t;
  }

  function initTheme() {
    applyTheme(read(THEME_KEY) || systemTheme(), read(THEME_KEY) !== null);
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) {
      btn.addEventListener("click", function () {
        applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
      });
    }
    /* follow the system only while the visitor has never chosen */
    if (global.matchMedia) {
      var mq = global.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function (e) { if (read(THEME_KEY) === null) applyTheme(e.matches ? "dark" : "light", false); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* ---------- language ---------- */

  function pickInitialLang() {
    var saved = read(LANG_KEY);
    if (saved && LANGS.some(function (l) { return l.code === saved; })) return saved;
    var nav = (global.navigator && (global.navigator.language || (global.navigator.languages || [])[0])) || "";
    var base = String(nav).toLowerCase().split("-")[0];
    return LANGS.some(function (l) { return l.code === base; }) ? base : DEFAULT_LANG;
  }

  function buildSelect(host, current) {
    var sel = document.createElement("select");
    sel.className = "lc-select";
    sel.id = "lc-lang";
    sel.setAttribute("data-lang-select", "");
    sel.setAttribute("aria-label", host.getAttribute("data-label") || "Language");
    LANGS.forEach(function (l) {
      var o = document.createElement("option");
      o.value = l.code;
      o.textContent = l.label;
      if (l.code === current) o.selected = true;
      sel.appendChild(o);
    });
    host.appendChild(sel);
    return sel;
  }

  function applyLang(code, opts) {
    var l = LANGS.filter(function (x) { return x.code === code; })[0] || LANGS[0];
    document.documentElement.setAttribute("lang", l.code);
    document.documentElement.setAttribute("dir", l.dir);
    if (!opts || opts.persist !== false) store(LANG_KEY, l.code);
    document.dispatchEvent(new CustomEvent("lintcha:lang", { detail: { lang: l.code } }));
    return l.code;
  }

  function initLang() {
    var host = document.querySelector("[data-lang-host]");
    var current = pickInitialLang();
    if (host) {
      var sel = host.querySelector("[data-lang-select]") || buildSelect(host, current);
      sel.value = current;
      sel.addEventListener("change", function () { applyLang(sel.value); });
    }
    applyLang(current, { persist: read(LANG_KEY) !== null });
  }

  /* ---------- sticky top bar ---------- */
  /* [data-topbar] is position:sticky in the skin; this only marks it data-stuck once a sentinel placed before it has
     scrolled out, and publishes its height as --topbar-h on the root so anchored targets clear it. Attributes only. */
  function initTopbar() {
    var bar = document.querySelector("[data-topbar]");
    if (!bar || !bar.parentNode) return;
    var setHeight = function () { document.documentElement.style.setProperty("--topbar-h", bar.offsetHeight + "px"); };
    setHeight();
    if (global.ResizeObserver) new ResizeObserver(setHeight).observe(bar);
    else global.addEventListener("resize", setHeight);
    if (!global.IntersectionObserver) return;
    var sentinel = document.createElement("div");
    sentinel.setAttribute("data-topbar-sentinel", "");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "height:1px;margin-top:-1px;visibility:hidden;";
    bar.parentNode.insertBefore(sentinel, bar);
    new IntersectionObserver(function (entries) {
      var e = entries[entries.length - 1];
      if (e.isIntersecting) bar.removeAttribute("data-stuck"); else bar.setAttribute("data-stuck", "1");
    }, { threshold: 0 }).observe(sentinel);
  }

  /* ---------- boot ---------- */

  function init() { initTheme(); initLang(); initTopbar(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  global.LintchaControls = {
    langs: LANGS,
    setTheme: applyTheme,
    setLang: applyLang,
    getTheme: function () { return document.documentElement.getAttribute("data-theme"); },
    getLang: function () { return document.documentElement.getAttribute("lang"); }
  };
})(window);
