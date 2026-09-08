# Input gate calibration (gate.js) against the strict corpus, raw text

Corpus: 1102 charters from `work_v4/charters_raw.jsonl`. Thresholds: words < 20 is thin, words < 40 without a work verb and an object is thin; function-word ratio < 0.03 (tested from 5 words) is not readable; odd-token share > 0.2 (tested from 3 letter tokens) is not readable; Latin share < 0.5 is not readable; an object must follow the verb within 6 tokens. Work vocabulary: 386 stems plus inflections.

States: profile 1102, too_thin 0, not_readable 0.

| measure | min | p1 | p5 | median | max |
|---|---|---|---|---|---|
| words (normalizer count) | 40 | 44 | 51 | 285 | 2652 |
| function-word ratio | 0.048 | 0.075 | 0.113 | 0.199 | 0.333 |
| odd-token share | 0.000 | 0.000 | 0.000 | 0.008 | 0.094 |
| Latin share of letters | 0.985 | 0.997 | 1.000 | 1.000 | 1.000 |

Margins: corpus minimum function-word ratio 0.048 against the threshold 0.03; corpus maximum odd-token share 0.094 against 0.2; corpus minimum Latin share 0.985 against 0.5. Charters without a work verb: 0; with a verb but no object in the window: 0.

## charters that do not come back as profile

None.

## the five lowest function-word ratios and the five highest odd-token shares

| id | repository | fn ratio | odd share | words |
|---|---|---|---|---|
| 410b9cd9716de573 | swcstudiospace/PumpGrok | 0.048 | 0.017 | 71 |
| 3020c1fcad19bd87 | swcstudiospace/PumpGrok | 0.057 | 0.048 | 90 |
| 071b68864d4e6880 | Octo-o-o-o/grok-job-kit | 0.063 | 0.011 | 95 |
| 0995406bf660bc8f | swcstudiospace/PumpGrok | 0.064 | 0.000 | 60 |
| 11b8173f3c2ee2a3 | swcstudiospace/PumpGrok | 0.064 | 0.071 | 141 |
| 3d979c84e0a7823f | swcstudiospace/PumpGrok | 0.086 | 0.094 | 52 |
| d6d6f1561e51d280 | swcstudiospace/PumpGrok | 0.094 | 0.089 | 116 |
| af2a681c0cc652b5 | swcstudiospace/PumpGrok | 0.136 | 0.085 | 147 |
| 97bcd01ff39c0fe1 | ZeroPointRepo/GrokBotDev | 0.111 | 0.082 | 322 |
| e871edd29184bc5e | YannisKiefer/grokbot-x | 0.105 | 0.082 | 232 |

## probes (not corpus)

| input | state | reasons | words | fn ratio | odd share | latin |
|---|---|---|---|---|---|---|
| You are the reporter | too_thin | short | 4 | 0.500 | 0.000 | 1.000 |
| выавава | not_readable | script | 1 | 0.000 | 0.000 | 0.000 |
| You are the release watcher. Every weekday yo... | profile | - | 23 | 0.348 | 0.000 | 1.000 |
| xd xd fdfldfkdfkl jojo freak go go im journalist | not_readable | function_words, gibberish | 9 | 0.000 | 0.333 | 1.000 |
| Eres el reportero. Cada día laborable lees el... | not_readable | function_words | 53 | 0.018 | 0.000 | 1.000 |
| You are the reporter. Every weekday you read ... | profile | - | 54 | 0.407 | 0.000 | 1.000 |

