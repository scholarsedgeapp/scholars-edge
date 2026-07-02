/* ============================================================
   SCHOLAR'S EDGE — App Shell
   Main initialization, routing registration, dashboard,
   first-time flow, sidebar, greeting
   ============================================================ */

const App = (() => {

  // ── 1. ROUTE REGISTRATION ── //
  function registerRoutes() {
    // Dashboard — always accessible
    Router.register('/dashboard', {
      title: 'Dashboard',
      navGroup: 'overview',
      render: renderDashboard,
    });

    // Orientation — always accessible
    Router.register('/orientation', {
      title: 'Pre-Test Orientation',
      navGroup: 'getting_started',
      render: renderOrientation,
    });

    // Import Results — accessible after orientation
    Router.register('/import', {
      title: 'Import Results',
      navGroup: 'getting_started',
      requiresOrientation: false, // Karen can import anytime
      render: renderImport,
    });

    // Score Bands — locked until first import
    Router.register('/score-bands', {
      title: 'Score Bands',
      navGroup: 'training',
      requiresImport: true,
      render: renderScoreBands,
    });

    // Strategy Course — locked until first import
    Router.register('/strategy-course', {
      title: 'Strategy Course',
      navGroup: 'training',
      requiresImport: true,
      render: renderStrategyCourse,
    });

    // Drill Engine — locked until first import
    Router.register('/drill-engine', {
      title: 'Drill Engine',
      navGroup: 'training',
      requiresImport: true,
      render: renderDrillEngine,
    });

    // Skills Check — locked until first import
    Router.register('/skills-check', {
      title: 'Skills Check',
      navGroup: 'assessment',
      requiresImport: true,
      render: renderSkillsCheck,
    });

    // Study Planner — always accessible
    Router.register('/study-planner', {
      title: 'Study Planner',
      navGroup: 'assessment',
      render: renderStudyPlanner,
    });

    // Performance Dashboard — lock handled by module itself (shows modal popup)
    Router.register('/performance', {
      title: 'Performance',
      navGroup: 'assessment',
      render: renderPerformance,
    });

    // Report Card — always accessible (shows empty-state when no imports)
    Router.register('/report', {
      title: 'Report Card',
      navGroup: 'assessment',
      render: renderReportCard,
    });

    // Notifications — always accessible
    Router.register('/notifications', {
      title: 'Notifications',
      navGroup: 'account',
      render: renderNotifications,
    });

    // Settings — always accessible
    Router.register('/settings', {
      title: 'Settings',
      navGroup: 'account',
      render: renderSettings,
    });

    // Pricing — always accessible
    Router.register('/pricing', {
      title: 'Pricing',
      navGroup: 'account',
      render: renderPricing,
    });
  }

  // ── 2. SIDEBAR SETUP ── //
  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const backdrop = document.getElementById('sidebar-backdrop');

    if (!sidebar) return;

    // Restore collapsed state
    const settings = Storage.getSettings();
    if (settings.sidebarCollapsed) {
      sidebar.classList.add('collapsed');
      mainContent?.classList.add('sidebar-collapsed');
    }

    // Desktop toggle
    toggleBtn?.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        sidebar.classList.toggle('mobile-open');
        backdrop?.classList.toggle('active');
      } else {
        const collapsed = sidebar.classList.toggle('collapsed');
        mainContent?.classList.toggle('sidebar-collapsed', collapsed);
        Storage.updateSettings({ sidebarCollapsed: collapsed });
      }
    });

    // Backdrop click — close mobile sidebar
    backdrop?.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('active');
    });

    // Close mobile sidebar on route change
    Router.onNavigate(() => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('mobile-open');
        backdrop?.classList.remove('active');
      }
    });

    // Nav item clicks
    document.querySelectorAll('.nav-item[data-route]').forEach(item => {
      item.addEventListener('click', (e) => {
        const route = item.getAttribute('data-route');
        if (item.classList.contains('locked')) {
          UI.modal({
            title: '🔒 Module Locked',
            body: '<p style="color:var(--color-neutral-600);line-height:1.6;">This module unlocks after you import your first Bluebook test result. Upload your PDF score report to get started — it only takes a minute.</p>',
            footer: `
              <button class="btn btn-outline" onclick="UI.closeModal()">Not yet</button>
              <button class="btn btn-primary" onclick="UI.closeModal(); Router.navigate('/import');">
                Upload PDF →
              </button>
            `,
          });
          return;
        }
        Router.navigate(route);
      });

      // Keyboard accessibility
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'menuitem');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });
  }

  // ── 3. TOP BAR SETUP ── //
  function initTopBar() {
    // Populate sidebar student name/avatar from storage
    updateSidebarStudent();

    // Update greeting and streak
    updateTopBarData();

    // Guarantee widget click
    const guaranteeChip = document.querySelector('.topbar-guarantee');
    guaranteeChip?.addEventListener('click', () => {
      UI.modal({
        title: 'The Scholar\'s Edge Guarantee',
        body: UI.guaranteeText(),
        footer: '<button class="btn btn-primary" onclick="UI.closeModal()">Got it</button>',
      });
    });
  }

  function updateSidebarStudent() {
    const name = Storage.getStudentName();
    const nameEl = document.getElementById('student-name-sidebar');
    const avatarEl = document.getElementById('student-avatar');
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
  }

  function updateTopBarData() {
    // Streak
    const streak = Storage.getPath('progress.streakDays', 0);
    const streakEl = document.querySelector('.topbar-streak span:last-child');
    if (streakEl) streakEl.textContent = `${streak} day${streak !== 1 ? 's' : ''}`;

    // Guarantee status
    const g = Storage.getGuarantee();
    const dayNumber = g.startDate
      ? Math.floor((Date.now() - new Date(g.startDate).getTime()) / 86400000) + 1
      : 0;
    const hoursLogged = ((Storage.getPath('progress.totalMinutes', 0)) / 60).toFixed(1);
    const guaranteeEl = document.querySelector('.topbar-guarantee span:last-child');
    if (guaranteeEl && dayNumber > 0) {
      guaranteeEl.textContent = `Day ${dayNumber} · ${hoursLogged}h`;
    }
  }

  // ── 4. FIRST-TIME FLOW ── //
  function checkFirstTimeFlow() {
    if (Storage.isFirstTime()) {
      Storage.markAppOpened();
      // On first visit or after reset: always redirect to orientation regardless of current hash
      Router.navigate('/orientation');
      return true;
    }
    return false;
  }

  // ── 5. GREETING ── //
  function getGreeting() {
    const hour = new Date().getHours();
    const name = Storage.getStudentName();
    if (hour < 12) return `Good morning, ${name} ☀️`;
    if (hour < 17) return `Good afternoon, ${name} 👋`;
    return `Good evening, ${name} 🌙`;
  }

  // ── 6. PAGE RENDERERS ── //
  // Each renderer returns a DOM element or HTML string.
  // Heavy module content will be filled in subsequent build sessions.

  // ──────────────────────────────────────────────
  // DASHBOARD
  // ──────────────────────────────────────────────
  function renderDashboard() {
    const orientationDone = Storage.isOrientationComplete();
    const importDone = Storage.isFirstImportComplete();
    const name = Storage.getStudentName();
    const progress = Storage.getPath('progress');
    const gamification = Storage.getGamification();
    const importHistory = Storage.getImportHistory();
    const latestImport = importHistory.length > 0 ? importHistory[importHistory.length - 1] : null;
    const hoursLogged = ((progress?.totalMinutes || 0) / 60).toFixed(1);
    const streak = progress?.streakDays || 0;

    const div = document.createElement('div');
    div.className = 'animate-fade-in';

    // ── First-time flow: show onboarding hero ──
    if (!orientationDone) {
      div.innerHTML = `
        <div class="onboarding-hero">
          <div class="hero-eyebrow">Welcome to Scholar's Edge</div>
          <h1>Think Sharp. Score Higher.</h1>
          <p>
            Your personalized SAT prep system starts here, ${name}. In the next 10 minutes
            you'll complete a quick orientation and then take your first Bluebook practice test —
            the foundation of your entire prep plan.
          </p>
          <div class="hero-actions">
            <button class="btn btn-accent btn-xl" onclick="Router.navigate('/orientation')">
              <i data-lucide="play-circle" style="width:20px;height:20px;"></i>
              Start Orientation
            </button>
            <button class="btn btn-outline text-white" style="border-color:rgba(255,255,255,0.3);"
              onclick="Router.navigate('/import')">
              Already took a test? Import results →
            </button>
          </div>
        </div>

        <div class="grid-3 stagger-children">
          ${stepCard('1', 'Complete Orientation', 'Learn how Bluebook works before taking the test.', '/orientation', 'compass', false)}
          ${stepCard('2', 'Take SAT Practice 7', 'Your true baseline. In Bluebook: Full-Length Practice → SAT → SAT Practice 7.', '/orientation', 'external-link', true)}
          ${stepCard('3', 'Import Your Results', 'Your Scholar\'s Edge plan builds instantly from your scores.', '/import', 'upload-cloud', true)}
        </div>

        <div class="card card-body mt-6">
          <div style="text-align:center;padding:var(--space-8) 0;">
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
              letter-spacing:var(--ls-widest);color:var(--color-teal);margin-bottom:var(--space-3);">
              Why this order matters
            </div>
            <h3 style="color:var(--color-primary);margin-bottom:var(--space-4);">Your baseline is everything</h3>
            <p style="color:var(--color-neutral-500);max-width:560px;margin:0 auto;line-height:var(--lh-relaxed);">
              Scholar's Edge is built around your actual data — not averages, not assumptions.
              SAT Practice 7 gives you a College Board-scored, undeniable starting point.
              Everything in this app — your drill queue, your strategy order, your projected score —
              flows from that number.
            </p>
          </div>
        </div>
      `;
      return div;
    }

    // ── Post-import dashboard ──
    div.innerHTML = `
      <div class="page-header-row">
        <div class="page-header" style="margin-bottom:0;">
          <h1 id="dashboard-greeting">${getGreeting()}</h1>
          <p class="page-subtitle">
            ${latestImport
              ? `Last test: ${formatTestLabel(latestImport.testSource)} — ${latestImport.totalScore} total`
              : 'Keep building. Every session moves the needle.'}
          </p>
        </div>
        <div class="d-flex gap-3">
          <button class="btn btn-ghost" onclick="Router.navigate('/report')"
            style="font-size:var(--text-sm);"
            title="Print Progress Report">
            <i data-lucide="printer" style="width:16px;height:16px;"></i>
            Print Report
          </button>
          <button class="btn btn-outline" onclick="Router.navigate('/import')">
            <i data-lucide="upload-cloud" style="width:16px;height:16px;"></i>
            Import Results
          </button>
          <button class="btn btn-accent" onclick="Router.navigate('/drill-engine')">
            <i data-lucide="zap" style="width:16px;height:16px;"></i>
            Start Drilling
          </button>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid-4 mt-8 stagger-children">
        <div class="stat-card">
          <div class="stat-icon accent"><i data-lucide="target" style="width:24px;height:24px;"></i></div>
          <div class="stat-body">
            <div class="stat-value">${latestImport ? latestImport.totalScore : '—'}</div>
            <div class="stat-label">Latest Score</div>
            ${latestImport && importHistory.length > 1
              ? `<div class="stat-change up">+${latestImport.totalScore - importHistory[importHistory.length - 2].totalScore} pts</div>`
              : '<div class="stat-change" style="color:var(--color-neutral-400);">Baseline</div>'}
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon teal"><i data-lucide="clock" style="width:24px;height:24px;"></i></div>
          <div class="stat-body">
            <div class="stat-value">${hoursLogged}h</div>
            <div class="stat-label">Hours Practiced</div>
            <div class="stat-change ${parseFloat(hoursLogged) >= 1 ? 'up' : ''}">${progress?.totalSessions || 0} sessions</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success"><i data-lucide="flame" style="width:24px;height:24px;"></i></div>
          <div class="stat-body">
            <div class="stat-value">${streak}</div>
            <div class="stat-label">Day Streak</div>
            <div class="stat-change ${streak > 0 ? 'up' : ''}">${streak > 0 ? 'Keep going!' : 'Start today'}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon primary"><i data-lucide="award" style="width:24px;height:24px;"></i></div>
          <div class="stat-body">
            <div class="stat-value">${gamification.points || 0}</div>
            <div class="stat-label">Points</div>
            <div class="stat-change">${gamification.level || 'Scholar'}</div>
          </div>
        </div>
      </div>

      <!-- Main Content Row -->
      <div class="layout-main-aside mt-8">
        <div>
          <!-- Score Trend Placeholder -->
          <div class="card mb-6">
            <div class="card-header">
              <h3>Score Progress</h3>
              <span class="badge badge-teal">Bluebook Only</span>
            </div>
            <div class="card-body">
              ${importHistory.length >= 2
                ? `<canvas id="score-chart" height="220"></canvas>`
                : `<div class="empty-state" style="padding:var(--space-8);">
                    <div class="empty-state-icon"><i data-lucide="line-chart" style="width:32px;height:32px;"></i></div>
                    <h3>Score trend builds here</h3>
                    <p>Complete Bluebook Test 8 to see your improvement line.</p>
                  </div>`}
            </div>
          </div>

          <!-- Band Profile Placeholder -->
          <div class="card">
            <div class="card-header">
              <h3>Skill Band Profile</h3>
              <button class="btn btn-sm btn-ghost" onclick="Router.navigate('/score-bands')">
                View Details →
              </button>
            </div>
            <div class="card-body" id="band-profile-container">
              <!-- Rendered by refreshBandProfile() -->
            </div>
          </div>
        </div>

        <!-- Sidebar widgets -->
        <div>
          <!-- Next action card -->
          <div class="card card-body mb-5" id="next-action-card">
            <!-- Rendered by renderNextAction() -->
          </div>

          <!-- Guarantee widget -->
          <div id="guarantee-widget-container" class="mb-5"></div>

          <!-- Recent badges -->
          <div class="card card-body">
            <div style="font-size:var(--text-sm);font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-4);">
              Recent Badges
            </div>
            <div id="recent-badges-container" style="display:flex;flex-wrap:wrap;gap:var(--space-3);">
            </div>
          </div>
        </div>
      </div>
    `;

    // Deferred renders (after DOM is in place)
    requestAnimationFrame(() => {
      renderBandProfile();
      renderNextAction();
      const gwContainer = document.getElementById('guarantee-widget-container');
      if (gwContainer) gwContainer.appendChild(UI.guaranteeWidget());
      renderRecentBadges();
      if (importHistory.length >= 2) initScoreChart(importHistory);
      if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
    });

    return div;
  }

  function stepCard(num, title, desc, route, icon, locked) {
    return `
      <div class="card card-interactive ${locked ? 'opacity-50' : ''}"
        onclick="${locked ? "UI.toast('Complete Orientation first.','info','Step Required',3000)" : `Router.navigate('${route}')`}"
        style="${locked ? 'cursor:default;' : ''}">
        <div class="card-body d-flex gap-4 items-start">
          <div style="width:40px;height:40px;border-radius:var(--radius-lg);background:var(--color-primary-50);
            display:flex;align-items:center;justify-content:center;color:var(--color-primary);flex-shrink:0;">
            <i data-lucide="${icon}" style="width:20px;height:20px;"></i>
          </div>
          <div>
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--color-neutral-400);
              margin-bottom:var(--space-1);">Step ${num}</div>
            <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-1);">${title}</div>
            <div style="font-size:var(--text-sm);color:var(--color-neutral-500);">${desc}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderBandProfile() {
    const container = document.getElementById('band-profile-container');
    if (!container) return;
    const bands = Storage.getBands();
    const hasAnyBand = Object.values(bands).some(v => v !== null);

    if (!hasAnyBand) {
      container.appendChild(UI.emptyState({
        icon: 'bar-chart-2',
        title: 'Band profile builds after import',
        message: 'Import SAT Practice 7 to see your skill-by-skill band breakdown.',
      }));
      return;
    }

    const skillLabels = {
      main_idea: 'Main Idea',
      inference: 'Inference',
      grammar: 'Grammar',
      transitions: 'Transitions',
      punctuation: 'Punctuation',
      linear_algebra: 'Linear Algebra',
      advanced_math: 'Advanced Math',
      data_analysis: 'Data Analysis',
    };

    Object.entries(skillLabels).forEach(([key, label]) => {
      if (bands[key] !== null) {
        container.appendChild(UI.bandBar(label, bands[key]));
      }
    });
  }

  function renderNextAction() {
    const container = document.getElementById('next-action-card');
    if (!container) return;

    const orientationDone = Storage.isOrientationComplete();
    const importDone = Storage.isFirstImportComplete();
    const sessions = Storage.getSessionHistory();
    const lastSession = sessions[sessions.length - 1];
    const today = new Date().toLocaleDateString('en-US');
    const practicedToday = lastSession && new Date(lastSession.date).toLocaleDateString('en-US') === today;

    let action;
    if (!orientationDone) {
      action = {
        icon: 'compass',
        label: 'Your first move',
        title: 'Complete Orientation',
        desc: '~30 minutes. Sets up everything.',
        btnLabel: 'Start →',
        btnRoute: '/orientation',
        btnClass: 'btn-accent',
      };
    } else if (!importDone) {
      action = {
        icon: 'upload-cloud',
        label: 'Next step',
        title: 'Import SAT Practice 7',
        desc: 'Your results unlock the full app.',
        btnLabel: 'Import Now →',
        btnRoute: '/import',
        btnClass: 'btn-accent',
      };
    } else if (!practicedToday) {
      action = {
        icon: 'zap',
        label: 'Today\'s drill',
        title: 'Practice Session',
        desc: 'Your drill queue is ready. 20–30 minutes.',
        btnLabel: 'Start Drilling →',
        btnRoute: '/drill-engine',
        btnClass: 'btn-teal',
      };
    } else {
      action = {
        icon: 'check-circle',
        label: 'All good for today',
        title: 'Session logged ✅',
        desc: 'Come back tomorrow to keep your streak.',
        btnLabel: 'View Performance',
        btnRoute: '/performance',
        btnClass: 'btn-outline',
      };
    }

    container.innerHTML = `
      <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
        letter-spacing:var(--ls-wider);color:var(--color-teal);margin-bottom:var(--space-3);">
        ${action.label}
      </div>
      <div class="d-flex gap-3 items-start mb-4">
        <div style="width:36px;height:36px;border-radius:var(--radius-md);background:var(--color-accent-50);
          display:flex;align-items:center;justify-content:center;color:var(--color-accent-600);flex-shrink:0;">
          <i data-lucide="${action.icon}" style="width:18px;height:18px;"></i>
        </div>
        <div>
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);">${action.title}</div>
          <div style="font-size:var(--text-sm);color:var(--color-neutral-500);margin-top:2px;">${action.desc}</div>
        </div>
      </div>
      <button class="btn ${action.btnClass} btn-block" onclick="Router.navigate('${action.btnRoute}')">
        ${action.btnLabel}
      </button>
    `;
  }

  function renderRecentBadges() {
    const container = document.getElementById('recent-badges-container');
    if (!container) return;
    const { badges } = Storage.getGamification();
    if (!badges || badges.length === 0) {
      container.innerHTML = `
        <div style="font-size:var(--text-sm);color:var(--color-neutral-400);">
          Your badges will appear here as you earn them.
        </div>`;
      return;
    }
    const recent = badges.slice(-6).reverse();
    recent.forEach(badge => {
      const el = document.createElement('div');
      el.className = 'achievement-badge earned';
      el.title = badge.description || badge.name;
      el.innerHTML = `
        <div class="achievement-badge-icon">🏅</div>
        <div class="achievement-badge-name">${UI.escapeHtml(badge.name)}</div>
      `;
      container.appendChild(el);
    });
  }

  function initScoreChart(importHistory) {
    const canvas = document.getElementById('score-chart');
    if (!canvas || !window.Chart) return;
    const labels = importHistory.map(i => formatTestLabel(i.testSource));
    const total = importHistory.map(i => i.totalScore);
    const rw = importHistory.map(i => i.rwScore);
    const math = importHistory.map(i => i.mathScore);

    new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total',
            data: total,
            borderColor: '#1B2A4A',
            backgroundColor: 'rgba(27,42,74,0.08)',
            borderWidth: 2.5,
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Reading/Writing',
            data: rw,
            borderColor: '#2ABFBF',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            borderDash: [5, 3],
          },
          {
            label: 'Math',
            data: math,
            borderColor: '#F4B942',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            borderDash: [5, 3],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'top', labels: { font: { family: 'Inter', size: 12 } } },
        },
        scales: {
          y: {
            min: 400,
            max: 1600,
            ticks: { font: { family: 'Inter', size: 11 } },
            grid: { color: 'rgba(0,0,0,0.04)' },
          },
          x: {
            ticks: { font: { family: 'Inter', size: 11 } },
            grid: { display: false },
          },
        },
      },
    });
  }

  // ──────────────────────────────────────────────
  // ORIENTATION (Module 2)
  // ──────────────────────────────────────────────
  function renderOrientation() {
    return OrientationModule.render();
  }

  // ──────────────────────────────────────────────
  // IMPORT (Module 3 — stub)
  // ──────────────────────────────────────────────
  function renderImport() {
    return ImportModule.render();
  }

  // ──────────────────────────────────────────────
  // SCORE BANDS (Module 4)
  // ──────────────────────────────────────────────
  function renderScoreBands() {
    return ScoreBandsModule.render();
  }

  // ──────────────────────────────────────────────
  // STRATEGY COURSE (Module 5 — stub)
  // ──────────────────────────────────────────────
  function renderStrategyCourse() {
    StrategyCourseModule.render();
  }

  // ──────────────────────────────────────────────
  // DRILL ENGINE (Module 6)
  // ──────────────────────────────────────────────
  function renderDrillEngine() {
    DrillEngineModule.render();
  }

  // ──────────────────────────────────────────────
  // SKILLS CHECK (Module 7)
  // ──────────────────────────────────────────────
  function renderSkillsCheck() {
    SkillsCheckModule.render();
  }

  // ──────────────────────────────────────────────
  // STUDY PLANNER (Module 8)
  // ──────────────────────────────────────────────
  function renderStudyPlanner() {
    StudyPlannerModule.render();
  }

  // ──────────────────────────────────────────────
  // PERFORMANCE (Module 9)
  // ──────────────────────────────────────────────
  function renderPerformance() {
    PerformanceDashboardModule.render();
  }

  // ──────────────────────────────────────────────
  // REPORT CARD (Module 10)
  // ──────────────────────────────────────────────
  function renderReportCard() {
    ReportCardModule.render();
  }

  // ──────────────────────────────────────────────
  // NOTIFICATIONS (Module 11)
  // ──────────────────────────────────────────────
  function renderNotifications() {
    NotificationsModule.render();
  }

  // ──────────────────────────────────────────────
  // SETTINGS
  // ──────────────────────────────────────────────
  function renderSettings() {
    const settings = Storage.getSettings();
    const div = document.createElement('div');
    div.className = 'animate-fade-in';
    div.innerHTML = `
      <div class="page-header">
        <h1>Settings</h1>
        <p class="page-subtitle">Email notifications, API configuration, and account preferences.</p>
      </div>

      <div class="layout-main-aside">
        <div>
          <!-- Student Info -->
          <div class="card mb-6">
            <div class="card-header"><h3>Student Information</h3></div>
            <div class="card-body">
              <div class="form-group">
                <label class="form-label">Student Name</label>
                <input type="text" class="form-input" id="setting-name"
                  value="${UI.escapeHtml(Storage.getStudentName())}">
              </div>
              <div class="form-group">
                <label class="form-label">Student Email</label>
                <input type="email" class="form-input" id="setting-email-krystal"
                  placeholder="krystal@example.com"
                  value="${UI.escapeHtml(settings.emailKrystal || '')}">
              </div>
            </div>
          </div>

          <!-- Parent Emails -->
          <div class="card mb-6">
            <div class="card-header"><h3>Parent / Guardian Emails</h3></div>
            <div class="card-body">
              ${emailField('Parent 1', 'emailParent1', settings.emailParent1)}
              ${emailField('Parent 2', 'emailParent2', settings.emailParent2)}
              ${emailField('Additional 1', 'emailParent3', settings.emailParent3)}
              ${emailField('Additional 2', 'emailParent4', settings.emailParent4)}
            </div>
          </div>

          <!-- EmailJS -->
          <div class="card mb-6">
            <div class="card-header"><h3>EmailJS Configuration</h3></div>
            <div class="card-body">
              <div class="form-group">
                <label class="form-label">EmailJS Service ID</label>
                <input type="text" class="form-input" id="setting-emailjs-service"
                  placeholder="service_xxxxxxx"
                  value="${UI.escapeHtml(settings.emailJsServiceId || '')}">
              </div>
              <div class="form-group">
                <label class="form-label">EmailJS Template ID</label>
                <input type="text" class="form-input" id="setting-emailjs-template"
                  placeholder="template_xxxxxxx"
                  value="${UI.escapeHtml(settings.emailJsTemplateId || '')}">
                <div class="form-hint">One universal template. See Notes/emailjs-setup.md for the template fields to configure.</div>
              </div>
              <div class="alert alert-info">
                <i data-lucide="info" class="alert-icon"></i>
                <div class="alert-body">
                  <div class="alert-title">Setup instructions</div>
                  <div class="alert-desc">
                    Create a free account at emailjs.com using scholarsedgetest@gmail.com.
                    Follow the step-by-step guide in Notes/emailjs-setup.md.
                    Once configured, all 15 notification types will send automatically.
                  </div>
                </div>
              </div>
              <button class="btn btn-outline btn-sm mt-4" onclick="Router.navigate('/notifications')"
                style="margin-top:12px;">
                <i data-lucide="bell" style="width:14px;height:14px;"></i>
                Manage Notification Settings →
              </button>
            </div>
          </div>

          <!-- Data Management -->
          <div class="card mb-6">
            <div class="card-header"><h3>Data Management</h3></div>
            <div class="card-body">
              <input type="file" id="restore-backup-input" accept=".json" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;" onchange="(function(e){var f=e.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(ev){var ok=Storage.importData(ev.target.result);if(ok){UI.toast('Backup restored! Reloading...','success','Restore Complete',3000);setTimeout(function(){location.reload();},2000);}else{UI.toast('Could not read that file. Make sure it\'s a Scholar\'s Edge backup.','error','Restore Failed');}};r.readAsText(f);})(event)">
              <div class="d-flex gap-3 flex-wrap">
                <button class="btn btn-outline" onclick="Storage.exportData()">
                  <i data-lucide="download" style="width:16px;height:16px;"></i>
                  Export Backup
                </button>
                <label for="restore-backup-input" class="btn btn-outline" style="cursor:pointer;margin:0;">
                  <i data-lucide="upload" style="width:16px;height:16px;"></i>
                  Restore Backup
                </label>
                <button class="btn btn-ghost text-error"
                  onclick="UI.confirm({title:'Reset App',message:'This permanently deletes all your progress, scores, and settings. This cannot be undone.',confirmText:'Yes, Reset Everything',danger:true}).then(ok=>{if(ok){Storage.clear();try{localStorage.clear();}catch(e){}location.reload();}})">
                  <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
                  Reset App
                </button>
              </div>
              <div class="form-hint mt-3">
                Storage used: ${Storage.getStorageSize().kb} KB
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div style="display:flex;justify-content:flex-end;padding-bottom:var(--space-6);">
            <button class="btn btn-primary" onclick="saveSettingsAll()">
              <i data-lucide="save" style="width:16px;height:16px;"></i>
              Save Settings
            </button>
          </div>
        </div>

        <!-- Sidebar -->
        <div>
          <div class="card card-body mb-5">
            <div style="font-size:var(--text-sm);font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-4);">
              Study Preferences
            </div>
            <div class="form-group">
              <label class="form-label">Study days/week</label>
              <select class="form-select"
                onchange="Storage.updateSettings({studyDaysPerWeek:parseInt(this.value)}); UI.toast('Study preference saved.', 'success', '', 1500);">
                ${[3,4,5,6,7].map(d => `<option value="${d}" ${settings.studyDaysPerWeek === d ? 'selected' : ''}>${d} days</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Session length</label>
              <select class="form-select"
                onchange="Storage.updateSettings({sessionLengthMinutes:parseInt(this.value)}); UI.toast('Study preference saved.', 'success', '', 1500);">
                ${[10,20,30,45].map(m => `<option value="${m}" ${settings.sessionLengthMinutes === m ? 'selected' : ''}>${m} minutes</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Daily reminder time</label>
              <input type="time" class="form-input"
                value="${settings.dailyReminderTime || '18:00'}"
                onchange="Storage.updateSettings({dailyReminderTime:this.value}); UI.toast('Study preference saved.', 'success', '', 1500);">
            </div>
          </div>
        </div>
      </div>
    `;
    return div;
  }

  function emailField(label, key, value) {
    return `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <input type="email" class="form-input" id="setting-${key}"
          placeholder="email@example.com"
          value="${UI.escapeHtml(value || '')}">
      </div>
    `;
  }

  // ──────────────────────────────────────────────
  // PRICING (Module 12)
  // ──────────────────────────────────────────────
  function renderPricing() {
    var div = document.createElement('div');
    div.className = 'animate-fade-in';
    div.style.paddingBottom = 'var(--space-16)';
    div.innerHTML = `

      <!-- ── PAGE HEADER ── -->
      <div style="text-align:center;padding:var(--space-8) var(--content-padding) var(--space-6);">
        <div style="display:inline-flex;align-items:center;gap:var(--space-2);background:var(--color-teal-100,#e6f7f7);
          color:var(--color-teal);border-radius:var(--radius-full);padding:var(--space-1) var(--space-4);
          font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
          letter-spacing:var(--ls-widest);margin-bottom:var(--space-4);">
          <i data-lucide="gem" style="width:13px;height:13px;"></i>
          Scholar's Edge Plans
        </div>
        <h1 style="color:var(--color-primary);margin-bottom:var(--space-3);">Invest in a Higher Score</h1>
        <p style="color:var(--color-neutral-600);max-width:540px;margin:0 auto;line-height:var(--lh-relaxed);">
          Built for CC homeschool families who are serious about SAT prep.
          Every plan includes the full app — AI drill engine, 51 strategies, score band tracking, and parent notifications.
        </p>
      </div>

      <!-- ── BILLING COMING SOON BANNER ── -->
      <div style="max-width:900px;margin:0 auto var(--space-8);padding:0 var(--content-padding);">
        <div style="display:flex;align-items:center;gap:var(--space-3);background:#FFF8E7;border:1px solid var(--color-accent);
          border-radius:var(--radius-lg);padding:var(--space-3) var(--space-5);">
          <i data-lucide="clock" style="width:16px;height:16px;color:var(--color-accent);flex-shrink:0;"></i>
          <div style="flex:1;">
            <span style="font-weight:var(--fw-semibold);color:var(--color-primary);font-size:var(--text-sm);">
              Billing Coming Soon
            </span>
            <span style="color:var(--color-neutral-600);font-size:var(--text-sm);margin-left:var(--space-2);">
              Currently in personal use mode for Krystal. Stripe integration is ready — subscription billing activates when we open to the CC homeschool community.
            </span>
          </div>
        </div>
      </div>

      <!-- ── THREE PRICING CARDS ── -->
      <div style="max-width:900px;margin:0 auto;padding:20px var(--content-padding) 0;
        display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--space-5);" id="pricing-cards-grid">

        <!-- FREE TRIAL -->
        <div class="card card-body" style="border:2px solid var(--color-neutral-200);display:flex;flex-direction:column;">
          <div style="margin-bottom:var(--space-2);">
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
              letter-spacing:var(--ls-widest);color:var(--color-teal);margin-bottom:var(--space-3);">
              Get Started
            </div>
            <div style="font-size:var(--text-xl);font-weight:var(--fw-bold);color:var(--color-primary);">Free Trial</div>
          </div>
          <div style="margin-bottom:var(--space-5);">
            <span style="font-size:var(--text-4xl);font-weight:900;color:var(--color-primary);line-height:1;">$0</span>
            <div style="font-size:var(--text-sm);color:var(--color-neutral-500);margin-top:var(--space-1);">for 7 days</div>
          </div>
          <ul style="list-style:none;margin-bottom:var(--space-6);display:flex;flex-direction:column;gap:var(--space-3);flex:1;">
            ${_pricingFeature('Full access to every feature')}
            ${_pricingFeature('All 51 strategies unlocked')}
            ${_pricingFeature('AI Drill Engine active')}
            ${_pricingFeature('Score bands + performance charts')}
            ${_pricingFeature('Parent email notifications')}
            ${_pricingFeature('No credit card required', 'var(--color-teal)')}
          </ul>
          <div style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-3) 0;
            border-top:1px solid var(--color-neutral-100);margin-bottom:var(--space-4);
            font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--color-teal);">
            <i data-lucide="shield-check" style="width:13px;height:13px;"></i>
            90-Day Progress Guarantee included
          </div>
          <button class="btn btn-outline btn-block" disabled
            style="opacity:0.65;cursor:not-allowed;font-size:var(--text-sm);">
            Start Free Trial — Coming Soon
          </button>
          <div style="text-align:center;margin-top:var(--space-2);font-size:var(--text-xs);color:var(--color-neutral-400);">
            No credit card required
          </div>
        </div>

        <!-- MONTHLY -->
        <div class="card card-body" style="border:2px solid var(--color-neutral-200);display:flex;flex-direction:column;">
          <div style="margin-bottom:var(--space-2);">
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
              letter-spacing:var(--ls-widest);color:var(--color-neutral-500);margin-bottom:var(--space-3);">
              Monthly
            </div>
            <div style="font-size:var(--text-xl);font-weight:var(--fw-bold);color:var(--color-primary);">Monthly Plan</div>
          </div>
          <div style="margin-bottom:var(--space-5);">
            <span style="font-size:var(--text-4xl);font-weight:900;color:var(--color-primary);line-height:1;">$49</span>
            <span style="font-size:var(--text-sm);color:var(--color-neutral-500);">/month</span>
            <div style="font-size:var(--text-xs);color:var(--color-neutral-400);margin-top:var(--space-1);">Cancel anytime</div>
          </div>
          <ul style="list-style:none;margin-bottom:var(--space-6);display:flex;flex-direction:column;gap:var(--space-3);flex:1;">
            ${_pricingFeature('Everything in Free Trial')}
            ${_pricingFeature('Unlimited Bluebook imports')}
            ${_pricingFeature('Printable progress report card')}
            ${_pricingFeature('90-day Progress Guarantee')}
            ${_pricingFeature('Priority support at launch')}
            ${_pricingFeature('Cancel anytime — no lock-in')}
          </ul>
          <div style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-3) 0;
            border-top:1px solid var(--color-neutral-100);margin-bottom:var(--space-4);
            font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--color-teal);">
            <i data-lucide="shield-check" style="width:13px;height:13px;"></i>
            90-Day Progress Guarantee included
          </div>
          <button class="btn btn-primary btn-block" disabled
            style="opacity:0.65;cursor:not-allowed;font-size:var(--text-sm);">
            Start Free Trial — Coming Soon
          </button>
          <div style="text-align:center;margin-top:var(--space-2);font-size:var(--text-xs);color:var(--color-neutral-400);">
            7-day free trial · no credit card required
          </div>
        </div>

        <!-- ANNUAL — FEATURED -->
        <div style="display:flex;flex-direction:column;">
          <!-- Best Value badge: sits above the card in normal flow, overlaps via negative margin -->
          <div style="text-align:center;position:relative;z-index:2;margin-bottom:-14px;">
            <span style="display:inline-block;background:var(--color-accent);color:#1B2A4A;
              font-size:var(--text-xs);font-weight:var(--fw-bold);
              padding:var(--space-1) var(--space-4);border-radius:var(--radius-full);white-space:nowrap;
              box-shadow:0 1px 4px rgba(0,0,0,0.15);">
              ⭐ Best Value — Save $108/year
            </span>
          </div>
          <div class="card card-body" style="border:2px solid var(--color-accent);display:flex;flex-direction:column;flex:1;">
          <div style="margin-bottom:var(--space-2);margin-top:var(--space-3);">
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
              letter-spacing:var(--ls-widest);color:var(--color-accent);margin-bottom:var(--space-3);">
              Annual
            </div>
            <div style="font-size:var(--text-xl);font-weight:var(--fw-bold);color:var(--color-primary);">Annual Plan</div>
          </div>
          <div style="margin-bottom:var(--space-5);">
            <span style="font-size:var(--text-4xl);font-weight:900;color:var(--color-primary);line-height:1;">$39.99</span>
            <span style="font-size:var(--text-sm);color:var(--color-neutral-500);">/month</span>
            <div style="font-size:var(--text-xs);color:var(--color-neutral-500);margin-top:var(--space-1);">
              $479.88 billed annually
              <span style="color:var(--color-success);font-weight:var(--fw-semibold);margin-left:4px;">Save $108</span>
            </div>
          </div>
          <ul style="list-style:none;margin-bottom:var(--space-6);display:flex;flex-direction:column;gap:var(--space-3);flex:1;">
            ${_pricingFeature('Everything in Monthly', 'var(--color-accent)')}
            ${_pricingFeature('Full PSAT + SAT journey covered', 'var(--color-accent)')}
            ${_pricingFeature('Lock in founding member pricing', 'var(--color-accent)')}
            ${_pricingFeature('Best value for full prep cycle', 'var(--color-accent)')}
            ${_pricingFeature('Priority support at launch', 'var(--color-accent)')}
            ${_pricingFeature('90-day Progress Guarantee', 'var(--color-accent)')}
          </ul>
          <div style="display:flex;align-items:center;gap:var(--space-2);padding:var(--space-3) 0;
            border-top:1px solid rgba(244,185,66,0.3);margin-bottom:var(--space-4);
            font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--color-accent);">
            <i data-lucide="shield-check" style="width:13px;height:13px;"></i>
            90-Day Progress Guarantee included
          </div>
          <button class="btn btn-accent btn-block" disabled
            style="opacity:0.75;cursor:not-allowed;font-size:var(--text-sm);">
            Start Free Trial — Coming Soon
          </button>
          <div style="text-align:center;margin-top:var(--space-2);font-size:var(--text-xs);color:var(--color-neutral-400);">
            7-day free trial · no credit card required
          </div>
          </div><!-- /card card-body -->
        </div><!-- /annual wrapper -->

      </div><!-- /pricing-cards-grid -->

      <!-- Annual value statement -->
      <div style="max-width:560px;margin:var(--space-5) auto;padding:0 var(--content-padding);
        text-align:center;font-size:var(--text-sm);color:var(--color-neutral-500);
        font-style:italic;line-height:var(--lh-relaxed);">
        "Serious students commit to the full prep cycle. The annual plan covers your entire PSAT and SAT
        journey — from baseline through test day — without interruption.
        Most students who hit their score goals are on the annual plan."
      </div>

      <!-- ── SIBLING DISCOUNT ── -->
      <div style="max-width:900px;margin:var(--space-10) auto 0;padding:0 var(--content-padding);">
        <div style="background:linear-gradient(135deg,#1B2A4A 0%,#2A3F6B 100%);border-radius:var(--radius-xl);
          padding:var(--space-8) var(--space-8);color:#fff;position:relative;overflow:hidden;">

          <!-- Decorative gold accent bar -->
          <div style="position:absolute;top:0;left:0;right:0;height:4px;
            background:linear-gradient(90deg,var(--color-accent) 0%,var(--color-teal) 100%);"></div>

          <div style="display:flex;align-items:flex-start;gap:var(--space-6);">
            <div style="font-size:2.5rem;line-height:1;flex-shrink:0;">👨‍👩‍👧‍👦</div>
            <div style="flex:1;">
              <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
                letter-spacing:var(--ls-widest);color:var(--color-accent);margin-bottom:var(--space-2);">
                Sibling Discount
              </div>
              <h3 style="color:#fff;margin-bottom:var(--space-2);font-size:var(--text-xl);">
                Homeschool families prep together.
              </h3>
              <p style="color:rgba(255,255,255,0.75);line-height:var(--lh-relaxed);
                font-size:var(--text-sm);margin-bottom:var(--space-5);max-width:540px;">
                Every sibling after the first gets 50% off — forever. Same full app, same AI engine,
                same guarantee. Because prep should be a family win, not a family budget crisis.
              </p>
              <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;margin-bottom:var(--space-5);">
                <div style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
                  border-radius:var(--radius-lg);padding:var(--space-4) var(--space-5);">
                  <div style="font-size:var(--text-xs);color:rgba(255,255,255,0.6);
                    text-transform:uppercase;letter-spacing:var(--ls-widest);margin-bottom:var(--space-1);">
                    Monthly · Per Sibling
                  </div>
                  <div style="display:flex;align-items:baseline;gap:var(--space-1);">
                    <span style="font-size:var(--text-2xl);font-weight:900;color:#fff;">$24.50</span>
                    <span style="font-size:var(--text-sm);color:rgba(255,255,255,0.6);">/month</span>
                  </div>
                  <div style="font-size:var(--text-xs);color:var(--color-accent);margin-top:2px;">
                    50% off $49/month
                  </div>
                </div>
                <div style="background:rgba(244,185,66,0.15);border:1px solid rgba(244,185,66,0.4);
                  border-radius:var(--radius-lg);padding:var(--space-4) var(--space-5);">
                  <div style="font-size:var(--text-xs);color:rgba(255,255,255,0.6);
                    text-transform:uppercase;letter-spacing:var(--ls-widest);margin-bottom:var(--space-1);">
                    Annual · Per Sibling
                  </div>
                  <div style="display:flex;align-items:baseline;gap:var(--space-1);">
                    <span style="font-size:var(--text-2xl);font-weight:900;color:var(--color-accent);">$239.94</span>
                    <span style="font-size:var(--text-sm);color:rgba(255,255,255,0.6);">/year</span>
                  </div>
                  <div style="font-size:var(--text-xs);color:var(--color-accent);margin-top:2px;">
                    50% off $479.88/year
                  </div>
                </div>
              </div>
              <div style="display:inline-flex;align-items:center;gap:var(--space-2);
                background:rgba(255,255,255,0.08);border-radius:var(--radius-lg);
                padding:var(--space-2) var(--space-4);font-size:var(--text-xs);color:rgba(255,255,255,0.7);">
                <i data-lucide="layout-dashboard" style="width:13px;height:13px;color:var(--color-accent);"></i>
                Family Dashboard coming soon — see all your children's progress in one place.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── FEATURE COMPARISON ── -->
      <div style="max-width:900px;margin:var(--space-12) auto 0;padding:0 var(--content-padding);">
        <div style="text-align:center;margin-bottom:var(--space-8);">
          <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
            letter-spacing:var(--ls-widest);color:var(--color-teal);margin-bottom:var(--space-3);">
            Why Scholar's Edge
          </div>
          <h2 style="color:var(--color-primary);">Not all SAT prep is equal.</h2>
        </div>
        <div class="card" style="overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;font-size:var(--text-sm);">
            <thead>
              <tr style="background:var(--color-primary);">
                <th style="padding:var(--space-4) var(--space-6);text-align:left;
                  color:rgba(255,255,255,0.7);font-weight:var(--fw-semibold);width:45%;">Feature</th>
                <th style="padding:var(--space-4) var(--space-4);text-align:center;
                  color:var(--color-accent);font-weight:var(--fw-bold);">Scholar's Edge</th>
                <th style="padding:var(--space-4) var(--space-4);text-align:center;
                  color:rgba(255,255,255,0.5);font-weight:var(--fw-semibold);">Generic SAT Prep</th>
              </tr>
            </thead>
            <tbody>
              ${_comparisonRow('Adapts to your actual Bluebook test results', true, false)}
              ${_comparisonRow('51 categorized strategies (not just tips)', true, false)}
              ${_comparisonRow('Skill Band Engine — identifies your exact gaps', true, false)}
              ${_comparisonRow('AI drill engine that diagnoses why you\'re missing questions', true, false)}
              ${_comparisonRow('Trap profile — knows your personal test-taking blindspots', true, false)}
              ${_comparisonRow('Parent email notifications with real data', true, false)}
              ${_comparisonRow('Progress Guarantee — College Board verified', true, false)}
              ${_comparisonRow('Printable report card for parents', true, false)}
              ${_comparisonRow('Built for CC homeschool families', true, false)}
              ${_comparisonRow('Practice questions', true, true)}
              ${_comparisonRow('Study schedule', true, true)}
              ${_comparisonRow('Score tracking', true, true)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── PROGRESS GUARANTEE ── -->
      <div style="max-width:900px;margin:var(--space-12) auto 0;padding:0 var(--content-padding);">
        <div class="card card-body" style="border:2px solid var(--color-teal);">

          <!-- Header -->
          <div style="text-align:center;margin-bottom:var(--space-6);">
            <div style="font-size:2.8rem;margin-bottom:var(--space-3);">🛡️</div>
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
              letter-spacing:var(--ls-widest);color:var(--color-teal);margin-bottom:var(--space-3);">
              The Scholar's Edge Progress Guarantee
            </div>
            <h2 style="color:var(--color-primary);margin-bottom:var(--space-4);">
              Measurable improvement. College Board proven.
            </h2>
            <p style="color:var(--color-neutral-600);max-width:600px;margin:0 auto;
              line-height:var(--lh-relaxed);font-size:var(--text-sm);">
              Take a real College Board practice test on day one. Log 20 hours within 90 days.
              We guarantee measurable improvement in your CB-scored results — or we extend your
              subscription free until you do. <strong>No fine print. No impossible conditions.</strong>
            </p>
          </div>

          <!-- Tiered improvement table -->
          <div style="overflow:hidden;border-radius:var(--radius-lg);border:1px solid var(--color-neutral-200);
            max-width:560px;margin:0 auto var(--space-5);">
            <table style="width:100%;border-collapse:collapse;font-size:var(--text-sm);">
              <thead>
                <tr style="background:var(--color-neutral-100);">
                  <th style="padding:var(--space-3) var(--space-5);text-align:left;
                    font-weight:var(--fw-semibold);color:var(--color-neutral-600);">Starting Score</th>
                  <th style="padding:var(--space-3) var(--space-5);text-align:center;
                    font-weight:var(--fw-semibold);color:var(--color-neutral-600);">Guaranteed in 90 Days</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-top:1px solid var(--color-neutral-200);">
                  <td style="padding:var(--space-3) var(--space-5);color:var(--color-text);">Below 1000</td>
                  <td style="padding:var(--space-3);text-align:center;">
                    <span style="background:#E6F7F7;color:var(--color-teal);font-weight:var(--fw-bold);
                      padding:2px 12px;border-radius:var(--radius-full);">+100 points</span>
                  </td>
                </tr>
                <tr style="border-top:1px solid var(--color-neutral-200);background:var(--color-neutral-50);">
                  <td style="padding:var(--space-3) var(--space-5);color:var(--color-text);">1000 – 1200</td>
                  <td style="padding:var(--space-3);text-align:center;">
                    <span style="background:#E6F7F7;color:var(--color-teal);font-weight:var(--fw-bold);
                      padding:2px 12px;border-radius:var(--radius-full);">+80 points</span>
                  </td>
                </tr>
                <tr style="border-top:1px solid var(--color-neutral-200);">
                  <td style="padding:var(--space-3) var(--space-5);color:var(--color-text);">1200 – 1400</td>
                  <td style="padding:var(--space-3);text-align:center;">
                    <span style="background:#E6F7F7;color:var(--color-teal);font-weight:var(--fw-bold);
                      padding:2px 12px;border-radius:var(--radius-full);">+60 points</span>
                  </td>
                </tr>
                <tr style="border-top:1px solid var(--color-neutral-200);background:var(--color-neutral-50);">
                  <td style="padding:var(--space-3) var(--space-5);color:var(--color-text);">1400+</td>
                  <td style="padding:var(--space-3);text-align:center;">
                    <span style="background:#FFF8E7;color:var(--color-accent);font-weight:var(--fw-bold);
                      padding:2px 12px;border-radius:var(--radius-full);">+40 points</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Requirements summary row -->
          <div style="display:flex;justify-content:center;gap:var(--space-6);flex-wrap:wrap;
            margin-bottom:var(--space-5);">
            <div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);color:var(--color-neutral-600);">
              <i data-lucide="check-circle" style="width:14px;height:14px;color:var(--color-success);"></i>
              Complete baseline CB test on Day 1
            </div>
            <div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);color:var(--color-neutral-600);">
              <i data-lucide="check-circle" style="width:14px;height:14px;color:var(--color-success);"></i>
              Log 20+ hours within 90 days
            </div>
            <div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--text-xs);color:var(--color-neutral-600);">
              <i data-lucide="check-circle" style="width:14px;height:14px;color:var(--color-success);"></i>
              Take CB-scored test at 90-day mark
            </div>
          </div>

          <!-- See full terms link -->
          <div style="text-align:center;">
            <a href="#" onclick="return false;" style="font-size:var(--text-sm);color:var(--color-teal);
              text-decoration:underline;cursor:pointer;" title="Full guarantee terms — coming soon">
              See full guarantee terms →
            </a>
            <span style="font-size:var(--text-xs);color:var(--color-neutral-400);margin-left:var(--space-2);">
              (full terms page coming soon)
            </span>
          </div>

        </div>
      </div>

      <!-- ── TESTIMONIAL PLACEHOLDER ── -->
      <div style="max-width:900px;margin:var(--space-10) auto 0;padding:0 var(--content-padding);">
        <div style="text-align:center;margin-bottom:var(--space-6);">
          <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
            letter-spacing:var(--ls-widest);color:var(--color-neutral-400);margin-bottom:var(--space-3);">
            Student Results
          </div>
          <h3 style="color:var(--color-neutral-400);">Results from real students will appear here.</h3>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-5);">
          ${[1,2,3].map(() => `
            <div class="card card-body" style="border:2px dashed var(--color-neutral-200);text-align:center;">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--color-neutral-100);
                margin:0 auto var(--space-3);"></div>
              <div style="height:12px;background:var(--color-neutral-100);border-radius:var(--radius-sm);
                margin-bottom:var(--space-2);"></div>
              <div style="height:12px;background:var(--color-neutral-100);border-radius:var(--radius-sm);
                width:80%;margin:0 auto var(--space-2);"></div>
              <div style="height:12px;background:var(--color-neutral-100);border-radius:var(--radius-sm);
                width:60%;margin:0 auto;"></div>
              <div style="margin-top:var(--space-4);font-size:var(--text-xs);color:var(--color-neutral-300);">
                Testimonial placeholder
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ── BOTTOM CTA ROW ── -->
      <div style="max-width:900px;margin:var(--space-10) auto 0;padding:0 var(--content-padding);text-align:center;">
        <div style="background:var(--color-primary);border-radius:var(--radius-xl);
          padding:var(--space-8) var(--space-8);color:#fff;">
          <div style="font-size:var(--text-4xl);margin-bottom:var(--space-4);">🎯</div>
          <h3 style="color:#fff;margin-bottom:var(--space-3);">Ready when you are.</h3>
          <p style="color:rgba(255,255,255,0.7);max-width:480px;margin:0 auto var(--space-6);
            line-height:var(--lh-relaxed);font-size:var(--text-sm);">
            Start your free 7-day trial when billing goes live. No credit card, full access,
            and the Progress Guarantee starts the moment you import your first Bluebook test.
          </p>
          <button class="btn btn-accent" disabled style="opacity:0.7;cursor:not-allowed;font-size:var(--text-sm);">
            <i data-lucide="lock" style="width:14px;height:14px;"></i>
            Start Free Trial — Billing Coming Soon
          </button>
          <div style="margin-top:var(--space-3);font-size:var(--text-xs);color:rgba(255,255,255,0.4);">
            Stripe integration ready · activates when we open to CC homeschool families
          </div>
        </div>
      </div>

    `;

    lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
    return div;
  }

  function _pricingFeature(text, checkColor) {
    return `
      <li style="display:flex;gap:var(--space-2);align-items:flex-start;font-size:var(--text-sm);">
        <i data-lucide="check" style="width:15px;height:15px;color:${checkColor || 'var(--color-success)'};flex-shrink:0;margin-top:2px;"></i>
        <span style="color:var(--color-text);">${text}</span>
      </li>
    `;
  }

  function _comparisonRow(feature, seHas, genericHas) {
    var seCell = seHas
      ? `<i data-lucide="check-circle" style="width:18px;height:18px;color:var(--color-success);"></i>`
      : `<i data-lucide="x-circle" style="width:18px;height:18px;color:var(--color-neutral-300);"></i>`;
    var genCell = genericHas
      ? `<i data-lucide="check-circle" style="width:18px;height:18px;color:var(--color-neutral-400);"></i>`
      : `<i data-lucide="x-circle" style="width:18px;height:18px;color:var(--color-neutral-300);"></i>`;
    return `
      <tr style="border-top:1px solid var(--color-neutral-100);">
        <td style="padding:var(--space-3) var(--space-6);color:var(--color-text);font-size:var(--text-sm);">${feature}</td>
        <td style="padding:var(--space-3);text-align:center;">${seCell}</td>
        <td style="padding:var(--space-3);text-align:center;">${genCell}</td>
      </tr>
    `;
  }

  // ── 7. UTILITIES ── //
  function formatTestLabel(source) {
    const labels = {
      bluebook_7: 'SAT Practice 7',
      bluebook_8: 'SAT Practice 8',
      bluebook_9: 'SAT Practice 9',
      bluebook_10: 'SAT Practice 10',
      clt: 'CLT',
      khan: 'Practice Test',
      other: 'Practice Test',
    };
    return labels[source] || source || 'Test';
  }

  // ── 8. INIT ── //
  function init() {
    // Register all routes
    registerRoutes();

    // Init sidebar behavior
    initSidebar();

    // Init top bar
    initTopBar();

    // Update lock states based on current progress
    Router.refreshLockStates();

    // Check first-time flow
    const redirected = checkFirstTimeFlow();
    if (!redirected) {
      // Normal init — start router
      Router.init();
    } else {
      // First-time user gets redirected to orientation
      Router.init();
    }

    // Init notification system
    NotificationsModule.init();

    // Listen for orientation/import completion to refresh lock states
    document.addEventListener('orientationComplete', () => {
      Router.refreshLockStates();
      updateTopBarData();
    });

    document.addEventListener('importComplete', (e) => {
      Router.refreshLockStates();
      updateTopBarData();
      // Award Baseline Set badge
      const badge = Storage.awardBadge('baseline_set', 'Baseline Set', 'Imported first Bluebook test results');
      if (badge) {
        Storage.addPoints(100);
        UI.toast('🎯 Badge earned: Baseline Set! Your journey officially starts now.', 'success', 'Achievement!', 6000);
        // Fire badge notification
        document.dispatchEvent(new CustomEvent('badgeEarned', {
          detail: { name: 'Baseline Set', description: 'Imported first Bluebook test results.' }
        }));
      }
    });

    console.log('[App] Scholar\'s Edge initialized. Student:', Storage.getStudentName());
  }

  // ── PUBLIC API ── //
  return { init, formatTestLabel, getGreeting };
})();

// Boot the app
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

window.App = App;

// ── SETTINGS SAVE HANDLER (global, called by Save Settings button) ── //
window.saveSettingsAll = function() {
  var nameEl  = document.getElementById('setting-name');
  var name    = nameEl ? nameEl.value : undefined;
  var ekrEl   = document.getElementById('setting-email-krystal');
  var ekr     = ekrEl ? ekrEl.value : undefined;
  var svcEl   = document.getElementById('setting-emailjs-service');
  var svcId   = svcEl ? svcEl.value : undefined;
  var tplEl   = document.getElementById('setting-emailjs-template');
  var tplId   = tplEl ? tplEl.value : undefined;
  var ep1El   = document.getElementById('setting-emailParent1');
  var ep1     = ep1El ? ep1El.value : undefined;
  var ep2El   = document.getElementById('setting-emailParent2');
  var ep2     = ep2El ? ep2El.value : undefined;
  var ep3El   = document.getElementById('setting-emailParent3');
  var ep3     = ep3El ? ep3El.value : undefined;
  var ep4El   = document.getElementById('setting-emailParent4');
  var ep4     = ep4El ? ep4El.value : undefined;

  console.log('[Settings] saving name:', name, '| nameEl found:', !!nameEl);

  if (name !== undefined) Storage.setPath('student.name', name);

  var updateObj = {};
  if (ekr     !== undefined) updateObj.emailKrystal      = ekr;
  if (svcId   !== undefined) updateObj.emailJsServiceId  = svcId;
  if (tplId   !== undefined) updateObj.emailJsTemplateId = tplId;
  if (ep1     !== undefined) updateObj.emailParent1      = ep1;
  if (ep2     !== undefined) updateObj.emailParent2      = ep2;
  if (ep3     !== undefined) updateObj.emailParent3      = ep3;
  if (ep4     !== undefined) updateObj.emailParent4      = ep4;
  if (Object.keys(updateObj).length) Storage.updateSettings(updateObj);

  var savedName = Storage.getStudentName();
  console.log('[Settings] readback after save:', savedName);

  // Live-patch greeting and sidebar student name
  var greetingEl = document.getElementById('dashboard-greeting');
  if (greetingEl) greetingEl.textContent = App.getGreeting();
  var sidebarNameEl = document.getElementById('student-name-sidebar');
  if (sidebarNameEl) sidebarNameEl.textContent = savedName;
  var sidebarAvatarEl = document.getElementById('student-avatar');
  if (sidebarAvatarEl && savedName) sidebarAvatarEl.textContent = savedName.charAt(0).toUpperCase();

  UI.toast('Saved ✔ Name: ' + savedName, 'success', 'Settings', 3000);
};
