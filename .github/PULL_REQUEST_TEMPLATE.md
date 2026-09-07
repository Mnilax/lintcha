<!-- Pull requests that add or change a role under roles/community/. Anything else: delete this template. -->

## Role

- file: `roles/community/<slug>.md`
- author string, exactly as it should appear: 
- author_url (leave empty if none; `https` only): 

## Checks

- [ ] I wrote this role or hold the right to publish it, and I grant it under the license named in its `license` field (`CC0-1.0`, `MIT` or `Apache-2.0`).
- [ ] The front matter carries every field in the documented order, including `author_url` (empty is fine, missing is not).
- [ ] I ran `node tools/lint-role.mjs roles/community/<slug>.md` and read the verdict.
- [ ] I ran `node tools/build-library.mjs --served site` and committed the regenerated `site/library/**`, `site/<lang>/library/**`, `site/library-numbers.json` and `build/library-report.json`.

The text is linted before merge by the same engine as the check page, and the verdict is published next to the role, pass or fail. A miss on any rule rejects the pull request; the job summary names the rule.
