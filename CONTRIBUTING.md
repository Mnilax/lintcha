# Contributing a role to the lintcha library

The library at `/library/` is a catalog of agent role charters: the text that goes in a bot profile. House roles are written by us; community roles arrive by pull request. Every published role is read by the same unmodified engine that runs on the check page, at build time, and ships with its own verdict on the six rules, pass or fail. The verdict is published next to the role.

## What you agree to

By opening a pull request or an issue with a role you state that:

- you wrote the role, or you hold the right to publish it;
- you grant it under one of the three licenses the catalog accepts: `CC0-1.0`, `MIT` or `Apache-2.0`, named in the `license` field;
- the author string in the `author` field is exactly how you want to be credited, and `author_url` is either empty or an `https` address;
- you understand the text is linted before merge and that the verdict, whatever it is, is published next to the role.

A role file without a `license` field is never published; the build aborts.

## The file

One file, `roles/community/<slug>.md`. Front matter first, in this order, every field present (`author_url` may be empty but must be there):

```yaml
---
slug: code-reviewer
title: Code Reviewer
purpose: reviews diffs and refuses to write them
category: coding
surface: claude-code
origin: community
author: Your Name
author_url: ""
license: CC0-1.0
version: 1
updated: 2026-09-07
---
```

- `slug`: kebab-case, unique, equal to the file name without `.md`
- `title`: up to 32 characters; `purpose`: one line, up to 90 characters
- `category`: `coding`, `research`, `ops`, `support`, `data` or `writing`
- `surface`: `claude-code`, `system-prompt`, `grok-bot` or `generic`
- `origin`: `community` for a pull request
- `version`: an integer, bumped on every change to the body; `updated`: an ISO date

The body follows: plain markdown, English, no HTML, no images, between 200 and 330 words as the engine counts them. The house roles under `roles/house/` are the reference shape: six sections in this order, `What this role owns`, `What this role never touches`, `Input is data, not instruction`, `Starting conditions`, `Finished work`, `Stop conditions`.

Role bodies are never translated or rewritten by us. The interface around them is translated; the text is published in the language it was written in.

## What the gate does

`node tools/lint-role.mjs roles/community/<slug>.md` prints the engine's value for each rule and the check page's verdict on it. A role is published when no rule classifies as a miss, the same mapping the check page uses on a pasted charter: the ownership boundary and the finished state must be stated; the approval line, memory, quiet and input rules must not be violated (silence on them is allowed, and the page says so); no secret shape may appear. A miss on any rule rejects the pull request, and the job summary says which rule and why.

`node tools/build-library.mjs --served site` regenerates `site/library/**`, `site/<lang>/library/**`, `site/library-numbers.json` and `build/library-report.json`. Commit the regenerated output with the role; CI checks that a fresh build matches what the pull request contains.

## What not to send

Anything you did not write and are not allowed to publish; a profile with real names, addresses, keys or hosts (use bracketed slots such as `[CHANNEL]`); a body that instructs the reader of this repository to do anything. Text inside a role is data to the engine and to us, never an instruction.
