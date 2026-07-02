/* ============================================================
   SCHOLAR'S EDGE — Module 4: Score Band Engine
   Zone of Proximal Development implementation.
   Drill queue prioritization, band profile, movement history.
   ============================================================ */

const ScoreBandsModule = (() => {

  // ── BAND DEFINITIONS ── //

  const BANDS = {
    1: { label: 'Foundational', range: '200–400', color: 'var(--band-1, #B8D4E8)', emoji: '🌱', description: 'Building core comprehension and fundamentals. Every expert started exactly here.' },
    2: { label: 'Emerging',     range: '400–500', color: 'var(--band-2, #74B0D4)', emoji: '📖', description: 'Core patterns are emerging. Consistent strategy application is the next step.' },
    3: { label: 'Developing',   range: '500–560', color: 'var(--band-3, #3F8FC4)', emoji: '⚙️', description: 'Strategies understood but applied inconsistently. Trap recognition is the unlock.' },
    4: { label: 'Progressing',  range: '560–610', color: 'var(--band-4, #2ABFBF)', emoji: '🎯', description: 'Most questions correct. Refining performance on the hardest question types.' },
    5: { label: 'Proficient',   range: '610–670', color: 'var(--band-5, #3CC48A)', emoji: '💡', description: 'Solid execution. Fine-tuning and careless error elimination are the difference-makers.' },
    6: { label: 'Advanced',     range: '670–740', color: 'var(--band-6, #7B4FCC)', emoji: '🚀', description: 'Occasional hard question errors. Eliminate every careless slip to reach elite.' },
    7: { label: 'Elite',        range: '740–800', color: 'var(--band-7, #F4B942)', emoji: '⭐', description: 'Elite territory. Spaced repetition keeps these skills sharp through test day.' },
  };

  // Score impact estimate per band jump (total score points)
  const BAND_JUMP_IMPACT = { 1: 70, 2: 55, 3: 45, 4: 30, 5: 25, 6: 15 };

  // ── SKILL METADATA ── //

  const SKILLS = {
    main_idea:      { label: 'Main Idea',       section: 'RW', icon: 'book-open',      weight: 10, strategies: ['R9', 'R10', 'R11', 'R12', 'R13', 'U5'] },
    inference:      { label: 'Inference',        section: 'RW', icon: 'search',         weight: 12, strategies: ['R4', 'R3', 'R5', 'R6', 'R7', 'R8', 'U5'] },
    grammar:        { label: 'Grammar',          section: 'RW', icon: 'type',           weight: 8,  strategies: ['G1', 'G2', 'G5', 'G6', 'G7'] },
    transitions:    { label: 'Transitions',      section: 'RW', icon: 'arrow-right',    weight: 5,  strategies: ['G3'] },
    punctuation:    { label: 'Punctuation',      section: 'RW', icon: 'minus-circle',   weight: 5,  strategies: ['G4', 'G2'] },
    linear_algebra: { label: 'Linear Algebra',   section: 'Math', icon: 'trending-up', weight: 13, strategies: ['M1', 'M2', 'M4', 'M5', 'M11'] },
    advanced_math:  { label: 'Advanced Math',    section: 'Math', icon: 'zap',          weight: 13, strategies: ['M2', 'M3', 'M5', 'M12', 'M13'] },
    data_analysis:  { label: 'Data & Statistics',section: 'Math', icon: 'bar-chart-2',  weight: 9,  strategies: ['M5', 'M6', 'M7', 'M8', 'M9'] },
  };

  // Per-skill, per-band coaching prescription
  const PRESCRIPTIONS = {
    main_idea: {
      1: 'Start by identifying what each paragraph does before answering. Use R11 (Paragraph Function Labeling) on every passage.',
      2: 'Practice the One-Line Headline technique (R12) on every passage. Train yourself to summarize before looking at choices.',
      3: 'You understand main idea questions but lose points on "author\'s purpose" variants. Use R9 (Find the Motive) consistently.',
      4: 'Your main idea reads are solid. Focus on eliminating the "True But Irrelevant" trap (R6) — it\'s the one catching you now.',
      5: 'Strong here. Work on cross-text main idea questions — track two authors\' positions simultaneously.',
      6: 'Near perfect. Drill the hardest paired-passage variants. One slip here costs 10–15 points.',
      7: 'Maintain with spaced repetition. These skills stay sharp through regular mixed drilling.',
    },
    inference: {
      1: 'Inference questions require pointing to the text. Start with R4 (Could-Be-True Trap) — never pick an answer you can\'t prove.',
      2: 'Practice eliminating answers that go beyond what the text actually says. R3 (Half-Right) is your most important tool right now.',
      3: 'You\'re catching obvious wrong answers. Now learn to identify the difference between "plausible" and "supported." R4 is your focus.',
      4: 'Focus on Command of Evidence questions — textual AND quantitative. Train yourself to cite the specific line before selecting.',
      5: 'Strong inference skills. Work on the hardest vocabulary-in-context questions — these require precise understanding, not word association.',
      6: 'Excellent. Drill cross-text inference questions (two passage sets). Track both authors\'s views simultaneously.',
      7: 'Elite. Maintain with occasional hard inference sets in mixed drilling.',
    },
    grammar: {
      1: 'Grammar questions test patterns, not rules. Use G1 (Pattern Recognition) — ask "what is consistent with the surrounding text?"',
      2: 'Master the Shortest Answer Rule (G2) first — it eliminates 30% of wrong answers instantly. Build from there.',
      3: 'Core grammar patterns are working. Now learn G5 (Subject-Verb Isolation) — strip the phrases between subject and verb before checking.',
      4: 'Your standard grammar is solid. Focus on pronoun agreement (G6) and modifier placement — these are the Band 4→5 differentiators.',
      5: 'Strong grammar. Fine-tune verb tense consistency questions (G7) — scan 2 sentences before AND after for tense signals.',
      6: 'Near elite. The only thing standing between you and Band 7 is eliminating careless reads on conventional/grammar combo questions.',
      7: 'Maintain. These stay sharp through any writing practice.',
    },
    transitions: {
      1: 'Transition questions have 4 relationship types. Learn G3 (Transition Logic Map): Contrast / Continuation / Cause-Effect / Example.',
      2: 'Practice identifying the logical relationship BEFORE looking at answer choices. Name it out loud: "This is a contrast relationship."',
      3: 'You know the 4 relationship types. Now train yourself to catch "false continuation" traps — where contrast looks like continuation.',
      4: 'Strong on standard transitions. Work on complex sentence transitions where the relationship is embedded inside a clause.',
      5: 'Excellent transition instincts. Drill the hardest rhetorical synthesis questions — these combine transition logic with evidence selection.',
      6: 'Near perfect. Occasional slip on nuanced "however vs. nevertheless" distinctions. Drill these edge cases.',
      7: 'Elite. Spaced repetition only.',
    },
    punctuation: {
      1: 'Start with G4 (Punctuation Decision Tree). Learn one rule at a time: periods and semicolons first — they\'re the most common.',
      2: 'You know periods and semicolons. Now master the colon (list with explanation) and comma+dash pairs (non-essential information).',
      3: 'Core punctuation rules are solid. Focus on the "two-comma rule" for embedded clauses — this is where Band 3→4 happens.',
      4: 'Strong on standard cases. Work on the tricky comma-vs-dash edge cases and fragment detection.',
      5: 'Excellent punctuation. Your remaining errors are reading speed — slow down 3 seconds per question on these.',
      6: 'Near elite. Drill the hardest two-clause punctuation questions at speed.',
      7: 'Maintain. Spaced repetition keeps this sharp.',
    },
    linear_algebra: {
      1: 'Start with linear equations in one variable. Use M4 (Solve Without Algebra) — test answer choices instead of solving algebraically.',
      2: 'Practice Backsolving (M1) on every equation question. Start with the middle answer choice and work outward.',
      3: 'Core linear equations are manageable. Now learn M11 (Systems → Graph Intersection) in Desmos — it eliminates calculation entirely.',
      4: 'Your algebra is working. Focus on linear inequalities and systems of inequalities — these are the Band 4→5 differentiators.',
      5: 'Strong linear algebra. Work on function notation and linear function transformations — the most abstract presentations of this content.',
      6: 'Near elite. Focus on multi-step linear problems where the trap is setting up the equation incorrectly.',
      7: 'Maintain with occasional hard systems drills.',
    },
    advanced_math: {
      1: 'Advanced math is a high-priority area. Start with Plug In Numbers (M2) — replace variables with simple numbers to make abstract problems concrete.',
      2: 'Practice quadratic equations using M1 (Backsolving) — avoid the quadratic formula whenever an answer choice can be tested directly.',
      3: 'Core quadratics are developing. Now learn the M12 (Slider Method) in Desmos for function parameter questions.',
      4: 'Your quadratic work is solid. Focus on polynomial and rational expressions — use M13 (Equivalency Visual Proof) to check equivalence graphically.',
      5: 'Strong advanced math. Work on the hardest function composition and radical/exponential function questions.',
      6: 'Near elite. Drill the hardest nonlinear system and complex function questions.',
      7: 'Maintain. Occasional hard mixed sets to keep these sharp.',
    },
    data_analysis: {
      1: 'Data questions are all about reading carefully. Use M6 (Units-First Analysis) — read answer choices to identify required units before calculating.',
      2: 'Practice M5 (Answer Choice Ballparking) on every data question — eliminate obviously wrong answers before any calculation.',
      3: 'Core data reading is developing. Focus on two-way table questions — these trip up most students at this band.',
      4: 'Your data reads are solid. Work on probability and conditional probability — these are the Band 4→5 differentiators.',
      5: 'Strong data analysis. Focus on statistics interpretation (mean vs. median, margin of error, sample size) — the hardest data variants.',
      6: 'Near elite. Drill complex multi-graph questions where data appears in two different formats simultaneously.',
      7: 'Maintain with occasional hard statistics sets.',
    },
  };

  // ── STATE ── //
  let containerEl = null;

  // ── MAIN RENDER ── //
  function render() {
    const bands = Storage.getBands();
    const importHistory = Storage.getImportHistory();

    const div = document.createElement('div');
    div.className = 'animate-fade-in';
    div.id = 'score-bands-root';
    containerEl = div;

    const queue = computeDrillQueue(bands);
    const bandEntries = Object.entries(bands).filter(([k, v]) => v !== null);
    const hasHistory = importHistory.length > 1;

    div.innerHTML = `
      ${buildPageHeader(bands, importHistory)}
      ${buildBandProfileGrid(bands)}
      ${buildDrillQueueSection(queue)}
      ${hasHistory ? buildBandHistorySection(importHistory) : ''}
      ${buildBandReferenceSection()}
    `;

    requestAnimationFrame(() => {
      wireInteractions(div);
      animateBandBars(div);
      if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
    });

    return div;
  }

  // ── PAGE HEADER ── //
  function buildPageHeader(bands, history) {
    const bandValues = Object.values(bands).filter(v => v !== null);
    const avgBand = bandValues.length
      ? (bandValues.reduce((a, b) => a + b, 0) / bandValues.length).toFixed(1)
      : null;
    const lowestBand = bandValues.length ? Math.min(...bandValues) : null;
    const highestBand = bandValues.length ? Math.max(...bandValues) : null;
    const lastImport = history.length ? history[history.length - 1] : null;

    return `
      <div class="page-header-row mb-6">
        <div>
          <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
            letter-spacing:var(--ls-widest);color:var(--color-teal);margin-bottom:var(--space-2);">
            Score Band Engine
          </div>
          <h1 style="margin-bottom:var(--space-2);">Your Band Profile</h1>
          <p class="page-subtitle">
            Your practice queue is ranked by score impact — always drilling your current band
            and the next band up. Never too easy, never too far ahead.
          </p>
        </div>
        <div style="display:flex;gap:var(--space-4);">
          ${avgBand ? `
            <div style="text-align:center;padding:var(--space-4) var(--space-5);
              background:var(--color-primary-50);border-radius:var(--radius-lg);">
              <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
                letter-spacing:var(--ls-wider);color:var(--color-primary);margin-bottom:var(--space-1);">
                Avg Band
              </div>
              <div style="font-family:var(--font-heading);font-size:var(--text-2xl);
                font-weight:var(--fw-extrabold);color:var(--color-primary);">${avgBand}</div>
            </div>
          ` : ''}
          ${lastImport ? `
            <div style="text-align:center;padding:var(--space-4) var(--space-5);
              background:white;border:1px solid var(--color-neutral-200);border-radius:var(--radius-lg);">
              <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
                letter-spacing:var(--ls-wider);color:var(--color-neutral-500);margin-bottom:var(--space-1);">
                Last Import
              </div>
              <div style="font-weight:var(--fw-bold);color:var(--color-primary);font-size:var(--text-sm);">
                ${formatTestLabel(lastImport.testSource)}
              </div>
              <div style="font-size:var(--text-xs);color:var(--color-neutral-500);">
                ${lastImport.totalScore} total
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="coaching-card mb-6">
        <div class="coaching-card-avatar">🎯</div>
        <div class="coaching-card-body">
          <div class="coaching-card-label">The Zone of Proximal Development</div>
          <div class="coaching-card-message">
            Learning happens fastest in the zone just beyond your current ability.
            ${lowestBand && highestBand ? `
              Your range is Band ${lowestBand} to Band ${highestBand}.
              Your drill queue below focuses on the skills where one band jump produces the biggest score gain.
              Never drilling below your level — that wastes time. Never two bands ahead — that causes frustration.
            ` : 'Your drill queue is built from your imported Bluebook scores.'}
          </div>
        </div>
      </div>
    `;
  }

  // ── BAND PROFILE GRID ── //
  function buildBandProfileGrid(bands) {
    const rwSkills = ['main_idea', 'inference', 'grammar', 'transitions', 'punctuation'];
    const mathSkills = ['linear_algebra', 'advanced_math', 'data_analysis'];

    return `
      <div style="margin-bottom:var(--space-8);">
        <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
          letter-spacing:var(--ls-widest);color:var(--color-neutral-500);margin-bottom:var(--space-4);">
          Reading & Writing — 5 Skill Areas
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
          gap:var(--space-4);margin-bottom:var(--space-6);">
          ${rwSkills.map(s => buildSkillCard(s, bands[s])).join('')}
        </div>

        <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
          letter-spacing:var(--ls-widest);color:var(--color-neutral-500);margin-bottom:var(--space-4);">
          Math — 3 Skill Areas
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
          gap:var(--space-4);margin-bottom:var(--space-4);">
          ${mathSkills.map(s => buildSkillCard(s, bands[s])).join('')}
        </div>
      </div>
    `;
  }

  function buildSkillCard(skillKey, band) {
    const skill = SKILLS[skillKey];
    const bandDef = band ? BANDS[band] : null;
    const nextBand = band && band < 7 ? band + 1 : null;
    const nextBandDef = nextBand ? BANDS[nextBand] : null;
    const impact = band ? BAND_JUMP_IMPACT[band] : null;
    const prescription = band ? PRESCRIPTIONS[skillKey]?.[band] : null;
    const barPct = band ? Math.round((band / 7) * 100) : 0;

    return `
      <div class="card" style="position:relative;overflow:hidden;" data-skill="${skillKey}">
        <!-- Subtle section color accent -->
        <div style="position:absolute;top:0;left:0;width:4px;height:100%;
          background:${skill.section === 'RW' ? 'var(--color-teal)' : 'var(--color-accent)'};
          border-radius:var(--radius-xl) 0 0 var(--radius-xl);"></div>

        <div class="card-body" style="padding-left:calc(var(--space-5) + 4px);">
          <!-- Header row -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;
            margin-bottom:var(--space-3);">
            <div>
              <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-1);">
                <i data-lucide="${skill.icon}" style="width:14px;height:14px;
                  color:${skill.section === 'RW' ? 'var(--color-teal)' : 'var(--color-accent)'};
                  flex-shrink:0;"></i>
                <span style="font-size:var(--text-xs);font-weight:var(--fw-semibold);
                  text-transform:uppercase;letter-spacing:var(--ls-wider);
                  color:var(--color-neutral-500);">${skill.label}</span>
              </div>
              ${bandDef ? `
                <div style="font-family:var(--font-heading);font-size:var(--text-2xl);
                  font-weight:var(--fw-extrabold);color:${bandDef.color};line-height:1.1;">
                  Band ${band}
                </div>
                <div style="font-size:var(--text-xs);color:${bandDef.color};
                  font-weight:var(--fw-semibold);">${bandDef.label}</div>
              ` : `
                <div style="font-size:var(--text-sm);color:var(--color-neutral-400);">Not yet assessed</div>
              `}
            </div>
            ${bandDef ? `
              <div style="font-size:1.5rem;" title="Band ${band}: ${bandDef.label}">
                ${bandDef.emoji}
              </div>
            ` : ''}
          </div>

          <!-- Band progress bar -->
          <div style="margin-bottom:var(--space-3);">
            <div style="background:var(--color-neutral-100);border-radius:var(--radius-full);
              height:8px;overflow:hidden;">
              <div class="band-bar-fill" data-target="${barPct}"
                style="height:100%;width:0%;background:${bandDef ? bandDef.color : 'var(--color-neutral-300)'};
                  border-radius:var(--radius-full);transition:width 1s ease;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:4px;">
              <span style="font-size:9px;color:var(--color-neutral-400);">Band 1</span>
              <span style="font-size:9px;color:var(--color-neutral-400);">Band 7</span>
            </div>
          </div>

          <!-- Next target + impact -->
          ${nextBandDef ? `
            <div style="display:flex;justify-content:space-between;align-items:center;
              padding:var(--space-2) var(--space-3);background:var(--color-neutral-50);
              border-radius:var(--radius-md);margin-bottom:var(--space-3);">
              <div style="font-size:var(--text-xs);color:var(--color-neutral-500);">
                Next: <strong style="color:${nextBandDef.color};">Band ${nextBand} — ${nextBandDef.label}</strong>
              </div>
              ${impact ? `
                <span style="font-size:9px;font-weight:var(--fw-bold);padding:2px 6px;
                  background:${nextBandDef.color}20;color:${nextBandDef.color};
                  border-radius:var(--radius-full);">+${impact} pts</span>
              ` : ''}
            </div>
          ` : band === 7 ? `
            <div style="padding:var(--space-2) var(--space-3);background:var(--color-primary-50);
              border-radius:var(--radius-md);margin-bottom:var(--space-3);text-align:center;">
              <span style="font-size:var(--text-xs);font-weight:var(--fw-bold);color:var(--color-primary);">
                ⭐ Perfect Score Territory
              </span>
            </div>
          ` : ''}

          <!-- Prescription (collapsible) -->
          ${prescription ? `
            <details style="margin-bottom:var(--space-3);">
              <summary style="cursor:pointer;font-size:var(--text-xs);font-weight:var(--fw-semibold);
                color:var(--color-primary);list-style:none;display:flex;align-items:center;gap:var(--space-1);">
                <i data-lucide="chevron-right" class="details-chevron"
                  style="width:12px;height:12px;transition:transform 0.2s;"></i>
                What to work on
              </summary>
              <div style="margin-top:var(--space-2);padding:var(--space-3);
                background:var(--color-primary-50);border-radius:var(--radius-md);">
                <p style="font-size:var(--text-xs);color:var(--color-neutral-600);
                  line-height:var(--lh-relaxed);margin:0;">${prescription}</p>
              </div>
            </details>
          ` : ''}

          <!-- Drill button -->
          <button class="btn btn-sm btn-outline btn-block drill-skill-btn"
            data-skill="${skillKey}" data-band="${band || 1}"
            onclick="Router.navigate('/drill-engine')">
            <i data-lucide="zap" style="width:12px;height:12px;"></i>
            Drill ${skill.label}
          </button>
        </div>
      </div>
    `;
  }

  // ── DRILL QUEUE ── //
  function buildDrillQueueSection(queue) {
    const { priority1, priority2, priority3, priority4 } = queue;

    return `
      <div class="card mb-8">
        <div class="card-header">
          <h2 style="font-size:var(--text-xl);">
            <i data-lucide="list-ordered" style="width:20px;height:20px;display:inline-block;
              vertical-align:-4px;margin-right:var(--space-2);color:var(--color-teal);"></i>
            Your Drill Queue
          </h2>
          <span style="font-size:var(--text-xs);color:var(--color-neutral-500);">
            Ranked by score impact — highest first
          </span>
        </div>
        <div class="card-body">
          ${queueGroup('🔴', 'Priority 1 — Highest Impact', 'color:var(--color-error)',
            'Lowest band skills. One jump here moves your score the most.',
            priority1, 'var(--color-error)')}
          ${queueGroup('🟡', 'Priority 2 — Strong Returns', 'color:var(--color-warning)',
            'Mid-band skills closest to the next threshold. Most achievable gains.',
            priority2, 'var(--color-warning)')}
          ${queueGroup('🔵', 'Priority 3 — Keep Sharp', 'color:var(--color-teal)',
            'Band 5+ strengths. Spaced repetition keeps these locked in.',
            priority3, 'var(--color-teal)')}
          ${queueGroup('⚙️', 'Priority 4 — Foundational Work', 'color:var(--color-neutral-400)',
            'Skills needing foundational rebuilding. Scheduled separately.',
            priority4, 'var(--color-neutral-400)')}

          <div style="margin-top:var(--space-6);display:flex;gap:var(--space-4);justify-content:center;">
            <button class="btn btn-accent btn-lg" onclick="Router.navigate('/drill-engine')">
              <i data-lucide="zap" style="width:18px;height:18px;"></i>
              Start Drilling — Priority 1
            </button>
            <button class="btn btn-outline" onclick="Router.navigate('/strategy-course')">
              <i data-lucide="book-open" style="width:16px;height:16px;"></i>
              Study Strategies First
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function queueGroup(emoji, title, titleStyle, subtitle, items, borderColor) {
    if (!items || items.length === 0) return '';
    return `
      <div style="margin-bottom:var(--space-5);">
        <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
          <span style="font-size:1.1rem;">${emoji}</span>
          <div>
            <div style="font-weight:var(--fw-bold);font-size:var(--text-sm);${titleStyle};">${title}</div>
            <div style="font-size:var(--text-xs);color:var(--color-neutral-500);">${subtitle}</div>
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);padding-left:var(--space-7);">
          ${items.map(item => `
            <div style="display:inline-flex;align-items:center;gap:var(--space-2);
              padding:var(--space-2) var(--space-4);
              border:1.5px solid ${borderColor};border-radius:var(--radius-full);
              background:white;cursor:pointer;"
              onclick="Router.navigate('/drill-engine')"
              title="Drill ${SKILLS[item.skill]?.label} — Band ${item.band} → ${item.targetBand}">
              <span style="font-size:var(--text-sm);font-weight:var(--fw-medium);
                color:var(--color-primary);">${SKILLS[item.skill]?.label || item.skill}</span>
              <span style="font-size:var(--text-xs);font-weight:var(--fw-bold);padding:1px 6px;
                border-radius:var(--radius-full);background:${BANDS[item.band]?.color || 'var(--color-neutral-200)'};
                color:white;">B${item.band}</span>
              ${item.targetBand !== item.band ? `
                <span style="font-size:9px;color:var(--color-neutral-400);">→ B${item.targetBand}</span>
              ` : ''}
              ${item.band < 7 ? `
                <span style="font-size:9px;font-weight:var(--fw-bold);color:${BANDS[item.targetBand]?.color || borderColor};">
                  +${BAND_JUMP_IMPACT[item.band] || 0}pts
                </span>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ── BAND MOVEMENT HISTORY ── //
  function buildBandHistorySection(importHistory) {
    // Build a timeline of band changes across imports
    const events = [];

    for (let i = 1; i < importHistory.length; i++) {
      const prev = importHistory[i - 1];
      const curr = importHistory[i];
      const prevProfile = prev.bandProfile || {};
      const currProfile = curr.bandProfile || {};

      Object.keys(currProfile).forEach(skill => {
        const prevBand = prevProfile[skill];
        const currBand = currProfile[skill];
        if (prevBand && currBand && currBand !== prevBand) {
          events.push({
            date: curr.importedAt,
            testSource: curr.testSource,
            skill,
            from: prevBand,
            to: currBand,
            direction: currBand > prevBand ? 'up' : 'down',
          });
        }
      });
    }

    if (events.length === 0) {
      return `
        <div class="card mb-8">
          <div class="card-header"><h2>Band Movement History</h2></div>
          <div class="card-body">
            <div class="empty-state">
              <div class="empty-state-icon"><i data-lucide="trending-up"></i></div>
              <div class="empty-state-title">Band movement appears here after your second Bluebook import</div>
              <div class="empty-state-desc">
                Import Bluebook Test 8 after a few weeks of practice to see your band movements.
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="card mb-8">
        <div class="card-header">
          <h2>Band Movement History</h2>
          <span class="badge badge-teal">${events.filter(e => e.direction === 'up').length} improvements</span>
        </div>
        <div class="card-body">
          <div style="display:flex;flex-direction:column;gap:var(--space-3);">
            ${events.sort((a, b) => new Date(b.date) - new Date(a.date)).map(ev => `
              <div style="display:flex;align-items:center;gap:var(--space-4);padding:var(--space-3)
                var(--space-4);background:${ev.direction === 'up' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)'};
                border-radius:var(--radius-lg);border-left:3px solid
                ${ev.direction === 'up' ? 'var(--color-success)' : 'var(--color-warning)'};">
                <div style="font-size:1.5rem;">${ev.direction === 'up' ? '🎯' : '⚠️'}</div>
                <div style="flex:1;">
                  <div style="font-weight:var(--fw-bold);color:var(--color-primary);
                    font-size:var(--text-sm);margin-bottom:2px;">
                    ${SKILLS[ev.skill]?.label || ev.skill}:
                    Band ${ev.from} → Band ${ev.to}
                    ${ev.direction === 'up' ? `
                      <span style="color:var(--color-success);font-weight:var(--fw-bold);">
                        +${BAND_JUMP_IMPACT[ev.from] || 0} points
                      </span>
                    ` : ''}
                  </div>
                  <div style="font-size:var(--text-xs);color:var(--color-neutral-500);">
                    ${formatTestLabel(ev.testSource)} ·
                    ${new Date(ev.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:var(--space-2);">
                  <div style="text-align:center;">
                    <div style="font-size:var(--text-xs);color:var(--color-neutral-400);margin-bottom:2px;">Was</div>
                    <div style="width:36px;height:36px;border-radius:var(--radius-md);
                      background:${BANDS[ev.from]?.color};display:flex;align-items:center;
                      justify-content:center;font-weight:var(--fw-extrabold);color:white;
                      font-size:var(--text-sm);">B${ev.from}</div>
                  </div>
                  <i data-lucide="arrow-right" style="width:16px;height:16px;color:var(--color-neutral-400);"></i>
                  <div style="text-align:center;">
                    <div style="font-size:var(--text-xs);color:var(--color-neutral-400);margin-bottom:2px;">Now</div>
                    <div style="width:36px;height:36px;border-radius:var(--radius-md);
                      background:${BANDS[ev.to]?.color};display:flex;align-items:center;
                      justify-content:center;font-weight:var(--fw-extrabold);color:white;
                      font-size:var(--text-sm);">B${ev.to}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ── BAND REFERENCE ── //
  function buildBandReferenceSection() {
    return `
      <div class="card mb-8">
        <div class="card-header">
          <h2>The 7 Score Bands</h2>
          <span style="font-size:var(--text-xs);color:var(--color-neutral-500);">Reference guide</span>
        </div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-3);">
            ${Object.entries(BANDS).map(([num, band]) => `
              <div style="padding:var(--space-4);border-radius:var(--radius-lg);
                border:1.5px solid ${band.color}40;background:${band.color}08;">
                <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-2);">
                  <div style="width:36px;height:36px;border-radius:var(--radius-md);
                    background:${band.color};display:flex;align-items:center;justify-content:center;
                    font-weight:var(--fw-extrabold);color:white;font-size:var(--text-sm);flex-shrink:0;">
                    B${num}
                  </div>
                  <div>
                    <div style="font-weight:var(--fw-bold);color:${band.color};
                      font-size:var(--text-sm);">${band.label}</div>
                    <div style="font-size:var(--text-xs);color:var(--color-neutral-500);">
                      ${band.range} per section
                    </div>
                  </div>
                </div>
                <p style="font-size:var(--text-xs);color:var(--color-neutral-600);
                  line-height:var(--lh-relaxed);margin:0;">${band.description}</p>
                ${parseInt(num) < 7 ? `
                  <div style="margin-top:var(--space-2);font-size:9px;font-weight:var(--fw-bold);
                    color:${BANDS[parseInt(num) + 1]?.color};">
                    Next band up worth ~+${BAND_JUMP_IMPACT[parseInt(num)] || 0} points
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ── DRILL QUEUE ALGORITHM ── //
  function computeDrillQueue(bands) {
    const entries = Object.entries(bands).filter(([k, v]) => v !== null && SKILLS[k]);

    if (entries.length === 0) {
      return { priority1: [], priority2: [], priority3: [], priority4: [] };
    }

    const bandValues = entries.map(([k, v]) => v);
    const minBand = Math.min(...bandValues);
    const avgBand = Math.round(bandValues.reduce((a, b) => a + b, 0) / bandValues.length);

    // Sort by impact score: (weight × (8 - band)) — lower band + higher question weight = higher priority
    const scored = entries.map(([skill, band]) => ({
      skill,
      band,
      targetBand: band < 7 ? band + 1 : 7,
      impactScore: (SKILLS[skill]?.weight || 5) * (8 - band),
    })).sort((a, b) => b.impactScore - a.impactScore);

    const queue = { priority1: [], priority2: [], priority3: [], priority4: [] };

    scored.forEach(item => {
      const { skill, band } = item;

      if (band >= 5) {
        // Strong skills → spaced repetition
        queue.priority3.push(item);
      } else if (band <= minBand + 1 && (avgBand - band) <= 2) {
        // Lowest bands within reach — highest priority
        queue.priority1.push(item);
      } else if (band < avgBand - 1) {
        // More than 2 bands below focus → foundational
        queue.priority4.push(item);
      } else {
        // Mid-range improvement targets
        queue.priority2.push(item);
      }
    });

    return queue;
  }

  // ── INTERACTIONS + ANIMATIONS ── //
  function animateBandBars(root) {
    // Slight delay then animate all bars to their target widths
    setTimeout(() => {
      root.querySelectorAll('.band-bar-fill').forEach(bar => {
        const target = bar.getAttribute('data-target');
        if (target) bar.style.width = target + '%';
      });
    }, 150);
  }

  function wireInteractions(root) {
    // Chevron rotation on details open/close
    root.querySelectorAll('details').forEach(details => {
      const chevron = details.querySelector('.details-chevron');
      if (!chevron) return;
      details.addEventListener('toggle', () => {
        chevron.style.transform = details.open ? 'rotate(90deg)' : 'rotate(0deg)';
      });
    });
  }

  // ── HELPERS ── //
  function formatTestLabel(source) {
    const map = {
      bluebook_7: 'SAT Practice 7', bluebook_8: 'SAT Practice 8',
      bluebook_9: 'SAT Practice 9', bluebook_10: 'SAT Practice 10',
      khan: 'Practice Test', clt: 'CLT', other: 'Practice Test',
    };
    return map[source] || source || 'Practice Test';
  }

  function reset() {
    containerEl = null;
  }

  // ── PUBLIC API ── //
  return { render, reset };

})();

window.ScoreBandsModule = ScoreBandsModule;
