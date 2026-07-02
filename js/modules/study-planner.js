// ═══════════════════════════════════════════════════════════════════════════
//  SCHOLAR'S EDGE — MODULE 8: STUDY PLANNER
//  Personalized week-by-week plan with day-by-day tasks and auto-adjustment.
//  Depends on: storage.js, ui.js, router.js
// ═══════════════════════════════════════════════════════════════════════════

var StudyPlannerModule = (function () {
  'use strict';

  // ── Week templates ────────────────────────────────────────────────────────
  var WEEK_PLAN = [
    { week:1,  theme:'Orientation + Baseline Test',        focus:'universal',       bluebook:7,  desc:'Get oriented, take Bluebook Test 7 for your true baseline score.' },
    { week:2,  theme:'Universal Strategies',               focus:'universal',       bluebook:null, desc:'Master the 7 strategies that apply to every question type.' },
    { week:3,  theme:'Reading: Elimination',               focus:'reading_elim',    bluebook:null, desc:'Cut wrong answers fast. 8 reading elimination strategies.' },
    { week:4,  theme:'Grammar & Writing',                  focus:'grammar',         bluebook:null, desc:'Subject-verb, pronouns, punctuation, transitions, modifiers.' },
    { week:5,  theme:'Math Core',                          focus:'math_core',       bluebook:null, desc:'Backsolving, plug-in, ballpark, unit tracking, number properties.' },
    { week:6,  theme:'First Check-In Benchmark',           focus:'review',          bluebook:8,  desc:'Bluebook Test 8 shows how much you\'ve gained. Then review gaps.' },
    { week:7,  theme:'Reading: Passage Strategies',        focus:'reading_passage', bluebook:null, desc:'Thesis, argument structure, counterargument, data integration.' },
    { week:8,  theme:'Desmos + Charts & Data',             focus:'desmos',          bluebook:null, desc:'Graphing calculator strategies + data interpretation.' },
    { week:9,  theme:'Grammar Deep Dive',                  focus:'grammar',         bluebook:null, desc:'Second pass on grammar — harder question types, edge cases.' },
    { week:10, theme:'Math Advanced',                      focus:'math_adv',        bluebook:null, desc:'Advanced math strategies + high-band question drilling.' },
    { week:11, theme:'Progress Check',                     focus:'review',          bluebook:9,  desc:'Bluebook Test 9. Identify remaining gaps before the final push.' },
    { week:12, theme:'Weak Area Focus',                    focus:'adaptive',        bluebook:null, desc:'Targeted drilling on your lowest-mastery strategies.' },
    { week:13, theme:'Band 5→6 Push',                      focus:'adaptive',        bluebook:null, desc:'Hard questions in your weakest skill areas. This is the accelerator.' },
    { week:14, theme:'Mixed Practice + CLT Prep',          focus:'mixed',           bluebook:null, desc:'Mixed question sets + CLT-specific strategies and mindset.' },
    { week:15, theme:'Final Strategy Review',              focus:'review',          bluebook:null, desc:'Lock in all 51 strategies. Full Skills Check. Identify any last gaps.' },
    { week:16, theme:'Pre-PSAT Benchmark',                 focus:'review',          bluebook:10, desc:'Bluebook Test 10. Your pre-PSAT score. Celebrate how far you\'ve come.' },
  ];

  // Codes per focus area
  var FOCUS_CODES = {
    universal:       ['U1','U2','U3','U4','U5','U6','U7'],
    reading_elim:    ['R1','R2','R3','R4','R5','R6','R7','R8'],
    reading_passage: ['R9','R10','R11','R12','R13'],
    grammar:         ['G1','G2','G3','G4','G5','G6','G7'],
    math_core:       ['M1','M2','M3','M4','M5','M6','M7','M8','M9'],
    desmos:          ['M10','M11','M12','M13','M14','M15','C1','C2','C3','C4'],
    math_adv:        ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'],
    mixed:           ['MN1','MN2','MN3','MN4','MN5'],
    review:          [],   // filled dynamically
    adaptive:        [],   // filled from weak mastery
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

  var DAY_KEYS  = ['sun','mon','tue','wed','thu','fri','sat'];
  var DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var DAY_FULL  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  // ── Storage helpers ───────────────────────────────────────────────────────
  function getStudyDays()       { return Storage.getPath('planner.studyDays', ['mon','wed','fri','sat']); }
  function setStudyDays(v)      { Storage.setPath('planner.studyDays', v); }
  function getSessionLength()   { return Storage.getPath('planner.sessionLength', 30); }
  function setSessionLength(v)  { Storage.setPath('planner.sessionLength', v); }

  function getPlanStartDate() {
    // Priority: first import date → createdAt → today
    var imports = Storage.getImportHistory();
    if (imports && imports.length) {
      var oldest = imports[imports.length - 1];
      if (oldest.date) return new Date(oldest.date);
    }
    var created = Storage.getPath('student.createdAt', null);
    if (created) return new Date(created);
    return new Date();
  }

  function getCurrentWeekNum() {
    var start = getPlanStartDate();
    var now   = new Date();
    var diff  = now - start;
    var weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
    return Math.max(1, Math.min(weeks, 16));
  }

  // Get dates of each day in week N (week 1 starts on plan start date's Monday)
  function getWeekDates(weekNum) {
    var start  = getPlanStartDate();
    // Snap to Monday of the week containing start date
    var dow    = start.getDay(); // 0=Sun
    var monday = new Date(start);
    monday.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));
    // Advance to the right week
    var weekStart = new Date(monday);
    weekStart.setDate(monday.getDate() + (weekNum - 1) * 7);
    var days = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push(d);
    }
    return days; // [Sun... wait, we start from Monday]
    // Actually return Mon–Sun
  }

  function getWeekDatesMtoS(weekNum) {
    var start  = getPlanStartDate();
    var dow    = start.getDay();
    var monday = new Date(start);
    monday.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1));
    var weekMonday = new Date(monday);
    weekMonday.setDate(monday.getDate() + (weekNum - 1) * 7);
    var days = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(weekMonday);
      d.setDate(weekMonday.getDate() + i);
      days.push(d);
    }
    return days; // Mon[0] Tue[1] Wed[2] Thu[3] Fri[4] Sat[5] Sun[6]
  }

  function dateKey(date) {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  function todayKey() {
    return dateKey(new Date());
  }

  function fmtDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function fmtDateFull(date) {
    return date.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
  }

  // ── Session history helpers ───────────────────────────────────────────────
  function getSessionsByDay() {
    // Returns a map of YYYY-MM-DD → array of session records
    var sessions = Storage.getSessionHistory ? Storage.getSessionHistory() : Storage.getPath('sessions', []);
    var byDay = {};
    sessions.forEach(function (s) {
      var key = s.date ? s.date.slice(0, 10) : null;
      if (!key) return;
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(s);
    });
    return byDay;
  }

  function getMissedDays(lookbackDays) {
    lookbackDays = lookbackDays || 7;
    var byDay = getSessionsByDay();
    var studyDays = getStudyDays();
    // Anchor to plan start — don't count days before the student's plan
    // existed as "missed" (a brand-new student would otherwise always show
    // missed days for the days before they signed up).
    var planStartKey = dateKey(getPlanStartDate());
    var missed = 0;
    for (var i = 1; i <= lookbackDays; i++) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var key = dateKey(d);
      if (key < planStartKey) continue;
      var dow = DAY_KEYS[d.getDay()];
      if (studyDays.indexOf(dow) !== -1 && !byDay[key]) missed++;
    }
    return missed;
  }

  function getStreakDays() {
    return Storage.getPath('progress.streakDays', 0);
  }

  // ── Auto-adjustment logic ─────────────────────────────────────────────────
  function getAutoAdjustFlags() {
    var flags = [];
    var missed = getMissedDays(7);
    var streak = getStreakDays();
    var studyDays = getStudyDays();

    // Missed days
    if (missed >= 3) {
      flags.push({
        type: 'warning',
        icon: '⚠️',
        title: missed + ' study days missed this week',
        body: 'Your plan assumed ' + studyDays.length + ' sessions/week. Missing sessions compounds — each skip makes the next one easier to skip. Get back on track today.',
        cta: 'See today\'s task',
      });
    }

    // Streak celebration
    if (streak >= 7 && missed === 0) {
      flags.push({
        type: 'success',
        icon: '🔥',
        title: streak + '-day streak — you\'re in the zone',
        body: 'Consistency is the single biggest predictor of score improvement. Keep it going.',
      });
    }

    // Plateau check: no strategy mastery advancement in 21+ days
    var history = Storage.getPath('masteryHistory', {});
    var advancedRecently = false;
    var now = Date.now();
    Object.keys(history).forEach(function (code) {
      var entries = history[code] || [];
      entries.forEach(function (e) {
        if (e.date && (now - e.date) < 21 * 86400000 && e.stateUp) advancedRecently = true;
      });
    });
    var totalSessions = Storage.getPath('progress.totalSessions', 0);
    if (totalSessions >= 10 && !advancedRecently) {
      flags.push({
        type: 'info',
        icon: '📊',
        title: 'No mastery advancement in 21+ days',
        body: 'You\'re practicing but not advancing. Shift focus: spend the next 3 sessions exclusively drilling your "in_progress" strategies at their current level — don\'t branch out until one advances.',
        cta: 'Go to Drill Engine',
        ctaRoute: '/drill-engine',
      });
    }

    // Score trajectory from imports
    var imports = Storage.getImportHistory ? Storage.getImportHistory() : Storage.getPath('importHistory', []);
    if (imports.length >= 2) {
      var latest  = imports[0];
      var prev    = imports[1];
      var latestScore = (latest.rwScore || 0) + (latest.mathScore || 0);
      var prevScore   = (prev.rwScore || 0)   + (prev.mathScore || 0);
      if (latestScore > 0 && prevScore > 0) {
        var delta = latestScore - prevScore;
        if (delta >= 50) {
          flags.push({
            type: 'success',
            icon: '📈',
            title: '+' + delta + ' points since last test',
            body: 'Your strategy training is converting into real score gains. You\'re ahead of pace — keep drilling and we\'ll push to harder questions.',
          });
        } else if (delta < 0) {
          flags.push({
            type: 'warning',
            icon: '📉',
            title: delta + ' points from last test',
            body: 'Score dipped. This happens — test conditions vary. Review which question types missed and increase drill frequency on those strategies this week.',
            cta: 'View Score Bands',
            ctaRoute: '/score-bands',
          });
        }
      }
    }

    return flags;
  }

  // ── Task generation ───────────────────────────────────────────────────────
  function getWeakCodes() {
    // Returns codes not yet mastered, sorted by mastery state priority
    var order = ['in_progress', 'developing', 'not_started'];
    var allCodes = Object.keys(STRATEGY_NAMES);
    var result = [];
    order.forEach(function (state) {
      allCodes.forEach(function (code) {
        var s = Storage.getPath('strategyMastery.' + code, 'not_started');
        if (s === state) result.push(code);
      });
    });
    return result;
  }

  function getCodesForWeek(weekNum) {
    var template = WEEK_PLAN[weekNum - 1] || WEEK_PLAN[0];
    var focus = template.focus;
    if (focus === 'adaptive' || focus === 'review') {
      return getWeakCodes().slice(0, 6);
    }
    return FOCUS_CODES[focus] || [];
  }

  // Generate day-by-day tasks for a given week
  function buildWeekTasks(weekNum) {
    var studyDays   = getStudyDays();
    var sessionMins = getSessionLength();
    var weekDates   = getWeekDatesMtoS(weekNum); // Mon–Sun
    var codes       = getCodesForWeek(weekNum);
    var template    = WEEK_PLAN[weekNum - 1] || WEEK_PLAN[0];
    var byDay       = getSessionsByDay();

    // Map day keys to their date for this week
    var dayMap = {};
    weekDates.forEach(function (d, i) {
      // i=0 Mon, 1 Tue, 2 Wed, 3 Thu, 4 Fri, 5 Sat, 6 Sun
      var keys = ['mon','tue','wed','thu','fri','sat','sun'];
      dayMap[keys[i]] = d;
    });

    var tasks = [];
    var codeIndex = 0;
    var toggleLesson = true; // alternate lesson/drill each study day

    studyDays.forEach(function (dk) {
      var date = dayMap[dk];
      if (!date) return;

      var dayTasks = [];

      if (template.bluebook && dk === studyDays[Math.floor(studyDays.length / 2)]) {
        // Mid-week = Bluebook day
        dayTasks.push({
          type: 'bluebook',
          label: 'Bluebook Test ' + template.bluebook,
          duration: 155,
          module: null,
          route: null,
          icon: '📝',
        });
      } else {
        var code = codes[codeIndex % Math.max(codes.length, 1)];
        var stratName = STRATEGY_NAMES[code] || code;

        if (sessionMins >= 30) {
          // Long session: lesson + drill combo
          if (toggleLesson) {
            dayTasks.push({ type: 'lesson',  code: code, label: stratName, duration: Math.round(sessionMins * 0.55), module: 'strategy_course', route: '/strategy-course', icon: '📖' });
            dayTasks.push({ type: 'drill',   code: code, label: stratName, duration: Math.round(sessionMins * 0.45), module: 'drill_engine',   route: '/drill-engine',   icon: '⚡' });
          } else {
            dayTasks.push({ type: 'drill',   code: code,                    label: stratName, duration: Math.round(sessionMins * 0.6),  module: 'drill_engine',   route: '/drill-engine',   icon: '⚡' });
            var nextCode = codes[(codeIndex + 1) % Math.max(codes.length, 1)];
            dayTasks.push({ type: 'lesson',  code: nextCode, label: STRATEGY_NAMES[nextCode] || nextCode, duration: Math.round(sessionMins * 0.4), module: 'strategy_course', route: '/strategy-course', icon: '📖' });
          }
        } else if (sessionMins >= 20) {
          // Medium: single task
          if (toggleLesson) {
            dayTasks.push({ type: 'lesson', code: code, label: stratName, duration: sessionMins, module: 'strategy_course', route: '/strategy-course', icon: '📖' });
          } else {
            dayTasks.push({ type: 'drill',  code: code, label: stratName, duration: sessionMins, module: 'drill_engine',   route: '/drill-engine',   icon: '⚡' });
          }
        } else {
          // Short (10 min): drill only
          dayTasks.push({ type: 'drill', code: code, label: stratName, duration: sessionMins, module: 'drill_engine', route: '/drill-engine', icon: '⚡' });
        }

        codeIndex++;
        toggleLesson = !toggleLesson;

        // Last study day of week → add Skills Check if week ≥ 4 and it's been 4+ weeks
        if (dk === studyDays[studyDays.length - 1] && weekNum >= 4) {
          var lastCheck = Storage.getPath('skillsCheck.last', null);
          var daysSinceCheck = lastCheck ? Math.floor((Date.now() - lastCheck.date) / 86400000) : 999;
          if (daysSinceCheck >= 28) {
            dayTasks.push({ type: 'skills_check', code: null, label: 'Skills Check', duration: 40, module: 'skills_check', route: '/skills-check', icon: '🎯' });
          }
        }
      }

      // Completion must match the SPECIFIC task(s) assigned this day, not just
      // "studied something" — checks the strategy code (lesson/drill), the
      // module flag (skills_check), or import history (bluebook) per task type.
      var sessionsToday = byDay[dateKey(date)] || [];
      var importsToday  = null; // lazy-loaded only if a bluebook task exists today
      var doneToday = dayTasks.length > 0 && dayTasks.every(function (t) {
        if (t.type === 'bluebook') {
          if (importsToday === null) {
            importsToday = (Storage.getImportHistory ? Storage.getImportHistory() : []).filter(function (imp) {
              return imp.importedAt && imp.importedAt.slice(0, 10) === dateKey(date);
            });
          }
          return importsToday.length > 0;
        }
        if (t.type === 'skills_check') {
          return sessionsToday.some(function (s) { return s.module === 'skills_check'; });
        }
        // lesson / drill — must match the specific strategy code assigned
        return sessionsToday.some(function (s) { return s.strategy === t.code; });
      });

      tasks.push({
        dayKey:   dk,
        dayName:  DAY_NAMES[DAY_KEYS.indexOf(dk)] || dk,
        dayFull:  DAY_FULL[DAY_KEYS.indexOf(dk)]  || dk,
        date:     date,
        dateStr:  fmtDate(date),
        done:     doneToday,
        tasks:    dayTasks,
      });
    });

    return tasks;
  }

  // ── Today's card ──────────────────────────────────────────────────────────
  function getTodayTask() {
    var weekNum = getCurrentWeekNum();
    var studyDays = getStudyDays();
    var now = new Date();
    var todayDow = DAY_KEYS[now.getDay()]; // e.g., 'tue'
    var weekTasks = buildWeekTasks(weekNum);
    var todayEntry = null;
    weekTasks.forEach(function (d) {
      if (d.dayKey === todayDow) todayEntry = d;
    });
    if (!todayEntry) {
      // Today is a rest day
      return { type: 'rest', message: 'Rest day today. Next study day: ' + (function () {
        var todayIdx = DAY_KEYS.indexOf(todayDow);
        for (var i = 1; i <= 7; i++) {
          var next = DAY_KEYS[(todayIdx + i) % 7];
          if (studyDays.indexOf(next) !== -1) return DAY_FULL[(todayIdx + i) % 7];
        }
        return 'soon';
      })() };
    }
    return todayEntry;
  }

  // ── RENDER HELPERS ────────────────────────────────────────────────────────
  function el(tag, css, html) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (html) e.innerHTML = html;
    return e;
  }

  function section(title) {
    var h = document.createElement('h2');
    h.style.cssText = 'font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-primary);margin:32px 0 12px;';
    h.textContent = title;
    return h;
  }

  function taskTypeBadge(type) {
    var configs = {
      lesson:       { bg:'#3b82f618', color:'#3b82f6', label:'Lesson' },
      drill:        { bg:'var(--accent)18', color:'var(--accent)', label:'Drill' },
      skills_check: { bg:'#a855f718', color:'#a855f7', label:'Skills Check' },
      bluebook:     { bg:'#f59e0b18', color:'#f59e0b', label:'Bluebook Test' },
      review:       { bg:'#22c55e18', color:'#22c55e', label:'Review' },
    };
    var c = configs[type] || { bg:'var(--border)', color:'var(--text-muted)', label: type };
    return '<span style="font-size:0.68rem;font-weight:700;padding:2px 8px;border-radius:20px;background:' + c.bg + ';color:' + c.color + ';">' + c.label + '</span>';
  }

  // ── RENDER: Preferences ───────────────────────────────────────────────
  function renderPreferences(container) {
    container.appendChild(section('Study Preferences'));

    var hint = el('p',
      'font-size:0.8rem;color:var(--color-neutral-600);margin:0 0 14px;',
      'Tap any day or session length to toggle it. Your plan updates immediately.');
    container.appendChild(hint);

    var card = el('div',
      'background:var(--color-white);border:1.5px solid var(--color-neutral-300);border-radius:14px;padding:22px;display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:8px;box-shadow:0 1px 4px rgba(27,42,74,0.08);');
    card.className = 'sp-pref-card';

    // Helper: re-render Today card + week section after any pref change
    function onPrefChange() {
      var todayWrap = document.getElementById('sp-today-wrap');
      if (todayWrap) { todayWrap.innerHTML = ''; renderTodayCard(todayWrap); }
      var weekSection = document.getElementById('sp-week-section');
      if (weekSection) { weekSection.innerHTML = ''; buildWeekSection(weekSection); }
    }

    // ── Study Days ──
    var daysBox = el('div', '');
    daysBox.innerHTML =
      '<div style="font-size:0.83rem;font-weight:700;color:var(--text-primary);margin-bottom:3px;">\uD83D\uDCC5 Study Days</div>' +
      '<div style="font-size:0.72rem;color:var(--color-neutral-600);margin-bottom:12px;">Which days will you study each week?</div>';
    var dayRow = el('div', 'display:flex;flex-wrap:wrap;gap:7px;');
    var currentDays = getStudyDays();
    var keyMap = { Mon:'mon', Tue:'tue', Wed:'wed', Thu:'thu', Fri:'fri', Sat:'sat', Sun:'sun' };

    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(function (name) {
      var dk = keyMap[name];
      var active = currentDays.indexOf(dk) !== -1;
      var btn = document.createElement('button');
      btn.setAttribute('data-label', name);
      btn.style.cssText =
        'padding:7px 15px;border-radius:20px;' +
        'border:1.5px solid ' + (active ? 'var(--accent)' : 'var(--border)') + ';' +
        'background:' + (active ? 'var(--accent)' : 'var(--surface)') + ';' +
        'color:' + (active ? '#fff' : 'var(--text-muted)') + ';' +
        'font-size:0.8rem;font-weight:' + (active ? '700' : '400') + ';' +
        'cursor:pointer;transition:all 0.15s;min-width:52px;text-align:center;';
      btn.innerHTML = active ? ('\u2713 ' + name) : name;
      btn.title = (active ? 'Remove ' : 'Add ') + name;

      (function (dayKey, button, dayName) {
        button.addEventListener('click', function () {
          var days = getStudyDays();
          var idx = days.indexOf(dayKey);
          if (idx === -1) { days.push(dayKey); }
          else if (days.length > 1) { days.splice(idx, 1); }
          setStudyDays(days);
          var nowActive = days.indexOf(dayKey) !== -1;
          button.style.background  = nowActive ? 'var(--accent)' : 'var(--surface)';
          button.style.borderColor = nowActive ? 'var(--accent)' : 'var(--border)';
          button.style.color       = nowActive ? '#fff' : 'var(--text-muted)';
          button.style.fontWeight  = nowActive ? '700' : '400';
          button.innerHTML         = nowActive ? ('\u2713 ' + dayName) : dayName;
          button.title             = (nowActive ? 'Remove ' : 'Add ') + dayName;
          UI.toast(dayName + (nowActive ? ' added' : ' removed') + ' \u2014 plan updated', 'success', '', 1600);
          onPrefChange();
        });
      })(dk, btn, name);

      dayRow.appendChild(btn);
    });
    daysBox.appendChild(dayRow);
    card.appendChild(daysBox);

    // ── Session Length ──
    var lenBox = el('div', '');
    lenBox.innerHTML =
      '<div style="font-size:0.83rem;font-weight:700;color:var(--text-primary);margin-bottom:3px;">\u23F1 Session Length</div>' +
      '<div style="font-size:0.72rem;color:var(--color-neutral-600);margin-bottom:12px;">How long can you study in one sitting?</div>';
    var lenRow = el('div', 'display:flex;gap:7px;flex-wrap:wrap;');
    var currentLen = getSessionLength();

    [10, 20, 30, 45].forEach(function (mins) {
      var active = currentLen === mins;
      var label = mins + ' min';
      var btn = document.createElement('button');
      btn.setAttribute('data-label', label);
      btn.style.cssText =
        'padding:7px 15px;border-radius:20px;' +
        'border:1.5px solid ' + (active ? 'var(--accent)' : 'var(--border)') + ';' +
        'background:' + (active ? 'var(--accent)' : 'var(--surface)') + ';' +
        'color:' + (active ? '#fff' : 'var(--text-muted)') + ';' +
        'font-size:0.8rem;font-weight:' + (active ? '700' : '400') + ';' +
        'cursor:pointer;transition:all 0.15s;';
      btn.innerHTML = active ? ('\u2713 ' + label) : label;

      (function (m, button, lbl) {
        button.addEventListener('click', function () {
          setSessionLength(m);
          // Reset all length buttons
          lenRow.querySelectorAll('button').forEach(function (b) {
            b.style.background  = 'var(--surface)';
            b.style.borderColor = 'var(--border)';
            b.style.color       = 'var(--text-muted)';
            b.style.fontWeight  = '400';
            b.innerHTML = b.getAttribute('data-label') || b.innerHTML;
          });
          // Activate this one
          button.style.background  = 'var(--accent)';
          button.style.borderColor = 'var(--accent)';
          button.style.color       = '#fff';
          button.style.fontWeight  = '700';
          button.innerHTML = '\u2713 ' + lbl;
          UI.toast(lbl + ' selected \u2014 plan updated', 'success', '', 1600);
          onPrefChange();
        });
      })(mins, btn, label);

      lenRow.appendChild(btn);
    });
    lenBox.appendChild(lenRow);
    card.appendChild(lenBox);

    container.appendChild(card);
  }

    // ── RENDER: Target Dates ──────────────────────────────────────────────────
  function renderTargetDates(container) {
    container.appendChild(section('Target Test Dates'));

    var grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-bottom:8px;');

    var tests = [
      { key:'psat10',    label:'PSAT 10',      note:'Spring 2027 — practice run' },
      { key:'psatNmsqt', label:'PSAT/NMSQT',   note:'Oct 2027 — National Merit eligible' },
      { key:'sat',       label:'SAT',           note:'Spring/Summer 2028 — primary goal' },
      { key:'clt',       label:'CLT',           note:'TBD — classical college admissions' },
    ];

    var dates = Storage.getTargetDates();
    tests.forEach(function (t) {
      var card = el('div', 'background:var(--color-white);border:1.5px solid var(--color-neutral-300);border-radius:12px;padding:14px 16px;box-shadow:0 1px 3px rgba(27,42,74,0.07);');
      card.innerHTML =
        '<div style="font-size:0.82rem;font-weight:600;color:var(--text-primary);margin-bottom:2px;">' + t.label + '</div>' +
        '<div style="font-size:0.7rem;color:var(--color-neutral-600);margin-bottom:8px;">' + t.note + '</div>';

      var input = document.createElement('input');
      input.type = 'date';
      input.className = 'form-input';
      input.style.cssText = 'width:100%;font-size:0.8rem;padding:6px 10px;';
      input.value = dates[t.key] || '';
      card.appendChild(input);

      // Days until test — created once, updated in place so it reflects
      // the date instantly on change instead of waiting for a re-render.
      var countdown = el('div', 'font-size:0.75rem;font-weight:600;color:var(--accent);margin-top:6px;', '');
      countdown.style.display = 'none';
      function updateCountdown(dateStr) {
        if (!dateStr) { countdown.style.display = 'none'; return; }
        var daysUntil = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
        if (daysUntil > 0) {
          countdown.textContent = daysUntil + ' days away';
          countdown.style.display = 'block';
        } else {
          countdown.style.display = 'none';
        }
      }
      updateCountdown(dates[t.key]);
      card.appendChild(countdown);

      (function (key) {
        input.addEventListener('change', function () {
          Storage.setTargetDate(key, input.value);
          updateCountdown(input.value);
          UI.toast(t.label + ' date saved', 'success', '', 2000);
        });
      })(t.key);

      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  // ── RENDER: Bluebook Schedule ─────────────────────────────────────────────
  function renderBluebookSchedule(container) {
    container.appendChild(section('Bluebook Practice Test Schedule'));

    var weekNum = getCurrentWeekNum();
    var tests = [
      { test:'Test 7',  week:1,  label:'Baseline',               desc:'Your true starting point. Do not skip.' },
      { test:'Test 8',  week:6,  label:'First Check-In',         desc:'How much has your training paid off?' },
      { test:'Test 9',  week:11, label:'Progress Test',          desc:'Identify remaining gaps before the final push.' },
      { test:'Test 10', week:16, label:'Pre-PSAT Benchmark',     desc:'Final score before your first major test.' },
    ];

    var imports = Storage.getImportHistory ? Storage.getImportHistory() : Storage.getPath('importHistory', []);
    // Check which tests have been imported
    var completedTests = {};
    imports.forEach(function (imp) {
      if (imp.testNumber) completedTests[imp.testNumber] = imp;
    });

    var wrap = el('div', 'display:flex;flex-direction:column;gap:8px;margin-bottom:8px;');
    tests.forEach(function (t) {
      var completed = completedTests[t.test];
      var isCurrent = weekNum >= t.week && weekNum < (t.week + 1);
      var isUpcoming = weekNum < t.week;
      var isPast = weekNum > t.week && !completed;

      var row = el('div', 'display:flex;align-items:center;gap:14px;padding:12px 16px;background:var(--color-white);border:1.5px solid ' + (isCurrent ? 'var(--color-accent)' : 'var(--color-neutral-300)') + ';border-radius:10px;box-shadow:0 1px 2px rgba(27,42,74,0.05);');

      // Week pill
      var weekPill = el('span', 'font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:20px;white-space:nowrap;background:' + (completed ? '#22c55e22' : isCurrent ? 'var(--color-accent-100)' : 'var(--color-neutral-100)') + ';color:' + (completed ? '#22c55e' : isCurrent ? 'var(--color-accent-600)' : 'var(--color-neutral-600)') + ';', 'Week ' + t.week);
      row.appendChild(weekPill);

      var info = el('div', 'flex:1;');
      info.innerHTML = '<div style="font-size:0.85rem;font-weight:600;color:var(--text-primary);">' + t.test + ' — ' + t.label + '</div>' +
        '<div style="font-size:0.72rem;color:var(--color-neutral-600);">' + t.desc + '</div>';
      row.appendChild(info);

      // Status
      if (completed) {
        var score = (completed.rwScore || 0) + (completed.mathScore || 0);
        var badge = el('span', 'font-size:0.75rem;font-weight:700;padding:3px 10px;border-radius:20px;background:#22c55e22;color:#22c55e;white-space:nowrap;', score ? '✓ ' + score : '✓ Done');
        row.appendChild(badge);
      } else if (isCurrent) {
        var badge2 = el('span', 'font-size:0.75rem;font-weight:700;padding:3px 10px;border-radius:20px;background:var(--accent)22;color:var(--accent);white-space:nowrap;', 'Current');
        row.appendChild(badge2);
      } else if (isUpcoming) {
        var badge3 = el('span', 'font-size:0.72rem;color:var(--text-muted);', 'Week ' + t.week);
        row.appendChild(badge3);
      } else if (isPast) {
        var badge4 = el('span', 'font-size:0.72rem;color:#f59e0b;font-weight:600;', '⚠ Not yet imported');
        row.appendChild(badge4);
      }

      wrap.appendChild(row);
    });

    container.appendChild(wrap);
  }

  // ── RENDER: Auto-adjustment banners ──────────────────────────────────────
  function renderAdjustmentBanners(container) {
    var flags = getAutoAdjustFlags();
    if (!flags.length) return;

    flags.forEach(function (flag) {
      var bg = flag.type === 'warning' ? '#f59e0b18' : flag.type === 'success' ? '#22c55e18' : 'var(--surface-raised)';
      var border = flag.type === 'warning' ? '#f59e0b' : flag.type === 'success' ? '#22c55e' : 'var(--border)';

      var banner = el('div', 'background:' + bg + ';border:1px solid ' + border + ';border-radius:12px;padding:14px 16px;margin-bottom:10px;');
      banner.innerHTML =
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
        '<span style="font-size:1rem;">' + flag.icon + '</span>' +
        '<strong style="font-size:0.87rem;color:var(--text-primary);">' + flag.title + '</strong>' +
        '</div>' +
        '<p style="margin:0;font-size:0.82rem;color:var(--text-secondary);line-height:1.5;">' + flag.body + '</p>';

      if (flag.cta && flag.ctaRoute) {
        var btn = el('button', 'margin-top:8px;font-size:0.78rem;font-weight:600;color:var(--accent);background:none;border:none;cursor:pointer;padding:0;text-decoration:underline;text-underline-offset:2px;', flag.cta);
        btn.addEventListener('click', function () { Router.navigate(flag.ctaRoute); });
        banner.appendChild(btn);
      }

      container.appendChild(banner);
    });
  }

  // ── RENDER: Today's Card ──────────────────────────────────────────────────
  function renderTodayCard(container) {
    container.appendChild(section('Today'));

    var today = getTodayTask();

    if (today.type === 'rest') {
      var restCard = el('div', 'background:var(--color-white);border:1.5px solid var(--color-accent);border-radius:14px;padding:20px;margin-bottom:8px;box-shadow:0 1px 4px rgba(27,42,74,0.08);');
      restCard.innerHTML =
        '<div style="font-size:1.1rem;margin-bottom:6px;">😴</div>' +
        '<div style="font-size:0.9rem;font-weight:600;color:var(--text-primary);">Rest Day</div>' +
        '<div style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;">' + today.message + '</div>';
      container.appendChild(restCard);
      return;
    }

    var todayCard = el('div', 'background:var(--color-white);border:1.5px solid var(--color-accent);border-radius:14px;padding:20px;margin-bottom:8px;box-shadow:0 1px 4px rgba(27,42,74,0.08);');

    if (today.done) {
      todayCard.style.borderColor = '#22c55e88';
      todayCard.style.background = '#22c55e0a';
      todayCard.innerHTML =
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">' +
        '<span style="font-size:1.2rem;">✅</span>' +
        '<span style="font-size:0.95rem;font-weight:700;color:#22c55e;">You trained today!</span>' +
        '</div>' +
        '<div style="font-size:0.82rem;color:var(--color-neutral-700);">Come back tomorrow for ' + (today.tasks[0] ? today.tasks[0].label : 'your next task') + '.</div>';
      container.appendChild(todayCard);
      return;
    }

    var headerRow = el('div', 'display:flex;align-items:center;gap:8px;margin-bottom:14px;');
    headerRow.innerHTML =
      '<span style="font-size:1rem;">📅</span>' +
      '<strong style="font-size:0.92rem;color:var(--text-primary);">Today — ' + today.dayFull + ', ' + today.dateStr + '</strong>' +
      '<span style="margin-left:auto;font-size:0.75rem;color:var(--color-neutral-600);">Week ' + getCurrentWeekNum() + '</span>';
    todayCard.appendChild(headerRow);

    today.tasks.forEach(function (task) {
      var taskRow = el('div', 'display:flex;align-items:center;gap:12px;padding:10px 14px;border:1px solid var(--border);border-radius:10px;margin-bottom:8px;background:var(--surface);');
      taskRow.innerHTML =
        '<span style="font-size:1rem;">' + task.icon + '</span>' +
        '<div style="flex:1;">' +
          '<div style="font-size:0.87rem;font-weight:600;color:var(--text-primary);">' + (task.code ? task.code + ' · ' : '') + task.label + '</div>' +
          '<div style="font-size:0.72rem;color:var(--color-neutral-600);margin-top:2px;">' + task.duration + ' min · ' + taskTypeBadge(task.type) + '</div>' +
        '</div>';

      if (task.route) {
        var goBtn = el('button', 'font-size:0.78rem;font-weight:600;padding:5px 14px;border-radius:20px;background:var(--accent);color:#fff;border:none;cursor:pointer;white-space:nowrap;', 'Start →');
        (function (route) { goBtn.addEventListener('click', function () { Router.navigate(route); }); })(task.route);
        taskRow.appendChild(goBtn);
      }

      todayCard.appendChild(taskRow);
    });

    container.appendChild(todayCard);
  }

  // ── RENDER: 16-Week Plan ──────────────────────────────────────────────────
  function buildWeekSection(container) {
    var weekNum = getCurrentWeekNum();
    var studyDays = getStudyDays();

    // Summary strip
    var strip = el('div', 'display:flex;align-items:center;gap:10px;font-size:0.82rem;color:var(--color-neutral-700);margin-bottom:16px;');
    strip.innerHTML =
      '<span>📅 ' + studyDays.length + ' days/week · ⏱ ' + getSessionLength() + ' min/session</span>' +
      '<span style="margin-left:auto;">Current: <strong style="color:var(--accent);">Week ' + weekNum + '</strong></span>';
    container.appendChild(strip);

    WEEK_PLAN.forEach(function (w) {
      var isCurrent = w.week === weekNum;
      var isPast = w.week < weekNum;

      var weekRow = el('div', 'border:1.5px solid ' + (isCurrent ? 'var(--color-accent)' : 'var(--color-neutral-300)') + ';border-radius:12px;margin-bottom:8px;overflow:hidden;background:' + (isCurrent ? 'var(--color-accent-50)' : 'var(--color-white)') + ';box-shadow:0 1px 3px rgba(27,42,74,0.07);');

      // Header row (always visible)
      var header = el('div', 'display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;user-select:none;', '');
      var weekLabel = el('span', 'font-size:0.72rem;font-weight:700;min-width:54px;color:' + (isCurrent ? 'var(--color-accent-500)' : isPast ? 'var(--color-neutral-400)' : 'var(--color-primary)') + ';', 'Week ' + w.week);
      var themeLabel = el('span', 'flex:1;font-size:0.87rem;font-weight:' + (isCurrent ? '700' : '500') + ';color:' + (isCurrent ? 'var(--color-primary)' : isPast ? 'var(--color-neutral-400)' : 'var(--color-text)') + ';', w.theme);

      var statusEl;
      if (w.bluebook) {
        statusEl = el('span', 'font-size:0.7rem;font-weight:700;padding:2px 8px;border-radius:20px;background:#f59e0b22;color:#f59e0b;white-space:nowrap;', '📝 Test ' + w.bluebook);
      } else if (isPast) {
        statusEl = el('span', 'font-size:0.7rem;color:var(--text-muted);', '✓ Done');
      } else if (isCurrent) {
        statusEl = el('span', 'font-size:0.7rem;font-weight:700;padding:2px 8px;border-radius:20px;background:var(--accent)22;color:var(--accent);', 'This week');
      } else {
        statusEl = el('span', '');
      }

      var chevron = el('span', 'font-size:0.7rem;color:var(--text-muted);transition:transform 0.15s;', '▼');

      header.appendChild(weekLabel);
      header.appendChild(themeLabel);
      header.appendChild(statusEl);
      header.appendChild(chevron);

      // Detail section
      var detail = el('div', 'padding:0 16px 0;max-height:0;overflow:hidden;transition:max-height 0.25s ease,padding 0.15s;background:transparent;', '');

      var expanded = isCurrent; // auto-expand current week
      if (expanded) {
        detail.style.maxHeight = '1000px';
        detail.style.paddingBottom = '14px';
        chevron.style.transform = 'rotate(180deg)';
      }

      header.addEventListener('click', function () {
        expanded = !expanded;
        detail.style.maxHeight = expanded ? '1000px' : '0';
        detail.style.paddingBottom = expanded ? '14px' : '0';
        chevron.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0)';
      });

      // Detail content
      var descP = el('p', 'font-size:0.8rem;color:var(--color-neutral-700);margin:0 0 12px;', w.desc);
      detail.appendChild(descP);

      if (isCurrent || w.week > weekNum - 3) {
        // Show day tasks for current + recent past weeks
        var dayTasks = buildWeekTasks(w.week);
        if (dayTasks.length) {
          var daysGrid = el('div', 'display:flex;flex-direction:column;gap:6px;');
          dayTasks.forEach(function (d) {
            var dRow = el('div', 'display:flex;align-items:flex-start;gap:10px;padding:8px 12px;border-radius:8px;background:' + (d.done ? '#22c55e18' : 'rgba(255,255,255,0.82)') + ';border:1px solid ' + (d.done ? '#22c55e55' : 'rgba(255,255,255,0.5)') + ';');

            var dateCol = el('div', 'min-width:64px;');
            dateCol.innerHTML = '<div style="font-size:0.78rem;font-weight:600;color:' + (d.done ? '#22c55e' : 'var(--text-primary)') + ';">' + d.dayName + '</div>' +
              '<div style="font-size:0.68rem;color:var(--color-neutral-600);">' + d.dateStr + '</div>';
            dRow.appendChild(dateCol);

            var tasksCol = el('div', 'flex:1;display:flex;flex-direction:column;gap:4px;');
            d.tasks.forEach(function (t) {
              var taskLine = el('div', 'font-size:0.78rem;color:var(--color-neutral-800);');
              taskLine.innerHTML = t.icon + ' ' + (t.code ? '<strong style="color:var(--color-primary);">' + t.code + '</strong> · ' : '') + t.label + ' <span style="color:var(--color-neutral-600);">(' + t.duration + 'min)</span>';
              tasksCol.appendChild(taskLine);
            });
            dRow.appendChild(tasksCol);

            if (d.done) {
              dRow.appendChild(el('span', 'font-size:0.8rem;color:#22c55e;', '✓'));
            }

            daysGrid.appendChild(dRow);
          });
          detail.appendChild(daysGrid);
        }
      } else {
        // Just show focus codes
        var codes = getCodesForWeek(w.week);
        if (codes.length) {
          var codeWrap = el('div', 'display:flex;flex-wrap:wrap;gap:5px;');
          codes.slice(0, 8).forEach(function (code) {
            codeWrap.appendChild(el('span', 'font-size:0.7rem;font-weight:700;padding:2px 8px;border-radius:20px;background:color-mix(in srgb,var(--accent) 12%,transparent);color:var(--accent);', code));
          });
          if (codes.length > 8) codeWrap.appendChild(el('span', 'font-size:0.7rem;color:var(--text-muted);padding:2px 4px;', '+' + (codes.length - 8) + ' more'));
          detail.appendChild(codeWrap);
        }
      }

      weekRow.appendChild(header);
      weekRow.appendChild(detail);
      container.appendChild(weekRow);
    });
  }

  // ── Main render ───────────────────────────────────────────────────────────
  function render() {
    var container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    var wrap = el('div', 'padding:var(--content-padding,24px);max-width:860px;');

    // Page header
    var hdr = el('div', 'margin-bottom:8px;');
    hdr.innerHTML =
      '<h1 style="font-size:1.6rem;font-weight:800;color:var(--text-primary);margin-bottom:4px;">Study Planner</h1>' +
      '<p style="color:var(--color-neutral-700);font-size:0.92rem;margin-bottom:0;">Week-by-week plan built around your target test dates and session data.</p>';
    wrap.appendChild(hdr);

    // Auto-adjustment banners (top of page)
    renderAdjustmentBanners(wrap);

    // Today's card
    var todayWrap = el('div', '');
    todayWrap.id = 'sp-today-wrap';
    renderTodayCard(todayWrap);
    wrap.appendChild(todayWrap);

    // Preferences
    renderPreferences(wrap);

    // Target dates
    renderTargetDates(wrap);

    // Bluebook schedule
    renderBluebookSchedule(wrap);

    // 16-week plan
    wrap.appendChild(section('16-Week Program'));
    var weekSection = el('div', '');
    weekSection.id = 'sp-week-section';
    buildWeekSection(weekSection);
    wrap.appendChild(weekSection);

    container.appendChild(wrap);

    if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  return {
    render: render,
    reset: function () {},
  };

})();
