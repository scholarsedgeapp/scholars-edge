/* ============================================================
   SCHOLAR'S EDGE — Drill Engine (Module 6)
   Adaptive spaced-repetition drill system.
   Unlocks 'mastered' and 'elite' mastery states.

   Session:  5 questions per strategy (shuffled each time)
   Levels:   1 → 5 per strategy, stored in drillLevels.<CODE>
   Gap rules:
     L1 → L2: 80%+, no gap
     L2 → L3: 80%+, no gap
     L3 → L4: 80%+, 3-day gap  → state stays 'developing'
     L4 → L5: 80%+, 7-day gap  → state → 'mastered'
     L5+:     90%+, 14-day gap → state → 'elite'
   ============================================================ */

const DrillEngineModule = (() => {
  'use strict';

  // ── CONSTANTS ──────────────────────────────────────────── //

  const LEVEL_REQ = {
    1: { accuracy: 0.80, gapDays: 0  },
    2: { accuracy: 0.80, gapDays: 0  },
    3: { accuracy: 0.80, gapDays: 3  },
    4: { accuracy: 0.80, gapDays: 7  },
    5: { accuracy: 0.90, gapDays: 14 },
  };

  const MAX_LEVEL    = 5;
  const SESSION_SIZE = 5;

  // ── AFFIRMATION LIBRARY ────────────────────────────────── //
  // 3 pools: preDrill (before session), midDrill (after 3 wrong in a row),
  // endSession (before results screen). Mix of faith-based + secular.
  // Designed for a 16-year-old. One punchy sentence. Say out loud.

  const AFFIRMATIONS = {
    preDrill: [
      "God didn't give me a spirit of fear — He gave me power, a sound mind, and the ability to figure this out.",
      "God gives wisdom to anyone who asks. I’m asking.",
      "God won’t give me anything I can’t handle. This drill is not the exception.",
      "I don’t have to be perfect. I have to show up. I showed up.",
      "Every question I attempt makes me better. That’s the only goal right now.",
    ],
    midDrill: [
      "I don’t know this yet. Yet is the most important word in learning.",
      "Getting these wrong in practice means I won’t get them wrong on test day. This is the point.",
      "I am still being built. God isn’t done with me yet.",
      "Wrong answers aren’t proof I can’t do this. They’re the map to where I need to go.",
      "I’ve already answered questions correctly today. I’m not starting from zero.",
      "Desmos doesn’t take the test — I do. Skip the calculator if I need to. Work the problem.",
      "I haven’t learned everything yet. That’s exactly why I’m here.",
      "Eliminating wrong answers and committing is a strategy. That’s not a guess — that’s how smart test-takers work.",
    ],
    endSession: [
      "I put in the work today. God sees effort. So does my score.",
      "I am smarter today than I was yesterday. God made me capable of growth.",
      "I showed up. That matters more than I think.",
      "Every session is a deposit. I just made one.",
      "The version of me that started this drill is already behind the version finishing it.",
      "The score is data — not a verdict. Looking at it is part of the work.",
    ],
  };

  const SECTION_CODES = {
    'Universal':        ['U1','U2','U3','U4','U5','U6','U7'],
    'Reading Elim.':    ['R1','R2','R3','R4','R5','R6','R7','R8'],
    'Reading Passage':  ['R9','R10','R11','R12','R13'],
    'Grammar':          ['G1','G2','G3','G4','G5','G6','G7'],
    'Math Core':        ['M1','M2','M3','M4','M5','M6','M7','M8','M9'],
    'Desmos':           ['M10','M11','M12','M13','M14','M15'],
    'CLT':              ['C1','C2','C3','C4'],
    'Mindset':          ['MN1','MN2','MN3','MN4','MN5'],
  };

  // ── MODULE STATE ───────────────────────────────────────── //

  let view        = 'overview'; // 'overview' | 'picker' | 'session' | 'results'
  let activeCode  = null;
  let drillSession = null;
  // drillSession shape:
  // { code, questions:[{p,q,c,a,e}], qIndex, correct, answers:[{chosen,correct,q,correctAns}], startMs }
  let containerEl = null;

  // ── ENGINE ─────────────────────────────────────────────── //

  function getDrillLevel(code) {
    return Storage.getPath('drillLevels.' + code, 1);
  }

  function setDrillLevel(code, level) {
    Storage.setPath('drillLevels.' + code, Math.min(Math.max(level, 1), MAX_LEVEL));
  }

  function getLastDrillDate(code) {
    const history = Storage.getPath('masteryHistory.' + code, []);
    const deEntries = history.filter(function(e) { return e.source === 'drill_engine'; });
    if (!deEntries.length) return null;
    return deEntries.sort(function(a, b) { return new Date(b.date) - new Date(a.date); })[0].date;
  }

  function getDaysSinceLastDrill(code) {
    const last = getLastDrillDate(code);
    if (!last) return Infinity;
    return (Date.now() - new Date(last).getTime()) / 86400000;
  }

  function isReadyForSession(code) {
    const level = getDrillLevel(code);
    const req   = LEVEL_REQ[level] || LEVEL_REQ[5];
    if (req.gapDays === 0) return true;
    return getDaysSinceLastDrill(code) >= req.gapDays;
  }

  function daysUntilReady(code) {
    const level = getDrillLevel(code);
    const req   = LEVEL_REQ[level] || LEVEL_REQ[5];
    if (req.gapDays === 0) return 0;
    return Math.max(0, Math.ceil(req.gapDays - getDaysSinceLastDrill(code)));
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function buildSessionQuestions(code) {
    var pool = (DE_QUESTIONS[code] || []).slice();
    return shuffle(pool).slice(0, SESSION_SIZE);
  }

  // Returns advancement metadata; also writes to storage.
  function applyAdvancement(code, accuracy) {
    var level       = getDrillLevel(code);
    var currentState = Storage.getPath('strategyMastery.' + code, 'not_started');
    var req         = LEVEL_REQ[level] || LEVEL_REQ[5];
    var daysSince   = getDaysSinceLastDrill(code);
    var accuracyMet = accuracy >= req.accuracy;
    var gapMet      = daysSince >= req.gapDays || req.gapDays === 0;

    var newLevel  = level;
    var newState  = currentState;
    var levelUp   = false;
    var stateUp   = false;
    var gapRequired = false;

    if (accuracyMet) {
      if (gapMet) {
        // Advance level
        if (level < MAX_LEVEL) {
          newLevel = level + 1;
          levelUp  = true;
        }
        // Advance mastery state based on NEW level
        var effectiveLevel = levelUp ? newLevel : level;
        if (effectiveLevel >= 5 && currentState === 'mastered') {
          newState = 'elite'; stateUp = true;
        } else if (effectiveLevel >= 5 && currentState !== 'mastered' && currentState !== 'elite') {
          newState = 'mastered'; stateUp = true;
        } else if (effectiveLevel >= 4 && (currentState === 'not_started' || currentState === 'in_progress' || currentState === 'developing')) {
          newState = 'mastered'; stateUp = true;
        } else if (effectiveLevel >= 3 && (currentState === 'not_started' || currentState === 'in_progress')) {
          newState = 'developing'; stateUp = true;
        } else if (effectiveLevel >= 2 && currentState === 'not_started') {
          newState = 'in_progress'; stateUp = true;
        }
      } else {
        gapRequired = true;
      }
    }

    // Always log the session to masteryHistory
    var history = Storage.getPath('masteryHistory.' + code, []);
    history.push({
      date:     new Date().toISOString(),
      accuracy: accuracy,
      level:    level,
      source:   'drill_engine',
    });
    Storage.setPath('masteryHistory.' + code, history);

    // Apply level + state changes
    if (levelUp)  setDrillLevel(code, newLevel);
    if (stateUp)  Storage.updateStrategyMastery(code, newState);

    // Points: base + per-correct + perfect bonus
    var correct = Math.round(accuracy * SESSION_SIZE);
    var bonus   = accuracy >= 1.0 ? 30 : (accuracy >= 0.8 ? 15 : 0);
    Storage.addPoints(15 + correct * 8 + bonus);

    // Session log
    Storage.addSession({
      strategy:           code,
      questionsAttempted: SESSION_SIZE,
      questionsCorrect:   correct,
      accuracy:           accuracy,
      durationMinutes:    drillSession ? Math.round((Date.now() - drillSession.startMs) / 60000) : 1,
      bandLevel:          newLevel,
      frustrationFlagged: accuracy < 0.4,
    });

    return { newLevel: newLevel, newState: newState, levelUp: levelUp, stateUp: stateUp,
             gapRequired: gapRequired, gapDays: req.gapDays, accuracy: accuracy };
  }

  function getRecommendationScore(code) {
    var state = Storage.getPath('strategyMastery.' + code, 'not_started');
    var level = getDrillLevel(code);
    var stateScore = { not_started: 30, in_progress: 50, developing: 70, mastered: 20, elite: 5 };
    var score = stateScore[state] || 30;
    score += isReadyForSession(code) ? 25 : 0;
    score -= (level - 1) * 5;
    return score;
  }

  function getRecommendations(limit) {
    limit = limit || 6;
    var allCodes = Object.keys(Storage.getStrategyMastery());
    return allCodes
      .map(function(code) { return { code: code, score: getRecommendationScore(code) }; })
      .sort(function(a, b) { return b.score - a.score; })
      .slice(0, limit)
      .map(function(x) { return x.code; });
  }

  // ── UI HELPERS ─────────────────────────────────────────── //

  function showScreen(html, wireFn) {
    if (!containerEl) containerEl = document.getElementById('page-container');
    containerEl.innerHTML = html;
    if (wireFn) wireFn();
    // Scroll reset — same fix as strategy-course.js's showScreen: #main-content
    // has no overflow rule, so window is the real scrolling element. Without
    // this, internal screen swaps (e.g. Results -> "Back to Drill Engine")
    // leave the page scrolled to wherever the previous screen was.
    window.scrollTo(0, 0);
    var mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;
  }

  function masteryColor(state) {
    var m = { not_started:'#94a3b8', in_progress:'#f59e0b', developing:'#3b82f6', mastered:'#22c55e', elite:'#a855f7' };
    return m[state] || '#94a3b8';
  }

  function masteryLabel(state) {
    var m = { not_started:'Not Started', in_progress:'In Progress', developing:'Developing', mastered:'Mastered', elite:'Elite' };
    return m[state] || state;
  }

  function levelBarHtml(level) {
    var pct = Math.round((level / MAX_LEVEL) * 100);
    return '<div class="de-level-bar-wrap"><div class="de-level-bar" style="width:' + pct + '%"></div></div>';
  }

  function readinessPill(code) {
    if (isReadyForSession(code)) return '<span class="de-ready-pill">Ready</span>';
    var d = daysUntilReady(code);
    return '<span class="de-cooldown-pill">+' + d + 'd</span>';
  }

  function dotProgressHtml(total, current) {
    var html = '<div class="drill-dots">';
    for (var i = 0; i < total; i++) {
      if (i < current)       html += '<span class="drill-dot done"></span>';
      else if (i === current) html += '<span class="drill-dot active"></span>';
      else                    html += '<span class="drill-dot"></span>';
    }
    html += '</div>';
    return html;
  }

  // ── AFFIRMATION & BREATHING HELPERS ───────────────────── //

  function pickAffirmation(context) {
    var pool = AFFIRMATIONS[context] || AFFIRMATIONS.preDrill;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Shows a centered affirmation card modal.
  // context: 'preDrill' | 'midDrill' | 'endSession'
  // onDone: callback when user taps "I said it" or "Skip"
  function showAffirmationCard(context, onDone) {
    var text = pickAffirmation(context);
    var titles = {
      preDrill:   '🎯 Before You Begin',
      midDrill:   '⏸️ Take a Moment',
      endSession: '🌟 You Did the Work',
    };
    var showBreath = (context === 'preDrill');

    UI.modal({
      title: titles[context] || '🎯 Check In',
      body:
        '<div style="text-align:center;padding:8px 0 12px;">'
        + '<div style="'
          + 'font-size:1.05rem;font-weight:700;color:var(--color-neutral-800);'
          + 'line-height:1.65;padding:18px 20px;'
          + 'background:var(--color-primary-50);'
          + 'border-left:4px solid var(--color-primary-400);'
          + 'border-radius:8px;text-align:left;margin-bottom:14px;">'
        + '“' + text + '”'
        + '</div>'
        + '<p style="color:var(--color-neutral-500);font-size:0.88rem;margin:0;">'
        + 'Say this out loud — one time.'
        + '</p></div>',
      footer:
        (showBreath
          ? '<button class="btn btn-ghost btn-sm" id="aff-breath-btn" style="margin-right:auto;">🌬️ Take a breath first</button>'
          : '')
        + '<button class="btn btn-secondary" id="aff-skip-btn">Skip</button>'
        + '<button class="btn btn-primary" id="aff-done-btn">I said it ✓</button>',
      size: 'sm',
    });

    setTimeout(function() {
      var done  = document.getElementById('aff-done-btn');
      var skip  = document.getElementById('aff-skip-btn');
      var breath = document.getElementById('aff-breath-btn');
      if (done)  done.addEventListener('click',  function() { UI.closeModal(); onDone(); });
      if (skip)  skip.addEventListener('click',  function() { UI.closeModal(); onDone(); });
      if (breath) breath.addEventListener('click', function() {
        UI.closeModal();
        showBreathingModal(onDone);
      });
    }, 80);
  }

  // Shows a 4-7-8 breathing modal. Animated circle, countdown,
  // auto-advances through phases. Skip available throughout.
  function showBreathingModal(onDone) {
    UI.modal({
      title: '🌬️ One Round: 4–7–8',
      body:
        '<div style="text-align:center;padding:12px 0 4px;">'
        + '<div id="breath-circle" style="'
          + 'width:110px;height:110px;border-radius:50%;'
          + 'background:radial-gradient(circle,var(--color-primary-100) 0%,var(--color-primary-200) 100%);'
          + 'border:3px solid var(--color-primary-400);'
          + 'margin:0 auto 18px;'
          + 'display:flex;align-items:center;justify-content:center;'
          + 'font-size:2rem;font-weight:800;color:var(--color-primary-700);'
          + 'transform:scale(0.75);'
          + 'transition:transform 4s ease-in-out;">'
        + '<span id="breath-count">4</span>'
        + '</div>'
        + '<div id="breath-label" style="font-size:1rem;font-weight:600;color:var(--color-neutral-700);margin-bottom:6px;">'
        + 'Breathe in through your nose...</div>'
        + '<div id="breath-sub" style="font-size:0.83rem;color:var(--color-neutral-400);">'
        + 'inhale • 4 seconds</div>'
        + '</div>',
      footer: '<button class="btn btn-secondary" id="breath-skip-btn">Skip</button>',
      size: 'sm',
    });

    setTimeout(function() {
      var skip = document.getElementById('breath-skip-btn');
      if (skip) skip.addEventListener('click', function() { UI.closeModal(); onDone(); });
      runBreathPhases(onDone);
    }, 80);
  }

  function runBreathPhases(onDone) {
    var phases = [
      { label: 'Breathe in through your nose...', sub: 'inhale • 4 seconds',            count: 4, scale: '1.35', tDur: '4s',   tEase: 'ease-in-out' },
      { label: 'Hold...',                          sub: 'hold • 7 seconds',               count: 7, scale: '1.35', tDur: '0.3s', tEase: 'ease'        },
      { label: 'Breathe out through your mouth...', sub: 'exhale • 8 seconds',            count: 8, scale: '0.75', tDur: '8s',   tEase: 'ease-in-out' },
    ];
    var pi = 0;
    var countInterval = null;

    function runPhase() {
      var circle  = document.getElementById('breath-circle');
      var label   = document.getElementById('breath-label');
      var sub     = document.getElementById('breath-sub');
      var countEl = document.getElementById('breath-count');
      if (!circle) return; // Modal was closed

      if (pi >= phases.length) {
        // Sequence complete
        if (label)   label.textContent  = 'Your brain just reset. Keep going.';
        if (sub)     sub.textContent    = '';
        if (countEl) countEl.textContent = '✓';
        circle.style.background = 'radial-gradient(circle,var(--color-success-50,#f0fdf4) 0%,var(--color-success-100,#dcfce7) 100%)';
        circle.style.borderColor = 'var(--color-success-400,#4ade80)';
        var skipBtn = document.getElementById('breath-skip-btn');
        if (skipBtn) {
          var fresh = skipBtn.cloneNode(true);
          fresh.textContent = 'Keep Going →';
          fresh.className = 'btn btn-primary';
          skipBtn.parentNode.replaceChild(fresh, skipBtn);
          fresh.addEventListener('click', function() { UI.closeModal(); onDone(); });
        }
        return;
      }

      var p = phases[pi];
      circle.style.transition = 'transform ' + p.tDur + ' ' + p.tEase;
      circle.style.transform  = 'scale(' + p.scale + ')';
      if (label)   label.textContent  = p.label;
      if (sub)     sub.textContent    = p.sub;

      var c = p.count;
      if (countEl) countEl.textContent = c;
      if (countInterval) clearInterval(countInterval);
      countInterval = setInterval(function() {
        c--;
        var el = document.getElementById('breath-count');
        if (el) el.textContent = Math.max(0, c);
      }, 1000);

      setTimeout(function() {
        clearInterval(countInterval);
        pi++;
        runPhase();
      }, p.count * 1000);
    }

    runPhase();
  }

  // ── OVERVIEW ───────────────────────────────────────────── //

  function buildOverview() {
    var mastery = Storage.getStrategyMastery();
    var recs    = getRecommendations(6);
    var masteredCount  = 0, eliteCount = 0, developingCount = 0;
    Object.values(mastery).forEach(function(s) {
      if (s === 'elite') { eliteCount++; masteredCount++; }
      else if (s === 'mastered') masteredCount++;
      else if (s === 'developing') developingCount++;
    });
    var streak = Storage.getPath('progress.streakDays', 0);

    var recCards = recs.map(function(code) {
      var state = mastery[code] || 'not_started';
      var level = getDrillLevel(code);
      return '<div class="de-rec-card" data-drill="' + code + '">'
        + '<div class="de-rec-top"><span class="de-code-badge">' + code + '</span>' + readinessPill(code) + '</div>'
        + '<div class="de-rec-name">Strategy ' + code + '</div>'
        + '<div class="de-rec-meta"><span class="de-mastery-dot" style="background:' + masteryColor(state) + '"></span>'
        + masteryLabel(state) + ' &middot; Lv.' + level + '</div>'
        + levelBarHtml(level)
        + '</div>';
    }).join('');

    var allPreview = buildAllStrategiesPreview(mastery);

    return '<div class="page-scroll">'
      + '<div class="page-header"><h1 class="page-title">Drill Engine</h1>'
      + '<p class="page-subtitle">Spaced-repetition mastery. Level 1&ndash;5 per strategy. Gap enforcement ensures durable retention.</p></div>'

      + '<div class="overview-stats">'
      + '<div class="stat-chip"><div class="stat-num">' + masteredCount + '</div><div class="stat-label">Mastered</div></div>'
      + '<div class="stat-chip"><div class="stat-num">' + eliteCount + '</div><div class="stat-label">Elite</div></div>'
      + '<div class="stat-chip"><div class="stat-num">' + developingCount + '</div><div class="stat-label">Developing</div></div>'
      + '<div class="stat-chip"><div class="stat-num">' + streak + '</div><div class="stat-label">Day Streak</div></div>'
      + '</div>'

      + '<div class="de-section-header">'
      + '<span class="section-subhead" style="margin:0">Recommended Next</span>'
      + '</div>'
      + '<div class="de-rec-grid">' + recCards + '</div>'

      + '<div class="de-section-header">'
      + '<span class="section-subhead" style="margin:0">All Strategies</span>'
      + '<button class="btn btn-ghost btn-sm" id="de-browse-btn">Browse all</button>'
      + '</div>'
      + '<div class="de-all-preview">' + allPreview + '</div>'
      + '</div>';
  }

  function buildAllStrategiesPreview(mastery) {
    var html = '';
    Object.keys(SECTION_CODES).forEach(function(section) {
      var codes = SECTION_CODES[section];
      html += '<div class="de-section-group"><div class="de-section-label">' + section + '</div><div class="de-code-chips">';
      codes.forEach(function(code) {
        var state = mastery[code] || 'not_started';
        var level = getDrillLevel(code);
        var ready = isReadyForSession(code);
        html += '<button class="de-code-chip" data-drill="' + code + '"'
          + ' style="border-color:' + masteryColor(state) + '"'
          + ' title="' + masteryLabel(state) + ' &middot; Lv.' + level + (ready ? ' &middot; Ready' : ' &middot; Cooling down') + '">'
          + code + (ready ? '' : '⏳')
          + '</button>';
      });
      html += '</div></div>';
    });
    return html;
  }

  function wireOverview() {
    document.querySelectorAll('[data-drill]').forEach(function(el) {
      el.addEventListener('click', function() {
        var code = el.dataset.drill;
        if (!isReadyForSession(code)) {
          var d = daysUntilReady(code);
          UI.toast(code + ' needs ' + d + ' more day' + (d !== 1 ? 's' : '') + ' to reset. Spaced repetition is working!', 'info');
          return;
        }
        if (!DE_QUESTIONS[code] || !DE_QUESTIONS[code].length) {
          UI.toast('Questions for ' + code + ' not yet available.', 'warning');
          return;
        }
        openSession(code);
      });
    });
    var browseBtn = document.getElementById('de-browse-btn');
    if (browseBtn) browseBtn.addEventListener('click', function() {
      showScreen(buildStrategyPicker(), wireStrategyPicker);
    });
  }

  // ── STRATEGY PICKER ────────────────────────────────────── //

  function buildStrategyPicker() {
    var mastery = Storage.getStrategyMastery();
    var sectionsHtml = '';
    Object.keys(SECTION_CODES).forEach(function(section) {
      var codes = SECTION_CODES[section];
      var rows = codes.map(function(code) {
        var state   = mastery[code] || 'not_started';
        var level   = getDrillLevel(code);
        var ready   = isReadyForSession(code);
        var waitDays = daysUntilReady(code);
        return '<div class="de-picker-row" data-drill="' + code + '">'
          + '<span class="strategy-code-badge">' + code + '</span>'
          + '<div class="de-picker-info">'
          + '<div class="de-picker-state" style="color:' + masteryColor(state) + '">' + masteryLabel(state) + '</div>'
          + '<div class="de-picker-level">Level ' + level + ' of ' + MAX_LEVEL + '</div>'
          + levelBarHtml(level)
          + '</div>'
          + '<div class="de-picker-action">'
          + (ready
            ? '<button class="btn btn-accent btn-sm" data-start="' + code + '">Drill</button>'
            : '<span class="de-cooldown-pill">+' + waitDays + 'd</span>')
          + '</div></div>';
      }).join('');
      sectionsHtml += '<div class="de-picker-section"><div class="section-subhead">' + section + '</div>' + rows + '</div>';
    });

    return '<div class="page-scroll">'
      + '<div class="page-nav"><button id="de-back-overview">Drill Engine</button><span>&rsaquo;</span><span>All Strategies</span></div>'
      + '<h2 class="page-title" style="font-size:1.15rem;margin-bottom:20px">Select a Strategy</h2>'
      + sectionsHtml
      + '</div>';
  }

  function wireStrategyPicker() {
    document.getElementById('de-back-overview')
      ?.addEventListener('click', openOverview);
    document.querySelectorAll('[data-start]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        openSession(btn.dataset.start);
      });
    });
  }

  // ── SESSION ─────────────────────────────────────────────── //

  function buildSession() {
    if (!drillSession || drillSession.qIndex >= drillSession.questions.length) {
      return buildResults();
    }
    var s  = drillSession;
    var q  = s.questions[s.qIndex];
    var lv = getDrillLevel(s.code);
    var passageHtml = q.p ? '<div class="drill-passage">' + q.p + '</div>' : '';
    var choices = q.c.map(function(choice, i) {
      return '<button class="drill-choice" data-idx="' + i + '">'
        + String.fromCharCode(65 + i) + '. ' + choice + '</button>';
    }).join('');

    return '<div class="page-scroll">'
      + '<div class="page-nav">'
      + '<button id="de-session-exit">Drill Engine</button><span>&rsaquo;</span>'
      + '<span class="strategy-code-badge" style="font-size:.78rem">' + s.code + '</span>'
      + '<span>&rsaquo;</span><span>Session &middot; Lv.' + lv + '</span></div>'
      + '<div class="drill-header">'
      + dotProgressHtml(s.questions.length, s.qIndex)
      + '<span class="drill-progress-indicator">' + (s.qIndex + 1) + ' / ' + s.questions.length + '</span></div>'
      + passageHtml
      + '<div class="drill-question">' + q.q + '</div>'
      + '<div class="drill-choices" id="de-choices">' + choices + '</div>'
      + '<div id="de-feedback"></div>'
      + '<div id="de-next-wrap"></div>'
      + '</div>';
  }

  function wireSession() {
    document.getElementById('de-session-exit')?.addEventListener('click', function() {
      // Was window.confirm() — a blocking native dialog inconsistent with the
      // rest of the app's custom modal system (see UI.confirm(), used by the
      // Reset App flow in app.js). Native confirm() also froze automated
      // browser testing here (synchronous dialogs block JS execution), which
      // is itself a sign it's the wrong pattern for a SPA. Same fix needed in
      // skills-check.js line 542 (still pending).
      UI.confirm({
        title: 'Exit Session?',
        message: 'Your progress on this session won\'t be saved.',
        confirmText: 'Exit',
        cancelText: 'Keep Going',
        danger: true,
      }).then(function(ok) {
        if (ok) openOverview();
      });
    });
    document.querySelectorAll('.drill-choice').forEach(function(btn) {
      btn.addEventListener('click', function() {
        handleAnswer(parseInt(btn.dataset.idx));
      });
    });
  }

  function handleAnswer(chosenIdx) {
    if (!drillSession) return;
    var s = drillSession;
    var q = s.questions[s.qIndex];
    var correct = chosenIdx === q.a;
    if (correct) {
      s.correct++;
      s.consecutiveWrong = 0;
    } else {
      s.consecutiveWrong = (s.consecutiveWrong || 0) + 1;
    }
    s.answers.push({ chosen: chosenIdx, correct: correct, q: q.q, correctAns: q.c[q.a] });

    document.querySelectorAll('.drill-choice').forEach(function(btn, i) {
      btn.disabled = true;
      if (i === q.a) btn.classList.add('drill-choice-correct');
      else if (i === chosenIdx && !correct) btn.classList.add('drill-choice-wrong');
    });

    var fb = document.getElementById('de-feedback');
    if (fb) {
      fb.innerHTML = '<div class="drill-feedback ' + (correct ? 'feedback-correct' : 'feedback-wrong') + '">'
        + (correct ? '✓ Correct — ' : '✗ Incorrect — ') + q.e + '</div>';
    }

    var isLast             = s.qIndex >= s.questions.length - 1;
    var triggerIntervention = !correct && s.consecutiveWrong >= 3;
    var nextWrap = document.getElementById('de-next-wrap');
    if (nextWrap) {
      nextWrap.innerHTML = '<div class="lesson-actions" style="margin-top:16px">'
        + '<button class="btn btn-accent" id="de-next-btn">' + (isLast ? 'See Results' : 'Next Question') + '</button></div>';
      document.getElementById('de-next-btn')?.addEventListener('click', function() {
        s.qIndex++;
        if (s.qIndex >= s.questions.length) {
          // Session complete — closing affirmation, then results
          showAffirmationCard('endSession', function() {
            showScreen(buildResults(), wireResults);
          });
        } else if (triggerIntervention) {
          // 3 wrong in a row — reset counter, breathing + affirmation, then next question
          s.consecutiveWrong = 0;
          showBreathingModal(function() {
            showAffirmationCard('midDrill', function() {
              showScreen(buildSession(), wireSession);
            });
          });
        } else {
          showScreen(buildSession(), wireSession);
        }
      });
    }
  }

  // ── RESULTS ─────────────────────────────────────────────── //

  function buildResults() {
    if (!drillSession) return '<p>No session data.</p>';
    var s       = drillSession;
    var total   = s.questions.length || SESSION_SIZE;
    var accuracy = total > 0 ? s.correct / total : 0;
    var pct     = Math.round(accuracy * 100);

    // Apply advancement (writes to storage)
    var adv = applyAdvancement(s.code, accuracy);
    var level = getDrillLevel(s.code); // post-advancement
    var state = Storage.getPath('strategyMastery.' + s.code, 'not_started');

    // ── Dispatch CustomEvents for NotificationsModule ──────────
    // drillComplete → session encouragement notification
    document.dispatchEvent(new CustomEvent('drillComplete', {
      detail: {
        code:               s.code,
        accuracy:           accuracy,
        pct:                pct,
        correct:            s.correct,
        total:              total,
        frustrationFlagged: accuracy < 0.4,
        levelUp:            adv.levelUp,
        stateUp:            adv.stateUp,
        newState:           adv.newState,
      }
    }));
    // frustrationSession → parent alert when accuracy < 40%
    if (accuracy < 0.4) {
      document.dispatchEvent(new CustomEvent('frustrationSession', {
        detail: { code: s.code, accuracy: accuracy, pct: pct }
      }));
    }
    // ───────────────────────────────────────────────────────────

    var advHtml = '';
    if (adv.stateUp) {
      advHtml = '<div class="de-advance-banner de-advance-' + adv.newState + '">'
        + '🎉 Mastery upgraded to <strong>' + masteryLabel(adv.newState) + '</strong>!</div>';
    } else if (adv.levelUp) {
      advHtml = '<div class="de-advance-banner de-advance-level">'
        + '⬆️ Level up! Now at Level ' + level + ' / ' + MAX_LEVEL + '.</div>';
    } else if (adv.gapRequired) {
      var d = adv.gapDays;
      advHtml = '<div class="de-advance-banner de-advance-gap">'
        + '✓ Good session. Return in ' + d + ' day' + (d !== 1 ? 's' : '') + ' to advance. Spaced repetition builds durable recall.</div>';
    } else if (accuracy < 0.8) {
      advHtml = '<div class="de-advance-banner de-advance-retry">'
        + 'Keep drilling — 80%+ (4/5) needed to advance. Review the explanations above.</div>';
    }

    var titleText = pct >= 80 ? 'Strong session!' : pct >= 60 ? 'Getting there.' : 'Keep drilling.';

    var answerRows = s.answers.map(function(a, i) {
      var qShort = a.q.length > 75 ? a.q.slice(0, 75) + '…' : a.q;
      return '<div class="result-row ' + (a.correct ? 'result-correct' : 'result-wrong') + '">'
        + '<span class="result-icon">' + (a.correct ? '✓' : '✗') + '</span>'
        + '<div class="result-q">Q' + (i + 1) + ': ' + qShort
        + (!a.correct ? '<div class="result-correct-ans">Correct: ' + a.correctAns + '</div>' : '')
        + '</div></div>';
    }).join('');

    return '<div class="page-scroll">'
      + '<div class="page-nav"><button id="de-results-home">Drill Engine</button><span>&rsaquo;</span><span>' + s.code + '</span><span>&rsaquo;</span><span>Results</span></div>'
      + '<div class="results-hero">'
      + '<div class="results-score-ring"><div class="results-score">' + s.correct + '/' + total + '</div><div class="results-pct">' + pct + '%</div></div>'
      + '<div class="results-meta">'
      + '<div class="results-title">' + titleText + '</div>'
      + '<div class="results-subtitle">Strategy ' + s.code + ' &middot; Level ' + level + '</div>'
      + '<div class="results-mastery" style="background:' + masteryColor(state) + '">' + masteryLabel(state) + '</div>'
      + '</div></div>'
      + advHtml
      + '<div class="section-subhead" style="margin-top:20px">Question Review</div>'
      + '<div class="results-answers">' + answerRows + '</div>'
      + '<div class="results-actions">'
      + '<button class="btn btn-accent" id="de-drill-again">Drill Again</button>'
      + '<button class="btn btn-secondary" id="de-results-home-btn">Back to Drill Engine</button>'
      + '</div></div>';
  }

  function wireResults() {
    document.getElementById('de-results-home')?.addEventListener('click', openOverview);
    document.getElementById('de-results-home-btn')?.addEventListener('click', openOverview);
    document.getElementById('de-drill-again')?.addEventListener('click', function() {
      if (activeCode) openSession(activeCode);
    });
  }

  // ── NAVIGATION ─────────────────────────────────────────── //

  function openOverview() {
    view = 'overview'; activeCode = null; drillSession = null;
    showScreen(buildOverview(), wireOverview);
  }

  function openSession(code) {
    if (!DE_QUESTIONS[code] || !DE_QUESTIONS[code].length) {
      UI.toast('No questions available for ' + code + '.', 'warning'); return;
    }
    activeCode   = code;
    drillSession = {
      code: code, questions: buildSessionQuestions(code),
      qIndex: 0, correct: 0, answers: [], startMs: Date.now(),
      consecutiveWrong: 0,
    };
    view = 'session';
    // Show pre-drill affirmation, then start first question
    showAffirmationCard('preDrill', function() {
      showScreen(buildSession(), wireSession);
    });
  }

  // ── QUESTION BANK ──────────────────────────────────────── //
  // 5 questions per strategy × 51 strategies = 255 questions
  // Harder / more applied than Module 5 mini-drills
  // Added in batches via Edit calls below

  const DE_QUESTIONS = {
    // ── BATCH 1: Universal (U1–U7) + Reading Elimination (R1–R8) ──
    U1:[
      { p:null, q:'A passage presents a scientist\'s claim followed by three paragraphs of counter-evidence. You are asked what the passage is "primarily concerned with." Which framing is correct?', c:['The specific counter-evidence in paragraph 3','Evaluating whether a scientific claim holds up against challenges','The scientist\'s original experiment design','The history of the research field'], a:1, e:'PCE: "primarily concerned with" = main purpose. The passage structure (claim → 3 counter-paragraphs) is an evaluation structure. A narrows to one paragraph; C and D are not in the text.' , trap_type:'true_but_irrelevant'},
      { p:'The committee voted unanimously. The result surprised no one who had attended the earlier closed-door sessions.', q:'The most complete summary of this two-sentence passage is:', c:['A committee made a unanimous vote','A unanimous vote was unsurprising given what had been decided privately beforehand','Closed-door sessions always predict public votes','Committees are predictable organizations'], a:1, e:'PCE: Sentence 1 = the event; sentence 2 = context that makes it unsurprising. The complete summary captures both. A ignores sentence 2. C and D are overgeneralizations not in the text.' , trap_type:'true_but_irrelevant'},
      { p:null, q:'You\'re asked: "The author\'s main purpose is to ___." You find three competing answers that all reference content actually in the passage. How do you distinguish the main purpose from a supporting detail?', c:['Pick the answer that covers the most word count','The main purpose is the one the entire passage serves — if an answer only covers one section, it\'s a supporting point, not the purpose','Pick the answer that appears in the first paragraph','Pick the most specific answer'], a:1, e:'Main purpose = what the whole passage does. Supporting details = what individual sections do. If an answer only describes one section, eliminate it. Coverage of the entire passage is the test.' , trap_type:'true_but_irrelevant'},
      { p:'The urban heat island effect raises city temperatures by 2–5°F. This affects energy consumption, public health, and infrastructure longevity. Mitigation strategies include green roofs, increased tree cover, and reflective paving.', q:'The primary purpose of this passage is to', c:['Advocate for green roofs as the best mitigation','Describe a phenomenon, its effects, and potential solutions','Criticize urban planners for causing the heat island effect','Provide historical background on city temperature measurement'], a:1, e:'PCE: The passage does three things — names the effect, lists its consequences, offers solutions. B captures all three. A narrows to one solution; C adds a critical tone not in the text; D is not present.' , trap_type:'true_but_irrelevant'},
      { p:null, q:'The question asks for the author\'s "central claim." You find two choices: (A) "Renewable energy investment has increased since 2010," and (B) "Renewable energy is the most viable long-term solution to climate change." The passage discusses both trends since 2010 AND argues for renewables long-term. Which is the central claim?', c:['A — trends are more specific and verifiable','B — the argument about long-term viability is what the passage is trying to convince you of; the trends are evidence in support','Neither — both are equally central','A — it appears earlier in the passage'], a:1, e:'Central claim = the argument the passage makes. Trends (A) are evidence supporting the argument (B). Evidence ≠ claim. B is what the passage is trying to convince the reader of.' , trap_type:'true_but_irrelevant'},
    ],
    U2:[
      { p:null, q:'You are reading question 4 in a module. You have 3 minutes left. The question has a complex answer choices. Your best move is:', c:['Read every word of every answer choice before selecting','Mark your best guess, flag if the interface allows, and move to question 5 — return if time permits','Skip it entirely and never return','Spend 4 minutes to make sure you get it right'], a:1, e:'Time allocation: you have 3 minutes for question 4 (and presumably more questions after). Best guess + possible return dominates: you avoid being frozen while protecting remaining questions.' , trap_type:null},
      { p:null, q:'The SAT Reading module has 27 questions and 32 minutes. On average, how many seconds per question is that?', c:['About 45 seconds','About 71 seconds','About 120 seconds','About 90 seconds'], a:1, e:'32 minutes × 60 = 1920 seconds ÷ 27 questions ≈ 71 seconds per question. Passage-based questions require more time; single-sentence grammar questions take less.' , trap_type:null},
      { p:null, q:'You just finished question 8 and have 22 minutes left for 19 questions. Are you on track?', c:['No — you should have 25 minutes left by question 8','Yes — 22 minutes for 19 questions ≈ 69 sec/question, which is on target','No — you need at least 30 minutes for 19 questions','Yes, but only if you speed up dramatically'], a:1, e:'22 min ÷ 19 questions ≈ 69 seconds each — nearly exactly the 71-second target. You\'re on pace.' , trap_type:null},
      { p:null, q:'Which type of question should generally receive MORE than the average time allocation?', c:['Single vocabulary-in-context questions with a short sentence','Questions with long paired passages requiring cross-reference','Single-sentence grammar correction questions','Math questions asking for a simple sum'], a:1, e:'Paired passage cross-reference questions require reading both passages + synthesizing. They deserve above-average time. Short vocabulary or grammar questions can be answered in under 30 seconds.' , trap_type:null},
      { p:null, q:'You spend 4 minutes on a hard question, get it right, but run out of time on question 27 and leave it blank. What is the likely outcome compared to spending 90 seconds, guessing, and answering question 27?', c:['The 4-minute approach is better because you got a hard one right','The 90-second approach is likely better — you trade certainty on one hard question for a 25% chance on the one you left blank','Both approaches produce identical expected scores','The 4-minute approach is always better for hard questions'], a:1, e:'Expected value: blank = 0 points. A guess = 0.25 expected points. Hard question = 1 point, but you already got it right in the 90-second scenario too (most of the time). Blanks are the worst outcome.' , trap_type:null},
    ],
    U3:[
      { p:null, q:'You are down to two choices: A and C. A says "The author suggests the policy was flawed." C says "The author implies the policy was deeply misguided." The passage says: "The policy produced mixed results and was later revised." Which is supported?', c:['C — "mixed results" implies deep misgiving','A — "mixed results" and "revised" suggest the author notes problems but not deep condemnation','Neither — the passage is purely neutral','Both — they mean the same thing'], a:1, e:'Answer choice language must match passage language. "Mixed results" + "revised" = problems noted, but not the strong negative intensity of "deeply misguided." C uses stronger language than the evidence supports. Eliminate C.' , trap_type:'half_right'},
      { p:null, q:'What is the defining feature of a "trap" answer choice in Reading?', c:['It\'s always the longest answer choice','It uses words from the passage but combines or extends them in a way the passage never actually states','It always appears as Choice A or Choice D','It always contradicts the passage'], a:1, e:'Trap answers recycle passage vocabulary in ways that seem right (you recognize the words) but don\'t accurately represent what the passage says. They distort, extend, or miscombine.' , trap_type:'half_right'},
      { p:'The explorer described the journey as "harrowing but ultimately worthwhile." Her account emphasizes the physical toll and the dangers faced.', q:'Which choice is supported by the passage?', c:['The explorer regretted undertaking the journey','The explorer found the journey difficult but valuable','The journey was more dangerous than any previously attempted','The explorer\'s physical health was permanently damaged'], a:1, e:'"Harrowing but ultimately worthwhile" directly maps to "difficult but valuable." A contradicts "worthwhile." C introduces comparison information not in the passage. D extends "physical toll" beyond what\'s stated.' , trap_type:'half_right'},
      { p:null, q:'You eliminate A and B. Choice C says "the government was primarily motivated by economic concerns." Choice D says "the government was motivated by economic and political concerns." The passage discusses economic pressure but makes no mention of political motivation. Which survives?', c:['C — it stays within what the passage actually says','D — broader is safer','Both — one concern implies others','Neither — the passage must explicitly state motivation for either to be correct'], a:0, e:'Go with the scope the passage establishes. The passage discusses economic pressure — C stays within that scope. D adds "political concerns" not mentioned in the passage. Adding information = distortion.' , trap_type:'half_right'},
      { p:null, q:'After eliminating two choices, you have 45 seconds left. You feel equally uncertain about the two remaining options. You should:', c:['Leave it blank — uncertain guesses hurt more than blanks','Pick the one that uses more words from the passage (familiarity test)','Pick the one that most closely matches what you understood the passage to be saying, commit, and move on','Spend 2 more minutes to reach certainty'], a:2, e:'No penalty for guessing. 45 seconds of additional analysis on a 2-choice dilemma is unlikely to change your answer. Pick the best supported choice and move. Committing is a skill.' , trap_type:'half_right'},
    ],
    U4:[
      { p:null, q:'A question asks: "As used in line 14, \'cold\' most nearly means ___." Line 14: "The detective\'s cold reasoning cut through the emotional testimony." What does \'cold\' mean here?', c:['Low in temperature','Emotionally detached and analytical','Cruel and heartless','Literal (about weather)'], a:1, e:'Context: "cold reasoning" is contrasted with "emotional testimony." Cold here describes a mode of thinking — detached, unemotional, analytical. The surrounding words determine the meaning, not the common definition.' , trap_type:'recycled_language'},
      { p:'The artist\'s early work was raw but alive. Later pieces, by contrast, showed technical mastery but felt somehow remote.', q:'As used in this passage, "remote" most nearly means', c:['Geographically distant','Operated from a distance, like a remote control','Detached and lacking emotional warmth','Unlikely or improbable'], a:2, e:'"Remote" is contrasted with "alive" (early work). The passage describes the later work as technically masterful but lacking something. "Remote" = emotionally distant, detached. Context eliminates all other meanings.' , trap_type:'recycled_language'},
      { p:null, q:'A question asks for the meaning of "check" in: "The new regulation served as a check on corporate excess." What is the most supported meaning?', c:['A financial instrument (check/cheque)','A mark made to indicate correctness','A restraint or limit on something','A pattern of squares'], a:2, e:'Context: "check on corporate excess" — something that limits or controls behavior. "Regulation" + "on excess" signals a restraining function. "Check" as restraint/control is the contextually supported meaning.' , trap_type:'recycled_language'},
      { p:null, q:'Why is the "most common definition" approach unreliable for Vocabulary-in-Context questions?', c:['Common definitions are usually wrong','SAT questions specifically test words that have multiple meanings; the question is always about which meaning fits THIS context, not which is most common','Common definitions apply only to verbs','Vocabulary-in-context questions are about spelling, not meaning'], a:1, e:'Words like "cold," "check," "free," "charge," "light" have 5+ meanings each. The SAT tests them precisely because students will default to the most common meaning. The context — not the common usage — determines the answer.' , trap_type:'recycled_language'},
      { p:'The senator\'s proposal to "liberalize" trade policy drew both praise and skepticism. Critics worried the move would undermine domestic protections.', q:'As used here, "liberalize" most nearly means', c:['Make more politically liberal','Make freer, less restricted, or more open','Make more generous or charitable','Make legal what was previously prohibited'], a:1, e:'Context: trade policy + critics worried it would "undermine protections" → liberalizing trade = reducing restrictions on trade. "More open/less restricted" is the supported meaning in trade context.' , trap_type:'recycled_language'},
    ],
    U5:[
      { p:null, q:'You read a question, then the four choices. Choice A uses technical vocabulary you don\'t recognize. You should:', c:['Automatically eliminate A — unfamiliar vocabulary signals a trap','Automatically select A — unusual vocabulary signals a sophisticated, correct answer','Evaluate A the same as any other choice — go back to the passage to check what the choice claims','Skip A and pick from B, C, D'], a:2, e:'Unfamiliar vocabulary is neither a trap signal nor a correctness signal. The question is always: does this choice accurately reflect what the passage says? Return to the passage and evaluate on evidence.' , trap_type:'could_be_true'},
      { p:null, q:'The correct process for answering a Reading comprehension question is:', c:['Read all four choices → eliminate by gut feeling → select the remaining one','Predict the answer in your own words → read choices → select the one closest to your prediction','Read the choices first → then skim the passage for matching language','Select the longest, most detailed choice'], a:1, e:'Read the question → predict answer → match to choices. This protects against getting pulled into trap choices. If you approach choices cold (without a prediction), the traps are much more effective.' , trap_type:'could_be_true'},
      { p:null, q:'You\'re answering a "what does the author believe" question. You make your prediction: "The author thinks the reform succeeded." You read Choice C: "The author argues the reform was partially successful but had significant limitations." This is close but not exactly your prediction. You should:', c:['Eliminate C — it doesn\'t match your prediction exactly','Select C tentatively — it\'s the closest to your prediction; verify against the passage before finalizing','Discard your prediction and start over','Select it only if no other choice comes closer'], a:1, e:'Predictions are anchors, not rigid answers. "Partially successful with limitations" could be a more precise version of your prediction. Check C against the passage text before finalizing.' , trap_type:'could_be_true'},
      { p:null, q:'Which behavior most commonly produces wrong answers on SAT Reading?', c:['Spending too long on the passage before looking at questions','Predicting before reading choices','Answering based on what you believe to be true (outside knowledge) rather than what the passage actually says','Eliminating obviously wrong choices first'], a:2, e:'The #1 wrong answer generator: using outside knowledge. The SAT passage is the only evidence that counts. If the passage doesn\'t say it, it\'s not the answer — regardless of whether it\'s factually true.' , trap_type:'could_be_true'},
      { p:'Research suggests that multitasking, widely considered an asset in modern work environments, may actually reduce productivity and increase error rates.', q:'Based ONLY on this passage, which conclusion is supported?', c:['Workers should never multitask under any circumstances','Multitasking is universally harmful in all contexts','Research findings challenge the popular positive perception of multitasking','Multitasking should be discouraged by employers'], a:2, e:'The passage says multitasking is "widely considered an asset" but "may actually" reduce productivity. This challenges the common perception. A and D prescribe action not in the passage. B uses "universally" — too strong. C is directly supported.' , trap_type:'could_be_true'},
    ],
    U6:[
      { p:null, q:'A question asks: "Which choice best describes the overall structure of the passage?" The passage starts by presenting a problem, then provides historical context, then argues for a specific solution. The best structural description is:', c:['Comparison and contrast of two solutions','Problem presented → historical context provided → solution advocated','Chronological history of a topic','Argument → counterargument → rebuttal'], a:1, e:'Match the actual structure you observed. This passage has three distinct moves: problem, history, solution. Only B captures all three in order.' , trap_type:'true_but_irrelevant'},
      { p:null, q:'Why is identifying passage structure useful before reading?', c:['It lets you skip paragraphs you\'ve identified as unimportant','It tells you exactly where to find the main idea (always in paragraph 1)','It creates a mental map that makes comprehension faster and helps predict where specific information will be','Structure identification always reveals the answer to main purpose questions'], a:2, e:'A structural map (intro → context → argument → conclusion) tells you which paragraph to look in when a question asks about a specific function. It\'s orientation, not a shortcut.' , trap_type:'true_but_irrelevant'},
      { p:null, q:'A passage has this structure: P1 introduces Claim A, P2 introduces Claim B, P3 compares them, P4 concludes which is superior. A question asks: "In which paragraph does the author most directly state a preference?" You should look in:', c:['P1 — first claims are usually strongest','P2 — second arguments are often preferred','P4 — the conclusion is where preference is most directly stated after comparison','P3 — comparison reveals preference implicitly'], a:2, e:'In evaluation/comparison structures, the conclusion (P4) is where the author states which is better. Implicit preference in P3 ≠ "most directly stated." P4 is the right paragraph.' , trap_type:'true_but_irrelevant'},
      { p:null, q:'You\'re mapping a passage and find P2 is a counterargument. A question asks: "The author introduces the information in paragraph 2 in order to ___." The answer most likely is:', c:['Provide supporting evidence for the main argument','Present a perspective the author will subsequently challenge or qualify','Summarize the passage\'s main point','Introduce new evidence the author endorses'], a:1, e:'Counterargument paragraphs exist to be addressed/rebutted. The function of P2 (counterargument) is: "present a view that the author will then challenge." This is standard argumentative structure.' , trap_type:'true_but_irrelevant'},
      { p:null, q:'A passage begins: "Despite widespread assumptions that X causes Y, recent studies suggest the relationship is more complex." What structural role does this opening sentence play?', c:['It introduces supporting evidence for X causing Y','It establishes the passage\'s central tension: conventional wisdom vs. new research findings','It provides a definition of terms','It is a transitional statement with no structural significance'], a:1, e:'"Despite widespread assumptions... recent studies suggest" is a classic contrast structure. The passage will challenge a conventional belief with new evidence. This sentence announces the central tension.' , trap_type:'true_but_irrelevant'},
    ],
    U7:[
      { p:null, q:'A question cites lines 22-25 and asks what those lines "most nearly suggest." Your correct approach is:', c:['Answer based on your understanding of the passage\'s general topic','Re-read lines 22-25 in their full surrounding context (at least one sentence before and after) before selecting an answer','Trust your memory of what you read — rereading wastes time','Pick the answer that matches most vocabulary from lines 22-25'], a:1, e:'Line-reference questions require re-reading the cited lines in context. One sentence before and after often contains the key relationship (cause-effect, contrast, elaboration) that determines the answer.' , trap_type:'scope_trap'},
      { p:null, q:'A question asks "In lines 40-43, the author uses the phrase \'not entirely unlike\' to suggest ___." "Not entirely unlike" is a double negative. What does it mean?', c:['Completely different from','Somewhat similar to','Completely identical to','Neither similar nor different'], a:1, e:'"Not entirely unlike" = double negative = "somewhat similar." Not entirely (partially) unlike (not different) = partially similar. These constructions are intentionally hedged — the author suggests partial resemblance, not identity.' , trap_type:'scope_trap'},
      { p:null, q:'You\'re asked about lines 12-15. You re-read them. The lines are dense and confusing. The best next step is:', c:['Eliminate the answer and move on','Read the two sentences before line 12 and two after line 15 to get the larger context before trying again','Trust your gut about what those lines probably mean','Pick the most specific-sounding answer choice'], a:1, e:'Dense lines are almost always interpretable when you read surrounding context. The context above and below clarifies ambiguous language. Two sentences before and after is usually sufficient.' , trap_type:'scope_trap'},
      { p:'The committee\'s report acknowledged certain "deficiencies" in the process while maintaining that the ultimate outcome remained "fully defensible."', q:'In the context of the passage, the author\'s use of quotation marks around "deficiencies" and "fully defensible" most likely suggests', c:['The author endorses the committee\'s language as accurate','The author is distancing themselves from the committee\'s chosen language, implying skepticism about these characterizations','The words are defined elsewhere in the passage','The author considers both words to be overly technical'], a:1, e:'Quotation marks used around a source\'s words (not as a direct quote introduction) signal authorial skepticism — the author is noting these are the committee\'s words, not necessarily accurate characterizations.' , trap_type:'scope_trap'},
      { p:null, q:'A question asks what a specific word means "in line 34." You re-read line 34 and the word has two plausible meanings based on context. You should:', c:['Pick the first meaning that came to mind','Expand your re-read window — re-read the full paragraph containing line 34 to determine which meaning the surrounding argument supports','Pick the less common meaning — the SAT prefers unexpected answers','Eliminate both and select based on the remaining choices'], a:1, e:'Two plausible contextual meanings = your re-read window is too narrow. Expand to the full paragraph. The paragraph\'s argument will usually clarify which meaning is intended.' , trap_type:'scope_trap'},
    ],

    R1:[
      { p:null, q:'A choice says: "The author argues that climate policy has failed globally." The passage says: "Climate policy has seen mixed results in several European nations." Which error does the choice make?', c:['It uses vocabulary not in the passage','It incorrectly identifies the author\'s tone','It changes "several European nations" (limited scope) to "globally" (universal scope) — a scope error','It changes past tense to present tense'], a:2, e:'Scope error: "several European nations" ≠ "globally." This is a classic elimination trigger. If the choice expands geographic, temporal, or categorical scope beyond the passage, eliminate it.' , trap_type:'scope_trap'},
      { p:null, q:'Which of these is an extreme language marker that signals an unsafe answer choice?', c:['"may suggest," "appears to," "tends to"','"always," "never," "all," "every," "must"','"argues," "claims," "contends"','"however," "although," "while"'], a:1, e:'Extreme language words ("always," "never," "all," "every," "must") state absolutes. Passages almost never support absolutes. These words are red flags. Moderate hedge words (may, tends, appears) are safer.' , trap_type:'extreme_language'},
      { p:'The study found that students who read for pleasure scored higher on comprehension tests. This correlation held across all age groups studied.', q:'Which choice is NOT supported by the passage?', c:['Students who read for pleasure scored higher on comprehension tests','Reading for pleasure correlates with comprehension performance','All students universally benefit from reading for pleasure in all contexts','The correlation was observed across age groups'], a:2, e:'"All students universally... in all contexts" imports extreme universality. The passage says "all age groups studied" (within the study\'s scope) — not "all students everywhere in all contexts." C overextends scope and adds conditions not in the text.' , trap_type:'extreme_language'},
      { p:null, q:'You\'re eliminating choices. Choice A says "The author is outraged by the findings." The passage says "The author notes the findings with concern." Which elimination trigger applies?', c:['Scope error — "findings" vs. "the topic"','Extreme language — "outraged" intensifies "concern" beyond what the passage supports','Opposite direction — "concern" is the opposite of noting findings','Off-topic — outrage is not mentioned at all'], a:1, e:'"Outraged" is a stronger, more intense version of "concern." The passage supports concern; it doesn\'t support outrage. Intensity mismatch = extreme language distortion.' , trap_type:'extreme_language'},
      { p:null, q:'A choice includes "proven" as in "The author considers the theory proven." The passage says "evidence supports the theory." What is wrong with the choice?', c:['Nothing — "supports" and "proven" are synonymous','The passage does not say the theory is proven — "evidence supports" is weaker than "proven." The choice overstates certainty.','The passage never mentions theory, so the choice is completely off-topic','The author\'s opinion is not relevant to this question type'], a:1, e:'"Evidence supports" → likely, probable. "Proven" → established as certain fact. The choice escalates epistemic certainty beyond what the passage establishes. This is a strength-of-claim distortion.' , trap_type:'extreme_language'},
    ],
    R2:[
      { p:null, q:'An answer choice says "The legislation completely solved the problem." The passage says "The legislation addressed several key aspects of the problem." What type of elimination trap is this?', c:['Scope error','Extreme language — "completely solved" vs. "addressed several aspects"','Opposite direction','Recycled vocabulary trap'], a:1, e:'"Completely solved" ≠ "addressed several aspects." The choice escalates partial progress to complete resolution — an extreme language distortion. Eliminate.' , trap_type:'opposite_trap'},
      { p:null, q:'Which pair of answer choices demonstrates the "opposite direction" trap?', c:['"The author supports the policy" vs. "The author advocates for the policy"','"The author criticizes the policy" vs. "The author endorses the policy"','"The author analyzes the data" vs. "The author examines the data"','"The author notes limitations" vs. "The author acknowledges constraints"'], a:1, e:'"Criticizes" and "endorses" are antonyms — one positive, one negative. If the passage clearly shows one direction, the opposite direction choice is an elimination candidate. Pairs A, C, D are near-synonyms, not opposites.' , trap_type:'opposite_trap'},
      { p:'The researcher concluded that the drug reduced symptoms in 60% of patients. The remaining 40% saw no significant change.', q:'Which choice accurately represents the passage?', c:['The drug cured all patients who took it','The drug was effective for a majority of patients but not for all','The drug was largely ineffective across the patient population','The drug produced identical results in all patients'], a:1, e:'60% = majority; 40% saw no change = not effective for all. B is precisely accurate. A (cured all) and D (identical results) contradict the split; C misrepresents 60% effective as "largely ineffective."' , trap_type:'opposite_trap'},
      { p:null, q:'Choice B says "Historians have universally condemned the decision." The passage says "Many historians have questioned the decision." What is wrong with Choice B?', c:['Nothing — "questioned" implies condemnation','Two errors: "universally" imposes a scope not in the passage, and "condemned" intensifies "questioned" beyond what the passage says','The word "historians" is not in the passage','The choice is in the wrong tense'], a:1, e:'Double distortion: "universally" (extreme scope) + "condemned" (extreme intensity beyond "questioned"). Two elimination triggers in one choice — these are the easiest to eliminate once you know the pattern.' , trap_type:'opposite_trap'},
      { p:null, q:'An answer choice for a "main idea" question reads: "The author believes renewable energy will eventually replace all fossil fuels." The passage argues that renewable energy investment should be expanded. What error does the choice make?', c:['It changes the subject of the passage','It adds a prediction about the future that the passage does not make — the passage argues for investment expansion, not that replacement will definitely occur','It uses the word "believes" incorrectly','It contradicts the passage\'s position on fossil fuels'], a:1, e:'The passage argues for investment expansion. The choice converts an argument for action into a prediction about an inevitable future outcome. That\'s a different claim — the passage never predicts replacement.' , trap_type:'opposite_trap'},
    ],
    R3:[
      { p:null, q:'Answer choice D says "The policy was primarily motivated by economic concerns." The passage discusses political pressure, public health, and economic considerations — all mentioned. What makes D eliminable?', c:['Nothing — economic concerns are mentioned in the passage','D adds "primarily" — ranking economic concerns as the main driver — but the passage treats all three factors as co-equal. "Primarily" imposes a ranking the passage doesn\'t make.','Economic concerns make D a scope distortion','The choice uses vocabulary not in the passage'], a:1, e:'"Primarily" is a ranking word — it says economic concerns were #1. If the passage lists three equal factors, no choice that claims primacy of one factor is supported.' , trap_type:'half_right'},
      { p:'The results were mixed: some regions improved, others declined, and several showed no measurable change.', q:'Which choice is NOT supported?', c:['Outcomes varied across regions','Some areas saw improvement while others declined','All regions showed some degree of change','The results did not show uniform improvement'], a:2, e:'"All regions showed some degree of change" is contradicted by "several showed no measurable change." C is not only unsupported — it\'s contradicted. The passage explicitly says some regions had no change.' , trap_type:'half_right'},
      { p:null, q:'A choice says "The author disagrees with all critics of the policy." The passage says "The author acknowledges some critics raise valid concerns while disagreeing with others." What type of error is this?', c:['The choice correctly identifies the author\'s position','The choice ignores the "some critics raise valid concerns" nuance — the author partially agrees with critics, not disagrees with all','Scope error','Opposite direction'], a:1, e:'The passage shows a nuanced position: partially agree + partially disagree. The choice collapses this to "disagrees with all" — erasing the partial agreement. Nuance erasure is a common recycled-language trap.' , trap_type:'half_right'},
      { p:null, q:'In eliminating "half-right, half-wrong" choices, what is the recommended test?', c:['Check if the first word of the choice matches the passage','Test EVERY claim in the choice — a choice is only correct if ALL of its claims are supported. One unsupported claim eliminates the entire choice.','Check if the choice is consistent with your prior knowledge of the topic','Check if the choice mentions the same characters as the passage'], a:1, e:'A choice is only as strong as its weakest link. "The author admires the policy and believes it was effectively implemented" — if "effectively implemented" isn\'t supported, the whole choice is wrong, even if "admires" is correct.' , trap_type:'half_right'},
      { p:'The reform reduced costs but increased wait times. Officials considered it successful because cost reduction was their primary goal.', q:'Which choice is NOT supported?', c:['The reform achieved its stated goal of reducing costs','The officials evaluated success based on their primary objective','The reform was successful in every dimension','Officials were aware of the trade-off between cost and wait times'], a:2, e:'"Successful in every dimension" is contradicted by the text — wait times increased, which is a failure in at least one dimension. C is directly contradicted. D is supported by implication (officials knew both outcomes).' , trap_type:'half_right'},
    ],
    R4:[
      { p:null, q:'An answer choice says: "The author implies critics are completely wrong." The passage says: "While the author challenges certain criticisms, she acknowledges the core concern has merit." What error does the choice make?', c:['Scope error','It contradicts the passage — the author acknowledges merit in the core concern; critics are not "completely wrong"','Extreme language on "implies"','Off-topic — critics are not the main subject'], a:1, e:'The passage shows the author partially defending critics (core concern has merit). "Completely wrong" is both extreme and opposite to the partial agreement. Two errors: intensity + direction.' , trap_type:'recycled_language'},
      { p:null, q:'The question asks: "The author\'s attitude toward the new technology is best described as ___." You predict: "cautiously optimistic." You read: (A) enthusiastically supportive, (B) deeply skeptical, (C) guardedly hopeful, (D) completely indifferent. Which choice best matches your prediction?', c:['A — enthusiasm is close to optimism','B — skepticism is related to caution','C — "guardedly hopeful" is a near-synonym of "cautiously optimistic"','D — indifference is neutral like caution'], a:2, e:'"Guardedly hopeful" = cautiously optimistic. They\'re near-synonyms. A is too positive (enthusiastic ≠ cautious). B is wrong direction (skeptical ≠ optimistic). D is wrong direction (indifferent ≠ optimistic).' , trap_type:'recycled_language'},
      { p:'The law was intended to protect consumers. In practice, it created significant new compliance burdens for small businesses.', q:'Which choice most accurately captures the relationship between the law\'s intent and its effect?', c:['The law succeeded in its intended purpose','The law\'s actual effects contradicted its stated purpose','The law created burdens for consumers as well as businesses','The law was poorly designed from the outset'], a:1, e:'Intent: protect consumers. Effect: compliance burdens on small businesses. The law\'s effect is different from (and arguably undermines) its intent — that\'s the relationship. A is unsupported; C adds "consumers" not mentioned; D judges design not stated.' , trap_type:'recycled_language'},
      { p:null, q:'You have two choices remaining. Choice A uses precise hedging ("may suggest," "appears to indicate"). Choice B makes a definitive claim ("proves," "demonstrates conclusively"). The passage is careful and measured in its claims. Which is more likely correct?', c:['B — definitive language matches what questions are testing','A — the choice\'s level of certainty matches the passage\'s careful, measured tone','Neither — certainty level in choices is irrelevant','B — more specific choices are usually correct'], a:1, e:'Match the certainty level of the passage. A careful passage with hedged language (may, could, suggests) will have a correct answer that also hedges. Choices claiming more certainty than the passage are eliminated.' , trap_type:'recycled_language'},
      { p:null, q:'An answer choice says "The author provides extensive historical evidence." The passage provides two historical examples in a 5-paragraph essay focused mainly on present implications. What error does the choice make?', c:['Opposite direction — the passage is anti-historical','Exaggeration — "extensive" overstates the role of historical evidence in a passage that uses it sparingly, not as its primary mode','Scope error — history vs. present','Off-topic'], a:1, e:'"Extensive" is a quantity exaggeration. Two examples in a modern-focused essay is "some historical evidence" — not extensive. Choices that overstate the prominence or quantity of evidence in the passage are eliminable.' , trap_type:'recycled_language'},
    ],
    R5:[
      { p:null, q:'An answer choice accurately describes something discussed in paragraph 3. But the question asks for the main idea of the PASSAGE. What do you do with this choice?', c:['Select it — if it\'s accurate, it\'s the answer','Eliminate it — an accurate description of paragraph 3 content is a supporting detail, not the main idea, unless paragraph 3 contains the thesis','Partially credit it — mark it as a backup choice','Check if it appears in any other paragraph'], a:1, e:'Accurate ≠ main idea. A passage\'s main idea encompasses the whole text. A choice that only captures one section\'s content is a supporting-detail trap, not the main purpose.' , trap_type:'true_but_irrelevant'},
      { p:'Scientists have long studied how sleep affects memory consolidation. Recent research suggests that during REM sleep, the brain actively replays and encodes experiences from the day. This process appears to be critical for long-term retention.', q:'The main idea of this passage is best expressed as:', c:['REM sleep is one of several stages in the sleep cycle','Sleep, specifically REM sleep, plays a key role in how the brain processes and retains memories','Scientists have studied sleep for a long time','Recent research methods are more advanced than older ones'], a:1, e:'The passage covers: sleep → memory consolidation → REM specifically → long-term retention. B captures the relationship between sleep (specifically REM) and memory. A narrows to structure; C is background; D is not stated.' , trap_type:'true_but_irrelevant'},
      { p:null, q:'You are choosing between: (A) "The passage argues that economic inequality worsened during the recession." (B) "The passage argues that economic inequality, structural vulnerability, and policy failures all contributed to the prolonged recession." The passage has sections on all three topics. Which is the main idea?', c:['A — inequality is discussed first and most extensively','B — it captures the passage\'s multi-factor argument, while A captures only one factor','A — simpler choices are usually correct for main idea','B — longer choices are usually main ideas'], a:1, e:'If the passage argues for multiple contributing factors, the main idea must reflect all of them. A captures only one factor — it\'s accurate but incomplete. Incomplete = wrong for "main idea" questions.' , trap_type:'true_but_irrelevant'},
      { p:null, q:'The difference between a passage\'s "main idea" and its "primary purpose" is:', c:['They are the same — both describe the overall argument','Main idea = the content claim (what the author argues); primary purpose = the author\'s goal in writing (to argue, to inform, to challenge, to persuade)','Primary purpose is always stated in the first sentence; main idea is in the last','Main idea applies to fiction; primary purpose applies to non-fiction'], a:1, e:'Main idea: "The author argues that X causes Y." Primary purpose: "To challenge conventional assumptions about Z." One is the content, the other is the function/goal of the writing.' , trap_type:'true_but_irrelevant'},
      { p:null, q:'A passage has a two-sentence intro, six body paragraphs of evidence, and a one-paragraph conclusion. The main idea question asks you to pick the best summary. You should look primarily at:', c:['The intro — main ideas are always introduced first','The conclusion — main ideas are always restated there','Both the intro and conclusion together, since the intro introduces the claim and the conclusion often synthesizes it most completely','The longest body paragraph — it contains the most evidence'], a:2, e:'Intro + conclusion together usually bracket the main idea. The intro introduces it; the conclusion may sharpen or synthesize it. Neither alone is always sufficient — use both.' , trap_type:'true_but_irrelevant'},
    ],
    R6:[
      { p:null, q:'A question asks for "textual evidence that best supports the conclusion in the previous question." You answered the previous question correctly: "The author doubts the effectiveness of the new regulation." Which excerpt best supports this?', c:['(A) "The regulation passed with bipartisan support."','(B) "Critics have long argued for stricter oversight."','(C) "Whether such measures will achieve their intended goals remains to be seen."','(D) "The regulation was first proposed in 2019."'], a:2, e:'"Whether such measures will achieve their intended goals remains to be seen" directly expresses doubt about effectiveness. A shows support for the regulation. B is about critics (not the author). D is a factual date.' , trap_type:'recycled_language'},
      { p:null, q:'In a paired "claim + evidence" question, you got the claim question wrong (you selected C when B was correct). Now you\'re on the evidence question. What is the best approach?', c:['Answer the evidence question independently based on the passage, then reconsider the claim question if the evidence leads you to a different answer','Accept your wrong answer and pick evidence that supports C','Skip the evidence question','Pick the evidence choice that matches the most words in your C answer'], a:0, e:'Evidence questions are interdependent with claim questions. If you\'re uncertain about the claim, the evidence question can help: correct evidence points to the correct claim. Reconsider the claim if the evidence leads you there.' , trap_type:'recycled_language'},
      { p:'The expedition team returned with extensive data. "Our findings," wrote the lead researcher, "suggest we may have fundamentally misunderstood the ecosystem\'s resilience."', q:'Which choice provides the best evidence that the expedition produced surprising results?', c:['The team returned with extensive data','The lead researcher wrote about the findings','The researcher\'s statement suggests the data challenged previous assumptions about resilience','The expedition team completed their mission'], a:2, e:'"May have fundamentally misunderstood" = previous assumptions challenged = surprised by results. A is about data quantity, not surprise. B is about who wrote, not what was found. D is neutral completion.' , trap_type:'recycled_language'},
      { p:null, q:'The evidence question asks which lines "best support" the claim that the author is skeptical. You find three choices that each contain the word "skeptical" in the excerpt. What is the risk?', c:['No risk — the word "skeptical" directly supports the claim','Recycled-language trap: choices with the target word explicitly in the excerpt often reflect the question\'s language being inserted into the passage, not genuine textual support. The evidence must show skepticism in context, not just state it.','Choices with the target word are always correct','One of the three is correct, and you should pick the longest'], a:1, e:'Evidence questions can trap you with choices that use the exact word from the claim but in ways that don\'t actually demonstrate the claim. Look for choices where the passage\'s language demonstrates the quality — not just names it.' , trap_type:'recycled_language'},
      { p:null, q:'A claim question asks: "The author suggests traditional methods are inadequate." You answer: "The author believes new methods are superior." Are these the same?', c:['Yes — if new is superior, traditional must be inadequate','No — "traditional is inadequate" and "new is superior" are different claims. The passage might endorse new methods without explicitly criticizing traditional ones. Evidence for the second doesn\'t automatically support the first.','Yes — they are logically equivalent','No — but you should pick evidence that supports both simultaneously'], a:1, e:'These are different logical claims. A passage could argue new methods are better without saying traditional methods are inadequate (they may have been appropriate for their time). Don\'t confuse "A is better" with "B is bad."' , trap_type:'recycled_language'},
    ],
    R7:[
      { p:null, q:'A question gives you two short passages and asks: "How does the author of Passage 2 respond to the claim made in Passage 1?" Your process should be:', c:['Read both passages fully, then guess from the choices','Identify the specific claim in Passage 1 → identify how Passage 2 addresses it → predict the relationship → match to choices','Read only the portions of each passage cited in the question','Read Passage 2 first to understand the response, then check Passage 1'], a:1, e:'Paired passages require you to identify the claim in P1, then find how P2 responds. The relationship (challenge, support, qualify, extend) is determined by comparing both.' , trap_type:'could_be_true'},
      { p:null, q:'Passage 1 argues: "Competition drives innovation." Passage 2 argues: "Collaboration produces more sustainable innovation than competition." The relationship between the passages is best described as:', c:['Passage 2 fully contradicts Passage 1','Passage 2 qualifies and redirects Passage 1\'s claim — accepting that innovation is the goal but arguing collaboration is the better mechanism','Passage 2 is unrelated to Passage 1','Passage 2 provides evidence for Passage 1\'s claim'], a:1, e:'P2 doesn\'t deny innovation is valuable — it redirects the mechanism. This is a qualification/redirection relationship, not a flat contradiction. P2 accepts the goal (innovation) while challenging the means (competition vs. collaboration).' , trap_type:'could_be_true'},
      { p:null, q:'Both passages discuss climate change mitigation. Passage 1 focuses on policy solutions; Passage 2 focuses on individual behavior change. A question asks what both authors would agree on. You should look for:', c:['Claims that appear in exactly the same words in both passages','The underlying assumption both arguments require to work — the common ground, often unstated, that both depend on','The claim made most strongly in Passage 1','The conclusion of Passage 2'], a:1, e:'Agreement questions test common ground — often shared premises or goals that both arguments depend on, even when the specific arguments differ. Look for what both arguments assume to be true.' , trap_type:'could_be_true'},
      { p:null, q:'A question asks: "The author of Passage 1 would most likely respond to Passage 2\'s argument by ___." What is the correct approach?', c:['Predict what a reasonable person would say to Passage 2','Identify Passage 1\'s core position → determine whether Passage 2\'s claim supports, contradicts, or is neutral to that position → predict P1\'s likely response based on P1\'s actual argument','Read only Passage 2 and infer what objections exist','Ask what you personally believe about the topic'], a:1, e:'P1\'s hypothetical response must be rooted in P1\'s actual argument. You\'re not inventing a response — you\'re extending P1\'s logic to P2\'s claim. What would someone who believes P1 say about P2?' , trap_type:'could_be_true'},
      { p:null, q:'Passage 1 says: "Physical exercise has been conclusively linked to improved mental health outcomes." Passage 2 says: "While physical exercise shows promising correlations with mental health, causality remains difficult to establish." What is the key difference?', c:['P1 and P2 discuss different types of exercise','P1 claims a conclusive causal link; P2 accepts a correlation but challenges the certainty of causation','P1 supports exercise; P2 opposes it','P2 provides evidence that P1 lacks'], a:1, e:'Exact difference: P1 says "conclusively linked" (strong causation); P2 accepts the correlation but says causality is hard to establish (challenges certainty). This is a precision-of-claim difference, not a direction difference.' , trap_type:'could_be_true'},
    ],
    R8:[
      { p:null, q:'You are told a passage discusses two contrasting theories. After reading, a question asks: "The author\'s own position is best described as ___." Where should you look first?', c:['Whichever theory is introduced first — that\'s always the author\'s preferred one','The conclusion of the passage — authors typically state or signal their preference in the closing paragraph','The middle of the passage — balanced positions appear there','The passage title'], a:1, e:'In a passage comparing two theories, the author\'s preference is most clearly signaled in the conclusion or thesis statement. Middle paragraphs are usually dedicated to presenting both sides fairly.' , trap_type:'could_be_true'},
      { p:'Some argue that early intervention produces the best educational outcomes. Others maintain that developmental readiness is paramount and that forcing early learning may be counterproductive. The evidence, taken as a whole, supports a context-dependent approach.', q:'The author\'s position is best described as', c:['Strongly favoring early intervention','Strongly opposing early intervention','Arguing that neither position is universally correct — the best approach depends on context','Neutral with no discernible position'], a:2, e:'"Context-dependent approach" = neither universally correct. The author synthesizes both sides into a nuanced middle position. A and B are the two sides being evaluated; D misreads the synthesis as neutrality.' , trap_type:'could_be_true'},
      { p:null, q:'A question asks: "With which statement would the author most likely agree?" Your approach:', c:['Find the statement that most closely matches what you know about the topic','Find the statement that is most consistent with the author\'s argument and tone as established throughout the passage','Pick the statement that appears earliest in the passage','Pick the most moderate-sounding statement'], a:1, e:'Author\'s likely agreement questions require you to extend the author\'s established position. The passage is the evidence — what has the author argued? What tone do they take? Project that position onto the new statement.' , trap_type:'could_be_true'},
      { p:null, q:'An author writes: "These findings are suggestive, though definitive conclusions await further study." What does this signal about the author\'s position on the findings?', c:['The author is dismissive of the findings','The author endorses the findings as conclusive','The author finds the findings promising but is cautious about overstating their certainty','The author believes further study will contradict the findings'], a:2, e:'"Suggestive" = promising but not definitive. "Definitive conclusions await further study" = not conclusive yet. The author is cautiously interested — not dismissive, not fully endorsing. This is calibrated optimism.' , trap_type:'could_be_true'},
      { p:null, q:'You are asked about the author\'s point of view in a passage that presents multiple perspectives with no clear thesis statement. What should you look for?', c:['The perspective presented with the most evidence','Evaluative language — words like "unfortunately," "remarkably," "crucially," "rightly" — which reveal the author\'s judgment without explicit argument','The perspective that appears in the first paragraph','The perspective the author attributes to experts'], a:1, e:'When no explicit thesis exists, evaluative language is your evidence for author\'s point of view. "Unfortunately, critics have overlooked..." tells you the author thinks critics have made an error, even without a thesis statement.' , trap_type:'could_be_true'},
    ],


    // ── BATCH 2: Reading Passage (R9–R13) + Grammar (G1–G7) ──
    R9:[
      { p:"A geologist studying sediment cores noted regular alternating layers of light and dark material. The dark layers corresponded to periods of high biological productivity; the light layers, to periods of reduced activity. Over 40,000 years, the pattern repeated with remarkable consistency.", q:"What does the 40,000-year regularity most strongly suggest?", c:["The sediment cores are unreliable data sources","The alternating productivity levels were driven by a cyclical external force, not random variation","Biological productivity is impossible to measure over long time periods","The geologist made a calculation error"], a:1, e:"Regularity over a long consistent cycle implies a driving external mechanism — likely orbital or climatic cycles. Random variation does not produce regular repeating patterns. This is an inference from the data pattern described." , trap_type:'could_be_true'},
      { p:null, q:"A 500-word passage describes how monarch butterflies navigate using the sun. A question asks: 'What can be inferred about monarch navigation on overcast days?' The passage does not mention overcast days. Your inference must be based on:", c:["What you know about butterflies from biology class","The passage's logic — if monarchs navigate by sun, then on overcast days that mechanism is disrupted; the passage implies this even without stating it","Any reference to weather in the passage","A guess — you cannot infer what the passage does not say"], a:1, e:"Inference questions test what logically follows from the passage's stated logic. If the passage says monarchs navigate by sun, it logically follows that removing the sun disrupts navigation. Valid inferences extend the passage's logic, not outside knowledge." , trap_type:'could_be_true'},
      { p:"The city's growth accelerated after the railroad arrived in 1887. Population tripled within a decade. By 1900 it had overtaken its rival to the east. Yet the prosperity was uneven — longshoremen and factory workers saw wages stagnate even as merchants and landowners accumulated significant wealth.", q:"What does the passage suggest about the railroad's impact on the city?", c:["The railroad caused the city to grow uniformly and benefit all residents equally","The railroad spurred dramatic overall growth, but the benefits were concentrated among the upper economic classes","The railroad had no impact on wages","The railroad arrived too late to significantly affect the city's development"], a:1, e:"Growth evidence: population tripled, overtook rival. But 'prosperity was uneven' with workers' wages stagnating while merchants grew wealthy. The railroad drove growth, but benefits were unequal. B captures both sides." , trap_type:'could_be_true'},
      { p:null, q:"You read a passage about a scientist's claim and the evidence challenging it. An inference question asks: 'What would the scientist most likely say in response to the new evidence?' Your answer should be based on:", c:["What a scientist would typically say in such a situation based on general knowledge","The scientist's stated reasoning in the passage — project how that reasoning would respond to the new evidence, staying within what the passage establishes about the scientist's argument","The new evidence alone","The passage's conclusion about who is correct"], a:1, e:"You are asked to extend the scientist's argument — not invent a response. Use the scientist's actual stated reasoning as your foundation. What would that specific argument say about the specific new evidence?" , trap_type:'could_be_true'},
      { p:"Historical records show that urban mortality rates declined sharply between 1880 and 1920. The most recent scholarship, analyzing causes of death by age cohort, suggests that declining infant mortality from diarrheal disease was the dominant factor — pointing to sanitation as the proximate cause.", q:"What inference is best supported by the passage?", c:["Medical advances were the primary cause of declining mortality","Improved nutrition had no impact on mortality rates in this period","Sanitation infrastructure was likely the most significant driver of improved urban mortality","Infant mortality declined more than adult mortality across all cities"], a:2, e:"The passage's most recent scholarship concludes declining infant diarrheal disease (sanitation-related) was dominant. This most directly supports sanitation as primary driver. A contradicts the recent scholarship; D adds geographic claims not in the text." , trap_type:'could_be_true'},
    ],
    R10:[
      { p:"In her essay, Chen argues that contemporary urban design fails to account for how people actually experience cities. She draws on neurological research demonstrating that irregular, complex street patterns activate more of the brain's navigational and aesthetic processing than grid layouts. 'A city,' she writes, 'should be experienced as a living organism, not a spreadsheet.'", q:"Chen's comparison of a city to a 'living organism' rather than a 'spreadsheet' primarily serves to", c:["Provide scientific evidence for her claim","Contrast the sensory richness she values with the cold efficiency she critiques","Introduce the topic of urban planning history","Argue that spreadsheets are an inadequate planning tool"], a:1, e:"Organism = living, complex, sensory. Spreadsheet = cold, grid-based, efficiency-focused. The contrast in the metaphor does rhetorical work: it embeds her critique of overly mechanistic urban planning in the language itself." , trap_type:'true_but_irrelevant'},
      { p:null, q:"An author uses a lengthy anecdote about one traveler's experience to introduce an argument about the unreliability of eyewitness testimony. What function does the anecdote serve?", c:["It provides statistical evidence for the argument","It offers a concrete illustration that makes the abstract argument accessible before the formal argument begins","It contradicts the author's main claim","It is the author's personal experience"], a:1, e:"Opening anecdotes: (1) engage the reader, (2) make abstract arguments accessible, (3) provide a specific case the author can reference. They are rhetorical tools, not statistical evidence." , trap_type:'true_but_irrelevant'},
      { p:"The author writes: 'One could argue, of course, that these incentives are sufficient. One would be wrong.'", q:"The author's use of 'One could argue... One would be wrong' is best understood as", c:["A respectful acknowledgment of the opposing view","A dismissive rhetorical move that acknowledges the counterargument then immediately and emphatically rejects it","A neutral presentation of both sides","A concession that weakens the author's position"], a:1, e:"The construction acknowledges then immediately refutes. 'One would be wrong' is emphatic rejection, not a concession. This rhetorical device takes the opposing view seriously enough to mention it, then flatly dismisses it." , trap_type:'true_but_irrelevant'},
      { p:null, q:"An author of a science passage uses a simile comparing a cell's membrane to a nightclub bouncer. What is the primary rhetorical purpose?", c:["To provide a precise scientific definition of membrane function","To make an abstract cellular process — selective permeability — understandable to a non-specialist by comparing it to a familiar concept","To argue that cellular biology is entertaining","To introduce membrane biology historically"], a:1, e:"Similes in explanatory writing bridge specialist knowledge and general understanding. 'Bouncer = selective admittance' makes selective membrane permeability immediately intuitive. Purpose: clarification for non-specialist readers." , trap_type:'true_but_irrelevant'},
      { p:"Critics of the proposal were numerous and vocal. Yet the committee moved forward. In retrospect, this was perhaps the defining error of the administration.", q:"The phrase 'in retrospect' signals that the author is", c:["Expressing uncertainty about whether an error occurred","Evaluating the decision from a later vantage point, implying consequences became clear over time","Quoting another source's assessment","Predicting a future outcome"], a:1, e:"'In retrospect' = backward-looking evaluation. The author is describing how the error became clear after the fact — with the benefit of knowing what followed. It signals post-hoc judgment." , trap_type:'true_but_irrelevant'},
    ],
    R11:[
      { p:null, q:"A question asks you to 'choose the best evidence for the claim that the author views urban sprawl negatively.' You find: (A) a statistical claim about sprawl's costs, and (B) the author's explicit judgment: 'urban sprawl represents one of the most misguided developments in modern city planning.' Which is better evidence?", c:["The statistical claim — data is always stronger evidence","The explicit judgment — direct authorial evaluation is the most direct evidence for the author's view","Both are equally valid","Neither — evidence for an author's view must come from the conclusion"], a:1, e:"For evidence-of-author's-view questions, explicit authorial evaluation is the strongest evidence. Statistics describe a topic; judgment words like 'misguided' directly express the author's position." , trap_type:'scope_trap'},
      { p:"The data suggests a link. The data does not prove causation.", q:"What does this two-sentence passage most directly illustrate?", c:["Data is unreliable","The distinction between correlation and causation — a link can exist without one causing the other","Causal claims are always stronger than correlational ones","Scientific data requires multiple studies"], a:1, e:"Two sentences, one concept: link does not equal causation. The passage explicitly illustrates the correlation/causation distinction. A is too strong; C inverts the point; D introduces replication not in the text." , trap_type:'scope_trap'},
      { p:null, q:"A passage says: 'This reasoning has a significant flaw.' What should the next sentence do?", c:["Introduce a new argument unrelated to the first","Identify the flaw in the preceding argument","Summarize the original argument again","Provide historical background"], a:1, e:"Signal phrases predict structure. 'This reasoning has a significant flaw' announces the next move: identifying the flaw. Structural prediction saves re-reading time." , trap_type:'scope_trap'},
      { p:"The researchers expected the treatment to reduce inflammation. Instead, it increased it. They concluded, cautiously, that the drug's mechanism operates differently in vivo than in laboratory conditions.", q:"The word 'cautiously' suggests the researchers", c:["Were disappointed with the results","Were uncertain about the direction of the effect","Recognized the result was surprising and did not want to overstate conclusions from a single unexpected outcome","Were planning to abandon the research"], a:2, e:"'Cautiously concluded' signals a limited conclusion — they are not fully claiming the result because it was unexpected and may not replicate. Caution in scientific language signals epistemic humility about a surprising finding." , trap_type:'scope_trap'},
      { p:null, q:"A passage about the history of vaccination ends: 'It would not be an exaggeration to say that vaccination has saved more lives than any other medical intervention.' What kind of claim is this?", c:["A research hypothesis that needs testing","A qualified, hedged claim","A strong emphatic conclusion that the author presents as the logical culmination of the passage's evidence","An off-topic addition"], a:2, e:"'It would not be an exaggeration to say...' is actually an emphatic affirmation — a rhetorical device that makes a strong claim while appearing measured. Saying it is 'not an exaggeration' signals the author believes it fully." , trap_type:'scope_trap'},
    ],
    R12:[
      { p:null, q:"A sentence reads: 'The report ___ was released last week contained several errors.' No comma precedes the blank. Should you use 'which' or 'that'?", c:["'which' — both words are interchangeable","'which' with a comma always","'that' — no comma plus essential identifying information equals restrictive clause, which takes 'that'","'who' — used for important documents"], a:2, e:"Restrictive clauses (essential to identify what is being discussed) use 'that' without a comma. Non-restrictive clauses (added, removable information) use 'which' with a comma. No comma + essential identification = 'that.'" , trap_type:null},
      { p:null, q:"The sentence reads: 'The committee, which had met three times, reached a decision.' Which rewrite is correct without 'which'?", c:["The committee met three times and reached a decision.","The committee, having met three times, reached a decision.","The committee that met three times reached a decision.","The committee met three times it reached a decision."], a:1, e:"The 'which' clause is non-restrictive (the committee's identity is established; meeting count is added information). Converting to a participial phrase 'having met three times' preserves this relationship. A merges two distinct ideas." , trap_type:null},
      { p:null, q:"A sentence uses 'however' between two independent clauses with only a comma: 'The results were promising, however the sample size was small.' What is the error?", c:["No error","Comma splice — 'however' is an adverb, not a coordinating conjunction; you need a semicolon before 'however': 'promising; however, the sample size was small.'","The sentence needs 'but' instead of 'however'","The comma should be removed"], a:1, e:"'However' is not in FANBOYS. Two independent clauses joined only by a comma = comma splice. Correct: semicolon before 'however' + comma after. Or: split into two sentences." , trap_type:null},
      { p:null, q:"The sentence reads: 'The group of students were studying late.' Should the verb be 'was' or 'were'?", c:["'were' — 'students' is closest to the verb and is plural","'was' — the subject is 'group,' a singular collective noun; the verb agrees with 'group,' not the prepositional object","Either is acceptable","The sentence should be rewritten"], a:1, e:"Subject-verb agreement: the subject is 'group' (singular), not 'students' (prepositional phrase object). Do not be distracted by the noun closest to the verb — find the actual grammatical subject." , trap_type:null},
      { p:null, q:"The sentence reads: 'Running through the park, the flowers caught Maria's attention.' What is wrong?", c:["Nothing — the sentence is grammatically correct","Dangling modifier — 'running through the park' should modify Maria, but the sentence makes it modify 'the flowers,' which cannot run","Comma splice","Subject-verb disagreement"], a:1, e:"Dangling modifier: 'running through the park' must be immediately followed by the noun doing the running. 'Flowers' cannot run. Correct: 'Running through the park, Maria noticed the flowers.'" , trap_type:null},
    ],
    R13:[
      { p:null, q:"You need to choose between 'Furthermore' and 'However' as a transition. Sentence 1: 'The treatment reduced pain.' Sentence 2: '___, it produced significant side effects.' Which is correct?", c:["Furthermore — adding another quality","However — introducing a contrasting, negative outcome","Therefore — showing causation","Additionally — adding a related point"], a:1, e:"'However' introduces contrast or complication. S1 is positive (reduced pain); S2 is negative (side effects). Contrast relationship = 'However.'" , trap_type:null},
      { p:null, q:"A question asks which sentence 'most logically concludes the paragraph.' The paragraph describes three pieces of evidence for climate change. The most logical conclusion is:", c:["A sentence introducing a new, unrelated topic","A sentence that synthesizes the evidence and states what it collectively shows","A sentence about the history of climate science","A sentence offering a counterargument to climate change"], a:1, e:"A concluding sentence synthesizes evidence and draws a conclusion — it does not introduce new topics, provide irrelevant history, or contradict the paragraph's established point." , trap_type:null},
      { p:null, q:"A paragraph is about the importance of sleep for cognitive performance. A proposed sentence: 'Melatonin is a hormone that regulates sleep cycles.' Does this belong?", c:["Yes — it provides relevant scientific detail","No — while related to sleep, it is a definitional aside that does not advance the argument about cognitive performance","Yes — all sleep-related sentences belong in a sleep paragraph","No — melatonin is not relevant to sleep"], a:1, e:"Paragraph coherence: the argument is sleep → cognitive performance. A definition of melatonin is about sleep biochemistry, not cognitive performance. Adding it creates a detour that dilutes focus." , trap_type:null},
      { p:null, q:"The best transition between a paragraph describing a problem and a paragraph proposing a solution is:", c:["'In contrast, ...'","', and therefore ...'","'To address this challenge, ...'","'Similarly, ...'"], a:2, e:"'To address this challenge' explicitly links the problem (just described) to the solution (about to be proposed). It signals the pivot from problem identification to problem-solving. Other choices signal contrast, addition, or similarity — not problem-to-solution." , trap_type:null},
      { p:null, q:"A sentence reads: 'The scientist questioned weather the experiment would succeed.' What is the error?", c:["No error","Homophone error — 'weather' (atmospheric conditions) vs. 'whether' (introduces a conditional or doubt). The sentence needs 'whether.'","Tense error","Subject-verb agreement error"], a:1, e:"'Weather' = meteorological conditions. 'Whether' = introduces a conditional or doubt. Homophones are common SAT targets. Context: 'questioned ___ the experiment would succeed' requires 'whether.'" , trap_type:null},
    ],
    G1:[
      { p:null, q:"A sentence reads: 'Exhausted after the marathon, the medal felt meaningless to him.' What type of error is this?", c:["No error","Dangling modifier — 'exhausted' should modify the person (him), but the grammatical subject is 'the medal,' which cannot be exhausted","Comma splice","Pronoun-antecedent disagreement"], a:1, e:"'Exhausted' must modify whoever is exhausted — 'him.' But 'medal' is the sentence's subject. Fix: 'Exhausted after the marathon, he found the medal meaningless.' The participial phrase must match the sentence's subject." , trap_type:null},
      { p:null, q:"A participial phrase at the start of a sentence must modify what?", c:["The object of the sentence","The subject of the main clause immediately following the comma","Any noun in the sentence","The verb of the sentence"], a:1, e:"Modifier rule: the noun immediately after the comma is what the opening participial phrase modifies. If that noun cannot logically perform the action in the phrase, the modifier dangles." , trap_type:null},
      { p:null, q:"Which sentence correctly places the opening modifier?", c:["Having studied all night, the exam was easy.","Having studied all night, the results came quickly.","Having studied all night, she found the exam manageable.","Having studied all night, the library closed early."], a:2, e:"C is correct: 'Having studied all night' → 'she' studied. The modifier and the subject of the main clause match. All other options have subjects that cannot logically do the studying." , trap_type:null},
      { p:null, q:"The sentence reads: 'I only eat vegetables on Tuesdays.' What does this sentence mean compared to 'I eat only vegetables on Tuesdays'?", c:["Both mean the same thing","'I only eat vegetables on Tuesdays' = I restrict my eating to Tuesdays; 'I eat only vegetables on Tuesdays' = I eat nothing but vegetables on Tuesdays. Modifier placement changes meaning.","'Only' cannot modify eating habits","Neither sentence is grammatically correct"], a:1, e:"'Only' modifies the word or phrase it's closest to. 'Only eat' = the act of eating is restricted. 'Only vegetables' = vegetables are the restricted category. Placement changes meaning entirely." , trap_type:null},
      { p:null, q:"The sentence reads: 'The report, written by the committee and which took three months, was released.' What is the grammatical issue?", c:["No error","Parallel structure error — 'written by the committee' (participial phrase) and 'which took three months' (relative clause) are grammatically mismatched in a paired modifier","Comma splice","Subject-verb agreement"], a:1, e:"Parallel modifiers: when two modifying phrases are joined by 'and,' they should be grammatically parallel. Fix: 'written by the committee and taking three months' — both participial, or 'that was written by the committee and that took three months' — both relative." , trap_type:null},
    ],
    G2:[
      { p:null, q:"A sentence reads: 'Neither the manager nor the employees was aware of the change.' Is 'was' correct?", c:["Yes — 'neither...nor' always takes singular","No — with 'neither...nor,' the verb agrees with the nearer subject; 'employees' is plural, so 'were' is correct","Yes — 'employees' is a collective noun here","No — 'neither...nor' always takes plural"], a:1, e:"'Neither...nor' rule: verb agrees with the CLOSER subject. 'Employees' (plural) is closer to the verb → 'were.' If it were 'employees or the manager,' the verb would be singular. Proximity determines agreement." , trap_type:null},
      { p:null, q:"The subject is 'the quality of the recommendations.' The verb should agree with:", c:["'recommendations' (plural) → 'are'","'quality' (singular) → 'is'","Whichever noun is most important","The entire noun phrase, treated as collective"], a:1, e:"Subject-verb agreement: identify the actual subject, not the object of a prepositional phrase. 'Quality' is the subject; 'of the recommendations' is a prepositional phrase modifier. 'Quality is' — singular." , trap_type:null},
      { p:null, q:"The sentence reads: 'Five dollars are a fair price.' What is the error?", c:["No error — 'dollars' is plural, so 'are' is correct","Amounts of money treated as a single sum take singular verbs — 'Five dollars is a fair price'","The sentence needs 'seem' instead of 'are'","No error — it depends on whether dollars refers to bills or an amount"], a:1, e:"When a quantity of money, time, or distance is treated as a single unit, use singular: 'Five dollars IS a fair price.' Compare: 'Five dollar bills are scattered on the table' (individual items = plural)." , trap_type:null},
      { p:null, q:"The sentence reads: 'Politics are a contentious subject.' Is 'are' correct?", c:["Yes — 'politics' ends in -s so it is plural","No — 'politics' names a field of study and is treated as singular: 'Politics is a contentious subject.' Compare: 'mathematics is difficult.'","Yes — all -ics words are plural","No — 'politics' always takes 'are' regardless of context"], a:1, e:"Fields of study ending in -ics (politics, economics, mathematics, physics, ethics) are treated as singular nouns. 'Mathematics is difficult.' 'Politics is contentious.' Distinct from: 'Her politics are moderate' (plural noun)." , trap_type:null},
      { p:null, q:"The sentence reads: 'Everyone on both teams have signed the waiver.' What is the correction?", c:["'Everyone... have' is correct — 'teams' is plural","'Everyone... has' — 'everyone' is always singular regardless of the prepositional phrase","'All of everyone... has'","No correction needed"], a:1, e:"'Everyone,' 'someone,' 'anyone,' 'no one,' 'everybody' are indefinite pronouns and always singular. 'Everyone has signed' — regardless of 'on both teams.' The prepositional phrase modifies everyone, does not change its number." , trap_type:null},
    ],
    G3:[
      { p:null, q:"The sentence reads: 'The researcher, along with his colleagues, are presenting at the conference.' What is the error?", c:["No error — 'colleagues' is plural, so 'are' is correct","Subject-verb agreement error — 'along with his colleagues' is a parenthetical phrase, not part of the subject. The subject is 'researcher' (singular) → 'is presenting'","Tense error","Pronoun error"], a:1, e:"'Along with,' 'as well as,' 'together with' are parenthetical phrases — they do not change the grammatical subject. 'Researcher' is singular → 'is presenting.' Do not let parenthetical phrases change your verb." , trap_type:null},
      { p:null, q:"A sentence reads: 'A number of problems have emerged.' Is 'have' correct?", c:["No — 'a number' is singular, so 'has' is correct","Yes — 'a number of' functions like 'several' and takes a plural verb; 'the number of' (a specific count) takes singular","Yes — always use plural after 'of'","No — always use singular after 'a number'"], a:1, e:"'A number of' = several → plural verb. 'The number of' = the total count → singular verb. 'A number of problems have emerged' ✓ and 'The number of problems has grown' ✓ — both correct." , trap_type:null},
      { p:null, q:"The sentence reads: 'The team were arguing amongst themselves.' In American English standard, is this correct?", c:["Yes — 'were' is always correct for groups","No — in American English, collective nouns like 'team' are treated as singular: 'The team was arguing.' British English may use plural for individual action.","Yes — 'themselves' confirms the plural is intended","No — the sentence should use 'had been arguing'"], a:1, e:"AmE: collective nouns (team, committee, jury) take singular verbs. 'The team was arguing.' BrE may use plural when members act individually. SAT tests AmE conventions." , trap_type:null},
      { p:null, q:"The sentence reads: 'Each of the team members are responsible for their own equipment.' Identify the error.", c:["No error — 'team members' is plural","Subject-verb error — 'each' is singular, requiring 'is.' The verb should be 'Each... is responsible.'","Pronoun error only","No error if the team is large"], a:1, e:"'Each' is singular → 'is.' 'Each of the team members IS responsible for their own equipment.' (Singular 'they/their' for 'each' is accepted in current usage.)" , trap_type:null},
      { p:null, q:"The sentence reads: 'Twenty years have passed since the founding.' Is 'have' correct?", c:["No — 'twenty' requires a singular verb","No — time periods functioning as a single duration take singular: 'Twenty years has passed' OR treat as individual units: 'have.' Depends on intended meaning.","Yes — numbers always take plural","No — the sentence needs 'is'"], a:1, e:"'Twenty years' can be treated as a single span (singular: 'has passed') or as individual years (plural: 'have passed'). Both are defensible. SAT questions with this ambiguity usually provide context that clarifies which is intended." , trap_type:null},
    ],
    G4:[
      { p:null, q:"A sentence reads: 'The company increased their profits significantly last quarter.' In formal writing, what is the issue?", c:["No issue — 'company' can take 'their'","In formal writing, singular collective nouns like 'company' take singular pronouns: 'its profits.' 'Their' is colloquial but inconsistent with SAT formal usage.","The issue is the tense","The issue is 'significantly' placement"], a:1, e:"'Company' is a singular entity → 'its profits.' SAT formal writing requires singular pronoun-antecedent agreement for collective nouns. Match the pronoun to the noun's grammatical number." , trap_type:null},
      { p:null, q:"A sentence reads: 'When a student finishes their exam, they should turn it in immediately.' Is this acceptable?", c:["No — 'their' and 'they' are plural; 'a student' is singular","Yes — singular 'they/their' for gender-neutral singular antecedents is accepted in modern standard English, including on the SAT","No — the sentence must say 'he or she'","Yes — but only when the gender of the student is unknown"], a:1, e:"The SAT now accepts singular 'they/their' as a gender-neutral singular pronoun. 'When a student finishes their exam' — acceptable. Both 'he or she' and 'they' are valid in current standard usage." , trap_type:null},
      { p:null, q:"A sentence reads: 'Neither the report nor the data support the conclusion.' Is 'support' correct?", c:["No — 'neither...nor' always takes singular, so 'supports' is required","Yes — the verb agrees with the nearer noun; if 'data' is treated as plural, 'support' is correct","No — 'neither...nor' makes the subject collective, requiring 'supports'","Yes — 'neither...nor' always takes plural"], a:1, e:"'Neither...nor' verb agreement: agree with the closer noun. 'Data' (closer) — if treated as plural (scientific writing), 'support' is correct. If singular, 'supports.' Context and passage register determine which." , trap_type:null},
      { p:null, q:"The sentence reads: 'Each student must bring their own calculator.' Is 'their' correct?", c:["No — 'each' is singular, requiring 'his or her calculator'","Yes — singular 'they/their' is now accepted as a gender-neutral singular, and 'each student... their' is standard in modern usage","No — 'each' makes the noun collective, requiring 'its'","Yes — 'their' is always correct after 'each'"], a:1, e:"Both 'his or her' and 'their' are acceptable for singular gender-neutral antecedents. The SAT accepts singular 'they.' If both appear as choices, the question likely has a different grammatical error to identify." , trap_type:null},
      { p:null, q:"A sentence reads: 'The band announced they would go on tour.' Is 'they' correct?", c:["No — 'band' is a singular collective noun, requiring 'it would go on tour'","Yes — in common usage, especially for musical groups and sports teams, collective nouns regularly take plural pronouns; both 'it' and 'they' are defensible","No — 'they' makes the sentence ambiguous","Yes — collective nouns always take plural pronouns"], a:1, e:"Musical groups and sports teams (the band, the team, the squad) are commonly referred to with both 'it' (formal) and 'they' (informal/common). The SAT will clarify through context; if the passage uses a formal register throughout, 'it' may be preferred." , trap_type:null},
    ],
    G5:[
      { p:null, q:"The sentence reads: 'The affect of the drought on crop yields was more severe than expected.' How many errors?", c:["Zero","One — 'affect' (noun) should be 'effect' (noun)","Two — 'affect' should be 'effect,' and 'more severe' should be 'severer'","One — 'severe' should be 'worst'"], a:1, e:"One error: 'affect' as a noun = incorrect. 'Effect' is the noun meaning result/outcome. 'The EFFECT of the drought.' One error only — 'more severe' is acceptable for a three-syllable adjective." , trap_type:null},
      { p:null, q:"A sentence reads: 'The new regulation will effect significant change in the industry.' Is 'effect' used correctly?", c:["No — 'effect' is always a noun; 'affect' is the verb","Yes — 'effect' can be a verb meaning 'to bring about or produce.' 'To effect change' = to bring about change. This is a less common but correct usage.","No — the sentence should say 'affect change'","No — 'effect' must be preceded by 'an'"], a:1, e:"'Effect' as a verb means 'to bring about.' 'To effect change' = to produce change. This is a real usage, distinct from 'affect' (to influence). Rare but correct. The SAT may test both the common noun usage and this less common verb usage." , trap_type:null},
      { p:null, q:"The sentence reads: 'Its unclear weather the team will advance.' How many errors?", c:["One — 'weather' should be 'whether'","Two — 'Its' should be 'It's' (contraction), and 'weather' should be 'whether'","No errors","Three errors"], a:1, e:"Two errors: 'Its' (possessive pronoun) should be 'It's' (it is = contraction). 'Weather' (conditions) should be 'whether' (introducing a conditional). Two separate homophone/apostrophe errors." , trap_type:null},
      { p:null, q:"The sentence reads: 'The principle was firm in her believe that students learn best through experience.' How many errors?", c:["One — 'believe' should be 'belief'","Two — 'principle' (a rule/belief) should be 'principal' (the school administrator), and 'believe' (verb) should be 'belief' (noun)","No errors","Three errors"], a:1, e:"Two errors: 'principle' = a rule or value; the school administrator is 'principal.' And 'believe' is a verb; the noun form is 'belief.' 'Firm in her BELIEF.' Two distinct errors." , trap_type:null},
      { p:null, q:"The sentence reads: 'The compliment of researchers working on the project is impressive.' Is 'compliment' correct?", c:["Yes — a compliment is given to a group of researchers","No — 'compliment' (an expression of praise) should be 'complement' (a full set or completing group). 'The COMPLEMENT of researchers' = the full set.","Yes — both spellings are acceptable for this meaning","No — the word should be 'compilation'"], a:1, e:"'Compliment' = an expression of admiration. 'Complement' = something that completes or a full set. 'The complement of researchers' = the full team/set. Classic homophone pair." , trap_type:null},
    ],
    G6:[
      { p:null, q:"The sentence reads: 'Maria likes hiking, swimming, and to run.' What is the error?", c:["No error","Parallel structure error — the list should be 'hiking, swimming, and running' (all gerunds) or 'to hike, to swim, and to run' (all infinitives)","Subject-verb agreement error","Comma error"], a:1, e:"Parallel lists: all items in a list must use the same grammatical form. 'Hiking, swimming, and to run' mixes gerunds with an infinitive. Fix: 'hiking, swimming, and running.'" , trap_type:null},
      { p:null, q:"The sentence reads: 'The proposal was creative, well-researched, and had good timing.' What is the error?", c:["No error","Parallel structure error — 'creative' (adjective), 'well-researched' (adjective), and 'had good timing' (verb phrase) are not parallel. Fix: 'creative, well-researched, and timely.'","Comma error","Subject-verb error"], a:1, e:"'Creative' + 'well-researched' (adjectives) + 'had good timing' (verb phrase) = parallel structure mismatch. All three should be adjectives: 'creative, well-researched, and timely.'" , trap_type:null},
      { p:null, q:"The sentence reads: 'The study was not only comprehensive but also it was convincing.' What is the error?", c:["No error","After 'not only... but also,' the elements must be parallel. 'Not only comprehensive but also convincing' is correct — both adjectives, no extra clause.","'convincing' should be 'convinced'","The sentence is too long"], a:1, e:"'Not only... but also' is a correlative conjunction requiring parallel structure. 'Not only comprehensive (adj.) but also it was convincing (clause)' = mismatch. Fix: 'not only comprehensive but also convincing.'" , trap_type:null},
      { p:null, q:"Which sentence has correct parallel structure?", c:["The manager prefers delegating tasks, to conduct meetings, and managing budgets.","The report was thorough, organized, and showed accuracy.","The scientist designed the experiment, collected the data, and analyzed the results.","To win the award requires creativity, having talent, and dedication."], a:2, e:"C: 'designed,' 'collected,' 'analyzed' — all simple past verbs. Perfectly parallel. A mixes gerund + infinitive + gerund. B mixes adjectives + verb phrase. D mixes infinitive phrase + gerund + noun." , trap_type:null},
      { p:null, q:"The sentence reads: 'The CEO announced that the company would expand internationally, raise employee wages, and offering better benefits.' What is the error?", c:["No error","Parallel structure error — 'expand,' 'raise,' and 'offering' must all be in the same form. Since they follow 'would,' all should be base infinitives: 'expand, raise, and offer.'","'internationally' should be 'international'","Comma error"], a:1, e:"After 'would,' verbs need base form: 'would expand, raise, and offer.' 'Offering' is a gerund — it breaks the parallel infinitive structure. Fix: 'expand, raise, and offer.'" , trap_type:null},
    ],
    G7:[
      { p:null, q:"A sentence reads: 'The company was founded in 1985; it grew rapidly.' Is the semicolon used correctly?", c:["No — semicolons can only separate items in a list","Yes — a semicolon correctly joins two independent clauses that are closely related","No — a semicolon requires a transition word after it","No — a comma should be used instead"], a:1, e:"Semicolons join two independent clauses without a conjunction when the ideas are closely related. Both 'The company was founded in 1985' and 'it grew rapidly' are independent clauses. Correct." , trap_type:null},
      { p:null, q:"A sentence reads: 'The results were clear, however, further testing was recommended.' What is the error?", c:["No error","Comma splice — 'however' is an adverb, not a conjunction. Correct: 'The results were clear; however, further testing was recommended.' Semicolon required before 'however.'","The second comma after 'however' should be removed","A colon should replace the first comma"], a:1, e:"Comma + 'however' + comma between two independent clauses = comma splice. 'However' is a conjunctive adverb, not a coordinating conjunction. Correct: semicolon before 'however' + comma after." , trap_type:null},
      { p:null, q:"When should a colon be used in a sentence?", c:["After any introductory phrase","To introduce a list, explanation, or elaboration — but only when an independent clause precedes the colon","Between the subject and predicate","Before any coordinating conjunction"], a:1, e:"Colon rule: the material before the colon must be an independent clause. 'The experiment had three stages: design, execution, and analysis' ✓. 'The stages were: ...' ✗ — 'were' requires a direct object, not a colon." , trap_type:null},
      { p:null, q:"The sentence reads: 'She bought: apples, oranges, and grapes.' Is the colon used correctly?", c:["Yes — the colon introduces a list","No — a colon should not interrupt a verb-object relationship. 'She bought' is not an independent clause followed by a list; it is a verb that directly takes its objects. Correct: 'She bought apples, oranges, and grapes.'","Yes — colons always introduce lists","No — a semicolon should be used instead"], a:1, e:"A colon cannot interrupt a verb-object relationship. 'She bought [objects]' — the objects are direct objects, not a separately introduced list. Remove the colon entirely." , trap_type:null},
      { p:null, q:"Which sentence uses punctuation correctly?", c:["The three cities visited were; Paris, Rome, and Tokyo.","The three cities visited were: Paris, Rome, and Tokyo.","The three cities visited were, Paris, Rome, and Tokyo.","The project required three skills patience persistence and creativity."], a:1, e:"B is correct: independent clause + colon + list. A uses a semicolon incorrectly after 'were.' C uses a comma incorrectly. D lacks any punctuation before the list (needs a colon)." , trap_type:null},
    ],

    // ── BATCH 3: Math Core (M1–M9) + Desmos (M10–M15) ──
    M1:[
      { p:null, q:"You need to solve: 3x + 7 = 22. Choices are: 3, 4, 5, 6. Using Backsolving, which choice do you test first, and what is the result?", c:["Test 3 first: 3(3)+7=16 — too small; correct answer is 5","Test the middle value (5 or 4). Test 5: 3(5)+7=22 ✓ — correct answer is 5","Test 6 first (largest): 3(6)+7=25 — too large, so 5 is correct","Test 3: 3(3)+7=16. Too small. The answer must be 6."], a:1, e:"Backsolve: start with the middle choice. 5 is the middle of {3,4,5,6}. Test: 3(5)+7=22 ✓. Done in one step. If it were too small, test higher; if too large, test lower." , trap_type:null},
      { p:null, q:"You are backsolving and the middle choice gives a value that is too large. What do you test next?", c:["Test the largest choice — it might overshoot and confirm the pattern","Test the smaller choices — since the middle was too large, the answer is smaller","Test the smallest choice immediately — skip the second-middle","Re-read the problem; the middle is always correct when backsolving"], a:1, e:"Backsolving direction: too large → go smaller. Test the next smaller choice. This is always more efficient than testing from the extreme." , trap_type:null},
      { p:null, q:"For which type of problem is Backsolving MOST efficient compared to algebra?", c:["Simple one-step equations: 2x = 10","Multi-step equations with integer answers where testing is faster than setting up and solving algebraically: e.g., x² + x = 12","Equations where choices are expressions with variables","Systems of two equations with two unknowns"], a:1, e:"Backsolving shines on problems where algebraic manipulation is error-prone or slow, but the choices are specific integers that can be tested quickly. Simple one-step algebra is faster to solve directly." , trap_type:null},
      { p:null, q:"A word problem says: 'A number plus twice the number equals 21. What is the number?' Choices: 5, 6, 7, 8. Test Choice C (7):", c:["7 + 2(7) = 21 ✓ — correct answer is 7","7 + 2(7) = 28 — too large, answer is 5 or 6","7 + 2(7) = 14 — too small, answer is 8","7 + 7 = 14 — correct"], a:0, e:"Test: 7 + 2(7) = 7 + 14 = 21 ✓. Backsolving confirmed. Note: the problem says 'plus twice the number' — model carefully before testing. The trap here is reading 'twice' as just adding 7 again." , trap_type:null},
      { p:null, q:"When backsolving with fractional answer choices, what adjustment should you make?", c:["Avoid backsolving with fractions — use algebra instead","Be careful with the arithmetic but the process is the same — test the middle choice, adjust direction based on result","Always test the smallest fraction first","Fractions make backsolving impossible"], a:1, e:"The Backsolving process is identical for fractions — test middle, adjust direction. The arithmetic is more error-prone, so work carefully, but the strategy is the same. Use Backsolving when it is faster than algebraic manipulation." , trap_type:null},
    ],
    M2:[
      { p:null, q:"The choices are: (A) n+4, (B) 2n+2, (C) 3n-1, (D) n². You plug in n=4. Your target answer is 10. What do you conclude?", c:["Choice A: n+4 = 8 — eliminate. Choice B: 2(4)+2 = 10 ✓ — B is likely correct. Verify with a second value.","Choice B immediately — any choice that works is correct","All choices that don't equal 10 are permanently eliminated — B is confirmed","Choice D: 16 — eliminate. Answer must be B or C."], a:0, e:"At n=4: A=8, B=10✓, C=11, D=16. B works. But at one value, multiple choices could match — always verify with a second value (n=3: B=8; target should be 8 if B is correct). Confirm before selecting." , trap_type:null},
      { p:null, q:"You plug in n=3 and n=5 for a problem and two choices match at n=3 but only one matches at n=5. What do you conclude?", c:["The choice that matched at n=3 only is correct — first value is more reliable","The choice that matched at both n=3 and n=5 is correct — it survived two tests","Both are correct — the problem has two answers","Neither is correct — the values cancel each other out"], a:1, e:"The choice that passes both tests is the correct one. Testing two values filters out coincidental matches. One match at two different values strongly confirms the answer." , trap_type:null},
      { p:null, q:"Why avoid 0 and 1 when using Plug In Numbers?", c:["They are forbidden by SAT rules","They create special mathematical results: anything times 0 equals 0; any number to the power of 1 equals itself. These special properties make multiple wrong choices evaluate to the same result as the correct one.","They make the arithmetic harder than necessary","They only work for odd-numbered problems"], a:1, e:"0 neutralizes multiplication (n×0=0 for everything). 1 trivializes powers and multiplication. Both can make wrong choices appear correct. Use 2, 3, or 4 instead — specific enough to differentiate choices." , trap_type:null},
      { p:null, q:"A problem asks: 'Which expression is equivalent to (2x+3)² ?' You plug in x=2. Your target: (2(2)+3)²=49. You evaluate choices: A=4x²+9, B=4x²+12x+9, C=4x²+6x+9, D=2x²+12x+9. At x=2: A=25, B=49✓, C=49✓. What do you do?", c:["Select B — it appeared first","Select C — it appeared last","Try a second value (e.g., x=1) to distinguish B and C","Both B and C are correct"], a:2, e:"When two choices both work at the first test value, try a second. At x=1: B=4+12+9=25, C=4+6+9=19, target=(2+3)²=25. B works at x=1; C does not. B is correct. (Algebraic check: (2x+3)²=4x²+12x+9 ✓)" , trap_type:null},
      { p:null, q:"Plug In Numbers works best when:", c:["The answer choices contain specific numbers","The answer choices contain variable expressions and you can test specific values to see which expression always matches the described relationship","The problem has only one variable","The problem involves geometry only"], a:1, e:"Plug In Numbers is designed for variable-choice problems where algebra would be abstract and error-prone. Plugging in a specific number converts the abstract into concrete arithmetic you can verify." , trap_type:null},
    ],
    M3:[
      { p:null, q:"A price increased by 20%, then decreased by 20%. Using 100 as the starting value, what is the final price?", c:["100 — the changes cancel out","96 — 100→120→96. The net change is not zero because the second percentage applies to a different base.","80 — 100→80 with a net decrease","104 — slight increase"], a:1, e:"Start: 100. Up 20%: 100×1.20=120. Down 20%: 120×0.80=96. Net: 96, not 100. Percentages compound on changing bases. Up then down by the same percent always yields a net decrease." , trap_type:null},
      { p:null, q:"A store marks up an item by 50%, then offers a 25% discount. Using 100 as the base, what is the final price relative to the original?", c:["Same as original — 50% up and 25% down balance out","Higher than original — 100→150→112.50, a 12.5% net increase","Lower than original — 100→150→75.00, a 25% net decrease","Exactly 75% of the original"], a:1, e:"100 × 1.50 = 150. 150 × 0.75 = 112.50. Net change: +12.5%. The final price is 12.5% higher than the original. Markup then discount does not return to original." , trap_type:null},
      { p:null, q:"A population decreases by 10% each year for 2 years. Using 100 as a starting value, what is the final population?", c:["80 — subtracting 10% twice","81 — 100×0.90=90 first year, 90×0.90=81 second year","82 — rounding","100×0.80=80"], a:1, e:"Compound percentage: Year 1: 100×0.90=90. Year 2: 90×0.90=81. Not 80 — because the second 10% applies to 90, not 100. This is the compound vs. simple percentage distinction." , trap_type:null},
      { p:null, q:"An item originally costs $80. It is discounted 25%, then the discounted price is increased by 10%. What is the final price?", c:["$68 — applied the 10% increase to the original $80 instead of the discounted $60","$66 — 80×0.75=60, 60×1.10=66","$70","$62"], a:1, e:"80 × 0.75 = 60. 60 × 1.10 = 66. Use concrete base approach: work through each step with the actual dollar amount, not abstract percentages. Final: $66." , trap_type:null},
      { p:null, q:"'What percent of 40 is 30?' Using 100 as a mental anchor, you set up: 30/40 = x/100. What is x?", c:["65","75 — 30÷40=0.75=75%","80","70"], a:1, e:"30/40 = 0.75 = 75%. The proportion approach: 30 out of 40 corresponds to x out of 100. 30/40 × 100 = 75." , trap_type:null},
    ],
    M4:[
      { p:null, q:"You are testing answers for: x² - 5x + 6 = 0. Choices: 1, 2, 3, 4. Test x=2: 4-10+6=0 ✓. Test x=3: 9-15+6=0 ✓. Both work. What is happening?", c:["You made an arithmetic error — quadratics have only one solution","This quadratic has two solutions: x=2 and x=3 are both roots. If the question asks for one of them, check whether there's additional context or whether both are listed as choices.","Test x=1 to find the real answer","The equation is set up incorrectly"], a:1, e:"Quadratics can have two solutions. Both 2 and 3 satisfy x²-5x+6=0. If the question asks 'what are the solutions,' both are correct. If it asks for 'the smaller solution,' x=2. Read the question carefully." , trap_type:null},
      { p:null, q:"The equation is: |2x - 4| = 6. Choices: -1, 1, 5, 7. Which choices work?", c:["Only x=5: |2(5)-4|=|6|=6 ✓","x=5 and x=-1: |2(5)-4|=6 ✓ and |2(-1)-4|=|-6|=6 ✓","Only x=-1","Only x=1 and x=7"], a:1, e:"Absolute value equations often have two solutions. Test all choices: x=5: |10-4|=6 ✓; x=-1: |-2-4|=6 ✓. Both are solutions. If the question asks for 'a solution,' either works. If it asks for 'the positive solution,' x=5." , trap_type:null},
      { p:null, q:"For which equation type is 'Solve Algebra Without Algebra' LEAST useful?", c:["Quadratic equations with integer roots","Complex rational equations","Equations where the choices are variable expressions rather than specific numbers","Two-step linear equations with non-integer solutions"], a:2, e:"When choices are variable expressions (e.g., 'x²+3x' or '2n-1'), you cannot plug them back into the equation meaningfully. The strategy requires specific numerical answer choices to test." , trap_type:null},
      { p:null, q:"The equation is: (x+3)(x-5) = 0. Without expanding, which values can you immediately identify as solutions?", c:["x=3 and x=-5","x=-3 and x=5 — setting each factor equal to zero directly","x=3 and x=5","x=-3 and x=-5"], a:1, e:"Zero product property: if (A)(B)=0, then A=0 or B=0. (x+3)=0 → x=-3. (x-5)=0 → x=5. No expansion needed — this is faster than expanding and then solving." , trap_type:null},
      { p:null, q:"A word problem says: 'A rectangular garden has perimeter 36. Its length is 3 more than its width. What is its width?' Choices: 6, 7, 7.5, 9. Test x=7 (middle value):", c:["If width=7, length=10. Perimeter=2(7)+2(10)=34 — too small. Try 9.","If width=7, length=10. Perimeter=2(7)+2(10)=34 — too small. Try 7.5.","If width=7, length=10. Perimeter=2(7)+2(10)=34 ✓","If width=7, length=4. Perimeter=22 — wrong"], a:1, e:"Width=7, length=7+3=10. Perimeter=2(17)=34 — too small. Target is 36. Need larger width. Test 7.5: length=10.5, perimeter=2(18)=36 ✓. Answer: 7.5." , trap_type:null},
    ],
    M5:[
      { p:null, q:"A diagram shows two triangles. The question gives angle values in the 30s and 40s and asks for a missing side. Choices are: 2, 8, 47, 180. Which can be immediately eliminated?", c:["None — all are possible in some geometric configuration","47 and 180 — a triangle's sides cannot exceed the sum of the other two; with angles in the 30-40 range, sides in the 2-8 range are plausible, not 47 or 180","Only 180 — that's an angle, not a side","Only 2 — too small"], a:1, e:"Ballpark: triangle with angles 30-40°. The sides would be proportional and in a reasonable range. 47 and 180 are wildly disproportionate for a figure drawn at typical scale. Eliminate immediately." , trap_type:null},
      { p:null, q:"A question asks for the area of a circle inscribed in a square with side 10. You calculate π×10²=314. What is wrong?", c:["Nothing — π×r² with radius 10 is correct","The radius is 5 (half the side), not 10 (the full side). Correct area: π×5²=25π≈78.5. Ballpark: the circle must be SMALLER than the square (area 100), so 314 is impossible.","The formula should be 2πr=20π","The circle has diameter 10, but diameter and radius are the same"], a:1, e:"Ballpark check: the circle is inscribed IN the square (side=10) → radius=5 (NOT 10). Area=π×25≈78.5. A result of 314 is larger than the square (area=100) — physically impossible. Ballparking caught the error." , trap_type:null},
      { p:null, q:"The choices for a probability question are: 0.02, 0.2, 2, 20. Your estimate suggests the probability is 'slightly less than one in five.' Which choice is correct?", c:["0.02 — close to zero","0.2 — one fifth = 0.2, matching the estimate","2 — slightly above 1 is possible for probabilities","20 — a large probability"], a:1, e:"Probabilities are between 0 and 1. Eliminate 2 and 20 immediately — impossible probabilities. 'Slightly less than one in five' = slightly less than 0.2. 0.2 = exactly 1/5. Best answer: 0.2." , trap_type:null},
      { p:null, q:"A question asks for the number of students in a school with 12 classes of 25 students each. The choices are: 30, 300, 3000, 30000. Without precise calculation, which is correct?", c:["30 — too small for 12 classes","300 — 12×25=300. This is a simple calculation, but ballparking confirms: 10 classes of 25 = 250; 12 classes = slightly more. 300 is in the right ballpark.","3000 — too large","30000 — impossible"], a:1, e:"12×25=300. Ballpark: 10×25=250; add 2 more classes of 25 = 300. Confirmed. 30 is too small (only one class's worth), 3000 and 30000 are too large by a factor of 10 or 100." , trap_type:null},
      { p:null, q:"A question asks for the speed of a car that travels 150 miles in 2.5 hours. Choices: 6, 60, 600, 6000. Which can be confirmed by quick ballpark?", c:["6 mph — too slow for a car","60 mph — typical highway speed; 150÷2.5=60. Confirmed.","600 mph — jet speed","6000 mph — orbital velocity"], a:1, e:"Ballpark: 150 miles in 2.5 hours. At 60 mph: 60×2.5=150 ✓. Ballparking confirms — 60 mph is a realistic car speed, and the arithmetic checks out. 600 and 6000 are unrealistic for a car." , trap_type:null},
    ],
    M6:[
      { p:null, q:"A pipe fills a tank at 4 gallons per minute. How many seconds does it take to fill a 6-gallon tank? Set up with unit tracking.", c:["6 gal ÷ (4 gal/min) = 1.5 min = 90 seconds","6 gal × (4 gal/min) = 24 seconds","6 gal ÷ (4 gal/min) = 24 seconds","4 gal/min ÷ 6 gal = 0.67 min = 40 seconds"], a:0, e:"6 gal ÷ (4 gal/min) = 1.5 min. Units: gal ÷ (gal/min) = min ✓. Convert: 1.5 min × 60 s/min = 90 seconds." , trap_type:null},
      { p:null, q:"A car travels at 55 miles per hour. How many miles does it travel in 45 minutes? Track units to set up.", c:["55 mi/hr × 45 min = 2475 miles (wrong — units don't cancel)","55 mi/hr × (45 min × 1 hr/60 min) = 55 × 0.75 = 41.25 miles","55 mi/hr × 45 = 2475 miles","55 mi/hr ÷ 45 min = 1.22 miles"], a:1, e:"Convert minutes to hours first: 45 min × (1 hr/60 min) = 0.75 hr. Then: 55 mi/hr × 0.75 hr = 41.25 miles. Units: (mi/hr) × hr = mi ✓. The key step is the unit conversion before multiplying." , trap_type:null},
      { p:null, q:"A recipe calls for 2.5 cups per batch. You want to make 3 batches. You have 8 cups. Do you have enough, and how much will be left over?", c:["Yes, with 2.5 cups left over: 3×2.5=7.5 cups needed; 8-7.5=0.5 cups left","Yes, with 0.5 cups left over: 3×2.5=7.5 cups needed; 8-7.5=0.5 cups left","No — 3 batches require 9 cups","Yes, with 3 cups left"], a:1, e:"3 × 2.5 = 7.5 cups needed. 8 - 7.5 = 0.5 cups left over. Yes, you have enough, with 0.5 cups remaining. Note: options A and B say the same thing — the distractor is option C which incorrectly calculates 3×3=9." , trap_type:null},
      { p:null, q:"Which calculation correctly uses unit tracking to find how many hours it takes to drive 210 miles at 70 mph?", c:["70 mi/hr × 210 mi = time","210 mi ÷ (70 mi/hr) = 3 hours. Units: mi ÷ (mi/hr) = hr ✓","210 mi × 70 mi/hr = time","70 mi/hr - 210 mi = time"], a:1, e:"Distance ÷ speed = time. 210 mi ÷ (70 mi/hr). Units: mi ÷ (mi/hr) = mi × (hr/mi) = hr ✓. Result: 3 hours." , trap_type:null},
      { p:null, q:"A tank fills at 3 liters per minute and drains at 1 liter per minute. How long (in minutes) to fill 20 liters?", c:["20 ÷ 3 = 6.67 minutes","20 ÷ (3-1) = 20 ÷ 2 = 10 minutes — net fill rate is 2 L/min","20 ÷ 1 = 20 minutes","20 × 3 = 60 minutes"], a:1, e:"Net rate = fill rate - drain rate = 3 - 1 = 2 L/min. Time = 20 L ÷ 2 L/min = 10 minutes. Unit tracking: L ÷ (L/min) = min ✓." , trap_type:null},
    ],
    M7:[
      { p:null, q:"A problem says: 'The sum of two consecutive even integers is 46. What are the integers?' You solve n+(n+2)=46 → n=22. The integers are 22 and 24. The question asks for the LARGER integer. The trap answer is:", c:["22 — the smaller","24 — the larger (correct)","23 — an odd integer (not even)","46 — the sum itself is a common trap answer"], a:3, e:"The trap answers are: the smaller integer (22) and the sum (46). Students who solve for n but forget to add 2, or confuse the sum with the answer, pick 22 or 46. The question asks for the LARGER — re-read the last line before selecting." , trap_type:null},
      { p:null, q:"A geometry problem: a rectangle has length 4 more than its width. Area = 60. What is the PERIMETER? You correctly find width=6, length=10. What is the trap?", c:["Choosing 60 as the answer (confusing area with perimeter)","Choosing 16 (the sum of length and width) instead of 32 (the perimeter, which requires multiplying by 2)","Choosing 6 (the width alone)","All of the above are trap answers for this problem"], a:3, e:"Multiple traps: (1) 60 = area, not perimeter; (2) 16 = half the perimeter (adding length + width without doubling); (3) 6 = width only. All appear as likely distractor choices. Re-read: what was asked?" , trap_type:null},
      { p:null, q:"A problem asks for 'the value of x + 1' when 2x - 3 = 7. You solve: x = 5. Then you add 1: x + 1 = 6. The trap answer is:", c:["6","5 — solving for x when the question asks for x+1","3 — the constant in the equation","7 — the right side of the equation"], a:1, e:"The trap: stopping at x=5 and selecting it without computing x+1. This is the most common trap answer type on SAT Math: the question asks for an expression involving x, not x itself." , trap_type:null},
      { p:null, q:"After setting up a word problem, you get: apples = 12, oranges = 8. The question asks 'how many more apples than oranges?' You should:", c:["Report 12 as the answer — that's the main value solved for","Report 4 (12-8=4) — re-read the question; it asks for the DIFFERENCE, not the number of apples","Report 8 as the answer — it's the smaller quantity","Report 20 (12+8=20) — total fruit"], a:1, e:"Re-read the last line: 'how many MORE' = difference. 12-8=4. Trap: 12 (number of apples, not the difference), 20 (total, not difference). The calculation is easy; the error is solving the wrong quantity." , trap_type:null},
      { p:null, q:"The question asks for the cost of 5 items when each item is $3.40. You calculate 5×3.40=17. The choices are: $3.40, $15, $17, $34. What is the trap?", c:["$17 — correct","$34 — selecting 10 items' cost instead of 5","$3.40 — selecting the unit price rather than the total","$3.40 and $15 are both traps; $3.40 is the unit price and $15 might suggest incorrect rounding"], a:2, e:"$3.40 is the unit price — a trap for students who misread 'cost OF 5 items' as 'cost PER item.' $34=10 items — the 'double' trap. $17 is correct. Re-read: 'cost of 5 items' = total for 5." , trap_type:null},
    ],
    M8:[
      { p:null, q:"If p is any even integer, which of the following MUST be odd?", c:["p + 2 (even + even = even)","p × 2 (even × any = even)","p + 1 (even + odd = odd — must be true)","p² (even × even = even)"], a:2, e:"p is even. p+1 = even+odd = odd. Always true regardless of which even p you choose. p+2=even, p×2=even, p²=even. Only p+1 must be odd." , trap_type:null},
      { p:null, q:"If n is a negative integer, which MUST be positive?", c:["n + 1 (still negative if n < -1)","n × 2 (negative × positive = negative)","n² (negative × negative = positive — always)","n - 1 (more negative)"], a:2, e:"n²: any integer squared is non-negative. For a negative integer specifically, n×n = positive. n²>0 must be true. n+1 and n-1 remain negative (unless n=-1, where n+1=0, not positive). n×2 stays negative." , trap_type:null},
      { p:null, q:"The question states: 'x and y are integers where x > 0 and y < 0.' Which MUST be negative?", c:["x + y (depends on magnitudes)","x × y (positive × negative = always negative)","x - y (positive minus negative = positive)","y² (negative squared = positive)"], a:1, e:"x×y: positive × negative = always negative. x+y could be either sign depending on magnitudes. x-y = positive - negative = positive (always). y² = positive (always)." , trap_type:null},
      { p:null, q:"The question asks which COULD be true given: 'k is a positive odd integer.' Which statement COULD be true?", c:["k is even","k is divisible by 2","k² is even","k is divisible by 3"], a:3, e:"'Could be' = true for at least one positive odd integer. k divisible by 3: k=3 ✓ (3 is odd and divisible by 3). k even or k²=even: impossible — odd² = odd. Always test 'could be' with a specific example." , trap_type:null},
      { p:null, q:"If m is a multiple of 4, which of the following MUST also be a multiple of 4?", c:["m + 2 (multiple of 4 + 2 is not divisible by 4)","m ÷ 2 (multiple of 4 ÷ 2 = multiple of 2, not necessarily 4)","m × 3 (multiple of 4 × integer = still multiple of 4)","m - 4 (only if m>4)"], a:2, e:"m=4k for some integer k. m×3=12k=4(3k) — still a multiple of 4. m+2=4k+2 — not divisible by 4. m÷2=2k — multiple of 2 but not necessarily 4 (e.g., m=4, m÷2=2, not mult of 4). m-4=4(k-1) ✓ only when k≥2, so not 'must' when m=4." , trap_type:null},
    ],
    M9:[
      { p:null, q:"Two lines on a coordinate plane appear to intersect at (3, 5). Your estimate from the graph is that the intersection is between x=2 and x=4. If the calculated intersection is at x=7.8, should you trust your calculation?", c:["Yes — calculated values are always more accurate than visual estimates","No — x=7.8 falls well outside your estimated range of 2-4. Either the calculation has an error or the graph scale is misleading. Recheck the algebra.","Yes — graphs at small scale exaggerate intersections","No — always discard the calculated value and use the visual estimate"], a:1, e:"When your calculation contradicts a careful visual estimate, recheck the algebra. Visual estimates from graphs are rough but should be in the right ballpark. A result of 7.8 when the visual clearly shows ~3 is a red flag." , trap_type:null},
      { p:null, q:"A problem involves a triangle with vertices at (0,0), (6,0), and (3,4). You estimate the area visually as 'roughly 12.' You calculate ½×base×height = ½×6×4 = 12. What does this confirm?", c:["The formula is wrong — area should be larger","Your calculation (12) matches your visual estimate (roughly 12) — this mutual confirmation increases confidence in the answer","Visual estimates are unreliable for area","The base is not 6"], a:1, e:"When visual estimate and calculation agree, you have two independent lines of confirmation. ½×6×4=12 and the rough visual both yield approximately 12. This is how estimation serves as error-checking." , trap_type:null},
      { p:null, q:"A circle with radius 5 is drawn on a grid. A student estimates its area as 'somewhat less than the 10×10 square that contains it.' The calculated area is 25π ≈ 78.5. The square's area is 100. Is 78.5 a reasonable answer?", c:["No — the circle's area should be much less than 78.5","Yes — 78.5 is about 78.5% of the square's area (100). A circle inscribed in a square fills roughly 78.5% of the square — this is the standard result and matches the estimate 'somewhat less than 100.'","No — the area should equal the square's area","Yes — but only if the radius equals 5"], a:1, e:"25π ≈ 78.5 ≈ 78.5% of the 10×10 square (area 100). A circle inscribed in a square always takes up π/4 ≈ 78.5% of the square's area. This is a classic geometric relationship. The answer matches the estimate." , trap_type:null},
      { p:null, q:"You're solving a rate problem. Your answer is 450 hours. The problem involves a car traveling between two cities in a single trip. Is this reasonable?", c:["Yes — some car trips are very long","No — 450 hours equals nearly 19 days of continuous driving. No single car trip between cities takes this long. Recheck the setup.","Yes — it depends on traffic","No — all car trip problems have answers under 10 hours"], a:1, e:"Sanity check with context: 450 hours = 18.75 days of continuous driving. This fails the common-sense test for a 'car trip between two cities.' Estimation flags the error even without recalculating." , trap_type:null},
      { p:null, q:"The answer choices for a percentage question are: 0.04%, 4%, 40%, 400%. Your rough estimate suggests 'a little less than half.' Which choice matches?", c:["0.04% — essentially zero","4% — small but not close to half","40% — a little less than half","400% — more than four times the whole"], a:2, e:"A little less than half = slightly under 50%. 40% is in the right range. 0.04% and 4% are both far too small; 400% exceeds 100% (impossible for this type of problem). Estimation + elimination narrows to one answer." , trap_type:null},
    ],
    M10:[
      { p:null, q:"You graph y = x² - 6x + 8 in Desmos. What can you read directly from the graph without any calculation?", c:["Only the y-intercept","The x-intercepts (zeros), the vertex, and the y-intercept — all visible immediately","Only the vertex","The equation's discriminant"], a:1, e:"Desmos shows all key features visually: x-intercepts (where the curve crosses the x-axis), vertex (lowest/highest point), and y-intercept (where it crosses the y-axis). All readable on first graph, no algebra needed." , trap_type:null},
      { p:null, q:"To find the zeros of y = 2x³ - 5x² - 4x + 3 using Desmos, what is your process?", c:["Use the quadratic formula for cubic equations","Graph the function in Desmos and identify where the curve crosses the x-axis — those are the zeros","Find the y-intercept (x=0) and work backwards","Type the equation into a calculator app and read the result"], a:1, e:"Desmos for zeros: graph the function, look where it crosses the x-axis. For a cubic, there may be 1, 2, or 3 crossings. Each crossing is a zero. No formula needed — just read coordinates from the graph." , trap_type:null},
      { p:null, q:"You need to find where f(x) = x² + 3x - 10 equals zero. You know factoring should work, but you are unsure of the factors. The fastest approach on the SAT with Desmos:", c:["Spend time trying to factor: (x+?)(x-?)","Graph y = x² + 3x - 10 in Desmos — the x-intercepts appear instantly. In this case, x=2 and x=-5.","Use the quadratic formula: time-consuming but reliable","Substitute x=0 and solve from there"], a:1, e:"Desmos: type the function, read x-intercepts. For x²+3x-10: graph shows x=2 and x=-5 immediately. Much faster than factoring attempts or applying the quadratic formula with arithmetic risk." , trap_type:null},
      { p:null, q:"You graph f(x) = ax² + bx + c and the parabola opens downward with vertex in the second quadrant. What does this tell you about a and the vertex coordinates?", c:["a > 0 (parabola opens up) and vertex is at (x<0, y<0)","a < 0 (parabola opens downward) and vertex is at (x<0, y>0) — second quadrant = negative x, positive y","a > 0 and vertex is at (x>0, y>0)","a < 0 and vertex is at (x>0, y<0)"], a:1, e:"Opens downward → a < 0. Second quadrant = x negative, y positive. The vertex coordinates (negative x, positive y) confirm it's in Q2. Graph reading translates directly into conclusions about the equation's properties." , trap_type:null},
      { p:null, q:"A function crosses the x-axis at x = -4 and x = 2. What can you conclude without computing?", c:["The function is linear","If quadratic, the axis of symmetry is at x = (-4+2)/2 = -1, and the vertex is on the line x = -1","The function's y-intercept is 8","The function has no vertex"], a:1, e:"For a parabola with two zeros, the axis of symmetry (and vertex x-coordinate) is the midpoint of the zeros: (-4+2)/2 = -1. This is readable directly from the x-intercepts without any algebra." , trap_type:null},
    ],
    M11:[
      { p:null, q:"System: y = 4x - 3 and y = -x + 7. You graph both in Desmos. The lines intersect at one point. What are the coordinates of the solution?", c:["x=2, y=5","Test: y=4(2)-3=5 ✓ and y=-2+7=5 ✓. Solution: (2, 5)","x=3, y=4","x=1, y=1"], a:0, e:"Graph both lines. They cross at one point. Read coordinates. Verify: y=4(2)-3=5 and y=-2+7=5. Both equations are satisfied at (2,5). The graph shows it; algebra confirms it." , trap_type:null},
      { p:null, q:"After graphing a system and reading the intersection at (3, 7), the question asks: 'What is the value of 3y - 2x at the solution?' You should:", c:["Read 3y-2x from the graph directly","Substitute x=3, y=7: 3(7)-2(3) = 21-6 = 15","Re-solve the system algebraically to find a different answer","Add the coordinates: 3+7=10"], a:1, e:"The intersection gives you x and y values. Plug them into the expression: 3(7)-2(3)=15. The graph tells you the solution; you compute the expression. This is the standard pattern for SAT systems questions with Desmos." , trap_type:null},
      { p:null, q:"A system of two equations has no solution. What does the Desmos graph look like?", c:["Two lines that cross at the origin","Two parallel lines that never intersect — no solution means no crossing point","Two lines that overlap completely","Two curved lines"], a:1, e:"No solution = parallel lines. They have the same slope but different y-intercepts — they run alongside each other, never crossing. Infinitely many solutions = the same line plotted twice (they overlap)." , trap_type:null},
      { p:null, q:"You graph y = x² and y = 3x + 4 to find their intersection. The parabola and the line appear to cross at two points. You read approximately (4, 16) and (-1, 1). Verify (-1, 1):", c:["y=(-1)²=1 ✓ and y=3(-1)+4=1 ✓ — confirmed","y=(-1)²=1 ✓ but y=3(-1)+4=1 ✓ — both check","y=(-1)²=1 but y=3(-1)+4=1 — the same verification","y=1²=1 but y=3(1)+4=7 — does not check. The intersection is not at (-1,1)."], a:0, e:"Verify: y=(-1)²=1 ✓. y=3(-1)+4=-3+4=1 ✓. Both equations satisfied at (-1,1). Confirmed. The Desmos graph showed the point; algebraic verification confirms it." , trap_type:null},
      { p:null, q:"When graphing a system in Desmos, you see the two lines appear to be parallel. Should you trust this visual?", c:["Yes — always trust Desmos visuals over calculation","No — zoom in to confirm; lines that appear parallel at one zoom level can cross outside the visible window if they have slightly different slopes","Yes — if they look parallel at default zoom, they are parallel","No — Desmos cannot show parallel lines"], a:1, e:"Two lines with very similar but not identical slopes may appear parallel at one zoom but cross far outside the window. To confirm no intersection, either zoom out dramatically or check algebraically whether the slopes are truly identical." , trap_type:null},
    ],
    M12:[
      { p:null, q:"The function f(x) = k·x² passes through (3, 18). Using a slider in Desmos, you find k=2. Verify algebraically:", c:["f(3)=2(3)²=2(9)=18 ✓ — confirmed","f(3)=2(3)=6 ≠ 18 — slider is wrong","f(3)=(2)²(3)=12 ≠ 18","f(3)=k(3)²=18 → k=18/9=2 ✓ — confirmed by both methods"], a:3, e:"Both verification approaches work: slider finds k=2, algebra confirms: k=18/9=2 ✓. D uses both the slider result AND algebraic verification. Best practice: confirm slider values with substitution." , trap_type:null},
      { p:null, q:"You are asked to find k such that f(x) = k·e^x passes through (0, 5). What is k without Desmos?", c:["k = 5e","k = 5 — at x=0, e^0=1, so f(0)=k·1=k=5","k = e/5","k = 0"], a:1, e:"e^0=1 for any value of e. So f(0)=k×1=k=5. This is a case where algebra is faster than Desmos — direct substitution gives the answer instantly without opening a slider." , trap_type:null},
      { p:null, q:"The slider method in Desmos is most valuable for which type of problem?", c:["Any problem involving a constant or parameter, regardless of complexity","Problems where the function is complex enough that solving for the parameter algebraically is time-consuming or error-prone, but the graph lets you tune visually","All percentage problems","Problems with only linear functions"], a:1, e:"Sliders work best when algebraic isolation of the parameter is slow or complex. For simple f(x)=kx, just substitute. For complex expressions involving multiple operations, sliders let you tune k visually in seconds." , trap_type:null},
      { p:null, q:"You graph y = k·sin(2x) and drag the slider until the graph passes through (π/4, 3). The slider lands at k=3. What does this mean?", c:["k is approximately 3 — the slider is imprecise","k=3 exactly: sin(2×π/4)=sin(π/2)=1, so y=3×1=3 ✓. The slider gives the exact value in this case because sin(π/2)=1.","k=3 only if x=π/4","The value of k depends on which window you are viewing"], a:1, e:"At x=π/4: sin(2×π/4)=sin(π/2)=1. So y=k×1=k. To pass through y=3, k=3 exactly. The slider shows 3, and algebra confirms it. When sin or cos evaluates to ±1 at the test point, the arithmetic becomes trivial." , trap_type:null},
      { p:null, q:"After finding a parameter k using the slider method, the answer choices include exact fractions (e.g., 2/3, 7/4) while your slider shows approximately 0.667. What should you do?", c:["Select the closest decimal approximation","Recognize that 0.667 ≈ 2/3, and select 2/3 — sliders give decimal approximations; match to the closest exact fraction in the choices","Re-do the problem algebraically","The slider is wrong if it shows a decimal"], a:1, e:"Sliders show decimals; answer choices may be exact fractions. 0.667 ≈ 2/3. When your slider value is close to a simple fraction in the choices, that fraction is the intended exact answer. Select it." , trap_type:null},
    ],
    M13:[
      { p:null, q:"You graph f(x) = (x+2)(x-3) and g(x) = x² - x - 6 in Desmos. The graphs are identical. This means:", c:["Both functions happen to look similar at this zoom level","The expressions are algebraically equivalent — they produce the same output for every input x","They are equal only for x values between -2 and 3","The calculator made an error"], a:1, e:"Identical graphs = equivalent expressions. (x+2)(x-3) = x²-3x+2x-6 = x²-x-6. Desmos confirms the algebraic equivalence by showing the same curve for both." , trap_type:null},
      { p:null, q:"You plug x=3 into two expressions: A = (x-1)² - 4 and B = x² - 2x - 3. Both give 0. Can you conclude they are equivalent?", c:["Yes — agreement at x=3 confirms equivalence","No — one test point is insufficient. At x=0: A=(-1)²-4=-3 and B=0-0-3=-3. They agree. At x=1: A=0-4=-4 and B=1-2-3=-4. They continue to agree. Graph both or test multiple points to build confidence.","No — the only way to confirm equivalence is algebraic proof","Yes — if they agree at x=3 which is in the domain"], a:1, e:"One test point is not sufficient to prove equivalence — many different expressions can pass through the same point. Test at least 2-3 values or graph both to confirm. Here, A and B are actually equivalent: (x-1)²-4=x²-2x+1-4=x²-2x-3. ✓" , trap_type:null},
      { p:null, q:"Which of the following is equivalent to 4x² - 12x + 9?", c:["(2x - 3)²","(4x - 3)²","(2x + 3)²","(4x - 3)(x - 3)"], a:0, e:"(2x-3)²=4x²-12x+9. Graph both (2x-3)² and each choice in Desmos — only A produces an identical curve. Algebraic check: (2x-3)²=4x²-6x-6x+9=4x²-12x+9 ✓. This is a perfect square trinomial." , trap_type:null},
      { p:null, q:"You graph y = (x² - 9)/(x - 3) and y = x + 3 in Desmos. They look identical except at x=3. What does this tell you?", c:["The expressions are completely equivalent","The expressions are equivalent for all x ≠ 3. At x=3, (x²-9)/(x-3) is undefined (division by zero), so there is a hole in the graph. y=x+3 is defined at x=3.","The expressions are never equivalent","x=3 is the solution to both equations"], a:1, e:"(x²-9)/(x-3) = (x+3)(x-3)/(x-3) = x+3 for x≠3. At x=3, the original expression is undefined (0/0). The graphs are identical except for this hole. This illustrates a removable discontinuity." , trap_type:null},
      { p:null, q:"To confirm that sin²x + cos²x = 1 using Desmos, you graph y = sin²x + cos²x. What do you expect to see?", c:["A wave that oscillates between 0 and 2","A horizontal line at y = 1 — confirming the Pythagorean identity holds for all x","A line with positive slope","A parabola"], a:1, e:"The Pythagorean identity: sin²x + cos²x = 1 for all x. Graphing this in Desmos shows a flat horizontal line at y=1. This visual confirmation is a powerful check on trigonometric identities." , trap_type:null},
    ],
    M14:[
      { p:null, q:"A graph shows a line passing through (0, 3) and (2, 7). Which equation represents this line?", c:["y = 2x + 3","y = 4x + 3","y = 2x - 3","y = x + 3"], a:0, e:"Slope = (7-3)/(2-0) = 4/2 = 2. Y-intercept = 3 (the point (0,3)). Equation: y=2x+3. Verify in Desmos: graph y=2x+3 and confirm it passes through (0,3) and (2,7). ✓" , trap_type:null},
      { p:null, q:"The graph shows a parabola opening upward with x-intercepts at x=1 and x=5, and a y-intercept at y=5. Which equation matches?", c:["y = (x-1)(x-5)","y = x² - 6x + 5","y = (x+1)(x+5)","y = x² - 6x - 5"], a:1, e:"x-intercepts at 1 and 5 → factors (x-1)(x-5). Expand: x²-6x+5. Verify y-intercept: x=0 → 0-0+5=5 ✓. Graph in Desmos to confirm all three features match." , trap_type:null},
      { p:null, q:"You need to identify which of four equations matches a given graph. The fastest Desmos approach is:", c:["Calculate slope and intercept algebraically for each of the four options","Graph all four simultaneously — the one that overlaps the target graph is the answer; use point-testing to disambiguate if too cluttered","Calculate the equation from scratch using three points","Test one specific point that's clearly on the target graph in each equation"], a:1, e:"Graph all four simultaneously in Desmos. The match is visually immediate. If the display is too cluttered, use a clear point from the target graph to narrow down candidates first." , trap_type:null},
      { p:null, q:"A graph shows an exponential curve that passes through (0, 2) and (1, 6). Which equation fits?", c:["y = 2(3)^x","y = 3(2)^x","y = 6^x","y = 2^x + 4"], a:0, e:"At x=0: y=2(3)^0=2 ✓. At x=1: y=2(3)^1=6 ✓. Graph y=2(3)^x in Desmos and confirm both points. The form y=a·b^x: a=initial value (at x=0), b=growth factor." , trap_type:null},
      { p:null, q:"A quadratic graph has vertex at (-2, -5) and passes through (0, -1). Which equation matches?", c:["y = (x+2)² - 5","y = x² - 5","y = (x-2)² - 5","y = (x+2)² + 5"], a:0, e:"Vertex form: y=a(x-h)²+k with vertex (h,k)=(-2,-5): y=a(x+2)²-5. Use (0,-1) to find a: -1=a(4)-5 → 4a=4 → a=1. Equation: y=(x+2)²-5. Graph in Desmos to verify vertex and the passing point." , trap_type:null},
    ],
    M15:[
      { p:null, q:"You need to simplify 17 × 23 - 17 × 3 mentally. Should you use Desmos?", c:["Yes — Desmos can compute this quickly","No — factor out 17: 17(23-3)=17×20=340. This mental math trick is faster than opening Desmos.","Yes — any multiplication with two-digit numbers benefits from Desmos","No — this type of calculation cannot be done mentally"], a:1, e:"Factor: 17(23-3)=17×20=340. Mental math with factoring is faster than navigating to Desmos for a pure arithmetic calculation. Know when to use Desmos (complex functions, graphs, systems) vs. mental math (arithmetic)." , trap_type:null},
      { p:null, q:"Which SAT problem type benefits MOST from Desmos?", c:["What is 15% of 60?","What is the product of 12 and 15?","Find all values of x where f(x) = x³ - 3x² - x + 3 equals zero.","What is 7 × 8?"], a:2, e:"A cubic can have 3 zeros — finding them algebraically (synthetic division or trial-and-error) is slow. Graphing in Desmos shows all zeros instantly. The arithmetic problems (A, B, D) are faster to compute mentally." , trap_type:null},
      { p:null, q:"You have 2 minutes left with 3 questions remaining. Question 25 asks for the vertex of y = 3x² - 12x + 7. With 2 minutes for 3 questions, should you use Desmos?", c:["Yes — always use Desmos for parabola problems","The answer depends on your speed: Desmos takes 20-30 seconds to open and type; vertex formula takes ~30 seconds if you know it (h=-b/2a=-(-12)/6=2; k=3(4)-24+7=-5). Both are fast enough; choose based on which you are more confident in.","No — never use Desmos for vertex problems","Yes — Desmos is always faster than vertex formula"], a:1, e:"With 40 seconds per question, both approaches are viable. Vertex formula: h=-b/2a=12/6=2; k=3(4)-24+7=-5. Vertex: (2,-5). Desmos: graph the function, read the vertex. Choose the approach you trust more at this point in the test." , trap_type:null},
      { p:null, q:"Desmos is LEAST useful for:", c:["Finding zeros of a quartic polynomial","Solving a system of two nonlinear equations","Single-step arithmetic like 14 × 7","Verifying that two expressions are graphically equivalent"], a:2, e:"14×7=98 is faster to compute mentally (or with the standard calculator) than navigating to Desmos. Desmos shines for graphical tasks (zeros, intersections, equivalence). Single arithmetic computations do not need it." , trap_type:null},
      { p:null, q:"You are about to open Desmos for a problem. When should you pause and consider whether algebra would be faster?", c:["Never — Desmos is always the better choice","When the problem involves simple relationships (one-step equations, direct substitution, basic arithmetic) where algebraic manipulation takes under 15 seconds","Always — algebra is always faster than Desmos","When the problem involves any polynomial"], a:1, e:"Desmos overhead (opening, typing) = 15-30 seconds. If the algebraic solution takes under 15 seconds, skip Desmos. The break-even point: use Desmos when the function is complex enough that setting it up algebraically would take longer than graphing it." , trap_type:null},
    ],
    // ── BATCH 4: Charts & Data (C1–C4) + Mixed Number / Misc (MN1–MN5) ──
    C1:[
      { p:null, q:"A bar chart shows monthly sales: Jan=40, Feb=55, Mar=70, Apr=60. What is the average monthly sales across these four months?", c:["55","56.25 — (40+55+70+60)/4=225/4=56.25","57.5","60"], a:1, e:"(40+55+70+60)/4 = 225/4 = 56.25. Reading all bars accurately is the first step; computing the average is the second. Neither step is hard, but both must be done correctly." , trap_type:null},
      { p:null, q:"A pie chart shows: Category A = 40%, B = 30%, C = 20%, D = 10%. The total quantity is 500 units. How many units are in Category C?", c:["20","100 — 20% of 500 = 100","10","200"], a:1, e:"20% of 500 = 0.20 × 500 = 100 units. Reading the percentage from the chart (20%) and applying it to the total (500) are the two steps. Don't confuse the percentage label with the actual count." , trap_type:null},
      { p:null, q:"A scatter plot shows points roughly following a positive linear trend. The point at x=8, y=4 appears to deviate far below the trend line. This point is called:", c:["The y-intercept","An outlier — it falls significantly below the expected value based on the trend","The slope","A cluster"], a:1, e:"An outlier deviates significantly from the overall pattern. On a scatter plot with a positive trend, a point far below the trend line at a given x-value is a below-the-trend outlier. It may represent unusual or erroneous data." , trap_type:null},
      { p:null, q:"A line graph shows a company's revenue over 5 years. Between Year 2 and Year 3, the line slopes sharply downward. Between Year 4 and Year 5, the line slopes steeply upward. What can be directly concluded from the graph?", c:["Revenue increased every year","Revenue fell between Years 2 and 3, then rose between Years 4 and 5","The company will continue to grow after Year 5","Revenue between Year 3 and Year 4 remained constant"], a:1, e:"Read only what the graph explicitly shows: Year 2→3: decrease. Year 4→5: increase. No extrapolation beyond the data. What happened between Y3 and Y4 or after Y5 cannot be determined from this description." , trap_type:null},
      { p:null, q:"A two-way table shows: of 80 students who studied, 60 passed; of 20 students who did not study, 5 passed. What is the pass rate for students who studied?", c:["75% — 60/80 = 0.75","65%","80%","60%"], a:0, e:"60 passed out of 80 who studied: 60/80 = 0.75 = 75%. Two-way table reads: find the appropriate row or column, identify the relevant counts, compute the ratio. Don't mix rows — the non-study rate is 5/20=25%, not relevant here." , trap_type:null},
    ],
    C2:[
      { p:null, q:"A histogram shows test scores with bars at: 60-70 (height 5), 70-80 (height 12), 80-90 (height 18), 90-100 (height 7). The mode interval is:", c:["70-80","80-90 — the tallest bar represents the most frequent interval","60-70","90-100"], a:1, e:"Mode in a histogram = the interval with the tallest bar. 80-90 has height 18 — taller than all others. The mode interval contains the most data points." , trap_type:null},
      { p:null, q:"A box plot shows: minimum=20, Q1=35, median=50, Q3=65, maximum=80. The interquartile range (IQR) is:", c:["60","30 — IQR = Q3 - Q1 = 65 - 35 = 30","50","25"], a:1, e:"IQR = Q3 - Q1 = 65 - 35 = 30. The IQR represents the spread of the middle 50% of the data. It is read directly from the box in the box plot (the width of the box)." , trap_type:null},
      { p:null, q:"A dot plot shows data: 2, 2, 3, 4, 4, 4, 5, 7. The median is:", c:["3 — miscounted the middle position and picked the 3rd value instead of averaging the 4th and 5th","4 — the median of 8 data points is the average of the 4th and 5th values: (4+4)/2=4","3.5","5"], a:1, e:"8 data points: sorted are 2,2,3,4,4,4,5,7. Median = average of 4th and 5th = (4+4)/2 = 4. On a dot plot, count dots systematically to find the middle positions." , trap_type:null},
      { p:null, q:"A histogram has a long tail on the right side (the bars decrease gradually toward the right). This distribution is described as:", c:["Symmetric","Skewed right (positively skewed) — the tail stretches to the right","Skewed left","Bimodal"], a:1, e:"Right skew = tail on the right. The bulk of data is on the left with a long tail extending right. This is also called positively skewed. Example: income distributions often skew right because a few very high earners pull the tail." , trap_type:null},
      { p:null, q:"A cumulative frequency chart shows that 60% of scores fall at or below 75. Which of the following is consistent with this?", c:["The median is below 75 — 50% falls at or below the median; since 60% falls at or below 75, the median must be below 75","The median is above 75 — if 60% falls below 75, the remaining 40% must be above 75, including the 50th percentile","The median equals 75","Not enough information to determine"], a:0, e:"The median is the 50th percentile. If 60% falls at or below 75, then the 50th percentile (median) is below 75 — because you hit the 50% mark before reaching 75. Cumulative frequency reading: find the value at which the curve crosses 50%." , trap_type:null},
    ],
    C3:[
      { p:null, q:"A study reports: 'Of 200 respondents who received Treatment A, 140 improved. Of 200 respondents who received Treatment B, 160 improved.' Based solely on this data, which treatment appears more effective?", c:["Treatment A — larger sample","Treatment B — higher rate: 160/200=80% vs 140/200=70%","They are equally effective","Cannot be determined from this data"], a:1, e:"Compare rates: A = 140/200 = 70%; B = 160/200 = 80%. B shows higher improvement rate. Note: this is observational — the data does not prove causation, and confounding factors are possible, but within this data, B performs better." , trap_type:null},
      { p:null, q:"A survey shows a positive correlation between hours of TV watched and hours of sleep on weeknights among teenagers. A student concludes: 'Watching more TV causes teenagers to sleep more.' What is wrong with this conclusion?", c:["Nothing — positive correlation means causation","Correlation does not imply causation. A third variable (e.g., weekend vs. weekday schedule, academic pressure) might explain both. The data shows association, not cause-and-effect.","The sample size must be larger before any conclusion can be drawn","Positive correlations are always invalid"], a:1, e:"Correlation ≠ causation. A confounding variable (like school schedule or parental rules) could affect both TV and sleep. The SAT frequently tests whether students can distinguish association from causal claims." , trap_type:null},
      { p:null, q:"A table shows average daily temperatures (°F) for each month in two cities. City A's median temperature is 55°F. City B's median temperature is 65°F. Which city is warmer on average?", c:["City A — it may have more extreme highs","City B — higher median means the middle of City B's temperature distribution is higher","Cannot be determined without the full data","City A because its mean might be higher than its median"], a:1, e:"Median is a measure of central tendency. City B's median (65°F) > City A's median (55°F) means City B tends to have higher temperatures. The median is robust to extremes — no need to know the full distribution to make this comparison." , trap_type:null},
      { p:null, q:"A researcher takes a random sample of 500 students from a school with 2,000 students. She finds that 60% prefer online classes. What is the best estimate for the number of all 2,000 students who prefer online classes?", c:["600","1200 — 60% of 2000 = 1200. Extrapolate the sample proportion to the population.","500","800"], a:1, e:"Proportional reasoning: if 60% of the random sample prefer online classes, the best estimate for the full population is 60% × 2000 = 1200. Random sampling supports this extrapolation. Key word: 'random sample' — this validates the extrapolation." , trap_type:null},
      { p:null, q:"A scatter plot shows the relationship between study hours and test scores for 30 students. The line of best fit has equation y = 5x + 50. Predict the score for a student who studies 8 hours.", c:["85 — mis-added the constant term (5(8)+45 instead of +50)","90 — y = 5(8)+50 = 40+50 = 90","50","40"], a:1, e:"y = 5(8)+50 = 40+50 = 90. Read the equation, substitute the given x-value, compute. The line of best fit allows predictions within the range of the data (interpolation) — be cautious about extrapolating far outside the observed range." , trap_type:null},
    ],
    C4:[
      { p:null, q:"A data set has mean = 50 and standard deviation = 10. A value of 70 is how many standard deviations above the mean?", c:["1","2 — (70-50)/10 = 20/10 = 2 standard deviations above the mean","3","20"], a:1, e:"Standard deviations from mean = (value - mean) / SD = (70-50)/10 = 2. This is a z-score calculation. 70 is 2 standard deviations above the mean." , trap_type:null},
      { p:null, q:"Two data sets: Set A = {10, 20, 30, 40, 50} and Set B = {28, 29, 30, 31, 32}. Both have mean = 30. Which has greater spread?", c:["Set B — smaller values are closer to the mean","Set A — greater range and standard deviation: values spread from 10 to 50, whereas Set B clusters near 30","They have equal spread because they have equal means","Cannot be determined without calculating standard deviation"], a:1, e:"Spread = how far values deviate from the mean. Set A: range = 50-10 = 40, values span a wide range. Set B: range = 32-28 = 4, values cluster tightly around 30. Equal means do not imply equal spread. Set A has much greater variability." , trap_type:null},
      { p:null, q:"Adding a constant of 5 to every value in a data set changes:", c:["The mean only — adding a constant shifts the mean but does not change the spread (standard deviation/variance unchanged)","The standard deviation only","Both mean and standard deviation equally","Neither mean nor standard deviation"], a:0, e:"Adding a constant shifts all values equally: mean increases by 5, but every value moves the same distance from the new mean as from the old mean — standard deviation is unchanged. This is a key property tested on SAT statistics." , trap_type:null},
      { p:null, q:"Multiplying every value in a data set by 2:", c:["Doubles the mean only","Doubles both the mean and the standard deviation — every value and every deviation from the mean is scaled by 2","Doubles the standard deviation only","Has no effect on either mean or standard deviation"], a:1, e:"Multiplying by a constant k scales both the mean and standard deviation by k. Mean: new mean = 2×old mean. SD: new SD = 2×old SD (every distance from the mean is doubled). Contrast with adding a constant (shifts mean, preserves SD)." , trap_type:null},
      { p:null, q:"A data set's median is significantly lower than its mean. What does this suggest about the shape of the distribution?", c:["Symmetric — mean and median are close together in symmetric distributions","Right-skewed — high outliers pull the mean up above the median","Left-skewed — low outliers pull the mean down below the median","Bimodal — two peaks cause median and mean to diverge"], a:1, e:"When mean > median: the distribution is right-skewed (positively skewed). High outliers or a long right tail pull the mean upward without affecting the median. Classic examples: income, house prices, test score distributions with a few very high scorers." , trap_type:null},
    ],
    MN1:[
      { p:null, q:"Which SAT strategy applies when the question asks you to evaluate an answer choice by plugging it back into the original equation?", c:["Plug In Numbers — substituting variable values","Backsolving — testing specific answer choices in the original equation to see which one satisfies it","Ballpark — estimating to eliminate unreasonable choices","Unit Tracking — following units through calculations"], a:1, e:"Backsolving = testing answer choices by substituting them into the equation. Plug In Numbers uses invented values to test variable expressions. They're complementary: Backsolving when answers are specific numbers; Plug In Numbers when answers contain variables." , trap_type:null},
      { p:null, q:"You are 3 minutes into a 5-question drill session. You've answered 2 correctly. What is your current accuracy?", c:["40%","100%","60% — 2 correct out of 3 questions attempted (not 5 total). Accuracy = correct/attempted = 2/3 ≈ 66.7%","50%"], a:2, e:"Accuracy = correct ÷ attempted = 2 ÷ 3 ≈ 66.7%. Not 2/5 = 40% — that would be accuracy out of total questions in the session, but you've only attempted 3. Track attempted vs. total carefully." , trap_type:null},
      { p:null, q:"A strategy is at Level 3 with 3-day gap requirement. You drilled it yesterday. Can you advance to Level 4 today?", c:["Yes — accuracy is the only requirement for advancement","No — the 3-day gap has not elapsed. You must wait until Day 3 (3 days from last drill) before attempting advancement.","Yes — gaps only apply at Level 4 and above","No — Level 3 requires a 7-day gap"], a:1, e:"Gap enforcement: Level 3→4 requires 3 days since last drill. Yesterday = 1 day elapsed. You need 2 more days before the gap requirement is met. Accuracy alone is not sufficient when a gap is required." , trap_type:null},
      { p:null, q:"You complete a 5-question drill with 5/5 correct. Your current level is 4 and 7 days have passed since your last drill. What happens?", c:["You advance to Level 5 with mastery state 'mastered'","You advance to Level 5. Since you are moving from Level 4→5 with a 7-day gap and 90%+ accuracy (100% here), you achieve mastery state 'mastered'.","You stay at Level 4 — you need Level 5 to become 'mastered'","You advance to 'elite' immediately"], a:1, e:"Level 4 + 7-day gap + 80%+ accuracy → Level 5 → mastery state 'mastered'. 'Elite' requires Level 5 again with a 14-day gap. You are now at Level 5/mastered, not yet elite." , trap_type:null},
      { p:null, q:"Which combination of strategies would you prioritize drilling first: one at 'developing' mastery or one at 'in_progress' mastery?", c:["Developing — it is further along and needs less work to reach mastered","In_progress — it is earlier in the progression and should be solidified before the developing strategy","Either — mastery state does not determine drill priority","Developing — because it is closer to elite"], a:0, e:"Prioritize 'developing' — it is closer to 'mastered' and represents partially consolidated learning that is at risk of fading without reinforcement. Building on existing progress is more efficient than going back to earlier stages. Both need work, but 'developing' is the higher-leverage drill target." , trap_type:null},
    ],
    MN2:[
      { p:null, q:"The expression (x + y)² is equivalent to which of the following?", c:["x² + y²","x² + xy + y²","x² + 2xy + y²","2x² + 2y²"], a:2, e:"FOIL: (x+y)(x+y) = x² + xy + xy + y² = x² + 2xy + y². The middle term 2xy is the most commonly missed part — 'squaring a sum' is NOT squaring each term separately. (x+y)² ≠ x²+y²." , trap_type:null},
      { p:null, q:"Solve: |3x - 6| = 9.", c:["x = 5 only","x = 5 or x = -1: 3x-6=9 → x=5; and 3x-6=-9 → 3x=-3 → x=-1","x = -1 only","x = 3"], a:1, e:"Absolute value: |A|=9 means A=9 or A=-9. Case 1: 3x-6=9 → 3x=15 → x=5. Case 2: 3x-6=-9 → 3x=-3 → x=-1. Both solutions. Verify: |3(5)-6|=|9|=9 ✓; |3(-1)-6|=|-9|=9 ✓." , trap_type:null},
      { p:null, q:"A function f is defined by f(x) = 2x² - 3x + 1. What is f(-2)?", c:["11","15 — f(-2) = 2(-2)²-3(-2)+1 = 2(4)+6+1 = 8+6+1 = 15","3","9"], a:1, e:"f(-2) = 2(-2)² - 3(-2) + 1 = 2(4) + 6 + 1 = 8 + 6 + 1 = 15. Two common errors: (1) forgetting (-2)²=4, not -4; (2) forgetting -3×(-2)=+6, not -6. Sign discipline matters." , trap_type:null},
      { p:null, q:"The slope of a line through (-3, 2) and (1, 10) is:", c:["-4 — used 1-3=-2 in the denominator instead of 1-(-3)=4 (forgot to subtract a negative)","1/2 — inverted rise and run","2 — slope = (10-2)/(1-(-3)) = 8/4 = 2","4"], a:2, e:"Slope = (y₂-y₁)/(x₂-x₁) = (10-2)/(1-(-3)) = 8/4 = 2. Common trap: subtracting x₁ as +3 instead of +4 (forgetting the double negative: 1-(-3)=1+3=4). The answer is 2." , trap_type:null},
      { p:null, q:"If 4x + 2y = 20 and x - y = 1, what is the value of x?", c:["3","9 — solved x-y=1 as y=1-x instead of y=x-1, then substituted: 4x+2(1-x)=20 → 2x+2=20 → x=9","4","11/3 — from x-y=1: y=x-1. Substitute: 4x+2(x-1)=20 → 4x+2x-2=20 → 6x=22 → x=11/3"], a:3, e:"Substitution: y=x-1. Into first: 4x+2(x-1)=20 → 4x+2x-2=20 → 6x=22 → x=11/3. Verify: y=11/3-1=8/3. Check: 4(11/3)+2(8/3)=44/3+16/3=60/3=20 ✓." , trap_type:null},
    ],
    MN3:[
      { p:null, q:"In a right triangle, sin(θ) = 3/5. What is cos(θ)?", c:["4/5 — in a 3-4-5 triangle: hypotenuse=5, opposite=3, adjacent=4. cos(θ)=adjacent/hypotenuse=4/5.","3/4","2/5","5/3"], a:0, e:"3-4-5 right triangle: sin(θ)=opposite/hypotenuse=3/5 → opposite=3, hypotenuse=5 → adjacent=4 (Pythagorean theorem: 3²+4²=5²). cos(θ)=4/5." , trap_type:null},
      { p:null, q:"The graph of y = f(x) is shifted 3 units to the right. The new function is:", c:["y = f(x+3)","y = f(x-3) — horizontal shifts: replacing x with (x-k) shifts the graph right by k","y = f(x) + 3","y = f(x) - 3"], a:1, e:"Horizontal shifts: to shift RIGHT by k, replace x with (x-k). Counterintuitive: (x-3) shifts right, (x+3) shifts left. y=f(x)+3 shifts UP vertically. Memorize: subtract inside the function = right; add inside = left." , trap_type:null},
      { p:null, q:"A circle has equation (x-2)² + (y+3)² = 25. What are the center and radius?", c:["Center (2,-3), radius 5 — standard form (x-h)²+(y-k)²=r²: h=2, k=-3, r=√25=5","Center (-2,3), radius 5","Center (2,-3), radius 25","Center (2,3), radius 5"], a:0, e:"Standard form: (x-h)²+(y-k)²=r². Matching: h=2, k=-3 (sign flip: -(−3)=+3 in the original means k=-3), r=√25=5. Center: (2,-3). Trap: students flip the sign of k — the center is at (h,k), so y+3 means k=-3." , trap_type:null},
      { p:null, q:"The ratio of boys to girls in a class is 3:5. If there are 25 girls, how many boys are there?", c:["20","15 — boys/girls = 3/5. Let boys=3k, girls=5k. 5k=25 → k=5. Boys=3(5)=15.","18","12"], a:1, e:"3:5 ratio with 25 girls: set boys=3k, girls=5k. 5k=25 → k=5 → boys=3(5)=15. Verify: 15:25 = 3:5 ✓. Set up the ratio with a variable multiplier (k) rather than dividing directly — it keeps the answer a whole number and avoids the trap of forcing a non-integer result." , trap_type:null},
      { p:null, q:"A line has slope -2/3 and passes through (6, 1). What is its y-intercept?", c:["5 — y=mx+b: 1=(-2/3)(6)+b → 1=-4+b → b=5","3","-3","1"], a:0, e:"y=mx+b. Substitute m=-2/3, point (6,1): 1=(-2/3)(6)+b → 1=-4+b → b=5. Equation: y=(-2/3)x+5. Verify at x=6: y=(-2/3)(6)+5=-4+5=1 ✓." , trap_type:null},
    ],
    MN4:[
      { p:null, q:"The volume of a cylinder with radius r and height h is πr²h. If the radius is doubled and height is halved, the new volume compared to the original is:", c:["Same — doubling radius and halving height cancel out","Double — new V = π(2r)²(h/2) = π(4r²)(h/2) = 2πr²h = 2×original","Quadruple","Half"], a:1, e:"New V = π(2r)²(h/2) = π×4r²×h/2 = 2πr²h = 2×original. Doubling radius squares the effect (area factor = 4), halving height reduces by 2: net factor = 4/2 = 2. The volume doubles." , trap_type:null},
      { p:null, q:"If f(x) = 3x - 5 and g(x) = x² + 2, what is f(g(2))?", c:["6 — that's g(2), not f(g(2)) — stopped one step too early","3 — computed g(f(2)) instead of f(g(2)) (wrong order)","13 — g(2)=2²+2=6; f(6)=3(6)-5=18-5=13","23"], a:2, e:"Composite function: work inside-out. g(2) = 2²+2 = 6. f(g(2)) = f(6) = 3(6)-5 = 18-5 = 13." , trap_type:null},
      { p:null, q:"A geometric sequence starts: 2, 6, 18, 54, ... What is the 6th term?", c:["162","486 — ratio = 3. Terms: 2, 6, 18, 54, 162, 486","1458 — used r⁶ instead of r⁵ (aₙ=a₁×rⁿ instead of a₁×r^(n-1)); 2×3⁶=2×729=1458, overshooting to the 7th term","243 — computed r^(n-1)=3⁵=243 but forgot to multiply by the first term a₁=2"], a:1, e:"Common ratio r=3. Term formula: aₙ=a₁×r^(n-1). 6th term: 2×3⁵=2×243=486. Or: 2, 6, 18, 54, 162, 486 — count: 162 is 5th, 486 is 6th." , trap_type:null},
      { p:null, q:"An arithmetic sequence has first term 7 and common difference 4. What is the sum of the first 10 terms?", c:["215","250 — sum = n/2 × (first + last). Last term = 7+(9×4)=43. Sum = 10/2 × (7+43) = 5×50 = 250.","230","270"], a:1, e:"Arithmetic sum formula: Sₙ = n/2 × (a₁ + aₙ). aₙ = 7 + (10-1)×4 = 7+36 = 43. S₁₀ = 10/2 × (7+43) = 5 × 50 = 250." , trap_type:null},
      { p:null, q:"Simplify: (x³y²)/(x²y⁵)", c:["x/y³","xy³","x/y","x⁵y⁷"], a:0, e:"Subtract exponents when dividing: x^(3-2) = x¹ = x. y^(2-5) = y^(-3) = 1/y³. Result: x/y³. Exponent rules: subtract when dividing same base, add when multiplying." , trap_type:null},
    ],
    MN5:[
      { p:null, q:"A train leaves City A at 60 mph heading to City B, 150 miles away. Another train leaves City B at the same time heading toward City A at 90 mph. How many hours until they meet?", c:["2.5 hours — used only one train's speed (150/60) instead of the combined closing speed","1 hour — combined speed = 60+90=150 mph. Distance = 150 miles. Time = 150/150 = 1 hour.","1.5 hours","2 hours"], a:1, e:"Closing-speed problem: add speeds (they're moving toward each other). Combined speed = 150 mph. Distance = 150 miles. Time = distance ÷ speed = 150 ÷ 150 = 1 hour." , trap_type:null},
      { p:null, q:"If 5 workers can complete a job in 8 days, how many days will 10 workers take (assuming equal work rate)?", c:["16 days","4 days — doubling workers halves the time: 8/2 = 4 days. Alternatively: 5×8=40 worker-days of work. 40/10=4 days.","10 days","2 days"], a:1, e:"Total work = 5 workers × 8 days = 40 worker-days. With 10 workers: 40 ÷ 10 = 4 days. This is the worker-day framework: total work is constant; more workers = fewer days." , trap_type:null},
      { p:null, q:"A store offers a 30% discount on an item, then an additional 20% off the discounted price. What is the total percent reduction from the original price?", c:["50%","44% — 100→70 (after 30%), 70×0.80=56 (after 20%). Total reduction: 100-56=44. 44/100=44%.","50% — discounts add","46%"], a:1, e:"Apply sequentially: 100×0.70=70 (first discount). 70×0.80=56 (second discount). Final price: 56% of original. Reduction: 44%. Trap: 30%+20%=50% — WRONG. Percentages apply to different bases." , trap_type:null},
      { p:null, q:"The interior angles of a polygon sum to 1080°. How many sides does the polygon have?", c:["7","8 — interior angle sum = (n-2)×180. (n-2)×180=1080 → n-2=6 → n=8.","6","9"], a:1, e:"Formula: sum of interior angles = (n-2)×180. Set equal to 1080: (n-2)=1080/180=6 → n=8. An octagon." , trap_type:null},
      { p:null, q:"You have completed all Level 5 drills for a strategy and achieved 'elite' mastery. What is the best use of remaining drill time?", c:["Keep drilling the same elite strategy to maintain the score","Shift focus to strategies at 'developing' or 'mastered' state that have not yet reached elite — advancing those gives the greatest score improvement potential","Stop drilling entirely once elite is reached","Drill the strategy you find most interesting regardless of mastery state"], a:1, e:"Strategy: maximize score improvement by drilling where you have the most room to grow. Elite strategies are already at peak mastery — marginal returns are low. 'Developing' and 'mastered' strategies have clear advancement paths. Time is better spent advancing those." , trap_type:null},
    ],
  }; // end DE_QUESTIONS

  // ── PUBLIC API ─────────────────────────────────────────── //

  function render() {
    containerEl = document.getElementById('page-container');
    openOverview();
  }

  function reset() {
    view = 'overview'; activeCode = null; drillSession = null;
  }

  function getQuestions(code) {
    return DE_QUESTIONS[code] ? DE_QUESTIONS[code].slice() : [];
  }

  return { render: render, reset: reset, getQuestions: getQuestions };

})();
window.DrillEngineModule = DrillEngineModule;
