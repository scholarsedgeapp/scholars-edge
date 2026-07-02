/* ============================================================
   SCHOLAR'S EDGE — Module 2: Pre-Test Orientation
   Interactive 6-section orientation before Bluebook Test 7.
   CRITICAL RULE: ZERO strategies taught here. Test mechanics only.
   ============================================================ */

const OrientationModule = (() => {

  // ── SECTION DEFINITIONS ── //
  const SECTIONS = [
    {
      id: 'what-is-sat',
      title: 'What Is the Digital SAT?',
      subtitle: 'Section 1 of 6',
      duration: '5 min',
      icon: 'book-open',
      render: renderSection1,
    },
    {
      id: 'how-bluebook-works',
      title: 'How Bluebook Works',
      subtitle: 'Section 2 of 6',
      duration: '5 min',
      icon: 'monitor',
      render: renderSection2,
    },
    {
      id: 'test-format',
      title: 'Test Format Overview',
      subtitle: 'Section 3 of 6',
      duration: '5 min',
      icon: 'layout',
      render: renderSection3,
    },
    {
      id: 'three-rules',
      title: 'Three Rules Only',
      subtitle: 'Section 4 of 6',
      duration: '5 min',
      icon: 'list-checks',
      render: renderSection4,
    },
    {
      id: 'mental-prep',
      title: 'Mental Preparation',
      subtitle: 'Section 5 of 6',
      duration: '5 min',
      icon: 'heart',
      render: renderSection5,
    },
    {
      id: 'first-mission',
      title: 'Your First Mission',
      subtitle: 'Section 6 of 6',
      duration: '5 min',
      icon: 'flag',
      render: renderSection6,
    },
  ];

  // ── STATE ── //
  let currentSection = 0;
  let sectionsVisited = new Set();
  let breathingInterval = null;
  let breathingPhase = 0;   // 0=in, 1=hold, 2=out
  let breathingSeconds = 4;
  let breathingActive = false;
  let containerEl = null;

  // Load saved progress
  function loadProgress() {
    const saved = Storage.getPath('orientationProgress', null);
    if (saved) {
      currentSection = Math.min(saved.currentSection || 0, SECTIONS.length - 1);
      sectionsVisited = new Set(saved.sectionsVisited || []);
    } else {
      currentSection = 0;
      sectionsVisited = new Set();
    }
  }

  function saveProgress() {
    Storage.setPath('orientationProgress', {
      currentSection,
      sectionsVisited: [...sectionsVisited],
      lastUpdated: new Date().toISOString(),
    });
  }

  // ── MAIN RENDER ── //
  function render() {
    loadProgress();
    sectionsVisited.add(currentSection);

    const div = document.createElement('div');
    div.className = 'animate-fade-in';
    div.id = 'orientation-root';
    containerEl = div;

    div.innerHTML = `
      <!-- Page Header -->
      <div class="page-header-row mb-6">
        <div>
          <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
            letter-spacing:var(--ls-widest);color:var(--color-teal);margin-bottom:var(--space-2);">
            Pre-Test Orientation
          </div>
          <h1 style="margin-bottom:var(--space-2);">Before You Take SAT Practice 7</h1>
          <p class="page-subtitle">
            30 minutes. Learn how the test works — then go take it with a clear head.
          </p>
        </div>
        <div style="flex-shrink:0;">
          <div class="badge badge-primary" style="font-size:var(--text-xs);">
            No strategies here — baseline stays clean
          </div>
        </div>
      </div>

      <!-- Step Indicator -->
      <div id="orientation-stepper" class="mb-8">
        ${renderStepper()}
      </div>

      <!-- Progress Bar -->
      <div style="margin-bottom:var(--space-8);">
        <div class="progress-track" style="height:4px;">
          <div class="progress-fill teal" id="orientation-progress-fill"
            style="width:${Math.round(((currentSection + 1) / SECTIONS.length) * 100)}%;transition:width 0.4s ease;">
          </div>
        </div>
        <div style="font-size:var(--text-xs);color:var(--color-neutral-400);margin-top:var(--space-2);text-align:right;">
          Section <span id="orientation-section-counter">${currentSection + 1}</span> of ${SECTIONS.length}
        </div>
      </div>

      <!-- Section Content -->
      <div id="orientation-content" class="animate-fade-in">
        ${SECTIONS[currentSection].render()}
      </div>

      <!-- Navigation -->
      <div id="orientation-nav" class="d-flex justify-between items-center mt-8"
        style="padding-top:var(--space-6);border-top:1px solid var(--color-neutral-200);">
        <button class="btn btn-ghost" id="orientation-back-btn"
          ${currentSection === 0 ? 'style="visibility:hidden;"' : ''}>
          <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
          Back
        </button>
        <div style="font-size:var(--text-xs);color:var(--color-neutral-400);">
          ${SECTIONS[currentSection].duration} read
        </div>
        <button class="btn btn-accent btn-lg" id="orientation-next-btn">
          ${currentSection < SECTIONS.length - 1
            ? 'Continue <span style="margin-left:4px;">→</span>'
            : 'I\'m Ready — Take My Test 🎯'
          }
        </button>
      </div>
    `;

    // Wire navigation
    requestAnimationFrame(() => {
      wireNavigation(div);
      if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
    });

    return div;
  }

  function renderStepper() {
    return SECTIONS.map((section, i) => {
      let state = '';
      if (i < currentSection) state = 'completed';
      else if (i === currentSection) state = 'active';

      return `
        <div class="step ${state}" style="display:inline-flex;align-items:center;">
          <div class="step-circle" title="${section.title}">
            ${state === 'completed'
              ? '<i data-lucide="check" style="width:14px;height:14px;"></i>'
              : i + 1}
          </div>
          ${i < SECTIONS.length - 1
            ? `<div class="step-line" style="min-width:${window.innerWidth < 600 ? '16px' : '40px'};"></div>`
            : ''}
        </div>
      `;
    }).join('');
  }

  function wireNavigation(root) {
    const nextBtn = root.querySelector('#orientation-next-btn');
    const backBtn = root.querySelector('#orientation-back-btn');

    nextBtn?.addEventListener('click', () => {
      stopBreathing();
      if (currentSection < SECTIONS.length - 1) {
        goToSection(currentSection + 1);
      } else {
        completeOrientation();
      }
    });

    backBtn?.addEventListener('click', () => {
      stopBreathing();
      if (currentSection > 0) {
        goToSection(currentSection - 1);
      }
    });
  }

  function goToSection(index) {
    currentSection = index;
    sectionsVisited.add(index);
    saveProgress();

    // Update stepper
    const stepper = containerEl?.querySelector('#orientation-stepper');
    if (stepper) stepper.innerHTML = renderStepper();

    // Update progress fill
    const fill = containerEl?.querySelector('#orientation-progress-fill');
    if (fill) fill.style.width = `${Math.round(((index + 1) / SECTIONS.length) * 100)}%`;

    // Update section counter
    const counter = containerEl?.querySelector('#orientation-section-counter');
    if (counter) counter.textContent = index + 1;

    // Update content
    const content = containerEl?.querySelector('#orientation-content');
    if (content) {
      content.classList.remove('animate-fade-in');
      content.innerHTML = SECTIONS[index].render();
      requestAnimationFrame(() => {
        content.classList.add('animate-fade-in');
        if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
        // Re-wire any section-specific JS
        initSectionBehavior(index);
      });
    }

    // Update nav buttons
    const backBtn = containerEl?.querySelector('#orientation-back-btn');
    if (backBtn) backBtn.style.visibility = index === 0 ? 'hidden' : 'visible';

    const nextBtn = containerEl?.querySelector('#orientation-next-btn');
    if (nextBtn) {
      nextBtn.innerHTML = index < SECTIONS.length - 1
        ? 'Continue <span style="margin-left:4px;">→</span>'
        : 'I\'m Ready — Take My Test 🎯';
    }

    // Update duration label
    const durLabel = containerEl?.querySelector('#orientation-nav > div');
    if (durLabel) durLabel.textContent = `${SECTIONS[index].duration} read`;

    // Scroll to top of content
    // NOTE: section-to-section navigation doesn't go through Router.render(),
    // so router.js's scroll reset never fires here. #main-content has no
    // overflow rule (the window is the real scrolling element — see
    // layout.css), so an instant window.scrollTo is used instead of
    // scrollIntoView's smooth animation, which left the page scrolled to the
    // previous (longer) section's position when the new section was shorter
    // (confirmed: blank-looking page after Section 3 → 4).
    window.scrollTo(0, 0);
  }

  function initSectionBehavior(index) {
    if (index === 4) {
      // Section 5 — init breathing exercise
      initBreathingExercise();
    }
  }

  function completeOrientation() {
    // Save completion
    Storage.setPath('progress.orientationComplete', true);
    Storage.setPath('progress.orientationCompletedAt', new Date().toISOString());
    Storage.setPath('orientationProgress', {
      currentSection: SECTIONS.length - 1,
      sectionsVisited: [...Array(SECTIONS.length).keys()],
      completedAt: new Date().toISOString(),
    });

    // Award badge
    const badge = Storage.awardBadge(
      'first_step',
      'First Step',
      'Completed the Pre-Test Orientation'
    );
    if (badge) Storage.addPoints(50);

    // Fire event for app.js to pick up
    document.dispatchEvent(new CustomEvent('orientationComplete'));

    // Show celebration, then navigate to dashboard
    UI.toast(
      '🎓 Orientation complete! Now go take SAT Practice 7 in Bluebook. Your plan builds from those scores.',
      'success',
      'You\'re ready, Krystal!',
      6000
    );

    // Brief pause then navigate
    setTimeout(() => {
      Router.navigate('/dashboard');
    }, 600);
  }

  // ── SECTION RENDERERS ── //

  // ──────────────────────────────────────────────
  // SECTION 1 — What Is the Digital SAT?
  // ──────────────────────────────────────────────
  function renderSection1() {
    return `
      <div>
        <div class="d-flex gap-4 items-start mb-6">
          <div style="width:52px;height:52px;border-radius:var(--radius-xl);background:var(--color-primary);
            display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0;">
            <i data-lucide="book-open" style="width:26px;height:26px;"></i>
          </div>
          <div>
            <h2 style="margin-bottom:var(--space-1);">What Is the Digital SAT?</h2>
            <p style="color:var(--color-neutral-500);font-size:var(--text-sm);">The basics — what it measures, why it matters, and why it's learnable.</p>
          </div>
        </div>

        <div class="card card-body mb-5" style="border-left:4px solid var(--color-teal);">
          <p style="font-size:var(--text-md);color:var(--color-primary);font-weight:var(--fw-medium);line-height:var(--lh-relaxed);">
            The SAT doesn't measure how smart you are. It measures how well you've learned
            to think analytically — with text and with numbers. That's a skill. Skills are learned.
            This test is completely learnable.
          </p>
        </div>

        <h3 style="margin-bottom:var(--space-4);">The 1600 Scale</h3>

        <!-- Score Visual -->
        <div class="grid-2 mb-6" style="gap:var(--space-4);">
          <div class="card card-body" style="text-align:center;background:var(--color-primary-50);">
            <div style="font-size:var(--text-4xl);font-weight:var(--fw-extrabold);color:var(--color-primary);line-height:1;margin-bottom:var(--space-2);">
              800
            </div>
            <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-1);">Reading & Writing</div>
            <div style="font-size:var(--text-sm);color:var(--color-neutral-500);">
              Vocabulary in context, inference, grammar, transitions, and data interpretation in passages.
            </div>
          </div>
          <div class="card card-body" style="text-align:center;background:var(--color-accent-50);">
            <div style="font-size:var(--text-4xl);font-weight:var(--fw-extrabold);color:var(--color-accent-600);line-height:1;margin-bottom:var(--space-2);">
              800
            </div>
            <div style="font-weight:var(--fw-semibold);color:var(--color-accent-600);margin-bottom:var(--space-1);">Math</div>
            <div style="font-size:var(--text-sm);color:var(--color-neutral-500);">
              Algebra, advanced math, geometry, statistics, and data analysis.
            </div>
          </div>
        </div>

        <div class="card card-body mb-5" style="text-align:center;background:linear-gradient(135deg,var(--color-primary-50),var(--color-teal-50));">
          <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;letter-spacing:var(--ls-widest);color:var(--color-teal);margin-bottom:var(--space-2);">
            How it's scored
          </div>
          <div style="font-size:var(--text-3xl);font-weight:var(--fw-extrabold);color:var(--color-primary);line-height:1;margin-bottom:var(--space-2);">
            800 + 800
          </div>
          <div style="font-size:var(--text-sm);color:var(--color-neutral-500);">
            Reading & Writing and Math are scored separately, then combined. Scholar's Edge targets both — your weakest section first.
          </div>
        </div>

        <h3 style="margin-bottom:var(--space-4);">Why It Matters for You</h3>

        <div class="d-flex flex-col gap-3 mb-6">
          ${reasonCard('🎓', 'College Admissions', 'Your SAT score is one of the most significant factors in college admissions — especially at selective schools. A strong score opens doors a GPA alone can\'t.')}
          ${reasonCard('💰', 'Scholarship Eligibility', 'A high PSAT/NMSQT score (October 2027) could qualify you for National Merit Scholarships — tens of thousands of dollars in college funding.')}
          ${reasonCard('📚', 'CLT for Classical Colleges', 'The Classical Learning Test is required by many classical colleges. Scholar\'s Edge trains both the SAT and CLT simultaneously since many strategies overlap.')}
        </div>

        <div class="coaching-card">
          <div class="coaching-card-avatar">🎓</div>
          <div class="coaching-card-body">
            <div class="coaching-card-label">A word before you start</div>
            <div class="coaching-card-message">
              You have a built-in advantage, Krystal. You've been trained to think logically and read closely
              — which is exactly what this test rewards. The students who struggle are often the ones who
              try to memorize their way through it. You're going to learn how to <em>think through</em> it.
              That's a completely different approach, and it works.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function reasonCard(emoji, title, desc) {
    return `
      <div class="d-flex gap-4 items-start" style="padding:var(--space-4);background:var(--color-white);
        border:1px solid var(--color-neutral-200);border-radius:var(--radius-lg);">
        <div style="font-size:1.5rem;flex-shrink:0;">${emoji}</div>
        <div>
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-1);">${title}</div>
          <div style="font-size:var(--text-sm);color:var(--color-neutral-500);line-height:var(--lh-relaxed);">${desc}</div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────
  // SECTION 2 — How Bluebook Works
  // ──────────────────────────────────────────────
  function renderSection2() {
    return `
      <div>
        <div class="d-flex gap-4 items-start mb-6">
          <div style="width:52px;height:52px;border-radius:var(--radius-xl);background:var(--color-teal);
            display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0;">
            <i data-lucide="monitor" style="width:26px;height:26px;"></i>
          </div>
          <div>
            <h2 style="margin-bottom:var(--space-1);">How Bluebook Works</h2>
            <p style="color:var(--color-neutral-500);font-size:var(--text-sm);">Everything you need to know about the test interface before you sit down.</p>
          </div>
        </div>

        <div class="alert alert-info mb-6">
          <i data-lucide="info" class="alert-icon"></i>
          <div class="alert-body">
            <div class="alert-title">Bluebook is College Board's official app</div>
            <div class="alert-desc">
              You take the real SAT and all official practice tests inside Bluebook.
              It runs on Mac, Windows, iPad, and school-provided devices.
            </div>
          </div>
        </div>

        <!-- Bluebook UI Mockup -->
        <h3 style="margin-bottom:var(--space-4);">What the App Looks Like</h3>
        <div class="card mb-6" style="border:2px solid var(--color-primary-100);overflow:hidden;">
          <!-- Simulated Bluebook header -->
          <div style="background:var(--color-primary);padding:var(--space-3) var(--space-5);
            display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;gap:var(--space-3);align-items:center;">
              <span style="background:rgba(255,255,255,0.15);color:white;font-size:var(--text-xs);
                padding:3px 8px;border-radius:var(--radius-full);font-weight:var(--fw-semibold);">
                Reading &amp; Writing — Module 1
              </span>
            </div>
            <div style="display:flex;gap:var(--space-4);align-items:center;">
              <span style="color:var(--color-accent);font-weight:var(--fw-bold);font-size:var(--text-sm);">
                ⏱ 32:14
              </span>
              <span style="background:rgba(255,255,255,0.15);color:white;font-size:var(--text-xs);
                padding:3px 8px;border-radius:var(--radius-sm);">
                Q 12 / 27
              </span>
            </div>
          </div>

          <!-- Passage area -->
          <div class="orient-split" style="display:grid;grid-template-columns:1fr 1fr;background:white;min-height:200px;">
            <div style="padding:var(--space-5);border-right:1px solid var(--color-neutral-200);">
              <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--color-neutral-400);
                text-transform:uppercase;letter-spacing:var(--ls-wider);margin-bottom:var(--space-3);">
                Passage
              </div>
              <div style="font-size:var(--text-sm);color:var(--color-text);line-height:var(--lh-relaxed);">
                <p>The following text is adapted from a 2021 study on deep-sea bioluminescence.</p>
                <p style="margin-top:var(--space-3);">Scientists have long observed that organisms in the deep ocean produce their own light through chemical reactions — a phenomenon known as bioluminescence. Unlike surface-dwelling creatures...</p>
                <p style="margin-top:var(--space-2);color:var(--color-neutral-400);font-style:italic;font-size:var(--text-xs);">[Passage continues...]</p>
              </div>
            </div>
            <div style="padding:var(--space-5);">
              <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--color-neutral-400);
                text-transform:uppercase;letter-spacing:var(--ls-wider);margin-bottom:var(--space-3);">
                Question 12
              </div>
              <div style="font-size:var(--text-sm);color:var(--color-text);margin-bottom:var(--space-4);line-height:var(--lh-relaxed);">
                The main purpose of the underlined sentence is to...
              </div>
              <div style="display:flex;flex-direction:column;gap:var(--space-2);">
                ${mockAnswer('A', 'introduce a counterargument to the main claim')}
                ${mockAnswer('B', 'provide a specific example of the phenomenon described', true)}
                ${mockAnswer('C', 'contrast two competing scientific theories')}
                ${mockAnswer('D', 'summarize the findings of the study')}
              </div>
            </div>
          </div>

          <!-- Bottom nav bar -->
          <div style="background:var(--color-neutral-50);border-top:1px solid var(--color-neutral-200);
            padding:var(--space-3) var(--space-5);display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:var(--text-xs);color:var(--color-neutral-500);">← Previous</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;max-width:300px;">
              ${[...Array(27)].map((_, i) => `
                <div style="width:18px;height:18px;border-radius:3px;background:${i === 11 ? 'var(--color-primary)' : i < 11 ? 'var(--color-teal)' : 'var(--color-neutral-200)'};
                  font-size:9px;display:flex;align-items:center;justify-content:center;
                  color:${i <= 11 ? 'white' : 'var(--color-neutral-400)'};">
                  ${i + 1}
                </div>
              `).join('')}
            </div>
            <div style="font-size:var(--text-xs);color:var(--color-neutral-500);">Next →</div>
          </div>
        </div>
        <p style="font-size:var(--text-xs);color:var(--color-neutral-400);text-align:center;margin-top:calc(-1 * var(--space-4));margin-bottom:var(--space-6);">
          Illustration only — not from actual College Board materials
        </p>

        <!-- Key features -->
        <h3 style="margin-bottom:var(--space-4);">Tools Built Into Bluebook</h3>
        <div class="grid-2 mb-6" style="gap:var(--space-4);">
          ${bluebookFeature('calculator', 'Desmos Calculator', 'A full graphing calculator is available on every math question — no need to bring your own. Scholar\'s Edge teaches you exactly when and how to use it.')}
          ${bluebookFeature('bookmark', 'Flag for Review', 'Mark any question to come back to. Green = answered and confident. Flagged = answered but unsure. The bottom number bar shows your status at a glance.')}
          ${bluebookFeature('file-text', 'Math Reference Sheet', 'Formulas for geometry and other math concepts are provided inside the app. You don\'t need to memorize them — but you do need to know what\'s there.')}
          ${bluebookFeature('highlight', 'Text Annotation', 'You can highlight and underline text in reading passages directly inside the app. Use it — it helps you anchor the passage before answering.')}
        </div>

        <!-- Download checklist -->
        <h3 style="margin-bottom:var(--space-4);">Setup Checklist — Do This Before Test Day</h3>
        <div class="card card-body" style="background:var(--color-primary-50);border-color:var(--color-primary-100);">
          <div class="d-flex flex-col gap-3">
            ${setupStep('1', 'Download Bluebook', 'Go to collegeboard.org/bluebook and download for your device (Mac, Windows, or iPad).', 'https://satsuite.collegeboard.org/digital/digital-practice-preparation/practice-tests/bluebook')}
            ${setupStep('2', 'Create College Board Account', 'Sign up at collegeboard.org — you\'ll need this for all official practice tests and your real test registration.', 'https://www.collegeboard.org')}
            ${setupStep('3', 'Launch Bluebook and Log In', 'Open the app and sign in with your College Board account. Practice tests should appear in your dashboard.')}
            ${setupStep('4', 'Start Your Practice Test', 'In Bluebook, tap <strong>Full-Length Practice</strong>. Set Test Type to <strong>SAT</strong>, then select <strong>SAT Practice 7</strong>. This is your baseline — take it before starting any prep.')}
            ${setupStep('5', 'Confirm your device is charged', 'Practice tests take about 2.5 hours. Plug in or make sure you have full battery.')}
          </div>
        </div>
      </div>
    `;
  }

  function mockAnswer(letter, text, selected = false) {
    return `
      <div style="display:flex;gap:var(--space-2);align-items:flex-start;padding:var(--space-2);
        border-radius:var(--radius-sm);background:${selected ? 'var(--color-teal-50)' : 'transparent'};">
        <div style="width:22px;height:22px;border-radius:50%;border:2px solid ${selected ? 'var(--color-teal)' : 'var(--color-neutral-300)'};
          display:flex;align-items:center;justify-content:center;font-size:var(--text-xs);
          font-weight:var(--fw-bold);color:${selected ? 'var(--color-teal)' : 'var(--color-neutral-500)'};flex-shrink:0;">
          ${letter}
        </div>
        <span style="font-size:var(--text-xs);color:${selected ? 'var(--color-teal-500)' : 'var(--color-neutral-600)'};line-height:1.5;">${text}</span>
      </div>
    `;
  }

  function bluebookFeature(icon, title, desc) {
    return `
      <div class="d-flex gap-3 items-start" style="padding:var(--space-4);background:var(--color-white);
        border:1px solid var(--color-neutral-200);border-radius:var(--radius-lg);">
        <div style="width:36px;height:36px;border-radius:var(--radius-md);background:var(--color-teal-50);
          display:flex;align-items:center;justify-content:center;color:var(--color-teal-500);flex-shrink:0;">
          <i data-lucide="${icon}" style="width:18px;height:18px;"></i>
        </div>
        <div>
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);font-size:var(--text-sm);margin-bottom:var(--space-1);">${title}</div>
          <div style="font-size:var(--text-xs);color:var(--color-neutral-500);line-height:var(--lh-relaxed);">${desc}</div>
        </div>
      </div>
    `;
  }

  function setupStep(num, title, desc, link) {
    return `
      <div class="d-flex gap-4 items-start">
        <div style="width:28px;height:28px;border-radius:50%;background:var(--color-primary);
          display:flex;align-items:center;justify-content:center;color:white;font-weight:var(--fw-bold);
          font-size:var(--text-xs);flex-shrink:0;">${num}</div>
        <div>
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:2px;">
            ${title}
            ${link ? `<a href="${link}" target="_blank" rel="noopener"
              style="font-size:var(--text-xs);color:var(--color-teal);font-weight:var(--fw-regular);margin-left:var(--space-2);">
              Open →
            </a>` : ''}
          </div>
          <div style="font-size:var(--text-sm);color:var(--color-neutral-600);">${desc}</div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────
  // SECTION 3 — Test Format Overview
  // ──────────────────────────────────────────────
  function renderSection3() {
    return `
      <div>
        <div class="d-flex gap-4 items-start mb-6">
          <div style="width:52px;height:52px;border-radius:var(--radius-xl);background:var(--color-accent);
            display:flex;align-items:center;justify-content:center;color:var(--color-primary);flex-shrink:0;">
            <i data-lucide="layout" style="width:26px;height:26px;"></i>
          </div>
          <div>
            <h2 style="margin-bottom:var(--space-1);">Test Format Overview</h2>
            <p style="color:var(--color-neutral-500);font-size:var(--text-sm);">Two sections. Two modules each. Here's exactly how the test flows.</p>
          </div>
        </div>

        <!-- Test Structure Diagram -->
        <h3 style="margin-bottom:var(--space-5);">The Full Test at a Glance</h3>

        <div class="card mb-6" style="overflow:hidden;">
          <!-- Header -->
          <div style="background:var(--color-primary);padding:var(--space-4) var(--space-6);
            display:flex;justify-content:space-between;align-items:center;">
            <div style="color:white;font-family:var(--font-heading);font-weight:var(--fw-bold);">Digital SAT</div>
            <div style="color:var(--color-accent);font-weight:var(--fw-semibold);font-size:var(--text-sm);">
              2 hrs 14 min · 98 questions
            </div>
          </div>

          <!-- Reading/Writing Section -->
          <div style="padding:var(--space-5) var(--space-6);border-bottom:2px dashed var(--color-neutral-200);">
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
              letter-spacing:var(--ls-widest);color:var(--color-teal);margin-bottom:var(--space-4);">
              Reading &amp; Writing
            </div>
            <div class="grid-2" style="gap:var(--space-4);">
              ${moduleBlock('Module 1', '27 questions', '32 minutes', 'Same for every student — this is your gatekeeper.', '#2ABFBF', true)}
              ${moduleBlock('Module 2', '27 questions', '32 minutes', 'Difficulty adjusts based on your Module 1 performance.', '#1E9A9A', false)}
            </div>
            <div style="margin-top:var(--space-4);padding:var(--space-3);background:var(--color-teal-50);
              border-radius:var(--radius-md);font-size:var(--text-sm);color:var(--color-teal-500);">
              <strong>54 questions · 64 minutes total</strong>
            </div>
          </div>

          <!-- Break -->
          <div style="padding:var(--space-3) var(--space-6);background:var(--color-neutral-50);
            text-align:center;border-bottom:2px dashed var(--color-neutral-200);">
            <div style="font-size:var(--text-sm);font-weight:var(--fw-semibold);color:var(--color-neutral-500);">
              ☕ 10-Minute Break
            </div>
            <div style="font-size:var(--text-xs);color:var(--color-neutral-400);margin-top:2px;">
              Stand up, drink water, reset your mind.
            </div>
          </div>

          <!-- Math Section -->
          <div style="padding:var(--space-5) var(--space-6);">
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
              letter-spacing:var(--ls-widest);color:var(--color-accent-600);margin-bottom:var(--space-4);">
              Math
            </div>
            <div class="grid-2" style="gap:var(--space-4);">
              ${moduleBlock('Module 1', '22 questions', '35 minutes', 'Same for every student — this is your gatekeeper.', '#F4B942', true)}
              ${moduleBlock('Module 2', '22 questions', '35 minutes', 'Difficulty adjusts based on your Module 1 performance.', '#E8A020', false)}
            </div>
            <div style="margin-top:var(--space-4);padding:var(--space-3);background:var(--color-accent-50);
              border-radius:var(--radius-md);font-size:var(--text-sm);color:var(--color-accent-600);">
              <strong>44 questions · 70 minutes total</strong>
            </div>
          </div>
        </div>

        <!-- Key points -->
        <h3 style="margin-bottom:var(--space-4);">What You Need to Know About Module 2</h3>

        <div class="d-flex flex-col gap-4 mb-6">
          <div class="d-flex gap-3 items-start">
            <div style="width:8px;height:8px;border-radius:50%;background:var(--color-primary);flex-shrink:0;margin-top:6px;"></div>
            <p style="font-size:var(--text-sm);color:var(--color-text);line-height:var(--lh-relaxed);">
              After Module 1, the app routes you to either an easier or harder Module 2 based on your performance.
              This is just how the test works — it's the same for every student.
            </p>
          </div>
          <div class="d-flex gap-3 items-start">
            <div style="width:8px;height:8px;border-radius:50%;background:var(--color-primary);flex-shrink:0;margin-top:6px;"></div>
            <p style="font-size:var(--text-sm);color:var(--color-text);line-height:var(--lh-relaxed);">
              Students routed to the harder Module 2 have access to higher score ranges. Students routed
              to the easier Module 2 are capped below the top scores.
            </p>
          </div>
          <div class="d-flex gap-3 items-start">
            <div style="width:8px;height:8px;border-radius:50%;background:var(--color-primary);flex-shrink:0;margin-top:6px;"></div>
            <p style="font-size:var(--text-sm);color:var(--color-text);line-height:var(--lh-relaxed);">
              You'll learn exactly how to approach Module 1 once you've imported your baseline scores.
              For now — just know this mechanism exists.
            </p>
          </div>
        </div>

        <!-- Time breakdown -->
        <div class="card card-body" style="background:var(--color-neutral-50);">
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-4);">
            Full Time Breakdown
          </div>
          <div class="d-flex flex-col gap-2">
            ${timeRow('Reading/Writing Module 1', '32 min', 'var(--color-teal)')}
            ${timeRow('Reading/Writing Module 2', '32 min', 'var(--color-teal)')}
            ${timeRow('Break', '10 min', 'var(--color-neutral-400)')}
            ${timeRow('Math Module 1', '35 min', 'var(--color-accent-500)')}
            ${timeRow('Math Module 2', '35 min', 'var(--color-accent-500)')}
            <div style="border-top:1px solid var(--color-neutral-200);padding-top:var(--space-3);margin-top:var(--space-2);
              display:flex;justify-content:space-between;">
              <span style="font-weight:var(--fw-bold);color:var(--color-primary);">Total</span>
              <span style="font-weight:var(--fw-bold);color:var(--color-primary);">2 hrs 24 min (with break)</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function moduleBlock(name, questions, time, note, color, isFirst) {
    return `
      <div style="padding:var(--space-4);border:2px solid ${color};border-radius:var(--radius-lg);position:relative;">
        <div style="font-weight:var(--fw-bold);color:${color};margin-bottom:var(--space-2);">${name}</div>
        <div style="font-size:var(--text-xl);font-weight:var(--fw-extrabold);color:var(--color-primary);margin-bottom:2px;">
          ${questions}
        </div>
        <div style="font-size:var(--text-sm);color:var(--color-neutral-500);margin-bottom:var(--space-3);">${time}</div>
        <div style="font-size:var(--text-xs);color:var(--color-neutral-500);line-height:var(--lh-relaxed);">${note}</div>
        ${isFirst ? `
          <div style="position:absolute;top:-10px;right:var(--space-3);">
            <span style="background:${color};color:white;font-size:9px;font-weight:var(--fw-bold);
              padding:2px 6px;border-radius:var(--radius-full);">SAME FOR ALL</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  function timeRow(label, time, color) {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:var(--space-2) 0;
        border-bottom:1px solid var(--color-neutral-100);">
        <div style="display:flex;align-items:center;gap:var(--space-2);">
          <div style="width:10px;height:10px;border-radius:2px;background:${color};flex-shrink:0;"></div>
          <span style="font-size:var(--text-sm);color:var(--color-text);">${label}</span>
        </div>
        <span style="font-size:var(--text-sm);font-weight:var(--fw-semibold);color:var(--color-neutral-600);">${time}</span>
      </div>
    `;
  }

  // ──────────────────────────────────────────────
  // SECTION 4 — Three Rules Only
  // ──────────────────────────────────────────────
  function renderSection4() {
    return `
      <div>
        <div class="d-flex gap-4 items-start mb-6">
          <div style="width:52px;height:52px;border-radius:var(--radius-xl);background:var(--color-success);
            display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0;">
            <i data-lucide="list-checks" style="width:26px;height:26px;"></i>
          </div>
          <div>
            <h2 style="margin-bottom:var(--space-1);">Three Rules Only</h2>
            <p style="color:var(--color-neutral-500);font-size:var(--text-sm);">For your baseline test, you only need to know three things.</p>
          </div>
        </div>

        <div class="card card-body mb-6" style="border-left:4px solid var(--color-success);">
          <p style="font-size:var(--text-sm);color:var(--color-neutral-600);line-height:var(--lh-relaxed);">
            This is your <strong>baseline test</strong> — the goal is to get an accurate picture of where you're starting from,
            not to apply strategies you haven't learned yet. Three rules. That's it.
          </p>
        </div>

        <!-- The Three Rules -->
        <div class="d-flex flex-col gap-6 mb-8">
          ${ruleCard('1', 'Attempt Every Question', 'There is no penalty for a wrong answer on the digital SAT. A wrong answer and a blank answer are worth exactly the same — zero. That means guessing is always better than leaving a blank. Always attempt every question.', 'var(--color-teal)')}
          ${ruleCard('2', 'If You\'re Stuck, Guess and Move On', 'If a question has you completely lost, make your best guess and keep moving. Don\'t let one hard question eat up 4 minutes of time that belongs to the next 3 questions. Pick an answer — any answer — and go.', 'var(--color-accent-500)')}
          ${ruleCard('3', 'This Is Information, Not a Grade', 'Your score on this test is the starting point for your personalized plan. It doesn\'t go on your transcript. It doesn\'t affect your GPA. It\'s data — and whatever it says, we use it to build the most effective path to where you want to go.', 'var(--color-primary)')}
        </div>

        <!-- What NOT to do -->
        <div class="card card-body" style="background:var(--color-warning-bg);border:1px solid rgba(243,156,18,0.25);">
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-3);">
            ⚠️ What NOT to do during this test
          </div>
          <div class="d-flex flex-col gap-3">
            ${dontItem('Don\'t spend more than 2–3 minutes on any single question. If you\'re stuck, guess and move on.')}
            ${dontItem('Don\'t leave any answer blank. Every unanswered question is a guaranteed zero.')}
            ${dontItem('Don\'t try to apply strategies or techniques you\'ve read about. This is a clean baseline — let it be natural.')}
            ${dontItem('Don\'t panic if a question looks completely foreign. That\'s the point — it shows us where to build.')}
          </div>
        </div>

        <div class="coaching-card mt-6">
          <div class="coaching-card-avatar">🎓</div>
          <div class="coaching-card-body">
            <div class="coaching-card-label">Coach's note</div>
            <div class="coaching-card-message">
              Some students freeze up when they see questions they don't know how to answer.
              That's completely normal — and completely fine. Your job on this test is just to give
              every question your honest best attempt. We handle everything else after we see the scores.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function ruleCard(num, title, desc, color) {
    return `
      <div style="display:flex;gap:var(--space-5);align-items:flex-start;padding:var(--space-6);
        background:white;border:2px solid ${color};border-radius:var(--radius-xl);">
        <div style="width:52px;height:52px;border-radius:50%;background:${color};
          display:flex;align-items:center;justify-content:center;color:white;
          font-family:var(--font-heading);font-size:var(--text-2xl);font-weight:var(--fw-extrabold);
          flex-shrink:0;box-shadow:0 4px 12px ${color}40;">
          ${num}
        </div>
        <div>
          <div style="font-family:var(--font-heading);font-size:var(--text-lg);font-weight:var(--fw-bold);
            color:var(--color-primary);margin-bottom:var(--space-3);">
            ${title}
          </div>
          <p style="font-size:var(--text-sm);color:var(--color-neutral-600);line-height:var(--lh-relaxed);">
            ${desc}
          </p>
        </div>
      </div>
    `;
  }

  function dontItem(text) {
    return `
      <div class="d-flex gap-3 items-start">
        <i data-lucide="x-circle" style="width:16px;height:16px;color:var(--color-warning);flex-shrink:0;margin-top:2px;"></i>
        <span style="font-size:var(--text-sm);color:var(--color-neutral-700);">${text}</span>
      </div>
    `;
  }

  // ──────────────────────────────────────────────
  // SECTION 5 — Mental Preparation
  // ──────────────────────────────────────────────
  function renderSection5() {
    return `
      <div>
        <div class="d-flex gap-4 items-start mb-6">
          <div style="width:52px;height:52px;border-radius:var(--radius-xl);
            background:linear-gradient(135deg,var(--color-primary),var(--color-teal));
            display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0;">
            <i data-lucide="heart" style="width:26px;height:26px;"></i>
          </div>
          <div>
            <h2 style="margin-bottom:var(--space-1);">Mental Preparation</h2>
            <p style="color:var(--color-neutral-500);font-size:var(--text-sm);">The right mindset before you sit down. And a breathing technique that actually works.</p>
          </div>
        </div>

        <!-- Reframe cards -->
        <div class="d-flex flex-col gap-4 mb-8">
          ${mantaCard('"This is not a grade. This is your starting line."', 'Every marathon starts at mile zero. Your baseline score is just mile zero. What matters is how far you go from here — and that\'s entirely a function of the work you do in Scholar\'s Edge.')}
          ${mantaCard('"Whatever I score, we use it to build my personal plan."', 'A lower baseline score doesn\'t mean you\'re behind. It means you have more room to grow — and more points to gain. Some of the biggest score jumps happen from lower starting points.')}
          ${mantaCard('"Every expert test taker started exactly where I am."', 'Nobody is born knowing how to take the SAT. Every 1500+ scorer sat down for a baseline test at some point and felt exactly what you might feel walking in. The difference is what they did after.')}
        </div>

        <!-- Breathing Exercise -->
        <h3 style="margin-bottom:var(--space-3);">The Breathing Technique</h3>
        <p style="font-size:var(--text-sm);color:var(--color-neutral-500);margin-bottom:var(--space-5);line-height:var(--lh-relaxed);">
          Before each test module, take 60 seconds to do this. It activates your
          parasympathetic nervous system — which reduces anxiety and sharpens focus.
          It's not a trick. It's physiology.
        </p>

        <div class="card card-body mb-6" style="text-align:center;">
          <!-- Breathing animation circle -->
          <div id="breathing-container" style="margin:0 auto;">
            <div id="breathing-circle-wrapper" style="width:180px;height:180px;margin:0 auto var(--space-6);position:relative;">
              <div id="breathing-ring" style="
                position:absolute;inset:0;border-radius:50%;
                background:radial-gradient(circle, var(--color-teal-50) 0%, transparent 70%);
                border:4px solid var(--color-teal-100);
                transition:transform 4s ease-in-out, border-color 0.3s;
              "></div>
              <div id="breathing-inner" style="
                position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                width:100px;height:100px;border-radius:50%;
                background:linear-gradient(135deg,var(--color-teal),var(--color-primary));
                display:flex;flex-direction:column;align-items:center;justify-content:center;
                color:white;transition:width 4s ease-in-out,height 4s ease-in-out,background 0.3s;
                box-shadow:0 4px 20px rgba(42,191,191,0.4);
              ">
                <div id="breathing-phase-label" style="font-size:var(--text-xs);font-weight:var(--fw-semibold);opacity:0.9;">Ready</div>
                <div id="breathing-count" style="font-size:var(--text-2xl);font-weight:var(--fw-extrabold);line-height:1;">4</div>
              </div>
            </div>

            <div id="breathing-instruction" style="font-size:var(--text-sm);color:var(--color-neutral-500);
              margin-bottom:var(--space-5);min-height:20px;">
              4 counts in → 4 counts hold → 4 counts out
            </div>

            <div style="display:flex;gap:var(--space-3);justify-content:center;">
              <button id="breathing-start-btn" class="btn btn-teal btn-lg">
                <i data-lucide="play" style="width:16px;height:16px;"></i>
                Practice Breathing
              </button>
              <button id="breathing-stop-btn" class="btn btn-ghost" style="display:none;">
                <i data-lucide="square" style="width:16px;height:16px;"></i>
                Stop
              </button>
            </div>
            <div id="breathing-cycles" style="font-size:var(--text-xs);color:var(--color-neutral-400);
              margin-top:var(--space-4);display:none;">
              0 cycles completed
            </div>
          </div>
        </div>

        <!-- When to use it -->
        <div class="card card-body" style="background:var(--color-primary-50);">
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-3);">
            When to use this technique
          </div>
          <div class="d-flex flex-col gap-2">
            ${whenItem('Before you start Module 1 (the most important module)')}
            ${whenItem('During the 10-minute break, before Math starts')}
            ${whenItem('Anytime you feel yourself tensing up or spiraling mid-module')}
            ${whenItem('Before your real PSAT and SAT test days')}
          </div>
        </div>
      </div>
    `;
  }

  function mantaCard(quote, context) {
    return `
      <div style="padding:var(--space-5);border-radius:var(--radius-xl);
        background:white;border:1px solid var(--color-neutral-200);">
        <div style="font-family:var(--font-heading);font-size:var(--text-lg);font-weight:var(--fw-semibold);
          color:var(--color-primary);margin-bottom:var(--space-3);line-height:var(--lh-snug);">
          ${quote}
        </div>
        <p style="font-size:var(--text-sm);color:var(--color-neutral-500);line-height:var(--lh-relaxed);margin:0;">
          ${context}
        </p>
      </div>
    `;
  }

  function whenItem(text) {
    return `
      <div class="d-flex gap-3 items-center">
        <i data-lucide="check-circle" style="width:16px;height:16px;color:var(--color-teal);flex-shrink:0;"></i>
        <span style="font-size:var(--text-sm);color:var(--color-primary);">${text}</span>
      </div>
    `;
  }

  // ──────────────────────────────────────────────
  // SECTION 6 — Your First Mission
  // ──────────────────────────────────────────────
  function renderSection6() {
    return `
      <div>
        <div class="d-flex gap-4 items-start mb-6">
          <div style="width:52px;height:52px;border-radius:var(--radius-xl);background:var(--color-accent);
            display:flex;align-items:center;justify-content:center;color:var(--color-primary);flex-shrink:0;">
            <i data-lucide="flag" style="width:26px;height:26px;"></i>
          </div>
          <div>
            <h2 style="margin-bottom:var(--space-1);">Your First Mission</h2>
            <p style="color:var(--color-neutral-500);font-size:var(--text-sm);">
              Five steps. 2 hours 24 minutes. This is how Scholar's Edge officially starts.
            </p>
          </div>
        </div>

        <!-- Mission steps -->
        <div class="d-flex flex-col gap-4 mb-8">
          ${missionStep('1', 'Download Bluebook', 'If you haven\'t already, download and install the Bluebook app from College Board.', 'https://satsuite.collegeboard.org/digital/digital-practice-preparation/practice-tests/bluebook', 'Download Bluebook →', 'var(--color-primary)')}
          ${missionStep('2', 'Create Your College Board Account', 'Sign up at collegeboard.org. You\'ll need this account to access practice tests and eventually register for the real test.', 'https://www.collegeboard.org', 'Create Account →', 'var(--color-primary)')}
          ${missionStep('3', 'Take SAT Practice 7 — Full, Timed, Uninterrupted', 'In Bluebook, tap <strong>Full-Length Practice</strong> → Test Type: <strong>SAT</strong> → select <strong>SAT Practice 7</strong>. Do not pause, split across two sessions, or look anything up. Let it be natural. 98 questions. 2 hours 14 minutes.', null, null, 'var(--color-teal)')}
          ${missionStep('4', 'Download Your Score Report PDF', 'After completing the test, Bluebook will show your scores. Download the full score report PDF — you\'ll need it to import into Scholar\'s Edge.', null, null, 'var(--color-accent-500)')}
          ${missionStep('5', 'Come Back and Import Your Results', 'Return to Scholar\'s Edge, tap "Import Results," and upload your PDF. Your personalized plan builds instantly from those scores.', null, null, 'var(--color-success)')}
        </div>

        <!-- Environment setup -->
        <div class="card card-body mb-6" style="background:var(--color-neutral-50);">
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-4);">
            Set Yourself Up Right
          </div>
          <div class="grid-2" style="gap:var(--space-4);">
            ${envItem('⏱', 'Block 3 uninterrupted hours', 'The test itself is 2 hrs 24 min. Give yourself setup and wind-down time.')}
            ${envItem('🤫', 'Quiet room, no phone', 'Treat it like the real thing. Distractions cost you accuracy.')}
            ${envItem('💧', 'Water and a snack nearby', 'You can use the break to hydrate. Don\'t skip the break.')}
            ${envItem('🔋', 'Fully charged device', 'Check your battery before you start. Plug in if possible.')}
          </div>
        </div>

        <!-- Completion framing -->
        <div class="card card-body" style="background:linear-gradient(135deg,var(--color-primary),var(--color-primary-600));color:white;text-align:center;">
          <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
            letter-spacing:var(--ls-widest);color:var(--color-accent);margin-bottom:var(--space-4);">
            After your test
          </div>
          <h3 style="color:white;font-size:var(--text-xl);margin-bottom:var(--space-4);">
            "When you finish SAT Practice 7 and download your results,
            tap 'Import My Results' to unlock your personalized Scholar's Edge plan."
          </h3>
          <p style="color:rgba(255,255,255,0.7);font-size:var(--text-sm);margin-bottom:var(--space-6);line-height:var(--lh-relaxed);">
            That import is the moment everything becomes personal. Your band profile, your strategy order,
            your projected score, your drill queue — all of it builds from your SAT Practice 7 results.
            Not from averages. Not from assumptions. From your actual data.
          </p>
          <button class="btn btn-accent btn-lg" onclick="Router.navigate('/import')" style="margin:0 auto;">
            <i data-lucide="upload-cloud" style="width:18px;height:18px;"></i>
            Go to Import Results
          </button>
        </div>

        <div class="coaching-card mt-6">
          <div class="coaching-card-avatar">🎓</div>
          <div class="coaching-card-body">
            <div class="coaching-card-label">You're ready, Krystal</div>
            <div class="coaching-card-message">
              You've done everything right to prepare for this baseline test. You know what the test is,
              how the app works, what the format looks like, the three rules, and the right mindset to
              walk in with. Take the breathing technique into the test room. Do your best.
              And come back here when you're done. The real work starts then.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function missionStep(num, title, desc, link, linkLabel, color) {
    return `
      <div style="display:flex;gap:var(--space-5);align-items:flex-start;padding:var(--space-5);
        background:white;border:1px solid var(--color-neutral-200);border-radius:var(--radius-xl);
        border-left:4px solid ${color};">
        <div style="width:36px;height:36px;border-radius:50%;background:${color};
          display:flex;align-items:center;justify-content:center;color:white;
          font-weight:var(--fw-extrabold);font-size:var(--text-md);flex-shrink:0;">
          ${num}
        </div>
        <div style="flex:1;">
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-2);">
            ${title}
          </div>
          <p style="font-size:var(--text-sm);color:var(--color-neutral-600);line-height:var(--lh-relaxed);margin:0;">
            ${desc}
          </p>
          ${link ? `
            <a href="${link}" target="_blank" rel="noopener" class="btn btn-sm btn-outline mt-4"
              style="display:inline-flex;text-decoration:none;">
              <i data-lucide="external-link" style="width:14px;height:14px;"></i>
              ${linkLabel}
            </a>
          ` : ''}
        </div>
      </div>
    `;
  }

  function envItem(emoji, title, desc) {
    return `
      <div class="d-flex gap-3 items-start">
        <div style="font-size:1.25rem;flex-shrink:0;">${emoji}</div>
        <div>
          <div style="font-size:var(--text-sm);font-weight:var(--fw-semibold);color:var(--color-primary);">${title}</div>
          <div style="font-size:var(--text-xs);color:var(--color-neutral-500);">${desc}</div>
        </div>
      </div>
    `;
  }

  // ── BREATHING EXERCISE ── //
  function initBreathingExercise() {
    const startBtn = document.getElementById('breathing-start-btn');
    const stopBtn = document.getElementById('breathing-stop-btn');
    if (!startBtn) return;

    startBtn.addEventListener('click', startBreathing);
    stopBtn?.addEventListener('click', stopBreathing);
  }

  function startBreathing() {
    if (breathingActive) return;
    breathingActive = true;
    breathingPhase = 0;
    breathingSeconds = 4;
    let cyclesCompleted = 0;

    const startBtn = document.getElementById('breathing-start-btn');
    const stopBtn = document.getElementById('breathing-stop-btn');
    const cyclesEl = document.getElementById('breathing-cycles');
    if (startBtn) startBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = '';
    if (cyclesEl) cyclesEl.style.display = '';

    updateBreathingUI(breathingPhase, breathingSeconds);

    breathingInterval = setInterval(() => {
      breathingSeconds--;

      if (breathingSeconds <= 0) {
        breathingPhase = (breathingPhase + 1) % 3;
        breathingSeconds = 4;
        if (breathingPhase === 0) {
          cyclesCompleted++;
          const cyclesEl = document.getElementById('breathing-cycles');
          if (cyclesEl) cyclesEl.textContent = `${cyclesCompleted} cycle${cyclesCompleted !== 1 ? 's' : ''} completed`;
        }
      }

      updateBreathingUI(breathingPhase, breathingSeconds);
    }, 1000);
  }

  function updateBreathingUI(phase, secondsLeft) {
    const circle = document.getElementById('breathing-inner');
    const ring = document.getElementById('breathing-ring');
    const phaseLabel = document.getElementById('breathing-phase-label');
    const countEl = document.getElementById('breathing-count');
    const instrEl = document.getElementById('breathing-instruction');

    const phases = [
      { label: 'Breathe In', instruction: 'Slowly breathe in through your nose...', size: '130px', color: 'linear-gradient(135deg,var(--color-teal),var(--color-primary))', ringScale: 'scale(1.3)' },
      { label: 'Hold',       instruction: 'Hold gently...', size: '130px', color: 'linear-gradient(135deg,var(--color-primary),var(--color-primary-600))', ringScale: 'scale(1.3)' },
      { label: 'Breathe Out', instruction: 'Slowly breathe out through your mouth...', size: '90px', color: 'linear-gradient(135deg,var(--color-teal-500),var(--color-teal))', ringScale: 'scale(1)' },
    ];

    const p = phases[phase];
    if (phaseLabel) phaseLabel.textContent = p.label;
    if (countEl) countEl.textContent = secondsLeft;
    if (instrEl) instrEl.textContent = p.instruction;
    if (circle) {
      circle.style.width = p.size;
      circle.style.height = p.size;
      circle.style.background = p.color;
    }
    if (ring) {
      ring.style.transform = p.ringScale;
    }
  }

  function stopBreathing() {
    if (breathingInterval) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }
    breathingActive = false;
    breathingPhase = 0;
    breathingSeconds = 4;

    const startBtn = document.getElementById('breathing-start-btn');
    const stopBtn = document.getElementById('breathing-stop-btn');
    const cyclesEl = document.getElementById('breathing-cycles');
    const circle = document.getElementById('breathing-inner');
    const ring = document.getElementById('breathing-ring');
    const phaseLabel = document.getElementById('breathing-phase-label');
    const countEl = document.getElementById('breathing-count');
    const instrEl = document.getElementById('breathing-instruction');

    if (startBtn) startBtn.style.display = '';
    if (stopBtn) stopBtn.style.display = 'none';
    if (cyclesEl) cyclesEl.style.display = 'none';
    if (phaseLabel) phaseLabel.textContent = 'Ready';
    if (countEl) countEl.textContent = '4';
    if (instrEl) instrEl.textContent = '4 counts in → 4 counts hold → 4 counts out';
    if (circle) { circle.style.width = '100px'; circle.style.height = '100px'; circle.style.background = 'linear-gradient(135deg,var(--color-teal),var(--color-primary))'; }
    if (ring) ring.style.transform = '';
  }

  // ── RESET (for testing/debug) ── //
  function reset() {
    Storage.setPath('progress.orientationComplete', false);
    Storage.setPath('progress.orientationCompletedAt', null);
    Storage.setPath('orientationProgress', null);
    currentSection = 0;
    sectionsVisited = new Set();
  }

  // ── PUBLIC API ── //
  return { render, reset };

})();

window.OrientationModule = OrientationModule;
