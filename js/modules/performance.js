/* ============================================================
   SCHOLAR'S EDGE — Module 9: Performance Dashboard
   Full analytics: score summary, trend chart, band heatmap,
   projected score, strategy mastery map, training stats,
   plateau detection, skills check history
   ============================================================ */

const PerformanceDashboardModule = (() => {
  'use strict';

  // ── constants ─────────────────────────────────────────────

  var SKILL_LABELS = {
    main_idea:      'Main Idea',
    inference:      'Inference',
    grammar:        'Grammar',
    transitions:    'Transitions',
    punctuation:    'Punctuation',
    linear_algebra: 'Linear Alg.',
    advanced_math:  'Adv. Math',
    data_analysis:  'Data Anal.',
  };

  var BAND_LABELS = ['', 'Foundational', 'Emerging', 'Developing',
                     'Progressing', 'Proficient', 'Advanced', 'Elite'];
  // Band 7 uses gold bg (#F4B942) — dark text. Band 6 uses purple — white text.
  // All others use dark navy text. (See: buildBandRow txtColor logic)

  // Estimated points gained by moving a band from N → N+1
  var BAND_JUMP_PTS = { 1:70, 2:55, 3:45, 4:30, 5:25, 6:15 };

  var MASTERY_COLORS = {
    not_started: '#E9ECEF',
    in_progress: '#BFDBFE',
    developing:  '#FDE68A',
    mastered:    '#6EE7B7',
    elite:       '#F4B942',
  };

  var MASTERY_TEXT = {
    not_started: '#6B7280',
    in_progress: '#1E40AF',
    developing:  '#92400E',
    mastered:    '#065F46',
    elite:       '#78350F',
  };

  var MASTERY_LABELS = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    developing:  'Developing',
    mastered:    'Mastered',
    elite:       'Elite',
  };

  var STRATEGY_SECTIONS = [
    { id: 'A', name: 'Universal',        codes: ['U1','U2','U3','U4','U5','U6','U7'] },
    { id: 'B', name: 'Reading Elim.',    codes: ['R1','R2','R3','R4','R5','R6','R7','R8'] },
    { id: 'C', name: 'Reading Passage',  codes: ['R9','R10','R11','R12','R13'] },
    { id: 'D', name: 'Grammar',          codes: ['G1','G2','G3','G4','G5','G6','G7'] },
    { id: 'E', name: 'Math Core',        codes: ['M1','M2','M3','M4','M5','M6','M7','M8','M9'] },
    { id: 'F', name: 'Desmos',           codes: ['M10','M11','M12','M13','M14','M15'] },
    { id: 'G', name: 'CLT',              codes: ['C1','C2','C3','C4'] },
    { id: 'H', name: 'Mindset',          codes: ['MN1','MN2','MN3','MN4','MN5'] },
  ];

  // ── helpers ───────────────────────────────────────────────

  function el(tag, style, text) {
    var e = document.createElement(tag);
    if (style) e.style.cssText = style;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function formatTestSource(src) {
    var m = { bluebook_7:'BB-7', bluebook_8:'BB-8', bluebook_9:'BB-9',
              bluebook_10:'BB-10', clt:'CLT', khan:'Practice', other:'Practice' };
    return m[src] || src || 'Test';
  }

  function formatDate(str) {
    if (!str) return '—';
    try {
      return new Date(str).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    } catch(e) { return str; }
  }

  function sectionHeader(title, subtitle) {
    var wrap = el('div', 'margin:32px 0 14px;');
    var h = el('h2', 'font-size:0.72rem;font-weight:700;text-transform:uppercase;' +
      'letter-spacing:0.1em;color:var(--color-primary);margin:0 0 4px;', title);
    wrap.appendChild(h);
    if (subtitle) {
      wrap.appendChild(el('p', 'font-size:0.82rem;color:var(--color-neutral-600);margin:0;', subtitle));
    }
    return wrap;
  }

  function card(extraStyle) {
    return el('div', 'background:var(--color-white);border:1.5px solid var(--color-neutral-200);' +
      'border-radius:12px;' + (extraStyle || ''));
  }

  // ── projected score engine ────────────────────────────────

  function computeProjection(imports, targetDateStr) {
    if (!imports || imports.length === 0) return null;

    var latest  = imports[imports.length - 1];
    var current = latest.totalScore;
    var slope   = 0;

    if (imports.length >= 2) {
      var n = imports.length;
      var sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
      imports.forEach(function(imp, i) {
        sumX += i; sumY += imp.totalScore;
        sumXY += i * imp.totalScore; sumXX += i * i;
      });
      slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }

    var daysToTest = 0;
    var testDate   = null;
    if (targetDateStr) {
      testDate   = new Date(targetDateStr);
      daysToTest = Math.max(0, Math.round((testDate - Date.now()) / 86400000));
    }

    // Average interval between imports (in "import units")
    var avgIntervalWeeks = 3.5; // default assumption
    if (imports.length >= 2) {
      var d0 = new Date(imports[0].importedAt || imports[0].date);
      var d1 = new Date(latest.importedAt     || latest.date);
      var span = (d1 - d0) / 86400000;
      avgIntervalWeeks = span / (imports.length - 1) / 7;
    }

    var projected = current;
    if (daysToTest > 0 && slope !== 0 && avgIntervalWeeks > 0) {
      var weeksLeft  = daysToTest / 7;
      var testsLeft  = weeksLeft / avgIntervalWeeks;
      projected = Math.round(current + slope * testsLeft);
      projected = Math.min(1600, Math.max(400, projected));
    }

    // ZPD potential: sum of gains available if each sub-5 band reaches 5
    var bands = Storage.getBands() || {};
    var potential = current;
    Object.values(bands).forEach(function(b) {
      if (b && b < 5) potential += (BAND_JUMP_PTS[b] || 0);
    });
    potential = Math.min(1600, potential);

    return {
      current:    current,
      projected:  projected,
      potential:  potential,
      daysToTest: daysToTest,
      testDate:   testDate,
      slope:      slope,
      confidence: imports.length >= 3 ? 'high' : imports.length === 2 ? 'medium' : 'low',
    };
  }

  // ── plateau detection ─────────────────────────────────────

  function detectPlateau() {
    var masteryHistory = Storage.getPath('masteryHistory') || {};
    var sessions       = Storage.getSessionHistory()       || [];
    var now            = Date.now();
    var DAY            = 86400000;

    // Flatten all mastery events
    var allEvents = [];
    Object.values(masteryHistory).forEach(function(evts) {
      if (Array.isArray(evts)) evts.forEach(function(e) { allEvents.push(e); });
    });

    // Most recent state advancement
    var stateUps = allEvents.filter(function(e) { return e.stateUp; });
    stateUps.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    var lastAdvance        = stateUps.length > 0 ? new Date(stateUps[0].date) : null;
    var daysSinceAdvance   = lastAdvance ? Math.floor((now - lastAdvance) / DAY) : null;

    // Most recent session
    var lastSession        = sessions.length > 0 ? sessions[sessions.length - 1] : null;
    var daysSinceSession   = lastSession ? Math.floor((now - new Date(lastSession.date)) / DAY) : null;

    var flags = [];

    if (daysSinceSession !== null && daysSinceSession >= 3) {
      flags.push({
        type:     'gap',
        severity: daysSinceSession >= 7 ? 'warning' : 'info',
        icon:     'calendar-x',
        message:  daysSinceSession >= 7
          ? 'No study sessions in ' + daysSinceSession + ' days. One session is all it takes to restart momentum.'
          : daysSinceSession + ' days since your last session. Today is a good day to pick it back up.',
      });
    }

    if (daysSinceAdvance !== null && daysSinceAdvance >= 14 &&
        (daysSinceSession === null || daysSinceSession < 3)) {
      flags.push({
        type:     'plateau',
        severity: daysSinceAdvance >= 21 ? 'warning' : 'info',
        icon:     'trending-up',
        message:  'No mastery level advances in ' + daysSinceAdvance + ' days. Try a new strategy instead of re-drilling mastered ones.',
        action:   'Open Strategy Course',
        route:    '/strategy-course',
      });
    }

    if (flags.length === 0 && sessions.length > 0 &&
        daysSinceAdvance !== null && daysSinceAdvance <= 7) {
      flags.push({
        type:     'on_track',
        severity: 'success',
        icon:     'check-circle',
        message:  'Mastery advancing consistently. Keep the momentum going.',
      });
    }

    return flags;
  }

  // ── stat card builders ────────────────────────────────────

  function scoreCard(label, value, changeLabel, changeColor, accentColor) {
    var c = card('padding:16px;');
    c.innerHTML =
      '<div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;' +
        'letter-spacing:0.08em;color:' + accentColor + ';margin-bottom:8px;">' + label + '</div>' +
      '<div style="font-size:2rem;font-weight:800;color:var(--color-primary);line-height:1;margin-bottom:4px;">' + value + '</div>' +
      '<div style="font-size:0.78rem;font-weight:600;color:' + changeColor + ';">' + changeLabel + '</div>';
    return c;
  }

  function smallStat(icon, label, value, color) {
    var c = card('padding:14px;text-align:center;');
    c.innerHTML =
      '<i data-lucide="' + icon + '" style="width:20px;height:20px;color:' + color + ';display:block;margin:0 auto 6px;"></i>' +
      '<div style="font-size:1.4rem;font-weight:800;color:var(--color-primary);line-height:1;margin-bottom:3px;">' + value + '</div>' +
      '<div style="font-size:0.7rem;color:var(--color-neutral-500);">' + label + '</div>';
    return c;
  }

  function projCard(label, value, note, accentColor) {
    var c = card('padding:16px;text-align:center;');
    c.innerHTML =
      '<div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;' +
        'letter-spacing:0.08em;color:' + accentColor + ';margin-bottom:8px;">' + label + '</div>' +
      '<div style="font-size:1.9rem;font-weight:800;color:var(--color-primary);line-height:1;margin-bottom:4px;">' + value + '</div>' +
      '<div style="font-size:0.75rem;color:var(--color-neutral-500);">' + note + '</div>';
    return c;
  }

  // ── band heatmap ──────────────────────────────────────────

  function buildBandRow(skillKeys, bands) {
    var grid = el('div', 'display:grid;grid-template-columns:repeat(' +
      skillKeys.length + ',1fr);gap:8px;margin-bottom:4px;');
    skillKeys.forEach(function(key) {
      var bandNum  = bands[key] || 0;
      var bgColor  = bandNum > 0 ? 'var(--band-' + bandNum + ')' : '#E9ECEF';
      // Band 6 (purple) needs white text; all others (incl. gold B7) use dark navy
      var txtColor = bandNum === 6 ? '#fff' : '#1B2A4A';
      var cell = el('div', 'background:' + bgColor + ';border-radius:10px;padding:10px 6px;text-align:center;');
      cell.innerHTML =
        '<div style="font-size:1.3rem;font-weight:800;color:' + txtColor + ';line-height:1;">' +
          (bandNum || '?') + '</div>' +
        '<div style="font-size:0.6rem;font-weight:600;color:' + txtColor +
          ';opacity:0.85;margin-top:3px;text-transform:uppercase;letter-spacing:0.03em;">' +
          SKILL_LABELS[key] + '</div>' +
        (bandNum > 0
          ? '<div style="font-size:0.63rem;color:' + txtColor + ';opacity:0.7;margin-top:2px;">' +
              (BAND_LABELS[bandNum] || '') + '</div>'
          : '');
      grid.appendChild(cell);
    });
    return grid;
  }

  // ── score chart ───────────────────────────────────────────

  function initScoreChart(imports) {
    var canvas = document.getElementById('perf-score-chart');
    if (!canvas || !window.Chart) return;
    var labels = imports.map(function(i) { return formatTestSource(i.testSource); });
    var total  = imports.map(function(i) { return i.totalScore; });
    var rw     = imports.map(function(i) { return i.rwScore; });
    var math   = imports.map(function(i) { return i.mathScore; });
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'Total', data: total, borderColor: '#1B2A4A',
            backgroundColor: 'rgba(27,42,74,0.06)', borderWidth: 2.5, tension: 0.3,
            fill: true, pointBackgroundColor: '#1B2A4A', pointRadius: 4 },
          { label: 'RW',    data: rw,    borderColor: '#2ABFBF',
            backgroundColor: 'transparent', borderWidth: 2, tension: 0.3,
            borderDash: [5,3], pointBackgroundColor: '#2ABFBF', pointRadius: 3 },
          { label: 'Math',  data: math,  borderColor: '#F4B942',
            backgroundColor: 'transparent', borderWidth: 2, tension: 0.3,
            borderDash: [5,3], pointBackgroundColor: '#F4B942', pointRadius: 3 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top', labels: { font: { family:'Inter', size:12 }, usePointStyle:true, pointStyleWidth:10 } },
          tooltip: { mode:'index', intersect:false },
        },
        scales: {
          y: { min:400, max:1600,
               ticks: { font:{ family:'Inter', size:11 } },
               grid:  { color:'rgba(0,0,0,0.04)' } },
          x: { ticks: { font:{ family:'Inter', size:11 } }, grid:{ display:false } },
        },
      },
    });
  }

  // ── main render ───────────────────────────────────────────

  function render() {
    var container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    var imports      = Storage.getImportHistory()                 || [];
    var bands        = Storage.getBands()                         || {};
    var mastStates   = Storage.getPath('masteryHistory')          || {};
    var stratMastery = Storage.getPath('strategyMastery')         || {};
    var gamification = Storage.getGamification()                  || {};
    var sessions     = Storage.getSessionHistory()                || [];
    var progress     = Storage.getPath('progress')                || {};
    var targetDates  = Storage.getTargetDates()                   || {};
    var scHistory    = Storage.getPath('skillsCheck.history')     || [];

    var latestImport = imports.length > 0 ? imports[imports.length - 1] : null;
    var firstImport  = imports.length > 0 ? imports[0]                  : null;

    var wrap = el('div', 'max-width:960px;');
    wrap.className = 'animate-fade-in';

    // ── Page header ─────────────────────────────────────────
    var headerDiv = el('div', 'margin-bottom:20px;');
    headerDiv.innerHTML =
      '<h1 style="font-size:1.6rem;font-weight:700;color:var(--color-primary);margin:0 0 6px;">Performance</h1>' +
      '<p style="font-size:0.88rem;color:var(--color-neutral-600);margin:0;">' +
      (latestImport
        ? 'Last import: ' + formatTestSource(latestImport.testSource) +
          ' — ' + latestImport.totalScore + ' total — ' +
          formatDate(latestImport.importedAt || latestImport.date)
        : 'Import your first Bluebook test to unlock full analytics.') +
      '</p>';
    wrap.appendChild(headerDiv);

    // ── Lock modal if no imports ────────────────────────────
    if (!latestImport) {
      container.appendChild(wrap);
      // Show centered modal popup instead of inline card
      requestAnimationFrame(function() {
        UI.modal({
          title: '🔒 Module Locked',
          body: '<p style="color:var(--color-neutral-600);line-height:1.6;">This module unlocks after you import your first Bluebook test result. Upload your PDF score report to get started — it only takes a minute.</p>',
          footer:
            '<button class="btn btn-outline" onclick="UI.closeModal()">Not yet</button>' +
            '<button class="btn btn-primary" onclick="UI.closeModal();Router.navigate(\'/import\');">' +
              'Upload PDF →' +
            '</button>',
        });
        if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width':'1.75' } });
      });
      return;
    }

    // ── Plateau / alert banners ─────────────────────────────
    var flags = detectPlateau();
    flags.forEach(function(flag) {
      var bgMap  = { warning:'#FEF3C7', info:'#EFF6FF', success:'#F0FDF4' };
      var bdrMap = { warning:'#F4B942', info:'#93C5FD', success:'#6EE7B7' };
      var txtMap = { warning:'#92400E', info:'#1E40AF', success:'#065F46' };
      var banner = el('div',
        'background:' + bgMap[flag.severity] + ';border:1px solid ' + bdrMap[flag.severity] + ';' +
        'border-radius:10px;padding:12px 16px;margin-bottom:10px;display:flex;align-items:center;gap:12px;');
      banner.innerHTML =
        '<i data-lucide="' + flag.icon + '" style="width:18px;height:18px;color:' +
          txtMap[flag.severity] + ';flex-shrink:0;"></i>' +
        '<span style="font-size:0.85rem;color:' + txtMap[flag.severity] + ';flex:1;">' +
          flag.message + '</span>' +
        (flag.action
          ? '<button class="btn btn-sm btn-ghost" onclick="Router.navigate(\'' + flag.route + '\')" ' +
              'style="color:' + txtMap[flag.severity] + ';font-size:0.78rem;white-space:nowrap;">' +
              flag.action + ' →</button>'
          : '');
      wrap.appendChild(banner);
    });

    // ── Score summary cards ─────────────────────────────────
    wrap.appendChild(sectionHeader('Score Summary'));

    var changeNum = imports.length >= 2 ? latestImport.totalScore - firstImport.totalScore : null;
    var rwChange  = imports.length >= 2 ? (latestImport.rwScore   - firstImport.rwScore)   : null;
    var mthChange = imports.length >= 2 ? (latestImport.mathScore - firstImport.mathScore)  : null;

    function changeLabel(delta) {
      if (delta === null) return ['Baseline', 'var(--color-neutral-400)'];
      var sign = delta >= 0 ? '+' : '';
      var col  = delta > 0 ? '#059669' : delta < 0 ? '#DC2626' : '#6B7280';
      return [sign + delta + ' pts from baseline', col];
    }

    var scoreRow = el('div', 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:8px;');
    scoreRow.className = 'perf-score-row';
    var cl = changeLabel(changeNum);
    scoreRow.appendChild(scoreCard('Total Score', latestImport.totalScore, cl[0], cl[1], 'var(--color-primary)'));
    cl = changeLabel(rwChange);
    scoreRow.appendChild(scoreCard('Reading / Writing', latestImport.rwScore || '—', cl[0], cl[1], 'var(--color-teal)'));
    cl = changeLabel(mthChange);
    scoreRow.appendChild(scoreCard('Math', latestImport.mathScore || '—', cl[0], cl[1], '#D97706'));
    wrap.appendChild(scoreRow);

    // ── Score trend chart ───────────────────────────────────
    if (imports.length >= 2) {
      var chartCard = card('padding:20px;margin-top:8px;');
      chartCard.innerHTML =
        '<div style="font-size:0.8rem;font-weight:600;color:var(--color-primary);margin-bottom:14px;">Score Trend — All Imports</div>' +
        '<canvas id="perf-score-chart" height="180"></canvas>';
      wrap.appendChild(chartCard);
    } else {
      var oneImportNote = el('p',
        'font-size:0.8rem;color:var(--color-neutral-400);margin:6px 0 0;font-style:italic;',
        'Score trend chart appears after your second Bluebook import.');
      wrap.appendChild(oneImportNote);
    }

    // ── Band heatmap ────────────────────────────────────────
    wrap.appendChild(sectionHeader('Skill Band Profile',
      'Current band for each of the 8 skill areas. Lowest 2–3 bands are your ZPD — highest-leverage targets.'));

    var bandCard = card('padding:20px;');

    var rwLabel = el('div',
      'font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;' +
      'color:var(--color-teal);margin-bottom:8px;', 'Reading & Writing');
    bandCard.appendChild(rwLabel);
    bandCard.appendChild(buildBandRow(['main_idea','inference','grammar','transitions','punctuation'], bands));

    var mathLabel = el('div',
      'font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;' +
      'color:#D97706;margin-top:14px;margin-bottom:8px;', 'Math');
    bandCard.appendChild(mathLabel);
    bandCard.appendChild(buildBandRow(['linear_algebra','advanced_math','data_analysis'], bands));

    // Band color legend
    var legend = el('div',
      'display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;padding-top:12px;' +
      'border-top:1px solid var(--color-neutral-100);');
    [1,2,3,4,5,6,7].forEach(function(b) {
      var chip = el('div', 'display:flex;align-items:center;gap:4px;');
      chip.innerHTML =
        '<div style="width:13px;height:13px;border-radius:3px;background:var(--band-' + b + ');"></div>' +
        '<span style="font-size:0.67rem;color:var(--color-neutral-600);">B' + b + ' ' + BAND_LABELS[b] + '</span>';
      legend.appendChild(chip);
    });
    bandCard.appendChild(legend);
    wrap.appendChild(bandCard);

    // ── Projected Score ─────────────────────────────────────
    var satTarget = targetDates.sat || targetDates.psatNmsqt || targetDates.psat10 || null;
    var proj      = computeProjection(imports, satTarget);

    if (proj) {
      var targetLabel = satTarget
        ? 'Target test: ' + formatDate(satTarget) + ' (' + proj.daysToTest + ' days away)'
        : 'No test date set — add one in Study Planner';
      wrap.appendChild(sectionHeader('Score Projection',
        'Based on ' + imports.length + ' import' + (imports.length !== 1 ? 's' : '') +
        '. ' + targetLabel));

      var projRow = el('div', 'display:grid;grid-template-columns:repeat(3,1fr);gap:12px;');
      projRow.className = 'perf-proj-row';
      projRow.appendChild(projCard('Current Score', proj.current, 'Verified Bluebook', 'var(--color-primary)'));

      if (imports.length >= 2 && proj.testDate && proj.daysToTest > 0) {
        var trendNote = proj.slope > 0
          ? '+' + Math.round(proj.slope) + ' pts/test trend'
          : proj.slope < 0 ? Math.round(proj.slope) + ' pts/test trend' : 'Flat trend';
        projRow.appendChild(projCard('Projected Score', proj.projected, trendNote, 'var(--color-teal)'));
      } else {
        projRow.appendChild(projCard('Projected Score', '—',
          imports.length < 2 ? 'Need 2+ Bluebook imports' : 'Add a test date to project',
          'var(--color-neutral-400)'));
      }

      projRow.appendChild(projCard('Score Potential', '+' + (proj.potential - proj.current),
        'From ZPD bands below 5', '#D97706'));
      wrap.appendChild(projRow);

      if (proj.confidence !== 'high' && imports.length >= 2) {
        wrap.appendChild(el('p',
          'font-size:0.73rem;color:var(--color-neutral-400);margin:6px 0 0;font-style:italic;',
          '* Projection confidence: ' + proj.confidence + '. Accuracy improves with each additional Bluebook import.'));
      }
    }

    // ── Strategy Mastery Map ────────────────────────────────
    wrap.appendChild(sectionHeader('Strategy Mastery Map',
      'All 51 strategies. Click any cell to open the Drill Engine.'));

    var mastCard = card('padding:20px;');

    // Legend row
    var mastLegend = el('div', 'display:flex;gap:14px;flex-wrap:wrap;margin-bottom:16px;');
    Object.keys(MASTERY_LABELS).forEach(function(state) {
      var chip = el('div', 'display:flex;align-items:center;gap:5px;');
      chip.innerHTML =
        '<div style="width:12px;height:12px;border-radius:3px;background:' + MASTERY_COLORS[state] +
          ';border:1px solid rgba(0,0,0,0.08);"></div>' +
        '<span style="font-size:0.71rem;color:var(--color-neutral-600);">' + MASTERY_LABELS[state] + '</span>';
      mastLegend.appendChild(chip);
    });
    mastCard.appendChild(mastLegend);

    // Count by state for summary line
    var stateCounts = { not_started:0, in_progress:0, developing:0, mastered:0, elite:0 };
    STRATEGY_SECTIONS.forEach(function(sec) {
      sec.codes.forEach(function(code) {
        var st = stratMastery[code] || 'not_started';
        stateCounts[st] = (stateCounts[st] || 0) + 1;
      });
    });
    var summaryParts = [];
    if (stateCounts.elite > 0)       summaryParts.push(stateCounts.elite + ' Elite');
    if (stateCounts.mastered > 0)    summaryParts.push(stateCounts.mastered + ' Mastered');
    if (stateCounts.developing > 0)  summaryParts.push(stateCounts.developing + ' Developing');
    if (stateCounts.in_progress > 0) summaryParts.push(stateCounts.in_progress + ' In Progress');
    if (stateCounts.not_started > 0) summaryParts.push(stateCounts.not_started + ' Not Started');

    if (summaryParts.length > 0) {
      mastCard.appendChild(el('p',
        'font-size:0.78rem;color:var(--color-neutral-600);margin:0 0 14px;',
        summaryParts.join(' · ')));
    }

    // Section rows
    STRATEGY_SECTIONS.forEach(function(sec) {
      var secWrap = el('div', 'margin-bottom:14px;');
      secWrap.appendChild(el('div',
        'font-size:0.66rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;' +
        'color:var(--color-neutral-500);margin-bottom:6px;',
        sec.id + ' — ' + sec.name));

      var codeRow = el('div', 'display:flex;flex-wrap:wrap;gap:5px;');
      sec.codes.forEach(function(code) {
        var state = stratMastery[code] || 'not_started';
        var cell  = el('div',
          'width:38px;height:34px;border-radius:6px;background:' + MASTERY_COLORS[state] + ';' +
          'border:1px solid rgba(0,0,0,0.07);display:flex;align-items:center;justify-content:center;' +
          'cursor:pointer;font-size:0.62rem;font-weight:700;color:' + MASTERY_TEXT[state] + ';' +
          'transition:transform 0.15s,box-shadow 0.15s;',
          code);
        cell.title = code + ' — ' + MASTERY_LABELS[state];
        cell.onmouseenter = function() {
          this.style.transform    = 'scale(1.12)';
          this.style.boxShadow    = '0 2px 8px rgba(0,0,0,0.12)';
          this.style.zIndex       = '2';
        };
        cell.onmouseleave = function() {
          this.style.transform    = '';
          this.style.boxShadow    = '';
          this.style.zIndex       = '';
        };
        cell.onclick = function() { Router.navigate('/drill-engine'); };
        codeRow.appendChild(cell);
      });
      secWrap.appendChild(codeRow);
      mastCard.appendChild(secWrap);
    });

    wrap.appendChild(mastCard);

    // ── Training Stats ──────────────────────────────────────
    wrap.appendChild(sectionHeader('Training Stats'));

    var totalHours   = ((progress.totalMinutes || 0) / 60).toFixed(1);
    var totalSessions = sessions.length;
    var streak       = progress.streakDays || 0;
    var points       = (gamification.points || 0);
    var badges       = (gamification.badges || []);

    // Compute longest streak from session history
    var longestStreak = 0;
    var currentStrk   = 0;
    var prevD         = null;
    sessions.slice().sort(function(a,b) { return new Date(a.date)-new Date(b.date); })
      .forEach(function(s) {
        var d = new Date(s.date); d.setHours(0,0,0,0);
        if (prevD) {
          var diff = (d - prevD) / 86400000;
          currentStrk = diff === 1 ? currentStrk + 1 : 1;
        } else { currentStrk = 1; }
        longestStreak = Math.max(longestStreak, currentStrk);
        prevD = d;
      });

    var statsGrid = el('div', 'display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px;');
    statsGrid.className = 'perf-stats-grid';
    statsGrid.appendChild(smallStat('clock',       'Hours Practiced',  totalHours + 'h',    'var(--color-teal)'));
    statsGrid.appendChild(smallStat('bar-chart-2', 'Total Sessions',   totalSessions,       'var(--color-primary)'));
    statsGrid.appendChild(smallStat('flame',       'Longest Streak',   longestStreak + 'd', '#D97706'));
    statsGrid.appendChild(smallStat('award',       'Total Points',     points,              '#F4B942'));
    wrap.appendChild(statsGrid);

    // Badges
    if (badges.length > 0) {
      var badgeCard = card('padding:16px;');
      badgeCard.appendChild(el('div',
        'font-size:0.78rem;font-weight:600;color:var(--color-primary);margin-bottom:12px;',
        'Badges Earned (' + badges.length + ')'));
      var badgeRow = el('div', 'display:flex;flex-wrap:wrap;gap:8px;');
      badges.forEach(function(badge) {
        var b = el('div',
          'background:var(--color-accent-50);border:1px solid var(--color-accent);' +
          'border-radius:8px;padding:7px 11px;display:flex;align-items:center;gap:7px;');
        b.innerHTML =
          '<span style="font-size:1rem;">🏅</span>' +
          '<div>' +
            '<div style="font-size:0.75rem;font-weight:600;color:var(--color-primary);">' +
              (badge.name || 'Badge') + '</div>' +
            '<div style="font-size:0.67rem;color:var(--color-neutral-500);">' +
              (badge.description || '') + '</div>' +
          '</div>';
        badgeRow.appendChild(b);
      });
      badgeCard.appendChild(badgeRow);
      wrap.appendChild(badgeCard);
    }

    // ── Skills Check History ────────────────────────────────
    if (scHistory.length > 0) {
      wrap.appendChild(sectionHeader('Skills Check History',
        'Full-curriculum accuracy checks over time. Run monthly for the best signal.'));

      var scCard = card('overflow:hidden;');
      var scTable = document.createElement('table');
      scTable.style.cssText = 'width:100%;border-collapse:collapse;';
      scTable.innerHTML =
        '<thead><tr style="background:var(--color-neutral-50);border-bottom:1px solid var(--color-neutral-200);">' +
          '<th style="padding:10px 16px;text-align:left;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-neutral-500);">Date</th>' +
          '<th style="padding:10px 16px;text-align:center;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-neutral-500);">Accuracy</th>' +
          '<th style="padding:10px 16px;text-align:center;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-neutral-500);">Questions</th>' +
          '<th style="padding:10px 16px;text-align:center;font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-neutral-500);">Change</th>' +
        '</tr></thead>';
      var tbody = document.createElement('tbody');
      scHistory.slice().reverse().forEach(function(check, idx) {
        var origIdx  = scHistory.length - 1 - idx;
        var prev     = origIdx > 0 ? scHistory[origIdx - 1] : null;
        var accuracy = check.accuracy || 0;
        var prevAcc  = prev ? (prev.accuracy || 0) : null;
        var delta    = prevAcc !== null ? Math.round((accuracy - prevAcc) * 1000) / 10 : null;
        var accColor = accuracy >= 0.8 ? '#059669' : accuracy >= 0.6 ? '#D97706' : '#DC2626';
        var dColor   = delta === null ? '#9CA3AF' : delta > 0 ? '#059669' : delta < 0 ? '#DC2626' : '#9CA3AF';
        var dText    = delta === null ? 'Baseline' : (delta > 0 ? '+' : '') + delta + '%';
        var row = document.createElement('tr');
        row.style.cssText = 'border-bottom:1px solid var(--color-neutral-100);';
        row.innerHTML =
          '<td style="padding:10px 16px;font-size:0.82rem;color:var(--color-neutral-700);">' +
            formatDate(check.date) + '</td>' +
          '<td style="padding:10px 16px;text-align:center;font-size:0.9rem;font-weight:700;color:' + accColor + ';">' +
            Math.round(accuracy * 100) + '%</td>' +
          '<td style="padding:10px 16px;text-align:center;font-size:0.82rem;color:var(--color-neutral-600);">' +
            (check.correct || 0) + '/' + (check.totalQuestions || 0) + '</td>' +
          '<td style="padding:10px 16px;text-align:center;font-size:0.82rem;font-weight:600;color:' + dColor + ';">' +
            dText + '</td>';
        tbody.appendChild(row);
      });
      scTable.appendChild(tbody);
      scCard.appendChild(scTable);
      wrap.appendChild(scCard);
    }

    // Bottom spacer
    wrap.appendChild(el('div', 'height:40px;'));

    container.appendChild(wrap);

    // ── Deferred: icons + chart ───────────────────────────
    requestAnimationFrame(function() {
      if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width':'1.75' } });
      if (imports.length >= 2) initScoreChart(imports);
    });
  }

  // ── public API ────────────────────────────────────────────
  return { render: render };

})();

window.PerformanceDashboardModule = PerformanceDashboardModule;
