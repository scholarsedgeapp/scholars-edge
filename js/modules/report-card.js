/* ============================================================
   SCHOLAR'S EDGE — Module 10: Printable Report Card
   Print-optimized progress report. Max 2 pages when printed.
   Trigger: 'Print Progress Report' button on dashboard.
   ============================================================ */

var ReportCardModule = (function () {

  var BAND_LABELS = ['','Foundational','Emerging','Developing','Progressing','Proficient','Advanced','Elite'];

  var SKILL_LABELS = {
    main_idea:      'Main Idea',
    inference:      'Inference',
    grammar:        'Grammar',
    transitions:    'Transitions',
    punctuation:    'Punctuation',
    linear_algebra: 'Linear Algebra',
    advanced_math:  'Advanced Math',
    data_analysis:  'Data Analysis',
  };

  var STRATEGY_SECTIONS = [
    { id:'A', name:'Universal',       codes:['U1','U2','U3','U4','U5','U6','U7'] },
    { id:'B', name:'Reading Elim.',   codes:['R1','R2','R3','R4','R5','R6','R7','R8'] },
    { id:'C', name:'Reading Passage', codes:['R9','R10','R11','R12','R13'] },
    { id:'D', name:'Grammar',         codes:['G1','G2','G3','G4','G5','G6','G7'] },
    { id:'E', name:'Math Core',       codes:['M1','M2','M3','M4','M5','M6','M7','M8','M9'] },
    { id:'F', name:'Desmos',          codes:['M10','M11','M12','M13','M14','M15'] },
    { id:'G', name:'CLT',             codes:['C1','C2','C3','C4'] },
    { id:'H', name:'Mindset',         codes:['MN1','MN2','MN3','MN4','MN5'] },
  ];

  // Journey to Gold band palette — matches design-system.css --band-N vars
  var BAND_BG = ['','#B8D4E8','#74B0D4','#3F8FC4','#2ABFBF','#3CC48A','#7B4FCC','#F4B942'];
  var BAND_TC = ['','#1B2A4A','#1B2A4A','#1B2A4A','#1B2A4A','#1B2A4A','#fff','#1B2A4A'];

  // ── helpers ──────────────────────────────────────────────

  function el(tag, style, text) {
    var e = document.createElement(tag);
    if (style) e.style.cssText = style;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function fmtDate(str) {
    if (!str) return '—';
    try { return new Date(str).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
    catch(e2) { return String(str); }
  }

  function fmtTest(src) {
    var m = {
      bluebook_7:'SAT Practice 7', bluebook_8:'SAT Practice 8',
      bluebook_9:'SAT Practice 9', bluebook_10:'SAT Practice 10',
      clt:'CLT', khan:'Practice Test', other:'Practice Test',
    };
    return m[src] || src || 'Test';
  }

  function secLabel(text) {
    var d = el('div',
      'font-size:0.62rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;' +
      'color:#1B2A4A;padding:3px 0 4px;border-bottom:1.5px solid #1B2A4A;margin-bottom:6px;',
      text);
    return d;
  }

  // ── print CSS (injected once) ────────────────────────────
  function injectPrintCSS() {
    if (document.getElementById('se-report-print-css')) return;
    var s = document.createElement('style');
    s.id = 'se-report-print-css';
    s.textContent =
      '@media print{' +
      '#sidebar,#sidebar-backdrop,#top-bar,#toast-container,#modal-overlay,#loading-overlay' +
      '{display:none!important;}' +
      '#main-content{margin-left:0!important;padding-top:0!important;width:100%!important;}' +
      '#page-container{padding:0!important;}' +
      '.rpt-noprint{display:none!important;}' +
      'body{background:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' +
      '@page{margin:0.5in;size:letter;}' +
      '}';
    document.head.appendChild(s);
  }

  // ── OLS projection (mirrors performance.js) ──────────────
  function computeProjection(imports) {
    if (!imports || imports.length === 0) return null;
    var latest  = imports[imports.length - 1];
    var current = latest.totalScore;
    var slope   = 0;
    if (imports.length >= 2) {
      var n=imports.length, sX=0, sY=0, sXY=0, sXX=0;
      imports.forEach(function(imp,i){sX+=i;sY+=imp.totalScore;sXY+=i*imp.totalScore;sXX+=i*i;});
      slope = (n*sXY - sX*sY) / (n*sXX - sX*sX);
    }
    var td = (Storage.getTargetDates && Storage.getTargetDates()) || {};
    var tStr = td.sat || td.psatNmsqt || td.psat10;
    if (!tStr) return { projected: current, testDate: null };
    var testDate   = new Date(tStr);
    var days       = Math.max(0, Math.round((testDate - Date.now()) / 86400000));
    var avgWks     = 3.5;
    if (imports.length >= 2) {
      var d0 = new Date(imports[0].importedAt || imports[0].date || Date.now());
      var d1 = new Date(latest.importedAt     || latest.date     || Date.now());
      var span = (d1 - d0) / 86400000;
      avgWks = span / (imports.length - 1) / 7;
    }
    var futureUnits = avgWks > 0 ? (days / 7 / avgWks) : 0;
    var projected   = Math.round(Math.min(1600, Math.max(400, current + slope * futureUnits)));
    return { projected: projected, testDate: tStr, daysToTest: days };
  }

  // ── focus recommendations ────────────────────────────────
  function getFocusRecs(bands) {
    var entries = Object.entries(bands).filter(function(b){ return b[1] !== null; });
    entries.sort(function(a,b){ return (a[1]||0)-(b[1]||0); });
    return entries.slice(0,3).map(function(e2) {
      var bNum = e2[1] || 1;
      return {
        label:     SKILL_LABELS[e2[0]] || e2[0],
        bandNum:   bNum,
        bandLabel: BAND_LABELS[bNum]  || 'Band '+bNum,
        next:      BAND_LABELS[Math.min(7, bNum+1)] || 'Elite',
      };
    });
  }

  // ── auto-generated parent summary ────────────────────────
  function buildSummary(imports, bands, progress, proj) {
    var name    = (Storage.getStudentName && Storage.getStudentName()) || 'Krystal';
    var sess    = progress.totalSessions || 0;
    var hrs     = ((progress.totalMinutes||0)/60).toFixed(1);

    if (imports.length === 0) {
      return name + ' has set up their Scholar\'s Edge account and is ready to begin. ' +
        'Once the first Bluebook Practice Test is imported, this report will populate with detailed analytics.';
    }

    var lines = [];
    var base   = imports[0].totalScore;
    var latest = imports[imports.length-1].totalScore;
    var gain   = latest - base;

    lines.push(name + ' has completed ' + sess + ' study session' + (sess !== 1 ? 's' : '') +
      ', logging ' + hrs + ' hours in Scholar\'s Edge.');

    if (imports.length === 1) {
      lines.push('Her baseline Bluebook score is ' + base +
        ' (RW: ' + imports[0].rwScore + ', Math: ' + imports[0].mathScore +
        '). This is the foundation all future improvement is measured against.');
    } else {
      var dir = gain > 0 ? 'improved by ' + gain + ' points' :
                gain < 0 ? 'shifted by ' + Math.abs(gain) + ' points' : 'held steady';
      lines.push('Starting from ' + base + ', she has ' + dir +
        ', bringing her latest score to ' + latest + '.');
    }

    if (proj && proj.projected && proj.testDate) {
      lines.push('Based on her training pace, she is projected to score approximately ' +
        proj.projected + ' by ' + fmtDate(proj.testDate) + '.');
    }

    var bEntries = Object.entries(bands).filter(function(b){ return b[1] !== null; });
    if (bEntries.length > 0) {
      bEntries.sort(function(a,b){ return (b[1]||0)-(a[1]||0); });
      var strongest = SKILL_LABELS[bEntries[0][0]] || bEntries[0][0];
      bEntries.sort(function(a,b){ return (a[1]||0)-(b[1]||0); });
      var focus = SKILL_LABELS[bEntries[0][0]] || bEntries[0][0];
      lines.push('Her strongest area is ' + strongest +
        '. The highest-impact focus for the next two weeks is ' + focus + '.');
    }

    lines.push('Consistent daily practice — even 20 minutes — is the single biggest predictor ' +
      'of score gains on the digital SAT. Keep encouraging her!');

    return lines.join(' ');
  }

  // ── score box helper ─────────────────────────────────────
  function scorebox(lbl, val, sub, accent) {
    var b = el('div','border-radius:5px;padding:7px 9px;background:#f5f5f5;border-top:2.5px solid '+(accent||'#1B2A4A')+';');
    b.appendChild(el('div','font-size:0.58rem;text-transform:uppercase;letter-spacing:0.08em;color:#666;font-weight:700;',lbl));
    b.appendChild(el('div','font-size:1.3rem;font-weight:800;color:#1B2A4A;line-height:1.1;margin:2px 0;',val));
    if (sub) b.appendChild(el('div','font-size:0.63rem;color:#666;',sub));
    return b;
  }

  function stBox(l, v) {
    var b = el('div','background:#f5f5f5;border-radius:4px;padding:5px 7px;text-align:center;');
    b.appendChild(el('div','font-size:0.56rem;text-transform:uppercase;letter-spacing:0.06em;color:#666;font-weight:700;',l));
    b.appendChild(el('div','font-size:0.95rem;font-weight:800;color:#1B2A4A;',v));
    return b;
  }

  // ── MAIN RENDER ──────────────────────────────────────────
  function render() {
    injectPrintCSS();

    var container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    var imports     = (Storage.getImportHistory  && Storage.getImportHistory())  || [];
    var bands       = (Storage.getBands          && Storage.getBands())          || {};
    var gamif       = (Storage.getGamification   && Storage.getGamification())   || {};
    var progress    = (Storage.getPath           && Storage.getPath('progress')) || {};
    var strategies  = (Storage.getPath           && Storage.getPath('strategies'))  || {};
    var trapProfile = (Storage.getPath           && Storage.getPath('trapProfile')) || {};
    var settings    = (Storage.getSettings       && Storage.getSettings())       || {};
    var targetDates = (Storage.getTargetDates    && Storage.getTargetDates())    || {};
    var name        = (Storage.getStudentName    && Storage.getStudentName())    || 'Krystal';

    var latestImp  = imports.length > 0 ? imports[imports.length-1] : null;
    var baseImp    = imports.length > 0 ? imports[0] : null;
    var proj       = computeProjection(imports);
    var focusRecs  = getFocusRecs(bands);
    var summary    = buildSummary(imports, bands, progress, proj);

    var wrap = el('div','padding:24px var(--content-padding,32px);max-width:820px;');

    // ── ACTION BAR (screen-only, hidden in print) ────────
    var bar = el('div','display:flex;justify-content:space-between;align-items:center;' +
      'margin-bottom:20px;padding-bottom:16px;border-bottom:1.5px solid var(--color-neutral-200);');
    bar.className = 'rpt-noprint';

    var barL = el('div');
    barL.appendChild(el('h2','font-size:1.1rem;font-weight:700;color:var(--color-primary);margin:0 0 3px;',
      'Progress Report Card'));
    barL.appendChild(el('p','font-size:0.82rem;color:var(--color-neutral-500);margin:0;',
      'Press Cmd+P (Mac) or Ctrl+P (Win) → Save as PDF to share with parents.'));

    var btnRow = el('div','display:flex;gap:10px;');
    var backBtn  = document.createElement('button');
    backBtn.className = 'btn btn-outline';
    backBtn.textContent = '← Back to Dashboard';
    backBtn.onclick = function() { Router.navigate('/dashboard'); };

    var printBtn = document.createElement('button');
    printBtn.className = 'btn btn-accent';
    printBtn.textContent = '🖨  Print Report';
    printBtn.onclick = function() { window.print(); };

    btnRow.appendChild(backBtn);
    btnRow.appendChild(printBtn);
    bar.appendChild(barL);
    bar.appendChild(btnRow);
    wrap.appendChild(bar);

    // ══════════════════════════════════════════════════════
    // REPORT BODY — everything below this prints
    // ══════════════════════════════════════════════════════
    var rpt = el('div','background:#fff;color:#111;font-size:0.79rem;line-height:1.5;');

    // ── HEADER ──────────────────────────────────────────
    var hdr = el('div','display:flex;justify-content:space-between;align-items:flex-start;' +
      'padding-bottom:10px;border-bottom:2.5px solid #1B2A4A;margin-bottom:14px;');

    var hdrL = el('div');
    var logoRow = el('div','display:flex;align-items:center;gap:8px;margin-bottom:4px;');
    var lMark = el('div','width:30px;height:30px;border-radius:5px;background:#1B2A4A;color:#F4B942;' +
      'font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;','SE');
    var lTxt = el('div');
    lTxt.appendChild(el('div','font-size:0.92rem;font-weight:800;color:#1B2A4A;',"Scholar's Edge"));
    lTxt.appendChild(el('div','font-size:0.65rem;color:#555;letter-spacing:0.06em;','Think Sharp. Score Higher.'));
    logoRow.appendChild(lMark);
    logoRow.appendChild(lTxt);
    hdrL.appendChild(logoRow);
    hdrL.appendChild(el('div','font-size:0.6rem;font-weight:700;text-transform:uppercase;' +
      'letter-spacing:0.1em;color:#888;margin-top:4px;','Progress Report Card'));

    var hdrR = el('div','text-align:right;font-size:0.7rem;color:#444;line-height:1.9;');
    hdrR.innerHTML =
      '<strong>' + name.replace(/</g,'&lt;') + '</strong><br>' +
      'Report Date: ' + fmtDate(new Date().toISOString()) + '<br>' +
      'Tests Imported: ' + imports.length +
      (targetDates.sat ? '<br>Target SAT: ' + fmtDate(targetDates.sat) : '') +
      (settings.emailParent1 ? '<br>Parent: ' + String(settings.emailParent1).replace(/</g,'&lt;') : '');

    hdr.appendChild(hdrL);
    hdr.appendChild(hdrR);
    rpt.appendChild(hdr);

    // ── SCORE SUMMARY (4 boxes) ──────────────────────────
    var scoreRow = el('div','display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px;');

    var latTot = latestImp ? String(latestImp.totalScore) : '—';
    var latRW  = latestImp ? String(latestImp.rwScore)    : '—';
    var latMth = latestImp ? String(latestImp.mathScore)  : '—';

    var gainStr = latestImp && baseImp && imports.length > 1
      ? (function(){ var g=latestImp.totalScore-baseImp.totalScore; return (g>=0?'+':'')+g+' vs baseline'; })()
      : (latestImp ? 'Baseline score' : '—');

    var projVal = (proj && proj.projected) ? String(proj.projected) : '—';
    var projSub = (proj && proj.testDate)  ? 'by '+fmtDate(proj.testDate) : 'Set test date in settings';

    scoreRow.appendChild(scorebox('Latest Total',    latTot, gainStr, '#1B2A4A'));
    scoreRow.appendChild(scorebox('Reading/Writing', latRW,  latestImp ? 'out of 800' : '', '#2ABFBF'));
    scoreRow.appendChild(scorebox('Math',            latMth, latestImp ? 'out of 800' : '', '#F4B942'));
    scoreRow.appendChild(scorebox('Projected',       projVal, projSub, '#7B4FCC'));
    rpt.appendChild(scoreRow);

    // ── SCORE HISTORY TABLE ──────────────────────────────
    if (imports.length > 0) {
      rpt.appendChild(secLabel('Score History'));
      var tbl = document.createElement('table');
      tbl.style.cssText = 'width:100%;border-collapse:collapse;font-size:0.7rem;margin-bottom:12px;';
      tbl.innerHTML =
        '<thead><tr style="background:#1B2A4A;color:#fff;">' +
        '<th style="padding:4px 7px;text-align:left;font-weight:600;">Test</th>' +
        '<th style="padding:4px 7px;text-align:center;">Total</th>' +
        '<th style="padding:4px 7px;text-align:center;">RW</th>' +
        '<th style="padding:4px 7px;text-align:center;">Math</th>' +
        '<th style="padding:4px 7px;text-align:center;">Change</th>' +
        '<th style="padding:4px 7px;text-align:left;">Date</th>' +
        '</tr></thead>';
      var tbody = document.createElement('tbody');
      imports.forEach(function(imp, i) {
        var prev  = i > 0 ? imports[i-1] : null;
        var delta = prev ? (imp.totalScore - prev.totalScore) : null;
        var dStr  = delta === null ? 'Baseline' : (delta >= 0 ? '+' : '') + delta;
        var dClr  = delta === null ? '#888' : (delta >= 0 ? '#2a7d5c' : '#c03030');
        var tr    = document.createElement('tr');
        tr.style.background = i % 2 === 0 ? '#fff' : '#f9f9f9';
        tr.innerHTML =
          '<td style="padding:4px 7px;font-weight:600;color:#1B2A4A;">' + fmtTest(imp.testSource) + '</td>' +
          '<td style="padding:4px 7px;text-align:center;font-weight:700;font-size:0.8rem;">' + imp.totalScore + '</td>' +
          '<td style="padding:4px 7px;text-align:center;">' + imp.rwScore + '</td>' +
          '<td style="padding:4px 7px;text-align:center;">' + imp.mathScore + '</td>' +
          '<td style="padding:4px 7px;text-align:center;font-weight:700;color:' + dClr + ';">' + dStr + '</td>' +
          '<td style="padding:4px 7px;color:#555;">' + fmtDate(imp.importedAt || imp.testDate) + '</td>';
        tbody.appendChild(tr);
      });
      tbl.appendChild(tbody);
      rpt.appendChild(tbl);
    }

    // ── SKILL BAND PROFILE ───────────────────────────────
    var bEntries = Object.entries(bands).filter(function(b){ return b[1] !== null; });
    if (bEntries.length > 0) {
      rpt.appendChild(secLabel('Skill Band Profile'));
      var bandGrid = el('div','display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:12px;');
      bEntries.forEach(function(entry) {
        var bNum = entry[1] || 1;
        var bg   = BAND_BG[bNum] || '#eee';
        var tc   = BAND_TC[bNum] || '#111';
        var cell = el('div','border-radius:4px;padding:5px 7px;background:'+bg+';text-align:center;');
        cell.appendChild(el('div','font-size:0.56rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:'+tc+';margin-bottom:1px;',
          SKILL_LABELS[entry[0]] || entry[0]));
        cell.appendChild(el('div','font-size:0.85rem;font-weight:800;color:'+tc+';','Band '+bNum));
        cell.appendChild(el('div','font-size:0.58rem;color:'+tc+';', BAND_LABELS[bNum] || ''));
        bandGrid.appendChild(cell);
      });
      rpt.appendChild(bandGrid);
    }

    // ── FOCUS RECOMMENDATIONS ────────────────────────────
    if (focusRecs.length > 0) {
      rpt.appendChild(secLabel('Focus Areas — Next 2 Weeks'));
      var focGrid = el('div','display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px;');
      focusRecs.forEach(function(rec, i) {
        var box = el('div','background:#f5f5f5;border-radius:4px;padding:6px 8px;border-left:2.5px solid #1B2A4A;');
        box.appendChild(el('div','font-size:0.56rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#888;margin-bottom:2px;','Priority '+(i+1)));
        box.appendChild(el('div','font-size:0.78rem;font-weight:700;color:#1B2A4A;',rec.label));
        box.appendChild(el('div','font-size:0.65rem;color:#555;',rec.bandLabel+' → '+rec.next));
        focGrid.appendChild(box);
      });
      rpt.appendChild(focGrid);
    }

    // ════════════════════════════════════════════════════════
    // PAGE 2 — Strategy checklist + stats + summary
    // ════════════════════════════════════════════════════════

    // ── STRATEGY MASTERY CHECKLIST ───────────────────────
    rpt.appendChild(secLabel('Strategy Mastery Checklist (54 Strategies)'));

    var stratGrid = el('div','display:grid;grid-template-columns:repeat(3,1fr);gap:1px 10px;margin-bottom:10px;');
    STRATEGY_SECTIONS.forEach(function(sec) {
      var sh = el('div',
        'grid-column:1/-1;font-size:0.56rem;font-weight:700;text-transform:uppercase;' +
        'letter-spacing:0.1em;color:#555;padding:3px 0 2px;border-bottom:1px solid #ddd;margin-top:4px;',
        sec.id + '. ' + sec.name);
      stratGrid.appendChild(sh);

      sec.codes.forEach(function(code) {
        var state  = (strategies[code] && strategies[code].state) || 'not_started';
        var done   = state === 'mastered' || state === 'reviewing';
        var active = state === 'learning';
        var item   = el('div','display:flex;align-items:center;gap:3px;padding:1px 0;');
        var chk    = el('div',
          'width:10px;height:10px;border:1.5px solid '+(done ? '#2a7d5c' : (active ? '#c07000' : '#bbb'))+
          ';border-radius:2px;flex-shrink:0;background:'+
          (done ? '#2a7d5c' : (active ? '#fff8e1' : '#fff'))+
          ';display:flex;align-items:center;justify-content:center;font-size:7px;color:#fff;',
          done ? '✓' : '');
        item.appendChild(chk);
        item.appendChild(el('span','font-size:0.63rem;color:#1B2A4A;font-weight:600;',code));
        stratGrid.appendChild(item);
      });
    });
    rpt.appendChild(stratGrid);

    var legend = el('div','display:flex;gap:14px;margin-bottom:12px;font-size:0.63rem;color:#555;');
    legend.innerHTML =
      '<span style="color:#2a7d5c;font-weight:700;">✓ Mastered / Reviewing</span>' +
      '<span style="color:#c07000;font-weight:700;">◯ Learning</span>' +
      '<span style="color:#bbb;font-weight:700;">□ Not Started</span>';
    rpt.appendChild(legend);

    // ── TRAP SENSITIVITY ─────────────────────────────────
    rpt.appendChild(secLabel('Trap Sensitivity Summary'));
    var trapKeys = Object.keys(trapProfile).filter(function(k){ return (trapProfile[k]||0) > 0; });
    var trapWrap = el('div','margin-bottom:12px;');
    if (trapKeys.length === 0) {
      trapWrap.appendChild(el('p','font-size:0.7rem;color:#777;font-style:italic;margin:0;',
        'Trap profile builds as drills are completed. Complete at least 20 drill sessions to activate.'));
    } else {
      trapKeys.sort(function(a,b){ return (trapProfile[b]||0)-(trapProfile[a]||0); });
      var tGrid = el('div','display:grid;grid-template-columns:repeat(4,1fr);gap:5px;');
      trapKeys.slice(0,4).forEach(function(k) {
        var box = el('div','background:#fff8e1;border-radius:4px;padding:5px 7px;border-left:2px solid #c07000;');
        box.appendChild(el('div','font-size:0.56rem;font-weight:700;color:#78350F;text-transform:uppercase;',k));
        box.appendChild(el('div','font-size:0.88rem;font-weight:800;color:#1B2A4A;',(trapProfile[k]||0)+'×'));
        tGrid.appendChild(box);
      });
      trapWrap.appendChild(tGrid);
    }
    rpt.appendChild(trapWrap);

    // ── TRAINING STATS ───────────────────────────────────
    rpt.appendChild(secLabel('Training Stats'));
    var statsRow = el('div','display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:10px;');
    var hrs = ((progress.totalMinutes||0)/60).toFixed(1);
    statsRow.appendChild(stBox('Hours',       hrs+'h'));
    statsRow.appendChild(stBox('Sessions',    String(progress.totalSessions||0)));
    statsRow.appendChild(stBox('Streak',      (progress.streakDays||0)+' days'));
    statsRow.appendChild(stBox('Best Streak', (progress.longestStreak||progress.streakDays||0)+' days'));
    statsRow.appendChild(stBox('Points',      String(gamif.points||0)));
    rpt.appendChild(statsRow);

    // Badges
    var badgesArr = gamif.badges || [];
    if (badgesArr.length > 0) {
      var badgeRow = el('div','display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;');
      badgesArr.slice(-8).forEach(function(b) {
        var chip = el('div','border:1px solid #ddd;border-radius:3px;padding:2px 7px;font-size:0.63rem;color:#333;background:#fff;');
        chip.textContent = '🏅 ' + (b.name || 'Badge');
        badgeRow.appendChild(chip);
      });
      rpt.appendChild(badgeRow);
    } else {
      var noB = el('p','font-size:0.7rem;color:#888;font-style:italic;margin:0 0 12px;',
        'Badges earned will appear here.');
      rpt.appendChild(noB);
    }

    // ── PARENT SUMMARY ───────────────────────────────────
    rpt.appendChild(secLabel('For Parent / Guardian'));
    var sumBox = el('div','background:#f9f9f9;border-radius:5px;padding:9px 11px;' +
      'border-left:3px solid #2ABFBF;margin-bottom:12px;');
    sumBox.appendChild(el('p','font-size:0.74rem;color:#333;line-height:1.65;margin:0;', summary));
    rpt.appendChild(sumBox);

    // ── FOOTER ───────────────────────────────────────────
    rpt.appendChild(el('hr','border:none;border-top:1px solid #ccc;margin:6px 0;'));
    var footer = el('div','display:flex;justify-content:space-between;font-size:0.6rem;color:#888;padding-top:4px;');
    footer.appendChild(el('span','',"Scholar's Edge · Think Sharp. Score Higher."));
    footer.appendChild(el('span','','Report generated '+fmtDate(new Date().toISOString())));
    rpt.appendChild(footer);

    wrap.appendChild(rpt);
    container.appendChild(wrap);

    if (window.lucide) {
      requestAnimationFrame(function(){
        lucide.createIcons({attrs:{'stroke-width':'1.75'}});
      });
    }
  }

  return { render: render };

})();

window.ReportCardModule = ReportCardModule;
