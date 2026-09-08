# Controls contract

Two controls, theme toggle and language select. `ui-controls.js` sets attributes and fires events. It never paints, so any skin can restyle without touching it.

## 1. No-flash script, first thing in `<head>`

Without this the page paints light and repaints dark, which is visible on every load.

```html
<script>
(function(){try{var t=localStorage.getItem("lintcha:theme")
||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
document.documentElement.setAttribute("data-theme",t);}catch(e){}})();
</script>
```

## 2. Markup

```html
<button type="button"
        data-theme-toggle
        data-label-dark="Dark"
        data-label-light="Light"
        aria-pressed="false">
  <span data-theme-label>Dark</span>
</button>

<span data-lang-host data-label="Language"></span>
```

The select is built into `[data-lang-host]` on load, so the language list lives in one place. To render it server-side instead, put a `<select data-lang-select>` inside the host and the script will adopt it rather than build a second one.

Load `ui-controls.js` before the page logic. It runs on `DOMContentLoaded` on its own.

## 3. What it sets

```
<html data-theme="light|dark" lang="en|es|pt" dir="ltr">
localStorage  lintcha:theme   lintcha:lang
events        lintcha:theme   detail { theme }
              lintcha:lang    detail { lang }
```

The i18n loader listens for `lintcha:lang` and swaps strings. Nothing else needs to know the language.

## 4. CSS hooks

Theme is one attribute, so a skin defines its palette twice and nothing else changes:

```css
:root[data-theme="light"] { --bg: ...; --ink: ...; }
:root[data-theme="dark"]  { --bg: ...; --ink: ...; }
```

The select carries `.lc-select` and no other class. Style it there. Do not replace the native `<select>` with a custom listbox: on mobile the native control opens the system picker, which is faster than anything a page can build and works with a screen reader for free.

## 5. Behaviour

- first visit follows the system theme, and keeps following it until the visitor touches the toggle. After that their choice wins on every visit
- language: a stored choice wins, otherwise the browser language if it is one of the three, otherwise English
- both keys are namespaced `lintcha:` so they cannot collide with anything else on the domain

## 6. Adding a language later

One entry in the `LANGS` array plus one `i18n/<code>.json`. The select, the `lang` attribute and the key-coverage gate pick it up with no other edit.

Currently: `en`, `es`, `pt`. Portuguese is Brazilian Portuguese, labelled `Português`.

## Change log

- 2026-09-07: the theme button's face names the theme that is active ("Dark" on the dark theme), not the one a click switches to. The skin adds a sun and a moon as inline svg inside the button and shows one per `[data-theme]`.
