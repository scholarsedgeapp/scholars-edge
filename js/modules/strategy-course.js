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
      explain:'Every SAT question is written by someone whose job is to make three wrong answers look attractive. Those wrong answers aren\'t random — they follow four repeatable patterns: Extreme (overstates with words like "always" or "entirely"), Recycled (reuses passage words but twists the meaning), Half-Right (one part true, one part false), and Could-Be-True (plausible in the real world, but the passage never says it). Learn the four patterns and you stop asking "which answer sounds best?" and start asking "which trap is each answer?" — a question you can answer every time.',
      why:'The test is standardized, which means the traps are standardized too. The same four wrong-answer patterns appear on every Reading and Writing module, test after test. Pattern recognition turns an open-ended judgment call into a checklist, and a checklist works even on passages about topics you\'ve never seen.',
      trigger:'Use this on any question where two or more choices feel plausible. Before comparing them to each other, name the trap each suspicious choice might be. A choice you can name is a choice you can eliminate.',
      mistake:'Choosing the answer that "sounds smartest." Test makers write traps to sound polished and confident. Precision beats polish: the correct answer is the one the passage actually supports, and it often sounds more boring than the traps.',
      example:{ context:'Reading · Inference',
        passage:'Coral reefs cover less than 1% of the ocean floor but support approximately 25% of all marine species. Bleaching events have increased dramatically in frequency since the 1980s. Some reefs have experienced complete bleaching three times in the past decade.',
        q:'Which best describes the central tension in the passage?',
        c:['Coral reefs are entirely gone from modern oceans','Coral reefs are disproportionately important yet increasingly threatened','Marine biodiversity depends exclusively on coral reefs','Scientists have failed to study bleaching adequately'],
        a:1, steps:['Name the job first: a "central tension" question needs an answer that holds two opposing facts together.','Choice A says reefs are "entirely gone." The passage says bleaching increased — reefs still exist. "Entirely" overstates. That\'s the Extreme trap.','Choice C says biodiversity depends "exclusively" on reefs. The passage says 25% of species, not 100%. Extreme again.','Choice D blames scientists for inadequate study. The passage never evaluates the research at all. Plausible in real life, absent from the text: Could-Be-True.','Choice B holds both facts in tension — reefs matter disproportionately (25% of species on under 1% of the floor) AND face a growing threat. Both halves supported, nothing overstated.','Notice what happened: you never had to "feel" which answer was best. You named the trap in each wrong choice, and B was what remained.'] }
    },
    U2:{ code:'U2', name:'Module 1 Mastery Protocol', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'The digital SAT adapts between modules: everyone gets the same Module 1, and your accuracy there decides whether your Module 2 is the harder or easier version. Here\'s the part most students never hear: the easier Module 2 caps your score. Even a perfect performance on the easy version can\'t reach the top scores. So Module 1 isn\'t the warm-up — it\'s the gatekeeper that sets your ceiling.',
      why:'A careless Module 1 mistake costs you twice: the point itself, and a push toward the lower-ceiling Module 2. That double cost is why accuracy in Module 1 outranks speed everywhere else on the test. There is no prize for finishing early; there is a real penalty for finishing sloppy.',
      trigger:'Activate this at the start of every Module 1, real or practice: use the full time, re-check the easiest questions before submitting, and never bank minutes you don\'t convert back into checking.',
      mistake:'Racing through Module 1 to "save energy" or finish early. Finishing with six unused minutes isn\'t efficiency — it\'s donated accuracy. Leftover time goes to re-checking easy questions, where careless errors hide.',
      example:{ context:'Test Strategy', passage:null,
        q:'Krystal finishes 12 of 27 Module 1 questions in 20 min and speeds through the rest. What is the error?',
        c:['She should have skipped more questions','Speed-rushing sacrifices accuracy on questions that determine her Module 2 path','She should have started with hardest questions','There is no error — finishing early shows mastery'],
        a:1, steps:['Diagnose the position: 12 questions in 20 minutes is 100 seconds each, well over the module\'s natural pace. She is genuinely behind — the pressure is real.','Choice D says finishing early shows mastery. Module 1 pays nothing for leftover time, and rushing creates exactly the errors the router punishes. Eliminate.','Choice A suggests more skipping. Skip and Return (U4) rescues individual stuck questions; it doesn\'t repair a broken pace across a whole module. Eliminate.','Choice C, hardest first, would spend her worst time-pressure on her lowest-probability questions — backwards (see U3). Eliminate.','Choice B names it: speed-rushing sacrifices accuracy on the questions that decide her Module 2 routing. The fix is a controlled pace with clock checks every 5–7 questions (U7), not a sprint.'] }
    },
    U3:{ code:'U3', name:'Difficulty-Weighted Decision Making', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Hard questions are worth more to your score — that\'s how difficulty-weighted scoring works. But that fact becomes a trap if you read it as "spend forever on hard questions." The real skill is deciding where your next minute buys the most points: a hard question you might crack, or two easier ones you\'ll almost certainly get. Treat your remaining time as a budget and every question as a purchase.',
      why:'Because scoring weights difficulty AND your time is fixed, points-per-minute is the number that actually matters. A hard question at four minutes with a small chance of success is a worse purchase than three medium questions at 75 seconds each with a high chance. Expected value sets the order — not difficulty pride.',
      trigger:'Use this whenever time is tight relative to what\'s left — roughly the final 8 minutes of any module. Ask one question: where does my next minute buy the most expected points?',
      mistake:'Chasing the hardest question because it\'s "worth more." A hard question you don\'t solve is worth exactly zero. Weighted scoring rewards hard questions you get RIGHT; your job is maximum total points, not proof of courage.',
      example:{ context:'Test Strategy', passage:null,
        q:'With 8 min left, Krystal has 5 questions remaining: #17, #19, #22, #24, #27. Correct order?',
        c:['In order: 17, 19, 22, 24, 27','Hardest first: 27, 24, 22, 19, 17','Skip all and guess','Do #17 and #19 fully, then guess on #22-27 if time runs out'],
        a:3, steps:['Budget check: 8 minutes for 5 questions is 96 seconds each — workable, but only if no question becomes a sinkhole.','Position signals probability: #17 and #19 are likely medium; #22–27 trend hard. Her expected points live in the early pair.','Choice B (hardest first) spends her scarcest resource on her lowest-probability questions. The weighting only pays if she actually solves them. Eliminate.','Choice A treats all five as equal purchases — if #22 stalls her, #24–27 die with it. Choice C abandons five live questions. Eliminate both.','Choice D is the weighted plan: secure #17 and #19 fully, then guess the rest if time collapses. No blanks, and every likely point gets captured first.'] }
    },
    U4:{ code:'U4', name:'Skip and Return', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'One stuck question can quietly wreck a module — not just by eating time, but by rattling you for the three questions after it. Skip and Return is the circuit breaker: after about 60 seconds with no clear path, make your best guess, flag the question in Bluebook, and move on. A guess plus a flag loses nothing — there\'s no wrong-answer penalty, and a surprising share of "impossible" questions crack on the second look.',
      why:'Two mechanics make this work. First, no penalty for wrong answers means a guess strictly beats a blank — the guess sets a floor. Second, stepping away breaks fixation: once you\'ve committed to a wrong approach, rereading only deepens the rut, while distance resets it. The flag makes the return trip cost seconds instead of a search.',
      trigger:'The moment you notice you\'ve read a question twice and still have no plan — that\'s the 60-second signal. Guess, flag, go.',
      mistake:'Skipping without guessing. If time dies before you return, a flagged blank scores zero while a flagged guess had a one-in-four floor. The guess is not optional; it\'s the insurance that makes skipping safe.',
      example:{ context:'Test Strategy', passage:null,
        q:'Krystal has been on Q17 for 2 min with 15 min left. She\'s down to 2 choices. What should she do?',
        c:['Keep working until certain','Pick one of the two, flag it, move forward immediately','Skip with no guess and move on','Go back to Q1 and restart'],
        a:1, steps:['Name the state: two minutes spent, two choices left, no new information arriving. That\'s a stall, and stalls only deepen.','Reframe the 50/50 as an asset: elimination already doubled her odds from 25% to 50%. The remaining coin-flip is not worth two more minutes.','Choice A buys certainty at the price of the next two questions. Certainty is the most expensive thing on a timed test. Eliminate.','Choice C risks a zero on a coin-flip she already paid for — never leave the floor value on the table. Choice D is panic, not process. Eliminate both.','Choice B executes the protocol: commit to one, flag it in Bluebook, move immediately. If time remains at the end, the flag brings her back with fresh eyes.'] }
    },
    U5:{ code:'U5', name:'Predict Before You Read Choices', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'The four answer choices are not information — three of them are engineered persuasion. Reading them "cold" lets the traps frame your thinking. The fix: after reading the question and the relevant text, answer it in your own words FIRST, then open the choices looking for the one that matches your prediction. You\'ve turned a persuasion contest into a matching task.',
      why:'Whoever sets the anchor controls the comparison. Predict first, and YOUR answer — built from the passage — is the standard every choice gets measured against. Read choices first, and the most confident-sounding trap becomes the standard instead. Traps work by sounding plausible in the moment; a prediction formed before the persuasion starts is what plausible-but-wrong bounces off of.',
      trigger:'Every Reading question, and any Writing question where you can "hear" the correct version before looking. If you catch yourself reading choices with no prediction formed, stop and back up one step.',
      mistake:'Forcing an exact word-for-word match. Your prediction is a compass, not a script: the right answer will match its MEANING, often in different words. Discard choices that contradict the prediction — not ones that merely rephrase it.',
      example:{ context:'Reading · Evidence',
        passage:'Urban heat islands form when pavement and buildings replace natural land cover, absorbing and retaining heat. Green infrastructure — trees, parks, green roofs — can significantly reduce this effect.',
        q:'Which best describes what green infrastructure does according to the passage?',
        c:['Completely eliminates urban heat islands','Replaces all pavement in cities','Reduces the heat retention effect significantly','Increases urban temperatures'],
        a:2, steps:['Cover the choices. The passage says green infrastructure "can significantly reduce this effect." Your prediction: it reduces the heat that cities trap.','Now open the choices with that prediction as the standard. Choice A says "completely eliminates" — you predicted reduce, not erase. Extreme. Eliminate.','Choice B says it "replaces all pavement." The passage never says how much pavement changes, and "all" overreaches anyway. Eliminate.','Choice D reverses the direction — increases temperatures. Directly contradicts the prediction. Eliminate.','Choice C is your prediction in the passage\'s own register: "reduces the heat retention effect significantly." Matching took seconds because your standard existed before the persuasion began.'] }
    },
    U6:{ code:'U6', name:'Error Pattern Logging', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Two students miss the same question. One never learned the rule; the other knew it cold and misread the sentence. Same wrong answer, completely different problems, completely different fixes. Error Pattern Logging sorts every miss into one of four bins: Content Gap (didn\'t know it), Trap Triggered (knew it, fell for the pattern), Careless Error (knew it, botched the execution), and Timing Pressure (would have had it with more time). The bin tells you the fix.',
      why:'Untagged review produces the world\'s least useful conclusion: "I need to study more." Tagged review produces a prescription — content gaps get lessons, trap patterns get targeted drills, careless errors get checking habits, timing gets pacing work. Same review effort, four times the aim.',
      trigger:'After every drill, practice set, and full test — while the memory of WHY you chose that answer is still fresh. Five minutes, and every miss gets a bin.',
      mistake:'Tagging everything "Careless" because it feels better than admitting a gap. It only counts as careless if you can re-solve it correctly right now without looking anything up. If you can\'t, it was a content gap wearing a nicer name.',
      example:{ context:'Math · Error Type', passage:null,
        q:'Krystal solves 2x + 4 = 14 correctly (x=5) but the question asks for 3x − 2. She almost submits x=5. What error type is this?',
        c:['Content gap','Careless error — solved correctly but didn\'t finish reading the question','Trap triggered — x=5 is a planted wrong answer','Time pressure'],
        a:1, steps:['Replay the miss honestly: she solved 2x + 4 = 14 correctly, so the math skill is intact. This was not a knowledge failure — no content gap.','The question asked for 3x − 2, which is 3(5) − 2 = 13. She nearly submitted 5: right sub-problem, wrong finish line.','Bin check: not timing (no clock pressure in the scenario), and the planted 5 makes "trap" tempting — but the failure happened in her reading, not in her evaluation of choices.','Execution failure on a known skill is the Careless bin: Choice B. (Yes, the test plants x = 5 as a choice — but the habit to fix is the reading, not the trap knowledge.)','Log the fix specifically: "Underline what the question actually asks for before solving." That one habit retires this entire error family.'] }
    },
    U7:{ code:'U7', name:'60-Second Rule', section:'A',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference','grammar','transitions','punctuation','linear_algebra','advanced_math','data_analysis'],
      explain:'Do the arithmetic once and pacing stops being a feeling. A Reading/Writing module gives you about 71 seconds per question (27 questions, 32 minutes); a Math module gives about 95 (22 questions, 35 minutes). The 60-Second Rule turns that into a working budget: finish routine questions near the 60-second mark, which quietly banks seconds for the hard ones later. One target to aim at, one hard cap: at two minutes on any single question, you guess, flag, and move (that\'s U4).',
      why:'Score damage rarely comes from the hardest question. It comes from three mid-module questions quietly eating four minutes each, leaving the final stretch to be guessed in a panic. A per-question budget catches the overrun WHILE it\'s happening — at 60 seconds you still have choices; at four minutes you have none. The buffer banked on routine questions is what buys real thinking time for the genuinely hard ones.',
      trigger:'Glance at the clock every 5–7 questions and compare questions-done to time-used. And feel for the 60-second mark inside each question: past it with no clear path is the U4 signal.',
      mistake:'Treating 60 seconds as a deadline to beat on every question. It\'s a target for routine questions, not a whip — rushing a question you were about to solve correctly at 75 seconds throws away a point to protect a schedule. The budget serves accuracy, never the reverse.',
      example:{ context:'Pacing · Reading/Writing', passage:null,
        q:'A Reading/Writing module has 27 questions in 32 minutes. After 18 questions, Krystal has used 25 minutes. What does the 60-Second Rule say about her position?',
        c:['On budget: 25 minutes for 18 questions is comfortably close to the target pace','Behind budget: about 47 seconds remain per question, so triage mode starts now','Ahead of budget: she has banked time for the hard finish','The rule says nothing until the final five questions'],
        a:1, steps:['Find the module\'s natural pace: 32 minutes ÷ 27 questions ≈ 71 seconds per question. The 60-second target would bank about 11 seconds on each routine question.','Check the actual pace: 25 minutes ÷ 18 questions ≈ 83 seconds per question — 12 over natural pace, 23 over target.','Compute what\'s left: 7 minutes for 9 questions ≈ 47 seconds each — under the routine-question target before difficulty is even considered.','Diagnosis: behind budget, Choice B. Choices A and C misread the arithmetic; Choice D describes a rule that doesn\'t exist.','Response: triage. Quickest remaining questions first, the 2-minute cap enforced ruthlessly, guess-and-flag anything with no path (U4). A clock checked at question 18 still left options — at question 25 it would not have.'] }
    },
    R1:{ code:'R1', name:'Extreme Language Elimination', section:'B',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Scan the choices for absolute words: always, never, all, none, only, entirely, completely, proves, must, impossible. On SAT Reading, choices built on those words are almost always wrong, because an absolute claim collapses the moment one counterexample exists — and real passages, like real research, almost never speak in absolutes. The mirror image matters too: hedged words like "may," "often," "suggests," "can," "tends to," and "likely" are the language correct answers wear, because qualified claims are easy to defend. One scan of choice language, before any deep analysis, routinely eliminates one or two choices.',
      why:'Test writers need wrong answers that FEEL strong but are provably wrong, and absolute language is the cleanest way to build one: it sounds confident while quietly claiming far more than the passage ever said. The passage says "many salamanders"; the trap says "all amphibians." Confidence is the bait; overreach is the flaw.',
      trigger:'Run the scan on every Reading choice set before deep analysis: circle absolute words in the choices, then check whether the passage actually goes that far. It almost never does.',
      mistake:'Turning the tool into a reflex that deletes without checking. Absolutes are a flag, not an automatic kill: if the passage itself states an absolute ("no known mammal"), a choice repeating that absolute is safe. Flag the word, verify against the text, then eliminate.',
      example:{ context:'Reading · Main Idea',
        passage:'Monarch butterflies migrate up to 3,000 miles between Canada and Mexico, navigating via a time-compensated sun compass and Earth\'s magnetic field. Habitat loss has contributed to population declines, though populations have shown partial recovery in some years.',
        q:'Which best characterizes monarch navigation?',
        c:['Monarchs rely entirely on Earth\'s magnetic field','Monarch navigation uses multiple systems including solar and magnetic cues','Monarchs have completely lost their migration ability','Only scientists can track monarch migration'],
        a:1, steps:['Scan the choices for absolute language before analyzing content: A has "entirely," C has "completely lost," D has "Only." Three flags on the first pass.','Verify flag A: the passage names TWO systems, a sun compass and the magnetic field. "Rely entirely" on one claims more than the text. Eliminate.','Verify flag C: "completely lost their migration ability" is directly contradicted by "partial recovery in some years." Eliminate.','Verify flag D: "Only scientists can track" is an absolute the passage never states or implies. Eliminate.','Choice B says navigation uses "multiple systems including solar and magnetic cues" — hedged, precise, and exactly what the passage describes.','Count the work: three eliminations from word-scanning plus one quick verification each. You barely had to interpret anything.'] }
    },
    R2:{ code:'R2', name:'Recycled Language Trap', section:'B',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'The most seductive wrong answers on SAT Reading are built from the passage\'s own vocabulary. The test writer lifts three or four exact words, then reassembles them into a claim the passage never made: same words, new (and wrong) meaning. Your brain registers the familiar vocabulary as "I saw this in the text" — recognition masquerading as verification. The defense: when a choice echoes the passage word for word, slow down and check what those words are DOING now. Match meanings, not vocabulary.',
      why:'Recognition is fast and feels like truth: familiar words light up before the sentence\'s actual claim gets processed. Test writers exploit that wiring deliberately — the more exact words a wrong choice recycles, the more "supported" it feels. Meanwhile the correct answer often paraphrases, using none of the passage\'s wording, so vocabulary-matching pulls you toward the trap and away from the answer.',
      trigger:'Any choice that reuses three or more exact words from the passage, especially technical terms or vivid phrases. High vocabulary overlap is a reason for MORE suspicion, not less.',
      mistake:'Grading choices by word overlap in either direction — trusting choices with familiar words or dumping choices with unfamiliar ones. Correct answers routinely paraphrase; wrong answers routinely quote. Meaning is the only currency that counts.',
      example:{ context:'Reading · Inference',
        passage:'John Locke argued that personal identity persists through psychological continuity — specifically, through memory. A person at 40 is the same as at 10 insofar as they remember their experiences.',
        q:'What is the basis of Locke\'s theory of personal identity?',
        c:['Identity depends on physical continuity of the brain','Identity is based on memory and psychological continuity','Locke\'s theory was rejected because of amnesia cases','Identity requires continuous age from birth'],
        a:1, steps:['The question asks for the BASIS of Locke\'s theory. The passage states it directly: identity persists "through psychological continuity — specifically, through memory."','Choice A recycles "continuity" but attaches it to the BRAIN. Locke\'s claim is psychological, not physical. Same word, relocated meaning: the Recycled trap.','Choice C borrows the scholarly framing but asserts a rejection the passage never issues. Eliminate.','Choice D invents "continuous age," borrowing the flavor of "continuity" with no textual claim behind it. Eliminate.','Choice B paraphrases the thesis: memory and psychological continuity. It wins on meaning-match, not word-match.','The tell in retrospect: A FELT supported because "continuity" appeared in the text. Familiarity was doing the persuading, not evidence.'] }
    },
    R3:{ code:'R3', name:'Half-Right Elimination', section:'B',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Some wrong answers are engineered as compounds: one clause the passage clearly supports, welded to a second clause it doesn\'t. Your eye lands on the true half, recognition fires, and the false half rides in on its coattails. The rule is total accuracy: every claim inside a choice must be supported, because on the SAT a half-right answer is a wrong answer. Split every compound choice at its joints ("and," "but," "while," "because") and audit each piece separately.',
      why:'Verification is effortful, and test writers know students stop verifying at the first true clause. The true half isn\'t wasted words — it\'s the delivery mechanism. By pairing a comfortable, obviously-supported claim with a subtle overreach, the writer converts your partial verification into full trust.',
      trigger:'Any choice containing two or more distinct claims — look for "and," "while," "because," "which led to," or a comma splice of facts. Each joint is a seam to split and check.',
      mistake:'Verifying only the clause that\'s easiest to check. The false half is usually the SECOND one, positioned after your attention has relaxed. Audit clauses in reverse order if you catch yourself skimming.',
      example:{ context:'Reading · Evidence',
        passage:'Urban planner Amara Reyes found that mixed-use zoning reduced commute times by 18%. However, property values increased sharply, displacing lower-income residents. Reyes acknowledged that efficiency gains came at a cost to equity.',
        q:'Which best describes the outcome of mixed-use zoning in Reyes\'s study?',
        c:['Improved efficiency and had no effect on equity','Both reduced commute times and increased property values, with equity costs','Efficiency gains always outweigh equity concerns','Displacement was unrelated to zoning changes'],
        a:1, steps:['Split every compound choice before judging it. The question asks for the OUTCOME of mixed-use zoning in the study.','Choice A: "improved efficiency" (true — commutes fell 18%) welded to "no effect on equity" (false — displacement rose). Half-right, so all wrong. Eliminate.','Choice C fails twice: "always" is an Extreme flag, and Reyes explicitly acknowledged the equity cost. Eliminate.','Choice D asserts displacement was "unrelated" to zoning; the passage draws that link explicitly. Eliminate.','Choice B carries three claims — commutes fell, property values rose, equity costs followed — and the passage supports each one. Full accuracy, not partial.','The habit that saved you: auditing the SECOND half of each compound first, where the falsehood usually hides.'] }
    },
    R4:{ code:'R4', name:'Could-Be-True Trap', section:'B',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'The most dangerous wrong answers aren\'t false — they\'re unverified. A Could-Be-True choice makes a claim that\'s perfectly plausible, often something you know is true from school or life. But SAT Reading is a closed world: the only evidence that exists is the passage in front of you. "Would a reasonable person believe this?" is the wrong question. "Can I point to the sentence that says this?" is the only question. If the pointing finger has nowhere to land, the choice dies, no matter how sensible it sounds.',
      why:'This trap outsources its persuasion to YOUR knowledge. The writer picks a claim your background will happily endorse, so the sense of support comes from inside your head rather than from the text. That\'s exactly why it works on strong students — the more you know about a topic, the more claims feel "supported." The passage-only rule keeps outside knowledge from scoring against you.',
      trigger:'The moment you hear yourself think "well, that\'s probably true" or "that makes sense" about a choice — stop. Probably-true is the trap\'s signature. Demand the line reference.',
      mistake:'Defending a choice with reasoning instead of text. If your justification starts "because usually…" or "it stands to reason…", you\'re supplying evidence the passage didn\'t. Correct inferences require only a small, forced step from stated text — never a plausible leap.',
      example:{ context:'Reading · Inference',
        passage:'Historian Dr. Vasquez found that medieval monasteries owned mechanical clocks before secular institutions because the monastic schedule — with fixed hours for prayer — created a practical demand for timekeeping precision that merchants lacked.',
        q:'Why did monasteries acquire clocks before secular institutions, according to Vasquez?',
        c:['Monks were more technologically sophisticated','Monasteries had greater wealth','The fixed prayer schedule created a practical need for precise timekeeping','Mechanical clocks were invented by monks'],
        a:2, steps:['The question asks for Vasquez\'s stated reason. Locate it first: the monastic schedule "created a practical demand for timekeeping precision." That\'s the anchor.','Choice A, "more technologically sophisticated," is historically plausible — and that plausibility is the bait. The passage argues demand, not skill. No sentence supports it. Eliminate.','Choice B, "greater wealth," is another claim your background knowledge will happily supply. Point to the line that says it. There isn\'t one. Eliminate.','Choice D goes beyond ownership into invention — nothing in the text. Eliminate.','Choice C restates the anchor sentence: fixed prayer hours created the practical need. The pointing finger lands.','Notice the pattern: every trap here was REASONABLE. The correct answer wasn\'t the most sensible-sounding claim; it was the only one with a home address in the text.'] }
    },
    R5:{ code:'R5', name:'Opposite Trap', section:'B',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Some wrong answers don\'t exaggerate or invent — they reverse. Swapped cause and effect, flipped increase and decrease, traded subjects ("critics dismissed X" becomes "X\'s creators dismissed critics"), or a quiet "not" where none belonged. Under time pressure, your eye confirms the topic words and skips the direction of the claim, which is exactly what the trap needs. The defense is directional reading: for any choice making a claim with a direction — causes, raises, precedes, prefers — go back and trace the arrow in the text.',
      why:'Reading under pressure is topic-first: you verify WHAT a choice discusses long before you verify WHICH WAY its claim points. Reversal traps keep every topic word intact, so the choice "reads familiar" while asserting the mirror image. They\'re cheap to write and brutally effective late in a module, when attention frays.',
      trigger:'Any choice with directional language: more/less, rose/fell, causes/results from, before/after, supports/undermines. Arrows demand verification — re-locate the sentence and confirm which way it points.',
      mistake:'Confirming subject matter instead of direction: "yes, the passage talked about riverbank erosion and cattle" is not verification. The trap counts on that partial match. Check the verb\'s direction, not the nouns around it.',
      example:{ context:'Reading · Cause-Effect',
        passage:'Wolves reintroduced to Yellowstone in 1995 caused elk to avoid open valleys. This allowed vegetation to recover, which stabilized riverbanks, slowed water flow, and deepened river channels.',
        q:'What was the relationship between wolf reintroduction and river channels?',
        c:['Wolves directly altered channels through dam-building','Wolf predation → elk movement → vegetation recovery → river channel deepening','River channel changes caused elk movement, which attracted wolves','Wolves prevented vegetation recovery by overhunting'],
        a:1, steps:['The question asks for the RELATIONSHIP between wolves and river channels — a directional question, so every choice\'s arrow needs tracing.','Trace the passage\'s chain first: wolves → elk avoid valleys → vegetation recovers → banks stabilize → channels deepen. One arrow, five links.','Choice C runs the arrow backward: channels changed → elk moved → wolves arrived. Same nouns, reversed causation. The Opposite trap in its purest form.','Choice D flips a link\'s sign: "prevented vegetation recovery" inverts what the passage states. Eliminate.','Choice A swaps in dam-building — not a reversal but an invention (and dams are beavers\' work anyway). Eliminate.','Choice B walks the chain in the passage\'s own direction, link by link. Directional verification done, answer confirmed.'] }
    },
    R6:{ code:'R6', name:'True But Irrelevant', section:'B',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Not every accurate statement answers the question. A True-But-Irrelevant choice is fully supported by the passage — you can point to its line — but it answers a DIFFERENT question than the one asked. It\'s the test\'s reward for sloppy question-reading: you verify the choice against the text, find it checks out, and click, never noticing the question asked about the author\'s purpose while the choice describes a detail. Truth is necessary but not sufficient: the answer must be true AND on-task.',
      why:'Verification feels like the finish line. After the work of confirming a claim against the passage, your brain declares victory — and the trap is positioned exactly there, at the moment your guard drops. A passage-supported wrong answer is the one trap that survives a truth-check, which is why it guards the harder questions.',
      trigger:'After you\'ve verified a choice is textually true, re-read the question stem once before selecting — every time. Ten seconds spent asking "does this answer THIS question?" is the entire defense.',
      mistake:'Grading choices true/false instead of on-task/off-task. On hard questions, two or three choices may all be TRUE; only one is responsive. If multiple choices survive your truth-check, the stem — not the passage — breaks the tie.',
      example:{ context:'Reading · Question Focus',
        passage:'Architect Yaw Osei\'s sun-tracking skylights reduced electricity use by 40%. His firm also used reclaimed materials in 80% of projects. Osei cited the skylight system as his most commercially significant innovation.',
        q:'Which aspect does the passage identify as most commercially significant?',
        c:['His use of reclaimed materials in 80% of projects','His sun-tracking skylight system','His decision to reduce electricity use','His firm\'s overall sustainability philosophy'],
        a:1, steps:['Read the stem with precision: it asks which aspect the passage calls MOST COMMERCIALLY SIGNIFICANT — not what\'s impressive, not what\'s sustainable. That superlative is the whole question.','Choice A (reclaimed materials, 80% of projects) is textually true — you can point to the sentence. True, verified… and unresponsive: the passage never ranks it commercially. The trap sits exactly here.','Choice C describes the skylights\' outcome (less electricity), not what Osei cited. Adjacent to the answer, off the stem\'s target. Eliminate.','Choice D, "overall sustainability philosophy," is broader than anything the passage attributes to Osei. Eliminate.','Choice B is what the text explicitly says Osei cited as most commercially significant: the skylight system. Stem answered in the stem\'s own terms.','The discipline that decided this: after verifying truth, you re-read the question. A was true — it just wasn\'t the answer to THIS question.'] }
    },
    R7:{ code:'R7', name:'Comparison Fallacy Flag', section:'B',
      bands:[3,4,5,6,7], skills:['main_idea','inference'],
      explain:'When a passage describes two things, the test loves to offer a comparison between them — better, more successful, more influential — that the passage never actually makes. Describing A and describing B is not comparing A to B. "The first bridge used stone; the second used iron" licenses no claim about which was stronger. The rule: a comparative answer is only correct if the passage itself states the comparison. Two separate descriptions, however detailed, license exactly zero rankings.',
      why:'Human minds rank things automatically — give us two of anything and we\'ll order them. The trap converts that reflex into an answer choice: it feels like the passage compared them because YOU compared them while reading. The writer only has to mention two subjects side by side and let your ranking instinct do the rest.',
      trigger:'Any choice containing comparative machinery — more, less, better, worse, -er words, "unlike," "superior," "the most" — when the passage discusses two or more subjects. Flag the comparison, then hunt for an explicit comparing sentence.',
      mistake:'Accepting a comparison because it\'s probably right ("the award-winner is surely more acclaimed than the bestseller"). Probably-right comparisons are Could-Be-True traps wearing comparative clothes: no stated comparison, no valid answer.',
      example:{ context:'Reading · Comparison',
        passage:'Novelist Kweku Asante\'s debut won three awards for structural innovation. Novelist Lina Tuilagi\'s debut sold 200,000 copies and was cited for emotional depth. Both emerged from the same MFA program.',
        q:'What does the passage indicate about both debuts?',
        c:['Asante\'s debut was more critically successful than Tuilagi\'s','Both debuted successfully, though in different ways','Tuilagi\'s debut was commercially superior to Asante\'s','The MFA program produced only commercially successful novelists'],
        a:1, steps:['Inventory what the passage actually states: Asante\'s debut won three awards; Tuilagi\'s sold 200,000 copies and drew praise for emotional depth. Two portraits, side by side.','Now hunt for a comparing sentence — any line ranking one against the other. There is none. That single observation pre-decides every comparative choice.','Choice A ranks critical success. The passage praises both and ranks neither. Comparison fallacy. Eliminate.','Choice C ranks commercial success — but Asante\'s sales are never given, so the comparison isn\'t just unstated, it\'s uncomputable. Eliminate.','Choice D turns a two-person sample into a claim about the whole MFA program, with an "only" for good measure. Eliminate.','Choice B refuses to rank: both succeeded, differently. On comparison questions, the answer that declines the comparison is usually the one the text supports.'] }
    },
    R8:{ code:'R8', name:'Scope Trap Detection', section:'B',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Evidence comes in sizes. A study of 200 students at one campus supports claims about those 200 students — cautiously, about similar students — never about "college students everywhere" or "all young people." Scope traps stretch a finding past its evidence: a sample becomes a population, "some" becomes "most," one region becomes the world, a decade becomes an era. Before accepting any choice, match its SIZE to the evidence\'s size: population, place, time, and strength of claim all have to fit inside what the passage measured.',
      why:'Generalizing is how humans compress information — we hear "a study found" and file it as "it\'s true generally." The test builds wrong answers along that natural compression: the trap sounds like a reasonable summary of the finding, and it IS a reasonable summary — of a much bigger finding than the passage contains. The correct answer often sounds fussy and over-qualified by comparison. Fussy is what supported looks like.',
      trigger:'Choices with quantifiers and breadth markers: all, most, generally, worldwide, "students" with no qualifier, "in all cases." Also stems asking "what can be concluded" — that phrasing is where scope traps live. Compare each choice\'s reach to the sample\'s reach.',
      mistake:'Eliminating a choice for restating the study\'s limits ("only the surveyed students…") because it sounds weak or wordy. On scope questions the cautious, qualified choice is usually the answer; the punchy sweeping one is usually the trap.',
      example:{ context:'Reading · Scope',
        passage:'A 2023 survey of 1,200 college students at four universities found that 67% reported social media use negatively affected their study concentration.',
        q:'What can be concluded from this survey?',
        c:['Social media universally harms concentration in academic settings','Most college students are addicted to social media','A majority of surveyed students reported social media negatively affected their study concentration','Social media platforms should be banned from campuses'],
        a:2, steps:['Measure the evidence first: one survey, 1,200 students, four universities, self-REPORTED concentration effects. That is the entire license.','Choice A claims "universally harms" — the sample cannot reach "universal" from four campuses. Scope stretched from sample to species. Eliminate.','Choice B swaps the measured variable: concentration became "addiction," a construct the survey never touched. Scope can stretch sideways, not just outward. Eliminate.','Choice D leaps from finding to policy ("should be banned") — surveys describe; they don\'t prescribe. Eliminate.','Choice C is fussy on purpose: "a majority of surveyed students reported…" — every qualifier mirrors a boundary of the evidence. Sample, self-report, and topic all fit.','The pattern to keep: the sweeping choice SOUNDED like a conclusion; the qualified choice WAS the conclusion. On scope questions, precision beats punch.'] }
    },
    R9:{ code:'R9', name:'Find the Motive Method', section:'C',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Passages about a scientist, artist, or historian almost always tell you WHY that person did what they did — the motive is stated, not implied. The Find the Motive Method is reading with one standing question: who is acting, and what reason does the author give for the action? Mark that reason when you hit it. Inference questions about the person ("why did she shift fields?", "what prompted the new approach?") then become lookups instead of speculation, because the SAT never asks you to psychoanalyze — it asks you to retrieve.',
      why:'Motive questions attract a specific trap family: motives that make human sense (ambition, frustration, funding, prestige) but were never stated. Your empathy fills gaps automatically — you know why YOU would have done it. Anchoring to the stated motive before reading choices converts an empathy exercise into evidence retrieval, and the traps lose their grip.',
      trigger:'Any passage centered on a person\'s decision, career shift, method change, or unusual choice. Find and mark the stated reason on your first read, before any question appears.',
      mistake:'Accepting a motive because it\'s psychologically realistic. "She was probably frustrated" is your theory of mind at work, not the author\'s words. If a choice\'s motive can\'t be matched to a stated reason, it\'s a Could-Be-True wearing a motive costume.',
      example:{ context:'Reading · Inference',
        passage:'Dr. Adaeze Okonkwo studied red dwarf stars for a decade before shifting to exoplanet atmospheres. She explained that advances in spectroscopic technology had made it newly possible to analyze atmospheric chemical composition — questions that had been technically unanswerable before.',
        q:'Why did Dr. Okonkwo shift her research focus?',
        c:['She lost interest in red dwarf stars','A technological advance made a previously impossible area newly accessible','Her institution required a change','Exoplanets were considered more prestigious'],
        a:1, steps:['The passage is a person-plus-decision story, so mark the stated motive on the first read: "advances in spectroscopic technology had made it newly possible…" — that clause is the motive.','The question asks why she shifted focus. Retrieve, don\'t theorize.','Choice A supplies boredom ("lost interest") — psychologically tidy, textually absent. The passage gives a reason; she never gives that one. Eliminate.','Choice C invents an institutional requirement — no employer appears in the passage at all. Eliminate.','Choice D offers prestige — humanly plausible, unstated. A motive costume on a could-be-true trap. Eliminate.','Choice B restates the marked clause: new technology made previously unanswerable questions answerable. Stated motive, retrieved.'] }
    },
    R10:{ code:'R10', name:'Keyword Anchoring', section:'C',
      bands:[1,2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Most Reading questions point at one or two sentences of the passage — the rest is scenery. Keyword Anchoring is how you find those sentences fast: pull the most specific noun or verb out of the question stem (a name, a date, a technical term, an action), scan the passage for that word or its cousin, and read the sentence around the hit. The answer to a detail question almost always lives within a sentence of its keyword. You\'re not rereading the passage; you\'re executing a targeted search.',
      why:'Untrained readers answer detail questions from memory of the gist — and the gist is exactly what trap answers are tuned to match. Recycled and half-right traps SOUND like your memory of the passage. Anchoring forces a return to the exact sentence, where precise wording separates the right answer from its imitations. Memory is where traps live; the anchored sentence is where they die.',
      trigger:'Every detail and evidence question that references specific content — a person, event, quantity, or claim. Pick the stem\'s most specific word (never "passage" or "author"), and scan for it before reading any choices.',
      mistake:'Anchoring to a common word that appears everywhere in the passage ("water" in a passage about rivers). Anchor to the RAREST specific word in the stem — a proper noun, a number, an unusual verb — so your scan lands once, not five times.',
      example:{ context:'Reading · Evidence',
        passage:'The transcontinental railroad relied heavily on Chinese immigrant laborers who made up approximately 80% of the Central Pacific workforce. Despite their central role, Chinese workers were paid less than white counterparts and were excluded from the completion ceremony at Promontory Summit.',
        q:'What was notable about the Chinese workers\' role at the completion ceremony?',
        c:['They received higher wages at the ceremony','They were given prominent roles','They were excluded despite their central role in construction','The ceremony was held at a location they had built'],
        a:2, steps:['Pick the stem\'s most specific words: "completion ceremony" — rare, concrete, unlikely to appear twice.','Scan for the anchor. One hit: "excluded from the completion ceremony at Promontory Summit."','Read the full anchored sentence, including its opening: "Despite their central role… paid less… excluded." The contrast is the point.','Choice A reverses the wage detail from the same sentence; choice B reverses the exclusion itself. Both die against the anchored text, not against memory.','Choice D drifts to the ceremony\'s location — recycled scenery. Choice C matches both halves: excluded, despite their central role.','Note what anchoring bought: you never re-read the passage. One scan, one sentence, and the traps had nothing to work with.'] }
    },
    R11:{ code:'R11', name:'Paragraph Function Labeling', section:'C',
      bands:[3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Structure questions — "what is the function of paragraph 2?", "why does the author include X?" — feel abstract until you\'ve labeled the architecture. As you read any multi-paragraph passage, give each paragraph a three-to-five word job title: "introduces problem," "presents evidence," "raises counterargument," "qualifies the finding," "answers the critics." Thirty seconds of labeling converts every structure question from interpretation into lookup: the question asks for a paragraph\'s function, and you\'ve already written it down.',
      why:'Function is invisible when you only track content. Two paragraphs can discuss the same facts while doing opposite jobs — one presenting a finding, the other limiting it. Trap answers exploit that gap: they describe a paragraph\'s TOPIC accurately while misstating its ROLE. A label written while reading captures the role before the traps get to propose their own.',
      trigger:'Any passage of three or more paragraphs, labeled during the first read — and any question containing "function," "purpose," "in order to," or "serves to." If you reach such a question without labels, label now, before the choices.',
      mistake:'Labeling paragraphs by topic instead of function. "About the 2004 photographs" is a topic; "presents new evidence" is a function. Structure questions ask what a paragraph DOES — write job titles, not subject lines.',
      example:{ context:'Reading · Structure',
        passage:'[P1] Scientists have long known certain fish can detect Earth\'s magnetic field. [P2] Recent research using implanted trackers revealed that salmon navigate using magnetic maps with surprising precision. [P3] This discovery raises new questions about whether magnetic sense is more widespread in aquatic life than assumed.',
        q:'What is the primary function of paragraph 3?',
        c:['Summarizes the research methods','Introduces a limitation of the findings','Extends the discovery\'s implications to a broader question','Contradicts paragraph 2'],
        a:2, steps:['Label during the read: P1 = "known fact established," P2 = "new finding presented," P3 = "broader question raised."','The question asks P3\'s primary function. Your label already answers it — now the choices simply match or miss.','Choice A, "summarizes the research methods" — that content lives in P2, and summarizing isn\'t P3\'s job anyway. Eliminate.','Choice B, "introduces a limitation" — P3 doesn\'t flag a flaw in the salmon work; it opens outward to other species. A limitation label would read "qualifies the finding." Eliminate.','Choice D, "contradicts paragraph 2" — P3 builds on P2\'s discovery; extension is the opposite of contradiction. Eliminate.','Choice C matches the label: extends the discovery into a broader question. Function questions are lookups when the labels exist.'] }
    },
    R12:{ code:'R12', name:'One-Line Headline Test', section:'C',
      bands:[1,2,3,4,5,6,7], skills:['main_idea'],
      explain:'Main-idea questions have a signature failure: choosing a statement that\'s TRUE but the wrong size. The One-Line Headline Test sets your size gauge before the traps arrive. After reading, write a one-line headline for the passage, as if you were its newspaper editor. The right answer will match your headline\'s scope; the traps will be a detail dressed as the whole (too narrow), a claim the passage never earns (too broad), or your headline with one word bent (distorted).',
      why:'The choices for a main-idea question are engineered around scope errors, and scope is almost impossible to judge choice-by-choice — each option sounds reasonable alone. A headline gives you a fixed measuring stick made from the passage itself. Comparison against a standard is a far easier cognitive task than absolute judgment — the same reason U5\'s prediction works.',
      trigger:'Any stem with "main idea," "central claim," "primary purpose," "best title," or "best summarizes." Headline first, always before the choices — a headline written after reading them is contaminated.',
      mistake:'Headlining the most memorable paragraph instead of the whole passage. If your headline doesn\'t account for the passage\'s turn — the "however," the second half — it\'s a paragraph label, not a headline. Cover the arc, not the highlight.',
      example:{ context:'Reading · Main Idea',
        passage:'Dr. Marisol Rivera spent 15 years restoring coastal wetlands in Louisiana. Her team found restored wetlands absorbed storm surge better than engineered barriers in three major storms. Rivera argues ecological restoration should be integrated with infrastructure planning.',
        q:'What is the central argument of this passage?',
        c:['Rivera\'s study is the longest wetland restoration project on record','Coastal wetlands are found primarily in Louisiana','Ecological restoration offers storm resilience that should be incorporated into infrastructure planning','Engineered barriers are completely ineffective against storms'],
        a:2, steps:['Write the headline before touching the choices: "Researcher argues restored wetlands beat barriers and belong in infrastructure planning."','Choice A headlines a credential — the study\'s duration. True-sounding, but it\'s a detail\'s size, not the passage\'s. Too narrow. Eliminate.','Choice B relocates the passage to geography ("found primarily in Louisiana") — a claim never made at any size. Eliminate.','Choice D bends the comparison into "completely ineffective" — your headline said wetlands performed BETTER, not that barriers failed. Distortion plus extreme language. Eliminate.','Choice C matches the headline\'s scope: restoration works and should join infrastructure planning. Claim, evidence, and recommendation all present.','The gauge did the judging: one candidate matched the headline\'s size; the others were a detail, a relocation, and a bent claim.'] }
    },
    R13:{ code:'R13', name:'Paraphrase Before Looking', section:'C',
      bands:[2,3,4,5,6,7], skills:['main_idea','inference'],
      explain:'Dense, formal, or archaic prose creates a specific vulnerability: when you don\'t quite own a sentence\'s meaning, every polished answer choice sounds like it might be saying the same thing. Paraphrase Before Looking closes that gap. After reading a difficult sentence or passage, restate it in your own ten plain words — "famous factory, secretly in debt, nobody checked" — BEFORE opening the choices. The correct answer will match your plain version\'s meaning; the traps will drift from it in ways you can now see.',
      why:'Translation is proof of comprehension: you cannot paraphrase a sentence you haven\'t understood, and discovering that mid-sentence is far cheaper than discovering it mid-traps. The paraphrase also strips away the stylistic fog traps hide in — a distractor that reverses the author\'s emphasis is obvious next to your plain version, and invisible next to the original\'s double negatives.',
      trigger:'Any passage or sentence in dense academic, legal, or archaic register — and any moment you finish reading and feel you ALMOST understood. Translate before you evaluate anything.',
      mistake:'Paraphrasing loosely and losing the sentence\'s logical machinery — the "not X but Y," the "less because A than B," the concession before the claim. Your plain version must keep the relationships, not just the topic; a paraphrase that drops the reversal will walk you straight into the reversed trap.',
      example:{ context:'Reading · Comprehension',
        passage:'The proliferation of coffeehouses in 18th-century London created spaces for cross-class intellectual exchange previously unavailable. Merchants, writers, and professionals congregated where the price of admission — a penny — was broadly accessible, and conversation, not commerce, was the primary currency.',
        q:'What role did coffeehouses play in 18th-century London?',
        c:['Primarily commercial establishments for merchants','Enabled intellectual exchange across social classes at low cost','Exclusive clubs for professional writers','Replaced trading floors where merchants previously met'],
        a:1, steps:['The register is formal ("proliferation," "cross-class intellectual exchange"). Translate before evaluating: "Cheap coffeehouses let all kinds of people meet and trade ideas — that was new."','Choice A calls them "primarily commercial establishments" — your plain version says conversation, not commerce, was the point. The passage even says it directly. Reversal. Eliminate.','Choice C makes them "exclusive clubs" — the penny\'s whole significance was accessibility. Opposite of the paraphrase. Eliminate.','Choice D says they "replaced trading floors" — commerce again, plus an invented substitution. Nothing in the plain version supports it. Eliminate.','Choice B matches the translation: intellectual exchange, across classes, at low cost. Every element maps.','Without the paraphrase, A and D\'s commercial vocabulary ("merchants," "currency") would have felt textual. The plain version showed the currency was metaphorical — that\'s what translation protects.'] }
    },
    G1:{ code:'G1', name:'Pattern Recognition Over Rule Naming', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['grammar','transitions','punctuation'],
      explain:'Students freeze on grammar questions they could answer, because they think they need the rule\'s name. You don\'t. The SAT tests grammar through consistency: the sentence around the blank establishes a pattern, and the right answer continues it. "She was praised for her patience, her candor, and her ___" — you can hear that the blank wants another "her" plus a noun, without ever saying "parallel noun series." Pattern Recognition is permission to trust that ear: find what the sentence is already doing, and pick the choice that keeps doing it.',
      why:'Rule names are a memory system; patterns are a perception system — and perception is faster and more reliable under time pressure. The test builds grammar items around a consistency break, which means the evidence for the answer is always IN the sentence, visible as a mismatch. Naming the rule adds a translation step that costs time and invites doubt; matching the pattern goes straight to the evidence.',
      trigger:'Every grammar question, and urgently on any where you catch the thought "I don\'t remember this rule." Read the sentence around the blank, ask "what is this sentence already doing?", and match it.',
      mistake:'Abandoning a question because the rule name won\'t come. The name was never required — the sentence carries its own answer key. If you can say which choice SOUNDS consistent and point to the words that make it so, you\'ve done the whole job.',
      example:{ context:'Grammar · Pattern Matching', passage:null,
        q:'The committee\'s job was to study the data, analyze the findings, and [BLANK] its conclusions to the board.',
        c:['presenting','to present','present','has presented'],
        a:2, steps:['Read what the sentence is already doing: "to study the data, analyze the findings, and ___." Two bare verbs are on the table after that first "to": study, analyze.','Name the pattern in plain words — "the list runs on bare verbs" — no textbook term needed.','Choice A, "presenting," switches to an -ing form. Say the series aloud: "study, analyze, presenting." The mismatch is audible. Eliminate.','Choice B, "to present," re-adds the "to" the series dropped after its first item; choice D, "has presented," imports a tense from nowhere. Both break the established shape. Eliminate.','Choice C, "present," is a third bare verb: study, analyze, present. The pattern continues seamlessly.','Notice what you never did: name the rule. The sentence supplied the pattern; you supplied the match.'] }
    },
    G2:{ code:'G2', name:'Shortest Answer Rule', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['grammar'],
      explain:'When answer choices all say the same thing at different lengths, the SAT is testing concision — and the shortest grammatically correct choice wins almost every time. The test\'s style has no patience for "final and definitive decision that was conclusive" when "final decision" does the job. So on these questions, work upward from the shortest choice: if it\'s grammatical and loses no real information, it\'s the answer, and every longer option is carrying dead weight — a redundancy, a filler phrase, or a smuggled error.',
      why:'The SAT rewards writing that carries maximum meaning in minimum words, because that\'s the editing skill the test measures. Distractors on concision items are built by inflation: synonyms stacked ("each and every"), categories restated ("blue in color"), or empty scaffolding ("the fact that"). Length added without meaning is the specific flaw — which is why the shortest clean choice is the statistical favorite here, and long choices deserve suspicion by default.',
      trigger:'Choice sets where the options visibly nest — one short choice and progressively padded versions of it. Also any underlined phrase that could simply be deleted. Start evaluation at the shortest option, not the first.',
      mistake:'Auto-picking the shortest without the grammar check. Shortest CORRECT wins — a short option that breaks agreement or drops needed information loses to the next-shortest clean one. The rule ranks the survivors; it doesn\'t skip the survival test.',
      example:{ context:'Grammar · Concision', passage:null,
        q:'The board made a [BLANK] to merge the two companies.',
        c:['final and definitive decision that was conclusive','decision that was both final and definitive','final decision','conclusive and terminal determination'],
        a:2, steps:['Recognize the format: all four choices convey "a decision that settles it," at four different lengths. Concision item — start from the shortest.','Shortest is "final decision." Grammar check: adjective, noun — clean. Information check: does any longer choice add a fact this one lacks?','Choice A stacks three synonyms — final, definitive, conclusive. One meaning, triple billing: inflation, not information. Eliminate.','Choice B trims to two synonyms, but "final and definitive" still says one thing twice. Eliminate.','Choice D swaps in grander words ("conclusive and terminal determination") — different costume, same redundancy. Eliminate.','The shortest clean choice carried every fact the others did. That\'s the rule working as designed: length without added meaning is the flaw being tested.'] }
    },
    G3:{ code:'G3', name:'Transition Logic Map', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['transitions'],
      explain:'Transition questions are logic questions wearing vocabulary costumes. Every connector declares a relationship: however/although signal contrast, therefore/consequently signal cause-and-effect, furthermore/additionally signal continuation, for example/for instance signal illustration. The method: cover the choices, read the sentence before the blank and the sentence after, and name the relationship in your own words — "the second idea pushes against the first," or "the second results from the first." Only then look at the choices, and pick the connector that declares the relationship you found.',
      why:'Wrong transitions frequently sound fine, because your ear judges rhythm, not logic — "however" and "therefore" are interchangeable to the ear and opposite to the argument. The test builds distractors from connectors of the WRONG family that flow smoothly. Naming the relationship first converts a sound judgment into a logic check, which is the only test these items actually contain.',
      trigger:'Any blank offering connector words (however, therefore, similarly, for instance…). Diagnose the two ideas\' relationship BEFORE reading the choices — contrast, cause, continuation, or example.',
      mistake:'Reading the choices into the sentence one at a time to hear which "fits." Every distractor was engineered to pass that test. The relationship must come from the ideas themselves; if you can\'t name it in your own words, re-read the sentences, not the options.',
      example:{ context:'Grammar · Transitions', passage:null,
        q:'Scientists initially believed the crater was volcanic. [BLANK], chemical analysis revealed impact signatures consistent only with an extraterrestrial object.',
        c:['Therefore','Similarly','However','Consequently'],
        a:2, steps:['Cover the choices. Idea one: scientists believed the crater was volcanic. Idea two: chemical analysis pointed to an extraterrestrial impact.','Name the relationship in your own words: the second finding overturns the first belief. That is contrast — the correction flavor of it.','Now open the choices and sort by family: Therefore and Consequently declare cause-and-effect; Similarly declares continuation; However declares contrast.','The belief did not CAUSE the discovery, so the cause family is out no matter how smooth "Therefore" sounds. Eliminate both.','"Similarly" would claim the analysis agreed with the volcanic theory — the opposite of what happened. Eliminate.','"However" declares exactly the relationship you named before looking: expectation, then reversal. The logic was decided before the vocabulary arrived.'] }
    },
    G4:{ code:'G4', name:'Punctuation Decision Tree', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['punctuation'],
      explain:'SAT punctuation reduces to a short decision tree, walked in order. One: are there complete sentences on BOTH sides of the mark? Then you need a period, a semicolon, or a comma WITH a joining word — never a comma alone (the comma splice, the test\'s favorite wrong answer). Two: does the first part set up a list or explanation? A colon — but only after a complete sentence. Three: is the phrase extra, removable information? Twin commas or twin dashes around it. Walk those three questions and nearly every punctuation item answers itself.',
      why:'Punctuation marks are traffic signals for clause boundaries, and the test writes its distractors by putting the right signal at the wrong boundary: a comma where two full sentences meet, a colon after a fragment, one dash where a pair is needed. The tree works because it checks the boundary FIRST — classify what\'s on each side of the mark, and the legal punctuation follows mechanically.',
      trigger:'Any question where the choices differ only in punctuation. Before comparing marks, read what sits on each side of the punctuation point and classify it: complete sentence, fragment, list, or aside.',
      mistake:'Choosing punctuation by visual habit — "a comma looks right there." Commas are the most common mark AND the most common wrong answer, precisely because they look right everywhere. The tree\'s boundary check, not comfort, is the test being run.',
      example:{ context:'Grammar · Punctuation', passage:null,
        q:'The climbers packed three essential supplies[BLANK] food, water, and rope.',
        c:[', food, water, and rope.',': food, water, and rope.','; food, water, and rope.','— food, water — and rope.'],
        a:1, steps:['Locate the boundary: "The climbers packed three essential supplies [?] food, water, and rope."','Walk the tree. Complete sentences both sides? Left side yes; right side — "food, water, and rope" — is a list, not a sentence. So period and semicolon rules don\'t apply.','Next branch: does the left side set up a list? Exactly — "three essential supplies" promises the three items. Setup plus list after a complete clause is colon territory.','Check the distractors against the tree: the semicolon (choice C) needs full sentences on both sides, and the list fails that test. Eliminate.','The bare comma (choice A) marks nothing about the setup relationship, and the dash pair (choice D) wraps "food, water" as an aside, orphaning "and rope." Eliminate both.','The colon (choice B) is what the tree prescribed: complete clause, promised list, delivered list. Boundary first, mark second.'] }
    },
    G5:{ code:'G5', name:'Subject-Verb Isolation', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['grammar'],
      explain:'The SAT hides agreement errors with distance: it drops a prepositional phrase — usually ending in a noun of the opposite number — between the subject and its verb. "The collection of ancient manuscripts… have?" Your ear agrees with "manuscripts," the nearest noun, and walks into the trap. Subject-Verb Isolation is the counter-move: cross out everything between the subject and the verb and read what remains. "The collection ___ donated" — singular, obviously. The interference was the entire question.',
      why:'Proximity agreement is a reflex: verbs want to match the noun they can hear, and the test writer plants a decoy of the opposite number right before the blank. The decoy phrase is grammatically inert — prepositional phrases never contain the subject — so deleting it is always safe, and what\'s left is a two-word sentence your ear can\'t get wrong.',
      trigger:'Any verb blank with nouns stacked before it — especially "of," "from," "along with," and "as well as" phrases between the opening noun and the blank. Cross out to the bone, then choose.',
      mistake:'Matching the verb to the nearest noun, or to a decoy that "feels like" the subject — "along with the teachers" adds people but not grammatical number. The subject sits before the interference, and the crossed-out version reveals it every time.',
      example:{ context:'Grammar · Subject-Verb Agreement', passage:null,
        q:'The collection of ancient manuscripts from the three destroyed libraries [BLANK] donated to the archive.',
        c:['have been','has been','were','are'],
        a:1, steps:['Spot the setup: a verb blank with three nouns stacked before it — collection, manuscripts, libraries. Distance like that is the trap\'s signature.','Cross out the interference: "of ancient manuscripts from the three destroyed libraries" — prepositional phrases, grammatically inert, never home to the subject.','Read what remains: "The collection ___ donated to the archive." The subject is "collection," and it\'s singular.','Now the choices: "have been," "were," "are" — all plural forms, all agreeing with the decoy nouns your ear just heard. Eliminate all three.','"Has been" agrees with the actual subject: the collection has been donated.','The whole question lived in one move: the phrase you crossed out WAS the test. Two words survived, and two words can\'t fool your ear.'] }
    },
    G6:{ code:'G6', name:'Pronoun Antecedent Hunt', section:'D',
      bands:[2,3,4,5,6,7], skills:['grammar'],
      explain:'Every pronoun is a pointer, and the SAT tests whether the pointer lands on exactly one noun. The Hunt: when a pronoun appears in the underline or the choices, draw the arrow back and ask two questions. Does it point to ONE clear noun, or could it grab two? Does its number match — singular "it" for a singular noun, plural "they" for a plural one? Ambiguity and mismatch are the only two failures, and replacing the pronoun with the specific noun is almost always the fix the right answer performs.',
      why:'Pronouns lean on context so well in speech that your ear auto-resolves them — you always know who "they" is when a friend says it. Print removes the tone and shared context that did that resolving, which is why writing standards demand the arrow land cleanly. The test exploits the gap: a sentence that sounds natural aloud can hide a pointer with two possible targets, and only the hunt exposes it.',
      trigger:'Any "it," "they," "this," "these," "their," or "its" in an underline or choice set — especially with two or more candidate nouns earlier in the sentence. Draw the arrow before judging anything else.',
      mistake:'Resolving the pronoun by story-sense ("obviously they means the coins") and calling it clear. If two nouns CAN grammatically receive the arrow, the pronoun is broken no matter which one your common sense picks — the standard is one possible target, not one likely one.',
      example:{ context:'Grammar · Pronoun Reference', passage:null,
        q:'Archaeologists discovered ancient coins near the old foundation. They were carefully catalogued and sent to the museum.',
        c:['They were carefully catalogued','The coins were carefully catalogued','It was carefully catalogued','Those were carefully catalogued'],
        a:1, steps:['Find the pointer: "They were carefully catalogued." Draw the arrow back — two plural nouns wait upstream: "archaeologists" and "coins."','Run the test: can the arrow land on both? "The archaeologists were catalogued" is absurd in story terms but grammatical — and grammar is the standard. The pointer is ambiguous.','Choice A keeps the broken pronoun unchanged. Eliminate.','Choice C swaps in "It" — now the number fails too: coins are plural. Choice D\'s "Those" points no more clearly than "They" did. Eliminate both.','Choice B performs the classic fix: replace the pronoun with the specific noun — "The coins were carefully catalogued." One noun, zero arrows to draw.','Note the standard the item enforced: not "which reading makes sense" but "how many readings are possible." Two possible targets means broken, every time.'] }
    },
    G7:{ code:'G7', name:'Verb Tense Consistency Check', section:'D',
      bands:[1,2,3,4,5,6,7], skills:['grammar'],
      explain:'Verb tense questions are anchor questions: somewhere near the blank, the sentence has already committed to a time — a dated event ("in 2010"), a time phrase ("since then," "by next spring"), or the tense of its other verbs. The blank must honor that commitment unless a signal explicitly moves the timeline. The method: find the anchor first, name its time zone (past, present, ongoing-to-now, future), and pick the verb form that lives there. "Since then" pairs with has/have + participle; "by the time X happened" pairs with had + participle.',
      why:'Isolated verb forms all sound correct — "published," "has published," "had published" are each fine somewhere — so the ear can\'t rank them without context. The test exploits that by offering four grammatical forms of the same verb; only the anchor decides. Distractors are simply the right verb in the wrong time zone, and they\'re only visible as wrong AFTER you\'ve located the anchor.',
      trigger:'A blank whose choices are the same verb in different tenses — the giveaway format. Before choosing, hunt the sentence and its neighbor for the time anchor: dates, "since/by/until" phrases, surrounding verbs.',
      mistake:'Judging the blank\'s tense against the clause it sits in, alone. The anchor often lives one clause or one sentence away — a "since then" behind you, a "by 1990" ahead. Tense is a paragraph-level contract, not a clause-level preference.',
      example:{ context:'Grammar · Verb Tense', passage:null,
        q:'The author published her first novel in 2010. Since then, she [BLANK] two more novels and a collection of essays.',
        c:['published','had published','has published','was publishing'],
        a:2, steps:['Scan for the anchor before touching choices. Two candidates: "published… in 2010" (a dated past event) and "Since then" (a bridge from that date to now).','"Since then" governs the blank — it declares action starting in the past and continuing to the present. That time zone has a dedicated form: the present perfect, has/have + participle.','Choice A, "published," is simple past — it seals the action inside the past, contradicting the still-open "since then" window. Eliminate.','Choice B, "had published," is past perfect — it needs a LATER past event to sit before, and none exists here. Eliminate.','Choice D, "was publishing," describes an action in progress at one past moment — again sealed off from the present. Eliminate.','Choice C, "has published," lives in the anchor\'s time zone: started after 2010, still counting. Anchor first, then the choice picks itself.'] }
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
      { p:'A 2024 study tracked 340 commuters and found that those who biked to work reported higher morning alertness than those who drove. The researchers noted that the effect faded on days with heavy rain.', q:'A wrong answer choice reads: "The study found that biking to work makes commuters more alert than any other activity." Which trap pattern is this?', c:['Extreme language','Recycled language','Half-right','Could-be-true'], a:0, e:'"More alert than any other activity" turns a two-group comparison (bikers vs. drivers) into a universal claim the study never made. Overstatement into absolute territory is the Extreme pattern. Recycled would reuse the study\'s words with a twisted meaning; this invents a new universal claim instead.' },
      { p:'The city\'s new bus network increased ridership by 22% in its first year. Fare revenue, however, declined slightly, because the redesign included a discounted transfer program.', q:'A choice reads: "The redesign increased ridership and raised fare revenue." Which trap pattern is this?', c:['Could-be-true','Half-right','Extreme language','Recycled language'], a:1, e:'The first half is true (ridership rose 22%); the second half is false (revenue declined). The accurate clause is the bait, the inaccurate clause is the hook. Verify every part of a choice — half-right is all wrong.' },
      { p:'Naturalist Ana Reyes documented 41 previously unrecorded moth species in a single Ecuadorian valley over two field seasons.', q:'A choice reads: "Reyes\'s discoveries will lead to new conservation protections for the valley." Which trap pattern is this?', c:['Half-right','Recycled language','Could-be-true','Extreme language'], a:2, e:'Entirely plausible in the real world, entirely absent from the passage — nothing is said about conservation or protections. If you must imagine a future beyond the text to make a choice true, it\'s Could-Be-True.' },
      { p:'The committee praised the bridge design for its "minimal environmental footprint," noting that construction would avoid the wetland entirely by routing pilings along the existing rail corridor.', q:'A choice reads: "The committee praised the design for minimizing the environmental footprint of the existing rail corridor." Which trap pattern is this?', c:['Extreme language','Could-be-true','Half-right','Recycled language'], a:3, e:'Every word looks familiar because they ARE the passage\'s words, reassembled to say something new: "minimal footprint" described the bridge, not the rail corridor. Familiar vocabulary with reassigned meaning is the Recycled pattern.' },
      { p:'Sea otters were reintroduced to the estuary in 2012. By 2020, eelgrass coverage had roughly doubled. Researchers attribute the recovery to otters preying on crabs that would otherwise overgraze the organisms that keep eelgrass clean.', q:'Using the four trap patterns, which choice is the one the passage supports?', c:['Otter reintroduction contributed to eelgrass recovery through a food-chain effect','Otters are the only factor capable of restoring damaged eelgrass beds','Eelgrass coverage doubled, proving the estuary is now fully restored','The researchers intend to expand otter reintroduction to nearby estuaries in coming years'], a:0, e:'B is Extreme ("only factor"). C is Half-Right (coverage did double; "fully restored" is never claimed). D is Could-Be-True (plausible next step, never stated). A restates the passage\'s causal chain with no overstatement — it survives the trap filter.' },
    ],
    U2:[
      { p:null, q:'On the digital SAT, what does your Module 1 performance directly determine?', c:['Your final composite score, locked in before Module 2 is even scored','Which difficulty version of Module 2 the algorithm routes you into','How much time the algorithm allocates for you in Module 2','How many of Module 2\'s questions count toward your score'], a:1, e:'Module 1 is identical for everyone; your accuracy on it routes you to the harder or easier Module 2. The easier version caps your maximum section score, which is why Module 1 accuracy matters double.' },
      { p:null, q:'You finish Module 1 with 5 minutes left. Under the Module 1 Mastery Protocol, what do you do with the time?', c:['Submit the module early so you can bank mental energy for Module 2','Re-attempt the single hardest question until the timer finally expires','Re-check the easiest questions for careless slips, then any flagged ones','Review the instructions screen to get ready for Module 2'], a:2, e:'Careless errors cluster on easy questions, and in Module 1 each one costs the point plus your routing. Easiest questions first (highest recovery value), then flagged ones. Submitting early donates accuracy for nothing.' },
      { p:null, q:'Rushing Module 1 to "save time for the harder Module 2" backfires for which reason?', c:['Module 2\'s difficulty version is fixed in advance, so nothing in Module 1 changes it','Any time left unused in Module 1 is automatically added to your Module 2 clock','Module 1 questions carry no point value of their own, so speed there gains nothing','Rushed errors cost those points now and also route you into the capped Module 2'], a:3, e:'The double penalty: every careless Module 1 miss subtracts from your score and pushes your routing toward the easier, ceiling-capped Module 2. There is no stored benefit to finishing Module 1 early.' },
      { p:null, q:'It is the morning of a full practice test. Where does the Module 1 Mastery Protocol tell you to spend your best, freshest focus?', c:['On Module 1 of each section, because it decides which Module 2 you unlock','Spread evenly across all four modules, since every question counts equally','On Module 2 of each section, because the harder questions appear there','On the breaks between modules, to recover energy for the finish'], a:0, e:'Front-load the focus. Module 1 performance in each section determines which version of Module 2 you receive — the questions that decide your ceiling come first, not last.' },
      { p:null, q:'With 10 minutes left in Module 1, you have 6 questions remaining and feel sure you could finish in 5. What is the protocol-correct plan?', c:['Finish all 6 in five minutes and submit the module early to rest up before Module 2','Work the 6 questions at a careful pace, then re-check easy ones with what remains','Skip the 6 remaining questions and re-check everything you already answered','Slow down drastically and spend all 10 minutes on just the next 2 questions'], a:1, e:'Careful pace first — accuracy is the priority. Then leftover minutes go to re-checking the easiest answered questions, where careless errors hide. Submitting early gives the router nothing but your mistakes.' },
    ],
    U3:[
      { p:null, q:'Nine minutes left; question #23 looks brutal, and #24–27 look moderate. What is the difficulty-weighted move?', c:['Attempt #23 first and give it whatever it takes, since harder questions carry more weight','Split the nine minutes evenly, about 1.8 minutes per question','Guess on #23 now, work #24–27 carefully, and return to #23 with whatever remains','Skip #24–27 entirely and invest all nine minutes in #23'], a:2, e:'Four moderate questions at high success probability outbuy one brutal question at low probability. Guessing #23 immediately means no blank if time dies, and returning later costs nothing.' },
      { p:null, q:'In difficulty-weighted terms, why can missing an easy question hurt more than missing a hard one?', c:['Easy questions secretly carry more scoring weight than hard ones do','The scoring algorithm applies an extra deduction when the miss is easy','Easy questions always appear first, so a miss there compounds later','An easy miss throws away a near-certain point that cost almost no time'], a:3, e:'Weighted scoring makes hard questions worth more, but expected value is probability times payoff. Easy questions are near-guaranteed points at tiny time cost — losing one is the worst points-per-minute trade on the test.' },
      { p:null, q:'You estimate a 25% chance of cracking #26 with three more minutes, or you could lock in near-certain answers on #20 and #21 in the same time. The weighted decision is:', c:['Take #20 and #21: two probable points beat one quarter-chance point','Take #26: the weighting makes hard questions worth the gamble at nearly any odds','Split the difference and spend ninety seconds on each of the two paths','Spend the three minutes re-checking earlier answers instead of these'], a:0, e:'Expected value: two questions at roughly 90% each is about 1.8 points; one harder question at 25% is about a quarter of a point even with extra weight. Difficulty weighting never makes a low-probability gamble outbuy two near-certainties.' },
      { p:null, q:'Questions in each SAT module run roughly easiest to hardest. With limited time, how should that ordering steer you?', c:['Work backward from the final questions, where the heavily weighted ones live','Prioritize unfinished earlier-position questions before late-position ones','Ignore position entirely, since the difficulty ordering is only a myth','Alternate one early question and one late question to balance the risk'], a:1, e:'Rough difficulty ordering means earlier unanswered questions are usually cheaper points. Clear those first; then spend what remains on the expensive late ones.' },
      { p:null, q:'You have 100 seconds left and two untouched questions: #12 (looks routine) and #27 (looks hard). Best sequence?', c:['Start with #27 first, then squeeze #12 into the leftover seconds','Guess on both immediately and submit while time still remains','Solve #12 carefully first, guess #27, and upgrade the guess if seconds remain','Split the time evenly and give fifty seconds to each question'], a:2, e:'The routine question is the near-certain point: bank it. A guess on #27 costs five seconds and can only be upgraded. Leading with the hard question risks losing both.' },
    ],
    U4:[
      { p:null, q:'You\'ve read question 9 twice and have no plan. Ninety seconds are gone. The full Skip-and-Return move is:', c:['Skip the question, leave the answer blank for now, and flag it for later','Stay until a plan appears, since leaving now wastes the ninety seconds already spent','Eliminate what you can and keep grinding until the two-minute mark arrives','Pick your best remaining choice, flag the question, and move to the next one'], a:3, e:'Guess + flag + go. The guess sets a floor (no blank if you never return); the flag makes the return trip instant. The ninety seconds already spent are gone either way — the next question\'s time isn\'t.' },
      { p:null, q:'What makes "I\'ve already put two minutes in, I can\'t quit now" the wrong instinct on a stuck question?', c:['Spent time is gone either way; the next minute simply buys more on other questions','Two minutes is the ideal per-question investment, so stopping there wastes the setup','Leaving a question early reduces the scoring weight of your later answers in that module','The instinct is correct: the test is built to reward persistence on hard questions'], a:0, e:'The classic sunk-cost trap. The two minutes are unrecoverable no matter what you do; the only live question is where the NEXT minute goes. On a stuck question its expected value is near zero — on fresh questions it isn\'t.' },
      { p:null, q:'You flagged three questions and reach the end of the module with four minutes left. What order does Skip and Return prescribe?', c:['Return to the flagged questions in the order that they frustrated you the most','Revisit flags easiest-first, keeping each guess unless you find a real reason to change','Change every flagged guess, because first guesses made under pressure are usually wrong','Leave the flags alone and spend the four minutes re-checking unflagged answers'], a:1, e:'Easiest flag first maximizes rescues per minute. And a guess only gets overwritten on new information — a caught misread, a fresh insight — never on vague second-guessing. Changes without new evidence hurt more than they help (see MN2).' },
      { p:null, q:'A question that felt impossible often feels workable when you return five minutes later. What does this reflect?', c:['Questions you return to are quietly re-scored at a lower difficulty weight','The delay gives you time to recall the answer from a previous practice test','A second look breaks fixation and can find the path the first read missed','The testing software reshuffles the choices on your return, making them simpler'], a:2, e:'Fixation is the enemy: once you commit to a wrong approach, rereading only deepens the rut. Distance resets the approach. That\'s the cognitive engine that makes Skip and Return profitable.' },
      { p:null, q:'Skip and Return exists to protect something. What?', c:['Your streak of consecutive correct answers within the module','Your right to view every question in the module at least two separate times','The scoring bonus awarded for completing a module ahead of time','The time and composure you need for the questions you CAN solve'], a:3, e:'One stuck question can consume three questions\' worth of time and shake you for several more. The protocol caps the damage at about 60 seconds and a calm exit — protecting the solvable questions downstream.' },
    ],
    U5:[
      { p:'Glass frogs sleep on leaves in plain sight. During sleep, they route nearly 90% of their red blood cells into their liver, rendering their bodies almost transparent and far harder for predators to spot.', q:'The question will be: "Why are sleeping glass frogs hard for predators to see?" Form your prediction first, then pick the choice that matches it.', c:['They pool their red blood cells in the liver, turning nearly transparent','They choose sleeping spots in deep shade where the light never reaches them','They gradually shift their skin color to match whichever leaf they sleep on','They secrete a chemical that temporarily scrambles a predator\'s color vision'], a:0, e:'Your prediction should mirror the passage\'s mechanism: blood into the liver, so the body turns transparent. A matches it. B, C, and D describe camouflage strategies that exist in nature (could-be-true) but are not what this passage says.' },
      { p:null, q:'What does predicting before reading the choices actually protect you from?', c:['Running out of time on the longest and densest reading passages','Letting the best-sounding trap become your standard of comparison','Forgetting what the question stem asked while you read the choices','Getting stuck on passages about topics you have never seen before'], a:1, e:'Anchoring. Whatever you read first frames everything after it. Predict first and the passage\'s actual meaning is the anchor; read choices first and the slickest trap is.' },
      { p:'Early bicycles had enormous front wheels because each pedal stroke turned the wheel exactly once: a bigger wheel meant more distance per stroke. The invention of the chain drive let small wheels spin faster than the pedals, and the giant front wheel disappeared.', q:'Predict the answer to "Why did the giant front wheel disappear?" Which choice matches your prediction?', c:['Riders found the huge wheels too dangerous to mount and ride','Manufacturers ran short of the materials needed for large wheels','The chain drive let small wheels achieve speed without size','City governments passed new regulations limiting wheel diameter'], a:2, e:'The passage\'s own logic: big wheels existed for distance-per-stroke; the chain drive delivered speed without size; the big wheel vanished. C restates that. A is could-be-true (and historically real) but it is not this passage\'s stated reason.' },
      { p:null, q:'You predict "the author thinks the reform mostly worked." A choice reads: "The author regards the reform as largely successful despite early setbacks." It shares no key words with your prediction. What do you do?', c:['Eliminate it, since a correct answer would reuse your prediction\'s wording','Re-read the entire passage from the top before considering it further','Hold it as a mismatch and hunt for a choice with matching vocabulary','Keep it, because it matches the prediction\'s meaning, which is what counts'], a:3, e:'Predictions match on meaning, not vocabulary. "Mostly worked" and "largely successful" are the same claim in different clothes. Demanding word matches would hand you Recycled Language traps — which are built from word matches.' },
      { p:'Museum conservators once cleaned oil paintings with untreated cotton swabs, until studies showed the fibers left micro-scratches in varnish. Most now use polyester applicators, which are smoother but hold less solvent, requiring more passes.', q:'Predict, then match: "What tradeoff comes with polyester applicators?"', c:['Gentler on varnish, but they hold less solvent, so cleaning takes more passes','Cheaper than the cotton swabs, but much harder for conservators to obtain','Faster to clean with, but they leave behind a faint chemical residue','Safer for the conservator to handle, but more damaging to the paint layer'], a:0, e:'The passage hands you both sides: smoother (gentler on varnish) but less solvent (more passes). A mirrors exactly that tradeoff. The others invent tradeoffs the passage never mentions — plausible, unsupported, and eliminated instantly by a formed prediction.' },
    ],
    U6:[
      { p:null, q:'You missed a comma question. Reviewing it, you realize you have never actually learned the rule for joining two complete sentences. Which bin?', c:['Careless error','Content gap','Trap triggered','Timing pressure'], a:1, e:'The rule was never in your toolkit, so no amount of care or extra time would have found it. Content Gap. The fix is learning the rule (G4\'s decision tree) and then drilling it — not generic "more practice."' },
      { p:null, q:'You eliminated the Extreme choice, hesitated, and picked it anyway because it "sounded authoritative." Which bin?', c:['Content gap','Timing pressure','Trap triggered','Careless error'], a:2, e:'You KNEW the pattern — you eliminated the choice — and the trap\'s pull beat your process anyway. Trap Triggered. Fix: drill that trap type until the elimination sticks, and practice committing to your analysis (MN2).' },
      { p:null, q:'With ample time remaining, you solved for x correctly but stopped reading and submitted x instead of the requested 2x. Which bin?', c:['Trap triggered','Content gap','Timing pressure','Careless error'], a:3, e:'Execution failure on a known skill: the math was right and the reading stopped early. Careless. (Yes, the test plants x among the choices — but the habit to fix is your reading: underline what the question actually asks for.)' },
      { p:null, q:'Your last-five-questions accuracy is far below your first-twenty accuracy on every module, and you solve those missed questions easily in untimed review. Which bin dominates?', c:['Timing pressure','Content gap','Careless error','Trap triggered'], a:0, e:'Solvable untimed plus missed at the end of every module points at the clock, not the content. Timing Pressure. The fix is pacing work (U7) and banking time early — not more content study.' },
      { p:null, q:'Which pairing of error bin and fix is correct?', c:['Content gap: practice slowing down and double-checking your work','Trap triggered: targeted drills on that specific trap pattern','Careless error: re-learn the underlying concept from scratch','Timing pressure: study additional content areas more deeply'], a:1, e:'Each bin has its own medicine: gaps get learning, traps get pattern drills, carelessness gets checking habits, timing gets pacing. Cross-prescribing — like content study for a timing problem — is why untagged review feels busy but changes nothing.' },
    ],
    U7:[
      { p:null, q:'A Math module gives you 22 questions in 35 minutes. What is the approximate natural pace per question, before any banking?', c:['About 60 seconds','About 71 seconds','About 95 seconds','About 120 seconds'], a:2, e:'35 minutes is 2,100 seconds; divided by 22 questions, that\'s roughly 95 seconds each. Math\'s budget is roomier than Reading/Writing\'s (about 71 seconds), so the 60-second target banks even more buffer there. Knowing the real number stops both panic and complacency.' },
      { p:null, q:'The 60-second TARGET and the 2-minute CAP serve different jobs. Which statement gets both right?', c:['They are two names for the same deadline, applied to every question equally','The 60-second figure is for hard questions, while the cap governs the easy ones','Both are loose suggestions that only start to matter in the final five minutes','The target banks buffer on routine questions; the cap stops single-question drains'], a:3, e:'Target = offense: bank seconds on questions you control. Cap = defense: limit the damage from questions you don\'t. Confusing them leads to rushing hard questions and lingering on easy ones — backwards on both ends.' },
      { p:null, q:'You finish a routine grammar question in 40 seconds. What did that just buy you?', c:['Twenty-plus banked seconds of thinking time for a harder question later','A requirement to move even faster on the next question to stay consistent','Nothing at all, since unused seconds expire when the next question loads','A higher difficulty weighting applied to that answer in scoring'], a:0, e:'The bank is real: module time is shared, so every second under budget on a routine question is a second available for the expensive ones. The buffer is the product — that\'s WHY the 60-second target exists.' },
      { p:null, q:'What is the practical clock-checking rhythm the rule prescribes?', c:['After every single question, to maintain constant awareness of the clock','Every 5–7 questions: often enough to catch drift, rare enough to keep focus','Only once, at the halfway point announcement in each module','Twice per module: once at the very start and once near the end'], a:1, e:'Per-question checking burns attention and feeds anxiety; twice-a-module checking finds disasters after they\'re unfixable. The 5–7 question rhythm samples your pace several times per module, while corrections are still cheap.' },
      { p:null, q:'At 2:10 on one algebra question you are mid-calculation and feel "almost done." The rule\'s verdict?', c:['Finish the calculation no matter what, since being almost done overrides the cap','The cap applies only to Reading questions, so keep working the algebra','You are past the cap: best guess from your work so far, flag it, move on','Erase everything and restart the problem with a faster method instead'], a:2, e:'"Almost done" is what every four-minute sinkhole feels like from the inside — you can\'t tell from in there, which is exactly why the cap exists. Partial work usually points at a best guess: take it, flag, move. The flag brings you back if time remains.' },
    ],
    R1:[
      { p:'In a five-year survey of urban gardens, researchers found that plots with flowering borders attracted more pollinator species than plots without them. The effect was strongest in gardens near parks, though it appeared in most neighborhoods studied.', q:'Which choice is best supported by the passage?', c:['Flowering borders were associated with greater pollinator variety in most areas studied','Flowering borders attract every pollinator species found in urban environments','A garden without a flowering border will never draw a wide range of pollinators','Flowering borders are the only factor that determines pollinator diversity in modern cities'], a:0, e:'B ("every"), C ("never"), and D ("the only factor") are all Extreme: each claims an absolute the survey cannot support. A carries the hedges that match the evidence ("associated," "most areas") — qualified claims survive because one exception can\'t break them.' },
      { p:'Archivists estimate that a substantial share of early silent films no longer survive, largely because the nitrate stock they were printed on decays and burns easily. Some titles, however, keep resurfacing in private collections and overseas vaults.', q:'A choice reads: "Early silent films are all permanently lost because nitrate stock cannot be preserved." Which TWO words make it an automatic Extreme flag?', c:['"substantial" and "decays"','"all" and "cannot"','"some" and "however"','"largely" and "easily"'], a:1, e:'"All" converts an estimate into a universal, and "cannot" converts a preservation challenge into an impossibility — both contradicted by films that keep resurfacing. "Substantial," "largely," "some": those are the hedged words correct answers are built from.' },
      { p:'Recent trials suggest that brief afternoon naps may improve recall in older adults, though effects varied widely between participants.', q:'Which choice stays within what the passage can support?', c:['Afternoon naps restore every adult\'s memory to youthful levels','Napping is proven to be the most effective memory aid available','Brief naps may aid recall for some older adults, with varying results','All older adults should be napping daily to prevent their memory loss entirely'], a:2, e:'The passage speaks in trial language: "suggest," "may," "varied." C preserves every hedge. A ("every," "restore"), B ("proven," "most effective"), and D ("all," "entirely") each promote a tentative finding into an absolute — three Extreme eliminations in one scan.' },
      { p:'No known species of octopus produces sound for communication. Researchers therefore rely on visual signals, from skin-pattern changes to arm postures, when cataloguing octopus social behavior.', q:'A choice reads: "No octopus species is known to communicate using sound." Why does the Extreme flag NOT eliminate it?', c:['Because the word "no" is not actually on the list of absolute words to scan for','Because flags only apply to the first answer choice in a set','Because sound and communication are scientific terms, not claims','Because the passage itself states this absolute, so the choice matches the text'], a:3, e:'The flag is a checkpoint, not a verdict. Absolute language in a choice is safe when the passage states the same absolute — and here it does. Scan, flag, VERIFY: elimination happens only when the choice out-claims the text.' },
      { p:'The workshop\'s ledgers show that the master painter signed finished portraits while assistants prepared pigments, backgrounds, and drapery. Art historians debate how much of each canvas the master painted personally.', q:'Which choice overstates the passage and should be eliminated on language alone?', c:['The master personally painted every stroke on each portrait the workshop produced','Assistants handled a great deal of the preparatory work behind the workshop\'s portraits','Historians disagree about the extent of the master\'s hand in the canvases','The ledgers record a division of labor between the master and the assistants'], a:0, e:'"Every stroke on each portrait" is a double absolute the ledgers cannot support — the passage says historians still debate the master\'s share. B, C, and D restate the text in qualified language. Note the format: sometimes the question ASKS for the trap; know the pattern either way.' },
    ],
    R2:[
      { p:'Nineteenth-century lighthouse keepers logged supply deliveries in duplicate: one copy stayed at the station, and one traveled back with the supply ship. Historians prize the traveling copies, which survived in central archives long after isolated stations burned or flooded.', q:'Which choice recycles the passage\'s words into a claim it never makes?', c:['Historians place special value on the ledger copies that reached the archives','Supply ships burned and flooded more often than the isolated stations did','Lighthouse stations were vulnerable to fire and flood damage over time','Keepers recorded deliveries in two copies rather than just one'], a:1, e:'"Burned," "flooded," "supply ships," "stations" — all passage words, reassembled so the disasters happen to the SHIPS instead of the stations. Familiar vocabulary, reversed subject. A, C, and D restate actual claims.' },
      { p:'The composer\'s late sonatas were dismissed by contemporary critics as unplayable exercises. Modern pianists, by contrast, treat their difficulty as expressive: the strain itself, they argue, is part of the music\'s meaning.', q:'What do modern pianists believe about the late sonatas?', c:['They are exercises that contemporary critics wrongly praised','They should be simplified until the strain disappears from performance','Their difficulty carries expressive meaning rather than being a flaw','They are unplayable in the way critics originally described'], a:2, e:'A and D recycle "exercises," "critics," and "unplayable" but reattach them wrongly: critics dismissed (not praised), and modern pianists reject (not confirm) "unplayable." C paraphrases the actual view with almost no borrowed words — meaning-match beats word-match.' },
      { p:'A biography notes that the senator "spoke rarely but voted independently," and that colleagues "praised her caution." A practice question about this passage offers a choice reading: "Colleagues rarely praised the senator, who spoke with caution."', q:'What should you conclude about the quoted answer choice?', c:['The sheer number of borrowed words shows the choice is well supported by the text','The choice merely paraphrases the biography\'s meaning in fresher language','The choice contradicts the biography openly rather than in any subtle way','Its borrowed words swapped roles: "rarely" moved to praise, "caution" to speech'], a:3, e:'Word-for-word familiar, meaning fully scrambled: the senator spoke rarely (not the praise), and the praise concerned her caution (not her speech). High word-overlap with the source is the Recycled trap\'s construction material — slow down and re-map each word\'s job.' },
      { p:'Glacial meltwater carries fine rock powder into alpine lakes, where suspended particles scatter sunlight and give the water a milky turquoise color. Lakes fed by rain, lacking the powder, stay clear and dark blue.', q:'Which choice is supported by the passage?', c:['Suspended rock powder gives meltwater-fed lakes their turquoise color','Rain-fed lakes scatter sunlight through suspended rock particles','Rock powder settles instantly, clearing the meltwater to a dark blue','Alpine lakes give glacial meltwater its distinctive milky color'], a:0, e:'B recycles "scatter sunlight" and "suspended" but assigns them to the wrong lakes — rain-fed lakes LACK the powder. C reverses the stated physics. D flips the direction: the lakes don\'t color the meltwater. A matches the causal chain as written.' },
      { p:'Medieval guilds regulated apprenticeships closely: a master could train only a fixed number of apprentices at once, and contracts spelled out meals, lodging, and the skills to be taught. The rules aimed to protect apprentices and to limit competition among masters.', q:'A tempting wrong choice reads: "Guild contracts regulated the meals and lodging that apprentices provided to their masters." What makes it wrong?', c:['The passage never actually mentions meals or lodging in any of its clauses','It reverses who provided what: contracts obligated masters, not apprentices','Guild rules applied to journeymen rather than to apprentices','The passage says contracts covered skills only, never living conditions'], a:1, e:'Every word in the trap appears in the passage — meals, lodging, contracts, apprentices, masters — but the direction of obligation is flipped. Recycled Language traps often keep the nouns and silently swap the roles. Always re-check who does what.' },
    ],
    R3:[
      { p:'The orchard trial compared two pruning schedules. Winter-pruned trees produced larger fruit, while summer-pruned trees resisted fungal infection better. Total yield by weight was nearly identical across the two groups.', q:'Which choice is half-right and should be eliminated?', c:['Total yield was similar whether trees were pruned in winter or in summer','Summer pruning improved fungal resistance without changing total yield much','Winter pruning produced larger fruit and a much heavier total yield','Winter-pruned and summer-pruned trees differed in more than one way'], a:2, e:'The first clause is true — winter pruning meant larger fruit. The welded second clause fails: "much heavier total yield" contradicts "nearly identical." A, B, and D each survive a clause-by-clause audit.' },
      { p:'After the harbor dredging, shipping traffic increased by a third, and the port authority reported record fee revenue. Local shellfish harvests, however, declined, which biologists attribute to disturbed sediment.', q:'Which choice passes a full clause-by-clause audit?', c:['Shipping traffic rose by a third, and shellfish harvests rose right along with it','Dredging boosted fee revenue and left the sediment undisturbed','Shellfish declined, which biologists blame on increased shipping fees','Traffic and fee revenue rose after dredging, while shellfish harvests fell'], a:3, e:'D\'s three claims each check out against the text. A\'s second clause reverses the harvest direction; B\'s second clause contradicts the sediment finding; C welds a true decline to a fabricated cause (fees, not sediment). One false clause sinks a whole choice.' },
      { p:'A wildlife survey states: "Beaver activity expanded along the upper creek, and downstream flooding decreased." A practice choice reads: "Beaver activity expanded along the upper creek, and downstream flooding worsened."', q:'You verify the choice\'s first clause is supported. What does Half-Right Elimination require next?', c:['Verify the second clause independently; here it fails, so the choice dies','Accept the choice, because its opening clause matches the survey exactly','Eliminate it for reusing too much of the survey\'s own wording','Compare its length to the other choices before deciding anything'], a:0, e:'The audit never stops at the first true clause — the weld point is where traps live. Clause two flips "decreased" to "worsened," so one word turns a supported choice into a wrong one. Verify every clause, every time.' },
      { p:'The museum\'s conservation lab found that the portrait\'s blue pigment was lapis lazuli, imported at great cost, but that the green background used cheap local earth pigments. Records show the patron paid for the lapis by weight.', q:'Which choice should be eliminated as half-right?', c:['The patron\'s payment records for the lapis lazuli survive, listed by weight','The blue was imported lapis, and the green was equally expensive','The lab identified both the blue pigment and the background pigments','The portrait combined an imported pigment with cheap local ones'], a:1, e:'True half: the blue was imported lapis. False half: the green was "equally expensive" — the passage calls it cheap and local. The comfortable first clause exists to carry the second one past your audit.' },
      { p:'Volunteers restored the prairie plot over a decade: native grasses returned quickly, wildflowers needed reseeding twice, and controlled burns kept invasive shrubs from reestablishing. Bird surveys now record nesting species absent since the 1970s.', q:'Which statement is fully supported rather than half-right?', c:['Wildflowers established immediately, while grasses required reseeding','Controlled burns permanently eliminated every last invasive plant from the plot','Native grasses returned quickly, though wildflowers needed repeated reseeding','Bird species returned, proving the restoration required no human effort'], a:2, e:'C\'s two clauses both match the text. A swaps the plants\' roles (half-flipped, all wrong); B upgrades "kept from reestablishing" into an Extreme absolute; D\'s second clause contradicts a decade of volunteer work.' },
    ],
    R4:[
      { p:'The seed bank stores duplicates of crop varieties from more than a hundred countries in a vault carved into Arctic permafrost. Deposits arrive sealed; the bank opens a country\'s boxes only at that country\'s request.', q:'Which choice is supported by the passage rather than merely plausible?', c:['The vault\'s surrounding permafrost has already begun thawing as the climate warms','Countries deposit seeds to guard against wars and natural disasters','The bank\'s staff regularly tests stored seeds for viability','The bank opens deposited boxes only when the depositor country asks'], a:3, e:'A is a real-world news story; B is the vault\'s famous purpose; C is standard practice at many banks — all plausibly true, none stated HERE. D restates the access rule. The question is never "is it true?" but "is it in THIS text?"' },
      { p:'Tamara Chen\'s bakery ships sourdough starters with printed feeding schedules. Customers who registered their starters online, she found, contacted support less often than customers who did not.', q:'Which conclusion requires NO outside assumptions?', c:['Registered customers contacted support less often than unregistered ones','Registering a starter online causes customers to become more skilled bakers','Chen\'s printed schedules are clearer than her competitors\' schedules','Most support contacts concern problems with the feeding schedule'], a:0, e:'A repeats the stated correlation and stops. B upgrades correlation to causation plus skill (two leaps). C invents competitors; D invents the content of support calls. Each trap is easy to believe — and that belief comes from you, not the passage.' },
      { p:'A profile of a glassblower notes that she "trains two apprentices each summer" and "sells most pieces before they cool." A choice reads: "Her apprentices go on to open successful studios of their own."', q:'You catch yourself thinking, "That\'s probably what happens." What is that thought, under R4?', c:['Sound supporting evidence, because profiles imply more than they state outright','The Could-Be-True signature: a cue to demand a line reference before accepting','Confirmation, because plausible outcomes are rarely planted as traps','A prompt to re-read the whole profile from its opening sentence'], a:1, e:'"Probably" marks support coming from your head, not the page. The profile says nothing about the apprentices\' futures. Plausible, warm, and completely unwritten: the exact anatomy of a Could-Be-True.' },
      { p:'Field notes from the 1911 expedition describe collecting "several dozen" beetle specimens near the river camp. The notes do not record weather conditions, and the specimen labels list dates but not locations.', q:'Which claim can the notes actually support?', c:['The expedition endured severe storms near the river camp','The beetles collected near the camp were previously unknown species','Specimen labels from the expedition record dates but not locations','The expedition\'s scientists were careless in their record keeping'], a:2, e:'C is stated outright. A invents weather the notes explicitly DON\'T record; B invents novelty the notes never claim; D converts a gap in the records into a judgment about the scientists. Absence of information supports no story about it.' },
      { p:'The city\'s oldest bridge closes to vehicles during the annual footrace, when roughly twenty thousand runners cross it. Engineers inspect the deck the following week.', q:'A choice reads: "The bridge is closed to vehicles because officials fear the combined weight of runners and cars." Why must it be eliminated?', c:['The passage actually states that the bridge remains open to vehicles during the race','Twenty thousand runners could not fit on a single bridge deck','Officials are never mentioned as making decisions in the passage','The stated fact is the closure; the fear is an explanation the passage never gives'], a:3, e:'The closure is textual; the REASON offered is imported. Explanations feel supported because they make the facts tidy — but a motive the passage never states is a Could-Be-True. (The inspection detail tempts the same way: the text never says WHY engineers inspect.)' },
    ],
    R5:[
      { p:'As commercial refrigeration spread in the 1920s, home iceboxes disappeared and the ice-harvesting industry that supplied them collapsed. A few harvesters survived by selling ice for specialty uses.', q:'Which choice reverses the passage\'s causal direction?', c:['The collapse of ice harvesting forced households to adopt refrigeration','The spread of refrigeration brought down most of the ice-harvesting industry','A small number of harvesters found niche markets and survived','Home iceboxes became obsolete as refrigeration became common'], a:0, e:'The passage\'s arrow: refrigeration → iceboxes vanish → harvesting collapses. A fires the arrow backward, making the collapse the CAUSE of adoption. Every noun is faithful; only the direction lies. B, C, and D all point the way the text points.' },
      { p:'Reviewers initially praised the novel\'s experimental structure while readers found it bewildering; within a decade the positions had traded, with critics souring on the book as general audiences embraced it.', q:'Which statement matches the passage?', c:['Critics and readers agreed about the novel from its publication onward','Early critical praise later cooled as general readers came around','Readers loved the novel at first, but critics found it bewildering','The novel\'s structure was revised within a decade of its publication'], a:1, e:'C is the clean subject-swap: it hands the readers\' bewilderment to the critics and the critics\' early praise to the readers. A denies the stated disagreement; D recycles "decade" into an invented revision. B tracks both reversals of opinion in the right order.' },
      { p:'In the trial, patients who took the medication with food absorbed it more slowly, which reduced side effects; those who took it on an empty stomach absorbed it quickly and reported more nausea.', q:'Which choice quietly inverts a finding and must be eliminated?', c:['Slower absorption was associated with fewer side effects in the trial','Taking the medication with food slowed how fast patients absorbed it','Taking the medication with food sped absorption and increased nausea','Patients on an empty stomach absorbed the medication more rapidly'], a:2, e:'C flips both halves: food SLOWED absorption (not sped it) and REDUCED side effects (not increased). Topic words all match, direction is mirrored — which is why nausea-related nouns alone can\'t verify a choice.' },
      { p:'Late in a module, a student reads: "The drought reduced the reservoir, so the city imported water." She confirms that the choice "The city\'s water imports caused the reservoir to shrink" mentions the drought topic, and selects it.', q:'What failure does R5 say just happened?', c:['She read the passage too slowly and lost track of the module clock','She trusted a choice that used unfamiliar vocabulary','She should have skipped the question under the 60-second rule','She verified the topic nouns but never checked the causal direction'], a:3, e:'The choice kept every noun — imports, reservoir, city — and reversed the arrow: the drought caused the imports, not the other way round. Topic-matching feels like verification precisely when fatigue is highest; direction-checking is the fix.' },
      { p:'Because the mountain pass floods each spring, freight companies route trucks the long way through the valley from March to May; rail shipments, unaffected by the flooding, continue over the pass year-round.', q:'Which statement is faithful to the passage\'s directions?', c:['Spring flooding pushes truck traffic into the valley while trains keep using the pass','Spring flooding pushes rail traffic into the valley while trucks keep using the pass','Truck rerouting through the valley causes the pass to flood each spring','Freight companies close the valley route from March through May each year'], a:0, e:'B is A with the subjects swapped — an Opposite trap can sit one noun-swap away from the right answer, which is why the pair feels interchangeable at speed. C reverses cause and effect entirely; D relocates the closure. Trace WHO reroutes and WHAT floods.' },
    ],
    R6:[
      { p:'Cartographer Ines Vidal spent four years surveying the delta. Her 1902 map corrected the coastline, renamed forty channels, and, according to the passage, became the standard reference for river pilots because of its depth soundings.', q:'The question asks: "Why did Vidal\'s map become the pilots\' standard reference?" Which choice is true but does NOT answer it?', c:['The map\'s depth soundings made it the standard for river pilots','Vidal\'s map renamed forty of the delta\'s channels','Pilots preferred maps made by government cartographers','The map was drawn before Vidal completed her survey'], a:1, e:'B is verified by the text — the map did rename forty channels — but the stem asks WHY pilots adopted it, and the passage credits the depth soundings (that\'s A). C and D aren\'t even true. True-but-off-task is the only trap that survives a truth check.' },
      { p:'The lab\'s sourdough study fed identical flour to twelve starter cultures. Cultures kept at cooler temperatures developed more acetic acid, giving their bread a sharper tang, while warm cultures favored milder lactic acid.', q:'What explains the sharper tang in some loaves?', c:['The study used identical flour across all twelve of its cultures','Twelve separate starter cultures took part in the laboratory study','Cooler fermentation produced more acetic acid in those cultures','Warm cultures produced bread with a noticeably milder flavor'], a:2, e:'A and B are word-for-word true and completely unresponsive — they describe the setup, not the cause. D is true but explains the OTHER loaves. Only C connects the tang to its stated cause. Truth-checking alone would leave three survivors; the stem picks the one.' },
      { p:'A passage states that a violinist "practiced scales at dawn" and "premiered two concertos in Vienna." The question asks what the passage indicates about her performing career. A student verifies both facts appear in the text.', q:'Both choices built on those facts are TRUE. What breaks the tie, per R6?', c:['The choice that appears earlier in the answer list should win','The choice with the more specific and technical wording should win','The overall tone of the passage determines which answer is intended','The stem: only the premieres speak to her performing career'], a:3, e:'Dawn scales are practice habits; Vienna premieres are career events. Both true, one responsive. When two choices survive the truth check, the question — not the passage — is the tiebreaker.' },
      { p:'When the observatory\'s funding lapsed in 1954, its director kept the telescope running by renting the facility to film studios at night. Astronomers regained full use in 1961, after a university endowment absorbed the observatory.', q:'How did the observatory continue operating after 1954?', c:['Its director rented the facility to film studios for nighttime shoots','A university endowment stepped in and absorbed the observatory\'s costs','The observatory\'s funding lapsed during the middle of the 1950s','Astronomers were granted full use of the telescope once again'], a:0, e:'B is true — but it answers "how did the arrangement END," not "how did it continue after 1954." C and D are true statements about the timeline that answer nothing causal. The stem\'s time window selects A alone.' },
      { p:'Poet Halina Marsh drafted in pencil on loose index cards, shuffling them to test new stanza orders. Her editor recalled that Marsh judged a poem finished only when no shuffle improved it.', q:'What was Marsh\'s standard for calling a poem finished?', c:['She drafted every one of her poems in pencil on loose index cards','No rearrangement of the cards could improve the poem any further','Her editor kept detailed recollections of her writing process','She tested new stanza orders by shuffling her index cards'], a:1, e:'A and D are true descriptions of her METHOD; C is a true fact about the editor. The stem asks for her standard of doneness, which only B states. Method, source, and standard are three different questions — the trap bets you\'ll answer the wrong one.' },
    ],
    R7:[
      { p:'The valley grows two heirloom apples. The Rusket stores well through winter and was the region\'s traditional cider apple; the Bellflower bruises easily and is prized for fresh eating in autumn.', q:'Which choice commits a comparison fallacy?', c:['The Rusket was traditionally the valley\'s cider apple of choice','The Bellflower is valued for fresh eating in the autumn months','The Rusket sells at higher prices than the Bellflower each season','The two apples differ in storage behavior and typical use'], a:2, e:'Price is never mentioned for either apple — the ranking is imported entirely by the reader. A and B restate single-subject facts; D compares only in ways the passage itself establishes (different storage, different use). Unstated ranking = fallacy.' },
      { p:'Coach Imani Barrett\'s sprinters set four school records last season. Coach Davis\'s distance squad, meanwhile, qualified nine athletes for the state championships.', q:'Which claim does the passage support?', c:['Barrett is a more effective coach than Davis','Davis\'s training methods are more modern than Barrett\'s','Sprinters improve faster than distance runners','Each squad achieved a notable result last season'], a:3, e:'A, B, and C all rank — coaches, methods, athletes — and the passage ranks nothing: it lists one accomplishment per squad. D declines the invitation to compare. Records and qualifications aren\'t even the same unit; no ranking is computable.' },
      { p:'A profile praises a 1920s aviator for "surveying routes with unmatched precision" and a 1930s aviator for "flying rescue missions in open cockpits through polar storms."', q:'A choice calls the second aviator "the more skilled pilot." What makes the choice wrong?', c:['The passage praises different qualities without ranking the two pilots','Skill and daring are synonyms, making the comparison circular','Aviators who flew in different decades can never be meaningfully compared','The passage clearly favors the 1920s aviator\'s precision instead'], a:0, e:'Two different virtues, two different eras, zero comparing sentences — any ranking is reader-supplied. C overcorrects into an invented rule, and D invents a preference. The text praises both and ranks neither; the fallacy is the ranking itself.' },
      { p:'The library\'s manuscript wing holds 4,000 medieval documents and receives specialist researchers by appointment. Its map room, open to the public, logged 60,000 visitors last year.', q:'Which choice stays inside what the passage states?', c:['The map room is the library\'s most beloved and most treasured collection','Access rules differed: public map room, appointment-only manuscript wing','The manuscript wing\'s holdings are far more valuable than the map room\'s maps','The library clearly prioritizes casual visitors over its serious researchers'], a:1, e:'A, C, and D each import a ranking (affection, value, priority) from facts that don\'t state one. The correct choice reports the two access arrangements exactly as given. Numbers sitting side by side are still not a comparison until the text makes one.' },
      { p:'Two murals flank the station hall. The east mural, restored in 2015, depicts the city\'s shipbuilders; the west mural, still awaiting restoration, shows its market women beneath decades of varnish.', q:'Which choice would require a comparing sentence the passage does not contain?', c:['The west mural still sits beneath decades of darkened varnish','The east mural underwent restoration nine years before this account','The east mural is the more historically important of the two','The two murals face each other across the station hall'], a:2, e:'Importance is never assessed for either mural — restoration dates and subjects don\'t rank significance. A, B, and D restate given facts; importance is a ranking only a comparing sentence could license, and there isn\'t one.' },
    ],
    R8:[
      { p:'In taste tests at three farmers\' markets in Oregon, a majority of the 90 participants preferred the new pear variety to the state\'s current bestseller.', q:'Which conclusion stays within the evidence?', c:['American consumers prefer the new pear to established varieties','The new pear will soon outsell the current bestselling variety','Most fruit shoppers in the Pacific Northwest favor the new pear','Most of the tested Oregon participants preferred the new pear'], a:3, e:'Ninety people at three Oregon markets license exactly D. A stretches to a nation, C to a region, and B converts a taste preference into a sales forecast — three different directions of scope creep from one small sample.' },
      { p:'A two-week trial found that the reformulated adhesive held ceramic tiles to concrete in indoor conditions, retaining full strength through daily temperature cycling between 15 and 30 degrees Celsius.', q:'Which claim does the trial actually support?', c:['The adhesive held tiles to indoor concrete across the tested range','The adhesive performs just as reliably outdoors in freezing winter conditions','The adhesive bonds any building material to any other permanently','Two weeks of testing guarantees decades of adhesive performance'], a:0, e:'The claim must wear the trial\'s boundaries: indoor, tiles-to-concrete, 15–30°C, two weeks. B exits the temperature and setting limits; C exits the materials; D stretches two weeks into decades. The right answer sounds cautious because the evidence is.' },
      { p:'A report reads: "Among the 60 kitchens we audited, most reduced food waste after switching to smaller serving trays." A practice question asks what can be concluded, and one tempting choice reads: "Smaller trays reduce food waste in kitchens generally."', q:'Why is the fussy choice — "most of the audited kitchens reduced waste" — credited instead of the tempting one?', c:['Test writers reward compact restatements over sweeping ones by policy','Its qualifiers mirror the evidence, claiming only what was measured','Longer, more detailed answer choices are statistically favored','Cautious wording signals politeness, which academic tests prefer'], a:1, e:'"In kitchens generally" stretches sixty audited kitchens into all kitchens everywhere — the scope trap verbatim. The fussy choice\'s hedges are load-bearing: "audited," "most," "kitchens" fence the claim inside the sample. Fussy is what supported looks like.' },
      { p:'Census records from the mill town show that between 1890 and 1900, most new households were headed by workers born in the surrounding county.', q:'A choice concludes: "American mill towns of the nineteenth century drew their workforce locally." Name the scope stretch.', c:['It shrinks the claim, since the records actually cover more towns than stated','It stretches the time frame but keeps the geography accurate','One town and one decade have been stretched into all towns and a century','The choice is within scope, since the town was typical of its era'], a:2, e:'Two stretches at once: geographic (one mill town → American mill towns) and temporal (one decade → the century). D smuggles in "typical," an assumption the records don\'t establish. Scope errors compound quietly — count each dimension separately.' },
      { p:'Interviews with 14 retired air-traffic controllers found that most had developed personal memory routines for handling simultaneous radio calls.', q:'Which choice respects the scope of this evidence?', c:['Air-traffic controllers everywhere rely on personal memory routines','Memory routines are essential to careers in aviation generally','The interviews prove that controller training neglects memory skills','Most of the fourteen interviewed controllers described such routines'], a:3, e:'Fourteen retirees license a claim about those fourteen. A universalizes, B drifts to a different population (aviation careers), and C converts a personal-habit finding into an institutional critique no one measured. The plain restatement is the only fit.' },
    ],
    R9:[
      { p:'Ceramicist Nora Vasquez abandoned her signature porcelain glazes after a kiln accident destroyed a year of work. She rebuilt her practice around unglazed stoneware, explaining that the accident had shown her how much of her art depended on effects she could not control, and that she wanted a medium where the hand, not the fire, determined the result.', q:'Why did Vasquez switch to unglazed stoneware?', c:['She wanted the hand, not the fire, to determine each piece\'s result','She could no longer afford to replace the porcelain pieces lost in the accident','Collectors had begun to prefer stoneware work to her signature porcelain glazes','She feared that another kiln accident would destroy what remained of her work'], a:0, e:'The motive is quoted: the accident showed her how much depended on "effects she could not control," so she chose a medium where "the hand, not the fire, determined the result." B, C, and D are humanly plausible motives (money, market, fear) the passage never states — motive costumes on Could-Be-True traps.' },
      { p:'For thirty years, linguist Amadou Sy compiled his dictionary of Pulaar from written sources alone. Late in the project he began recording market conversations in six towns, noting that written Pulaar preserved formal registers while the spoken language was innovating faster than print could capture.', q:'What prompted Sy to add the market recordings?', c:['His written sources had been exhausted after thirty years of compilation','Spoken Pulaar was changing faster than written sources could document','Publishers requested audio material to accompany the dictionary','He wanted the dictionary to focus on formal registers of Pulaar'], a:1, e:'The stated reason: written Pulaar preserved formal registers "while the spoken language was innovating faster than print could capture." A invents exhaustion, C invents publishers, D reverses his aim — he already HAD the formal registers. The answer was sitting in the "noting that" clause.' },
      { p:'Bridge engineer Rosa Alvarez insisted on hand-measuring the 1911 span before certifying its renovation, though laser surveys were available. Colleagues pressed her on the delay; she replied that the original builders had left no drawings, and the bridge\'s actual geometry, not any idealized model, would carry the load.', q:'According to the passage, why did Alvarez measure by hand?', c:['She distrusted the accuracy of modern laser surveying equipment','Her team lacked the training to operate laser survey instruments','With no original drawings, only the real geometry could be trusted','Hand measurement was a professional tradition she felt renovations should honor'], a:2, e:'Her stated reply: no drawings exist, and "the bridge\'s actual geometry, not any idealized model, would carry the load." A converts her reasoning into distrust of lasers (never said); B and D invent competence and sentiment. Retrieve the reply; don\'t improvise a psychology.' },
      { p:'Publisher Edith Okonjo printed her magazine\'s poetry section on cheaper paper than its essays. Rivals called it disrespect; Okonjo countered that the rough stock let her print double the poems for the same cost, and that a poet reached was worth more than a poem framed.', q:'Why did Okonjo choose the cheaper paper?', c:['She privately valued the magazine\'s essays above its poetry','Rough paper was the only stock her printers could reliably source','She believed poems looked better against unfinished textures','It let her publish twice as many poems for the same money'], a:3, e:'Her stated motive: rough stock meant "double the poems for the same cost." A repeats the rivals\' accusation the passage has her rebut; B and C invent supply problems and aesthetics. When a passage stages an accusation and a reply, motive questions are answered from the reply.' },
      { p:'A profile recounts that a botanist left a tenured post to catalog roadside weeds, "a move colleagues found baffling." The profile quotes her: "Weeds are the only flora evolving fast enough to watch." A practice question asks why she left, and a student reasons: "Tenure is stressful; she probably wanted freedom."', q:'What does the Find the Motive Method say about the student\'s reasoning?', c:['It supplies an empathy-based motive instead of retrieving the stated one','It correctly infers the motive, since the quoted explanation is ambiguous','It fails only because stress and freedom are the same motive','It should have cited the colleagues\' bafflement as the motive'], a:0, e:'The motive is on the page: weeds evolve "fast enough to watch." The student\'s theory (stress, freedom) is humanly reasonable and textually absent — exactly the gap this method closes. Colleagues\' bafflement is a reaction, not a reason.' },
    ],
    R10:[
      { p:'The 1902 eruption of Mount Pelée destroyed the city of Saint-Pierre within minutes. Among the handful of survivors was Ludger Sylbaris, a prisoner protected by the thick stone walls of his solitary-confinement cell. He later toured with a circus, billed as "the man who lived through doomsday."', q:'According to the passage, why did Sylbaris survive the eruption?', c:['He had been evacuated from Saint-Pierre before the eruption began','His solitary-confinement cell\'s thick stone walls protected him','He was touring with a circus when the volcano finally erupted','He sheltered in the harbor, away from the path of the blast'], a:1, e:'Anchor to the stem\'s rarest word: "Sylbaris." The hit sentence says he was "protected by the thick stone walls of his solitary-confinement cell." C recycles the circus detail from AFTER his survival — a fact from the wrong sentence. A and D invent escapes the passage never mentions.' },
      { p:'Weaver Sena Abbey\'s indigo cloth owed its depth to a triple-dye process: yarns were dyed before weaving, the finished cloth was dyed again, and a final dip followed the first washing. Buyers, the passage notes, could identify her work by the way the color deepened rather than faded with age.', q:'How could buyers recognize Abbey\'s cloth?', c:['By the number of visible dye layers in the weave','By her mark woven into the corner of each finished piece','Its color deepened with age instead of fading','By the distinctive smell of the indigo she used'], a:2, e:'Anchor to "buyers" — one hit: buyers "could identify her work by the way the color deepened rather than faded with age." A sounds technical and recycles "dye," but layer-counting is never mentioned; B and D invent marks and smells. One scan, one sentence, done.' },
      { p:'The survey vessel Meridian mapped the trench in 1958 using echo soundings taken every two miles. Modern multibeam sonar later revealed that the Meridian\'s depth figures were accurate, but that its charted position for the trench axis was off by nearly three miles — an error traced to celestial navigation drift on cloudy nights.', q:'What caused the error in the Meridian\'s charted trench position?', c:['Echo soundings taken at intervals spaced too widely apart to be reliable','Depth figures that later sonar proved to be inaccurate','Damage to the vessel\'s sounding equipment in rough seas','Celestial navigation drifting during stretches of cloudy nights'], a:3, e:'Anchor to "error" — the passage traces it "to celestial navigation drift on cloudy nights." A recycles the two-mile detail into a different flaw; B reverses the finding (the depths were accurate); C is invented. The anchored sentence answers in its own words.' },
      { p:'Botanical illustrator Marianne Vogel worked from pressed specimens for her first atlas, then from live plants under glass for the second. Reviewers of the second atlas praised details her earlier plates had missed: the droop of a stem at dusk, petals half-closed in rain.', q:'What did reviewers praise in Vogel\'s second atlas?', c:['Lifelike details, such as drooping stems, that the first atlas lacked','The technical precision of the plates she drew from pressed specimens','Her decision to publish the atlas in an affordable format','The glass conservatory she built to house her live specimens'], a:0, e:'Anchor to "reviewers" (or "praised"): they praised "details her earlier plates had missed," with examples given. B attaches praise to the first atlas\'s method — right nouns, wrong referent, a recycled trap caught by reading the anchored sentence. C and D are unmentioned.' },
      { p:'A passage on harbor trade mentions tariffs in five different sentences. A question asks: "According to the passage, when did the harbor\'s tariff on salt end?" A student anchors on the word "tariff" and finds too many hits to scan quickly.', q:'What does Keyword Anchoring say the student should have done?', c:['Read all five of the tariff sentences in order until one of them mentions an ending','Anchor on the stem\'s rarer, more specific words: "salt" or the ending itself','Abandon anchoring and re-read the passage from its first line','Anchor on "harbor," since the passage is about harbor trade'], a:1, e:'Anchor quality is specificity: "tariff" hits five times, "salt" likely once. The rarest stem word lands your scan on the one sentence that matters. "Harbor" is even more common than "tariff" — anchoring on it is a full re-read in disguise.' },
    ],
    R11:[
      { p:'[P1] For a century, textbooks described the giant squid from carcasses washed ashore. [P2] In 2004, researchers photographed a living giant squid hunting at depth, revealing behavior the carcasses could never show: active pursuit, rapid color change, coordinated arm strikes. [P3] Some marine biologists caution, however, that a single filmed encounter cannot establish what is typical for the species.', q:'What is the function of paragraph 3?', c:['To summarize the century of carcass-based squid research','To describe the 2004 photographs in greater detail','To qualify the significance of the new evidence','To argue that the 2004 photographs were fabricated'], a:2, e:'Label as you read: P1 = old evidence base, P2 = new evidence and what it revealed, P3 = "however" + caution = limits the new evidence\'s reach. That\'s a qualification — not a summary (A describes P1\'s job), not elaboration (B is P2\'s job), and caution is not an accusation (D).' },
      { p:'[P1] Community land trusts keep housing affordable by owning the ground beneath homes and leasing it to residents. [P2] Critics argue that trusts trade away wealth-building: owners who sell receive only part of any price appreciation. [P3] Trust advocates respond that capped appreciation is the very mechanism that keeps the next family\'s purchase affordable.', q:'Paragraph 3 functions primarily to...', c:['introduce a new criticism of community land trusts','explain the leasing mechanics described in paragraph 1','concede that the critics\' argument is correct','answer the criticism by reframing its central fact'], a:3, e:'P1 = define the model, P2 = criticism, P3 = advocates "respond" — a rebuttal that reframes capped appreciation as the feature, not the flaw. It doesn\'t concede (C) or add criticism (A); the mechanics job belonged to P1 (B).' },
      { p:'[P1] The city\'s streetcars vanished in 1953, and for decades the removal was blamed on simple market failure. [P2] Recently opened municipal archives complicate that story: internal memos show officials had already planned the system\'s replacement years before ridership fell. [P3] Historians now read the ridership decline as a consequence of disinvestment rather than its cause.', q:'What role does paragraph 2 play in the passage?', c:['It presents new evidence that complicates the accepted explanation','It defends the older market-failure account against modern critics','It narrates the day-to-day experience of streetcar riders','It proposes restoring the streetcar system the city removed'], a:0, e:'P1 = old explanation, P2 = "archives complicate that story" plus the memo evidence, P3 = the revised reading. P2\'s function is evidential disruption. B reverses its allegiance; C and D describe content that never appears.' },
      { p:'[P1] Migration scientists long assumed songbirds crossed the gulf in single overnight flights. [P2] Radio-tag data from 2019 recorded dozens of birds pausing on offshore oil platforms, sometimes for days. [P3] The pauses correlated with headwinds, suggesting the birds treat the crossing as conditional, not fixed. [P4] Funding for longer-term tagging studies remains uncertain.', q:'Which label best fits paragraph 4?', c:['A conclusion that draws together all of the study\'s findings so far','A note on the research\'s uncertain future, apart from the findings','A counterargument against the radio-tag evidence','An example illustrating the headwind correlation'], a:1, e:'P4 pivots from what the data showed to whether more data will exist — administrative, not evidentiary. It concludes nothing about the findings (A), disputes nothing (C), illustrates nothing (D). Labels expose the pivot instantly.' },
      { p:'A four-paragraph passage argues that a desalination plant helped a drought-struck city. A student labels it: P1 "problem," P2 "solution described," P3 "costs acknowledged," P4 "verdict: worth it." The test then asks the function of paragraph 3.', q:'How do the labels answer the question before the choices are read?', c:['They show P3 concedes drawbacks inside an argument that still endorses','They show that P3 is where the passage\'s central argument gets stated','They prove the passage is neutral about the desalination plant','They show P3 introduces the drought that caused the problem'], a:0, e:'The label "costs acknowledged" IS the function: a concession paragraph inside a pro-plant argument. Prediction complete before persuasion begins — the choices only get to match or lose. That\'s the labeling payoff: structure questions become lookups.' },
    ],
    R12:[
      { p:'Food historians credit the shipping container with changing what the world eats more than any single recipe: refrigerated containers made mangoes ordinary in Minnesota and salmon routine in Madrid. Yet the same system homogenized harvests, as growers worldwide converged on the few varieties that travel well.', q:'Which headline best captures the passage?', c:['Minnesota grocery shoppers discover the joys of the tropical mango','How refrigerated shipping containers are built and cooled','World cuisine owes absolutely everything to the container','Shipping containers made diets global but narrowed harvests'], a:3, e:'A headline must cover BOTH movements: diets went global AND harvests narrowed. A is one example (too narrow); B is scenery (never discussed); C is the passage\'s claim inflated to "everything" (too broad, extreme). D holds the tension — the mark of a main idea.' },
      { p:'The violin\'s supremacy in Western orchestras was not inevitable. Through the 1600s the viol family dominated courtly music; violins were tavern instruments, loud and unrefined. Opera changed the hierarchy: composers needed sound that could fill theaters and carry above crowds, and the violin\'s penetrating voice, once a defect, became the standard.', q:'Write your one-line headline, then pick the choice that matches it.', c:['How opera turned the "unrefined" violin into the orchestral standard','A complete history of the viol family\'s dominance in courtly music','Why taverns preferred louder instruments than courts did','Opera composers\' search for singers who could fill theaters'], a:0, e:'Headline: "Opera\'s needs flipped the violin from tavern voice to standard." A matches scope and cause. B freezes the story at its starting point; C is a side detail; D swaps instruments for singers — the theaters needed VIOLINS heard, not vocalists found.' },
      { p:'Antarctic research stations once buried their waste in ice pits, assuming the continent\'s vastness made the practice harmless. Ice cores now show station debris migrating through glaciers toward the sea. Current treaties require every station to ship its waste back out — a logistical burden that has itself reshaped station design, favoring smaller, modular bases.', q:'Which choice matches the scope of a good headline for this passage?', c:['Ice cores reveal how glaciers carry station debris toward the Antarctic coast','How waste rules reshaped Antarctic stations, from ice pits to modular bases','The Antarctic treaty system and its enforcement mechanisms','Why the continent\'s vastness makes waste burial harmless'], a:1, e:'The passage travels: burial practice → evidence of harm → shipping rules → design consequences. B spans the journey. A is one middle stop (too narrow); C drifts to enforcement (never covered); D repeats the debunked assumption as if endorsed (distortion).' },
      { p:'Studio photography arrived in West African cities in the 1880s, and local photographers immediately bent the technology to local purposes: portrait sittings became occasions for staging status, fashion, and family ties, with props and backdrops chosen by the sitters themselves. Historians now read these portraits less as records of appearance than as arguments — statements of who the sitters intended to be.', q:'Your headline first. Which choice matches it?', c:['A catalog of the props used in nineteenth-century West African studios','European photography\'s unaltered arrival in West Africa','West African portrait sitters used photography to author their own image','How modern historians authenticate photographs from the nineteenth century'], a:2, e:'Headline: "Sitters turned studio portraits into self-authored statements." C matches. A mistakes an example for the subject; B reverses the passage ("bent to local purposes" is the opposite of unaltered); D drifts to a methodology never discussed.' },
      { p:'A passage spends one paragraph on a lighthouse keeper\'s daily log, then argues that such logs, kept by thousands of keepers, form an accidental climate archive scientists now mine for storm data. A student\'s headline: "One keeper\'s meticulous daily log."', q:'What does the Headline Test reveal about the student\'s headline?', c:['It is accurate, since the log anchors the whole passage','It is too broad, claiming more than the passage supports','It mistakes the opening example for the passage\'s subject','It correctly predicts the author\'s final conclusion'], a:2, e:'The passage\'s subject is the ARCHIVE — thousands of logs as climate data — introduced through one example. The student headlined the doorway instead of the building: the too-narrow failure the test exists to catch. Re-headline: "Keepers\' logs became an accidental climate archive."' },
    ],
    R13:[
      { p:'The committee\'s report concluded that the reservoir\'s diminished capacity was attributable less to the drought itself than to decades of deferred dredging, which had permitted sediment to accumulate unchecked.', q:'Which is the most faithful plain-language paraphrase?', c:['Decades of sediment buildup, more than drought, shrank the reservoir','The drought lowered the reservoir far more than anyone had expected it to','Regular dredging would have prevented the drought from occurring','The committee blamed the reservoir\'s problems entirely on the drought'], a:0, e:'"Attributable less to X than to Y" means Y mattered more than X. The paraphrase must keep that ranking: sediment over drought. B keeps the drought as the star (reversed emphasis); C turns dredging into weather control — nonsense the dense wording can hide; D flips the finding outright.' },
      { p:'While conceding that the tax produced the projected revenue, the auditors observed that compliance costs fell disproportionately upon the smallest firms, an asymmetry the statute\'s drafters appear not to have anticipated.', q:'Paraphrase first. Which choice matches your plain-language version?', c:['The tax failed to raise anything close to the revenue its drafters projected','The tax raised the expected money, but small firms bore outsized costs','Auditors found the smallest firms evaded the new tax','Lawmakers anticipated that small firms would bear most costs'], a:1, e:'Translate: revenue came in as planned; small businesses paid unfairly high compliance costs; drafters didn\'t see it coming. A contradicts the concession; C converts costs into evasion; D reverses the drafters\' blindness. B keeps all three moving parts.' },
      { p:'The biographer resists the temptation to read the composer\'s late austerity as renunciation, suggesting instead that the sparse final works represent not a rejection of ornament but its distillation — ornament reduced to the single gestures that mattered.', q:'Which restatement preserves the biographer\'s claim?', c:['The composer\'s late works renounced the use of ornament entirely','The biographer finds the final works cluttered with ornament','The late sparseness refined ornament to essentials, not rejected it','The biographer suspects that the final works were simply left unfinished'], a:2, e:'"Not a rejection of ornament but its distillation" — the claim hinges on that distinction. A is precisely the reading the biographer resists (the trap for anyone who skipped paraphrasing); B inverts sparse; D invents an unfinished state.' },
      { p:'Municipal archives, the historian argues, flatter their creators: what governments chose to record reflects what they wished remembered, and the gaps — unlogged evictions, unminuted meetings — often mark precisely where power preferred not to look at itself.', q:'Your paraphrase, then the match:', c:['Archives faithfully preserve everything governments did, including failures','Historians should trust archives over other kinds of sources','Archival gaps occur randomly and carry no particular meaning','Records show what power wanted remembered; gaps mark what it hid'], a:3, e:'Plain version: governments recorded what made them look good; the missing records are evidence too. A reverses the thesis; B draws a moral the historian would reject; C erases the argument\'s point — the gaps are meaningFUL. D keeps both halves of the claim.' },
      { p:'A student hits this sentence: "Notwithstanding the manufactory\'s celebrated output, its ledgers disclose a persistent indebtedness that contemporaries, dazzled by production figures, largely declined to scrutinize." She reads the four choices immediately and finds three of them plausible.', q:'What step did she skip, and what would it have given her?', c:['Keyword anchoring, which would have located this sentence within the passage','Paraphrasing first: "famous factory, quietly in debt, nobody looked"','Reading the choices twice, which would have revealed the traps','Checking the sentence\'s date before evaluating any choices'], a:1, e:'Three-plausible-choices is the signature of unparaphrased density: with no standard of your own, every polished distractor competes. The plain version — famous factory, hidden debt, admirers didn\'t check — turns the same four choices into one match and three drifts.' },
    ],
    G1:[
      { p:null, q:'The trail guide warned us to pack extra water, to start before dawn, and [BLANK] the summit ridge by noon.', c:['to clear','clearing','having cleared','we should clear'], a:0, e:'The sentence\'s pattern: "to pack… to start… and ___." This list keeps its "to" on every item, so the blank wants another full infinitive: "to clear." The other choices break the established shape — no rule name required, just the echo of the first two items.' },
      { p:null, q:'The director reserved the final decision for my co-producer and [BLANK], since we had financed the project together.', c:['I','me','myself','we'], a:1, e:'Test the pattern by dropping the other person: "reserved the final decision for ___" — for ME. "For my co-producer and I" survives only while the pair hides the pattern; alone, "for I" is instantly wrong. "Myself" needs an earlier "I" to reflect; "we" abandons the object position.' },
      { p:null, q:'The renovation was praised not only for restoring the theater\'s facade [BLANK] for reviving the whole block around it.', c:['and also','as well','but also','and even'], a:2, e:'"Not only" opens a two-part frame that English closes one way: "not only X but also Y." You don\'t need the term "correlative conjunction" — the opener creates an expectation your ear already knows how to close. The other choices leave the frame hanging.' },
      { p:null, q:'Critics found the sequel\'s plot thinner than the original\'s, its pacing slower, and its dialogue [BLANK].', c:['flat in comparison to it','lacking by comparison','it was flatter','flatter'], a:3, e:'The sentence sets a drumbeat: "plot thinner… pacing slower… dialogue ___." Two comparative adjectives establish the pattern; "flatter" completes it. The longer choices restate the comparison the frame already carries, and "it was flatter" breaks the list with a new clause.' },
      { p:'A student reads: "The manual explains how to calibrate the sensor, how to log the readings, and the process of exporting the data." She is sure something is wrong but can\'t name the rule, so she leaves it unchanged.', q:'What does Pattern Recognition say she should have done?', c:['Trust her ear: "how to… how to… the process of" breaks the sentence\'s own pattern','Leave the sentence unchanged, because a correction requires knowing the rule\'s proper name','Check first whether "process" is spelled correctly before changing anything else','Rewrite the entire sentence from scratch so the construction never comes up'], a:0, e:'The mismatch she heard IS the answer: the list established "how to + verb" twice, then broke its own shape. Fixing it ("how to export the data") requires zero terminology. The rule name was never the missing piece — permission to trust the pattern was.' },
    ],
    G2:[
      { p:null, q:'The committee will meet [BLANK] to review the budget before the fiscal year closes.', c:['on a biweekly basis of scheduling','biweekly','at intervals of a biweekly nature','on a schedule that repeats biweekly'], a:1, e:'"Biweekly" is an adverb that does the entire job. The other choices wrap it in scaffolding — "basis," "intervals," "schedule" — that adds syllables and zero facts. Shortest clean choice wins.' },
      { p:null, q:'Volunteers cleared the trail [BLANK] the storm had littered it with branches.', c:['due to the fact that','in view of the fact that','because','owing to the circumstance that'], a:2, e:'"Because" replaces every one of these fact-that constructions with no loss. "Due to the fact that" and its cousins are the SAT\'s favorite inflation targets — prepositional scaffolding around an idea one word states.' },
      { p:null, q:'The museum\'s new wing, [BLANK], opens to the public in March.', c:['which is hexagonal in its shape','hexagonal in shape and form','which has a shape that is hexagonal','which is hexagonal'], a:3, e:'"Hexagonal" already means the shape — "in its shape," "in shape and form," and "has a shape that is" all restate the category the adjective carries. "Which is hexagonal" keeps the needed clause and drops the padding.' },
      { p:null, q:'Researchers [BLANK] the samples before freezing them for transport.', c:['labeled','affixed labels onto','put labels on each one of','attached identifying labels to'], a:0, e:'The verb "labeled" contains the whole action. The other choices unpack it into verb-plus-noun constructions that re-spend the same meaning. Note the survival test still ran: "labeled" is grammatical and loses nothing, so shortest wins.' },
      { p:'A student faces four choices: "annually," "each and every year," "on an annual basis," and "yearly, every twelve months." She picks "each and every year" because it sounds emphatic.', q:'What does the Shortest Answer Rule say went wrong?', c:['Nothing at all, since emphasis is a legitimate reason to add words on the SAT','Emphasis is inflation: "each and every" doubles what one word carries','She should have picked the longest choice for its completeness','The rule failed because two choices were nearly the same length'], a:1, e:'"Each and every" is a synonym stack, "on an annual basis" is scaffolding, and "yearly, every twelve months" says it twice. "Annually" survives the grammar check and carries the full meaning. Emphatic-sounding is how inflation markets itself.' },
    ],
    G3:[
      { p:null, q:'The orchard lost half its blossoms to a late frost. [BLANK], the fall harvest broke the farm\'s ten-year record.', c:['Consequently','For example','Nevertheless','In other words'], a:2, e:'Frost damage sets an expectation of a poor harvest; a record harvest defies it. Contrast family: "Nevertheless." "Consequently" would claim the frost caused the record; "for example" and "in other words" declare illustration and restatement that aren\'t there.' },
      { p:null, q:'Cuttlefish can mimic the texture of coral as well as its color. [BLANK], researchers have filmed them imitating the sway of drifting algae.', c:['By contrast','As a result','Instead','Moreover'], a:3, e:'The second sentence adds another mimicry feat to the first — same direction, more evidence. Continuation family: "Moreover." Nothing is contrasted, caused, or replaced; the distractors all declare relationships the ideas don\'t have.' },
      { p:null, q:'The bridge\'s cables were engineered with triple the required strength. [BLANK], inspectors closed it within a decade: corrosion, not load, was the threat no one modeled.', c:['Even so','Accordingly','Similarly','For instance'], a:0, e:'Triple-strength cables set the expectation of a long life; early closure defies it. Concession/contrast: "Even so." "Accordingly" would make the closure a result of the strength; "similarly" and "for instance" declare continuation and illustration that never happen.' },
      { p:null, q:'Some deep-sea fish generate their own light. [BLANK], the anglerfish dangles a glowing lure that draws prey within striking range.', c:['However','For instance','Therefore','Meanwhile'], a:1, e:'The anglerfish is a specific case of the general claim before the blank — illustration family: "For instance." No contrast (however), no causation (therefore), and "meanwhile" implies parallel timing, not exemplification.' },
      { p:'A student reads: "The dam raised water levels. [BLANK], several riverside villages relocated." She tries each choice in the blank and picks "However" because the sentence sounds polished with it.', q:'What does the Transition Logic Map say about her method?', c:['It worked well: sound is the fastest reliable test for transition words','Her answer happens to be correct, but she should have checked the punctuation too','Sound-testing invites traps; she never named the cause-then-relocation link','It failed only because she tested the four choices in the wrong order'], a:2, e:'Rising water CAUSED the relocations — the blank wants the cause family ("Consequently"), and "However" reverses the logic while sounding perfectly fluent. That fluency is the trap\'s design. Name the relationship first; then vocabulary is just labeling.' },
    ],
    G4:[
      { p:null, q:'"The tide pools teem with life at dawn[BLANK]by midday the herons have picked them nearly clean." Which version marks the boundary correctly?', c:['dawn, by midday','dawn, however by midday','dawn: by midday','dawn; by midday'], a:3, e:'Complete sentences sit on both sides, so the legal joins are a period, a semicolon, or a comma with a true joining word. The bare comma is a splice; "however" is not a joining word, so that comma splice remains; the colon promises an explanation the second clause doesn\'t deliver. The semicolon is built for exactly this pair.' },
      { p:null, q:'"Marisol\'s toolkit held everything she trusted on a climb[BLANK]a worn harness, three cams, and the carabiner her father had carried." Which version is correct?', c:['climb: a worn harness','climb; a worn harness','climb, a worn harness','climb a worn harness'], a:0, e:'The left side is a complete sentence that promises contents ("everything she trusted"); what follows is the list delivering them. That\'s the colon\'s exact job. The semicolon demands a second full sentence; the bare comma blurs the setup; no punctuation at all runs promise and payoff together.' },
      { p:null, q:'"The observatory\'s dome[BLANK]built in 1911 and never motorized[BLANK]still turns on a hand-cranked gear." Which version punctuates the aside correctly?', c:['dome, built in 1911 and never motorized still','dome, built in 1911 and never motorized, still','dome built in 1911, and never motorized, still','dome, built, in 1911 and never motorized still'], a:1, e:'The phrase "built in 1911 and never motorized" is removable background — lift it out and the sentence still stands. Removable asides take TWIN commas, one at each end. Two choices strand a single comma; another fences the wrong span, splitting the aside in half.' },
      { p:null, q:'"Two rivers meet beneath the city[BLANK]only one of them appears on the oldest maps." Which version joins the thoughts correctly?', c:['city, only','city only','city; only','city, however only'], a:2, e:'"Two rivers meet beneath the city" and "only one appears on the oldest maps" are both complete sentences. Comma alone: splice. No mark: run-on. "However" with just a comma: still a splice. The semicolon joins the two clean — the tree\'s first branch settles it.' },
      { p:'A student sees choices differing only in punctuation and picks the comma "because commas are usually safe." The sentence joins two complete thoughts.', q:'What does the Decision Tree say about her reasoning?', c:['Commas are statistically the best default on punctuation items','Her instinct was on track, but she should have read all the choices aloud first','The comma was correct here since both thoughts share one topic','Between complete sentences a bare comma is the splice, a favorite planted trap'], a:3, e:'The tree\'s first question — complete sentences on both sides? — was the whole item. Yes means comma-alone is automatically wrong, no matter how safe it looks. Comfort with commas is exactly what the splice distractor is engineered to exploit.' },
    ],
    G5:[
      { p:null, q:'The stack of unread proposals on the director\'s desk [BLANK] taller every week.', c:['grows','grow','are growing','have grown'], a:0, e:'Cross out "of unread proposals on the director\'s desk." What remains: "The stack ___ taller." Stack is singular: grows. The plural decoy ("proposals") sits closest to the blank on purpose.' },
      { p:null, q:'The flavor of the heirloom tomatoes, even after weeks in cold storage, [BLANK] shoppers back to the stall.', c:['draw','draws','are drawing','were drawing'], a:1, e:'Strip "of the heirloom tomatoes, even after weeks in cold storage" — two layers of interference, one prepositional, one parenthetical. "The flavor ___ shoppers back": singular, draws. Both decoys ("tomatoes," "weeks") are plural by design.' },
      { p:null, q:'The senators, along with the committee\'s chairman, [BLANK] to release the report before the recess.', c:['intends','was intending','intend','has intended'], a:2, e:'"Along with the committee\'s chairman" reads like it adds a person, but grammatically it\'s an aside — cross it out. "The senators ___ to release": plural, intend. This trap runs in reverse: a singular decoy planted against a plural subject.' },
      { p:null, q:'Neither of the two winning designs [BLANK] the original budget\'s constraints.', c:['were respecting','have respected','are within','respects'], a:3, e:'"Of the two winning designs" crosses out, leaving "Neither ___ the constraints." "Neither" alone is singular — it means "not either one." The plural pull comes from "designs," which is exactly the decoy the crossing-out removes.' },
      { p:'A student reads: "The list of approved contractors were posted on the city\'s website." It sounds acceptable to her, and she moves on without marking an error.', q:'What did Subject-Verb Isolation exist to catch here?', c:['Proximity: "were" matched "contractors," but "the list were posted" fails','Nothing needed catching; "were" is correct because the contractors are plural','The true error is the verb "posted," which should read as "posting" instead','A missing comma after the word "contractors" that conceals the real problem'], a:0, e:'"Sounds acceptable" is proximity agreement doing its work: the ear heard "contractors were" and approved. Isolation removes the decoy — "The list… was posted" — and the error that hid in the middle of the sentence has nowhere left to stand.' },
    ],
    G6:[
      { p:null, q:'When the curators unpacked the sculptures, [BLANK] were photographed against a neutral backdrop before any cleaning began.', c:['they','the sculptures','the museum curators','it'], a:1, e:'"They" has two plural candidates — curators and sculptures — so the arrow is broken. "It" fails on number. "The museum curators" is specific but wrong: the sentence means the unpacked objects got photographed before cleaning, not the staff. "The sculptures" lands the pointer on one noun.' },
      { p:null, q:'The committee announced [BLANK] decision after a week of deliberation.', c:['their','they\'re','its','it\'s'], a:2, e:'A committee is one body: singular. "Its decision" matches. "Their" points plural at a singular noun; "they\'re" and "it\'s" are contractions — "they are" and "it is" — not possessives at all. Two failure modes, one clean pointer.' },
      { p:null, q:'The gallery placed the paintings beside the tapestries so that visitors could compare [BLANK] more easily.', c:['them','this','the gallery visitors','the two collections'], a:3, e:'"Them" could point at paintings, tapestries, or both — three arrows from one pronoun. "This" is singular and points nowhere. "The gallery visitors" is specific but says the visitors get compared. "The two collections" names exactly what the comparison involves: pointer replaced, ambiguity gone.' },
      { p:null, q:'The orchard\'s new irrigation system cut water use, and neighboring farms soon installed systems of [BLANK] own.', c:['their','its','it\'s','his or her'], a:0, e:'Arrow test: whose own? "Neighboring farms" — plural — so "their." "Its" would point back at the single system; "it\'s" is a contraction, not a possessive; "his or her" needs human antecedents. Match the pointer to its noun in both number and kind.' },
      { p:'A student reads: "After the merger, the startup\'s founders met with the investors to discuss how they would divide the board seats." She decides "they" is fine because "obviously it means everyone involved."', q:'Why does the Antecedent Hunt reject her reasoning?', c:['Pronouns may never refer to entire groups of people on the digital SAT','The standard is one target; "they" can grab founders, investors, or both','"They" is automatically wrong whenever a sentence involves board seats','Her reading fails only because mergers involve companies rather than people'], a:1, e:'"Obviously everyone" is story-sense resolving what grammar leaves open — and three readings (founders / investors / both) are grammatically live. A pronoun with multiple possible targets is broken even when context suggests a favorite. The fix names the parties.' },
    ],
    G7:[
      { p:null, q:'By the time the fire crews reached the ridge, the wind [BLANK] direction twice.', c:['changes','has changed','had changed','will have changed'], a:2, e:'Anchor: "By the time the crews reached" — a completed past event. Action finished BEFORE another past event takes past perfect: "had changed." "Has changed" connects to a present this sentence never visits; "changes" and "will have changed" live in the wrong zones entirely.' },
      { p:null, q:'The lab [BLANK] its findings next month, once the peer reviews are complete.', c:['published','has published','had published','will publish'], a:3, e:'Anchor: "next month" — the future. Only "will publish" lives there. The three past-facing forms each contradict a timeline the sentence states outright; they sound fine only if you never located the anchor.' },
      { p:null, q:'Every morning the ferry [BLANK] the harbor at six, a schedule unchanged for forty years.', c:['leaves','left','had left','will have left'], a:0, e:'Anchor: "Every morning" plus "unchanged for forty years" — a standing routine. Habitual present: "leaves." "Left" seals the routine in the past while the sentence insists it continues; the perfect forms need reference events the sentence doesn\'t have.' },
      { p:null, q:'The violinist [BLANK] with the orchestra for a decade when the new conductor arrived and rebuilt the string section.', c:['plays','had been playing','has been playing','will be playing'], a:1, e:'Anchor: "when the new conductor arrived" — a past event interrupting an ongoing earlier state. Duration-up-to-a-past-moment takes the past perfect progressive: "had been playing." "Has been playing" runs to the present, but the arrival already ended that chapter in the past.' },
      { p:'A student sees four tenses of "migrate" as choices and picks "migrated" because the sentence "feels like a history topic." The sentence reads: "Satellite tags show that the herd [BLANK] the same river crossing every spring."', q:'What did she skip, and what does it change?', c:['Nothing important, since topic feel is a reliable guide to tense on the SAT','She skipped the choices\' grammar; "migrated" is not a real past form','The anchor hunt: "show" and "every spring" set the habitual present','Counting the choices; four tenses always means the answer is past perfect'], a:2, e:'Anchors: present-tense "show" and the routine marker "every spring" — the herd migrates, now, habitually. "Feels like history" is exactly the ear-guess the four-grammatical-forms format is built to defeat. The anchor was two words away.' },
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
    if (accuracy === 1 && total >= 3) Storage.awardBadge(`perfect_${code}`, 'Perfect Drill', `${total}/${total} on ${code}`);
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
          <i data-lucide="zap"></i> Practice This Strategy (${DRILLS[code].length} Questions)
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
