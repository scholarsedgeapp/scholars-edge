// ── strategy-course.js ────────────────────────────────────────────────────
// Module 5: Strategy Course — 54 techniques, mastery engine, 4-screen UI
// ─────────────────────────────────────────────────────────────────────────
const StrategyCourseModule = (() => {
  'use strict';

  // ── SECTIONS ──────────────────────────────────────────────────────────────
  const SECTIONS = {
    A:{ id:'A', name:'Universal Strategies',   shortName:'Universal',  icon:'compass',     color:'#1B2A4A', desc:'Foundation techniques that apply to every question — RW and Math. Start here.',                                    codes:['U1','U2','U3','U4','U5','U6','U7'] },
    B:{ id:'B', name:'Reading: Elimination',   shortName:'Elimination',icon:'eye-off',     color:'#2ABFBF', desc:'The 8 trap types on every Reading question. Learn the traps and wrong answers become predictable.',              codes:['R1','R2','R3','R4','R5','R6','R7','R8'] },
    C:{ id:'C', name:'Reading: Passage',       shortName:'Passage',    icon:'search',      color:'#2ABFBF', desc:'How to navigate passages efficiently — predicting answers, finding evidence, handling main-idea questions.',     codes:['R9','R10','R11','R12','R13'] },
    D:{ id:'D', name:'Grammar & Writing',      shortName:'Grammar',    icon:'type',        color:'#6C63FF', desc:'The SAT tests grammar through logic, not rule names. Seven pattern-recognition techniques.',                    codes:['G1','G2','G3','G4','G5','G6','G7'] },
    E:{ id:'E', name:'Math: Core Strategies',  shortName:'Math Core',  icon:'calculator',  color:'#F4B942', desc:'Nine core strategies that cut time on every math question.',                                                     codes:['M1','M2','M3','M4','M5','M6','M7','M8','M9'] },
    F:{ id:'F', name:'Math: Desmos',           shortName:'Desmos',     icon:'trending-up', color:'#F4B942', desc:'Six Desmos techniques that turn the calculator into a weapon.',                                                  codes:['M10','M11','M12','M13','M14','M15'] },
    G:{ id:'G', name:'CLT Strategies',         shortName:'CLT',        icon:'book',        color:'#20B2AA', desc:'Specialized techniques for the CLT — tone mapping, argument structure, root decoding.',                        codes:['C1','C2','C3','C4'] },
    H:{ id:'H', name:'Mindset & Test-Day',     shortName:'Mindset',    icon:'zap',         color:'#FF6B6B', desc:'The mental game. These prevent the "I knew it but blanked" failures that cost 50+ points.',                   codes:['MN1','MN2','MN3','MN4','MN5'] },
  };

  // ── STRATEGIES ────────────────────────────────────────────────────────────
  const STRATEGIES = {
    U1:{ code:'U1', name:'Think Like the Test Maker', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Every wrong answer is wrong for a specific, defensible reason. Your job is to find that reason — not just the best-sounding choice.',
      why:'SAT wrong answers follow predictable trap patterns. Recognizing the pattern eliminates choices without needing to know the content cold.',
      trigger:'Use on any question where two choices both seem plausible.',
      mistake:'Picking an answer that "sounds smart" — the test rewards precision, not plausibility.',
      example:{ context:'Reading · Inference',
        passage:'Coral reefs cover less than 1% of the ocean floor but support approximately 25% of all marine species. Bleaching events have increased dramatically in frequency since the 1980s. Some reefs have experienced complete bleaching three times in the past decade.',
        q:'Which best describes the central tension in the passage?',
        c:['Coral reefs are entirely gone from modern oceans','Coral reefs are disproportionately important yet increasingly threatened','Marine biodiversity depends exclusively on coral reefs','Scientists have failed to study bleaching adequately'],
        a:1, steps:['A: "entirely gone" — extreme; passage says reefs exist. Eliminate.','C: "exclusively" — passage says 25%, not 100%. Eliminate.','D: "failed to study" — passage never discusses scientific response. Out of scope. Eliminate.','B: two facts — high importance (25%) + growing threat (bleaching). No extreme language. Correct.'] }
    },
    U2:{ code:'U2', name:'Module 1 Mastery Protocol', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Module 1 routes you to harder or easier Module 2 questions. A strong Module 1 unlocks the path to 700+ section scores.',
      why:'The adaptive structure means Module 1 effort has 2× the payoff of equivalent effort in Module 2.',
      trigger:'Activate this mindset at the start of every practice test and every real SAT.',
      mistake:'Rushing Module 1 because "it\'s just Module 1." Every wrong answer there both lowers score AND routes you to easier Module 2 questions.',
      example:{ context:'Test Strategy', passage:null,
        q:'Krystal finishes 12 of 27 Module 1 questions in 20 min and speeds through the rest. What is the error?',
        c:['She should have skipped more questions','Speed-rushing sacrifices accuracy on questions that determine her Module 2 path','She should have started with hardest questions','There is no error — finishing early shows mastery'],
        a:1, steps:['Module 1 determines your difficulty path. Wrong answers here cost double.','Skipping hard questions is fine (see U4). Rushing medium ones is not.','Speed introduces careless errors on questions she would normally get right.','The protocol: use all 35 minutes. Check answers. Never rush Module 1.'] }
    },
    U3:{ code:'U3', name:'Difficulty-Weighted Decision Making', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Not all questions cost the same. Missing an easy question is worse than missing a hard one. Allocate time based on question position.',
      why:'Questions are roughly ordered by difficulty. Easy questions (#1-9) are lower-cost mistakes and higher-probability wins.',
      trigger:'When you have 8 minutes or less with multiple questions remaining.',
      mistake:'Spending 4 minutes on question #24 when questions #14-17 are still unanswered.',
      example:{ context:'Test Strategy', passage:null,
        q:'With 8 min left, Krystal has 5 questions remaining: #17, #19, #22, #24, #27. Correct order?',
        c:['In order: 17, 19, 22, 24, 27','Hardest first: 27, 24, 22, 19, 17','Skip all and guess','Do #17 and #19 fully, then guess on #22-27 if time runs out'],
        a:3, steps:['#17 and #19 are likely medium — higher probability of correct.','#22-27 are harder — lower probability and more time-consuming.','With 8 min for 5 questions (96s each), prioritize the easier positions fully.','Guess on the rest. No penalty for wrong answers.'] }
    },
    U4:{ code:'U4', name:'Skip and Return', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'If a question takes more than 60 seconds without clear progress, skip it, mark it in Bluebook, and move on. Always guess before time runs out — no penalty.',
      why:'A stuck question burns time and poisons mental state. Fresh eyes on return solve 40% of previously stuck questions.',
      trigger:'Any question where you\'ve read it twice and still have no clear path.',
      mistake:'Staying on a stuck question past 90 seconds. Diminishing returns kick in hard after 60 seconds of confusion.',
      example:{ context:'Test Strategy', passage:null,
        q:'Krystal has been on Q17 for 2 min with 15 min left. She\'s down to 2 choices. What should she do?',
        c:['Keep working until certain','Pick one of the two, flag it, move forward immediately','Skip with no guess and move on','Go back to Q1 and restart'],
        a:1, steps:['She\'s at 50/50 — that\'s not bad odds. Pick one.','Flag it in Bluebook. She can return if time permits.','With 15 min left, she can\'t afford another 2 min here.','Critically: she has already guessed, so no blank answer.'] }
    },
    U5:{ code:'U5', name:'Predict Before You Read Choices', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Before looking at the four choices, form your own answer from the passage. Then find the choice that matches your prediction.',
      why:'Wrong choices are designed to look plausible. A prediction acts as a filter — without it, every trap answer is a threat.',
      trigger:'Every Reading question and grammar questions where you can hear the right version.',
      mistake:'Reading all four choices before forming any prediction. This is how trap answers hook you.',
      example:{ context:'Reading · Evidence',
        passage:'Urban heat islands form when pavement and buildings replace natural land cover, absorbing and retaining heat. Green infrastructure — trees, parks, green roofs — can significantly reduce this effect.',
        q:'Which best describes what green infrastructure does according to the passage?',
        c:['Completely eliminates urban heat islands','Replaces all pavement in cities','Reduces the heat retention effect significantly','Increases urban temperatures'],
        a:2, steps:['Predict first: "reduces the heat island effect" (passage says "significantly reduce").','A: "completely eliminates" — extreme. No match.','B: "replaces all pavement" — never stated. No match.','D: opposite of passage. C matches prediction exactly.'] }
    },
    U6:{ code:'U6', name:'Error Pattern Logging', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Track wrong answers by type: (1) Content gap, (2) Trap triggered, (3) Careless error, (4) Time pressure. Each type has a different fix.',
      why:'Logging by type tells you what to work on. Without it, you study everything and improve nothing efficiently.',
      trigger:'After every practice set or full test. Takes 5 minutes. Prevents repeating same mistakes.',
      mistake:'Reviewing only which questions you got wrong without diagnosing why.',
      example:{ context:'Math · Error Type', passage:null,
        q:'Krystal solves 2x + 4 = 14 correctly (x=5) but the question asks for 3x − 2. She almost submits x=5. What error type is this?',
        c:['Content gap','Careless error — solved correctly but didn\'t finish reading the question','Trap triggered — x=5 is a planted wrong answer','Time pressure'],
        a:1, steps:['She correctly solved x=5. No content gap.','The question asked for 3x−2 = 3(5)−2 = 13. She stopped reading early.','This is careless: right sub-problem, wrong final answer.','Log it: "Underline what the question is actually asking for before starting."'] }
    },
    U7:{ code:'U7', name:'60-Second Rule', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Target 60 seconds on easy questions (banks time for hard ones). Hard cap: 2 minutes on any question before guessing and moving.',
      why:'Most score losses aren\'t from hard questions — they\'re from spending 4 minutes on one question and missing easier ones later.',
      trigger:'Glance at the clock every 5-7 questions during every practice session.',
      mistake:'Not watching the clock. Students who don\'t monitor time consistently run out on the last 4-6 questions.',
      example:{ context:'Test Strategy', passage:null,
        q:'27 Math questions, 35 minutes. Krystal averages 90s on the first 10 and 2 min on the next 7. Time left for final 10?',
        c:['About 18 minutes','About 10 minutes','About 6 minutes','About 14 minutes'],
        a:2, steps:['First 10: 10 × 90s = 15 min. Next 7: 7 × 120s = 14 min.','Total used: 29 min. Remaining: 35 − 29 = 6 min for 10 questions.','That\'s 36 seconds each — not enough for careful work.','Target 60s on easy, 90s on medium, cap at 120s on hard.'] }
    },
    R1:{ code:'R1', name:'Extreme Language Elimination', section:'B',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Any choice containing "always," "never," "only," "completely," "entirely," "all," or "none" is almost always wrong. The SAT favors qualified claims.',
      why:'Extreme claims are easy to disprove with a single counterexample. The test writes wrong answers using absolute language to create that vulnerability.',
      trigger:'Scan every choice for absolute words before reading the passage.',
      mistake:'Picking an extreme choice because it "sounds confident." Precision is the standard, not confidence.',
      example:{ context:'Reading · Main Idea',
        passage:'Monarch butterflies migrate up to 3,000 miles between Canada and Mexico, navigating via a time-compensated sun compass and Earth\'s magnetic field. Habitat loss has contributed to population declines, though populations have shown partial recovery in some years.',
        q:'Which best characterizes monarch navigation?',
        c:['Monarchs rely entirely on Earth\'s magnetic field','Monarch navigation uses multiple systems including solar and magnetic cues','Monarchs have completely lost their migration ability','Only scientists can track monarch migration'],
        a:1, steps:['A: "entirely" — passage says both sun compass AND magnetic field. Eliminate.','C: "completely lost" — directly contradicted by "partial recovery." Eliminate.','D: "Only scientists" — extreme and not in passage. Eliminate.','B: "multiple systems" — matches passage precisely. No extreme language.'] }
    },
    R2:{ code:'R2', name:'Recycled Language Trap', section:'B',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Wrong answers often copy exact words from the passage but twist their meaning. The words look familiar, but the context has shifted.',
      why:'Students trust familiar vocabulary. The test exploits this by reusing passage words in choices that distort actual meaning.',
      trigger:'When a choice contains 3+ exact words from the passage, verify the meaning hasn\'t been twisted.',
      mistake:'Choosing an answer because it "uses the author\'s words" without checking whether the meaning matches.',
      example:{ context:'Reading · Inference',
        passage:'John Locke argued that personal identity persists through psychological continuity — specifically, through memory. A person at 40 is the same as at 10 insofar as they remember their experiences.',
        q:'What is the basis of Locke\'s theory of personal identity?',
        c:['Identity depends on physical continuity of the brain','Identity is based on memory and psychological continuity','Locke\'s theory was rejected because of amnesia cases','Identity requires continuous age from birth'],
        a:1, steps:['A uses "continuity" (a passage word) but applies it to the BRAIN (physical), not memory (psychological). Recycled + distorted. Eliminate.','C: "rejected" — passage says philosophers "debated," not rejected. Eliminate.','D: "continuous age" — never stated. Eliminate.','B: memory + psychological continuity — exactly what the passage states.'] }
    },
    R3:{ code:'R3', name:'Half-Right Elimination', section:'B',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Some wrong answers are correct about one part of their claim but wrong about another. The entire answer must be accurate — half-right is all-wrong.',
      why:'The correct half triggers recognition, causing students to stop evaluating. You must verify every component of a choice.',
      trigger:'When an answer has two distinct claims joined by "and," "while," or "because." Verify both parts.',
      mistake:'Stopping evaluation when the first part of an answer seems right.',
      example:{ context:'Reading · Evidence',
        passage:'Urban planner Amara Reyes found that mixed-use zoning reduced commute times by 18%. However, property values increased sharply, displacing lower-income residents. Reyes acknowledged that efficiency gains came at a cost to equity.',
        q:'Which best describes the outcome of mixed-use zoning in Reyes\'s study?',
        c:['Improved efficiency and had no effect on equity','Both reduced commute times and increased property values, with equity costs','Efficiency gains always outweigh equity concerns','Displacement was unrelated to zoning changes'],
        a:1, steps:['A: "improved efficiency" ✓ but "no effect on equity" ✗ — passage says equity cost. Half-right. Eliminate.','C: "always outweigh" — extreme and Reyes acknowledged the cost. Eliminate.','D: passage explicitly links displacement to rezoning. Eliminate.','B: reduced commute ✓ + increased property values ✓ + equity costs ✓. Both parts accurate.'] }
    },
    R4:{ code:'R4', name:'Could-Be-True Trap', section:'B',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'A choice can be true in the real world but wrong on the SAT if the passage doesn\'t support it. Only what the passage says counts.',
      why:'Students apply outside knowledge to justify choices. The SAT is closed-world — only passage evidence matters.',
      trigger:'When you find yourself thinking "well, that could be true…" — stop. Does the PASSAGE say it?',
      mistake:'Using background knowledge to validate a choice the passage never addresses.',
      example:{ context:'Reading · Inference',
        passage:'Historian Dr. Vasquez found that medieval monasteries owned mechanical clocks before secular institutions because the monastic schedule — with fixed hours for prayer — created a practical demand for timekeeping precision that merchants lacked.',
        q:'Why did monasteries acquire clocks before secular institutions, according to Vasquez?',
        c:['Monks were more technologically sophisticated','Monasteries had greater wealth','The fixed prayer schedule created a practical need for precise timekeeping','Mechanical clocks were invented by monks'],
        a:2, steps:['A: "more sophisticated" — plausible, but passage doesn\'t say this. Vasquez\'s argument is about demand. Eliminate.','B: "greater wealth" — plausible historically, but never stated. Could-be-true trap. Eliminate.','D: "invented by monks" — never stated. Eliminate.','C: exactly Vasquez\'s stated argument — fixed prayer hours → demand for precision.'] }
    },
    R5:{ code:'R5', name:'Opposite Trap', section:'B',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Some wrong answers state the exact opposite of what the passage says. Train yourself to notice when a choice directly contradicts the text.',
      why:'Under time pressure, students sometimes reverse cause/effect or flip comparisons without realizing it.',
      trigger:'Any choice that makes a directional claim — more/less, increase/decrease, caused/prevented.',
      mistake:'Not going back to verify the direction of a relationship in the passage.',
      example:{ context:'Reading · Cause-Effect',
        passage:'Wolves reintroduced to Yellowstone in 1995 caused elk to avoid open valleys. This allowed vegetation to recover, which stabilized riverbanks, slowed water flow, and deepened river channels.',
        q:'What was the relationship between wolf reintroduction and river channels?',
        c:['Wolves directly altered channels through dam-building','Wolf predation → elk movement → vegetation recovery → river channel deepening','River channel changes caused elk movement, which attracted wolves','Wolves prevented vegetation recovery by overhunting'],
        a:1, steps:['A: wolves don\'t build dams — that\'s beavers, and not mentioned. Eliminate.','C: reverses the causal chain. Passage says wolves caused the chain, not the other way. Opposite trap. Eliminate.','D: "prevented vegetation recovery" — opposite of what the passage says. Eliminate.','B: traces the exact causal chain from the passage. Correct.'] }
    },
    R6:{ code:'R6', name:'True But Irrelevant', section:'B',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'A choice can be accurate and passage-supported but fail to answer the specific question asked. "True" isn\'t the standard — "answers this question" is.',
      why:'Students relax when they find a "true" choice. The test places true-but-off-topic choices alongside the correct one.',
      trigger:'After finding an answer that seems correct, re-read the question stem once more.',
      mistake:'Selecting the first accurate choice without confirming it addresses what was asked.',
      example:{ context:'Reading · Question Focus',
        passage:'Architect Yaw Osei\'s sun-tracking skylights reduced electricity use by 40%. His firm also used reclaimed materials in 80% of projects. Osei cited the skylight system as his most commercially significant innovation.',
        q:'Which aspect does the passage identify as most commercially significant?',
        c:['His use of reclaimed materials in 80% of projects','His sun-tracking skylight system','His decision to reduce electricity use','His firm\'s overall sustainability philosophy'],
        a:1, steps:['A: reclaimed materials is mentioned ✓ — but question asks what Osei called MOST COMMERCIALLY SIGNIFICANT. He cited skylights for that. True but irrelevant. Eliminate.','C: "reduce electricity" — that\'s an outcome, not the innovation. Wrong specificity.','D: "sustainability philosophy" — too broad. Eliminate.','B: directly answers the question — Osei cited the skylight system.'] }
    },
    R7:{ code:'R7', name:'Comparison Fallacy Flag', section:'B',
      bands:[3,4,5,6,7], skills:['main_idea','inference'],
      explain:'When a passage describes two things, wrong answers often imply comparisons the passage never made. If the passage doesn\'t explicitly compare them, the comparison is a trap.',
      why:'Comparative claims feel natural when a passage discusses two related things, but only stated comparisons are valid.',
      trigger:'When a choice uses comparative language (better, worse, more, less, unlike) — check whether the passage made that comparison.',
      mistake:'Inferring that because A has quality X and B is also mentioned, A must be better than B at X.',
      example:{ context:'Reading · Comparison',
        passage:'Novelist Kweku Asante\'s debut won three awards for structural innovation. Novelist Lina Tuilagi\'s debut sold 200,000 copies and was cited for emotional depth. Both emerged from the same MFA program.',
        q:'What does the passage indicate about both debuts?',
        c:['Asante\'s debut was more critically successful than Tuilagi\'s','Both debuted successfully, though in different ways','Tuilagi\'s debut was commercially superior to Asante\'s','The MFA program produced only commercially successful novelists'],
        a:1, steps:['A: "more critically successful" — passage gives awards for Asante but praise for Tuilagi too. No comparison made. Comparison fallacy. Eliminate.','C: "commercially superior" — Asante\'s sales are never mentioned. Can\'t compare. Eliminate.','D: "only commercially" — Asante\'s success was critical. Extreme + wrong. Eliminate.','B: both succeeded, in different ways (awards vs. sales). Accurate, non-comparative.'] }
    },
    R8:{ code:'R8', name:'Scope Trap Detection', section:'B',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Scope traps occur when a choice makes a broader or narrower claim than what the passage supports. One study ≠ universal conclusion.',
      why:'Students naturally generalize from specific examples. The test exploits this with choices that are "in the right direction" but overstep the evidence.',
      trigger:'When a choice uses "all," "most," "generally," or "in all cases" — check whether the passage\'s evidence is broad enough.',
      mistake:'Accepting a general claim because you agree with it, without checking the scope of the evidence.',
      example:{ context:'Reading · Scope',
        passage:'A 2023 survey of 1,200 college students at four universities found that 67% reported social media use negatively affected their study concentration.',
        q:'What can be concluded from this survey?',
        c:['Social media universally harms concentration in academic settings','Most college students are addicted to social media','A majority of surveyed students reported social media negatively affected their study concentration','Social media platforms should be banned from campuses'],
        a:2, steps:['A: "universally" — 1,200 students at 4 universities ≠ universal. Scope trap. Eliminate.','B: "addicted" — the survey asked about concentration, not addiction. Out of scope. Eliminate.','D: "should be banned" — a policy recommendation not in the passage. Eliminate.','C: matches exactly — surveyed students, reported effect, concentration. No overreach.'] }
    },
    R9:{ code:'R9', name:'Find the Motive Method', section:'C',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'For passages about a person\'s research or decisions, ask: what is their motive? The author always tells you, and inference questions about reasoning always trace back to that motive.',
      why:'Inference questions about researchers and thinkers are fundamentally about motive. Identify it once and you can answer multiple related questions.',
      trigger:'Any passage featuring a scientist, artist, historian, or thinker — identify their motive in the first read.',
      mistake:'Inferring a motive the passage doesn\'t state. If the author doesn\'t tell you why, you can\'t assume.',
      example:{ context:'Reading · Inference',
        passage:'Dr. Adaeze Okonkwo studied red dwarf stars for a decade before shifting to exoplanet atmospheres. She explained that advances in spectroscopic technology had made it newly possible to analyze atmospheric chemical composition — questions that had been technically unanswerable before.',
        q:'Why did Dr. Okonkwo shift her research focus?',
        c:['She lost interest in red dwarf stars','A technological advance made a previously impossible area newly accessible','Her institution required a change','Exoplanets were considered more prestigious'],
        a:1, steps:['A: "lost interest" — not stated. The passage gives a specific reason; don\'t invent an emotional one.','C: "institution required" — never mentioned. Eliminate.','D: "more prestigious" — never mentioned. Could-be-true trap. Eliminate.','B: directly mirrors her stated explanation — technology made a previously inaccessible question accessible.'] }
    },
    R10:{ code:'R10', name:'Keyword Anchoring', section:'C',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Before answering a question, underline 2-3 key words from the question stem. Scan the passage for those words. The answer is almost always in the sentence(s) immediately before or after your keyword.',
      why:'Keyword anchoring turns an open-ended search into a targeted scan. Prevents re-reading the entire passage per question.',
      trigger:'Every question that refers to specific information in the passage (not main idea questions).',
      mistake:'Answering from memory without going back to the passage — even if you remember the gist, exact wording matters.',
      example:{ context:'Reading · Evidence',
        passage:'The transcontinental railroad relied heavily on Chinese immigrant laborers who made up approximately 80% of the Central Pacific workforce. Despite their central role, Chinese workers were paid less than white counterparts and were excluded from the completion ceremony at Promontory Summit.',
        q:'What was notable about the Chinese workers\' role at the completion ceremony?',
        c:['They received higher wages at the ceremony','They were given prominent roles','They were excluded despite their central role in construction','The ceremony was held at a location they had built'],
        a:2, steps:['Keyword: "completion ceremony." Anchor to it.','Passage: "excluded from the completion ceremony at Promontory Summit."','Context: "Despite their central role in construction" — that\'s the notable contrast.','C captures both parts: excluded + despite central role.'] }
    },
    R11:{ code:'R11', name:'Paragraph Function Labeling', section:'C',
      bands:[3,4,5,6,7], skills:['main_idea','inference'],
      explain:'After reading a multi-paragraph passage, write a 3-5 word label for each paragraph\'s function: "introduces problem," "provides counterargument," "gives evidence," "states conclusion."',
      why:'Structure questions ("what is the function of paragraph 2?") are trivially easy once you\'ve labeled each paragraph\'s role.',
      trigger:'Multi-paragraph passages with 3+ paragraphs. Takes 30 seconds. Prevents re-reading under time pressure.',
      mistake:'Trying to answer structure questions by re-reading the full passage under time pressure.',
      example:{ context:'Reading · Structure',
        passage:'[P1] Scientists have long known certain fish can detect Earth\'s magnetic field. [P2] Recent research using implanted trackers revealed that salmon navigate using magnetic maps with surprising precision. [P3] This discovery raises new questions about whether magnetic sense is more widespread in aquatic life than assumed.',
        q:'What is the primary function of paragraph 3?',
        c:['Summarizes the research methods','Introduces a limitation of the findings','Extends the discovery\'s implications to a broader question','Contradicts paragraph 2'],
        a:2, steps:['Your labels: P1=establishes known fact, P2=presents new finding, P3=raises broader question.','A: "summarizes methods" — that\'s P2\'s role. Eliminate.','B: "introduces a limitation" — P3 doesn\'t flag a flaw; it opens a new question. Eliminate.','D: "contradicts" — P3 extends P2, doesn\'t contradict it. C matches "raises broader question."'] }
    },
    R12:{ code:'R12', name:'One-Line Headline Test', section:'C',
      bands:[1,2,3,4,5,6,7], skills:['main_idea'],
      explain:'For main idea questions, write a one-line newspaper headline for the passage before looking at choices. Your headline is your prediction. The correct answer will match its scope.',
      why:'Main idea traps are too-specific or too-broad. A headline forces you to the right level of generality.',
      trigger:'Any question asking for "main idea," "central claim," "primary purpose," or "best title."',
      mistake:'Picking the most specific or interesting detail as the main idea. Main idea = what the whole passage is about.',
      example:{ context:'Reading · Main Idea',
        passage:'Dr. Marisol Rivera spent 15 years restoring coastal wetlands in Louisiana. Her team found restored wetlands absorbed storm surge better than engineered barriers in three major storms. Rivera argues ecological restoration should be integrated with infrastructure planning.',
        q:'What is the central argument of this passage?',
        c:['Rivera\'s study is the longest wetland restoration project on record','Coastal wetlands are found primarily in Louisiana','Ecological restoration offers storm resilience that should be incorporated into infrastructure planning','Engineered barriers are completely ineffective against storms'],
        a:2, steps:['Your headline: "Researcher argues natural wetlands outperform barriers, should be integrated into planning."','A: focuses only on duration of study — too specific. Eliminate.','B: "primarily in Louisiana" — not even stated. Eliminate.','D: "completely ineffective" — extreme; passage says wetlands performed "better," not that barriers are useless.','C matches your headline: ecological restoration + storm resilience + infrastructure integration.'] }
    },
    R13:{ code:'R13', name:'Paraphrase Before Looking', section:'C',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'After reading a difficult passage, stop and paraphrase it in plain language before reading the questions. This forces comprehension and prevents complex passage language from infecting your evaluation of choices.',
      why:'Complex passage language creates cognitive load that makes wrong answers look more plausible. Plain-language paraphrase "translates" the passage into terms you own.',
      trigger:'Any passage written in dense, formal, or archaic style.',
      mistake:'Jumping straight to the questions after reading a confusing passage without pausing to consolidate understanding.',
      example:{ context:'Reading · Comprehension',
        passage:'The proliferation of coffeehouses in 18th-century London created spaces for cross-class intellectual exchange previously unavailable. Merchants, writers, and professionals congregated where the price of admission — a penny — was broadly accessible, and conversation, not commerce, was the primary currency.',
        q:'What role did coffeehouses play in 18th-century London?',
        c:['Primarily commercial establishments for merchants','Enabled intellectual exchange across social classes at low cost','Exclusive clubs for professional writers','Replaced trading floors where merchants previously met'],
        a:1, steps:['Paraphrase first: "Coffee shops were cheap places where different types of people could talk and share ideas. This was new."','A: "primarily commercial" — passage says conversation, NOT commerce, was the currency. Opposite. Eliminate.','C: "exclusive" — passage says broadly accessible (a penny). Eliminate.','D: "replaced trading floors" — never mentioned. B matches your paraphrase.'] }
    },
    G1:{ code:'G1', name:'Pattern Recognition Over Rule Naming', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['grammar','transitions','punctuation'],
      explain:'You don\'t need to know the name of a grammar rule to use it. You need to recognize the pattern. "Study, analyze, and ___" — you hear the blank needs to match "study" and "analyze" in form.',
      why:'Students freeze when they can\'t name a rule. The SAT tests patterns. Recognizing patterns is faster and more reliable than rule recall.',
      trigger:'Every grammar question. Listen for the pattern, not the rule name.',
      mistake:'Skipping a grammar question because "I don\'t know that rule." You often know the pattern even when you don\'t know the name.',
      example:{ context:'Grammar · Parallel Structure', passage:null,
        q:'The committee\'s job was to study the data, analyze the findings, and [BLANK] its conclusions to the board.',
        c:['presenting','to present','present','has presented'],
        a:2, steps:['Pattern: "study… analyze… and ___." First two are bare verb forms (no -ing, no "to").','You don\'t need to name this "parallel infinitive series." You just hear: study, analyze, [base verb].','presenting (-ing form) — doesn\'t match. to present (adds "to") — doesn\'t match. has presented (past tense) — doesn\'t match.','"present" — matches study, analyze. Correct.'] }
    },
    G2:{ code:'G2', name:'Shortest Answer Rule', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['grammar'],
      explain:'On concision questions, the shortest grammatically correct answer is almost always right. The SAT penalizes redundancy — if two choices say the same thing, the shorter one wins.',
      why:'The SAT explicitly tests the ability to eliminate wordiness. Longer answers on concision questions are almost always traps.',
      trigger:'When answer choices include one or two unusually short options alongside longer ones.',
      mistake:'Choosing a longer answer because it "sounds more complete." More information is a flaw on concision questions.',
      example:{ context:'Grammar · Concision', passage:null,
        q:'The board made a [BLANK] to merge the two companies.',
        c:['final and definitive decision that was conclusive','decision that was both final and definitive','final decision','conclusive and terminal determination'],
        a:2, steps:['"Final and definitive decision that was conclusive" — three ways of saying the same thing. Redundant. Eliminate.','"decision that was both final and definitive" — still redundant (final and definitive mean the same). Eliminate.','"conclusive and terminal determination" — two obscure synonyms stacked. Redundant. Eliminate.','"final decision" — one modifier, one noun. Clear and complete. Shortest answer wins.'] }
    },
    G3:{ code:'G3', name:'Transition Logic Map', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['transitions'],
      explain:'Every transition signals a logical relationship: contrast (However, Although), continuation (Furthermore, Additionally), cause-effect (Therefore, Thus), or example (For instance). Identify the relationship before choosing.',
      why:'Students guess transitions by "feel." The SAT requires logical precision — the wrong transition type is always wrong even if it sounds OK.',
      trigger:'Any sentence with a transition word. Map the relationship before checking choices.',
      mistake:'Choosing a contrast transition for a continuation, or vice versa, because it "sounds natural."',
      example:{ context:'Grammar · Transitions', passage:null,
        q:'Scientists initially believed the crater was volcanic. [BLANK], chemical analysis revealed impact signatures consistent only with an extraterrestrial object.',
        c:['Therefore','Similarly','However','Consequently'],
        a:2, steps:['Idea 1: volcanic activity was the initial belief. Idea 2: analysis revealed it was a meteor impact.','Relationship: the second idea corrects/contradicts the first. This is CONTRAST.','Therefore / Consequently — cause-effect. Wrong relationship. Eliminate.','Similarly — continuation. Wrong relationship. Eliminate. However — contrast. Correct.'] }
    },
    G4:{ code:'G4', name:'Punctuation Decision Tree', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['punctuation'],
      explain:'Decision tree: introducing a list? → colon. Joining two independent clauses? → semicolon or period. Parenthetical? → commas or dashes. Never use a comma alone between two independent clauses (comma splice).',
      why:'Punctuation follows predictable rules. A two-step decision tree handles 90% of questions.',
      trigger:'Any question where answer choices differ only in punctuation.',
      mistake:'Comma splicing — putting only a comma between two complete sentences. Always wrong on the SAT.',
      example:{ context:'Grammar · Punctuation', passage:null,
        q:'The climbers packed three essential supplies[BLANK] food, water, and rope.',
        c:[', food, water, and rope.',': food, water, and rope.','; food, water, and rope.','— food, water — and rope.'],
        a:1, steps:['Decision: am I introducing a list? Yes — "three essential supplies" sets up what they are.','Rule: use a colon to introduce a list after a complete clause.','Comma — doesn\'t introduce a list; creates ambiguity. Wrong.','Semicolon — joins independent clauses; "food, water, rope" is not independent. Wrong.','Colon (:) — complete clause + colon + list. Correct.'] }
    },
    G5:{ code:'G5', name:'Subject-Verb Isolation', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['grammar'],
      explain:'Cross out every prepositional phrase between the subject and verb. What remains must agree. "The collection of manuscripts ___" → cross out "of manuscripts" → subject is "collection" → singular verb.',
      why:'The SAT creates disagreement by inserting a plural noun phrase between a singular subject and its verb. Isolation cuts through the interference.',
      trigger:'Any sentence where multiple nouns appear between the subject and its verb.',
      mistake:'Making the verb agree with the nearest noun instead of the actual subject.',
      example:{ context:'Grammar · Subject-Verb Agreement', passage:null,
        q:'The collection of ancient manuscripts from the three destroyed libraries [BLANK] donated to the archive.',
        c:['have been','has been','were','are'],
        a:1, steps:['Step 1: identify the subject. Cross out "of ancient manuscripts from the three destroyed libraries."','What remains: "The collection ___ donated."','Subject: "collection" — singular.','have been / were / are — plural forms. Wrong for singular subject. "has been" — singular. Correct.'] }
    },
    G6:{ code:'G6', name:'Pronoun Antecedent Hunt', section:'D',
      bands:[2,3,4,5,6,7], skills:['grammar'],
      explain:'When a pronoun appears, draw an arrow back to its antecedent. If it\'s ambiguous (two possible nouns) or mismatched in number, the sentence needs fixing.',
      why:'Pronoun errors are among the SAT\'s most tested grammar points. The trap is always ambiguity — making you guess which noun "they" refers to.',
      trigger:'Any sentence with "they," "it," "this," "those," "their," "its" — especially when multiple nouns appeared recently.',
      mistake:'Assuming a pronoun clearly refers to the most recently mentioned noun without checking for ambiguity.',
      example:{ context:'Grammar · Pronoun Reference', passage:null,
        q:'Archaeologists discovered ancient coins near the old foundation. They were carefully catalogued and sent to the museum.',
        c:['They were carefully catalogued','The coins were carefully catalogued','It was carefully catalogued','Those were carefully catalogued'],
        a:1, steps:['Identify the pronoun: "They." Arrow back — could refer to "archaeologists" or "coins." Ambiguous.','They — could mean archaeologists were catalogued. Ambiguous. Eliminate.','It — singular, but "coins" is plural. Wrong. Those — still ambiguous.','The coins — replaces the ambiguous pronoun with the specific noun. Unambiguous. Correct.'] }
    },
    G7:{ code:'G7', name:'Verb Tense Consistency Check', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['grammar'],
      explain:'Find the "time anchor" in the sentence — a time phrase or a nearby verb that establishes the tense. The blank must match unless a time marker explicitly signals a shift.',
      why:'Tense shifts are wrong unless the passage signals a time change. The SAT tests whether students notice inconsistent tense without a valid reason.',
      trigger:'Any blank where multiple tense options are offered. Find the time anchor first.',
      mistake:'Choosing a different tense than established without a time marker that justifies the shift.',
      example:{ context:'Grammar · Verb Tense', passage:null,
        q:'The author published her first novel in 2010. Since then, she [BLANK] two more novels and a collection of essays.',
        c:['published','had published','has published','was publishing'],
        a:2, steps:['Time anchor: "Since then" — signals an action that started in the past and continues to the present.','Rule: "since then" always pairs with present perfect (has/have + past participle).','published — simple past. Doesn\'t fit "since then." had published — past perfect. Wrong use case.','was publishing — past progressive. Doesn\'t match ongoing action to present. "has published" — present perfect. Correct.'] }
    },
    M1:{ code:'M1', name:'Backsolving', section:'E',
      bands:[1,2,3,4,5,6,7], skills:['linear_algebra','advanced_math'],
      explain:'When a problem asks for a value and gives four numerical answer choices, plug the choices back into the problem. Start with the middle value (B or C). If too big, try A; too small, try D.',
      why:'Backsolving converts algebra into arithmetic — faster and less error-prone for students who struggle with equation-building.',
      trigger:'Algebraic equations with numerical answer choices. Best when choices are ordered and testing a single value.',
      mistake:'Starting with Choice A. Start with the middle — if wrong, the ordering tells you which direction to go next, eliminating two choices instantly.',
      example:{ context:'Math · Algebra', passage:null,
        q:'If 3x + 7 = 22, what is the value of x?',
        c:['3','5','7','9'],
        a:1, steps:['Start with middle value: Choice B = 5. Test: 3(5) + 7 = 15 + 7 = 22. ✓','Done in one try. Choose B.','If B were too large: try A (3) → 16. Too small. Eliminate A and B. Try C.','If B were too small: try C → 28. Too large. Eliminate C and D. The remaining choice wins.'] }
    },
    M2:{ code:'M2', name:'Plug In Numbers', section:'E',
      bands:[2,3,4,5,6,7], skills:['advanced_math','linear_algebra'],
      explain:'When choices contain variables, pick simple numbers for those variables, compute the target answer, then test which choice produces that number. Use 2, 3, or 5 — never 0 or 1.',
      why:'Variable-heavy choices create an algebra maze. Plugging in replaces that maze with arithmetic.',
      trigger:'Answer choices that contain variables (n, x, k) rather than numbers.',
      mistake:'Using 0 or 1. These create special results that can make multiple choices appear correct.',
      example:{ context:'Math · Algebra', passage:null,
        q:'For any integer n, which expression equals (n + 2)² − n²?',
        c:['4','4n','4n + 4','2n + 4'],
        a:2, steps:['Let n = 3. Compute: (3+2)² − 3² = 25 − 9 = 16. Target = 16.','Test each choice with n=3: A=4 ✗, B=12 ✗, C=4(3)+4=16 ✓, D=10 ✗.','Choice C. Verify algebraically: (n+2)²−n² = n²+4n+4−n² = 4n+4. ✓'] }
    },
    M3:{ code:'M3', name:'Plug In 100 for Percentages', section:'E',
      bands:[1,2,3,4,5,6,7], skills:['data_analysis'],
      explain:'Any time a percent problem uses an unspecified "original value," use 100 as your starting number. Percentages of 100 are just the percentage itself.',
      why:'Percentage problems with unspecified starting values trip students up with abstraction. 100 removes the abstraction entirely.',
      trigger:'Any problem asking "by what percent" where no original value is given.',
      mistake:'Setting up abstract fraction equations when the problem gives no original value. Just use 100.',
      example:{ context:'Math · Percentages', passage:null,
        q:'A price increases by 20%, then decreases by 20%. What is the net percent change?',
        c:['0%','−4%','+4%','−2%'],
        a:1, steps:['Start with 100. Increase by 20%: 100 × 1.20 = 120.','Decrease by 20%: 120 × 0.80 = 96.','Net: 96 − 100 = −4. That\'s −4%.','Common error: thinking the changes cancel (0%). They don\'t — percentages compound on a new base.'] }
    },
    M4:{ code:'M4', name:'Solve Algebra Without Algebra', section:'E',
      bands:[1,2,3,4,5,6,7], skills:['linear_algebra','advanced_math'],
      explain:'When an equation is hard to factor or set up, test each answer choice directly in the equation. This is distinct from Backsolving — here you\'re substituting without ordering assumptions.',
      why:'Some equations (especially quadratics) are faster to solve by testing choices than by factoring.',
      trigger:'Equations that look messy to factor. If choices are specific numbers, test them.',
      mistake:'Spending 3+ minutes trying to factor when you could test 4 choices in 90 seconds.',
      example:{ context:'Math · Quadratic', passage:null,
        q:'For which value of x is x² − 5x + 6 = 0?',
        c:['x = 1','x = 2','x = 4','x = 6'],
        a:1, steps:['Test x=1: 1−5+6=2 ≠ 0. Eliminate A.','Test x=2: 4−10+6=0. ✓ Done in 20 seconds.','(Note: x=3 also works algebraically, but it\'s not in the choices. The SAT gives you the answer.)'] }
    },
    M5:{ code:'M5', name:'Answer Choice Ballparking', section:'E',
      bands:[1,2,3,4,5,6,7], skills:['linear_algebra','advanced_math','data_analysis'],
      explain:'Before calculating precisely, estimate a reasonable range. This eliminates 2-3 choices before you do any real work and catches calculation errors (your answer should land in the expected range).',
      why:'Ballparking prevents "insane answer" errors — when a calculation goes wrong and a student submits something wildly unreasonable.',
      trigger:'Any problem with a geometric element, or where choices span multiple orders of magnitude.',
      mistake:'Not checking whether your final answer is reasonable. If the circle is drawn inside a 5×5 square, an area of 400 is wrong.',
      example:{ context:'Math · Geometry', passage:null,
        q:'A circle is inscribed in a rectangle 12 units wide and 5 units tall. Approximate area of the circle?',
        c:['78.5 sq units','19.6 sq units','9.8 sq units','50 sq units'],
        a:1, steps:['Ballpark: circle inscribed in 12×5 rectangle. Can\'t be wider than 5 (shorter side). Radius ≤ 2.5.','Area estimate: π × 2.5² ≈ 19.6. Eliminate anything far from that.','78.5 (radius=5, too big), 9.8 (too small), 50 (too big). Choice B ≈ 19.6. Correct.'] }
    },
    M6:{ code:'M6', name:'Units-First Analysis', section:'E',
      bands:[1,2,3,4,5,6,7], skills:['data_analysis','linear_algebra'],
      explain:'Before setting up any rate or conversion problem, write out the units. Build the equation so unwanted units cancel, leaving only the units you need.',
      why:'Units errors cause wrong answers even when students understand the math. Tracking units is a built-in answer check.',
      trigger:'Any problem involving rates, unit conversions, or combined rates.',
      mistake:'Setting up a rate equation without writing out units, then getting numerator/denominator inverted.',
      example:{ context:'Math · Rates', passage:null,
        q:'A car travels 150 miles in 2.5 hours. How many minutes to travel 30 miles at the same speed?',
        c:['20 min','30 min','45 min','60 min'],
        a:1, steps:['Speed = 150 mi ÷ 2.5 hr = 60 mi/hr.','Time for 30 mi: 30 mi ÷ 60 mi/hr = 0.5 hr.','Convert: 0.5 hr × 60 min/hr = 30 min.','Units cancel correctly at each step. If they don\'t cancel, your setup is wrong.'] }
    },
    M7:{ code:'M7', name:'Trap Answer Arithmetic', section:'E',
      bands:[2,3,4,5,6,7], skills:['linear_algebra','advanced_math','data_analysis'],
      explain:'The SAT places "attractive wrong answers" in the choices — numbers you\'d get by making the most common mistake. Identifying those wrong choices helps you double-check your own answer.',
      why:'Knowing what wrong choices represent lets you catch your own errors. If you got the "common mistake" number, re-examine.',
      trigger:'When your answer matches one of the "obvious" choices — verify you didn\'t make the predictable mistake.',
      mistake:'Trusting your answer just because it appears in the choices. Wrong answers appear in choices too.',
      example:{ context:'Math · Number Properties', passage:null,
        q:'The sum of two consecutive even integers is 46. What is the larger integer?',
        c:['22','23','24','25'],
        a:2, steps:['Set up: n + (n+2) = 46 → 2n = 44 → n = 22. Larger = 24.','Trap A (22) = solving for n and stopping early — the most common mistake.','Trap B (23) = using consecutive odd integers instead of even.','C (24) = correct. Notice A is designed to catch students who stop one step early.'] }
    },
    M8:{ code:'M8', name:'Properties Over Procedures', section:'E',
      bands:[2,3,4,5,6,7], skills:['advanced_math','linear_algebra'],
      explain:'Some problems can\'t be solved with procedures — they require knowing properties: odd/even, positive/negative, prime, divisibility. Build a mental reference card for the properties the SAT tests.',
      why:'Students try to "solve" number property questions with algebra, which doesn\'t work. Properties require direct knowledge and case testing.',
      trigger:'Questions using "must be," "could be," "always," "never" with number type descriptions.',
      mistake:'Trying to solve "must be odd" questions algebraically instead of testing cases.',
      example:{ context:'Math · Number Properties', passage:null,
        q:'If p is odd and q is even, which must be even?',
        c:['p + q','p − q','p × q','p²'],
        a:2, steps:['Properties: odd+even=odd; odd−even=odd; odd×even=even; odd²=odd.','Test with p=3, q=4: A=7 (odd), B=−1 (odd), C=12 (even), D=9 (odd).','A, B, D are odd. C (p×q) = even. Must be even. Choice C.','Use the property rule first, then verify with numbers.'] }
    },
    M9:{ code:'M9', name:'Geometry Visual Estimation', section:'E',
      bands:[1,2,3,4,5,6,7], skills:['data_analysis'],
      explain:'SAT geometry figures are drawn approximately to scale unless labeled "Not drawn to scale." Use visual estimation to ballpark answers and eliminate unreasonable choices before calculating.',
      why:'Many geometry problems can be narrowed to 1-2 choices by visual inspection before any calculation.',
      trigger:'Any geometry question with a figure, unless explicitly marked not to scale.',
      mistake:'Ignoring the figure and calculating blind. The figure is information.',
      example:{ context:'Math · Geometry', passage:null,
        q:'A right triangle has legs of length 6 and 8. What is its area?',
        c:['14 sq units','24 sq units','48 sq units','10 sq units'],
        a:1, steps:['This is a 6-8-10 right triangle. Area = (1/2) × 6 × 8 = 24.','Visual check: a 6×8 rectangle has area 48. The triangle is half of that. 24 is reasonable.','Trap C (48) = forgot to divide by 2. Trap D (10) = calculated hypotenuse, not area.'] }
    },
    M10:{ code:'M10', name:'Visualize Don\'t Calculate', section:'F',
      bands:[3,4,5,6,7], skills:['linear_algebra','advanced_math'],
      explain:'When a question asks about features of a function (zeros, vertex, intersections, max/min), graph it in Desmos before doing any algebra. The graph answers most feature questions instantly.',
      why:'Algebraic analysis of function features takes 2-3 minutes. Desmos shows the answer in 15 seconds.',
      trigger:'Any question asking where a function crosses an axis, reaches a maximum, or changes behavior. Graph first.',
      mistake:'Trying to determine function features from the equation without graphing, especially for unfamiliar forms.',
      example:{ context:'Math · Functions', passage:null,
        q:'How many times does f(x) = x² − 4x + 3 cross the x-axis?',
        c:['0 times','1 time','2 times','3 times'],
        a:2, steps:['Type "x² - 4x + 3" into Desmos.','Graph shows a parabola crossing x-axis at x=1 and x=3.','Count: 2 crossings. Done in 15 seconds.','Algebraic check: factor → (x−1)(x−3) → x=1 or 3. Confirms 2. But Desmos was faster.'] }
    },
    M11:{ code:'M11', name:'Systems → Graph Intersection', section:'F',
      bands:[3,4,5,6,7], skills:['linear_algebra'],
      explain:'For any system of equations, graph both in Desmos and find the intersection. The coordinates are the solution. No algebraic manipulation required.',
      why:'Systems solved by substitution or elimination take 3-4 minutes. Desmos finds the intersection in 20 seconds.',
      trigger:'Any problem with two equations and two unknowns where you need specific values.',
      mistake:'Forgetting to check whether the question asks for x, y, or a combination like x+y. Read the question BEFORE reading the coordinates.',
      example:{ context:'Math · Systems', passage:null,
        q:'What is the x-coordinate of the intersection of y = 2x + 1 and y = −x + 7?',
        c:['x = 1','x = 2','x = 3','x = 4'],
        a:1, steps:['Graph both in Desmos: y=2x+1 and y=-x+7.','Graphs intersect at (2, 5). Question asks for x-coordinate: x=2.','Verify: 2(2)+1=5 ✓ and −2+7=5 ✓. Choice B.'] }
    },
    M12:{ code:'M12', name:'Slider Method for Parameters', section:'F',
      bands:[4,5,6,7], skills:['advanced_math'],
      explain:'When a problem involves an unknown parameter (k, a, b) and asks its value given a condition, graph in Desmos with a slider for the parameter. Drag until the condition is met.',
      why:'Parameter problems can be algebraically complex. Desmos sliders make them visual and instant.',
      trigger:'Any problem that asks "for what value of k…" or "which value of a…" followed by a graphical condition.',
      mistake:'Not setting up the slider correctly. The slider variable must exactly match the unknown in the equation.',
      example:{ context:'Math · Parameters', passage:null,
        q:'The function f(x) = kx passes through (3, 12). What is the value of k?',
        c:['k = 2','k = 3','k = 4','k = 9'],
        a:2, steps:['Graph f(x)=kx in Desmos. Create a slider for k.','Drag until the line passes through (3, 12). At k=4: f(3)=4(3)=12. ✓','Alternatively, substitute: 12=k(3) → k=4. Faster here, but slider works for complex functions.'] }
    },
    M13:{ code:'M13', name:'Equivalency Visual Proof', section:'F',
      bands:[4,5,6,7], skills:['advanced_math'],
      explain:'When asked whether two expressions are equivalent, graph both in Desmos. Identical graphs = equivalent expressions. If they differ anywhere, they are not equivalent.',
      why:'Proving algebraic equivalence symbolically can introduce errors. Visual proof is definitive and fast.',
      trigger:'Any question asking "which expression is equivalent to…" with algebraic expressions.',
      mistake:'Checking equivalence by plugging in a single value. Two expressions can agree at one point without being equivalent.',
      example:{ context:'Math · Equivalence', passage:null,
        q:'Which expression is equivalent to (x + 3)(x − 3)?',
        c:['x² + 9','x² − 6x + 9','x² − 9','x² − 6'],
        a:2, steps:['Graph y=(x+3)(x-3) and y=x²-9 in Desmos.','Graphs are identical. They are equivalent.','Verify algebraically: (x+3)(x−3) = x²−9. ✓ Choice C.'] }
    },
    M14:{ code:'M14', name:'Point-Testing for Graph Questions', section:'F',
      bands:[3,4,5,6,7], skills:['linear_algebra','advanced_math'],
      explain:'When asked which equation describes a graph, use Desmos to plot the described points and test which equation passes through them all.',
      why:'Equation-matching from graphs is visual. Point-testing via Desmos turns it into confirmation rather than calculation.',
      trigger:'Questions describing key points and asking which line/curve fits.',
      mistake:'Trying to identify the equation by analyzing slope and intercept from memory when Desmos can confirm instantly.',
      example:{ context:'Math · Linear Functions', passage:null,
        q:'Which equation represents the line through (0, 3) and (2, 7)?',
        c:['y = x + 3','y = 2x + 3','y = 2x − 1','y = 3x + 1'],
        a:1, steps:['Plot (0,3) and (2,7) in Desmos. Graph each choice.','y=2x+3: at x=0, y=3 ✓; at x=2, y=7 ✓. Passes through both points.','Verify: slope=(7−3)/(2−0)=2; y-intercept=3. Equation: y=2x+3. Choice B.'] }
    },
    M15:{ code:'M15', name:'When NOT to Use Desmos', section:'F',
      bands:[3,4,5,6,7], skills:['linear_algebra','advanced_math','data_analysis'],
      explain:'Desmos is powerful, but opening it for every problem wastes 30-60 seconds. Skip it for: simple arithmetic, one-step algebra, percent calculations, and anything solvable in under 20 seconds.',
      why:'Overusing Desmos is as costly as underusing it. Knowing which problems require it is a time management skill.',
      trigger:'Before opening Desmos, ask: can I solve this in under 20 seconds without it? If yes, skip it.',
      mistake:'Opening Desmos reflexively for every math problem.',
      example:{ context:'Math · Strategy', passage:null,
        q:'Which problem should NOT use Desmos?',
        c:['Find where y = x² − 6x + 5 crosses the x-axis','Find k if f(x) = kx² passes through (2, 12)','Solve 5 + 3x = 20','Find the intersection of y=2x+1 and y=−x+7'],
        a:2, steps:['A: zeros of a quadratic — Desmos graphs it in 10 seconds. Use Desmos.','B: parameter problem — slider method. Use Desmos.','D: intersection of two lines — graph both. Use Desmos.','C: 5+3x=20 → 3x=15 → x=5. One step in your head in 10 seconds. Do NOT open Desmos for this.'] }
    },
    C1:{ code:'C1', name:'Classical Text Tone Mapping', section:'G',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'CLT passages use archaic or formal language. Before answering questions, identify the author\'s tone: Sympathetic, Critical, Nostalgic, Reverent, Skeptical, Celebratory, or Cautionary.',
      why:'CLT inference questions almost always trace back to tone. Know the tone, predict the answer.',
      trigger:'First paragraph of every CLT passage. Write a one-word tone label.',
      mistake:'Interpreting archaic formal language as criticism when it\'s actually reverence — or vice versa. Old language can be enthusiastically positive.',
      example:{ context:'CLT · Inference',
        passage:'G.K. Chesterton writes: "The world will never starve for want of wonders; but only for want of wonder." He describes his delight at finding the extraordinary within the ordinary — a spider\'s web, a cracked stone, the sound of one\'s own name spoken aloud.',
        q:'Chesterton\'s tone in this passage is best described as',
        c:['Melancholic and regretful','Sympathetic and celebratory of ordinary wonder','Skeptical of conventional beauty standards','Critical of those who overlook common objects'],
        a:1, steps:['Tone markers: "delight," "extraordinary within ordinary," "wonders." All positive, enthusiastic.','A: "melancholic/regretful" — no sadness markers. Eliminate.','C: "skeptical" — Chesterton is enthusiastic, not skeptical. Wrong direction.','D: "critical" — the tone is about delight, not criticism. B: "sympathetic and celebratory" matches.'] }
    },
    C2:{ code:'C2', name:'Argument Structure Recognition', section:'G',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'CLT argumentative passages follow: Claim → Evidence (historical or philosophical) → Conclusion (moral or prescriptive). Label each paragraph\'s role as you read.',
      why:'CLT argument passages are denser than SAT reading. Knowing the three-part structure prevents you from confusing evidence with the main claim.',
      trigger:'CLT passages that read like philosophical or rhetorical arguments (common in Cicero, Aquinas, Augustine).',
      mistake:'Treating the evidence paragraph as the main argument. Evidence supports the claim — it\'s not the claim itself.',
      example:{ context:'CLT · Argument Structure',
        passage:'[P1] Aquinas argues that human beings naturally seek the good. [P2] This is evidenced by the universal desire for happiness, law, and justice found in every civilization. [P3] Therefore, natural law is not a human invention but a participation in divine reason, to which all human law ought to conform.',
        q:'What is the primary argument of the passage?',
        c:['All civilizations desire happiness and justice','Natural law reflects divine reason and human law should conform to it','Aquinas invented the concept of natural law','Human beings are naturally good'],
        a:1, steps:['Label: P1=Claim, P2=Evidence, P3=Conclusion. Main argument = conclusion.','A: desire for happiness/justice — that\'s P2, the evidence. Eliminate.','C: "Aquinas invented" — never stated. Eliminate.','D: "naturally good" — the passage says we seek the good, not that we are good. B captures the conclusion.'] }
    },
    C3:{ code:'C3', name:'Latin & Greek Root Decoding', section:'G',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'CLT vocabulary questions use Latin/Greek root words. A short root vocabulary — scrib/script (write), dict (say), port (carry), aud (hear), vis (see), rupt (break), mit (send) — unlocks many unfamiliar words.',
      why:'CLT uses more archaic and Latin-derived vocabulary than the SAT. Root knowledge decodes unfamiliar words in context.',
      trigger:'Any CLT vocabulary question with an unfamiliar word. Decompose it: prefix + root + suffix.',
      mistake:'Guessing vocabulary questions from context alone without attempting to decode word structure.',
      example:{ context:'CLT · Vocabulary', passage:null,
        q:'A CLT passage argues philosophy should be "prescriptive rather than merely descriptive." What does "prescriptive" most likely mean?',
        c:['Describing what is','Prescribing medications to patients','Stating what ought to be','Based on historical precedent'],
        a:2, steps:['Decode: pre (before) + scrib (write) + ive (adjective) → "to write/direct beforehand" → stating what ought to be.','Context: contrasted with "descriptive" (what is). So prescriptive = what ought to be.','A: that\'s "descriptive." B: medical meaning, wrong context. D: "historical precedent" doesn\'t follow from root.','C: "stating what ought to be." Matches root meaning and context.'] }
    },
    C4:{ code:'C4', name:'Classical Allusion Context', section:'G',
      bands:[3,4,5,6,7], skills:['main_idea','inference'],
      explain:'CLT passages frequently reference classical figures (Socrates, Plato, Augustine, Homer). When an allusion appears, identify its conventional meaning and use that to interpret the author\'s purpose.',
      why:'Allusions carry condensed meaning. Knowing conventional significance of key classical figures accelerates interpretation.',
      trigger:'Any named historical, philosophical, or literary figure in a CLT passage.',
      mistake:'Reading past allusions without activating their cultural meaning. A Socrates reference is never just a name.',
      example:{ context:'CLT · Allusion',
        passage:'The author writes: "Like Socrates in the marketplace, the modern scientist must remain forever unsatisfied with received wisdom, questioning what all others have taken for granted."',
        q:'The author invokes Socrates in order to',
        c:['Criticize the ancient Athenian educational system','Suggest modern science has Greek origins','Use Socrates as a model for relentless questioning','Imply that scientists, like Socrates, will be punished'],
        a:2, steps:['Socrates\'s conventional meaning: questioning, challenging assumptions, intellectual humility.','A: "criticize Athenian education" — passage praises the Socratic approach. Wrong direction.','B: "Greek origins of science" — historical claim not being made. Eliminate.','D: "will be punished" — passage doesn\'t suggest this. Reading in too much. C: Socrates as model for questioning. Correct.'] }
    },
    MN1:{ code:'MN1', name:'Module Reset Protocol', section:'H',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'When frustration or anxiety peaks during a module: (1) Stop the current question, (2) Take 3 slow breaths, (3) Say internally "This is information. Next question." Then move at full attention.',
      why:'Frustration compounds. One hard question that triggers anxiety affects the next 3-5 questions if you don\'t break the cycle.',
      trigger:'Any moment of "I have no idea," frustration, or the sensation of spiraling. Don\'t wait until you\'ve lost 3 questions.',
      mistake:'Pushing through frustration without resetting. You can\'t think clearly when emotionally activated.',
      example:{ context:'Mindset', passage:null,
        q:'Krystal enters Module 2 Math and immediately gets a problem she\'s never seen before. Heart racing. What is the correct next action?',
        c:['Keep working — she can\'t afford 15 seconds','Execute the 3-step reset: stop, 3 breaths, "this is information," continue','Skip the module entirely','Flag every remaining question and guess'],
        a:1, steps:['Racing heart = activated stress response. Working memory is degraded.','15 seconds of reset costs 15 seconds. One question answered clearly beats 5 answered anxiously.','Stop → 3 slow breaths → "This is information. Next question."','Return to the problem with fresh attention. It may be more approachable than it seemed.'] }
    },
    MN2:{ code:'MN2', name:'Confidence Calibration', section:'H',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'When two choices survive elimination, you don\'t need certainty to choose. You need more-than-random odds — and elimination already gave you those. Commit to your best analysis.',
      why:'Over-certainty-seeking causes students to change correct answers. First instinct after careful analysis is right more often than second-guessing.',
      trigger:'When you\'ve used all elimination strategies and still have 2 choices. Make a decision and move on.',
      mistake:'Changing answers because of vague uncertainty — not because you have new evidence.',
      example:{ context:'Mindset', passage:null,
        q:'Krystal is left with choices B and D after elimination. Gut says D. She marks D, then changes to B with no new reasoning. Probable outcome?',
        c:['She likely improved her score','Changes from careful analysis are random — no benefit','She likely lowered her score — changing from a carefully considered choice is wrong more often than right','She should always change when uncertain'],
        a:2, steps:['Research on test-taking: students who change answers from careful initial analysis are wrong more often than right.','Exception: new information (re-read and found a misreading). That\'s a valid reason to change.','No new information + vague feeling = do NOT change. Krystal should have committed to D.','C describes the research finding.'] }
    },
    MN3:{ code:'MN3', name:'Careless Error Audit', section:'H',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Spend the last 2-3 minutes re-reading your answers to the 5-7 easiest questions. Careless errors cluster on easy questions because your brain disengages on "obvious" problems.',
      why:'Careless errors on easy questions cost more than hard-question errors because the easy ones were solvable. Auditing easy questions is the highest ROI in the last 2 minutes.',
      trigger:'Last 2-3 minutes of any module. Not for hard questions — for easy ones.',
      mistake:'Using the last 2 minutes to revisit hard questions you already spent 2+ minutes on. That time is already spent.',
      example:{ context:'Mindset', passage:null,
        q:'Krystal solves correctly for x=8 but the question asks for "3x − 2." She submits x=8. What type of error is this?',
        c:['Content gap','Trap triggered — 8 is a planted wrong answer','Careless error — solved correctly but didn\'t finish reading the question','Time pressure'],
        a:2, steps:['She correctly solved x=8. No content gap.','She stopped at x without completing: 3(8)−2=22. Right sub-problem, wrong final answer.','This is careless: she misread or stopped reading the question prematurely.','The careless error audit catches this: re-read "what does the question actually ask for?"'] }
    },
    MN4:{ code:'MN4', name:'Last 5 Questions Protocol', section:'H',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'If time is running out with 5+ questions left: (1) Guess all remaining immediately, (2) Return to the easiest remaining and answer carefully, (3) Continue to next easiest until time runs out.',
      why:'Blank answers and guessed answers have the same floor score. Rushing 5 questions at 30% accuracy = same as guessing, but you missed your best remaining questions.',
      trigger:'When you have fewer than 4 minutes for 5+ questions remaining.',
      mistake:'Trying to carefully answer all remaining in order. You\'ll run out and leave 2-3 blank.',
      example:{ context:'Mindset', passage:null,
        q:'Krystal has 4 minutes left with 7 questions remaining in Math M2. She averages 90s per question. Correct protocol?',
        c:['Answer 1-7 as fast as possible','Guess all 7 immediately, then answer the easiest ones carefully','Leave all 7 blank','Skip every other question'],
        a:1, steps:['At 90s each, she has time for ~2-3 more carefully.','First: guess all 7 immediately (takes 30 seconds). No question left blank.','Then: find the easiest remaining. Answer it fully and carefully.','Continue until time. Result: 2-3 careful + 4-5 guessed >> rushing all 7 carelessly.'] }
    },
    MN5:{ code:'MN5', name:'Test Anxiety Reframe', section:'H',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Pre-test arousal (racing heart, nervous energy) is neurologically identical to excitement. The label you give it determines its effect. Research shows that saying "I am excited" before high-stakes tasks improves performance.',
      why:'Anxiety reframe works because you\'re not suppressing the response — you\'re redirecting its meaning. "My body is preparing to perform" is accurate and useful.',
      trigger:'Morning of the SAT or any moment of pre-test nervousness. Execute the reframe actively, not passively.',
      mistake:'Trying to "calm down." Suppression doesn\'t work and often increases arousal. Reframe instead.',
      example:{ context:'Mindset', passage:null,
        q:'On the morning of the SAT, Krystal\'s heart is racing and she feels jittery. What should she say to herself?',
        c:['"Calm down — there\'s nothing to be nervous about"','"I must be sick — this will go badly"','"My body is getting ready. I\'m excited to show what I know"','"I should leave early — I\'m too anxious to test"'],
        a:2, steps:['The physiological state: elevated heart rate, nervous energy. This is arousal — identical to excitement.','Suppression ("calm down") tries to eliminate the arousal. Research shows this backfires.','Catastrophizing amplifies the negative interpretation. Eliminates B and D.','Reframe: "My body is getting ready. I\'m excited." Redirects the same arousal into productive energy.'] }
    },
  }; // end STRATEGIES

  // ── DRILLS ────────────────────────────────────────────────────────────────
  const DRILLS = {
    U1:[
      { p:null, q:'The SAT places a wrong answer that is "partially correct but overstates the conclusion." What trap type is this?', c:['Extreme language','Recycled language','Half-right answer','Could-be-true'], a:2, e:'Half-right answers are correct about one part but wrong about another. The entire answer must be accurate.' },
      { p:'Scientists discovered that a newly found mineral glows under ultraviolet light. Researchers believe this property may have practical applications in medical imaging.', q:'Which choice is a "Could-Be-True Trap" response to "What is known about the mineral\'s glow?"', c:['It glows under ultraviolet light','It has already revolutionized medical imaging','It may have applications in medical imaging','The glow is brighter than sunlight'], a:1, e:'Choice B states a result ("has already revolutionized") the passage never claims. Could-be-true but not passage-supported.' },
      { p:'The ancient city was abandoned suddenly. Archaeologists found evidence of fire in all residential areas, but the cause remains unknown.', q:'Which answer reflects what the passage actually says?', c:['The city was abandoned due to a volcanic eruption','Residents fled an approaching army','Fire affected the residential areas; cause unknown','The city was abandoned centuries after its peak'], a:2, e:'C sticks to what the passage states — fire evidence, cause unknown. A, B, D all add information not in the passage.' },
    ],
    U2:[
      { p:null, q:'Why does Module 1 performance matter more than Module 2 performance on the digital SAT?', c:['Module 1 questions are worth more points','Module 1 determines which difficulty level of Module 2 you receive','Module 1 is scored by a different algorithm','Module 2 is optional'], a:1, e:'The SAT is adaptive. Your Module 1 accuracy determines whether you get a harder or easier Module 2, which sets your score ceiling.' },
      { p:null, q:'Krystal finishes Module 1 with 3 minutes to spare. She closes her test. What should she have done instead?', c:['Nothing — finishing early is ideal','Used the 3 minutes to review her easiest 5-6 answers for careless errors','Used the 3 minutes to re-attempt the hardest question','Submitted and moved to Module 2 immediately'], a:1, e:'Extra time should be used to audit easy questions for careless errors — the highest ROI use of remaining time.' },
      { p:null, q:'What is the risk of rushing Module 1 to "save energy" for Module 2?', c:['No risk — Module 2 is what matters','Rushing Module 1 reduces accuracy, lowering both Module 1 score and routing you to an easier Module 2 (lower ceiling)','The SAT doesn\'t actually adapt between modules','You can\'t rush Module 1 — it\'s timed automatically'], a:1, e:'Rushing creates careless errors AND routes you to a lower-ceiling Module 2. Double penalty.' },
    ],
    U3:[
      { p:null, q:'You have 5 minutes left with questions #14, #18, #22, #25, #27 remaining. Which should you attempt first?', c:['#27 (hardest, most points)','#14 and #18 (earlier positions, more likely solvable)','Random order','All at equal speed simultaneously'], a:1, e:'Earlier-position questions are generally easier and higher-probability wins. Prioritize them when time is short.' },
      { p:null, q:'What is "difficulty-weighted decision making" in the context of the SAT?', c:['Spending equal time on every question','Spending more time on harder questions to maximize points','Prioritizing easier questions when time is limited, since they have a higher probability of correct answers','Skipping all hard questions at the start'], a:2, e:'When time is limited, easier questions yield more correct answers per minute. Prioritize by expected return.' },
      { p:null, q:'With 3 minutes left and 4 questions remaining (#21, #23, #25, #27), what is the correct approach?', c:['Try all 4 equally fast','Guess all 4 immediately, then carefully answer #21','Carefully answer #27 first (hardest = most valuable)','Leave all 4 blank'], a:1, e:'Guess all immediately to avoid blanks, then rescue the easiest one (#21) carefully. Easiest first, not hardest first.' },
    ],
    U4:[
      { p:null, q:'You\'ve been on a question for 90 seconds and still have no clear path. What is the correct action?', c:['Continue — the answer will come','Pick a random choice, flag it, and move to the next question','Skip with no guess','Re-read the question from the beginning twice more'], a:1, e:'After 60-90 seconds of no progress: make your best guess, flag in Bluebook, move on. Always guess — no penalty.' },
      { p:null, q:'After skipping a question and flagging it, you return with 2 minutes left. You still don\'t know the answer. What do you do?', c:['Leave it blank — don\'t risk a wrong answer','Your original guess is already recorded — verify it and move on','Change your answer to the one that sounds best','Delete your flagged answer'], a:1, e:'You already guessed when you flagged it. Your answer is there. Verify it\'s your best choice and move on.' },
      { p:null, q:'Which of the following correctly describes the "Skip and Return" strategy?', c:['Skip all hard questions and never return','Skip any question taking over 60 seconds with no progress, guess, flag it, then return with fresh eyes','Only skip questions in the last third of the module','Skip and leave blank — no guessing until you return'], a:1, e:'Skip + guess + flag + return. The guess ensures no blank answer even if you never return.' },
    ],
    U5:[
      { p:'Plants in the high desert have evolved thick waxy coatings on their leaves that reduce water loss by up to 80%.', q:'Before reading choices, your prediction for "What do the waxy coatings do?" should be:', c:['They make leaves look shiny','They prevent or reduce water loss significantly','They protect against insects','They absorb more sunlight'], a:1, e:'The passage directly states: waxy coatings reduce water loss by up to 80%. Your prediction should mirror this precisely.' },
      { p:null, q:'Why should you predict an answer BEFORE reading the choices on Reading questions?', c:['It saves time by eliminating the need to read choices','It prevents trap answers from influencing your reasoning by giving you an independent standard to compare against','The SAT rewards students who don\'t read the choices','Predictions are always correct'], a:1, e:'Wrong choices are designed to look plausible. A prediction acts as a filter — without it, every trap answer is a potential lure.' },
      { p:'The documentary received mixed reviews. Critics praised its cinematography but criticized its pacing.',  q:'Before looking at choices for "How did critics respond to the documentary?", your prediction should be:', c:['They loved it completely','They hated it because of the cinematography','Mixed — praised cinematography, criticized pacing','They refused to review it'], a:2, e:'Your prediction should directly mirror the passage: mixed response, cinematography praised, pacing criticized.' },
    ],
    U6:[
      { p:null, q:'Krystal gets a math question wrong because she multiplied when she should have divided. What error type is this?', c:['Content gap — she doesn\'t understand division','Careless error — she knew the concept but executed incorrectly','Trap triggered — the test planted multiplication as a trap','Time pressure'], a:1, e:'She understood the concept (division) but executed the wrong operation. That\'s a careless error, not a content gap.' },
      { p:null, q:'Which error type requires studying more content to fix?', c:['Careless error','Time pressure','Content gap','Trap triggered'], a:2, e:'Content gap errors mean you don\'t know the underlying concept — the fix is learning that concept. Other error types have different fixes (slow down, practice trap recognition, pace better).' },
      { p:null, q:'You consistently choose "extreme language" trap answers on Reading questions even after eliminating them mentally. What error type is this?', c:['Content gap','Careless error','Trap triggered','Time pressure'], a:2, e:'You recognize the trap (trap triggered) but still select it — this requires practicing trap recognition under test conditions until the habit changes.' },
    ],
    U7:[
      { p:null, q:'The average time per question across both SAT modules is approximately 83 seconds. Your TARGET for easy questions should be:', c:['83 seconds each','60 seconds — to bank time for harder questions','120 seconds — to ensure accuracy','As fast as possible'], a:1, e:'Target 60s on easy questions. This banks ~23 seconds per question, which adds up to 3+ extra minutes for hard questions later.' },
      { p:null, q:'You have 35 minutes for 27 questions. After 20 minutes you\'ve answered 15 questions. Are you on pace?', c:['Yes — 15 questions in 20 minutes is fine','No — 20 minutes for 15 questions = 80s average. You need to hit 60s on easy ones to finish.','Yes — you have 15 minutes for 12 questions (75s each), which is acceptable','Not enough information'], a:1, e:'80s average for the first 15 means the last 12 must average 75s — tight. You needed to be faster on easy questions to have more buffer.' },
      { p:null, q:'What is the recommended hard cap on any single SAT question before guessing and moving on?', c:['60 seconds','90 seconds','2 minutes (120 seconds)','No cap — keep working until you have an answer'], a:2, e:'Hard cap = 2 minutes. After 2 minutes on a hard question with no progress, your ROI goes to near zero. Guess and move.' },
    ],
    R1:[
      { p:'All living organisms require water to survive. Most known life forms on Earth use liquid water in their cellular processes.',  q:'Which word in the following choice is an extreme language trap? "Every organism in the universe requires liquid water to function."', c:['"Every" and "universe" — extreme scope and extreme claim','Only "liquid" — liquid water is scientifically accurate','Only "every" — the passage says "most"','The choice has no extreme language'], a:0, e:'"Every" and "universe" both overstep the passage. The passage says "most known life forms on Earth" — not all, not universe-wide.' },
      { p:'In the 1970s and 1980s, cassette tapes became a popular music format. However, by the late 1990s, CDs had largely replaced cassettes in consumer markets.', q:'Which choice contains extreme language that makes it an automatic elimination?', c:['CDs replaced cassettes in most consumer markets by the late 1990s','Cassettes became completely obsolete in all markets by 1990','CDs were a popular format in the 1990s','Cassettes were used primarily in the 1970s and 1980s'], a:1, e:'"Completely obsolete in all markets" uses extreme language (completely, all). The passage says "largely replaced" — not complete obsolescence.' },
      { p:null, q:'Which of the following phrases should ALWAYS trigger extreme language elimination on the SAT?', c:['"often suggests," "tends to indicate"','"never," "always," "entirely," "only"','"some researchers believe," "evidence suggests"','"approximately," "roughly," "about"'], a:1, e:'Never, always, entirely, only — absolute language. SAT correct answers avoid these because one counterexample disproves them.' },
    ],
    R2:[
      { p:'The study found that participants who slept fewer than 6 hours showed reduced cognitive performance on standardized memory tests.',  q:'Which choice is a Recycled Language Trap?', c:['Sleep deprivation reduced memory test performance','Fewer than 6 hours of sleep impairs memory test performance in the study','Sleep deprivation causes permanent cognitive damage','Participants who slept fewer than 6 hours showed reduced performance'], a:2, e:'C uses "sleep deprivation" and "cognitive" (passage words) but adds "permanent damage" — a twist the passage never supports. Classic recycled language trap.' },
      { p:null, q:'Why does the SAT place exact passage words in wrong answers?', c:['To reward students who memorize the passage','To trick students into selecting answers that feel familiar without checking the meaning','To test reading speed','To make the test easier'], a:1, e:'Familiar words trigger false recognition. The test exploits this by reusing vocabulary in choices that distort actual meaning.' },
      { p:'Research shows that exercise increases the production of BDNF, a protein that supports the growth of new neurons in the hippocampus.', q:'Which choice uses recycled language to create a wrong answer?', c:['Exercise promotes BDNF production and neuron growth in the hippocampus','BDNF supports neuron growth in the hippocampus when produced by exercise','Exercise eliminates all neurodegenerative diseases by increasing BDNF','BDNF is produced during exercise and affects hippocampal neurons'], a:2, e:'C recycles "BDNF," "exercise," and "neurodegenerative" but claims exercise "eliminates all neurodegenerative diseases" — a massive overreach not in the passage.' },
    ],
    R3:[
      { p:'The program improved student attendance rates significantly. However, test scores remained unchanged after its first year.',  q:'Which choice is half-right?', c:['The program improved attendance but had no effect on test scores in year one','The program improved both attendance and test scores','The program had no effect on either attendance or test scores','Attendance and test scores both changed under the program'], a:1, e:'B says "improved both" — but test scores remained unchanged. Half-right: attendance ✓, test scores ✗.' },
      { p:null, q:'How should you evaluate an answer choice that has two distinct claims joined by "and"?', c:['If the first claim is true, the whole choice is likely correct','Each claim must be independently verified against the passage — both must be accurate','If the second claim is true, the first is probably true too','Only the second claim needs to match the passage'], a:1, e:'Both parts must be accurate. Half-right is all-wrong. Check each claim independently.' },
      { p:'The vaccine was 94% effective at preventing severe illness in adults. However, its effectiveness in children under 5 was not studied.', q:'Which choice is half-right?', c:['The vaccine was 94% effective at preventing severe illness in adults','The vaccine was 94% effective in adults but its effectiveness in children under 5 is unknown','The vaccine was effective in both adults and children under 5','The vaccine\'s adult effectiveness was high, and it was approved for children'], a:2, e:'C says "effective in both adults and children under 5" — but the passage says effectiveness in children was NOT studied. Second half is wrong.' },
    ],
    R4:[
      { p:'Dr. Lee published her first novel at age 65. The book was a regional bestseller.', q:'Which answer is a Could-Be-True Trap?', c:['Dr. Lee published her first novel at 65','The novel was a regional bestseller','Dr. Lee likely struggled to find a publisher because of her age','The novel was published late in her life'], a:2, e:'C may be true in the real world, but the passage never mentions publishing struggles. It\'s plausible background knowledge, not passage evidence.' },
      { p:null, q:'The core rule of the Could-Be-True Trap is:', c:['True in the real world = valid SAT answer','True in the passage = valid SAT answer; true in the real world but not in the passage = wrong','Any statement that could be true is correct','Plausible inferences are always acceptable'], a:1, e:'The SAT is closed-world. Only what the passage says counts. Real-world plausibility is irrelevant.' },
      { p:'Mars has a thin atmosphere primarily composed of carbon dioxide. Surface temperatures range from −220°F to 70°F.', q:'Which choice is a Could-Be-True Trap for "What does the passage say about Mars\'s atmosphere?"', c:['Mars has a thin atmosphere','The atmosphere is primarily carbon dioxide','Mars cannot support human life due to its atmosphere','The atmosphere is thin and mostly carbon dioxide'], a:2, e:'C is plausible and likely true, but the passage never says Mars cannot support human life. Don\'t add conclusions the passage doesn\'t state.' },
    ],
    R5:[
      { p:'The new policy increased fuel efficiency requirements, which led to higher manufacturing costs. These costs were passed on to consumers in the form of higher vehicle prices.', q:'Which choice is an Opposite Trap?', c:['The policy increased manufacturing costs, which raised vehicle prices','Higher fuel efficiency requirements led to higher consumer prices','The policy decreased vehicle prices by improving efficiency','The policy raised costs for both manufacturers and consumers'], a:2, e:'C reverses the passage\'s direction — the policy INCREASED costs and prices, not decreased them. Classic opposite trap.' },
      { p:null, q:'The Opposite Trap is most dangerous on which type of question?', c:['Main idea questions','Questions about cause-and-effect relationships where direction matters','Grammar questions','Vocabulary questions'], a:1, e:'Direction errors (increases vs. decreases, caused vs. prevented) are easy to miss under time pressure. Always verify the direction of any causal relationship.' },
      { p:'Forests absorb carbon dioxide from the atmosphere during photosynthesis. Deforestation therefore increases the concentration of CO₂ in the atmosphere.', q:'Which choice is an Opposite Trap for "What is the relationship between deforestation and atmospheric CO₂?"', c:['Deforestation increases atmospheric CO₂ by removing forests that absorb it','Forests absorb CO₂, so removing them increases atmospheric CO₂','Deforestation reduces atmospheric CO₂ by eliminating CO₂-producing processes','CO₂ concentrations rise when forests are cleared'], a:2, e:'C says deforestation "reduces" CO₂ — the exact opposite of the passage. The passage says removing CO₂-absorbing forests raises CO₂ levels.' },
    ],
    R6:[
      { p:'Researcher Dr. Okafor developed a new water filtration system that removes 99.9% of contaminants. The system is also significantly less expensive than current alternatives.', q:'For the question "What does the passage identify as the system\'s primary innovation?", which choice is True But Irrelevant?', c:['It removes 99.9% of contaminants','It is less expensive than alternatives','The question does not specify one innovation — both are primary','The system uses a new filtration process'], a:2, e:'C is actually wrong — questions about "primary innovation" require a specific answer, not both. But the True But Irrelevant trap would be choosing the cost reduction detail when the question asks about a different aspect.' },
      { p:null, q:'After finding a choice that is supported by the passage, what is the final step before selecting it?', c:['Select it immediately — if it\'s true, it\'s correct','Re-read the question stem to verify the choice actually answers what was asked','Check if the choice uses exact words from the passage','Compare it to Choice A regardless of quality'], a:1, e:'Re-read the question stem. "True" isn\'t enough — the answer must answer the specific question that was asked.' },
      { p:'The company increased its revenue by 40% last year. Employee headcount also grew by 15%. The CEO attributed the revenue growth primarily to a new product line.', q:'For "What did the CEO attribute revenue growth to?", which choice is True But Irrelevant?', c:['A new product line, according to the CEO','Employee headcount grew by 15%','Revenue grew 40% last year','The company expanded last year'], a:1, e:'B is true and passage-supported, but it doesn\'t answer "what did the CEO attribute revenue growth to?" The question is about the CEO\'s stated cause, not employee counts.' },
    ],
    R7:[
      { p:'Artist Malia Fonoti sold 50,000 prints of her work in her first year. Photographer James Choi won the regional photography prize the same year.', q:'Which answer is a Comparison Fallacy?', c:['Malia Fonoti sold 50,000 prints in her first year','Both artists achieved recognition in the same year','Malia Fonoti was more commercially successful than James Choi','Both emerged as successful artists'], a:2, e:'C compares commercial success — but the passage only gives Fonoti\'s sales and Choi\'s prize. It never compares their commercial success to each other.' },
      { p:null, q:'When is a comparison in an answer choice acceptable on the SAT?', c:['Whenever two subjects appear in the same passage','Only when the passage explicitly makes that comparison','When the comparison seems logically obvious','When both subjects are evaluated by the same criteria'], a:1, e:'Only explicit, passage-stated comparisons are valid. If the passage doesn\'t compare them, the answer choice can\'t either.' },
      { p:'Company A has operated for 50 years and has 500 employees. Company B was founded 5 years ago and has 200 employees.', q:'Which answer contains a Comparison Fallacy?', c:['Company A has operated for 50 years','Company B has 200 employees','Company A is more stable than Company B because of its longer history','Both companies operate in a related industry'], a:2, e:'C infers "more stable" from "longer history" — but the passage makes no such comparison or conclusion. Adding your own inference = comparison fallacy.' },
    ],
    R8:[
      { p:'A study of 200 college students found that 73% preferred studying with background music.', q:'Which conclusion goes beyond the scope of the evidence?', c:['73% of the 200 students surveyed preferred studying with music','A majority of the surveyed students preferred background music while studying','Most college students in the world prefer studying with music','The study found that music is preferred by many surveyed students'], a:2, e:'C generalizes to "most college students in the world" from a study of 200 students. That\'s a scope trap — the evidence only supports conclusions about this specific sample.' },
      { p:null, q:'What is the key question to ask when evaluating the scope of an answer choice?', c:['"Is this claim true in the real world?"','"Does the evidence provided actually support this level of generalization?"','"Does this choice use exact words from the passage?"','"Is this claim short enough to be a concision answer?"'], a:1, e:'Scope evaluation = does the passage\'s evidence (sample size, context, specificity) actually support the claim\'s level of generality?' },
      { p:'In a poll of 500 Houston residents, 61% said they supported expanding the public transit system.', q:'Which conclusion accurately reflects the scope of the evidence?', c:['A majority of Americans support expanded public transit','61% of the 500 polled Houston residents expressed support for transit expansion','All Houston residents want more public transit','Transit expansion is a popular policy nationwide'], a:1, e:'B matches the exact scope: 61%, 500 polled, Houston residents. A, C, and D all generalize far beyond the evidence.' },
    ],
    R9:[
      { p:'Sociologist Dr. Nakamura shifted from studying individual behavior to studying group dynamics after observing that individual decisions were consistently shaped by group norms in ways her earlier models couldn\'t explain.', q:'What is Dr. Nakamura\'s motive for the shift?', c:['She found individual behavior boring','Her earlier models couldn\'t explain how group norms shaped individual decisions','Her university required a change in research focus','Group dynamics is a more prestigious field'], a:1, e:'Her stated motive is explicit: individual models couldn\'t explain the group norm influence she observed. B captures her stated reasoning.' },
      { p:null, q:'The Find the Motive Method is most useful for which type of question?', c:['Vocabulary questions','Questions about why a researcher, thinker, or character made a specific decision or choice','Questions about the structure of a passage','Grammar questions about verb tense'], a:1, e:'Motive questions ask "why did this person do X?" The answer is always in the author\'s explanation of that person\'s reasoning.' },
      { p:'Historian Elena Brandt focused her career on medieval trade routes, then pivoted to study medieval pandemics after a 2008 study showed that trade routes were the primary vectors for plague transmission.', q:'Why did Brandt change her research focus?', c:['She discovered a personal connection to plague history','New research revealed that her original subject (trade routes) was directly connected to her new focus (pandemics)','She was required to change by her institution','Medieval pandemics were understudied and needed attention'], a:1, e:'The motive is explicit: the 2008 study revealed a direct link between her original subject (trade routes) and pandemic transmission. B captures that connection.' },
    ],
    R10:[
      { p:'The Treaty of Westphalia, signed in 1648, ended the Thirty Years\' War and established the principle of national sovereignty that would shape international relations for centuries.', q:'Using Keyword Anchoring, which words from "What did the Treaty establish?" should you look for in the passage?', c:['"1648" and "centuries"','"Treaty" and "established"','"Wars" and "Westphalia"','"national" and "international"'], a:1, e:'"Treaty" and "established" are the keywords. Anchor to them, then read the surrounding sentence: "established the principle of national sovereignty." That\'s your answer.' },
      { p:null, q:'Why should you return to the passage to anchor your answer rather than answer from memory?', c:['The passage might have changed','Your memory of the gist may be correct but the specific wording matters for precision — exact phrasing determines right vs. wrong','Memory is never reliable','The SAT requires you to cite line numbers'], a:1, e:'SAT answers require precision. You might remember the general idea correctly but misremember a key qualifier ("some" vs. "all," "often" vs. "always"). Keyword anchoring gets you the exact wording.' },
      { p:'The Apollo 11 mission, launched in July 1969, carried three astronauts: Neil Armstrong, Buzz Aldrin, and Michael Collins. Armstrong and Aldrin landed on the Moon while Collins remained in orbit.', q:'For "Which astronauts landed on the Moon?", anchor to which keyword?', c:['July 1969','landed','orbit','Collins'], a:1, e:'Anchor to "landed." The sentence with that word: "Armstrong and Aldrin landed on the Moon while Collins remained in orbit." Your answer is right there.' },
    ],
    R11:[
      { p:'[P1] Scientists have debated the cause of mass extinctions for decades. [P2] Recent evidence increasingly points to massive volcanic eruptions releasing greenhouse gases as a primary cause. [P3] Critics argue, however, that asteroid impacts remain a viable explanation for at least some extinctions. [P4] Most researchers now favor a multi-cause model incorporating both volcanic and impact events.', q:'What is the function of paragraph 3?', c:['Summarizes the evidence for volcanic eruptions','Presents a counterargument to the volcanic theory','Introduces the multi-cause model','Explains the history of the debate'], a:1, e:'P3 introduces critics who challenge the volcanic theory with asteroid impact as an alternative. Its function is to provide a counterargument.' },
      { p:null, q:'When should you write paragraph function labels?', c:['Only for main idea questions','Immediately after reading each paragraph of multi-paragraph passages','Only when structure questions are asked','After reading all the questions first'], a:1, e:'Write labels as you read — "introduces problem," "provides evidence," "counterargument," "conclusion." This takes 30 seconds and answers structure questions instantly.' },
      { p:'[P1] The Arctic ice cap has shrunk significantly in recent decades. [P2] Researchers attribute this to rising global temperatures caused by increased greenhouse gas concentrations. [P3] The shrinkage has opened new shipping routes, though it has disrupted local ecosystems and indigenous communities.', q:'What is the function of paragraph 3?', c:['Introduces the main cause of Arctic ice loss','Presents consequences of the phenomenon described in P1 and P2','Contradicts the explanation in P2','Summarizes the research methods'], a:1, e:'P3 presents consequences (positive: new shipping routes; negative: ecosystem disruption). It extends the discussion by describing the effects of what P1 and P2 described.' },
    ],
    R12:[
      { p:'Entrepreneur Priya Singh built her first company from a single product idea into a regional brand with 50 employees within three years. Her success stemmed from identifying underserved markets and moving quickly to fill them before competitors could respond.', q:'Write a one-line headline before looking at choices. Which choice matches it best?', c:['Priya Singh started a company with 50 employees','Entrepreneur success story: Singh grew a company in three years','Singh built a successful brand by identifying underserved markets and moving quickly','Singh\'s company was founded on a single product idea'], a:2, e:'Your headline should be: "Entrepreneur succeeds by finding underserved markets and moving fast." C matches that scope and emphasis. A, B, D are too narrow or too general.' },
      { p:null, q:'The One-Line Headline Test is specifically designed to prevent which common error?', c:['Picking the extreme language trap','Picking a detail from one paragraph as the main idea','Picking a recycled-language choice','Picking the shortest answer'], a:1, e:'The headline test forces you to capture what the WHOLE passage is about — not an interesting detail from one paragraph.' },
      { p:'Scientists are studying how gut microbiome composition affects mood and behavior. Multiple studies have found correlations between certain bacterial populations and conditions like depression and anxiety. Researchers caution that causation has not been established.', q:'Best headline for this passage?', c:['Scientists have found bacteria that cure depression','Research links gut bacteria to mood, but causation is unproven','Depression can be treated by changing gut bacteria','Multiple studies on the gut microbiome have been published'], a:1, e:'B captures the main idea: research links gut bacteria to mood (finding) + causation unproven (important caveat). A and C overstate the research; D is too generic.' },
    ],
    R13:[
      { p:'The perennial challenge of democratic governance lies not in the mechanics of voting, but in cultivating among citizens a disposition toward rational deliberation — a willingness to engage competing perspectives before forming judgments.', q:'Paraphrase this passage before looking at choices. Which correctly captures it?', c:['Voting is the main challenge in democracy','The real challenge of democracy is getting citizens to think carefully and consider other views before deciding','Democracy requires more voting participation','Democratic mechanics need to be reformed'], a:1, e:'Your paraphrase: "Democracy\'s problem isn\'t voting — it\'s getting people to think before deciding." B matches precisely. A and C miss the main point; D adds reform content not stated.' },
      { p:null, q:'When should you use the Paraphrase Before Looking strategy?', c:['On every passage before reading any questions','On passages written in dense, archaic, or unusually formal language that creates cognitive load','Only on CLT passages','Only when you have extra time'], a:1, e:'Paraphrasing is most valuable on complex passages. It clears cognitive load before you evaluate choices, making trap answers less effective.' },
      { p:'The exigencies of wartime production compelled industrial concerns to relinquish accustomed practices and adopt unprecedented organizational configurations that might otherwise have been deemed inimical to established operational hierarchies.', q:'Best plain-language paraphrase of this passage?', c:['Wartime is dangerous for industry','War forced companies to change their usual practices and adopt new organizational structures','Industrial organizations were harmed by wartime conditions','Management hierarchies were destroyed by the war'], a:1, e:'B: "War forced companies to change practices and adopt new structures" — captures the core idea simply. A and C miss the point; D overstates "destroyed."' },
    ],
    G1:[
      { p:null, q:'The sentence reads: "She was known for her speed, her precision, and [BLANK] ability to stay calm." What pattern should the blank follow?', c:['"her amazing and wonderful" (adding emphasis)','her (matching the previous "her" pattern)','with the (adding a different article structure)','for her (repeating "for her")'], a:1, e:'Pattern: "her speed, her precision, and her ___." Parallel structure requires matching "her." No need to know the rule name — just match the pattern.' },
      { p:null, q:'A student doesn\'t know the name "dangling modifier" but hears that the sentence sounds wrong when read aloud. Should she attempt the question?', c:['No — she needs to know the rule name to identify the error','Yes — if she can hear the pattern is wrong and identify the correct fix, she can answer correctly without knowing the rule name','No — grammar rules must be memorized by name','Yes, but only by guessing'], a:1, e:'Pattern recognition is the skill. Rule naming is optional. If you can hear what sounds right and wrong, you can answer grammar questions.' },
      { p:null, q:'The sentence: "The team played aggressively, intelligently, and [BLANK]." Which choice correctly completes the parallel pattern?', c:['with great enthusiasm','enthusiastically','in an enthusiastic manner','showing their enthusiasm'], a:1, e:'Pattern: "aggressively, intelligently, and ___." All are adverbs ending in -ly. The blank should be an adverb: "enthusiastically."' },
    ],
    G2:[
      { p:null, q:'The choices for a concision question are: (A) "due to the fact that," (B) "because of," (C) "in light of the fact that," (D) "because." Which should you select?', c:['A','B','C','D'], a:3, e:'"Because" (D) is the shortest and most direct way to say the same thing as A, B, or C. Shortest grammatically correct answer wins on concision questions.' },
      { p:null, q:'Which signal tells you a question is testing concision rather than another grammar rule?', c:['All four choices use different punctuation','All four choices express the same basic meaning but at different lengths','Two choices use transition words','The choices include opposite-direction transitions'], a:1, e:'When all choices say essentially the same thing but at different lengths, it\'s a concision question. The shortest grammatically correct version is almost always right.' },
      { p:null, q:'Which choice is most concise for: "The committee met together for the purpose of discussing the issues involved."', c:['The committee convened to discuss the issues','The committee met together and engaged in discussing the relevant issues that were involved','The committee assembled for discussion purposes of various issues','The committee met to discuss the issues'], a:3, e:'"The committee met to discuss the issues" (D) — removes "together" (redundant with "met"), "for the purpose of" (wordy), and "involved" (unnecessary). Tightest version.' },
    ],
    G3:[
      { p:null, q:'Two ideas: (1) "The experiment produced clear results." (2) "The methodology had serious flaws." What transition correctly links these?', c:['Therefore, the methodology had serious flaws','Furthermore, the methodology had serious flaws','Nevertheless, the methodology had serious flaws','Similarly, the methodology had serious flaws'], a:2, e:'Idea 2 contradicts idea 1 — this is contrast. "Nevertheless" (or "however") is the correct contrast transition. "Therefore" = cause-effect; "Furthermore" = continuation; "Similarly" = comparison.' },
      { p:null, q:'The sentence reads: "The film received mixed reviews. [BLANK], it broke box office records." What logical relationship exists between these two ideas?', c:['Cause-effect — the mixed reviews caused the box office success','Contrast — mixed reviews yet financial success','Continuation — the reviews and box office are on the same theme','Example — box office records are an example of mixed reviews'], a:1, e:'Mixed reviews (negative implication) + broke records (positive result) = contrast. The second idea is surprising given the first. Use "Nevertheless" or "However."' },
      { p:null, q:'Which transition correctly completes: "Temperatures dropped to record lows overnight. [BLANK], the outdoor concert was cancelled."', c:['However','In contrast','As a result','Similarly'], a:2, e:'Record low temps CAUSED the concert cancellation. This is a cause-effect relationship. "As a result" (or "Therefore," "Consequently") is correct.' },
    ],
    G4:[
      { p:null, q:'Which sentence correctly uses a semicolon?', c:['She studied hard; the exam.','She studied hard; she passed the exam.','She; studied hard and passed the exam.','She studied; hard for the exam.'], a:1, e:'A semicolon joins two independent clauses (two complete sentences). B: "She studied hard" and "she passed the exam" are both independent clauses. Correct.' },
      { p:null, q:'The sentence: "The team needed one thing [BLANK] more practice." What punctuation should fill the blank?', c:[',',';',':','—'], a:2, e:'A colon introduces what follows. "The team needed one thing" is a complete clause, and "more practice" is what that thing is. Colon (:) is correct.' },
      { p:null, q:'Which sentence contains a comma splice (and is therefore wrong on the SAT)?', c:['She ran every morning, and she completed the marathon.','She ran every morning; she completed the marathon.','She ran every morning, she completed the marathon.','She ran every morning and completed the marathon.'], a:2, e:'C puts a comma between two independent clauses with no coordinating conjunction (and/but/or/so). That\'s a comma splice — always wrong on the SAT.' },
    ],
    G5:[
      { p:null, q:'In the sentence "The box of chocolates [BLANK] on the counter," what is the subject?', c:['chocolates','box','counter','The box of chocolates'], a:1, e:'Cross out "of chocolates" (prepositional phrase). Subject = "box." The verb must agree with "box" (singular), not "chocolates" (plural).' },
      { p:null, q:'Which verb correctly completes: "The results of the three-year study [BLANK] been published."', c:['has','have','was','is'], a:1, e:'Cross out "of the three-year study." Subject = "results" (plural). Plural subject requires plural verb: "have been published."' },
      { p:null, q:'Why does the SAT insert a plural noun phrase between a singular subject and its verb?', c:['To make sentences more interesting','To trick students into making the verb agree with the nearest noun instead of the actual subject','To test knowledge of prepositional phrases','To practice sentence variety'], a:1, e:'The trap is proximity: "collection of manuscripts" — "manuscripts" is closer to the verb, so students write "have" instead of "has." Isolation prevents this.' },
    ],
    G6:[
      { p:null, q:'The sentence: "The researchers placed the samples in the machines. They then analyzed the results." What is wrong?', c:['Verb tense inconsistency','Ambiguous pronoun — "They" could refer to the researchers or the machines','Comma splice between the two sentences','Subject-verb disagreement'], a:1, e:'"They" could refer to "researchers" or "machines." The pronoun is ambiguous. Fix: "The researchers then analyzed the results."' },
      { p:null, q:'Which replacement for the underlined pronoun makes the sentence unambiguous? "The scientists studied the microbes until they became inactive."', c:['The scientists studied the microbes until the scientists became inactive','The scientists studied the microbes until the microbes became inactive','The scientists studied the microbes until it became inactive','No change needed — "they" is clear'], a:1, e:'B specifies "the microbes" — which is what logically becomes inactive (not the scientists). Clear antecedent = no ambiguity.' },
      { p:null, q:'Which sentence has a pronoun-antecedent NUMBER error?', c:['Each student submitted their paper on time.','The students submitted their papers on time.','All students submitted their papers on time.','Every student submitted their paper on time.'], a:0, e:'Technically "each student" is singular, but "their" is plural. A and D have this pattern. The SAT typically tests clear antecedent errors more than singular "they" — but number mismatches are still tested.' },
    ],
    G7:[
      { p:null, q:'The sentence: "By the time she arrived, the meeting [BLANK] already started." Which tense is correct?', c:['started','had started','has started','was starting'], a:1, e:'Time anchor: "By the time she arrived" — one past event (arriving) happened AFTER another past event (meeting starting). Past perfect (had started) signals the earlier of two past events.' },
      { p:null, q:'The sentence: "Currently, the organization [BLANK] volunteers from all over the region." Which tense matches "currently"?', c:['recruited','had recruited','recruits','was recruiting'], a:2, e:'Time anchor: "Currently" = present. Present simple tense: "recruits." No shift needed — no time marker signals a change.' },
      { p:null, q:'The sentence: "She trained for six months before she [BLANK] the competition." Which tense is correct?', c:['enters','had entered','entered','has entered'], a:2, e:'Time anchor: "trained for six months before" — both events are in the past. For two past events with no special earlier/later emphasis, use simple past for both: "entered."' },
    ],
    M1:[
      { p:null, q:'You need to solve: 2x − 3 = 11. The choices are 5, 7, 9, 11. Using Backsolving, what should you test first?', c:['Choice A (5)','Choice B (7)','The largest choice (11)','The smallest choice (5)'], a:1, e:'Start with the middle value — Choice B (7). Test: 2(7)−3 = 11. ✓ Done in one step.' },
      { p:null, q:'You test Choice B (middle value) in the equation and it gives you a number that is too small. What should you test next?', c:['Choice A (smaller value)','Choice C or D (larger values)','Re-test Choice B more carefully','Stop — Choice B must be correct'], a:1, e:'If the middle value is too small, the answer is larger. Test C next. If C is still too small, D is your answer. If C is too large, it\'s between B and C — usually C is it.' },
      { p:null, q:'For which type of SAT problem is Backsolving most useful?', c:['Problems where answer choices are expressions with variables','Problems with word descriptions but no numerical choices','Problems where the answer choices are specific numbers and the problem asks you to find a value','Problems about grammar or punctuation'], a:2, e:'Backsolving works when choices are specific numbers and the problem asks you to find a value. With variable choices, use Plug In Numbers instead.' },
    ],
    M2:[
      { p:null, q:'The choices are: (A) 2n, (B) n+2, (C) 2n+2, (D) n². You plug in n=3. Your target answer is 8. Which choice is correct?', c:['A: 2(3)=6','B: 3+2=5','C: 2(3)+2=8','D: 3²=9'], a:2, e:'At n=3: C = 2(3)+2 = 8. Matches target. C is correct.' },
      { p:null, q:'Why should you avoid plugging in 0 or 1 when using Plug In Numbers?', c:['They are too small to be useful','They create special mathematical results that make multiple choices appear correct (anything times 0 is 0; anything to the power 1 is itself)','They make the arithmetic harder','The SAT specifically prohibits using 0 or 1'], a:1, e:'0 eliminates multiplication terms (n×anything=0) and 1 makes powers trivial (1^n = 1). These special cases can make multiple wrong choices evaluate to the same number as the correct one.' },
      { p:null, q:'You plug in n=4 and your target is 18. Choices evaluate to: A=16, B=18, C=18, D=20. What should you do?', c:['Pick B since it appeared first','Pick C since it appeared last','Try a second value (e.g., n=5) to differentiate B and C','Pick D — there must be an error'], a:2, e:'When two choices give the same result, try a second number. At n=5: test B and C with your formula and see which matches the new target.' },
    ],
    M3:[
      { p:null, q:'A price is discounted by 30%, then increased by 30%. Using $100 as a starting point, what is the final price?', c:['$100 (no change)','$91','$96','$103'], a:1, e:'Start at 100. Decrease 30%: 100×0.70=70. Increase 30%: 70×1.30=91. Net: $91. Not $100 — percentage changes compound on a new base.' },
      { p:null, q:'Why use 100 as the starting value for percentage problems with unspecified originals?', c:['100 is the SAT\'s default assumption','Using 100 makes percentage of 100 = just the percentage number itself, eliminating the need for abstract calculation','All prices start at $100','The SAT rounds to $100 in percentage problems'], a:1, e:'20% of 100 = 20. 35% of 100 = 35. The arithmetic becomes trivial when you start with 100.' },
      { p:null, q:'A salary increased by 25% and then decreased by 20%. What is the net percent change from the original?', c:['5% increase','0% change','0% decrease','−5% change'], a:0, e:'Start at 100. Up 25%: 100×1.25=125. Down 20%: 125×0.80=100. Net = 0. The percentages happened to cancel in this case (unusual — most don\'t).' },
    ],
    M4:[
      { p:null, q:'Which equation is most efficiently solved by testing answer choices rather than algebraic manipulation?', c:['x + 5 = 12 (one-step algebra)','3x = 21 (one-step algebra)','x² − 7x + 12 = 0 (quadratic that may or may not factor cleanly)','2x = 10 (one-step algebra)'], a:2, e:'Quadratics can be time-consuming to factor. If the choices are specific numbers, testing them is often faster than factoring, especially if the quadratic doesn\'t factor cleanly.' },
      { p:null, q:'You\'re testing choices for x³ − 2x² − 5x + 6 = 0. Choices: −2, 1, 2, 3. You test x=1: 1−2−5+6=0. ✓ What is the answer?', c:['x = −2','x = 1','x = 2','x = 3'], a:1, e:'x=1 works. Choice B. You found it by substitution without needing to factor a cubic — which would take much longer.' },
      { p:null, q:'When is "Solve Algebra Without Algebra" (plugging in choices) NOT a good strategy?', c:['When the problem has a quadratic','When the choices are expressions with variables rather than specific numbers','When the equation has two solutions','When the problem is in word form'], a:1, e:'You can\'t test variable choices back into the equation (that\'s circular). Use Plug In Numbers (M2) instead when choices contain variables.' },
    ],
    M5:[
      { p:null, q:'The answer choices for a geometry problem are: 2, 8, 45, 312. The figure shows a small triangle inscribed in a square with side length 4. Which choices can you immediately eliminate?', c:['None — all are possible','45 and 312 — both too large for a figure with side length 4','Only 312 — definitely too large','Only 2 — too small'], a:1, e:'A triangle inscribed in a 4×4 square can\'t have an area larger than 16 (the square itself). 45 and 312 are both impossible. Eliminate immediately.' },
      { p:null, q:'Your calculation gives an answer of 487 for the area of a circle drawn inside a 10×10 square. What should you conclude?', c:['487 is correct — trust the calculation','487 is wrong — a circle inside a 10×10 square has maximum area of π×5²≈78.5, so 487 is impossible','487 might be right if the circle is large','487 is the diameter, not the area'], a:1, e:'Ballpark: circle inside 10×10 square, max radius = 5. Max area ≈ π×25≈78.5. A result of 487 is impossible — there must be a calculation error. Ballparking caught it.' },
      { p:null, q:'The answer choices are 0.03, 0.3, 3, 300. Your estimate suggests the answer should be between 1 and 10. Which choices are immediately eliminated?', c:['All except 3','All except 0.3','None — estimates can be wrong','0.03 and 300'], a:0, e:'Your estimate (1-10) eliminates 0.03 (too small) and 300 (too large). Only 3 remains in range. This is ballparking reducing 4 choices to 1 before doing precise calculation.' },
    ],
    M6:[
      { p:null, q:'A faucet fills a tank at 3 gallons per minute. How many seconds does it take to fill a 9-gallon tank? Set up the units correctly.', c:['9 gallons ÷ 3 gal/min = 3 min = 180 seconds','9 gallons × 3 gal/min = 27 seconds','9 gallons ÷ 3 gal/min = 3 seconds','3 gal/min ÷ 9 gallons = 0.33 min'], a:0, e:'9 gal ÷ (3 gal/min) = 3 min. Units: gal ÷ (gal/min) = min. ✓ Convert: 3 min × 60 s/min = 180 seconds. Units checked out correctly.' },
      { p:null, q:'Why does tracking units help prevent errors in rate problems?', c:['Units are decorative labels that don\'t affect calculations','If your equation is set up correctly, the units will cancel to give only the units you need; if they don\'t cancel correctly, your setup is wrong','The SAT always asks for answers in the same units as the problem','Units matter only in physics, not math'], a:1, e:'Units are your equation\'s built-in error checker. Distance ÷ (distance/time) = time. If your units don\'t cancel to give what you need, your fraction is inverted.' },
      { p:null, q:'A machine produces 120 widgets per hour. At this rate, how many minutes does it take to produce 30 widgets?', c:['2 minutes','4 minutes','15 minutes','30 minutes'], a:2, e:'Rate: 120 widgets/hr. Time for 30: 30 ÷ 120 = 0.25 hr. Convert: 0.25 hr × 60 min/hr = 15 minutes. Units: widgets ÷ (widgets/hr) = hr → convert to min.' },
    ],
    M7:[
      { p:null, q:'The sum of three consecutive integers is 36. The choices are 10, 11, 12, 13. What is the trap choice, and what is the correct answer?', c:['Trap: 10; Correct: 13','Trap: 12 (the middle integer); Correct: 13 (the largest)','Trap: 11 (the first); Correct: 12 (the middle)','Trap: 13; Correct: 11'], a:1, e:'n+(n+1)+(n+2)=36 → 3n+3=36 → n=11. The integers are 11, 12, 13. If the question asks for the LARGEST, answer is 13. Trap choice 12 (middle/most obvious) catches students who solve for the wrong integer.' },
      { p:null, q:'You calculate that a rectangle\'s area is 24. The question asks for its PERIMETER. The choices include 24. What should you do?', c:['Select 24 — your calculation matches a choice, so it must be right','Pause — the question asks for perimeter, not area. Your 24 may be the trap answer for students who solve the wrong quantity','Change your approach entirely','24 can\'t be right since perimeter and area have different units'], a:1, e:'Trap answers are often the result of a correct sub-calculation applied to the wrong final question. Your area of 24 might be exactly the trap answer. Solve for perimeter.' },
      { p:null, q:'Which habit prevents falling into Trap Answer Arithmetic?', c:['Always pick the smallest numerical answer','After solving, re-read the LAST LINE of the question to confirm you answered what was asked','Trust your first instinct and submit immediately','Work backwards from all four choices every time'], a:1, e:'After solving, re-read the question\'s final line. "What is the value of 2x+1?" is different from "What is the value of x?" Re-reading catches the most common trap answer errors.' },
    ],
    M8:[
      { p:null, q:'If m is a positive even integer and n is a negative odd integer, which of the following must be negative?', c:['m + n','m × n','m − n','n²'], a:1, e:'m×n: positive × negative = always negative. m+n: could be positive if m>|n|. m−n: positive minus negative = positive. n²: odd²=odd, negative²=positive. Only m×n must be negative.' },
      { p:null, q:'What does "must be" mean in a number properties question, versus "could be"?', c:['"Must be" and "could be" mean the same thing on the SAT','"Must be" means true for ALL valid values of the variable; "could be" means true for AT LEAST ONE value','"Must be" applies only to positive numbers','"Could be" applies only to prime numbers'], a:1, e:'"Must be" = always true, no exceptions. "Could be" = true for at least one case. Test "must be" questions by trying to find a counterexample — if you find one, eliminate that choice.' },
      { p:null, q:'If p is prime and p > 2, which of the following must be true?', c:['p is odd','p is divisible by 3','p² is even','p + 1 is prime'], a:0, e:'All primes greater than 2 are odd (if even, divisible by 2, therefore not prime). So p must be odd. p might not be divisible by 3; p² = odd × odd = odd (not even); p+1 is even, unlikely prime (except 2).' },
    ],
    M9:[
      { p:null, q:'A square has side length 6. A circle is inscribed in the square (touching all four sides). What can you estimate as the circle\'s area without calculating precisely?', c:['More than 36 (the square\'s area)','Exactly 36','Between 25 and 36 — less than the square but most of it','Less than 5'], a:2, e:'Radius = 3 (half of 6). Area = π×9 ≈ 28.3. That\'s between 25 and 36. Visual estimation: the circle fills most of the square but doesn\'t reach the corners.' },
      { p:null, q:'A diagram shows a right triangle. The figure looks like the legs are approximately equal. If one leg is labeled 5, a reasonable estimate for the hypotenuse is:', c:['About 5 (same as the leg)','About 7 (a bit longer than each leg — √50≈7.07)','About 10 (double a leg)','About 25 (leg squared)'], a:1, e:'For an isosceles right triangle: hypotenuse = leg × √2 ≈ 1.41 × leg. 5 × 1.41 ≈ 7. Visual estimation confirms: hypotenuse is longer than a leg but less than both legs combined.' },
      { p:null, q:'Your calculation gives an area of 150 for a triangle with base 12 and height 8. Is this reasonable?', c:['Yes — area = base × height = 12 × 8 = 96... wait, no','No — area of triangle = ½ × base × height = ½ × 12 × 8 = 48, not 150','Yes — 150 is always a reasonable triangle area','Cannot determine without more information'], a:1, e:'½ × 12 × 8 = 48, not 150. Visually, a triangle with base 12 and height 8 should have area less than the rectangle (12×8=96). 150 > 96 = impossible. Ballparking caught the error.' },
    ],
    M10:[
      { p:null, q:'Which feature of a quadratic function can you most quickly find using Desmos?', c:['The formal name of the equation type','The x-intercepts (zeros) of the function — visible the instant the graph appears','The domain restriction','The number of terms in the polynomial'], a:1, e:'Graph the function in Desmos and the x-intercepts are immediately visible. No factoring, no quadratic formula required.' },
      { p:null, q:'You need to find the vertex of f(x) = 2x² − 8x + 6. What is the fastest approach?', c:['Complete the square algebraically','Use the formula x = −b/2a to find x, then substitute','Type it into Desmos — the vertex is the lowest point on the parabola, visible immediately','Factor out the leading coefficient first'], a:2, e:'Desmos shows the vertex visually. Click or hover to see the exact coordinates. 15 seconds vs. 2 minutes of algebra.' },
      { p:null, q:'A function crosses the x-axis at −3 and +5. Using Desmos, which approach finds these values fastest?', c:['Algebraically set f(x)=0 and solve','Graph the function; the x-intercepts appear immediately','Plug in x=−3 and x=5 to verify','Complete the square to find the vertex, then extrapolate'], a:1, e:'Graph it. The zeros are the x-intercepts — visible the instant the function is plotted. No algebra needed to identify them.' },
    ],
    M11:[
      { p:null, q:'System: y = 3x − 1 and y = −2x + 9. What should you do in Desmos?', c:['Add the equations algebraically first, then graph the result','Graph both equations; find the intersection point\'s coordinates','Graph only y = 3x − 1, then add 9','Subtract one equation from the other first'], a:1, e:'Graph both. They intersect at one point. Those coordinates are the solution. No algebra needed.' },
      { p:null, q:'The intersection of two lines is at (4, 7). The question asks: "What is the value of y − x at the solution?" What is the answer?', c:['4','7','3','11'], a:2, e:'At the intersection, x=4 and y=7. The question asks for y−x = 7−4 = 3. Critical: read what the question asks BEFORE reading coordinates off the graph.' },
      { p:null, q:'A system of two equations has no intersection point when graphed in Desmos. What does this mean?', c:['Desmos has an error','The system has infinitely many solutions','The system has no solution — the equations are parallel','The equations are identical'], a:2, e:'Parallel lines never intersect = no solution. If the lines overlap (same line), infinitely many solutions. If they cross once = one solution.' },
    ],
    M12:[
      { p:null, q:'The function f(x) = ax² passes through (2, 16). Using the slider method in Desmos, what value of a should your slider reach?', c:['a = 2','a = 4','a = 8','a = 16'], a:1, e:'At x=2, f(2)=a(4)=16, so a=4. In Desmos: graph y=ax² with a slider. Drag until the parabola passes through (2, 16). The slider stops at a=4.' },
      { p:null, q:'The slider method is MOST useful compared to algebra when:', c:['The parameter relationship is simple (e.g., f(x) = kx)','The function is complex (e.g., involves trig or compound expressions) and solving for k algebraically would be time-consuming','You don\'t have Desmos access','The answer choices are expressions, not numbers'], a:1, e:'For simple functions like kx, just substitute. Sliders shine when the function is complex enough that solving for the parameter algebraically would take 2+ minutes.' },
      { p:null, q:'You\'re looking for k such that g(x) = k·sin(x) passes through (π/2, 3). Without Desmos, solving requires trig knowledge. With Desmos slider, how long should this take?', c:['Same time — Desmos doesn\'t help with trig functions','About 15-20 seconds — graph k·sin(x), drag slider until the curve passes through (π/2, 3)','Several minutes — trig functions are complex in Desmos','Desmos can\'t graph trig functions'], a:1, e:'Desmos handles trig perfectly. Type "k*sin(x)", create a slider for k, drag until it passes through (π/2, 3). The slider lands at k=3. Done in 20 seconds.' },
    ],
    M13:[
      { p:null, q:'You graph f(x) = (2x + 1)² and g(x) = 4x² + 4x + 1 in Desmos. The graphs are identical. What can you conclude?', c:['The functions have the same domain','The functions are equivalent — they produce the same output for every input','The functions will look different if you zoom in','They are equivalent only for positive x values'], a:1, e:'Identical graphs = equivalent expressions for all x-values. Algebraic verification: (2x+1)² = 4x²+4x+1. ✓' },
      { p:null, q:'You plug x=2 into two expressions and both give 9. What can you conclude?', c:['The expressions are equivalent','The expressions might be equivalent — they agree at x=2 but could differ elsewhere. Test a second value or graph both.','They are not equivalent because they\'re written differently','One of them must be wrong'], a:1, e:'Agreement at one point ≠ equivalent. Example: x² and 2x+5 both equal 9 at x=3 and x=... wait, let me check. At x=2: 4 vs. 9 — actually different. But the point is: one test point is not enough. Graph both.' },
      { p:null, q:'Which expression is equivalent to (x − 4)(x + 4)?', c:['x² + 8x − 16','x² − 16','x² − 8','x² + 16'], a:1, e:'Graph both (x−4)(x+4) and x²−16 in Desmos. Identical graphs confirm equivalence. Algebraic check: (x−4)(x+4) = x²−4x+4x−16 = x²−16. ✓' },
    ],
    M14:[
      { p:null, q:'A graph shows a line passing through (0, −2) and (3, 4). Which equation represents this line?', c:['y = 2x − 2','y = x + 2','y = 3x − 2','y = 2x + 2'], a:0, e:'Plot (0,−2) and (3,4) in Desmos. Test y=2x−2: at x=0, y=−2 ✓; at x=3, y=4 ✓. Slope=(4−(−2))/(3−0)=6/3=2; y-intercept=−2. y=2x−2.' },
      { p:null, q:'You need to identify which of 4 equations matches a graph. The fastest Desmos approach is:', c:['Graph all 4 equations simultaneously and see which overlaps the target','Test one specific point that\'s clearly on the target graph, eliminate choices that don\'t pass through it, then confirm with a second point','Graph only the first choice','Calculate slope and intercept algebraically for each option'], a:0, e:'Graphing all 4 simultaneously is fast — the one that overlaps the target graph is the answer. If too cluttered, use point-testing to narrow down first.' },
      { p:null, q:'A parabola passes through (0, 4), has vertex at (2, 0), and opens upward. Which equation fits?', c:['y = (x − 2)²','y = x² + 4','y = (x + 2)²','y = x² − 4'], a:0, e:'Vertex at (2,0) and opens upward: vertex form is y = a(x−2)². Test (0,4): 4=a(−2)²=4a → a=1. Equation: y=(x−2)². Graph it in Desmos to confirm it passes through (0,4) and has vertex (2,0).' },
    ],
    M15:[
      { p:null, q:'You need to find 15% of 80. Should you use Desmos?', c:['Yes — Desmos calculates percentages accurately','No — 15% of 80 = 12, solvable in under 10 seconds in your head','Yes — any calculation with percentages benefits from Desmos','Yes — always use Desmos for calculations'], a:1, e:'15% of 80 = 0.15 × 80 = 12. Ten seconds mentally. Opening Desmos takes 20 seconds. Skip it.' },
      { p:null, q:'Which of these problems SHOULD use Desmos?', c:['4 + 7 × 2','Find the zeros of y = x³ − 3x² − x + 3','Solve 2x = 10','Calculate 30% of 200'], a:1, e:'A cubic has 3 potential zeros — graphing is far faster than factoring or numerical methods. The other problems are simple arithmetic or one-step algebra.' },
      { p:null, q:'You have 90 seconds left in the module with 1 question remaining. The question asks for the intersection of y = x + 5 and y = 2x − 1. Should you use Desmos?', c:['Yes — always graph systems of equations','No — with 90 seconds, opening Desmos takes 20 seconds. Solve algebraically: x+5=2x−1 → x=6 → y=11. Faster.','No — there is no way to find the intersection','Yes, but only if Desmos opens instantly'], a:1, e:'With 90 seconds, the algebraic solution (30 seconds) is faster than opening and typing in Desmos (30-45 seconds + reading). Desmos is better when you have more time.' },
    ],
    C1:[
      { p:'Cardinal Newman writes with evident admiration of the medieval scholastics, noting their "laborious intellectual discipline" and "reverence for the accumulated wisdom of ages" as among the highest examples of the philosophical mind at work.', q:'Newman\'s tone in this passage is best described as', c:['Critical of medieval philosophy\'s limitations','Nostalgic for a lost era of scholarship','Reverently admiring of the scholastic tradition','Skeptical of the value of historical philosophical methods'], a:2, e:'Tone markers: "evident admiration," "laborious," "reverence," "highest examples." All positive and elevated. Tone = Reverently admiring. Eliminate critical, nostalgic (no sadness), and skeptical.' },
      { p:null, q:'You label a CLT author\'s tone as "Cautionary." Which type of inference question can you predict the answer to?', c:['Questions about the author\'s vocabulary choices','Questions about what the author would likely say about a new development (they would warn against it or note its risks)','Questions about the passage\'s grammatical structure','Questions about publication date'], a:1, e:'Tone acts as a prediction engine. A cautionary tone means: the author values careful approach, warns against haste, notes dangers. Inference questions about the author\'s likely view trace back to this.' },
      { p:'Chesterton writes with barely concealed impatience at the modern tendency to call the ordinary "boring," insisting that only poverty of imagination prevents one from perceiving the miraculous in the mundane.', q:'Chesterton\'s tone toward those who find the ordinary boring is best described as', c:['Sympathetic — he understands their perspective','Playfully dismissive — he thinks their "boredom" reflects a failure of imagination, not a property of the world','Uncertain — he acknowledges both views','Enthusiastically supportive of the modern tendency'], a:1, e:'"Barely concealed impatience," "poverty of imagination" — these signal mild contempt or dismissiveness, but the word "playfully" fits his style. He\'s not angry, he\'s almost amused by the failure.' },
    ],
    C2:[
      { p:'[P1] Burke contends that society is a partnership among the living, the dead, and those yet to be born. [P2] This is demonstrated by the inheritance of language, law, and custom that each generation receives and passes on. [P3] It follows, then, that any radical disruption of inherited institutions constitutes not reform but destruction.', q:'What is the primary argument of this passage?', c:['Language and law are transmitted across generations','Society involves partnership among past, present, and future generations','Radical disruption of institutions is destructive, because society is a multigenerational inheritance','Burke advocates for gradual legal reform'], a:2, e:'Label: P1=Claim, P2=Evidence, P3=Conclusion. Main argument = conclusion: radical disruption destroys the multigenerational partnership. A and B are evidence; D is not stated.' },
      { p:null, q:'In a CLT argumentative passage, the first paragraph typically serves what function?', c:['Provides historical evidence','States the author\'s main claim or central thesis','Summarizes counterarguments','Draws the final conclusion'], a:1, e:'Structure: P1=Claim (often), P2=Evidence, P3=Conclusion. The first paragraph introduces what the author is arguing, not how they\'re proving it.' },
      { p:'[P1] The capacity for self-governance is not a natural endowment uniformly distributed, but a cultivated virtue requiring education and habituation. [P2] History provides ample evidence: nations given democracy without civic preparation have repeatedly failed to sustain it. [P3] Democracy, therefore, must be earned through the prior development of character, not merely conferred by constitutional decree.', q:'Which choice best states the conclusion of the passage?', c:['Self-governance is a cultivated virtue','Some nations have failed at democracy','Democracy requires prior development of character; it cannot succeed without civic preparation','Constitutional decrees are insufficient on their own'], a:2, e:'P3 is the conclusion: democracy must be earned through character development, not just decreed. P1=Claim, P2=Evidence (history). C captures the full conclusion.' },
    ],
    C3:[
      { p:null, q:'The word "circumspect" appears in a CLT passage. Decode it using roots: circum (around) + spect (look). What does "circumspect" most likely mean?', c:['Quick to act','Looking all around — careful and cautious before acting','Circular in reasoning','Highly intelligent'], a:1, e:'Circum = around, spect = look/see. "Looking around before acting" = cautious, careful, prudent. If you know "inspect" (look in) and "prospect" (look forward), "circumspect" follows the same pattern.' },
      { p:null, q:'A CLT passage uses the word "impugn." You don\'t know it, but you see "im-" (not) + "pugn" (fight, from Latin pugnare). What does "impugn" most likely mean?', c:['To support strongly','To challenge or attack the truth of something','To ignore completely','To prove conclusively'], a:1, e:'"Im-" (against) + "pugn" (fight) → to fight against → to challenge, attack, or dispute. Example: "to impugn someone\'s character" = to attack their reputation.' },
      { p:null, q:'The word "magnanimous" appears in a passage. Roots: magna (great) + animus (spirit/soul). What does it mean?', c:['Very large in size','Very angry','Generous and forgiving, especially toward enemies','Extremely intelligent'], a:2, e:'Magna (great) + animus (spirit) → "great spirit" → generosity of spirit. A magnanimous person is noble and forgiving, not petty. Common in CLT passages about virtue.' },
    ],
    C4:[
      { p:'The author writes: "Confronted with suffering that defies easy explanation, Job did not resort to comfortable theodicy but wrestled directly with the divine — a posture the author commends to modern readers."', q:'The Job allusion signals that the author values', c:['Easy explanations for suffering','Avoidance of difficult theological questions','Direct, honest engagement with suffering rather than comfortable intellectual escape','Religious doubt as the highest virtue'], a:2, e:'Job = the archetypal figure who wrestles directly with God amid suffering rather than accepting easy answers. The author cites this approvingly → values honest engagement over comfortable evasion.' },
      { p:null, q:'A CLT passage invokes Prometheus as a parallel to a modern figure. Based on the classical allusion, what is the author most likely arguing?', c:['The modern figure brought important knowledge or capability to others, possibly at great personal cost','The modern figure built a large structure','The modern figure was punished for a minor offense','The modern figure is associated with fire safety'], a:0, e:'Prometheus = stole fire from the gods, gave it to humanity, suffered greatly for it. Any Prometheus allusion suggests: a figure who brings transformative gifts to others, often suffering for it. A captures this.' },
      { p:null, q:'An author writes that a politician\'s actions were "Sisyphean." Based on the classical allusion, what does the author mean?', c:['The actions were heroic and successful','The actions were endlessly repeated with no meaningful progress — like rolling a boulder up a hill only to have it roll back down','The actions were taken on behalf of the poor','The actions required great physical strength'], a:1, e:'Sisyphus was condemned to roll a boulder up a hill forever, only to have it roll back down. "Sisyphean" = futile, endlessly repeated effort that achieves nothing permanent.' },
    ],
    MN1:[
      { p:null, q:'You\'re in Module 2 Math and just got two questions wrong in a row. You can feel frustration building. What is the FIRST step of the Module Reset Protocol?', c:['Immediately guess on the next 3 questions to save time','Stop working on the current question — do not proceed while activated','Re-read your last two questions to find where you went wrong','Flag all remaining questions'], a:1, e:'First step: STOP. You cannot reset while still working. Put down your mental pencil, then execute: 3 breaths → "This is information. Next question."' },
      { p:null, q:'Why does the Module Reset Protocol include the phrase "This is information"?', c:['It\'s a distraction technique','It reframes a hard question from a threat ("I\'m failing") to data ("this question reveals something about my current weak areas") — reducing the emotional charge','It helps you remember the content of the question','It\'s a breathing cue'], a:1, e:'"This is information" interrupts the catastrophizing loop ("I\'m going to fail") by recategorizing the difficulty as neutral data. It\'s a cognitive reframe, not just a phrase.' },
      { p:null, q:'How long should the full Module Reset Protocol take?', c:['5-10 minutes','About 30 minutes — you need to fully calm down before continuing','About 15 seconds — stop, 3 breaths, "this is information," next question','It varies — take as long as you need'], a:2, e:'15 seconds. Stop → 3 breaths (~9 seconds) → "this is information" (~3 seconds) → next question. Quick, not meditative. You\'re trading 15 seconds for better performance on the remaining questions.' },
    ],
    MN2:[
      { p:null, q:'You have two remaining choices and have spent 75 seconds on careful elimination. You feel 60% confident in Choice B. What should you do?', c:['Keep analyzing until you reach 90% confidence','Change to Choice D — lower confidence means your gut is telling you something is wrong','Select Choice B and move on — 60% after careful analysis is better than random, and further analysis is unlikely to help','Flag it and return at the end to decide'],  a:2, e:'60% confidence after careful analysis = better than the 25-50% you started with. Additional analysis on a question you\'ve already studied carefully rarely increases accuracy and always costs time.' },
      { p:null, q:'When is it appropriate to CHANGE an answer you\'ve already submitted?', c:['Whenever you feel uncertain','Never — first instinct is always right','When you re-read the question and realize you misread something specific, or when you have a new insight you didn\'t consider before','Always change every answer in the last 2 minutes'], a:2, e:'Valid reason to change: new information (you misread, you noticed a word you missed). Not valid: general anxiety, "I just feel like the other one is right," time pressure.' },
      { p:null, q:'A student changes 8 answers in the last 5 minutes "because they seemed uncertain." She changed 5 from correct to incorrect and 3 from incorrect to correct. What does this illustrate?', c:['Changing answers is always beneficial','The research finding: changes made from vague uncertainty (not new information) tend to move from correct to incorrect more often than the reverse','She should have changed more answers','Students should never review their answers'], a:1, e:'This is the empirical pattern in test-taking research. Anxiety-driven changes, not information-driven changes, tend to lower scores. Commit to carefully analyzed answers.' },
    ],
    MN3:[
      { p:null, q:'Where in the module should the Careless Error Audit be applied?', c:['The hardest 5-7 questions — those are most likely to have errors','The easiest 5-7 questions — careless errors cluster there because the brain disengages on "obvious" problems','Every single question, starting from #1','Only on questions you flagged for review'], a:1, e:'Careless errors cluster on easy questions — the brain goes on autopilot and misreads "what is 3x+1 when x=5" as just "what is x." The audit catches these fast.' },
      { p:null, q:'During the Careless Error Audit, what is the one question to ask about each answer you review?', c:['"Is my calculation mathematically correct?"','"Did I answer what the question actually asked, not what I assumed it asked?"','"Is my answer the longest choice?"','"Did I use the right formula?"'], a:1, e:'"Did I answer what the question actually asked?" catches: solving for x when asked for 2x, finding area when asked for perimeter, answering the wrong part of a two-part question.' },
      { p:null, q:'You have 3 minutes left at the end of a module with no unanswered questions. The best use of that time is:', c:['Attempt to re-solve the 3 hardest questions from scratch','Audit the 5-6 easiest questions you answered — check that you answered exactly what was asked','Re-read all 27 questions sequentially','Close your test and rest'], a:1, e:'Auditing easy questions for careless errors has the highest ROI. Hard questions you spent 2+ minutes on are unlikely to improve with 30 more seconds. Easy questions with careless errors are solvable.' },
    ],
    MN4:[
      { p:null, q:'You have 2 minutes left with 4 questions remaining. Your FIRST action should be:', c:['Answer question #1 of the remaining 4 as carefully as possible','Guess on all 4 immediately (30 seconds), then answer the easiest one carefully with the remaining time','Leave all 4 blank — you don\'t have enough time','Flag all 4 and submit'], a:1, e:'Guess all first (no blanks), then rescue the easiest carefully. Leaving any blank when you can guess = throwing away a free chance at a correct answer.' },
      { p:null, q:'Why is guessing on all remaining questions BEFORE carefully answering any of them the correct protocol?', c:['It satisfies the "no blank" rule first, guaranteeing at least a chance at each; then you maximize accuracy on the easiest one with remaining time','It is faster than reading each question','The SAT gives bonus points for guessing quickly','There is no advantage — just answer in order'], a:0, e:'A blank answer and a guess have the same floor outcome (possibly wrong), but a guess has a chance of being right. Guaranteeing no blanks first, then maximizing accuracy on the easiest, is optimal.' },
      { p:null, q:'You guessed on all remaining questions and now have 75 seconds left. There are 3 unreviewed questions. How do you prioritize?', c:['Review #1 first (first question remaining)','Review the one that appeared easiest when you guessed on it','Review #3 last (last question)','Re-guess all 3 randomly again'], a:1, e:'Prioritize the easiest-looking remaining question — highest probability of converting a guess to a correct careful answer in the time available.' },
    ],
    MN5:[
      { p:null, q:'Research on performance under arousal conditions suggests that students who say "I am excited" before a high-stakes test perform how compared to students who say "I am calm"?', c:['Worse — excitement increases anxiety','Better — reframing arousal as excitement improves performance more than trying to suppress it','The same — the statement has no effect','Much worse — they are more distracted'], a:1, e:'This is from research by Alison Wood Brooks and others. Reframing arousal as excitement outperforms suppression because it redirects the same physiological state rather than fighting it.' },
      { p:null, q:'On the morning of the SAT, Krystal\'s palms are sweating and her heart is racing. The Test Anxiety Reframe says she should interpret this as:', c:['"I am sick and should postpone the test"','"My body is in a heightened state of preparation and readiness — this is how I perform at my best"','"I need to calm down immediately or I will fail"','"Something is wrong — calm people don\'t sweat"'], a:1, e:'Elevated heart rate, sweating, nervous energy = arousal. The reframe: "My body is getting ready to perform." This is physiologically accurate and performance-enhancing.' },
      { p:null, q:'Why does "calm down" often fail as a pre-test strategy?', c:['Because calmness is associated with poor test performance','Because the attempt to suppress physiological arousal often amplifies it (suppression paradox), whereas reframing redirects it productively','Because the SAT rewards anxious students','Because calming techniques take too long'], a:1, e:'The suppression paradox: actively trying to not feel something often increases awareness of it. Reframing (same energy, different label) sidesteps this by accepting and redirecting the arousal.' },
    ],
  }; // end DRILLS

  // ── MODULE STATE ──────────────────────────────────────────────────────────
  let view          = 'overview';
  let activeSection = null;
  let activeStrategy= null;
  let drillSession  = null;
  let containerEl   = null;

  // ── COURSE ORDER ──────────────────────────────────────────────────────────
  // The lesson sequence is FIXED by default (post-brief ruling 2026-07-07):
  // Universal → Reading Elim → Reading Passage → Grammar → Math Core →
  // Desmos → CLT → Mindset. The optional 'weakest_first' setting reorders
  // ONLY sections B–G by band weakness; A (Universal) is always first,
  // H (Mindset) always last. Order affects presentation and the "up next"
  // pointer only — it never locks or unlocks content.
  const SECTION_SEQUENCE = ['A','B','C','D','E','F','G','H'];
  const SECTION_SKILLS = {
    B: ['main_idea','inference'],
    C: ['main_idea','inference'],
    D: ['grammar','transitions','punctuation'],
    E: ['linear_algebra','advanced_math','data_analysis'],
    F: ['linear_algebra','advanced_math'],
    G: ['clt_tone','clt_argument','clt_roots','clt_allusion'],
  };

  // Pure function (bands object + mode string in, section id array out) so it
  // can be verified in isolation. Sections with no band data sort to the back
  // of the reorderable block, keeping their fixed relative order.
  function getSectionOrder(bands, mode) {
    if (mode !== 'weakest_first') return SECTION_SEQUENCE.slice();
    const middle = SECTION_SEQUENCE.slice(1, 7); // B–G
    const score = {};
    middle.forEach(id => {
      const vals = (SECTION_SKILLS[id] || [])
        .map(sk => bands && bands[sk])
        .filter(v => v != null);
      score[id] = vals.length ? vals.reduce((a, v) => a + v, 0) / vals.length : Infinity;
    });
    const reordered = middle.slice().sort((a, b) => {
      const d = score[a] - score[b];
      if (d < 0) return -1;
      if (d > 0) return 1;
      return middle.indexOf(a) - middle.indexOf(b);
    });
    return ['A'].concat(reordered, ['H']);
  }

  function getActiveSectionOrder() {
    const mode = (Storage.getSettings().courseOrder || 'fixed');
    return getSectionOrder(Storage.getBands(), mode);
  }

  // Universal is a hard prerequisite: every other section's lessons stay
  // closed until all 7 U-codes are at developing or beyond. Browsing is
  // allowed; enforcement happens at lesson-open.
  function isSectionUnlocked(sectionId, masteryArg) {
    if (sectionId === 'A') return true;
    const m = masteryArg || Storage.getStrategyMastery();
    return SECTIONS.A.codes.every(c =>
      m[c] === 'developing' || m[c] === 'mastered' || m[c] === 'elite');
  }

  // ── MASTERY ENGINE ────────────────────────────────────────────────────────

  function getMastery(code) {
    const m = Storage.getStrategyMastery();
    return m[code] || 'not_started';
  }

  function recordDrillResult(code, correct, total) {
    const accuracy = total > 0 ? correct / total : 0;
    let newState = getMastery(code);
    if (accuracy >= 0.8 && newState === 'not_started') newState = 'in_progress';
    else if (accuracy >= 0.8 && newState === 'in_progress') newState = 'developing';
    else if (accuracy >= 0.8 && newState === 'developing') newState = 'developing'; // cap at developing; mastered+ requires Module 6
    else if (accuracy < 0.5 && newState !== 'not_started') { /* stay at current state */ }
    else if (newState === 'not_started') newState = 'in_progress';
    Storage.updateStrategyMastery(code, newState);
    const history = Storage.getPath(`masteryHistory.${code}`, []);
    history.push({ date: new Date().toISOString(), accuracy, level: ['not_started','in_progress','developing','mastered','elite'].indexOf(newState), source: 'strategy_course' });
    Storage.setPath(`masteryHistory.${code}`, history);
    Storage.addSession({ strategy: code, questionsAttempted: total, questionsCorrect: correct, accuracy, durationMinutes: Math.round(drillSession.durationMs / 60000), bandLevel: 0 });
    Storage.addPoints(correct * 10);
    if (accuracy === 1 && total >= 3) Storage.awardBadge(`perfect_${code}`, 'Perfect Drill', `3/3 on ${code}`);
    return newState;
  }

  function getRecommendationScore(code) {
    const s = STRATEGIES[code];
    if (!s) return 0;
    const bands = Storage.getBands();
    return s.skills.reduce((sum, skill) => sum + (8 - (bands[skill] || 4)), 0);
  }

  function getSectionProgress(sectionId) {
    const sec = SECTIONS[sectionId];
    if (!sec) return { total: 0, done: 0, started: 0 };
    const m = Storage.getStrategyMastery();
    let done = 0, started = 0;
    sec.codes.forEach(c => {
      const state = m[c] || 'not_started';
      if (state === 'mastered' || state === 'elite' || state === 'developing') done++;
      else if (state === 'in_progress') started++;
    });
    return { total: sec.codes.length, done, started };
  }

  // ── UI HELPERS ────────────────────────────────────────────────────────────

  function showScreen(html, wireFn) {
    if (!containerEl) return;
    containerEl.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
    if (wireFn) setTimeout(wireFn, 0);
    // Internal screen swap (overview → section → lesson → drill → results)
    // doesn't go through Router.render(), so its scroll reset never fires.
    // Same root cause confirmed in orientation.js and import.js: #main-content
    // has no overflow rule (window is the real scrolling element), so without
    // this, navigating from a long screen (e.g. Overview) into a shorter one
    // (e.g. a Lesson) leaves the page scrolled past the top of new content.
    window.scrollTo(0, 0);
  }

  function masteryBadge(state) {
    const map = {
      not_started: ['Not Started',  'badge-neutral'],
      in_progress:  ['In Progress',  'badge-info'],
      developing:   ['Developing',   'badge-warning'],
      mastered:     ['Mastered',     'badge-success'],
      elite:        ['Elite',        'badge-elite'],
    };
    const [label, cls] = map[state] || map.not_started;
    return `<span class="badge ${cls}">${label}</span>`;
  }

  function masteryColor(state) {
    return { not_started:'var(--color-neutral-300)', in_progress:'var(--color-info)', developing:'var(--color-warning)', mastered:'var(--color-success)', elite:'#9B59B6' }[state] || 'var(--color-neutral-300)';
  }

  function progressRing(pct, size=36, stroke=3) {
    const r = (size/2) - stroke;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct/100) * circ;
    return `<svg width="${size}" height="${size}" style="transform:rotate(-90deg)">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--color-neutral-100)" stroke-width="${stroke}"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--color-primary)" stroke-width="${stroke}" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
    </svg>`;
  }

  // ── SCREEN: OVERVIEW ──────────────────────────────────────────────────────

  function buildOverview() {
    const mastery = Storage.getStrategyMastery();
    const totalStrategies = 54;
    const done   = Object.values(mastery).filter(s => s==='developing'||s==='mastered'||s==='elite').length;
    const started= Object.values(mastery).filter(s => s==='in_progress').length;
    const pct    = Math.round((done/totalStrategies)*100);

    const order = getActiveSectionOrder();
    const weakestFirst = (Storage.getSettings().courseOrder || 'fixed') === 'weakest_first';

    // "Up next" — the next incomplete lessons walking the active course order
    // (sections in order, codes in canonical order within each section).
    // Replaces the old band-sorted recommendations; band prioritization now
    // lives in the optional 'weakest_first' course-order setting.
    const upNext = [];
    order.forEach(secId => {
      SECTIONS[secId].codes.forEach(code => {
        const st = mastery[code] || 'not_started';
        if (upNext.length < 3 && st !== 'developing' && st !== 'mastered' && st !== 'elite') {
          upNext.push(code);
        }
      });
    });

    const recCards = upNext.map((code, i) => {
      const s = STRATEGIES[code];
      const sec = SECTIONS[s.section];
      const state = mastery[code] || 'not_started';
      return `<div class="strategy-rec-card" data-action="open-strategy" data-code="${code}">
        <div class="rec-card-top" style="border-left:3px solid ${sec.color}">
          <span class="rec-badge" style="background:${sec.color}20;color:${sec.color}">${i === 0 ? 'Continue course' : sec.shortName}</span>
          ${masteryBadge(state)}
        </div>
        <div class="rec-card-name">${s.name}</div>
        <div class="rec-card-code">${code}</div>
      </div>`;
    }).join('');

    const sectionCards = order.map(secId => {
      const sec = SECTIONS[secId];
      const prog = getSectionProgress(sec.id);
      const pctSec = prog.total > 0 ? Math.round((prog.done/prog.total)*100) : 0;
      const locked = !isSectionUnlocked(sec.id, mastery);
      return `<div class="section-card" data-action="open-section" data-section="${sec.id}">
        <div class="section-card-header">
          <div class="section-icon" style="background:${sec.color}20;color:${sec.color}">
            <i data-lucide="${sec.icon}"></i>
          </div>
          <div class="section-meta">
            <div class="section-name">${sec.name}</div>
            <div class="section-count">${sec.codes.length} strategies · ${prog.done} developing+</div>
          </div>
          <div class="section-ring">${progressRing(pctSec)}</div>
        </div>
        <div class="section-desc">${sec.desc}</div>
        ${locked ? '<div class="section-locked-hint" style="font-size:0.78rem;color:var(--color-neutral-500,#888);margin-top:6px;">🔒 Lessons unlock after Universal Strategies</div>' : ''}
        <div class="section-bar">
          <div class="section-bar-fill" style="width:${pctSec}%;background:${sec.color}"></div>
        </div>
      </div>`;
    }).join('');

    return `<div style="padding:var(--content-padding)">
      <div class="page-header mb-6">
        <div>
          <h1 class="page-title">Strategy Course</h1>
          <p class="page-subtitle">54 techniques. Learn them, drill them, master them.</p>
        </div>
        <div class="overview-stats">
          <div class="stat-chip"><span class="stat-num">${done}</span><span class="stat-label">Developing+</span></div>
          <div class="stat-chip"><span class="stat-num">${started}</span><span class="stat-label">In Progress</span></div>
          <div class="stat-chip"><span class="stat-num">${totalStrategies - done - started}</span><span class="stat-label">Not Started</span></div>
        </div>
      </div>

      <div class="progress-banner mb-6">
        <div class="progress-banner-bar">
          <div class="progress-banner-fill" style="width:${pct}%"></div>
        </div>
        <span class="progress-banner-label">${pct}% of strategies at developing or above</span>
      </div>

      ${upNext.length > 0 ? `
      <div class="section-subhead mb-3">Up next in your course${weakestFirst ? ' — weakest sections first' : ''}</div>
      <div class="rec-grid mb-6">${recCards}</div>` : ''}

      <div class="section-subhead mb-3">All Sections</div>
      <div class="sections-grid">${sectionCards}</div>
    </div>`;
  }

  function wireOverview() {
    containerEl.querySelectorAll('[data-action="open-section"]').forEach(el => {
      el.addEventListener('click', () => openSection(el.dataset.section));
    });
    containerEl.querySelectorAll('[data-action="open-strategy"]').forEach(el => {
      el.addEventListener('click', () => openLesson(el.dataset.code));
    });
  }

  // ── SCREEN: SECTION VIEW ──────────────────────────────────────────────────

  function buildSectionView(sectionId) {
    const sec = SECTIONS[sectionId];
    if (!sec) return '<p>Section not found.</p>';
    const mastery = Storage.getStrategyMastery();

    // Canonical code order — the lesson sequence is fixed (2026-07-07 ruling);
    // band-based prioritization lives in the courseOrder setting, not here.
    const sorted = [...sec.codes];

    const rows = sorted.map(code => {
      const s = STRATEGIES[code];
      const state = mastery[code] || 'not_started';
      const recScore = getRecommendationScore(code);
      const history = Storage.getPath(`masteryHistory.${code}`, []);
      const lastDrill = history.length ? new Date(history[history.length-1].date).toLocaleDateString() : null;
      return `<div class="strategy-row" data-action="open-strategy" data-code="${code}">
        <div class="strategy-row-left">
          <div class="strategy-code-badge" style="background:${sec.color}20;color:${sec.color}">${code}</div>
          <div class="strategy-row-info">
            <div class="strategy-row-name">${s.name}</div>
            <div class="strategy-row-sub">${s.trigger}</div>
          </div>
        </div>
        <div class="strategy-row-right">
          ${recScore >= 6 ? '<span class="priority-chip">Priority</span>' : ''}
          ${masteryBadge(state)}
          ${lastDrill ? `<span class="last-drill">Last: ${lastDrill}</span>` : ''}
          <i data-lucide="chevron-right" style="color:var(--color-neutral-300)"></i>
        </div>
      </div>`;
    }).join('');

    const prog = getSectionProgress(sectionId);
    return `<div style="padding:var(--content-padding)">
      <div class="page-nav mb-4">
        <button class="btn btn-ghost btn-sm" data-action="back-overview">
          <i data-lucide="arrow-left"></i> All Sections
        </button>
      </div>
      <div class="section-view-header mb-6" style="border-left:4px solid ${sec.color};padding-left:1rem">
        <div class="section-view-icon" style="color:${sec.color}"><i data-lucide="${sec.icon}"></i></div>
        <div>
          <h2 class="page-title">${sec.name}</h2>
          <p class="page-subtitle">${sec.desc}</p>
          <div class="section-progress-line">${prog.done} of ${prog.total} at developing or above</div>
        </div>
      </div>
      <div class="strategy-list">${rows}</div>
    </div>`;
  }

  function wireSectionView() {
    const backBtn = containerEl.querySelector('[data-action="back-overview"]');
    if (backBtn) backBtn.addEventListener('click', () => { view='overview'; showScreen(buildOverview(), wireOverview); });
    containerEl.querySelectorAll('[data-action="open-strategy"]').forEach(el => {
      el.addEventListener('click', () => openLesson(el.dataset.code));
    });
  }

  // ── SCREEN: LESSON ────────────────────────────────────────────────────────

  function buildLesson(code) {
    const s = STRATEGIES[code];
    if (!s) return '<p>Strategy not found.</p>';
    const sec = SECTIONS[s.section];
    const state = getMastery(code);
    const ex = s.example;

    const stepsHtml = (ex.steps||[]).map((step,i) =>
      `<div class="example-step"><span class="step-num">${i+1}</span><span>${step}</span></div>`
    ).join('');

    const choicesHtml = ex.c.map((ch,i) =>
      `<div class="example-choice ${i===ex.a ? 'correct-choice':''}">${i===ex.a?'✓':String.fromCharCode(65+i)}. ${ch}</div>`
    ).join('');

    const hasDrills = DRILLS[code] && DRILLS[code].length > 0;

    return `<div style="padding:var(--content-padding)">
      <div class="page-nav mb-4">
        <button class="btn btn-ghost btn-sm" data-action="back-section">
          <i data-lucide="arrow-left"></i> ${sec.name}
        </button>
      </div>

      <div class="lesson-header mb-6">
        <div class="lesson-badges">
          <span class="lesson-section-badge" style="background:${sec.color}20;color:${sec.color}">${sec.shortName} · ${code}</span>
          ${masteryBadge(state)}
        </div>
        <h2 class="lesson-title">${s.name}</h2>
        <p class="lesson-explain">${s.explain}</p>
      </div>

      <div class="lesson-cards mb-6">
        <div class="lesson-card">
          <div class="lesson-card-label"><i data-lucide="zap"></i> Why it works</div>
          <div class="lesson-card-body">${s.why}</div>
        </div>
        <div class="lesson-card">
          <div class="lesson-card-label"><i data-lucide="target"></i> When to use it</div>
          <div class="lesson-card-body">${s.trigger}</div>
        </div>
        <div class="lesson-card lesson-card-warning">
          <div class="lesson-card-label"><i data-lucide="alert-triangle"></i> Common mistake</div>
          <div class="lesson-card-body">${s.mistake}</div>
        </div>
      </div>

      <div class="worked-example mb-6">
        <div class="example-header">
          <span class="example-label">Worked Example</span>
          <span class="example-context">${ex.context}</span>
        </div>
        ${ex.passage ? `<div class="example-passage">${ex.passage}</div>` : ''}
        <div class="example-question">${ex.q}</div>
        <div class="example-choices">${choicesHtml}</div>
        <div class="example-walkthrough">
          <div class="walkthrough-label">Step-by-step walkthrough</div>
          ${stepsHtml}
        </div>
      </div>

      <div class="lesson-actions">
        ${hasDrills ? `<button class="btn btn-primary btn-lg" data-action="start-drill" data-code="${code}">
          <i data-lucide="zap"></i> Practice This Strategy (3 Questions)
        </button>` : ''}
        <button class="btn btn-secondary" data-action="back-section">Back to Section</button>
      </div>
    </div>`;
  }

  function wireLesson() {
    const backBtn = containerEl.querySelector('[data-action="back-section"]');
    if (backBtn) backBtn.addEventListener('click', () => openSection(activeSection));
    const drillBtn = containerEl.querySelector('[data-action="start-drill"]');
    if (drillBtn) drillBtn.addEventListener('click', () => startDrill(drillBtn.dataset.code));
    containerEl.querySelectorAll('[data-action="back-section"]').forEach(el =>
      el.addEventListener('click', () => openSection(activeSection))
    );
  }

  // ── SCREEN: DRILL ─────────────────────────────────────────────────────────

  // Serve-time choice shuffle. The stored mini-drill bank is position-biased
  // (audited 2026-07-07: 64% of answers stored at B, 69% longest-correct), so
  // choices must never be served in stored order. Returns a copy with c/a
  // remapped; the DRILLS source bank is never mutated. Local implementation
  // so this module stays independently loadable (mirrors drill-engine.js).
  function shuffleChoices(q) {
    const order = q.c.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = order[i]; order[i] = order[j]; order[j] = t;
    }
    const copy = {};
    for (const k in q) { if (Object.prototype.hasOwnProperty.call(q, k)) copy[k] = q[k]; }
    copy.c = order.map(idx => q.c[idx]);
    copy.a = order.indexOf(q.a);
    return copy;
  }

  function startDrill(code) {
    const questions = (DRILLS[code] || []).map(shuffleChoices);
    drillSession = { code, questions, qIndex: 0, correct: 0, answers: [], startMs: Date.now(), durationMs: 0 };
    showScreen(buildDrillQuestion(code, 0), wireDrill);
  }

  function buildDrillQuestion(code, qIndex) {
    const s  = STRATEGIES[code];
    const sec= SECTIONS[s.section];
    const qs = drillSession ? drillSession.questions : (DRILLS[code] || []);
    if (!qs || qIndex >= qs.length) return buildDrillResults(code);
    const q = qs[qIndex];
    const total = qs.length;

    const choicesHtml = q.c.map((ch,i) =>
      `<button class="drill-choice" data-choice="${i}">${String.fromCharCode(65+i)}. ${ch}</button>`
    ).join('');

    return `<div style="padding:var(--content-padding)">
      <div class="drill-header mb-4">
        <button class="btn btn-ghost btn-sm" data-action="exit-drill">
          <i data-lucide="x"></i> Exit Drill
        </button>
        <div class="drill-progress-indicator">
          <span style="color:${sec.color};font-weight:600">${code}</span> · Question ${qIndex+1} of ${total}
        </div>
        <div class="drill-dots">
          ${qs.map((_,i) => `<div class="drill-dot ${i<qIndex?'done':i===qIndex?'active':''}"></div>`).join('')}
        </div>
      </div>
      ${q.p ? `<div class="drill-passage mb-4">${q.p}</div>` : ''}
      <div class="drill-question mb-4">${q.q}</div>
      <div class="drill-choices">${choicesHtml}</div>
      <div class="drill-feedback" id="drill-feedback" style="display:none"></div>
      <button class="btn btn-primary mt-4" id="drill-next-btn" style="display:none" data-action="next-question">
        ${qIndex + 1 < total ? 'Next Question' : 'See Results'} <i data-lucide="arrow-right"></i>
      </button>
    </div>`;
  }

  function wireDrill() {
    const exitBtn = containerEl.querySelector('[data-action="exit-drill"]');
    if (exitBtn) exitBtn.addEventListener('click', () => openLesson(drillSession.code));

    containerEl.querySelectorAll('.drill-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = parseInt(btn.dataset.choice);
        const q = drillSession.questions[drillSession.qIndex];
        const correct = chosen === q.a;
        if (correct) drillSession.correct++;
        drillSession.answers.push({ chosen, correct });

        // Disable all choices
        containerEl.querySelectorAll('.drill-choice').forEach(b => {
          b.disabled = true;
          const idx = parseInt(b.dataset.choice);
          if (idx === q.a) b.classList.add('drill-choice-correct');
          else if (idx === chosen && !correct) b.classList.add('drill-choice-wrong');
        });

        // Show feedback
        const fb = containerEl.querySelector('#drill-feedback');
        if (fb) {
          fb.style.display = 'block';
          fb.className = `drill-feedback ${correct ? 'feedback-correct' : 'feedback-wrong'}`;
          fb.innerHTML = `<strong>${correct ? '✓ Correct' : '✗ Incorrect'}</strong> ${q.e}`;
        }

        const nextBtn = containerEl.querySelector('#drill-next-btn');
        if (nextBtn) nextBtn.style.display = 'inline-flex';
      });
    });

    const nextBtn = containerEl.querySelector('[data-action="next-question"]');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        drillSession.qIndex++;
        const qs = drillSession.questions;
        if (drillSession.qIndex >= qs.length) {
          drillSession.durationMs = Date.now() - drillSession.startMs;
          const newState = recordDrillResult(drillSession.code, drillSession.correct, qs.length);
          showScreen(buildDrillResults(drillSession.code, newState), wireDrillResults);
        } else {
          showScreen(buildDrillQuestion(drillSession.code, drillSession.qIndex), wireDrill);
        }
      });
    }
  }

  function buildDrillResults(code, newState) {
    const s = STRATEGIES[code];
    const sec = SECTIONS[s.section];
    // Use the session's shuffled copies so the "Correct: X" letters match
    // what was actually displayed during the drill.
    const qs = drillSession ? drillSession.questions : (DRILLS[code] || []);
    const correct = drillSession ? drillSession.correct : 0;
    const total = qs.length;
    const pct = total > 0 ? Math.round((correct/total)*100) : 0;
    const state = newState || getMastery(code);

    const answersHtml = (drillSession ? drillSession.answers : []).map((ans, i) => {
      const q = qs[i];
      return `<div class="result-row ${ans.correct?'result-correct':'result-wrong'}">
        <span class="result-icon">${ans.correct?'✓':'✗'}</span>
        <span class="result-q">Q${i+1}: ${q.q.slice(0,60)}${q.q.length>60?'…':''}</span>
        ${!ans.correct ? `<span class="result-correct-ans">Correct: ${String.fromCharCode(65+q.a)}</span>` : ''}
      </div>`;
    }).join('');

    return `<div style="padding:var(--content-padding)">
      <div class="results-hero mb-6">
        <div class="results-score-ring">
          <div class="results-score">${correct}/${total}</div>
          <div class="results-pct">${pct}%</div>
        </div>
        <div class="results-meta">
          <h2 class="results-title">${pct >= 80 ? 'Nice work!' : pct >= 60 ? 'Getting there' : 'Keep practicing'}</h2>
          <p class="results-subtitle">${s.name}</p>
          <div class="results-mastery">New status: ${masteryBadge(state)}</div>
          ${state === 'developing' ? '<p class="results-note">To reach Mastered or Elite, complete Level 3+ drills in the Drill Engine with a 7+ day gap between sessions.</p>' : ''}
        </div>
      </div>
      <div class="results-answers mb-6">${answersHtml}</div>
      <div class="results-actions">
        <button class="btn btn-primary" data-action="drill-again">Drill Again</button>
        <button class="btn btn-secondary" data-action="back-to-lesson">Back to Lesson</button>
        <button class="btn btn-ghost" data-action="back-section">Back to ${sec.shortName}</button>
      </div>
    </div>`;
  }

  function wireDrillResults() {
    const code = drillSession ? drillSession.code : activeStrategy;
    containerEl.querySelector('[data-action="drill-again"]')?.addEventListener('click', () => startDrill(code));
    containerEl.querySelector('[data-action="back-to-lesson"]')?.addEventListener('click', () => openLesson(code));
    containerEl.querySelector('[data-action="back-section"]')?.addEventListener('click', () => openSection(activeSection));
  }

  // ── NAVIGATION ────────────────────────────────────────────────────────────

  function openSection(sectionId) {
    activeSection = sectionId;
    view = 'section';
    showScreen(buildSectionView(sectionId), wireSectionView);
  }

  function openLesson(code) {
    const s = STRATEGIES[code];
    if (!s) return;
    if (!isSectionUnlocked(s.section)) {
      UI.toast('Complete the Universal Strategies section first — those techniques are used inside every lesson that follows.', 'info', 'Universal First', 4000);
      return;
    }
    activeStrategy = code;
    activeSection = activeSection || s.section;
    view = 'lesson';
    showScreen(buildLesson(code), wireLesson);
    // mark as at least in_progress
    if (getMastery(code) === 'not_started') Storage.updateStrategyMastery(code, 'in_progress');
  }

  // ── PUBLIC API ────────────────────────────────────────────────────────────

  function render() {
    const el = document.getElementById('page-container');
    if (!el) return;
    containerEl = el;
    view = 'overview';
    showScreen(buildOverview(), wireOverview);
  }

  function reset() {
    view = 'overview';
    activeSection = null;
    activeStrategy = null;
    drillSession = null;
  }

  // getSectionOrder / isSectionUnlocked / shuffleChoices exposed for
  // mechanical verification (pure functions; no UI dependencies).
  return { render, reset, getSectionOrder, isSectionUnlocked, shuffleChoices };

})();
window.StrategyCourseModule = StrategyCourseModule;
