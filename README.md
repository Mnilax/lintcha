# lintcha

Paste the text you would put in an AI bot's profile. Get back what is already
there, the questions it has not answered, and the lines that are missing.

Live at **https://lintcha.com** in English, Spanish and Brazilian Portuguese.

```
lint ya charter before it runs
```

---

## What this is

A bot profile is a paragraph of English that decides what an agent will and will
not do. Most of them are written once, in a hurry, and never read again by
anyone. They are also copied: one person writes a profile, twenty people paste
it into their own project, and whatever was missing from the first one is now
missing from twenty.

lintcha reads that paragraph and reports on eight structural properties. It does
not score it, rank it, or grade it. It tells you which of the eight are stated,
which are not, and hands you a line for each one that is not, ready to paste.

The whole engine runs in your browser. What you paste is never sent anywhere.

---

## The eight rules

Each rule asks one question of the text. The wording below is the wording the
site uses.

| | rule | what it asks |
|---|---|---|
| R1 | Approval | require a human yes before an irreversible action |
| R2 | Memory | keep a state file across runs |
| R3 | Quiet | allow an empty run to send nothing |
| R4 | Boundary | state what the bot does not touch |
| R5 | Finished | define when the run is finished |
| R6 | Tools | name every tool the bot uses in its role statement |
| R7 | Secrets | carry no key, token, private key or internal host in the text |
| R8 | Input | treat content the bot reads (pages, email, tickets, pasted text) as data |

Six of them are scored on the check page. R6 and R7 are measured and reported
separately, because they describe the text itself rather than the work.

### Three states, not two

A rule comes back as one of three things, and the third one is the point.

```
met       the text states it
note      the text is silent, and silence is reasonable here
missing   the text is silent, and that silence has a consequence
```

An on-demand bot that sends nothing does not need an approval line. A scheduled
bot that posts to a channel does. The same silence means different things
depending on what the rest of the text says, so the tool reads the rest of the
text before deciding.

### The job

Four questions come before the rules: what the bot reads, what it does with
that, when it runs, and where the result goes.

They exist because silence about sending used to be read as proof that nothing
is sent. Someone who had simply not finished writing was told that the approval
line did not apply to them. Now that state is called `undecided`, and the
question that closes it sits in the same row.

The split is deliberate. The six rule clauses are the same for every bot, so the
tool writes them for you. Where the result goes and when it runs are facts only
you know, so the tool asks and never guesses.

---

## The corpus

Every figure on the site comes from one frozen file, `site/numbers.json`, and
every figure in that file comes from one audit of real bot profiles found in
public repositories.

```
repositories fetched                 91
repositories in the strict corpus    40
files scanned                      2228
charter candidates                 1634
accepted before dedup              1112
exact duplicates removed              5
near duplicates removed               5
charters in the strict corpus      1102
length cap                    3000 words
snapshot date                2026-09-04
```

Every source is pinned to a commit SHA in `src/data/sources.json`. Of the 91,
40 are in the corpus, 49 were dropped and 2 were discovery only. All 49 dropped
repositories carry a written reason in `audit-core/repo_classes.json`:

```
hand_review_out             46
setup_prompt_directory       2
claude_code_skill_library    1
```

A sample of 60 charters was labelled by hand, blind, before the automated pass
was scored against it. That file is `audit-core/sample_labels.jsonl`.

### The publication gate

Not every rule earns the right to a published number. Each one is scored against
the blind sample and assigned a row:

```
row 1   agreement across all three states is at least 0.85
        the full true / false / unclear counts may be published
row 2   the three-way test fails, the binary test (true against not-true)
        clears 0.85: only the true count may be published, with its denominator
row 4   neither clears: no corpus figure is published at all
```

By that gate: R4, R7 and R8 sit in row 1, R3 in row 2, and R1, R2, R5 and R6 in
row 4. The site publishes corpus figures for the first group only. The numbers
exist in the file for the others; they are not shown, and they should not be
quoted.

### The three published figures

One counts what the charters say. Two count what they do not.

```
956 of 1102   state what the bot does not touch               86.8%
              agreement 0.917   95% CI  0.846 - 0.886

850 of 1102   say nothing about whether the content the bot
              reads can give it orders                        77.1%
              agreement 0.933   95% CI  0.746 - 0.795

329 of 1102   allow an empty run to send nothing              29.9%
              binary agreement 0.883   95% CI  0.272 - 0.326
              true count only, by the gate above
```

The second one is the reason this exists. Boundaries get written: 87 percent of
the corpus says what the bot does not touch. Injection is a different story. Not
that the charters get injection resistance wrong, but that they do not mention
it: R8 came back false zero times and unclear 850 times. Nobody wrote the wrong
rule. Most people wrote no rule.

### What the numbers do not mean

- three rules have corpus-wide figures. The rest were scored on the sample of
  60 and are not published as corpus rates.
- the corpus is 40 repositories, and they are not a random sample of anything.
  A single family of near-copies covers a large share of it, so the rates partly
  describe that family.
- this is a reading of text. Whether a bot obeys its own profile is a different
  question, and this tool does not answer it.
- a profile that states all eight is not a safe profile. It is a profile that
  says the eight things.

---

## Two engines, one answer

The audit ran in Python. The site runs in JavaScript. If they disagreed, the
site would be showing numbers the audit never produced.

```
Identical labels: 8816 of 8816 (1.000000). Acceptance: >= 0.995 -> PASS.
Normalization parity (JS normalize(raw) == Python layers): 1102 of 1102.
```

8816 is 8 rules across 1102 charters. `site/rules.js` is generated from the
audit's Python and is never edited by hand; `tests/parity.js` re-checks it
against the frozen findings.

---

## The role library

Eight house roles, at https://lintcha.com/library/ - a code reviewer that
refuses to write code, a release captain that never edits application code, a
browser reader that treats every page it opens as untrusted input, and five
more.

Every published role is read by the same engine at build time, and its verdict
on all six rules is rendered next to its text. The library eats its own cooking:
if a change to the engine flips a verdict on a published role, the build fails.

### Sending one

Open an issue with the **Submit a role** template, or a pull request adding a
file under `roles/`. Either way:

- pick a licence: `CC0-1.0`, `MIT` or `Apache-2.0`
- the text is read by the engine before merge, and the verdict is published next
  to the role, pass or fail
- a role that fails the boundary, the input rule or the empty-run rule is
  returned with the engine output rather than merged quietly

The author line is published exactly as given. Nothing else about the submitter
is stored.

---

## Privacy

What you paste stays in the browser. This is not a policy, it is the
architecture:

```
zero external requests      no CDN, no font host, no analytics, no beacons
zero cookies
two storage keys            the theme and the language, nothing else
no account, no upload, no server-side processing of your text
```

The check page works with the network switched off after the first load. Open
the network panel and watch it: pressing the read button sends nothing.

---

## Repository layout

```
site/            everything that is served, and nothing else is
  rules.js       the engine, generated from the audit, never hand-edited
  verdict.js     the shared mapping from an engine value to a rendered state
  job.js         the four job checks
  numbers.json   the frozen audit output, the single source of every figure
  i18n/          en, es, pt, identical key sets, checked at build
  library/       the generated role pages
src/             build sources: templates and tools
roles/house/     the house roles, source of truth for the library
tools/           the library builder, the role linter, the schema
tests/           parity, verdict, console and acceptance checks
audit-core/      the frozen audit output, the blind labels, the drop reasons
```

Everything outside `site/` is unreachable over the web. That is not an ignore
list, it is the deploy configuration: `wrangler.toml` serves `./site` and
nothing above it.

---

## Building

No framework, no bundler, no runtime dependencies. Node is used for the build
scripts and the tests.

```
node src/tools/build.js          build the site into site/
node tools/build-library.mjs     regenerate the role library
node src/tools/i18n_check.js     verify the three languages carry the same keys
node tests/parity.js             re-check the two engines against each other
node tests/verdict_test.js       the state mapping
```

`site/rules.js` and `site/numbers.json` are frozen. They are regenerated by the
audit, never edited, and any change to them is a change to what the site claims.

---

## Licence

MIT, see [LICENSE](LICENSE).

Roles contributed to the library carry their own licence in their front matter,
chosen by the author from `CC0-1.0`, `MIT` or `Apache-2.0`.

---

## What this is not

It is not a security product. It does not test a bot, run it, watch it, or
verify that it behaves. It reads a paragraph of English and reports which of
eight things that paragraph says.

That is a smaller claim than most tools in this area make, and it is the whole
claim.
