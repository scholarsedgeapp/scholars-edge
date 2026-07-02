/* ============================================================
   SCHOLAR'S EDGE — Module 11: Notification + Email System
   Platform: EmailJS (free tier) — one universal template
   Sender: scholarsedgetest@gmail.com
   In-app fallback: history feed + toast when EmailJS not configured
   ============================================================ */

var NotificationsModule = (function () {

  // ── notification type registry ───────────────────────────
  var TYPES = {
    daily_reminder:      { label:'Daily Practice Reminder',   to:'student',  icon:'⏰', cooldownHours: 20 },
    test_reminder:       { label:'Bluebook Test Reminder',    to:'all',      icon:'📅', cooldownHours: 24 },
    session_encourage:   { label:'Session Encouragement',     to:'student',  icon:'🎯', cooldownHours: 1  },
    import_reminder:     { label:'Import Reminder',           to:'student',  icon:'📥', cooldownHours: 72 },
    score_improvement:   { label:'Score Improvement Alert',   to:'all',      icon:'📈', cooldownHours: 0  },
    band_movement:       { label:'Band Movement Alert',       to:'all',      icon:'🏆', cooldownHours: 0  },
    badge_unlocked:      { label:'Badge Unlocked',            to:'all',      icon:'🏅', cooldownHours: 0  },
    weekly_report:       { label:'Weekly Progress Report',    to:'all',      icon:'📊', cooldownHours: 144 },
    plateau_detected:    { label:'Plateau Detected',          to:'all',      icon:'⚠️', cooldownHours: 168 },
    content_gap:         { label:'Content Gap Flagged',       to:'parents',  icon:'💡', cooldownHours: 168 },
    frustration_session: { label:'Frustration Session',       to:'parents',  icon:'💙', cooldownHours: 48 },
    off_track:           { label:'Off-Track Alert',           to:'all',      icon:'📉', cooldownHours: 72 },
    study_compressed:    { label:'Study Plan Compressed',     to:'all',      icon:'📋', cooldownHours: 48 },
    guarantee_milestone: { label:'Guarantee Milestone',       to:'all',      icon:'🛡️', cooldownHours: 0  },
    trap_profile:        { label:'Trap Profile Update',       to:'student',  icon:'🎪', cooldownHours: 168 },
  };

  // ── helpers ──────────────────────────────────────────────

  function el(tag, style, text) {
    var e = document.createElement(tag);
    if (style) e.style.cssText = style;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function fmtDate(ts) {
    try {
      return new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
    } catch(e) { return ''; }
  }

  function fmtShortDate(str) {
    if (!str) return '—';
    try { return new Date(str).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}); }
    catch(e) { return str; }
  }

  // ── storage helpers ──────────────────────────────────────

  function getHistory() {
    return Storage.getPath('notifications.history') || [];
  }

  function saveHistory(arr) {
    Storage.setPath('notifications.history', arr.slice(-50)); // keep last 50
  }

  function getToggles() {
    return Storage.getPath('notifications.toggles') || {};
  }

  function getLastSent() {
    return Storage.getPath('notifications.lastSent') || {};
  }

  function isEnabled(type) {
    var t = getToggles();
    return t[type] !== false; // default true
  }

  function cooldownOk(type) {
    var hours = (TYPES[type] && TYPES[type].cooldownHours) || 0;
    if (hours === 0) return true;
    var last = getLastSent()[type];
    if (!last) return true;
    return (Date.now() - last) > (hours * 3600000);
  }

  function markSent(type) {
    var ls = getLastSent();
    ls[type] = Date.now();
    Storage.setPath('notifications.lastSent', ls);
  }

  // ── recipients ───────────────────────────────────────────

  function getRecipients(type) {
    var cfg  = Storage.getSettings();
    var dest = (TYPES[type] && TYPES[type].to) || 'all';
    var list = [];

    if (dest === 'student' || dest === 'all') {
      if (cfg.emailKrystal) list.push({ email: cfg.emailKrystal, name: Storage.getStudentName() || 'Krystal' });
    }
    if (dest === 'parents' || dest === 'all') {
      if (cfg.emailParent1) list.push({ email: cfg.emailParent1, name: 'Parent' });
      if (cfg.emailParent2) list.push({ email: cfg.emailParent2, name: 'Parent' });
      if (cfg.emailParent3) list.push({ email: cfg.emailParent3, name: 'Parent' });
      if (cfg.emailParent4) list.push({ email: cfg.emailParent4, name: 'Parent' });
    }
    // Deduplicate by email
    var seen = {};
    return list.filter(function(r) {
      if (seen[r.email]) return false;
      seen[r.email] = true;
      return true;
    });
  }

  // ── add to in-app history ────────────────────────────────

  function addToHistory(type, subject, message, emailSent) {
    var hist = getHistory();
    hist.push({
      id:        Date.now() + '-' + Math.random().toString(36).slice(2,6),
      type:      type,
      icon:      (TYPES[type] && TYPES[type].icon) || '🔔',
      label:     (TYPES[type] && TYPES[type].label) || type,
      subject:   subject,
      message:   message,
      timestamp: Date.now(),
      read:      false,
      emailSent: emailSent || false,
    });
    saveHistory(hist);
    updateBell();
  }

  // ── bell badge ───────────────────────────────────────────

  function updateBell() {
    var dot  = document.getElementById('notification-dot');
    var unread = getHistory().filter(function(n){ return !n.read; }).length;
    if (dot) {
      dot.style.display = unread > 0 ? 'block' : 'none';
      dot.title = unread + ' unread notification' + (unread !== 1 ? 's' : '');
    }
  }

  // ── in-app banner (when EmailJS not configured) ──────────

  function showBanner(subject, message, typeIcon) {
    UI.toast((typeIcon || '🔔') + ' ' + message, 'info', subject, 6000);
  }

  // ── MAIN SEND FUNCTION ───────────────────────────────────

  function send(type, params) {
    if (!isEnabled(type)) return;
    if (!cooldownOk(type)) return;

    var cfg        = Storage.getSettings();
    var serviceId  = cfg.emailJsServiceId;
    var templateId = cfg.emailJsTemplateId;
    var subject    = params.subject  || ((TYPES[type] && TYPES[type].icon) || '🔔') + ' ' + ((TYPES[type] && TYPES[type].label) || 'Scholar\'s Edge');
    var message    = params.message  || '';
    var studentName = Storage.getStudentName() || 'Krystal';

    addToHistory(type, subject, message, !!(serviceId && templateId));
    markSent(type);

    if (serviceId && templateId && window.emailjs) {
      // Send via EmailJS — one call per recipient
      var recipients = getRecipients(type);
      recipients.forEach(function(r) {
        var templateParams = Object.assign({}, params, {
          to_email:     r.email,
          to_name:      r.name,
          subject:      subject,
          message_text: message,
          student_name: studentName,
          report_date:  new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}),
          app_name:     "Scholar's Edge",
        });
        emailjs.send(serviceId, templateId, templateParams)
          .catch(function(err) {
            console.warn('[Notifications] EmailJS send error:', err);
          });
      });
    } else {
      // In-app fallback
      showBanner(subject, message, TYPES[type] && TYPES[type].icon);
    }
  }

  // ════════════════════════════════════════════════════════
  // TRIGGER CHECKS
  // ════════════════════════════════════════════════════════

  function checkDailyReminder() {
    if (!isEnabled('daily_reminder') || !cooldownOk('daily_reminder')) return;
    var cfg      = Storage.getSettings();
    var time     = cfg.dailyReminderTime || '18:00';
    var now      = new Date();
    var parts    = time.split(':');
    var triggerH = parseInt(parts[0], 10);
    var triggerM = parseInt(parts[1], 10);
    if (now.getHours() < triggerH || (now.getHours() === triggerH && now.getMinutes() < triggerM)) return;

    // Check: no session logged today
    var sessions  = Storage.getSessionHistory ? Storage.getSessionHistory() : [];
    var today     = now.toDateString();
    var practiced = sessions.some(function(s) {
      return s && s.date && new Date(s.date).toDateString() === today;
    });
    if (practiced) return;

    var name = Storage.getStudentName() || 'Krystal';
    send('daily_reminder', {
      subject: '⏰ Time to practice, ' + name + '!',
      message: 'Hey ' + name + '! Your drill queue is waiting — just 20 minutes today keeps your streak alive and your skills sharp. You\'ve got this! 💪',
    });
  }

  function checkImportReminder() {
    if (!isEnabled('import_reminder') || !cooldownOk('import_reminder')) return;
    var history = Storage.getImportHistory ? Storage.getImportHistory() : [];
    if (history.length === 0) return; // never imported — different nudge handled by onboarding
    var last    = history[history.length - 1];
    var lastDate = new Date(last.importedAt || last.testDate || Date.now());
    var daysSince = (Date.now() - lastDate) / 86400000;
    if (daysSince < 14) return;

    var name = Storage.getStudentName() || 'Krystal';
    send('import_reminder', {
      subject: '📥 Time for your next Bluebook test, ' + name,
      message: 'It\'s been ' + Math.floor(daysSince) + ' days since your last Bluebook import. Taking another practice test now will show exactly how much you\'ve improved — and your practice plan is ready. Go get your next score!',
    });
  }

  function checkTestDateReminder() {
    if (!isEnabled('test_reminder') || !cooldownOk('test_reminder')) return;
    var td   = Storage.getTargetDates ? Storage.getTargetDates() : {};
    var name = Storage.getStudentName() || 'Krystal';

    var testLabels = { sat: 'SAT', psatNmsqt: 'PSAT/NMSQT', psat10: 'PSAT 10', act: 'ACT' };
    Object.keys(testLabels).forEach(function(key) {
      if (!td[key]) return;
      var testDate = new Date(td[key]);
      var days     = Math.round((testDate - Date.now()) / 86400000);
      if (days < 0 || days > 3) return;

      send('test_reminder', {
        subject: '📅 ' + testLabels[key] + ' is in ' + days + ' day' + (days !== 1 ? 's' : '') + '!',
        message: days === 0
          ? name + ', today is test day! You\'ve put in the work — trust your preparation. Take a deep breath, read carefully, and show them what Scholar\'s Edge built. You\'re ready.'
          : name + ', your ' + testLabels[key] + ' is in just ' + days + ' day' + (days !== 1 ? 's' : '') + '. Confidence is built — now trust it. Light review today, good sleep tonight.',
      });
    });
  }

  function checkWeeklyReport() {
    if (!isEnabled('weekly_report') || !cooldownOk('weekly_report')) return;
    if (new Date().getDay() !== 0) return; // Sunday only

    var imports  = Storage.getImportHistory ? Storage.getImportHistory() : [];
    var progress = Storage.getPath ? (Storage.getPath('progress') || {}) : {};
    var name     = Storage.getStudentName() || 'Krystal';
    var latest   = imports.length > 0 ? imports[imports.length - 1] : null;

    var scoreStr = latest ? 'Latest score: ' + latest.totalScore + ' (RW ' + latest.rwScore + ' / Math ' + latest.mathScore + ')' : 'No Bluebook score yet.';
    var hoursStr = 'Hours this week: ' + ((progress.totalMinutes || 0) / 60).toFixed(1) + 'h total logged.';
    var sessStr  = 'Total sessions: ' + (progress.totalSessions || 0) + '.';

    send('weekly_report', {
      subject: '📊 ' + name + '\'s Weekly Scholar\'s Edge Report',
      message: 'Weekly update for ' + name + ':\n\n' + scoreStr + '\n' + hoursStr + '\n' + sessStr + '\n\nKeep up the great work — consistency is everything!',
    });
  }

  function checkPlateau() {
    if (!isEnabled('plateau_detected') || !cooldownOk('plateau_detected')) return;
    var bands    = Storage.getBands ? Storage.getBands() : {};
    var sessions = Storage.getSessionHistory ? Storage.getSessionHistory() : [];
    if (sessions.length < 5) return;

    // Check if last band update was 21+ days ago
    var bandLastUpdate = Storage.getPath ? Storage.getPath('bandLastUpdate') : null;
    if (!bandLastUpdate) return;
    var daysSince = (Date.now() - new Date(bandLastUpdate)) / 86400000;
    if (daysSince < 21) return;

    var name = Storage.getStudentName() || 'Krystal';
    send('plateau_detected', {
      subject: '⚠️ Plateau detected — let\'s adjust ' + name + '\'s plan',
      message: 'Heads up: ' + name + ' hasn\'t moved a band in ' + Math.floor(daysSince) + ' days. That\'s normal — it usually means it\'s time to switch focus areas or increase drill intensity. Open Scholar\'s Edge to see the recommended adjustments.',
    });
  }

  function checkOffTrack() {
    if (!isEnabled('off_track') || !cooldownOk('off_track')) return;
    var imports = Storage.getImportHistory ? Storage.getImportHistory() : [];
    if (imports.length < 2) return;

    var td = Storage.getTargetDates ? Storage.getTargetDates() : {};
    if (!td.sat && !td.psatNmsqt && !td.psat10) return;

    // Simple check: if improvement rate < 10 pts per month for 2+ tests
    var recent = imports.slice(-3);
    if (recent.length < 2) return;
    var firstScore = recent[0].totalScore;
    var lastScore  = recent[recent.length - 1].totalScore;
    var d0   = new Date(recent[0].importedAt || recent[0].testDate || Date.now());
    var d1   = new Date(recent[recent.length - 1].importedAt || recent[recent.length - 1].testDate || Date.now());
    var months = Math.max(0.5, (d1 - d0) / 2592000000);
    var ratePerMonth = (lastScore - firstScore) / months;

    if (ratePerMonth >= 10) return; // on track

    var name = Storage.getStudentName() || 'Krystal';
    send('off_track', {
      subject: '📉 Score pace alert for ' + name,
      message: name + '\'s recent improvement rate is ' + Math.round(ratePerMonth) + ' pts/month — below the 10 pts/month pace needed to hit the target score. The most common fix: more focused drill time on the lowest bands. Open Scholar\'s Edge to see the recommended focus areas.',
    });
  }

  function checkStudyCompressed() {
    if (!isEnabled('study_compressed') || !cooldownOk('study_compressed')) return;
    var sessions = Storage.getSessionHistory ? Storage.getSessionHistory() : [];
    if (sessions.length === 0) return;

    // Count consecutive days without a session ending today
    var now      = new Date();
    var missedDays = 0;
    for (var i = 0; i < 7; i++) {
      var checkDate = new Date(now - i * 86400000).toDateString();
      var hadSession = sessions.some(function(s) {
        return s && s.date && new Date(s.date).toDateString() === checkDate;
      });
      if (!hadSession) {
        missedDays++;
      } else {
        break;
      }
    }

    if (missedDays < 3) return;

    var name = Storage.getStudentName() || 'Krystal';
    send('study_compressed', {
      subject: '📋 Study plan update for ' + name + ' (' + missedDays + ' days missed)',
      message: name + ' has missed ' + missedDays + ' consecutive study days. The study plan has been adjusted to catch up without overwhelming — the drill queue has been recalibrated. Encourage her to jump back in today — even 15 minutes reactivates the streak.',
    });
  }

  function checkGuaranteeMilestones() {
    if (!isEnabled('guarantee_milestone') || !cooldownOk('guarantee_milestone')) return;
    var g = Storage.getGuarantee ? Storage.getGuarantee() : {};
    if (!g.startDate) return;

    var dayNumber = Math.floor((Date.now() - new Date(g.startDate)) / 86400000) + 1;
    var hours     = (Storage.getPath ? (Storage.getPath('progress.totalMinutes') || 0) : 0) / 60;
    var name      = Storage.getStudentName() || 'Krystal';

    var milestone = null;
    var milestonesHit = Storage.getPath ? (Storage.getPath('notifications.milestonesHit') || []) : [];

    if (dayNumber >= 45 && !milestonesHit.includes('day45')) {
      milestone = { key: 'day45', label: 'Day 45 of the Scholar\'s Edge Guarantee' };
    } else if (hours >= 20 && !milestonesHit.includes('hours20')) {
      milestone = { key: 'hours20', label: '20 Hours of Practice' };
    } else if (dayNumber >= 90 && !milestonesHit.includes('day90')) {
      milestone = { key: 'day90', label: 'Day 90 — Full Guarantee Cycle Complete!' };
    }

    if (!milestone) return;

    milestonesHit.push(milestone.key);
    Storage.setPath('notifications.milestonesHit', milestonesHit);

    send('guarantee_milestone', {
      subject: '🛡️ Guarantee Milestone: ' + milestone.label,
      message: name + ' has hit a major milestone: ' + milestone.label + '! This is exactly what the Scholar\'s Edge Guarantee is built on — showing up consistently. Keep it going!',
    });
  }

  // ── public trigger check runner ──────────────────────────
  function checkTriggers() {
    try { checkDailyReminder();    } catch(e) { console.warn('[Notifications] checkDailyReminder:', e); }
    try { checkImportReminder();   } catch(e) { console.warn('[Notifications] checkImportReminder:', e); }
    try { checkTestDateReminder(); } catch(e) { console.warn('[Notifications] checkTestDateReminder:', e); }
    try { checkWeeklyReport();     } catch(e) { console.warn('[Notifications] checkWeeklyReport:', e); }
    try { checkPlateau();          } catch(e) { console.warn('[Notifications] checkPlateau:', e); }
    try { checkOffTrack();         } catch(e) { console.warn('[Notifications] checkOffTrack:', e); }
    try { checkStudyCompressed();  } catch(e) { console.warn('[Notifications] checkStudyCompressed:', e); }
    try { checkGuaranteeMilestones(); } catch(e) { console.warn('[Notifications] checkGuaranteeMilestones:', e); }
  }

  // ── event-driven senders ─────────────────────────────────

  function onImportComplete(e) {
    var detail   = (e && e.detail) || {};
    var imports  = Storage.getImportHistory ? Storage.getImportHistory() : [];
    var name     = Storage.getStudentName() || 'Krystal';
    if (imports.length < 2) return; // first import — handled by orientation flow

    var latest   = imports[imports.length - 1];
    var previous = imports[imports.length - 2];

    // Score improvement
    if (latest.totalScore > previous.totalScore && isEnabled('score_improvement')) {
      var gain = latest.totalScore - previous.totalScore;
      var baseline = imports[0].totalScore;
      send('score_improvement', {
        subject: '📈 Score improvement! +' + gain + ' pts for ' + name,
        message: '🎉 ' + name + ' just scored ' + latest.totalScore + ' on ' +
          (detail.testLabel || 'her latest Bluebook test') + ' — that\'s +' + gain +
          ' points from last time! Total improvement from baseline (' + baseline + '): +' +
          (latest.totalScore - baseline) + ' pts. Keep going!',
      });
    }

    // Band movement check
    if (isEnabled('band_movement')) {
      var prevBands = detail.previousBands || {};
      var curBands  = Storage.getBands ? Storage.getBands() : {};
      var movements = [];
      Object.keys(curBands).forEach(function(key) {
        var prev = prevBands[key];
        var cur  = curBands[key];
        if (prev !== null && cur !== null && cur > prev) {
          var skillLabels = {
            main_idea:'Main Idea', inference:'Inference', grammar:'Grammar',
            transitions:'Transitions', punctuation:'Punctuation',
            linear_algebra:'Linear Algebra', advanced_math:'Advanced Math', data_analysis:'Data Analysis',
          };
          var bandNames = ['','Foundational','Emerging','Developing','Progressing','Proficient','Advanced','Elite'];
          movements.push((skillLabels[key] || key) + ': Band ' + prev + ' → Band ' + cur + ' (' + (bandNames[cur] || '') + ')');
        }
      });

      if (movements.length > 0) {
        send('band_movement', {
          subject: '🏆 Band movement alert for ' + name + '!',
          message: name + ' just moved up in ' + movements.length + ' skill area' + (movements.length > 1 ? 's' : '') + ':\n\n' +
            movements.join('\n') + '\n\nEach band jump is measurable progress. Excellent work!',
        });
      }
    }
  }

  function onDrillComplete(e) {
    if (!isEnabled('session_encourage')) return;
    var detail   = (e && e.detail) || {};
    var name     = Storage.getStudentName() || 'Krystal';
    var correct  = detail.correct  || 0;
    var total    = detail.total    || 0;
    var strategy = detail.strategy || '';
    var pct      = total > 0 ? Math.round((correct / total) * 100) : 0;

    var msg;
    if (pct >= 90) {
      msg = '🔥 Outstanding drill session! ' + name + ' got ' + correct + '/' + total + ' correct (' + pct + '%) on ' + (strategy || 'today\'s strategies') + '. That\'s elite-level execution.';
    } else if (pct >= 70) {
      msg = '💪 Solid session! ' + name + ' hit ' + correct + '/' + total + ' (' + pct + '%) on ' + (strategy || 'today\'s drill') + '. The pattern recognition is building — keep going.';
    } else {
      msg = '📚 Good session — ' + name + ' worked through ' + total + ' problems on ' + (strategy || 'today\'s drill') + '. ' + correct + ' correct. Those misses are data, not failure — review the explanations and they\'ll stick.';
    }

    send('session_encourage', {
      subject: '🎯 Session complete: ' + pct + '% accuracy',
      message: msg,
    });
  }

  function onBadgeEarned(e) {
    if (!isEnabled('badge_unlocked')) return;
    var detail = (e && e.detail) || {};
    var name   = Storage.getStudentName() || 'Krystal';
    var badge  = detail.name || 'New Badge';
    var desc   = detail.description || '';

    send('badge_unlocked', {
      subject: '🏅 New badge unlocked: ' + badge,
      message: '🎉 ' + name + ' just earned the "' + badge + '" badge! ' + (desc ? desc + ' ' : '') + 'Badges are tracked against the Scholar\'s Edge Guarantee — this one counts.',
    });
  }

  function onFrustrationSession(e) {
    if (!isEnabled('frustration_session')) return;
    var detail   = (e && e.detail) || {};
    var name     = Storage.getStudentName() || 'Krystal';
    var strategy = detail.strategy || '';

    send('frustration_session', {
      subject: '💙 Tough session today for ' + name,
      message: name + ' had a challenging session today' + (strategy ? ' on ' + strategy : '') + '. That\'s completely normal — hard problems mean she\'s working at the right difficulty level. Tonight: rest. Tomorrow: back to it. The growth happens after the struggle.',
    });
  }

  function onTrapProfileUpdate(e) {
    if (!isEnabled('trap_profile') || !cooldownOk('trap_profile')) return;
    var detail  = (e && e.detail) || {};
    var name    = Storage.getStudentName() || 'Krystal';
    var trap    = detail.trapName || 'a specific trap type';
    var count   = detail.count || 0;

    send('trap_profile', {
      subject: '🎪 Trap profile update: we found ' + name + '\'s #1 trap',
      message: 'The drill engine has detected a dominant trap pattern for ' + name + ': "' + trap + '" has been triggered ' + count + ' times. This is actually great news — named traps are beatable traps. Scholar\'s Edge has now weighted your drill queue to specifically target this pattern.',
    });
  }

  // ════════════════════════════════════════════════════════
  // RENDER — /notifications page
  // ════════════════════════════════════════════════════════

  function render() {
    var container = document.getElementById('page-container');
    if (!container) return;
    container.innerHTML = '';

    var history    = getHistory().slice().reverse(); // newest first
    var toggles    = getToggles();
    var cfg        = Storage.getSettings();
    var emailjsOk  = !!(cfg.emailJsServiceId && cfg.emailJsTemplateId);
    var unread     = history.filter(function(n){ return !n.read; }).length;

    // Mark all as read on open
    var allHist = getHistory();
    allHist.forEach(function(n){ n.read = true; });
    saveHistory(allHist);
    updateBell();

    var wrap = el('div','padding:var(--content-padding,32px);max-width:900px;');

    // ── header ──────────────────────────────────────────
    var hdr = el('div','margin-bottom:24px;');
    var hRow = el('div','display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;');
    var hLeft = el('div','display:flex;align-items:center;gap:10px;');
    hLeft.appendChild(el('h1','font-size:1.5rem;font-weight:800;color:var(--color-primary);margin:0;','Notifications'));
    if (unread > 0) {
      var badge = el('div','background:var(--color-accent);color:var(--color-primary);font-size:0.7rem;' +
        'font-weight:700;border-radius:20px;padding:2px 8px;', unread + ' new');
      hLeft.appendChild(badge);
    }
    hRow.appendChild(hLeft);

    var testBtn = document.createElement('button');
    testBtn.className = 'btn btn-outline btn-sm';
    testBtn.innerHTML = '🧪 Send Test Notification';
    testBtn.onclick = function() {
      send('session_encourage', {
        subject: '🧪 Test Notification — Scholar\'s Edge',
        message: 'If you\'re seeing this email (or in-app banner), your notification system is working correctly! This was a test notification sent from Scholar\'s Edge.',
      });
      UI.toast('Test notification sent!', 'success', 'Sent', 3000);
    };
    hRow.appendChild(testBtn);

    hdr.appendChild(hRow);
    hdr.appendChild(el('p','font-size:0.875rem;color:var(--color-neutral-500);margin:0;',
      'In-app notification history and email settings. Emails send automatically when EmailJS is configured.'));
    wrap.appendChild(hdr);

    // ── layout ───────────────────────────────────────────
    var layout = el('div','display:grid;grid-template-columns:1fr 340px;gap:24px;');
    layout.className = 'notif-layout';

    // ── LEFT: notification history ───────────────────────
    var left = el('div');

    // EmailJS status banner
    var statusCard = el('div','border-radius:10px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:12px;' +
      (emailjsOk
        ? 'background:var(--color-success-50,#f0fdf4);border:1.5px solid var(--color-success,#22c55e);'
        : 'background:var(--color-accent-50,#fffbeb);border:1.5px solid var(--color-accent,#F4B942);'));
    var statusIcon = el('div','font-size:1.4rem;flex-shrink:0;', emailjsOk ? '✅' : '⚙️');
    var statusText = el('div');
    statusText.appendChild(el('div','font-size:0.82rem;font-weight:700;color:var(--color-primary);',
      emailjsOk ? 'EmailJS connected — emails are sending' : 'EmailJS not configured — in-app notifications only'));
    statusText.appendChild(el('div','font-size:0.75rem;color:var(--color-neutral-600);margin-top:2px;',
      emailjsOk
        ? 'Service ID and Template ID are set. Emails will fire on triggers.'
        : 'Add your EmailJS Service ID and Template ID in the EmailJS section to the right to activate email delivery.'));
    statusCard.appendChild(statusIcon);
    statusCard.appendChild(statusText);
    left.appendChild(statusCard);

    // History feed
    var feedHeader = el('div','display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;');
    feedHeader.appendChild(el('h3','font-size:0.8rem;font-weight:700;text-transform:uppercase;' +
      'letter-spacing:0.08em;color:var(--color-neutral-500);margin:0;','Recent Notifications'));
    feedHeader.appendChild(el('span','font-size:0.75rem;color:var(--color-neutral-400);',
      history.length + ' total'));
    left.appendChild(feedHeader);

    if (history.length === 0) {
      var empty = el('div','background:var(--color-white);border:1.5px solid var(--color-neutral-200);' +
        'border-radius:12px;padding:40px;text-align:center;');
      empty.appendChild(el('div','font-size:2.5rem;margin-bottom:12px;','🔔'));
      empty.appendChild(el('div','font-weight:600;color:var(--color-primary);margin-bottom:6px;','No notifications yet'));
      empty.appendChild(el('div','font-size:0.875rem;color:var(--color-neutral-500);',
        'Notifications appear here as Krystal practices, imports tests, and earns achievements.'));
      left.appendChild(empty);
    } else {
      var feed = el('div','display:flex;flex-direction:column;gap:8px;');
      history.slice(0, 30).forEach(function(notif) {
        var card = el('div','background:var(--color-white);border:1.5px solid var(--color-neutral-200);' +
          'border-radius:10px;padding:14px 16px;display:flex;gap:12px;align-items:flex-start;');

        var iconEl = el('div','font-size:1.3rem;flex-shrink:0;line-height:1;margin-top:2px;', notif.icon || '🔔');
        var body = el('div','flex:1;min-width:0;');
        var bRow = el('div','display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px;');

        var titleEl = el('div','font-size:0.82rem;font-weight:700;color:var(--color-primary);', notif.subject || notif.label);
        bRow.appendChild(titleEl);

        var meta = el('div','display:flex;align-items:center;gap:6px;flex-shrink:0;');
        if (notif.emailSent) {
          meta.appendChild(el('span','font-size:0.65rem;background:var(--color-primary-50,#EFF6FF);color:var(--color-primary);' +
            'border-radius:4px;padding:1px 6px;font-weight:600;','📧 emailed'));
        }
        meta.appendChild(el('span','font-size:0.68rem;color:var(--color-neutral-400);',
          fmtDate(notif.timestamp)));
        bRow.appendChild(meta);

        body.appendChild(bRow);
        body.appendChild(el('div','font-size:0.78rem;color:var(--color-neutral-600);line-height:1.5;', notif.message));
        card.appendChild(iconEl);
        card.appendChild(body);
        feed.appendChild(card);
      });
      left.appendChild(feed);
    }

    // ── RIGHT: settings sidebar ──────────────────────────
    var right = el('div','display:flex;flex-direction:column;gap:16px;');

    // EmailJS config card
    var ejsCard = el('div','background:var(--color-white);border:1.5px solid var(--color-neutral-200);border-radius:12px;');
    var ejsHdr = el('div','padding:14px 16px 0;');
    ejsHdr.appendChild(el('h3','font-size:0.9rem;font-weight:700;color:var(--color-primary);margin:0 0 4px;','EmailJS Configuration'));
    ejsHdr.appendChild(el('p','font-size:0.75rem;color:var(--color-neutral-500);margin:0;',
      'See Notes/emailjs-setup.md for step-by-step setup.'));
    ejsCard.appendChild(ejsHdr);

    var ejsBody = el('div','padding:12px 16px 16px;display:flex;flex-direction:column;gap:10px;');

    function settingField(labelText, storageKey, placeholder, type) {
      var group = el('div');
      group.appendChild(el('label','display:block;font-size:0.75rem;font-weight:600;color:var(--color-neutral-600);margin-bottom:4px;', labelText));
      var inp = document.createElement('input');
      inp.type = type || 'text';
      inp.className = 'form-input';
      inp.style.cssText = 'font-size:0.8rem;padding:7px 10px;';
      inp.placeholder = placeholder || '';
      inp.value = (cfg[storageKey] || '');
      inp.onchange = function() {
        var update = {};
        update[storageKey] = this.value;
        Storage.updateSettings(update);
      };
      group.appendChild(inp);
      return group;
    }

    ejsBody.appendChild(settingField('Service ID', 'emailJsServiceId', 'service_xxxxxxx'));
    ejsBody.appendChild(settingField('Template ID', 'emailJsTemplateId', 'template_xxxxxxx'));
    ejsCard.appendChild(ejsBody);
    right.appendChild(ejsCard);

    // Notification toggles
    var togCard = el('div','background:var(--color-white);border:1.5px solid var(--color-neutral-200);border-radius:12px;');
    var togHdr = el('div','padding:14px 16px 10px;');
    togHdr.appendChild(el('h3','font-size:0.9rem;font-weight:700;color:var(--color-primary);margin:0 0 4px;','Notification Settings'));
    togHdr.appendChild(el('p','font-size:0.75rem;color:var(--color-neutral-500);margin:0;',
      'Toggle each type on or off. All enabled by default.'));
    togCard.appendChild(togHdr);

    var togBody = el('div','padding:0 16px 14px;display:flex;flex-direction:column;gap:2px;');
    Object.keys(TYPES).forEach(function(typeKey) {
      var info = TYPES[typeKey];
      var enabled = toggles[typeKey] !== false;
      var row = el('div','display:flex;align-items:center;justify-content:space-between;padding:6px 0;' +
        'border-bottom:1px solid var(--color-neutral-100);');

      var rowLeft = el('div','display:flex;align-items:center;gap:7px;');
      rowLeft.appendChild(el('span','font-size:1rem;', info.icon));
      rowLeft.appendChild(el('span','font-size:0.75rem;color:var(--color-text);', info.label));
      row.appendChild(rowLeft);

      // Toggle switch
      var label = document.createElement('label');
      label.style.cssText = 'display:flex;align-items:center;cursor:pointer;';
      var chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.checked = enabled;
      chk.style.cssText = 'width:16px;height:16px;cursor:pointer;accent-color:var(--color-accent);';
      chk.setAttribute('data-type', typeKey);
      chk.onchange = function() {
        var t = getToggles();
        t[this.getAttribute('data-type')] = this.checked;
        Storage.setPath('notifications.toggles', t);
      };
      label.appendChild(chk);
      row.appendChild(label);
      togBody.appendChild(row);
    });
    togCard.appendChild(togBody);
    right.appendChild(togCard);

    layout.appendChild(left);
    layout.appendChild(right);
    wrap.appendChild(layout);
    container.appendChild(wrap);

    if (window.lucide) {
      requestAnimationFrame(function(){
        lucide.createIcons({attrs:{'stroke-width':'1.75'}});
      });
    }
  }

  // ── INIT ─────────────────────────────────────────────────

  function init() {
    // Wire up event listeners
    document.addEventListener('importComplete',     onImportComplete);
    document.addEventListener('drillComplete',      onDrillComplete);
    document.addEventListener('badgeEarned',        onBadgeEarned);
    document.addEventListener('frustrationSession', onFrustrationSession);
    document.addEventListener('trapProfileUpdate',  onTrapProfileUpdate);

    // Initialize bell
    updateBell();

    // Run time-based checks after a short delay (don't block app boot)
    setTimeout(function() { checkTriggers(); }, 2000);
  }

  // ── PUBLIC API ────────────────────────────────────────────

  return {
    init:          init,
    send:          send,
    checkTriggers: checkTriggers,
    render:        render,
    updateBell:    updateBell,
  };

})();

window.NotificationsModule = NotificationsModule;
