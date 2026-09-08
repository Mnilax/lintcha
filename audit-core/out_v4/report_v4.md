# Grok Bot charter audit: report (run three, expanded strict corpus, stage 1 headline)

Corpus: Grok Bot charters published as plain text in public GitHub repositories, snapshot 2026-09-04, source set expanded on 2026-09-05 with the repositories linked from the two discovery lists. Strict corpus = every fetched repository minus setup-prompt directories and Claude Code skill libraries (not the unit of analysis). NOT a census of public Grok Bot templates; install-link directories are excluded because their configuration text lives on x.ai, which this project never fetches.
Every number carries its denominator in the same sentence and states the publication row it came from (row 1 corpus-wide as stated, row 2 corpus true count only, row 3 corpus true count as a lower bound, row 4 sample only with n = 60 and a Wilson 95% interval). Nothing is rounded.

## 1. Corpus

Source set (run three): 269 unique repository links in the two discovery lists, 253 harvested candidates beyond the run-one set: 74 fetched, 171 excluded by the standing exclusion classes, 8 failed. 89 repositories read in total. Sampling frame: curated lists. api.github.com calls: 774 (metadata only, read-only token, tarballs by SHA via codeload).

The headline corpus is stage 1: the run-one repositories at their pinned SHAs plus every repository linked from the two discovery lists that survived the exclusion classes, 40 repositories in the strict corpus after the mechanical strict rule (49 dropped: AmitMirgal/orgbot-hub, Anil-matcha/awesome-grok-bot, EndeavorYen/grok-bot-skills, KinGao294/grok-bot-orange-book, Logos52/grok-bot-packets, Steltic/steltic_grokbot, Uncle-Gizmo/grok-bot-info, a70win-wq/usegrokbot, aaravarr/openbot, aaron-he-zhu/aaron-marketing-skills, andrewkittridge/grokory, banana2556/cursor-grokbot-helper, bcharleson/grokbot-peekaboo, cs68614-hash/awesome-grokbot-templates, dadamingmax/Grok-Bot-Setup-and-Usage-Guide, ddhjy/grok-bot-hub, dragosroua/grok-bot-add-plugin, elie222/botdirectory.ai, enderzcx/grok-bot-switch, function1st/PhoneZero, hariou/technocore-grokbot-ja, hesreallyhim/awesome-claude-code, jaskirat1616/grok-skills, jblack4vols/grok-bot, jeremybrasher/grokbot-skills, jinank/great-grokbots, kwakseongjae/awesome-grok-bot, kydlikebtc/awesome-grokbot, lazerusrm/botrouter, lureilly1/botjobs, mKay00/grok-bot-second-brain, maplefukku/grok-bot-ops, matsutouya/note-kojo, mostdesign01-sudo/grokbot-use-cases, mozilla/diversity, napiermd/heavy-lift-cloud-agents, nescafe2009/dsh-grokbot, njpatel/omabot, owenisas/grokbot-openai, pacifico-1106/grokbot-control-plane, quolu/plaude, richard7463/askgrokwallet, rockyzhuo/grok-bot-blue-book, shrdgn/grokbot-skills, steve228uk/grok-bot-shopping, thomasbek3/hermes-bot-kit, tiankonglan/awesome-grok-bot-template, vercel/vercel-plugin, zhulin025/LaoA-GrokBot). Same inclusion test, same splitting rules, cap 3000 words, seed 20260904. Non-English charters (16) are excluded from every rate. Stage 2 (code search) is a separate robustness line in section 6b and is never merged into these figures.

| repo | branch | commit | files kept | charters in strict N |
|---|---|---|---|---|
| AmitMirgal/orgbot-hub | main | `7f65a8011fa119c1ab4321d4437170bd6f8d3ea1` | 20 | 0 |
| Chakhdz/grok-bot-token-saver | master | `fe82eb28665bdef430020999f448013e8491a203` | 5 | 1 |
| EndeavorYen/grok-bot-skills | main | `d1a0e777842821a95bcdab6c88c1a5ae37d0d194` | 20 | 0 |
| GlobalTC/steer | main | `2423bf4d347b6ec6c2208d7d5aa9ef6973e9c600` | 13 | 3 |
| HAEGONG/grok-bot-profiles | main | `6f3d07e566008175486228a509bd8461e5efb85f` | 22 | 12 |
| HammeredSmithy/bull-trade | main | `11feb72876a9572746527521fe05e4cc48f00abd` | 34 | 28 |
| Heyvhuang/werewolf-gamemaster | main | `2f18703f30815a295d52f6c09812a076e8354329` | 5 | 1 |
| HxHippy/grok-bot-arch | main | `b7c44ba488f4da42d0006a3c126e597ac5a7d465` | 3 | 0 |
| KinGao294/grok-bot-orange-book | main | `1f689f8c7c9143dcdbdbd6ae631f9bdcd8572b23` | 2 | 0 |
| Logos52/grok-bot-packets | main | `20903e2a2830010345f7227e1fa685c3722c8f9b` | 273 | 0 |
| Octo-o-o-o/grok-job-kit | main | `90894b2f42723dcae6e25c3e5252f1bfedec6019` | 16 | 10 |
| OpulentiaAI/gtm-agent-automations | main | `568371d0b5c5c0ed28597dcc93ac5b6ce938967f` | 289 | 262 |
| PROJECT-073-X/grok-bot-workforce | main | `9786f76311c88ad3f12b9ec87ba995d9f994e332` | 5 | 1 |
| PramodDutta/botskills | main | `abe793060a7e7ad18e89e1f254e4ad0806556354` | 139 | 119 |
| Steltic/steltic_grokbot | main | `a76d5f315509b3a7c488844c6f1f0dfbb932785b` | 1120 | 0 |
| Uncle-Gizmo/grok-bot-info | main | `e927c1836f80134c898ec94a40d2ce635c6c910a` | 2 | 0 |
| WeSs1982/echo-chief-of-staff | main | `874dc50ec41637233f21bbc0f5256b938afa8b98` | 17 | 0 |
| WebDevJasonCameron/ExploreGrokBot | main | `58fe3532ccbd3aecf8af06ea4a3706ac659d8f8c` | 16 | 5 |
| YannisKiefer/grokbot-x | main | `cade7d95e2b60c2c60c53648d4d10ba87ae18443` | 17 | 10 |
| ZeroPointRepo/GrokBotDev | main | `d2aa69f8640e2ccef42f4b11b664e234c34c211d` | 724 | 137 |
| ZooHero500/plays | main | `65fbafc806431ed079a03a03ad474710f65ad31f` | 291 | 110 |
| a70win-wq/usegrokbot | main | `49c1dd3182ed14d1d76a99be4034ce153323b2ca` | 13 | 0 |
| aaravarr/openbot | main | `b694d788b1e558112d0443943b1e0ba740075d92` | 19 | 0 |
| andrewkittridge/grokory | main | `193608e9304de658a77e218c73fea02f41136867` | 47 | 0 |
| banana2556/cursor-grokbot-helper | main | `19af0152c015848d5a10bfe1c85d9143bef08929` | 1 | 0 |
| bcharleson/grokbot-peekaboo | main | `862172e0abfe15c1abf1efc538545fc5f214bb18` | 2 | 0 |
| codejunkie99/rosterroom | main | `a7ec5620c85ec19b1d1ac22321ccce531455484f` | 83 | 80 |
| composio-community/awesome-grok-bots | main | `d732af02159bc2cc8f350422aaf09908822c2882` | 22 | 20 |
| cs68614-hash/awesome-grokbot-templates | main | `577e696d4a7c128760a7952636c2d10cccfcc9ca` | 13 | 0 |
| dadamingmax/Grok-Bot-Setup-and-Usage-Guide | main | `ad3f3fbb2ae40582379910710a5521d715e72f8c` | 1 | 0 |
| danielvegac/grok-bot-startup-services-outbound | main | `2ba35f365daa6eb7cf9cc7d52f6597b24c9aff24` | 5 | 4 |
| ddhjy/grok-bot-hub | main | `37e4ce343bee7cd05a972b1efda218232e525142` | 5 | 0 |
| divo12/awesome-grok-bot-templates | main | `184d4cc50c34899c00d21ba87ce2eb82da887c27` | 11 | 10 |
| dragosroua/grok-bot-add-plugin | main | `80459c4543d2845492fc64dc2ddc4a366e8564fd` | 7 | 0 |
| ellelion/botteams | main | `e478f8de0d6ee32b985dcb8c08d1d0fd5232bf9d` | 95 | 70 |
| enderzcx/grok-bot-switch | main | `c612786ef8ec5e70c67fc691fea85cee1f06e724` | 14 | 0 |
| ethanolivertroy/grokbot-cloudflare-inbox | main | `9c994514f37738482186b4c422c875f573b4ed98` | 3 | 2 |
| fantomsuj/grokbot | main | `7cf5d3d97d8df426f63a40b06dd408379fa5dc11` | 2 | 0 |
| function1st/PhoneZero | main | `98a72eb9456477ba3985d4f7a7dc0a22c22c50d2` | 28 | 0 |
| galleonlabs/hypergrok-trading-desk | main | `0274d9e2429ff68bef4fd05099deb3f0899fe593` | 34 | 27 |
| hariou/technocore-grokbot-ja | master | `a442d32a6a6394826616407be9f8c20136e23e5f` | 6 | 0 |
| hesreallyhim/awesome-claude-code | main | `db4db53566d757e31d75536627747fcaef01d7f1` | 11 | 0 |
| jaredtrichard/grok-factory | main | `2e9f8e55935e9ec3cb8c1fa823c64bd043c4351b` | 14 | 10 |
| jaredtrichard/grok-research | main | `957bf951721ba0004b7c8d61559d44810e3e6666` | 20 | 4 |
| jaskirat1616/grok-skills | main | `dfadd540f887c3834e9043a29e9ff402b48aaf66` | 196 | 0 |
| jay-sahnan/growth-grok-bots | main | `8cf16436859e2dd3a47f40f1d328052f5a6e3c85` | 1 | 0 |
| jblack4vols/grok-bot | main | `6f284805b7351e8022d3286624290d13cc3c5293` | 171 | 0 |
| jeremybrasher/grokbot-skills | main | `fa7d4587d50a589b46ed9c3576b5f340549e49a3` | 396 | 0 |
| jinank/great-grokbots | main | `1c318bf616d89574cc1ecde8758cf0c1950badd6` | 4 | 0 |
| kunchenguid/grok-ship | main | `ae1f5a787e544dcec69b819370615b2fcbef0eab` | 13 | 7 |
| kwakseongjae/awesome-grok-bot | main | `1023020613037e354c4526ec8ff2a26549566125` | 30 | 0 |
| kydlikebtc/awesome-grokbot | main | `00304a366a46657b43c2bdc061f3b69fa0f1db48` | 11 | 0 |
| lazerusrm/botrouter | main | `118f909ab0e4e16f15d8b932ced562d65f1dba38` | 14 | 0 |
| lroolle/awesome-grokbot-templates | main | `a12c2684a994b17647841b882d89d27550323805` | 2 | 0 |
| lsj210001/crew-contract | main | `06d24e73f55e6550bcc53d9a8bebea80c6170b0b` | 5 | 0 |
| lureilly1/botjobs | main | `76e9a0e7491730d067d38c51385718b2232d244a` | 2 | 0 |
| mKay00/grok-bot-second-brain | master | `dfa5d1dc83e34f9a93346c703334027d030d8876` | 43 | 0 |
| mahathir69/technocore-safe | main | `96d7006d351a7d7de0130aecfb5c00c3a1a3722c` | 4 | 3 |
| maplefukku/grok-bot-ops | main | `c3e54f9e078698b4195abf9a130ed43ba8d4e3be` | 75 | 0 |
| matsutouya/note-kojo | main | `fbf79e2c3c5a60544e6fc3ba5a87105132568c55` | 1 | 0 |
| matteoantoci/firstmate | master | `dc26ad39f5584f23c8408478c6799c2bd69b0a1f` | 4 | 2 |
| mergisi/awesome-grokbot | main | `6210f2034c5737d1be100e227c8d308d9757ecf4` | 180 | 113 |
| mostdesign01-sudo/grokbot-use-cases | main | `9cdb036e17099a6f08784219cfba5294a03883a6` | 8 | 0 |
| mozilla/diversity | master | `5e612f24d537b5e7b80ae0aa730c32e499b68db4` | 65 | 0 |
| mtrxdev/build-brief | main | `c158ee5333d956b18efc11be187e558485b6684b` | 19 | 3 |
| napiermd/heavy-lift-cloud-agents | main | `3ebcbd91d5d2b0ab69f7f178570d3c24f07ae484` | 2 | 0 |
| nescafe2009/dsh-grokbot | main | `8a3b70813fe5aa720ecddd940d65ec8d58acd771` | 10 | 0 |
| njpatel/omabot | main | `801cb4b1dc3d20e75b43094aed36c3703e3f72e5` | 1 | 0 |
| noam99moyal-sudo/podcast-summary-bot | main | `f9b8e871de6880646ff5ad2b6e2a0464dcd44b4f` | 2 | 1 |
| novusordos666/grokbot-outreach-agent-team | main | `4ea1fd613329f66a4c51c2f0c231afd0b471a18c` | 9 | 6 |
| owenisas/grokbot-openai | main | `bd2e81fe991f699d0d2482d665fef32be1088131` | 2 | 0 |
| p10ns11y/botify | main | `8e249c3b84262f5c1eaadd1aa7441de5e28f7df5` | 39 | 2 |
| pacifico-1106/grokbot-control-plane | main | `4162e5218537d3b3c6213a48195a556b01d3676c` | 43 | 0 |
| palehonk0-o/grokbot-market-memory | main | `9314e92d77b86c94df6e023e106c76927a91106d` | 9 | 6 |
| quolu/plaude | main | `7c18750f39df0ee5591c9fdacca6b9781dfd1890` | 148 | 0 |
| richard7463/askgrokwallet | main | `bc46298b059352171490390584fd895d92649a48` | 11 | 0 |
| rockyzhuo/grok-bot-blue-book | main | `ebb28026a630e70be8e3da578cf85d5919ed5e19` | 43 | 0 |
| s-hiraoku/grok-bot-playbook | main | `306c7a12019b2e5aa6457f9f3607e8ff5692c689` | 4 | 0 |
| shrdgn/grokbot-skills | main | `ab16e780a80ce74c701022dec726f9174e625f79` | 87 | 0 |
| steve228uk/grok-bot-shopping | main | `c0a52b214e594973cf149aff3ad23068ef59c3ce` | 7 | 0 |
| swcstudiospace/PumpGrok | main | `d16963a007b285f1a62687f7fc61c5506583559b` | 51 | 32 |
| tal-giladi/grokbot-field-guide | main | `cbdb6b1895f25b5adb2767622860ba33e35c32d2` | 1 | 1 |
| thomasbek3/hermes-bot-kit | master | `13b446128ee2831d4a1bfa29bfabe0f772ed80c6` | 28 | 0 |
| tiankonglan/awesome-grok-bot-template | main | `826c52a67c816c7c1321f761d27219ff639afa99` | 4 | 0 |
| vercel/vercel-plugin | main | `7b0a6f61b254b0149bb644cadfb588a5c46df0c2` | 311 | 0 |
| zhulin025/LaoA-GrokBot | main | `527c3b5746bed34da3a6d4f9747e483c84534a41` | 1 | 0 |

Robustness line: the full corpus at the same cap has N = 2282 (the excluded repositories add 1180 charters); its Stage A counts are listed per rule below for scale only and carry no publication row.

## 2. Counts

| stage | count |
|---|---|
| files scanned (strict repos) | 2228 | 
| files excluded by path class | 653 | 
| charter candidates after splitting | 1634 | 
| rejected: too short (< 40 words) | 186 | 
| rejected: too long (> 3000 words) | 4 | 
| rejected: not instruction text | 316 | 
| rejected: not English | 16 | 
| accepted before dedup | 1112 | 
| exact duplicates removed | 5 | 
| near-duplicate clusters (Jaccard >= 0.80) | 4 | 
| **final strict N** | **1102** | 

Copy-paste density on the strict corpus (plan 1.9), denominator 1102:

| Jaccard threshold | clusters of two or more | charters covered | largest cluster | shared block of the largest family (words) |
|---|---|---|---|---|
| >= 0.8 | 0 | 0 | 0 | n/a |
| >= 0.65 | 17 | 54 | 7 | 185 |
| >= 0.5 | 8 | 355 | 205 | 146 |

Share of the strict corpus sitting in any cluster of two or more at Jaccard 0.50: 355 of 1102, 0.3221415607985481. The largest family at 0.50 (205 charters, 1 repository) shares a contiguous block of 146 words; at 0.65 the largest family (7 charters) shares 185 words. Length only, no text.

## 3. Per rule

| rule | true | false | unclear | denominator | basis | row | gate A | gate B | precision on true | recall on true |
|---|---|---|---|---|---|---|---|---|---|---|
| R1_approval_gate | 40 | 4 | 16 | 60 | sample | 4 | 0.5833333333333334 | 0.75 | 0.8571428571428571 | 0.75 |
| R2_state_file | 24 | 9 | 27 | 60 | sample | 4 | 0.75 | 0.8 | 0.9285714285714286 | 0.5416666666666666 |
| R3_silence_rule | 329 | null | null | 1102 | corpus true count only | 2 | 0.8166666666666667 | 0.8833333333333333 | 0.85 | 0.8095238095238095 |
| R4_ownership_boundary | 956 | 146 | 0 | 1102 | corpus | 1 | 0.9166666666666666 | 0.9166666666666666 | 0.9423076923076923 | 0.9607843137254902 |
| R5_stop_condition | 41 | 19 | 0 | 60 | sample | 4 | 0.8333333333333334 | 0.8333333333333334 | 0.8444444444444444 | 0.926829268292683 |
| R6_undisclosed_capability | 13 | 47 | 0 | 60 | sample | 4 | 0.5833333333333334 | 0.5833333333333334 | 0.34210526315789475 | 1.0 |
| R7_visible_secret | 0 | 1102 | 0 | 1102 | corpus | 1 | 1.0 | 1.0 | null | null |
| R8_injection_resistance | 252 | 0 | 850 | 1102 | corpus | 1 | 0.9333333333333333 | 0.95 | 0.9230769230769231 | 0.8571428571428571 |

- **R1_approval_gate, row 4, sample only.** 40 of n = 60 sampled charters are `true` (share 0.6666666666666666, 95% CI [0.540566298666634, 0.7727090578407216]). Gate A 0.5833333333333334, gate B 0.75, precision on true 0.8571428571428571. The Stage A strict counts (true 623, false 351, unclear 128 of 1102) are NOT publishable and do not appear on the site.
- **R2_state_file, row 4, sample only.** 24 of n = 60 sampled charters are `true` (share 0.4, 95% CI [0.28569303003765506, 0.5263417560579315]). Gate A 0.75, gate B 0.8, precision on true 0.9285714285714286. The Stage A strict counts (true 324, false 301, unclear 477 of 1102) are NOT publishable and do not appear on the site.
- **R3_silence_rule, row 2.** Corpus-wide true count publishable: 329 of 1102 (share 0.2985480943738657, 95% CI [0.2722666848063472, 0.3262291576361871]); the false/unclear split (Stage A false 307, unclear 466) is not. Hand labels: true 21, false 12, unclear 27 of 60.
- **R4_ownership_boundary, row 1.** Corpus-wide: 956 of 1102 strict charters are `true` (share 0.867513611615245, 95% CI [0.8462144110698064, 0.8862593898796243]). Hand labels on the sample: true 51, false 9, unclear 0 of 60. Full-corpus Stage A for scale: true 1526, false 756, unclear 0 of 2282.
- **R5_stop_condition, row 4, sample only.** 41 of n = 60 sampled charters are `true` (share 0.6833333333333333, 95% CI [0.5576599505698345, 0.7869429415882567]). Gate A 0.8333333333333334, gate B 0.8333333333333334, precision on true 0.8444444444444444. The Stage A strict counts (true 830, false 272, unclear 0 of 1102) are NOT publishable and do not appear on the site.
- **R6_undisclosed_capability, row 4, sample only.** 13 of n = 60 sampled charters are `true` (share 0.21666666666666667, 95% CI [0.13122921046407016, 0.3362026834734252]). Gate A 0.5833333333333334, gate B 0.5833333333333334, precision on true 0.34210526315789475. The Stage A strict counts (true 720, false 382, unclear 0 of 1102) are NOT publishable and do not appear on the site.
- **R7_visible_secret, row 1.** Corpus-wide: 0 of 1102 strict charters are `true` (share 0.0, 95% CI [0.0, 0.003473915251515226]). Hand labels on the sample: true 0, false 60, unclear 0 of 60. Full-corpus Stage A for scale: true 0, false 2282, unclear 0 of 2282.
- **R8_injection_resistance, row 1.** Corpus-wide: 850 of 1102 strict charters are `unclear` (share 0.7713248638838476, 95% CI [0.7456108008959493, 0.7951538077062231]). Hand labels on the sample: true 14, false 1, unclear 45 of 60. Full-corpus Stage A for scale: true 381, false 0, unclear 1901 of 2282.

Rule notes:
- R7 visible secret, one line: 0 of 1102 strict charters carry a secret shape (raw shape hits before the placeholder filter {}, filtered as placeholders {}). The corpus is curated public repositories, where GitHub's push protection and secret scanning make a live key close to impossible, so this zero says the search was on the wrong surface, not that nobody leaks. No conclusion is drawn about the share-link surface, which this project never reads.
- R8, the publishable number is the silence: 850 of 1102 strict charters say nothing either way about whether content the bot reads can give it orders (row 1, agreement 0.9333333333333333). 252 of 1102 mark it untrusted. Exposed is never reported as zero: the detector found none of 1102, this run's sample found 1 in 60 and run one's sample on the full corpus found 1 in 60, so the detector's zero is a floor, not a fact.
- R6 undisclosed capability ask, row 4 from the sample: 13 of n = 60 (95% CI [0.13122921046407016, 0.3362026834734252]); the detector flags far more (precision on true 0.34210526315789475) because a system named in the body counts even when the job obviously needs it.
- R5 after the fix: gate A 0.8333333333333334 (run one 0.5), precision on true still 0.8444444444444444; on the 60 fresh sampled charters that could not have informed the fix, agreement is 0.8333333333333334.

## 4. The four core rules and the cohort that passes all of them

Core rules: R1_approval_gate, R2_state_file, R4_ownership_boundary, R5_stop_condition (unchanged from run two). Publication rows of the four: {"R1_approval_gate": 4, "R2_state_file": 4, "R4_ownership_boundary": 1, "R5_stop_condition": 4}. R1 and R2 are in row 4, so the corpus histogram is NOT publishable as a rate; the hand-label histogram (n = 60) is the publishable shape and the corpus histogram is scale only.

| core rules met | strict corpus (Stage A, 1102) | sample (hand labels, n = 60) | full corpus (Stage A, 2282, robustness) |
|---|---|---|---|
| 0 of 4 | 63 | 3 | 126 |
| 1 of 4 | 206 | 6 | 620 |
| 2 of 4 | 245 | 18 | 664 |
| 3 of 4 | 315 | 18 | 534 |
| 4 of 4 | 273 | 15 | 338 |

Zero of four: 63 of 1102 (Stage A), 3 of n = 60 by hand. Four of four: 273 of 1102 (Stage A), 15 of n = 60 by hand (share 0.25, 95% CI [0.1577638557841185, 0.372323109454848]). Scheduled-or-recurring without a state file: 301 of 601 (Stage A, R2 row 4, scale only); by hand 9 of 33 recurring sampled charters (95% CI [0.15067272656322814, 0.44217883254386814]). Without a silence rule: 307 of 601 (Stage A, R3 row 1, publishable); by hand 12 of 33 (95% CI [0.22186966167959873, 0.5338412737846591]).

### The four-of-four cohort (plan 1.8), Stage A over the strict corpus

Basis caveat: the cohort is an intersection of four detections; R4 and R5 are row 1, R1 and R2 are row 4 with precision on true 0.8571428571428571 and 0.9285714285714286, so a charter the detectors put in the cohort is very likely to belong there, while charters the detectors missed are not in it. The cohort count is therefore closer to a lower bound than a rate. The hand-label sample gives 15 of 60 four-of-four.

- Size: 273 of 1102 strict charters (share 0.24773139745916514).
- Repository distribution: {"OpulentiaAI/gtm-agent-automations": 234, "composio-community/awesome-grok-bots": 9, "ZeroPointRepo/GrokBotDev": 8, "HammeredSmithy/bull-trade": 4, "PramodDutta/botskills": 4, "codejunkie99/rosterroom": 4, "divo12/awesome-grok-bot-templates": 2, "mahathir69/technocore-safe": 2, "ellelion/botteams": 1, "galleonlabs/hypergrok-trading-desk": 1, "jaredtrichard/grok-factory": 1, "matteoantoci/firstmate": 1, "mergisi/awesome-grokbot": 1, "novusordos666/grokbot-outreach-agent-team": 1}. One repository supplies most of it: OpulentiaAI/gtm-agent-automations gives 234 of the 273 cohort charters (share 0.8571428571428571) while being 0.23774954627949182 of the strict corpus.
- Per-rule true rate inside the cohort against the rest (the four core rules are 1.0 inside by construction):

| rule | cohort (n=273) | rest (n=829) |
|---|---|---|
| R1_approval_gate | 1.0 | 0.4221954161640531 |
| R2_state_file | 1.0 | 0.061519903498190594 |
| R3_silence_rule | 0.8681318681318682 | 0.11097708082026538 |
| R4_ownership_boundary | 1.0 | 0.8238841978287093 |
| R5_stop_condition | 1.0 | 0.6718938480096501 |
| R6_undisclosed_capability | 0.9487179487179487 | 0.5560916767189384 |
| R7_visible_secret | 0.0 | 0.0 |
| R8_injection_resistance | 0.8315018315018315 | 0.030156815440289506 |

- Median word count: cohort 350, rest 232.
- Rarest core rule overall (binding constraint): R2_state_file. Overall true rates: {"R1_approval_gate": 0.5653357531760436, "R2_state_file": 0.294010889292196, "R4_ownership_boundary": 0.867513611615245, "R5_stop_condition": 0.7531760435571688}.
- Three most common surface forms per core rule inside the cohort, by charters using the form (each at most 15 words, deduplicated, unattributed). Because one family supplies 234 of 273 cohort charters, a second list counts only the 39 cohort charters outside that family.
  - R1_approval_gate, all cohort: `never execute it unless i type "send" (or the documented confirm word) in that moment` (223); `global approval gate human approval is required before sending, publishing, spending, deleting, contacting people, changing` (4); `never send messages or contact people without explicit approval` (4)
  - R1_approval_gate, outside the largest family: `global approval gate human approval is required before sending, publishing, spending, deleting, contacting people, changing` (4); `never send messages or contact people without explicit approval` (4); `the closest supported thing is a routine that generates proposals for the user to approve` (2)
  - R2_state_file, all cohort: `if you already posted this run's output for the same trigger id, stop` (223); `do not reuse cached state from a prior run` (223); `do not post a second copy` (223)
  - R2_state_file, outside the largest family: `keep a log of runs under strategies/ /runs/` (2); `md - how the team fits together, and why account reads go through a shared` (1); `you read equity, buying power, positions and open orders through the desk's shared state cache` (1)
  - R4_ownership_boundary, all cohort: `stay inside this job` (223); `do not post a second copy` (223); `do not become inbox manager, calendar ea, or a general researcher unless this prompt says` (223)
  - R4_ownership_boundary, outside the largest family: `this is not an official grok import file` (9); `specialists work only inside their stated ownership and return drafts to the lead` (4); `never change, delete, publish, file, deploy, or overwrite live records` (4)
  - R5_stop_condition, all cohort: `draft any send, reply, calendar write, ticket, publish, charge, or merge` (223); `what good looks like` (4); `operating contract the lead owns prioritization, delegation, quality control, and the final packet` (4)
  - R5_stop_condition, outside the largest family: `what good looks like` (4); `operating contract the lead owns prioritization, delegation, quality control, and the final packet` (4); `specialists work only inside their stated ownership and return drafts to the lead` (4)

## 5. Consequential and ungated

Basis: **sample** (R1 row 4). consequential_capability_present: 44 (sampled charters (n=60) hand-labelled as containing at least one live consequential action). consequential_ungated: 4 of those 44, share 0.09090909090909091, 95% CI [0.035921611478836546, 0.21159519397917487]. Stage A strict variant (NOT publishable, scale only): 351 ungated of 974, share 0.3603696098562628. Family mentions in the strict corpus (Stage A): {"SEND": 798, "PUBLISH": 755, "PAY": 540, "DELETE": 253, "SIGN": 65, "TRADE": 451} of 1102.


## 6b. Stage-2 corpus, robustness line only (frame: code search)

Stage 2 changes what the corpus is, from "published in curated lists" to "found by GitHub code search". It is reported here as a separate line and is never merged into the headline. Strict N under the same rule: 109794 (full 110387). Stage A counts only, no hand-labelled sample, no publication row.

| rule | true | false | unclear | denominator |
|---|---|---|---|---|
| R1_approval_gate | 7929 | 63956 | 37909 | 109794 |
| R2_state_file | 16680 | 11136 | 81978 | 109794 |
| R3_silence_rule | 4303 | 13466 | 92025 | 109794 |
| R4_ownership_boundary | 59214 | 50580 | 0 | 109794 |
| R5_stop_condition | 50624 | 59170 | 0 | 109794 |
| R6_undisclosed_capability | 52798 | 56996 | 0 | 109794 |
| R7_visible_secret | 172 | 109622 | 0 | 109794 |
| R8_injection_resistance | 6929 | 6 | 102859 | 109794 |

The query `"grok bot" filename:SKILL.md` added 76 repositories. SKILL.md is the Claude Code / Agent Skills convention, the contamination class removed in run two. Of those repositories, 2 were dropped by the strict rule (SpillwaveSolutions/claude-code-ager, lonormaly/worktree-zero), 57 yielded 2164 charters in the full stage-2 extraction, and 2160 charters from 55 of them survive in the strict stage-2 corpus: 2160 of its 109794 (share 0.01967320618613039). That share is small.

Concentration. 276 repositories yield charters, but five hold 0.911078929631856 of the corpus: majiayu000/claude-skill-registry 51344 (0.4676393974169809, code search); gabrielmoreira/agent-skills-mirror 40449 (0.36840810973277227, code search); lawrence3699/agent-skills-corpus 4644 (0.042297393300180335, code search); mcorbett51090/RavenClaude 2187 (0.019919121263457018, code search); Neuroca-Inc/Perfect_Prompts 1407 (0.01281490791846549, code search). 5 repositories carry 1000 charters or more (majiayu000/claude-skill-registry 51344, gabrielmoreira/agent-skills-mirror 40449, lawrence3699/agent-skills-corpus 4644, mcorbett51090/RavenClaude 2187, Neuroca-Inc/Perfect_Prompts 1407); without them the strict stage-2 N would be 9763. 108347 charters come from code-search repositories and 1447 from the stage-1 repositories. The mechanical strict rule did not catch these registry mirrors because their files are neither setup prompts nor top-level SKILL.md files, so the stage-2 line describes what code search surfaces (mirrors of skill registries) far more than it describes Grok Bot charters. The rule was left as specified and this is reported rather than fixed after the fact.

## 6. What this does not show

- This is repository-published charter text, not a census of public Grok Bot templates. The strict corpus is 1102 charters from 40 repositories, and one template family (OpulentiaAI, 262 charters) is 0.23774954627949182 of it and 0.8571428571428571 of the four-of-four cohort. Every rate above is partly a description of that family.
- Text is not behaviour. A charter with an approval line can still be run without one, and a charter without one may be run by a careful operator.
- R1 and R2, the two rules the headline metric and the cohort depend on, sit in row 4. Their sample numbers carry intervals of about plus or minus 12 points at n = 60.
- Near-duplicate removal at the specified 0.80 threshold merges nothing in the strict corpus; at 0.50, 0.3221415607985481 of it sits in a cluster. `final N` counts template instances, not independently written charters.
- No claim about whether any charter works, or about any named author, is made or implied.

## 7. Side by side with run two

| figure | run two | run three |
|---|---|---|
| strict N | 765 | 1102 |
| repositories in strict corpus | 12 | 40 |
| four-of-four cohort (Stage A) | 262 | 273 |
| share in a near-duplicate cluster at 0.50 | 0.3869281045751634 | 0.3221415607985481 |
| R1_approval_gate: Stage A true / denominator, row, gate A | 541 / 765, row 4, 0.7666666666666667 | 623 / 1102, row 4, 0.5833333333333334 |
| R2_state_file: Stage A true / denominator, row, gate A | 291 / 765, row 4, 0.65 | 324 / 1102, row 4, 0.75 |
| R3_silence_rule: Stage A true / denominator, row, gate A | 267 / 765, row 1, 0.8833333333333333 | 329 / 1102, row 2, 0.8166666666666667 |
| R4_ownership_boundary: Stage A true / denominator, row, gate A | 645 / 765, row 1, 0.9 | 956 / 1102, row 1, 0.9166666666666666 |
| R5_stop_condition: Stage A true / denominator, row, gate A | 673 / 765, row 1, 0.9166666666666666 | 830 / 1102, row 4, 0.8333333333333334 |
| R6_undisclosed_capability: Stage A true / denominator, row, gate A | 549 / 765, row 4, 0.65 | 720 / 1102, row 4, 0.5833333333333334 |
| R7_visible_secret: Stage A true / denominator, row, gate A | 0 / 765, row 1, 1.0 | 0 / 1102, row 1, 1.0 |
| R8_injection_resistance: Stage A true / denominator, row, gate A | 228 / 765, row 1, 1.0 | 252 / 1102, row 1, 0.9333333333333333 |
| consequential ungated, hand sample | 1 of 51 (n=60) | 4 of 44 (n=60) |
