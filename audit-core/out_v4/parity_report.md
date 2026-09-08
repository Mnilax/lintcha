# Parity report: JavaScript port vs frozen Python findings

Corpus: strict, 1102 charters, 8816 labels (8 rules each). Frozen findings: work_v4\findings.jsonl.

Identical labels: 8816 of 8816 (1.000000). Acceptance: >= 0.995 -> PASS.

Identical evidence arrays (span/shape + offset): 8816 of 8816. Offset-only differences with identical spans in charters containing astral characters (JavaScript UTF-16 code units vs Python code points): 0. Evidence differences of any other kind: 0.

Normalization parity (JS normalize(raw) == Python layers): 1102 of 1102.

| rule | identical | total | share |
|---|---|---|---|
| R1 | 1102 | 1102 | 1.000000 |
| R2 | 1102 | 1102 | 1.000000 |
| R3 | 1102 | 1102 | 1.000000 |
| R4 | 1102 | 1102 | 1.000000 |
| R5 | 1102 | 1102 | 1.000000 |
| R6 | 1102 | 1102 | 1.000000 |
| R7 | 1102 | 1102 | 1.000000 |
| R8 | 1102 | 1102 | 1.000000 |

## Label divergences (0)

none

## Normalization divergences (0)

none

No charter text appears in this report beyond the 40-character context needed to locate a normalization difference, and none is shown for label divergences.
