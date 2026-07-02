// ═══════════════════════════════════════════════════════════════════════════
//  SCHOLAR'S EDGE — MODULE 7: SKILLS CHECK
//  Adaptive strategy mastery check. Runs every 4 weeks.
//  NOT a score benchmark — purely for strategy tracking.
//  Depends on: storage.js, ui.js, drill-engine.js (for DE_QUESTIONS via getQuestions)
// ═══════════════════════════════════════════════════════════════════════════

var SkillsCheckModule = (function () {
  'use strict';

  // ── Constants ────────────────────────────────────────────────────────────
  var QS_PER_STATE = { in_progress: 3, developing: 2, mastered: 1, elite: 1 };
  var SOFT_LOCK_DAYS = 28;
  var STRONG_THRESHOLD = 0.80;  // ≥80% = strong
  var WEAK_THRESHOLD   = 0.60;  // <60% = needs work

  // All 51 strategy codes in section order
  var ALL_CODES = [
    'U1','U2','U3','U4','U5','U6','U7',
    'R1','R2','R3','R4','R5','R6','R7','R8',
    'R9','R10','R11','R12','R13',
    'G1','G2','G3','G4','G5','G6','G7',
    'M1','M2','M3','M4','M5','M6','M7','M8','M9',
    'M10','M11','M12','M13','M14','M15',
    'C1','C2','C3','C4',
    'MN1','MN2','MN3','MN4','MN5',
  ];

  var SECTION_OF = {
    U1:'Universal',U2:'Universal',U3:'Universal',U4:'Universal',U5:'Universal',U6:'Universal',U7:'Universal',
    R1:'Reading: Elimination',R2:'Reading: Elimination',R3:'Reading: Elimination',R4:'Reading: Elimination',
    R5:'Reading: Elimination',R6:'Reading: Elimination',R7:'Reading: Elimination',R8:'Reading: Elimination',
    R9:'Reading: Passage',R10:'Reading: Passage',R11:'Reading: Passage',R12:'Reading: Passage',R13:'Reading: Passage',
    G1:'Grammar & Writing',G2:'Grammar & Writing',G3:'Grammar & Writing',G4:'Grammar & Writing',
    G5:'Grammar & Writing',G6:'Grammar & Writing',G7:'Grammar & Writing',
    M1:'Math Core',M2:'Math Core',M3:'Math Core',M4:'Math Core',M5:'Math Core',
    M6:'Math Core',M7:'Math Core',M8:'Math Core',M9:'Math Core',
    M10:'Desmos',M11:'Desmos',M12:'Desmos',M13:'Desmos',M14:'Desmos',M15:'Desmos',
    C1:'Charts & Data',C2:'Charts & Data',C3:'Charts & Data',C4:'Charts & Data',
    MN1:'Mindset & Mixed',MN2:'Mindset & Mixed',MN3:'Mindset & Mixed',MN4:'Mindset & Mixed',MN5:'Mindset & Mixed',
  };

  var STRATEGY_NAMES = {
    U1:'Process of Elimination',U2:'Predicted Answer',U3:'Anchor to Text',
    U4:'Backsolving (Universal)',U5:'Plug In Numbers (Universal)',U6:'Rate/Ratio Reasoning',U7:'Time Management',
    R1:'Main Purpose',R2:'Author Tone',R3:'Evidence Support',R4:'Detail Reference',
    R5:'Inference',R6:'Vocabulary in Context',R7:'Textual Evidence',R8:'Cross-Text Comparison',
    R9:'Thesis Identification',R10:'Argument Structure',R11:'Counterargument',R12:'Data Integration',R13:'Style & Purpose',
    G1:'Subject-Verb Agreement',G2:'Pronoun Agreement',G3:'Comma Splices & Fragments',G4:'Apostrophes & Possession',
    G5:'Transitions',G6:'Modifiers',G7:'Parallel Structure',
    M1:'Backsolving (Math)',M2:'Plug In Numbers (Math)',M3:'Percent & Proportion',M4:'Algebra Without Algebra',
    M5:'Ballpark & Eliminate',M6:'Unit Tracking',M7:'Re-Read the Question',M8:'Number Properties',M9:'Geometry & Estimation',
    M10:'Desmos Basics',M11:'Systems via Graph',M12:'Parameter Sliders',M13:'Expression Equivalence',
    M14:'Equation from Graph',M15:'Desmos vs. Algebra',
    C1:'Data Interpretation',C2:'Statistical Analysis',C3:'Study Design',C4:'Descriptive Stats',
    MN1:'Strategy Meta',MN2:'Algebra Review',MN3:'Geometry Review',MN4:'Advanced Topics',MN5:'Mixed Review',
  };

  // ── Module state ─────────────────────────────────────────────────────────
  var view = 'overview'; // 'overview' | 'session' | 'results'
  var scSession = null;  // active session object
  var containerEl = null;

  // ── Storage helpers ───────────────────────────────────────────────────────
  function getLastCheck() {
    return Storage.getPath('skillsCheck.last', null);
  }
  function getHistory() {
    return Storage.getPath('skillsCheck.history', []);
  }
  function getUsedQ() {
    return Storage.getPath('skillsCheck.usedQ', {});
  }
  function markUsed(code, idx) {
    var used = getUsedQ();
    if (!used[code]) used[code] = [];
    if (used[code].indexOf(idx) === -1) used[code].push(idx);
    // Reset pool if all 5 have been used — allow repeats from fresh pool
    if (used[code].length >= 5) { used[code] = []; }
    Storage.setPath('skillsCheck.usedQ', used);
  }
  function getMasteryState(code) {
    return Storage.getPath('strategyMastery.' + code, 'not_started');
  }

  // ── Question selection ────────────────────────────────────────────────────
  function buildSession() {
    var questions = [];
    var strategyMap = {}; // code → { state, count, correct, qIndices }
    var usedQ = getUsedQ();

    ALL_CODES.forEach(function (code) {
      var state = getMasteryState(code);
      if (state === 'not_started') return;

      var count = QS_PER_STATE[state] || 1;
      var pool = DrillEngineModule.getQuestions(code);
      if (!pool || !pool.length) return;

      var used = usedQ[code] || [];
      var available = [];
      pool.forEach(function (q, i) {
        if (used.indexOf(i) === -1) available.push(i);
      });
      // If not enough fresh, use full pool
      if (available.length < count) {
        available = pool.map(function (q, i) { return i; });
      }
      // Shuffle and pick
      var shuffled = available.slice().sort(function () { return Math.random() - 0.5; });
      var selected = shuffled.slice(0, count);

      selected.forEach(function (qi) {
        questions.push({ code: code, state: state, qIdx: qi, q: pool[qi] });
      });

      strategyMap[code] = { state: state, count: selected.length, correct: 0, qIndices: selected };
    });

    // Global shuffle
    questions.sort(function () { return Math.random() - 0.5; });
    return { questions: questions, strategyMap: strategyMap };
  }

  // ── Session control ───────────────────────────────────────────────────────
  function startSession() {
    var built = buildSession();
    if (!built.questions.length) {
      UI.toast('No active strategies yet. Complete at least one strategy lesson first.', 'warning');
      return;
    }
    scSession = {
      questions: built.questions,
      strategyMap: built.strategyMap,
      qIndex: 0,
      correct: 0,
      answers: [],
      startMs: Date.now(),
      showingExplanation: false,
    };
    view = 'session';
    render();
  }

  function submitAnswer(choiceIdx) {
    var item = scSession.questions[scSession.qIndex];
    var correct = choiceIdx === item.q.a;

    if (correct) {
      scSession.correct++;
      scSession.strategyMap[item.code].correct++;
    }

    scSession.answers.push({
      code: item.code,
      section: SECTION_OF[item.code],
      strategyName: STRATEGY_NAMES[item.code] || item.code,
      state: item.state,
      questionText: item.q.q,
      chosen: choiceIdx,
      correct: correct,
      correctIdx: item.q.a,
      explanation: item.q.e,
    });

    markUsed(item.code, item.qIdx);

    // Show explanation before advancing
    scSession.showingExplanation = true;
    scSession.lastCorrect = correct;
    render();
  }

  function advanceQuestion() {
    scSession.showingExplanation = false;
    scSession.qIndex++;
    if (scSession.qIndex >= scSession.questions.length) {
      saveResults();
      view = 'results';
    }
    render();
  }

  function saveResults() {
    var durationMs = Date.now() - scSession.startMs;
    var total = scSession.questions.length;
    var correct = scSession.correct;
    var accuracy = total > 0 ? correct / total : 0;

    // Build per-strategy summary
    var stratResults = {};
    Object.keys(scSession.strategyMap).forEach(function (code) {
      var sm = scSession.strategyMap[code];
      stratResults[code] = {
        priorState: sm.state,
        asked: sm.count,
        correct: sm.correct,
        accuracy: sm.count > 0 ? sm.correct / sm.count : 0,
      };
    });

    var entry = {
      date: Date.now(),
      totalQuestions: total,
      correct: correct,
      accuracy: accuracy,
      durationMs: durationMs,
      strategyResults: stratResults,
    };

    // Persist
    var history = getHistory();
    history.unshift(entry);
    Storage.setPath('skillsCheck.history', history);
    Storage.setPath('skillsCheck.last', entry);

    // Write to masteryHistory per strategy (soft signal)
    Object.keys(stratResults).forEach(function (code) {
      var sr = stratResults[code];
      var existing = Storage.getPath('masteryHistory.' + code, []);
      existing.push({
        date: Date.now(),
        source: 'skills_check',
        accuracy: sr.accuracy,
        correct: sr.correct,
        asked: sr.asked,
        state: sr.priorState,
      });
      Storage.setPath('masteryHistory.' + code, existing);
    });

    // Gamification: 5 pts per correct + 50 completion bonus
    var pts = correct * 5 + 50;
    var gam = Storage.getGamification();
    var newTotal = (gam.totalPoints || gam.points || 0) + pts;
    Storage.setPath('gamification.points', newTotal);

    // Session record
    Storage.addSession({
      date: new Date().toISOString(),
      module: 'skills_check',
      durationMinutes: Math.round(durationMs / 60000),
      questionsAnswered: total,
      correct: correct,
      points: pts,
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function daysSince(ts) {
    if (!ts) return Infinity;
    return Math.floor((Date.now() - ts) / 86400000);
  }

  function fmtDate(ts) {
    if (!ts) return 'Never';
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function fmtDuration(ms) {
    var s = Math.round(ms / 1000);
    var m = Math.floor(s / 60);
    var rem = s % 60;
    return m + 'm ' + (rem < 10 ? '0' : '') + rem + 's';
  }

  function pct(v) { return Math.round(v * 100) + '%'; }

  function accuracyColor(acc) {
    if (acc >= STRONG_THRESHOLD) return 'var(--success,#22c55e)';
    if (acc >= WEAK_THRESHOLD) return '#f59e0b';
    return 'var(--danger,#ef4444)';
  }

  function accuracyLabel(acc) {
    if (acc >= STRONG_THRESHOLD) return 'Strong';
    if (acc >= WEAK_THRESHOLD) return 'Developing';
    return 'Needs Work';
  }

  function masteryDot(state) {
    var el = document.createElement('span');
    el.className = 'de-mastery-dot ' + state;
    return el;
  }

  function stateBadge(state) {
    var colors = {
      not_started: '#9ca3af',
      in_progress: '#f59e0b',
      developing: '#3b82f6',
      mastered: '#22c55e',
      elite: '#a855f7',
    };
    var labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      developing: 'Developing',
      mastered: 'Mastered',
      elite: 'Elite',
    };
    var span = document.createElement('span');
    span.style.cssText = 'font-size:0.68rem;font-weight:700;padding:2px 8px;border-radius:20px;' +
      'background:' + colors[state] + '22;color:' + colors[state] + ';white-space:nowrap;';
    span.textContent = labels[state] || state;
    return span;
  }

  // Count active strategies and estimate questions
  function getPreviewStats() {
    var activeCount = 0;
    var estimatedQ = 0;
    ALL_CODES.forEach(function (code) {
      var state = getMasteryState(code);
      if (state === 'not_started') return;
      activeCount++;
      estimatedQ += QS_PER_STATE[state] || 1;
    });
    return { activeCount: activeCount, estimatedQ: estimatedQ };
  }

  // Get drill recommendations from Skills Check results (worst accuracy first)
  function getDrillRecs(stratResults) {
    var entries = Object.keys(stratResults).map(function (code) {
      return { code: code, accuracy: stratResults[code].accuracy, state: stratResults[code].priorState };
    });
    entries.sort(function (a, b) { return a.accuracy - b.accuracy; });
    return entries.slice(0, 5);
  }

  // Compare with previous check
  function compareWithPrev(stratResults) {
    var history = getHistory();
    if (history.length < 2) return null; // current is [0], prev is [1]
    var prev = history[1].strategyResults;
    var improved = [];
    var regressed = [];
    Object.keys(stratResults).forEach(function (code) {
      if (!prev[code]) return;
      var delta = stratResults[code].accuracy - prev[code].accuracy;
      if (delta >= 0.15) improved.push({ code: code, delta: delta });
      else if (delta <= -0.15) regressed.push({ code: code, delta: delta });
    });
    return { improved: improved, regressed: regressed };
  }

  // ── RENDER: Overview ─────────────────────────────────────────────────────
  function renderOverview() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'padding:var(--content-padding,24px);max-width:820px;';

    var last = getLastCheck();
    var days = daysSince(last ? last.date : null);
    var stats = getPreviewStats();
    var prevAcc = last ? Math.round(last.accuracy * 100) : null;

    // Header
    var hdr = document.createElement('div');
    hdr.innerHTML = '<h1 style="font-size:1.6rem;font-weight:800;color:var(--text-primary);margin-bottom:4px;">Skills Check</h1>' +
      '<p style="color:var(--text-secondary);font-size:0.92rem;margin-bottom:24px;">Internal strategy mastery check · Runs every 4 weeks · Results feed your drill queue</p>';
    wrap.appendChild(hdr);

    // Soft-lock warning
    if (days < SOFT_LOCK_DAYS && last) {
      var warn = document.createElement('div');
      warn.className = 'de-advance-gap';
      warn.style.cssText = 'padding:12px 16px;border-radius:10px;margin-bottom:20px;font-size:0.85rem;';
      warn.innerHTML = '<strong>⏳ Last check was ' + days + ' day' + (days !== 1 ? 's' : '') + ' ago.</strong> ' +
        'For the most accurate picture, wait until Day ' + SOFT_LOCK_DAYS + '. ' +
        'You can still run it now if you want a snapshot.';
      wrap.appendChild(warn);
    }

    // Stats row
    var statsRow = document.createElement('div');
    statsRow.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:28px;';

    var cards = [
      { label: 'Last Check', value: last ? fmtDate(last.date) : 'Never', icon: '📅' },
      { label: 'Last Score', value: prevAcc !== null ? prevAcc + '%' : '—', icon: '🎯' },
      { label: 'Active Strategies', value: stats.activeCount + ' / 51', icon: '📋' },
      { label: 'Est. Questions', value: stats.estimatedQ || 0, icon: '❓' },
    ];

    cards.forEach(function (c) {
      var card = document.createElement('div');
      card.style.cssText = 'background:var(--surface-raised);border:1px solid var(--border);border-radius:12px;padding:14px 16px;';
      card.innerHTML = '<div style="font-size:1.3rem;margin-bottom:4px;">' + c.icon + '</div>' +
        '<div style="font-size:1.1rem;font-weight:700;color:var(--text-primary);">' + c.value + '</div>' +
        '<div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">' + c.label + '</div>';
      statsRow.appendChild(card);
    });
    wrap.appendChild(statsRow);

    // What this checks
    var infoBox = document.createElement('div');
    infoBox.style.cssText = 'background:var(--surface-raised);border:1px solid var(--border);border-radius:12px;padding:16px 20px;margin-bottom:24px;';
    infoBox.innerHTML =
      '<h3 style="font-size:0.88rem;font-weight:700;color:var(--text-primary);margin-bottom:8px;">What this checks</h3>' +
      '<ul style="margin:0;padding-left:18px;color:var(--text-secondary);font-size:0.83rem;line-height:1.8;">' +
      '<li>Which of 51 strategies you\'re applying correctly</li>' +
      '<li>Are drill improvements transferring to mixed question sets?</li>' +
      '<li>Any new weak areas emerging?</li>' +
      '</ul>' +
      '<p style="margin:10px 0 0;font-size:0.78rem;color:var(--text-muted);">This does <strong>not</strong> update your projected score. Only Bluebook imports do that.</p>';
    wrap.appendChild(infoBox);

    // Previous history (last 3)
    var history = getHistory();
    if (history.length > 0) {
      var histTitle = document.createElement('h3');
      histTitle.style.cssText = 'font-size:0.88rem;font-weight:700;color:var(--text-primary);margin-bottom:10px;';
      histTitle.textContent = 'Previous Checks';
      wrap.appendChild(histTitle);

      var histTable = document.createElement('div');
      histTable.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-bottom:24px;';
      history.slice(0, 3).forEach(function (h, i) {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:12px;padding:8px 14px;background:var(--surface-raised);border:1px solid var(--border);border-radius:8px;font-size:0.82rem;';
        var accColor = accuracyColor(h.accuracy);
        row.innerHTML =
          '<span style="color:var(--text-muted);min-width:90px;">' + fmtDate(h.date) + '</span>' +
          '<span style="font-weight:700;color:' + accColor + ';">' + pct(h.accuracy) + '</span>' +
          '<span style="color:var(--text-muted);">' + h.correct + '/' + h.totalQuestions + ' correct</span>' +
          '<span style="color:var(--text-muted);margin-left:auto;">' + fmtDuration(h.durationMs) + '</span>';
        histTable.appendChild(row);
      });
      wrap.appendChild(histTable);
    }

    // CTA
    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;';

    if (stats.activeCount === 0) {
      var noActiveMsg = document.createElement('p');
      noActiveMsg.style.cssText = 'color:var(--text-muted);font-size:0.88rem;';
      noActiveMsg.textContent = 'No active strategies yet. Complete strategy lessons or drills first, then return here.';
      btnRow.appendChild(noActiveMsg);
    } else {
      var startBtn = document.createElement('button');
      startBtn.className = 'btn btn-primary btn-lg';
      startBtn.innerHTML = '<i data-lucide="play-circle" style="width:16px;height:16px;margin-right:6px;"></i>Start Skills Check (' + stats.estimatedQ + ' questions)';
      startBtn.addEventListener('click', startSession);
      btnRow.appendChild(startBtn);
    }

    wrap.appendChild(btnRow);
    return wrap;
  }

  // ── RENDER: Session ───────────────────────────────────────────────────────
  function renderSession() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'padding:var(--content-padding,24px);max-width:720px;';

    var item = scSession.questions[scSession.qIndex];
    var total = scSession.questions.length;
    var progress = scSession.qIndex / total;

    // Progress bar + counter
    var progWrap = document.createElement('div');
    progWrap.style.cssText = 'margin-bottom:20px;';
    progWrap.innerHTML =
      '<div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-muted);margin-bottom:6px;">' +
      '<span>' + STRATEGY_NAMES[item.code] + ' · <span class="de-code-badge" style="display:inline-block;">' + item.code + '</span></span>' +
      '<span>' + (scSession.qIndex + 1) + ' / ' + total + '</span></div>' +
      '<div style="height:6px;background:var(--border);border-radius:4px;overflow:hidden;">' +
      '<div style="width:' + Math.round(progress * 100) + '%;height:100%;background:var(--accent);border-radius:4px;transition:width 0.2s;"></div>' +
      '</div>';
    wrap.appendChild(progWrap);

    var q = item.q;

    // Passage (if any)
    if (q.p) {
      var passage = document.createElement('div');
      passage.style.cssText = 'background:var(--surface-raised);border-left:3px solid var(--accent);padding:14px 16px;border-radius:0 10px 10px 0;margin-bottom:16px;font-size:0.85rem;color:var(--text-secondary);line-height:1.7;';
      passage.textContent = q.p;
      wrap.appendChild(passage);
    }

    // Question text
    var qText = document.createElement('p');
    qText.style.cssText = 'font-size:0.95rem;font-weight:600;color:var(--text-primary);line-height:1.6;margin-bottom:18px;';
    qText.textContent = q.q;
    wrap.appendChild(qText);

    if (scSession.showingExplanation) {
      // Show explanation + correct answer highlight
      var expWrap = document.createElement('div');
      var lastAns = scSession.answers[scSession.answers.length - 1];

      q.c.forEach(function (choice, i) {
        var opt = document.createElement('div');
        var isCorrect = i === q.a;
        var isChosen = i === lastAns.chosen;
        var bg = isCorrect ? '#22c55e22' : (isChosen && !isCorrect ? '#ef444422' : 'var(--surface-raised)');
        var border = isCorrect ? '#22c55e' : (isChosen && !isCorrect ? '#ef4444' : 'var(--border)');
        opt.style.cssText = 'padding:11px 14px;border-radius:10px;border:1.5px solid ' + border + ';background:' + bg + ';margin-bottom:8px;font-size:0.87rem;color:var(--text-primary);display:flex;align-items:flex-start;gap:8px;';
        var icon = isCorrect ? '✓' : (isChosen && !isCorrect ? '✗' : '');
        opt.innerHTML = '<span style="font-weight:700;min-width:20px;color:' + border + ';">' + String.fromCharCode(65 + i) + (icon ? ' ' + icon : '') + '</span>' +
          '<span>' + choice + '</span>';
        expWrap.appendChild(opt);
      });

      var expBox = document.createElement('div');
      expBox.style.cssText = 'background:var(--surface-raised);border:1px solid var(--border);border-radius:10px;padding:14px 16px;margin:14px 0;font-size:0.83rem;color:var(--text-secondary);line-height:1.6;';
      expBox.innerHTML = '<strong style="color:var(--text-primary);">Explanation:</strong> ' + (q.e || '');
      expWrap.appendChild(expBox);

      var nextLabel = scSession.qIndex + 1 < scSession.questions.length ? 'Next Question' : 'See Results';
      var nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-primary';
      nextBtn.textContent = nextLabel + ' →';
      nextBtn.addEventListener('click', advanceQuestion);
      expWrap.appendChild(nextBtn);

      wrap.appendChild(expWrap);
    } else {
      // Choice buttons
      var choicesWrap = document.createElement('div');
      q.c.forEach(function (choice, i) {
        var opt = document.createElement('button');
        opt.style.cssText = 'display:flex;align-items:flex-start;gap:10px;width:100%;text-align:left;padding:12px 14px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface-raised);margin-bottom:8px;cursor:pointer;font-size:0.87rem;color:var(--text-primary);transition:border-color 0.15s,background 0.15s;';
        opt.innerHTML = '<span style="font-weight:700;min-width:20px;color:var(--accent);">' + String.fromCharCode(65 + i) + '</span><span>' + choice + '</span>';
        opt.addEventListener('mouseenter', function () { opt.style.borderColor = 'var(--accent)'; });
        opt.addEventListener('mouseleave', function () { opt.style.borderColor = 'var(--border)'; });
        opt.addEventListener('click', function () { submitAnswer(i); });
        choicesWrap.appendChild(opt);
      });
      wrap.appendChild(choicesWrap);

      // Skip / quit row
      var skipRow = document.createElement('div');
      skipRow.style.cssText = 'display:flex;gap:10px;margin-top:8px;';
      var quitBtn = document.createElement('button');
      quitBtn.className = 'btn btn-ghost btn-sm';
      quitBtn.textContent = '✕ Exit Check';
      quitBtn.addEventListener('click', function () {
        // Was a blocking native confirm() — same anti-pattern fixed in
        // drill-engine.js (see DrillEngineModule de-session-exit handler).
        // Native dialogs block JS execution, are visually inconsistent with
        // the app's custom modal system, and froze automated browser testing
        // when triggered. Swapped to UI.confirm() to match the established
        // pattern (also used by the Reset App flow in app.js).
        UI.confirm({
          title: 'Exit Skills Check?',
          message: 'Progress on this check won\'t be saved.',
          confirmText: 'Exit',
          cancelText: 'Keep Going',
          danger: true,
        }).then(function (ok) {
          if (ok) {
            view = 'overview';
            scSession = null;
            render();
          }
        });
      });
      skipRow.appendChild(quitBtn);
      wrap.appendChild(skipRow);
    }

    return wrap;
  }

  // ── RENDER: Results ───────────────────────────────────────────────────────
  function renderResults() {
    var wrap = document.createElement('div');
    wrap.style.cssText = 'padding:var(--content-padding,24px);max-width:820px;';

    var last = getLastCheck();
    var history = getHistory();
    var stratResults = last.strategyResults;
    var prev = history.length > 1 ? history[1].strategyResults : null;

    var durationStr = fmtDuration(last.durationMs);
    var accPct = Math.round(last.accuracy * 100);
    var qPerMin = last.durationMs > 0 ? (last.totalQuestions / (last.durationMs / 60000)).toFixed(1) : '—';

    // ── Score card ──
    var scoreCard = document.createElement('div');
    scoreCard.style.cssText = 'background:var(--surface-raised);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:24px;text-align:center;';

    var prevAccPct = prev ? Math.round(history[1].accuracy * 100) : null;
    var deltaTxt = '';
    if (prevAccPct !== null) {
      var delta = accPct - prevAccPct;
      deltaTxt = '<span style="font-size:0.85rem;color:' + (delta >= 0 ? '#22c55e' : '#ef4444') + ';font-weight:600;">' +
        (delta >= 0 ? '↑' : '↓') + ' ' + Math.abs(delta) + '% from last check</span>';
    }

    scoreCard.innerHTML =
      '<div style="font-size:2.8rem;font-weight:800;color:' + accuracyColor(last.accuracy) + ';">' + accPct + '%</div>' +
      '<div style="font-size:1rem;color:var(--text-secondary);margin:4px 0;">' + last.correct + ' / ' + last.totalQuestions + ' correct</div>' +
      deltaTxt +
      '<div style="display:flex;justify-content:center;gap:24px;margin-top:12px;">' +
      '<div style="text-align:center;"><div style="font-size:0.9rem;font-weight:600;color:var(--text-primary);">' + durationStr + '</div><div style="font-size:0.7rem;color:var(--text-muted);">Total time</div></div>' +
      '<div style="text-align:center;"><div style="font-size:0.9rem;font-weight:600;color:var(--text-primary);">' + qPerMin + '/min</div><div style="font-size:0.7rem;color:var(--text-muted);">Questions/min</div></div>' +
      '<div style="text-align:center;"><div style="font-size:0.9rem;font-weight:600;color:var(--text-primary);">' + Object.keys(stratResults).length + '</div><div style="font-size:0.7rem;color:var(--text-muted);">Strategies tested</div></div>' +
      '</div>';
    wrap.appendChild(scoreCard);

    // ── Coach message ──
    var coachMsg = buildCoachMessage(last, prev);
    var coachBox = document.createElement('div');
    coachBox.className = 'coaching-card';
    coachBox.style.cssText = 'margin-bottom:24px;';
    coachBox.innerHTML = '<div class="coaching-card-icon">🎯</div><div class="coaching-card-content"><strong>Coach Feedback</strong><p style="margin:6px 0 0;font-size:0.87rem;line-height:1.6;">' + coachMsg + '</p></div>';
    wrap.appendChild(coachBox);

    // ── Highlights ──
    var strong = [];
    var needsWork = [];
    var middle = [];
    Object.keys(stratResults).forEach(function (code) {
      var sr = stratResults[code];
      if (sr.accuracy >= STRONG_THRESHOLD) strong.push(code);
      else if (sr.accuracy < WEAK_THRESHOLD) needsWork.push(code);
      else middle.push(code);
    });

    if (strong.length || needsWork.length) {
      var hlRow = document.createElement('div');
      hlRow.className = 'sc-highlight-row';
      hlRow.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px;';

      if (strong.length) {
        var strongBox = document.createElement('div');
        strongBox.style.cssText = 'background:#22c55e18;border:1px solid #22c55e55;border-radius:12px;padding:14px 16px;';
        strongBox.innerHTML = '<div style="font-size:0.75rem;font-weight:700;color:#22c55e;margin-bottom:8px;">✓ STRONG (' + strong.length + ')</div>' +
          strong.map(function (c) { return '<div style="font-size:0.78rem;color:var(--text-secondary);padding:2px 0;">' +
            '<span class="de-code-badge" style="margin-right:4px;">' + c + '</span>' + (STRATEGY_NAMES[c] || c) + '</div>'; }).join('');
        hlRow.appendChild(strongBox);
      }

      if (needsWork.length) {
        var weakBox = document.createElement('div');
        weakBox.style.cssText = 'background:#ef444418;border:1px solid #ef444455;border-radius:12px;padding:14px 16px;';
        weakBox.innerHTML = '<div style="font-size:0.75rem;font-weight:700;color:#ef4444;margin-bottom:8px;">⚠ NEEDS WORK (' + needsWork.length + ')</div>' +
          needsWork.map(function (c) { return '<div style="font-size:0.78rem;color:var(--text-secondary);padding:2px 0;">' +
            '<span class="de-code-badge" style="margin-right:4px;">' + c + '</span>' + (STRATEGY_NAMES[c] || c) + '</div>'; }).join('');
        hlRow.appendChild(weakBox);
      }

      wrap.appendChild(hlRow);
    }

    // ── Change from last check ──
    var compare = compareWithPrev(stratResults);
    if (compare && (compare.improved.length || compare.regressed.length)) {
      var changeTitle = document.createElement('h3');
      changeTitle.style.cssText = 'font-size:0.88rem;font-weight:700;color:var(--text-primary);margin-bottom:10px;';
      changeTitle.textContent = 'Changes Since Last Check';
      wrap.appendChild(changeTitle);

      var changeRow = document.createElement('div');
      changeRow.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;';

      compare.improved.forEach(function (e) {
        var chip = document.createElement('span');
        chip.style.cssText = 'font-size:0.78rem;padding:3px 10px;border-radius:20px;background:#22c55e22;color:#22c55e;font-weight:600;';
        chip.textContent = '↑ ' + e.code + ' +' + Math.round(e.delta * 100) + '%';
        changeRow.appendChild(chip);
      });
      compare.regressed.forEach(function (e) {
        var chip = document.createElement('span');
        chip.style.cssText = 'font-size:0.78rem;padding:3px 10px;border-radius:20px;background:#ef444422;color:#ef4444;font-weight:600;';
        chip.textContent = '↓ ' + e.code + ' ' + Math.round(e.delta * 100) + '%';
        changeRow.appendChild(chip);
      });

      wrap.appendChild(changeRow);
    }

    // ── Drill recommendations ──
    var recs = getDrillRecs(stratResults);
    if (recs.length) {
      var recTitle = document.createElement('h3');
      recTitle.style.cssText = 'font-size:0.88rem;font-weight:700;color:var(--text-primary);margin-bottom:10px;';
      recTitle.textContent = 'Drill These Next';
      wrap.appendChild(recTitle);

      var recList = document.createElement('div');
      recList.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-bottom:24px;';
      recs.forEach(function (r) {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--surface-raised);border:1px solid var(--border);border-radius:10px;';
        var accBar = '<div style="flex:1;height:6px;background:var(--border);border-radius:4px;overflow:hidden;min-width:60px;">' +
          '<div style="width:' + Math.round(r.accuracy * 100) + '%;height:100%;background:' + accuracyColor(r.accuracy) + ';border-radius:4px;"></div></div>';
        row.innerHTML =
          '<span class="de-code-badge">' + r.code + '</span>' +
          '<span style="flex:1;font-size:0.83rem;color:var(--text-primary);">' + (STRATEGY_NAMES[r.code] || r.code) + '</span>' +
          accBar +
          '<span style="font-size:0.78rem;font-weight:700;color:' + accuracyColor(r.accuracy) + ';min-width:36px;text-align:right;">' + pct(r.accuracy) + '</span>';
        recList.appendChild(row);
      });
      wrap.appendChild(recList);
    }

    // ── Full breakdown (collapsible) ──
    var breakdownDetails = document.createElement('details');
    breakdownDetails.style.cssText = 'margin-bottom:24px;';
    var breakdownSummary = document.createElement('summary');
    breakdownSummary.style.cssText = 'font-size:0.88rem;font-weight:700;color:var(--text-primary);cursor:pointer;padding:8px 0;';
    breakdownSummary.textContent = 'Full Strategy Breakdown (' + Object.keys(stratResults).length + ' strategies)';
    breakdownDetails.appendChild(breakdownSummary);

    // Group by section
    var sections = {};
    Object.keys(stratResults).forEach(function (code) {
      var sec = SECTION_OF[code] || 'Other';
      if (!sections[sec]) sections[sec] = [];
      sections[sec].push(code);
    });

    Object.keys(sections).forEach(function (sec) {
      var secLabel = document.createElement('div');
      secLabel.style.cssText = 'font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-muted);padding:12px 0 4px;';
      secLabel.textContent = sec;
      breakdownDetails.appendChild(secLabel);

      sections[sec].forEach(function (code) {
        var sr = stratResults[code];
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);';

        var accBar = '<div style="width:80px;height:5px;background:var(--border);border-radius:4px;overflow:hidden;">' +
          '<div style="width:' + Math.round(sr.accuracy * 100) + '%;height:100%;background:' + accuracyColor(sr.accuracy) + ';border-radius:4px;"></div></div>';

        var prevDelta = '';
        if (prev && prev[code]) {
          var d = sr.accuracy - prev[code].accuracy;
          if (Math.abs(d) >= 0.10) {
            prevDelta = '<span style="font-size:0.7rem;color:' + (d >= 0 ? '#22c55e' : '#ef4444') + ';font-weight:600;">' +
              (d >= 0 ? '↑' : '↓') + Math.abs(Math.round(d * 100)) + '%</span>';
          }
        }

        row.innerHTML =
          '<span class="de-code-badge" style="min-width:36px;text-align:center;">' + code + '</span>' +
          '<span style="flex:1;font-size:0.82rem;color:var(--text-primary);">' + (STRATEGY_NAMES[code] || code) + '</span>' +
          accBar +
          '<span style="font-size:0.8rem;font-weight:700;color:' + accuracyColor(sr.accuracy) + ';min-width:36px;text-align:right;">' + pct(sr.accuracy) + '</span>' +
          '<span style="font-size:0.75rem;color:var(--text-muted);min-width:50px;text-align:right;">' + sr.correct + '/' + sr.asked + '</span>' +
          prevDelta;
        breakdownDetails.appendChild(row);
      });
    });

    wrap.appendChild(breakdownDetails);

    // ── Question-by-question review (collapsible) ──
    var reviewDetails = document.createElement('details');
    reviewDetails.style.cssText = 'margin-bottom:24px;';
    var reviewSummary = document.createElement('summary');
    reviewSummary.style.cssText = 'font-size:0.88rem;font-weight:700;color:var(--text-primary);cursor:pointer;padding:8px 0;';
    reviewSummary.textContent = 'Review All Answers (' + scSession.answers.length + ')';
    reviewDetails.appendChild(reviewSummary);

    scSession.answers.forEach(function (ans, i) {
      var row = document.createElement('div');
      row.style.cssText = 'padding:12px;margin:6px 0;border-radius:10px;border:1px solid ' +
        (ans.correct ? '#22c55e55' : '#ef444455') + ';background:' +
        (ans.correct ? '#22c55e10' : '#ef444410') + ';';
      row.innerHTML =
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
        '<span style="font-size:0.85rem;">' + (ans.correct ? '✓' : '✗') + '</span>' +
        '<span class="de-code-badge">' + ans.code + '</span>' +
        '<span style="font-size:0.78rem;color:var(--text-muted);">' + ans.strategyName + '</span>' +
        '</div>' +
        '<div style="font-size:0.82rem;color:var(--text-primary);margin-bottom:6px;">' + ans.questionText + '</div>' +
        '<div style="font-size:0.78rem;color:var(--text-muted);">' + ans.explanation + '</div>';
      reviewDetails.appendChild(row);
    });
    wrap.appendChild(reviewDetails);

    // ── Actions ──
    var actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:12px;flex-wrap:wrap;padding-bottom:24px;';

    var drillBtn = document.createElement('button');
    drillBtn.className = 'btn btn-primary';
    drillBtn.innerHTML = '<i data-lucide="zap" style="width:14px;height:14px;margin-right:6px;"></i>Go to Drill Engine';
    drillBtn.addEventListener('click', function () { Router.navigate('/drill-engine'); });
    actions.appendChild(drillBtn);

    var againBtn = document.createElement('button');
    againBtn.className = 'btn btn-ghost';
    againBtn.innerHTML = '<i data-lucide="rotate-ccw" style="width:14px;height:14px;margin-right:6px;"></i>Back to Overview';
    againBtn.addEventListener('click', function () {
      view = 'overview';
      scSession = null;
      render();
    });
    actions.appendChild(againBtn);

    wrap.appendChild(actions);
    return wrap;
  }

  // ── Coach message generator ───────────────────────────────────────────────
  function buildCoachMessage(check, prev) {
    var acc = check.accuracy;
    var total = check.totalQuestions;
    var stratCount = Object.keys(check.strategyResults).length;

    var prevAcc = prev ? prev.accuracy : null;
    var improvement = prevAcc !== null ? acc - prevAcc : null;

    if (total === 0) return 'No strategies were tested this session. Add more lessons to grow your question bank.';

    var base = '';
    if (acc >= 0.85) {
      base = 'Outstanding work across ' + stratCount + ' strategies — your drilling is clearly paying off. ';
    } else if (acc >= 0.70) {
      base = 'Solid performance on ' + stratCount + ' strategies. You\'re building real consistency. ';
    } else if (acc >= 0.55) {
      base = 'You\'re making progress. There are clear areas to push on — focus your drills on the "Needs Work" strategies above. ';
    } else {
      base = 'This check reveals real gaps. That\'s valuable information. Pick the top 2-3 weakest strategies and drill them this week before retaking. ';
    }

    if (improvement !== null) {
      if (improvement >= 0.10) {
        base += 'You improved ' + Math.round(improvement * 100) + '% since your last check — that\'s meaningful progress. ';
      } else if (improvement <= -0.10) {
        base += 'Your score dropped ' + Math.abs(Math.round(improvement * 100)) + '% from last time. Check if you\'ve been consistent with drills — gaps compound fast. ';
      } else {
        base += 'Your score held steady from last check. ';
      }
    }

    // Drill CTA
    var needsWork = Object.keys(check.strategyResults).filter(function (c) {
      return check.strategyResults[c].accuracy < WEAK_THRESHOLD;
    });
    if (needsWork.length > 0) {
      base += 'Priority drill targets: ' + needsWork.slice(0, 3).join(', ') + '.';
    }

    return base;
  }

  // ── Main render ───────────────────────────────────────────────────────────
  function render() {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    var content;
    if (view === 'session') content = renderSession();
    else if (view === 'results') content = renderResults();
    else content = renderOverview();
    containerEl.appendChild(content);
    if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  return {
    render: function () {
      containerEl = document.getElementById('page-container');
      view = 'overview';
      render();
    },
    reset: function () {
      view = 'overview';
      scSession = null;
    },
  };

})();
