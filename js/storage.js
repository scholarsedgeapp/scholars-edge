/* ============================================================
   SCHOLAR'S EDGE — Storage Module
   localStorage wrapper with app state schema
   ============================================================ */

const Storage = (() => {
  const NS = 'scholarsedge_'; // namespace prefix

  // ── DEFAULT APP STATE ── //
  const DEFAULT_STATE = {
    student: {
      name: 'Krystal',
      email: '',
      createdAt: null,
    },

    progress: {
      orientationComplete: false,
      orientationCompletedAt: null,
      firstImportComplete: false,
      firstImportDate: null,
      totalMinutes: 0,
      totalSessions: 0,
      streakDays: 0,
      lastSessionDate: null,
      lastSessionDateLocal: null,
      longestStreak: 0,
    },

    // Band assignments per skill area (1–7), seeded by Bluebook import
    bands: {
      main_idea: null,
      inference: null,
      grammar: null,
      transitions: null,
      punctuation: null,
      linear_algebra: null,
      advanced_math: null,
      data_analysis: null,
      // CLT bands added on first CLT import
      clt_tone: null,
      clt_argument: null,
      clt_roots: null,
      clt_allusion: null,
    },

    // Strategy mastery states
    // Values: 'not_started' | 'in_progress' | 'developing' | 'mastered' | 'elite'
    strategyMastery: {
      // Universal
      U1: 'not_started', U2: 'not_started', U3: 'not_started',
      U4: 'not_started', U5: 'not_started', U6: 'not_started', U7: 'not_started',
      // Reading Elimination
      R1: 'not_started', R2: 'not_started', R3: 'not_started', R4: 'not_started',
      R5: 'not_started', R6: 'not_started', R7: 'not_started', R8: 'not_started',
      // Reading Passage
      R9: 'not_started', R10: 'not_started', R11: 'not_started',
      R12: 'not_started', R13: 'not_started',
      // Grammar (G8–G10 added 2026-07-07 — 54-strategy taxonomy)
      G1: 'not_started', G2: 'not_started', G3: 'not_started', G4: 'not_started',
      G5: 'not_started', G6: 'not_started', G7: 'not_started',
      G8: 'not_started', G9: 'not_started', G10: 'not_started',
      // Math Core
      M1: 'not_started', M2: 'not_started', M3: 'not_started', M4: 'not_started',
      M5: 'not_started', M6: 'not_started', M7: 'not_started', M8: 'not_started', M9: 'not_started',
      // Math Desmos
      M10: 'not_started', M11: 'not_started', M12: 'not_started',
      M13: 'not_started', M14: 'not_started', M15: 'not_started',
      // CLT
      C1: 'not_started', C2: 'not_started', C3: 'not_started', C4: 'not_started',
      // Mindset
      MN1: 'not_started', MN2: 'not_started', MN3: 'not_started',
      MN4: 'not_started', MN5: 'not_started',
    },

    // Mastery session history per strategy { code: [{date, accuracy, level}] }
    masteryHistory: {},

    // Trap sensitivity profile — built from AI inference across sessions
    trapProfile: {
      extreme_language: 0,
      recycled_language: 0,
      half_right: 0,
      could_be_true: 0,
      opposite_trap: 0,
      true_but_irrelevant: 0,
      comparison_fallacy: 0,
      scope_trap: 0,
    },

    // Bluebook test imports
    importHistory: [],
    // Structure per import:
    // {
    //   id: uuid,
    //   date: ISO string,
    //   testSource: 'bluebook_7' | 'bluebook_8' | ... | 'clt' | 'khan' | 'other',
    //   totalScore: number,
    //   rwScore: number,
    //   mathScore: number,
    //   wrongAnswers: [...],
    //   bandProfile: {...},
    //   importMethod: 'pdf' | 'screenshot' | 'manual',
    //   notes: string
    // }

    // Drill session history
    sessions: [],
    // Structure per session:
    // {
    //   id: uuid,
    //   date: ISO string,
    //   strategy: string,
    //   questionsAttempted: number,
    //   questionsCorrect: number,
    //   accuracy: number,
    //   durationMinutes: number,
    //   bandLevel: number,
    //   frustrationFlagged: boolean,
    //   aiInferenceCalls: number,
    // }

    // Gamification
    gamification: {
      points: 0,
      level: 'Scholar',
      badges: [],
      // Each badge: { id, name, earnedAt, description }
    },

    // Target test dates
    targetDates: {
      psat10: null,        // ISO date string
      psatNmsqt: null,
      sat: null,
      clt: null,
    },

    // Settings
    settings: {
      emailKrystal: '',
      emailParent1: 'catangayscholarships@gmail.com',
      emailParent2: 'kcatangay@gmail.com',
      emailParent3: '',
      emailParent4: '',
      emailParent5: '',
      dailyReminderTime: '18:00',
      studyDaysPerWeek: 5,
      sessionLengthMinutes: 30,
      emailJsServiceId: '',
      emailJsTemplateId: '',   // universal single template (Module 11)
      notifications: {
        daily_reminder: true,
        bluebook_reminder: true,
        session_encouragement: true,
        score_improvement: true,
        band_movement: true,
        badge_unlocked: true,
        weekly_report: true,
        plateau_detected: true,
        content_gap: true,
        frustration_session: true,
        off_track: true,
        study_plan_compressed: true,
        guarantee_milestone: true,
        trap_profile_update: true,
      },
      // Anthropic API key for AI inference
      anthropicApiKey: '',
      // Strategy Course lesson order: 'fixed' (designed sequence) or
      // 'weakest_first' (sections after Universal ordered by band weakness)
      courseOrder: 'fixed',
      // UI preferences
      sidebarCollapsed: false,
    },

    // Guarantee tracking
    guarantee: {
      startDate: null,
      baselineScore: null,
      hoursLogged: 0,
      sessionsLogged: 0,
      dayNumber: 0,
      status: 'not_started', // 'not_started' | 'active' | 'qualified' | 'extended'
    },

    // Study planner
    planner: {
      weeklyPlan: [],
      currentWeek: null,
      adaptationHistory: [],
    },

    // Plateau detection
    plateaus: [],
    // { skillArea, startDate, resolvedDate, approach, status }

    // Internal flag: first time app is opened
    isFirstTime: true,
  };

  // ── CORE READ/WRITE ── //
  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(NS + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[Storage] Failed to read key:', key, e);
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(NS + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[Storage] Failed to write key:', key, e);
      if (e.name === 'QuotaExceededError') {
        console.error('[Storage] localStorage quota exceeded — consider pruning old session data');
      }
      return false;
    }
  }

  function remove(key) {
    try {
      localStorage.removeItem(NS + key);
      return true;
    } catch (e) {
      return false;
    }
  }

  function clear() {
    // Directly remove the primary key first (works even if key enumeration is restricted)
    localStorage.removeItem(NS + 'state');
    // Then sweep any other namespaced keys
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(NS));
      keys.forEach(k => localStorage.removeItem(k));
    } catch (e) { /* key enumeration blocked in some file:// environments */ }
  }

  // ── APP STATE ── //

  // Deep merge helper
  function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (
        source[key] !== null &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  // Load state — merges saved state over defaults (handles schema upgrades)
  function loadState() {
    const saved = get('state', {});
    return deepMerge(DEFAULT_STATE, saved);
  }

  // Save full state
  function saveState(state) {
    return set('state', state);
  }

  // Get a nested path from state: getPath('progress.orientationComplete')
  function getPath(path, fallback = null) {
    const state = loadState();
    const parts = path.split('.');
    let current = state;
    for (const part of parts) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return fallback;
      }
      current = current[part];
    }
    return current !== undefined ? current : fallback;
  }

  // Set a nested path in state: setPath('progress.orientationComplete', true)
  function setPath(path, value) {
    const state = loadState();
    const parts = path.split('.');
    let current = state;
    for (let i = 0; i < parts.length - 1; i++) {
      if (typeof current[parts[i]] !== 'object' || current[parts[i]] === null) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    return saveState(state);
  }

  // ── SPECIFIC HELPERS ── //

  function isFirstTime() {
    return getPath('isFirstTime', true);
  }

  function markAppOpened() {
    setPath('isFirstTime', false);
    if (!getPath('student.createdAt')) {
      setPath('student.createdAt', new Date().toISOString());
    }
  }

  function getStudentName() {
    return getPath('student.name', 'Krystal');
  }

  function isOrientationComplete() {
    return getPath('progress.orientationComplete', false);
  }

  function isFirstImportComplete() {
    return getPath('progress.firstImportComplete', false);
  }

  function getSettings() {
    return getPath('settings', DEFAULT_STATE.settings);
  }

  function updateSettings(updates) {
    const current = getPath('settings', DEFAULT_STATE.settings);
    const merged = deepMerge(current, updates);
    setPath('settings', merged);
    return merged;
  }

  function getGamification() {
    return getPath('gamification', DEFAULT_STATE.gamification);
  }

  function addPoints(amount) {
    const g = getGamification();
    const newPoints = (g.points || 0) + amount;
    const newLevel = calcLevel(newPoints);
    setPath('gamification.points', newPoints);
    setPath('gamification.level', newLevel);
    return { points: newPoints, level: newLevel };
  }

  function calcLevel(points) {
    if (points >= 5000) return 'Perfect Scholar';
    if (points >= 3000) return 'Elite Scholar';
    if (points >= 1500) return 'Honor Scholar';
    if (points >= 500)  return 'Advanced Scholar';
    return 'Scholar';
  }

  function awardBadge(badgeId, badgeName, description = '') {
    const g = getGamification();
    const already = (g.badges || []).find(b => b.id === badgeId);
    if (already) return false; // Already earned
    const badge = {
      id: badgeId,
      name: badgeName,
      description,
      earnedAt: new Date().toISOString(),
    };
    const badges = [...(g.badges || []), badge];
    setPath('gamification.badges', badges);
    return badge;
  }

  function getImportHistory() {
    return getPath('importHistory', []);
  }

  function addImport(importData) {
    const history = getImportHistory();
    const entry = {
      id: generateId(),
      ...importData,
      importedAt: new Date().toISOString(),
    };
    history.push(entry);
    setPath('importHistory', history);
    return entry;
  }

  function getSessionHistory() {
    return getPath('sessions', []);
  }

  function addSession(sessionData) {
    const sessions = getSessionHistory();
    const entry = {
      id: generateId(),
      ...sessionData,
      date: new Date().toISOString(),
    };
    sessions.push(entry);
    setPath('sessions', sessions);
    // Update progress totals
    const current = getPath('progress', DEFAULT_STATE.progress);
    setPath('progress.totalMinutes', (current.totalMinutes || 0) + (sessionData.durationMinutes || 0));
    setPath('progress.totalSessions', (current.totalSessions || 0) + 1);
    setPath('progress.lastSessionDate', entry.date);
    updateStreak();
    return entry;
  }

  function updateStreak() {
    const today = new Date().toLocaleDateString('en-US');
    const lastLocal = getPath('progress.lastSessionDateLocal');
    if (lastLocal === today) return; // Already logged today
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-US');
    const streak = getPath('progress.streakDays', 0);
    const newStreak = lastLocal === yesterday ? streak + 1 : 1;
    const longest = Math.max(newStreak, getPath('progress.longestStreak', 0));
    setPath('progress.streakDays', newStreak);
    setPath('progress.longestStreak', longest);
    setPath('progress.lastSessionDateLocal', today);
  }

  function getBands() {
    return getPath('bands', DEFAULT_STATE.bands);
  }

  function updateBand(skillArea, bandNumber) {
    setPath(`bands.${skillArea}`, bandNumber);
  }

  function getTrapProfile() {
    return getPath('trapProfile', DEFAULT_STATE.trapProfile);
  }

  function incrementTrap(trapType) {
    const current = getTrapProfile();
    const newCount = (current[trapType] || 0) + 1;
    setPath(`trapProfile.${trapType}`, newCount);
    return newCount;
  }

  function getTargetDates() {
    return getPath('targetDates', DEFAULT_STATE.targetDates);
  }

  function setTargetDate(testKey, dateString) {
    setPath(`targetDates.${testKey}`, dateString);
  }

  function getGuarantee() {
    return getPath('guarantee', DEFAULT_STATE.guarantee);
  }

  function getStrategyMastery() {
    return getPath('strategyMastery', DEFAULT_STATE.strategyMastery);
  }

  function updateStrategyMastery(strategyCode, state) {
    setPath(`strategyMastery.${strategyCode}`, state);
  }

  // ── UTILITY ── //
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function exportData() {
    const state = loadState();
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scholars-edge-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      saveState(data);
      return true;
    } catch (e) {
      console.error('[Storage] Import failed:', e);
      return false;
    }
  }

  // ── STORAGE SIZE ESTIMATE ── //
  function getStorageSize() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(NS));
    let total = 0;
    keys.forEach(k => {
      total += (localStorage.getItem(k) || '').length * 2; // UTF-16 = 2 bytes/char
    });
    return {
      bytes: total,
      kb: (total / 1024).toFixed(1),
      percentUsed: ((total / (5 * 1024 * 1024)) * 100).toFixed(1), // ~5MB limit
    };
  }

  // ── PUBLIC API ── //
  return {
    // Raw
    get, set, remove, clear,
    // State
    loadState, saveState, getPath, setPath,
    // App-specific
    isFirstTime, markAppOpened,
    getStudentName,
    isOrientationComplete, isFirstImportComplete,
    getSettings, updateSettings,
    getGamification, addPoints, awardBadge, calcLevel,
    getImportHistory, addImport,
    getSessionHistory, addSession,
    getBands, updateBand,
    getTrapProfile, incrementTrap,
    getTargetDates, setTargetDate,
    getGuarantee,
    getStrategyMastery, updateStrategyMastery,
    // Utilities
    generateId, exportData, importData, getStorageSize,
    // Expose defaults for reference
    DEFAULT_STATE,
  };
})();

// Make available globally
window.Storage = Storage;
