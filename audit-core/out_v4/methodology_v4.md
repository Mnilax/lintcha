# Grok Bot charter audit: methodology (run three, expanded source set)

Corpus: Grok Bot charters published as plain text in public GitHub repositories, snapshot 2026-09-04, source set expanded on 2026-09-05 with the repositories linked from the two discovery lists. Strict corpus = every fetched repository minus setup-prompt directories and Claude Code skill libraries (not the unit of analysis). NOT a census of public Grok Bot templates; install-link directories are excluded because their configuration text lives on x.ai, which this project never fetches.
Snapshot 2026-09-04 (source pins for the run-one repositories), expansion 2026-09-05 (pins for the harvested repositories). Seed 20260904. Network: github.com for git ls-remote, codeload.github.com for tarballs by SHA, api.github.com for metadata with a read-only token (774 calls, 4224 remaining at the end). x.ai never contacted.

## Sampling frame

Stage 1 only: the corpus is charters published in repositories linked from two curated awesome-lists. No code search was used.

Stage 2 queries, verbatim:

- `"grok bot" "you are" extension:md` -> None results, 98 repositories added
- `"grok bot" "your job" extension:md` -> None results, 31 repositories added
- `"grok bot" "rename yourself" extension:md` -> None results, 0 repositories added
- `"grok bot" "every weekday" extension:md` -> None results, 10 repositories added
- `"grok bot" "every morning" extension:md` -> None results, 13 repositories added
- `"grok bot" "never send" extension:md` -> None results, 39 repositories added
- `"grok bot" "without my approval" extension:md` -> None results, 0 repositories added
- `"grok bot" "stay silent" extension:md` -> None results, 9 repositories added
- `"grok bot" "state file" extension:md` -> None results, 20 repositories added
- `"grok bot" "definition of done" extension:md` -> None results, 25 repositories added
- `"grok bot" roster "you own" extension:md` -> None results, 7 repositories added
- `"grok bot" filename:SKILL.md` -> None results, 76 repositories added
- `"grokbot" "you are" "approval" extension:md` -> None results, 13 repositories added
- `"agent roster" "you are" "never" extension:md` -> None results, 180 repositories added

## Expansion funnel

| stage | count |
|---|---|
| unique repository links in the two discovery lists | 269 |
| already in the run-one manifest | 16 |
| harvested candidates | 253 |
| excluded by class (row text + api description) | 171 |
| failed (not found / fetch error) | 8 |
| fetched and put through the inclusion test | 74 |
| repositories read in total (run one + harvest) | 89 |
| repositories in the strict corpus | 40 |
| strict N | 1102 |
| full N (robustness) | 2282 |

Harvest decisions: {"excluded:archived": 3, "excluded:bridge": 8, "excluded:code_tool": 58, "excluded:docs_coverage": 2, "excluded:installer_router_account": 8, "excluded:link_directory": 4, "excluded:mcp_connector_plugin": 88, "failed:not_found": 8, "fetch": 74}

Strict exclusions (49): AmitMirgal/orgbot-hub (hand_review_out); Anil-matcha/awesome-grok-bot (setup_prompt_directory); EndeavorYen/grok-bot-skills (hand_review_out); KinGao294/grok-bot-orange-book (hand_review_out); Logos52/grok-bot-packets (hand_review_out); Steltic/steltic_grokbot (hand_review_out); Uncle-Gizmo/grok-bot-info (hand_review_out); a70win-wq/usegrokbot (hand_review_out); aaravarr/openbot (hand_review_out); aaron-he-zhu/aaron-marketing-skills (claude_code_skill_library); andrewkittridge/grokory (hand_review_out); banana2556/cursor-grokbot-helper (hand_review_out); bcharleson/grokbot-peekaboo (hand_review_out); cs68614-hash/awesome-grokbot-templates (hand_review_out); dadamingmax/Grok-Bot-Setup-and-Usage-Guide (hand_review_out); ddhjy/grok-bot-hub (hand_review_out); dragosroua/grok-bot-add-plugin (hand_review_out); elie222/botdirectory.ai (setup_prompt_directory); enderzcx/grok-bot-switch (hand_review_out); function1st/PhoneZero (hand_review_out); hariou/technocore-grokbot-ja (hand_review_out); hesreallyhim/awesome-claude-code (hand_review_out); jaskirat1616/grok-skills (hand_review_out); jblack4vols/grok-bot (hand_review_out); jeremybrasher/grokbot-skills (hand_review_out); jinank/great-grokbots (hand_review_out); kwakseongjae/awesome-grok-bot (hand_review_out); kydlikebtc/awesome-grokbot (hand_review_out); lazerusrm/botrouter (hand_review_out); lureilly1/botjobs (hand_review_out); mKay00/grok-bot-second-brain (hand_review_out); maplefukku/grok-bot-ops (hand_review_out); matsutouya/note-kojo (hand_review_out); mostdesign01-sudo/grokbot-use-cases (hand_review_out); mozilla/diversity (hand_review_out); napiermd/heavy-lift-cloud-agents (hand_review_out); nescafe2009/dsh-grokbot (hand_review_out); njpatel/omabot (hand_review_out); owenisas/grokbot-openai (hand_review_out); pacifico-1106/grokbot-control-plane (hand_review_out); quolu/plaude (hand_review_out); richard7463/askgrokwallet (hand_review_out); rockyzhuo/grok-bot-blue-book (hand_review_out); shrdgn/grokbot-skills (hand_review_out); steve228uk/grok-bot-shopping (hand_review_out); thomasbek3/hermes-bot-kit (hand_review_out); tiankonglan/awesome-grok-bot-template (hand_review_out); vercel/vercel-plugin (hand_review_out); zhulin025/LaoA-GrokBot (hand_review_out)

## Side by side with run two

| figure | run two | run three |
|---|---|---|
| strict N | 765 | 1102 |
| repositories in strict corpus | 12 | 40 |
| R1_approval_gate (Stage A true/denominator, row, gate A) | 541/765, row 4, 0.7666666666666667 | 623/1102, row 4, 0.5833333333333334 |
| R2_state_file (Stage A true/denominator, row, gate A) | 291/765, row 4, 0.65 | 324/1102, row 4, 0.75 |
| R3_silence_rule (Stage A true/denominator, row, gate A) | 267/765, row 1, 0.8833333333333333 | 329/1102, row 2, 0.8166666666666667 |
| R4_ownership_boundary (Stage A true/denominator, row, gate A) | 645/765, row 1, 0.9 | 956/1102, row 1, 0.9166666666666666 |
| R5_stop_condition (Stage A true/denominator, row, gate A) | 673/765, row 1, 0.9166666666666666 | 830/1102, row 4, 0.8333333333333334 |
| R6_undisclosed_capability (Stage A true/denominator, row, gate A) | 549/765, row 4, 0.65 | 720/1102, row 4, 0.5833333333333334 |
| R7_visible_secret (Stage A true/denominator, row, gate A) | 0/765, row 1, 1.0 | 0/1102, row 1, 1.0 |
| R8_injection_resistance (Stage A true/denominator, row, gate A) | 228/765, row 1, 1.0 | 252/1102, row 1, 0.9333333333333333 |
| four-of-four cohort (Stage A) | 262 | 273 |
| share in a near-duplicate cluster at 0.50 | 0.3869281045751634 | 0.3221415607985481 |

## Dual gate table (fresh hand labels vs frozen Stage A, n = 60)

| rule | gate A | gate B | precision on true | recall on true | row |
|---|---|---|---|---|---|
| R1_approval_gate | 0.5833333333333334 | 0.75 | 0.8571428571428571 | 0.75 | 4 |
| R2_state_file | 0.75 | 0.8 | 0.9285714285714286 | 0.5416666666666666 | 4 |
| R3_silence_rule | 0.8166666666666667 | 0.8833333333333333 | 0.85 | 0.8095238095238095 | 2 |
| R4_ownership_boundary | 0.9166666666666666 | 0.9166666666666666 | 0.9423076923076923 | 0.9607843137254902 | 1 |
| R5_stop_condition | 0.8333333333333334 | 0.8333333333333334 | 0.8444444444444444 | 0.926829268292683 | 4 |
| R6_undisclosed_capability | 0.5833333333333334 | 0.5833333333333334 | 0.34210526315789475 | 1.0 | 4 |
| R7_visible_secret | 1.0 | 1.0 | null | null | 1 |
| R8_injection_resistance | 0.9333333333333333 | 0.95 | 0.9230769230769231 | 0.8571428571428571 | 1 |

Rows: 1 = clears gate A (three-way agreement >= 0.85): corpus-wide true/false/unclear counts publishable as stated. 2 = fails gate A, clears gate B (binary true vs not-true >= 0.85): corpus-wide TRUE count publishable as a plain count with denominator; the false/unclear split is not. 3 = fails both gates, precision on true = 1.0: corpus-wide TRUE count publishable only as a LOWER BOUND (detector under-counts, never invents). 4 = fails everything: sample only, n = 60, with interval.

Confusion cells (hand/Stage A):
- R1: {"hand=false/stageA=false": 1, "hand=false/stageA=true": 2, "hand=false/stageA=unclear": 1, "hand=true/stageA=false": 7, "hand=true/stageA=true": 30, "hand=true/stageA=unclear": 3, "hand=unclear/stageA=false": 9, "hand=unclear/stageA=true": 3, "hand=unclear/stageA=unclear": 4}
- R2: {"hand=false/stageA=false": 8, "hand=false/stageA=true": 1, "hand=true/stageA=false": 10, "hand=true/stageA=true": 13, "hand=true/stageA=unclear": 1, "hand=unclear/stageA=false": 3, "hand=unclear/stageA=unclear": 24}
- R3: {"hand=false/stageA=false": 9, "hand=false/stageA=true": 3, "hand=true/stageA=false": 4, "hand=true/stageA=true": 17, "hand=unclear/stageA=false": 4, "hand=unclear/stageA=unclear": 23}
- R4: {"hand=false/stageA=false": 6, "hand=false/stageA=true": 3, "hand=true/stageA=false": 2, "hand=true/stageA=true": 49}
- R5: {"hand=false/stageA=false": 12, "hand=false/stageA=true": 7, "hand=true/stageA=false": 3, "hand=true/stageA=true": 38}
- R6: {"hand=false/stageA=false": 22, "hand=false/stageA=true": 25, "hand=true/stageA=true": 13}
- R7: {"hand=false/stageA=false": 60}
- R8: {"hand=false/stageA=unclear": 1, "hand=true/stageA=true": 12, "hand=true/stageA=unclear": 2, "hand=unclear/stageA=true": 1, "hand=unclear/stageA=unclear": 44}

## Sample design

n = 60, seed 20260904, stratified by repository, cap 12 per repository, allocation {"HAEGONG/grok-bot-profiles": 1, "HammeredSmithy/bull-trade": 2, "Octo-o-o-o/grok-job-kit": 1, "OpulentiaAI/gtm-agent-automations": 12, "PramodDutta/botskills": 7, "YannisKiefer/grokbot-x": 1, "ZeroPointRepo/GrokBotDev": 8, "ZooHero500/plays": 6, "codejunkie99/rosterroom": 5, "composio-community/awesome-grok-bots": 1, "divo12/awesome-grok-bot-templates": 1, "ellelion/botteams": 4, "galleonlabs/hypergrok-trading-desk": 2, "jaredtrichard/grok-factory": 1, "mergisi/awesome-grokbot": 6, "swcstudiospace/PumpGrok": 2}. Blind: packets carry text only, labels written before any Stage A finding for a sampled charter was read, Stage A frozen (run-two detectors unchanged), no label carried over from earlier runs.

## Hand-label guide (run one section 23, verbatim)

R1 true: a human yes is required before at least one six-family action, including `draft only, human sends`; false: such an action is instructed or permitted with no gate; unclear: no such action in scope, or only absolute prohibitions. R2/R3: true on an explicit cross-run memory / empty-run rule, false when the charter is scheduled or recurring and has none, unclear when on-demand. R4 true: a negation or scope exclusion attached to a concrete object (system, file, record, channel, people, money). R5 true: a named deliverable or terminal condition. R6 true: the body asks for a named tool/login/account that neither the opening role sentence nor a declared integrations/connectors/inputs block mentions, and that is not the literal instrument of the named job. R7 true: a real secret shape. R8 true/false/unclear per the spec.

## Sources and resolved commits

| repo | branch | commit SHA | added | status in strict corpus | strict charters |
|---|---|---|---|---|---|
| Chakhdz/grok-bot-token-saver | master | `fe82eb28665bdef430020999f448013e8491a203` | run three, 2026-09-05 | in | 1 |
| GlobalTC/steer | main | `2423bf4d347b6ec6c2208d7d5aa9ef6973e9c600` | run one manifest, reused at the pinned SHA | in | 3 |
| HAEGONG/grok-bot-profiles | main | `6f3d07e566008175486228a509bd8461e5efb85f` | run three, 2026-09-05 | in | 12 |
| HammeredSmithy/bull-trade | main | `11feb72876a9572746527521fe05e4cc48f00abd` | run three, 2026-09-05 | in | 28 |
| Heyvhuang/werewolf-gamemaster | main | `2f18703f30815a295d52f6c09812a076e8354329` | run three, 2026-09-05 | in | 1 |
| HxHippy/grok-bot-arch | main | `b7c44ba488f4da42d0006a3c126e597ac5a7d465` | run three, 2026-09-05 | in | 0 |
| Octo-o-o-o/grok-job-kit | main | `90894b2f42723dcae6e25c3e5252f1bfedec6019` | run three, 2026-09-05 | in | 10 |
| OpulentiaAI/gtm-agent-automations | main | `568371d0b5c5c0ed28597dcc93ac5b6ce938967f` | run one manifest, reused at the pinned SHA | in | 262 |
| PROJECT-073-X/grok-bot-workforce | main | `9786f76311c88ad3f12b9ec87ba995d9f994e332` | run three, 2026-09-05 | in | 1 |
| PramodDutta/botskills | main | `abe793060a7e7ad18e89e1f254e4ad0806556354` | run three, 2026-09-05 | in | 119 |
| WeSs1982/echo-chief-of-staff | main | `874dc50ec41637233f21bbc0f5256b938afa8b98` | run three, 2026-09-05 | in | 0 |
| WebDevJasonCameron/ExploreGrokBot | main | `58fe3532ccbd3aecf8af06ea4a3706ac659d8f8c` | run three, 2026-09-05 | in | 5 |
| YannisKiefer/grokbot-x | main | `cade7d95e2b60c2c60c53648d4d10ba87ae18443` | run three, 2026-09-05 | in | 10 |
| ZeroPointRepo/GrokBotDev | main | `d2aa69f8640e2ccef42f4b11b664e234c34c211d` | run one manifest, reused at the pinned SHA | in | 137 |
| ZooHero500/plays | main | `65fbafc806431ed079a03a03ad474710f65ad31f` | run one manifest, reused at the pinned SHA | in | 110 |
| codejunkie99/rosterroom | main | `a7ec5620c85ec19b1d1ac22321ccce531455484f` | run one manifest, reused at the pinned SHA | in | 80 |
| composio-community/awesome-grok-bots | main | `d732af02159bc2cc8f350422aaf09908822c2882` | run one manifest, reused at the pinned SHA | in | 20 |
| danielvegac/grok-bot-startup-services-outbound | main | `2ba35f365daa6eb7cf9cc7d52f6597b24c9aff24` | run three, 2026-09-05 | in | 4 |
| divo12/awesome-grok-bot-templates | main | `184d4cc50c34899c00d21ba87ce2eb82da887c27` | run three, 2026-09-05 | in | 10 |
| ellelion/botteams | main | `e478f8de0d6ee32b985dcb8c08d1d0fd5232bf9d` | run one manifest, reused at the pinned SHA | in | 70 |
| ethanolivertroy/grokbot-cloudflare-inbox | main | `9c994514f37738482186b4c422c875f573b4ed98` | run three, 2026-09-05 | in | 2 |
| fantomsuj/grokbot | main | `7cf5d3d97d8df426f63a40b06dd408379fa5dc11` | run three, 2026-09-05 | in | 0 |
| galleonlabs/hypergrok-trading-desk | main | `0274d9e2429ff68bef4fd05099deb3f0899fe593` | run three, 2026-09-05 | in | 27 |
| jaredtrichard/grok-factory | main | `2e9f8e55935e9ec3cb8c1fa823c64bd043c4351b` | run three, 2026-09-05 | in | 10 |
| jaredtrichard/grok-research | main | `957bf951721ba0004b7c8d61559d44810e3e6666` | run three, 2026-09-05 | in | 4 |
| jay-sahnan/growth-grok-bots | main | `8cf16436859e2dd3a47f40f1d328052f5a6e3c85` | run three, 2026-09-05 | in | 0 |
| kunchenguid/grok-ship | main | `ae1f5a787e544dcec69b819370615b2fcbef0eab` | run three, 2026-09-05 | in | 7 |
| lroolle/awesome-grokbot-templates | main | `a12c2684a994b17647841b882d89d27550323805` | run one manifest, reused at the pinned SHA | in | 0 |
| lsj210001/crew-contract | main | `06d24e73f55e6550bcc53d9a8bebea80c6170b0b` | run three, 2026-09-05 | in | 0 |
| mahathir69/technocore-safe | main | `96d7006d351a7d7de0130aecfb5c00c3a1a3722c` | run three, 2026-09-05 | in | 3 |
| matteoantoci/firstmate | master | `dc26ad39f5584f23c8408478c6799c2bd69b0a1f` | run one manifest, reused at the pinned SHA | in | 2 |
| mergisi/awesome-grokbot | main | `6210f2034c5737d1be100e227c8d308d9757ecf4` | run three, 2026-09-05 | in | 113 |
| mtrxdev/build-brief | main | `c158ee5333d956b18efc11be187e558485b6684b` | run three, 2026-09-05 | in | 3 |
| noam99moyal-sudo/podcast-summary-bot | main | `f9b8e871de6880646ff5ad2b6e2a0464dcd44b4f` | run three, 2026-09-05 | in | 1 |
| novusordos666/grokbot-outreach-agent-team | main | `4ea1fd613329f66a4c51c2f0c231afd0b471a18c` | run one manifest, reused at the pinned SHA | in | 6 |
| p10ns11y/botify | main | `8e249c3b84262f5c1eaadd1aa7441de5e28f7df5` | run three, 2026-09-05 | in | 2 |
| palehonk0-o/grokbot-market-memory | main | `9314e92d77b86c94df6e023e106c76927a91106d` | run three, 2026-09-05 | in | 6 |
| s-hiraoku/grok-bot-playbook | main | `306c7a12019b2e5aa6457f9f3607e8ff5692c689` | run three, 2026-09-05 | in | 0 |
| swcstudiospace/PumpGrok | main | `d16963a007b285f1a62687f7fc61c5506583559b` | run three, 2026-09-05 | in | 32 |
| tal-giladi/grokbot-field-guide | main | `cbdb6b1895f25b5adb2767622860ba33e35c32d2` | run one manifest, reused at the pinned SHA | in | 1 |
| AmitMirgal/orgbot-hub | main | `7f65a8011fa119c1ab4321d4437170bd6f8d3ea1` | run three, 2026-09-05 | dropped | 0 |
| Anil-matcha/awesome-grok-bot | master | `2412bacefee2cdc31ceb526443ad780a89a2a2cd` | run one manifest, reused at the pinned SHA | dropped | 0 |
| EndeavorYen/grok-bot-skills | main | `d1a0e777842821a95bcdab6c88c1a5ae37d0d194` | run three, 2026-09-05 | dropped | 0 |
| KinGao294/grok-bot-orange-book | main | `1f689f8c7c9143dcdbdbd6ae631f9bdcd8572b23` | run three, 2026-09-05 | dropped | 0 |
| Logos52/grok-bot-packets | main | `20903e2a2830010345f7227e1fa685c3722c8f9b` | run three, 2026-09-05 | dropped | 0 |
| Steltic/steltic_grokbot | main | `a76d5f315509b3a7c488844c6f1f0dfbb932785b` | run three, 2026-09-05 | dropped | 0 |
| Uncle-Gizmo/grok-bot-info | main | `e927c1836f80134c898ec94a40d2ce635c6c910a` | run three, 2026-09-05 | dropped | 0 |
| a70win-wq/usegrokbot | main | `49c1dd3182ed14d1d76a99be4034ce153323b2ca` | run three, 2026-09-05 | dropped | 0 |
| aaravarr/openbot | main | `b694d788b1e558112d0443943b1e0ba740075d92` | run three, 2026-09-05 | dropped | 0 |
| aaron-he-zhu/aaron-marketing-skills | main | `33dc05b0eeac3f78f4621ff898a1b84c04a65bda` | run one manifest, reused at the pinned SHA | dropped | 0 |
| andrewkittridge/grokory | main | `193608e9304de658a77e218c73fea02f41136867` | run three, 2026-09-05 | dropped | 0 |
| banana2556/cursor-grokbot-helper | main | `19af0152c015848d5a10bfe1c85d9143bef08929` | run three, 2026-09-05 | dropped | 0 |
| bcharleson/grokbot-peekaboo | main | `862172e0abfe15c1abf1efc538545fc5f214bb18` | run three, 2026-09-05 | dropped | 0 |
| cs68614-hash/awesome-grokbot-templates | main | `577e696d4a7c128760a7952636c2d10cccfcc9ca` | run three, 2026-09-05 | dropped | 0 |
| dadamingmax/Grok-Bot-Setup-and-Usage-Guide | main | `ad3f3fbb2ae40582379910710a5521d715e72f8c` | run three, 2026-09-05 | dropped | 0 |
| ddhjy/grok-bot-hub | main | `37e4ce343bee7cd05a972b1efda218232e525142` | run three, 2026-09-05 | dropped | 0 |
| dragosroua/grok-bot-add-plugin | main | `80459c4543d2845492fc64dc2ddc4a366e8564fd` | run three, 2026-09-05 | dropped | 0 |
| elie222/botdirectory.ai | main | `badedc0c985bf3e021634e3d7823ded02cd5545e` | run one manifest, reused at the pinned SHA | dropped | 0 |
| enderzcx/grok-bot-switch | main | `c612786ef8ec5e70c67fc691fea85cee1f06e724` | run three, 2026-09-05 | dropped | 0 |
| function1st/PhoneZero | main | `98a72eb9456477ba3985d4f7a7dc0a22c22c50d2` | run three, 2026-09-05 | dropped | 0 |
| hariou/technocore-grokbot-ja | master | `a442d32a6a6394826616407be9f8c20136e23e5f` | run three, 2026-09-05 | dropped | 0 |
| hesreallyhim/awesome-claude-code | main | `db4db53566d757e31d75536627747fcaef01d7f1` | run three, 2026-09-05 | dropped | 0 |
| jaskirat1616/grok-skills | main | `dfadd540f887c3834e9043a29e9ff402b48aaf66` | run three, 2026-09-05 | dropped | 0 |
| jblack4vols/grok-bot | main | `6f284805b7351e8022d3286624290d13cc3c5293` | run three, 2026-09-05 | dropped | 0 |
| jeremybrasher/grokbot-skills | main | `fa7d4587d50a589b46ed9c3576b5f340549e49a3` | run three, 2026-09-05 | dropped | 0 |
| jinank/great-grokbots | main | `1c318bf616d89574cc1ecde8758cf0c1950badd6` | run three, 2026-09-05 | dropped | 0 |
| kwakseongjae/awesome-grok-bot | main | `1023020613037e354c4526ec8ff2a26549566125` | run three, 2026-09-05 | dropped | 0 |
| kydlikebtc/awesome-grokbot | main | `00304a366a46657b43c2bdc061f3b69fa0f1db48` | run three, 2026-09-05 | dropped | 0 |
| lazerusrm/botrouter | main | `118f909ab0e4e16f15d8b932ced562d65f1dba38` | run three, 2026-09-05 | dropped | 0 |
| lureilly1/botjobs | main | `76e9a0e7491730d067d38c51385718b2232d244a` | run three, 2026-09-05 | dropped | 0 |
| mKay00/grok-bot-second-brain | master | `dfa5d1dc83e34f9a93346c703334027d030d8876` | run three, 2026-09-05 | dropped | 0 |
| maplefukku/grok-bot-ops | main | `c3e54f9e078698b4195abf9a130ed43ba8d4e3be` | run three, 2026-09-05 | dropped | 0 |
| matsutouya/note-kojo | main | `fbf79e2c3c5a60544e6fc3ba5a87105132568c55` | run three, 2026-09-05 | dropped | 0 |
| mostdesign01-sudo/grokbot-use-cases | main | `9cdb036e17099a6f08784219cfba5294a03883a6` | run three, 2026-09-05 | dropped | 0 |
| mozilla/diversity | master | `5e612f24d537b5e7b80ae0aa730c32e499b68db4` | run three, 2026-09-05 | dropped | 0 |
| napiermd/heavy-lift-cloud-agents | main | `3ebcbd91d5d2b0ab69f7f178570d3c24f07ae484` | run three, 2026-09-05 | dropped | 0 |
| nescafe2009/dsh-grokbot | main | `8a3b70813fe5aa720ecddd940d65ec8d58acd771` | run three, 2026-09-05 | dropped | 0 |
| njpatel/omabot | main | `801cb4b1dc3d20e75b43094aed36c3703e3f72e5` | run three, 2026-09-05 | dropped | 0 |
| owenisas/grokbot-openai | main | `bd2e81fe991f699d0d2482d665fef32be1088131` | run three, 2026-09-05 | dropped | 0 |
| pacifico-1106/grokbot-control-plane | main | `4162e5218537d3b3c6213a48195a556b01d3676c` | run three, 2026-09-05 | dropped | 0 |
| quolu/plaude | main | `7c18750f39df0ee5591c9fdacca6b9781dfd1890` | run three, 2026-09-05 | dropped | 0 |
| richard7463/askgrokwallet | main | `bc46298b059352171490390584fd895d92649a48` | run three, 2026-09-05 | dropped | 0 |
| rockyzhuo/grok-bot-blue-book | main | `ebb28026a630e70be8e3da578cf85d5919ed5e19` | run three, 2026-09-05 | dropped | 0 |
| shrdgn/grokbot-skills | main | `ab16e780a80ce74c701022dec726f9174e625f79` | run one manifest, reused at the pinned SHA | dropped | 0 |
| steve228uk/grok-bot-shopping | main | `c0a52b214e594973cf149aff3ad23068ef59c3ce` | run three, 2026-09-05 | dropped | 0 |
| thomasbek3/hermes-bot-kit | master | `13b446128ee2831d4a1bfa29bfabe0f772ed80c6` | run three, 2026-09-05 | dropped | 0 |
| tiankonglan/awesome-grok-bot-template | main | `826c52a67c816c7c1321f761d27219ff639afa99` | run three, 2026-09-05 | dropped | 0 |
| vercel/vercel-plugin | main | `7b0a6f61b254b0149bb644cadfb588a5c46df0c2` | run three, 2026-09-05 | dropped | 0 |
| zhulin025/LaoA-GrokBot | main | `527c3b5746bed34da3a6d4f9747e483c84534a41` | run three, 2026-09-05 | dropped | 0 |
| RongleCat/awesome-grok-bot | main | `e8af8ee56813e891657e63dafda90b5755ac021d` | run one manifest, reused at the pinned SHA | discovery only | 0 |
| majiayu000/awesome-grok-bot | main | `f7f692c71a6379f3849ad2df5bdf2e310b974268` | run one manifest, reused at the pinned SHA | discovery only | 0 |

## Decisions taken unattended

1. **Token handling.** The read-only token was read from the environment inside the two commands that needed it and sent only as an Authorization header. It was never written to a file, a log, a report or a URL. api.github.com was used for repository metadata only; tarballs were fetched from codeload by SHA and branch heads resolved with git ls-remote, as before.
2. **Harvest count differs from the plan's 358.** The two discovery lists contain 358 github links by raw count but 269 unique repositories after de-duplication and after dropping links to github pages that are not repositories. 16 of those were already in the run-one manifest, leaving 253 candidates.
3. **Repository-level exclusion by row text and description.** Each candidate was classified against the exclusion classes of 01_SOURCES.json from the awesome-list row text plus the api description and topics. Strong code-tool markers (mcp server, sdk, cli, proxy, router, bridge, package, port, alternative, ...) exclude regardless of charter hints; softer classes (plugin, docs) exclude only without a charter hint (prompts, roster, skills, templates, ...). Forks and archived repositories are excluded. Everything else was fetched and left to the file-level inclusion test, which is the real gate. The full classification is in work_v3/expansion_log.json.
4. **Run-one repositories reused at their pinned SHAs.** The 17 run-one repositories were not re-fetched; their tarballs and SHAs were copied into work_v3 unchanged, so the run-two corpus is a subset of this one by construction.
5. **Strict-corpus rule applied mechanically to every repository.** Run two dropped three repositories by name. Run three turns that into a rule so new repositories of the same kind are treated the same way: a repository whose accepted charters are at least half setup prompts (`set up a new bot for me`, `walk me through connecting`) or at least half Claude Code SKILL.md files is dropped from the strict corpus. The three run-two names are kept excluded even if a ratio moved. The classes per repository are in work_v3/repo_classes.json.
6. **Stage 2 decision.** Stage 2 (code search) runs only if stage 1 lands under 2000 charters. The outcome and, if used, every query string are recorded below and in numbers_v3.json extras.stage2_queries.
7. **Fresh blind sample, no carryovers.** A new stratified sample of 60 was drawn from the expanded strict corpus with seed 20260904 and a cap of 12 per repository. No run-two label was reused, even where a charter appears in both samples, because the plan says old labels do not transfer to a new corpus. Stage A was frozen (R5 fix and R7 shapes from run two, unchanged) before labelling.
8. **R7 before/after on this corpus.** The method page's R7 note needs a before/after count for this corpus. `before` emulates the run-two shapes on the run-two text layer (underscores removed), `after` is the current detector; both computed on the run-three strict corpus by audit/r7_rescan_v3.py.
9. **Site figures.** No corpus figure is typed anywhere on the site; numbers.json is a byte copy of numbers_v3.json and the build reads every count, share, row and repository from it. The source table gets branch and commit from the manifest export keyed by repository name.

## What this plan got wrong once it ran

1. The plan counted 358 github links in the discovery roots; de-duplicated and stripped of non-repository github pages they are 269 repositories, 16 of them already opened in run one. The harvest was 253 candidates, not 346.
2. Stage 1 landed at strict N = 1596, under the 2000 threshold, so stage 2 ran. The amendment then made stage 1 the headline and stage 2 a separate robustness line, which is the honest split: 1596 against 765 is the same sampling frame, the stage-2 line is not.
3. Expanding the frame cost detector reliability. On the run-two corpus five rules sat in row 1; on the expanded stage-1 corpus only R7 and R8 do, R3 drops to row 2, and R1, R2, R4, R5, R6 all fall to row 4. The confusion cells show why: the new repositories carry generic skill libraries, coding guides and copied articles that clear the mechanical inclusion test, and the detectors fire on incidental `never`, `done when` and consequential verbs in text that is not a charter. The hand labels mark those as unclear or false; Stage A marks them true or false.
4. The inclusion test as specified admits documents that are not charters once the source set is wide: a README for a language-learning app, a copied productivity article, generic Claude-style skills (dockerfile, go layering, code review). They pass on a role opener and directive density. The corpus definition was not loosened; it was never tight enough for an uncurated source set, and that is a finding about the test, not about the charters.
5. The `"grok bot" filename:SKILL.md` query brought in repositories of the same class removed in run two (Claude Code / Agent Skills convention). The mechanical strict rule caught some of them; the rest are counted separately in the stage-2 line so the reader can see their weight.
6. The broad `"agent roster" "you are" "never"` query returned 4192 results and 180 repositories with no Grok Bot mention; they were excluded by name (`not_grok_bot`) rather than fetched, because the corpus definition is Grok Bot charters.
7. Two code-search queries hit GitHub's secondary rate limit (HTTP 403) on one page each; those pages were not retried and the gap is logged in stage2_queries.json.
8. One repository in the harvest is `mozilla/diversity`, linked from an awesome-list footer; it was fetched, yielded no charter and stayed in the manifest as read. The classifier works on text and cannot know a link is decoration.
9. R7 stays at zero on 1596 charters with the widened shapes; one charter carries an email address, reported as an address, not a secret.
10. The stage-2 (code search) corpus is not a charter corpus. Its full extraction accepted 375076 candidates from 810313 files and de-duplicated to 110387, of which two skill-registry mirrors (majiayu000/claude-skill-registry, gabrielmoreira/agent-skills-mirror) hold 83 percent and five repositories hold over 90 percent. The mechanical strict rule (setup prompts or top-level SKILL.md at or above half of a repository's accepted charters) does not catch a registry mirror whose skill files sit under other names, and the not_grok_bot filter let them through because grok bot is mentioned in their descriptions or paths. Per the operator's decision on 2026-09-06 the run was left to finish as specified; section 6b reports the concentration and the N without the registry repositories next to the strict N, and the rule change (a repository-level exclusion class for registry mirrors) is left for a later run so this one stays reproducible.
11. The near-duplicate structure changes with the frame: at Jaccard 0.50 the largest family is still OpulentiaAI's 205, but the share of the corpus sitting in any family falls from 0.387 to 0.227 because the new repositories are more heterogeneous, not because copying stopped.
12. LINTCHA_07 block 1 (2026-09-06): every row of the stage-1 source table was read by hand against the unchanged test (the repository publishes text a person could paste into a bot profile as a role description). 28 repositories with charters were removed (494 charters at their run-three counts) and 18 zero-charter rows were marked out; the reasons are in work_v4/hand_review.json and in numbers extras.hand_review. The mechanical strict rule had passed them on formal grounds: skill libraries under names other than SKILL.md, tooling repositories, note banks, directories and guides. Strict N moved from 1596 to 1102 (a 31 percent cut), so the sample was redrawn (seed 20260904, 60 charters, 16 repositories) and labelled blind again.
13. After the cleanup the publication rows are: R4 ownership boundary row 1 (was row 4), R7 and R8 row 1 (unchanged), R3 row 2 (unchanged), R1, R2, R5, R6 row 4 (unchanged). R5 sits at 0.833 on gate A and 0.833 on gate B, under 0.85 on both, so it stays sample-only. The comparison block on the check page therefore shows three rules (R4, R3, R8) instead of two.
14. The removed repositories carried most of the false positives that had pushed R4 and R5 to row 4 in run three: skill playbooks and tooling docs full of incidental 'never' and 'done when'. Removing them by reading, not by a new rule, is what the plan asked for; the rule itself was not changed so the run stays reproducible from hand_review.json.

## Reproduction

```
GITHUB_TOKEN=<read-only token> python -m audit.gh_meta        # metadata, calls logged
python -m audit.expand                                          # classify + fetch by SHA
python -m audit.run3                                            # full + strict extraction, phase 3
python -m audit.cli sample --work work_v3 --packets work_v3/sample_blind
# label blind, then
python -m audit.cli agreement --work work_v3 --labels work_v3/sample_labels.jsonl
python -m audit.cohort work_v3
python -m audit.r7_rescan_v3 work_v3
python -m audit.report_v3
```
