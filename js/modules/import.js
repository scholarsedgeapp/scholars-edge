/* ============================================================
   SCHOLAR'S EDGE — Module 3: Results Import Hub
   Three intake methods: PDF upload, Screenshot paste, Quick Log.
   Primary data source for the entire app — everything feeds from here.
   ============================================================ */

const ImportModule = (() => {

  // ── CONSTANTS ── //

  const TEST_SOURCES = [
    { value: 'bluebook_7',  label: 'SAT Practice 7 (Baseline)' },
    { value: 'bluebook_8',  label: 'SAT Practice 8' },
    { value: 'bluebook_9',  label: 'SAT Practice 9' },
    { value: 'bluebook_10', label: 'SAT Practice 10' },
    { value: 'clt',         label: 'Classical Learning Test (CLT)' },
    { value: 'other',       label: 'Other Practice Test' },
  ];

  const TIME_PRESSURE = [
    { value: 'plenty',        label: 'Plenty of time — finished early' },
    { value: 'comfortable',   label: 'Comfortable — finished on time' },
    { value: 'slight',        label: 'Slight pressure — rushed a few questions' },
    { value: 'ran_out',       label: 'Ran out of time — left blanks' },
  ];

  const RW_QUESTION_TYPES = [
    { value: 'main_idea',         label: 'Main Idea / Central Theme', skill: 'main_idea' },
    { value: 'key_detail',        label: 'Key Detail / Supporting Evidence', skill: 'main_idea' },
    { value: 'inference',         label: 'Inference / Implication', skill: 'inference' },
    { value: 'command_of_evidence', label: 'Command of Evidence (Textual)', skill: 'inference' },
    { value: 'command_quant',     label: 'Command of Evidence (Quantitative)', skill: 'data_analysis' },
    { value: 'vocabulary',        label: 'Vocabulary in Context / Word Choice', skill: 'inference' },
    { value: 'text_structure',    label: 'Text Structure / Purpose', skill: 'main_idea' },
    { value: 'cross_text',        label: 'Cross-Text Connection', skill: 'inference' },
    { value: 'rhetorical_synthesis', label: 'Rhetorical Synthesis / Notes', skill: 'transitions' },
    { value: 'transitions',       label: 'Transitions (Logic / Flow)', skill: 'transitions' },
    { value: 'grammar',           label: 'Grammar / Usage', skill: 'grammar' },
    { value: 'subject_verb',      label: 'Subject-Verb Agreement', skill: 'grammar' },
    { value: 'pronoun',           label: 'Pronoun Reference / Agreement', skill: 'grammar' },
    { value: 'verb_tense',        label: 'Verb Tense Consistency', skill: 'grammar' },
    { value: 'punctuation',       label: 'Punctuation / Sentence Boundaries', skill: 'punctuation' },
    { value: 'modifier',          label: 'Modifier Placement', skill: 'grammar' },
  ];

  const MATH_QUESTION_TYPES = [
    { value: 'linear_equations',  label: 'Linear Equations (1 variable)', skill: 'linear_algebra' },
    { value: 'linear_functions',  label: 'Linear Functions / Graphs', skill: 'linear_algebra' },
    { value: 'systems_equations', label: 'Systems of Equations / Inequalities', skill: 'linear_algebra' },
    { value: 'linear_inequalities', label: 'Linear Inequalities', skill: 'linear_algebra' },
    { value: 'quadratic',         label: 'Quadratic Equations / Functions', skill: 'advanced_math' },
    { value: 'polynomial',        label: 'Polynomial / Rational Expressions', skill: 'advanced_math' },
    { value: 'radical',           label: 'Radical / Exponential Functions', skill: 'advanced_math' },
    { value: 'functions_composite', label: 'Functions (Composition / Notation)', skill: 'advanced_math' },
    { value: 'geometry',          label: 'Geometry (Area / Perimeter / Volume)', skill: 'data_analysis' },
    { value: 'trigonometry',      label: 'Trigonometry / Right Triangles', skill: 'advanced_math' },
    { value: 'statistics',        label: 'Statistics / Data Analysis', skill: 'data_analysis' },
    { value: 'probability',       label: 'Probability / Sample Spaces', skill: 'data_analysis' },
    { value: 'rates_ratios',      label: 'Rates / Ratios / Proportions', skill: 'data_analysis' },
    { value: 'percentages',       label: 'Percentages / Growth Models', skill: 'data_analysis' },
    { value: 'data_tables',       label: 'Data Tables / Charts / Graphs', skill: 'data_analysis' },
  ];

  const ERROR_TYPES = [
    { value: 'trap_answer',  label: 'Trap Answer — fell for a wrong answer trap', icon: '⚠️' },
    { value: 'careless',     label: 'Careless — small mistake, knew the answer', icon: '😬' },
    { value: 'timing',       label: 'Timing — ran out of time on this question', icon: '⏱' },
    { value: 'content_gap',  label: 'Content Gap — didn\'t know the underlying content', icon: '📚' },
    { value: 'unsure',       label: 'Not sure — need to review', icon: '🤔' },
  ];

  // Score → Band
  function scoreToBand(sectionScore) {
    if (sectionScore >= 740) return 7;
    if (sectionScore >= 670) return 6;
    if (sectionScore >= 610) return 5;
    if (sectionScore >= 560) return 4;
    if (sectionScore >= 500) return 3;
    if (sectionScore >= 400) return 2;
    return 1;
  }

  // Must match ScoreBandsModule's BANDS labels (score-bands.js) — these used to
  // diverge (e.g. Band 5 showed as "Strong Performer" here but "Proficient" on
  // the Score Bands page for the identical band), confirmed live during QA.
  // Score Bands is the canonical band-naming source; these are kept in sync
  // with it by hand since the two modules don't share a single label object.
  const BAND_LABELS = {
    1: 'Foundational',
    2: 'Emerging',
    3: 'Developing',
    4: 'Progressing',
    5: 'Proficient',
    6: 'Advanced',
    7: 'Elite',
  };

  const BAND_COLORS = {
    1: 'var(--band-1)',
    2: 'var(--band-2)',
    3: 'var(--band-3)',
    4: 'var(--band-4)',
    5: 'var(--band-5)',
    6: 'var(--band-6)',
    7: 'var(--band-7)',
  };

  // ── STATE ── //
  let selectedMethod = null;  // 'pdf' | 'screenshot' | 'quicklog'
  let currentScreen = 'hub';  // 'hub' | 'intake' | 'review' | 'success'
  let wrongAnswerCount = 0;
  let extractedData = null;
  let containerEl = null;
  let pastedImageDataUrl = null;
  let currentBackHandler = null;  // set by screenHeader(), consumed by showScreen()

  // ── MAIN RENDER ── //
  function render() {
    resetState();

    const div = document.createElement('div');
    div.className = 'animate-fade-in';
    div.id = 'import-root';
    containerEl = div;

    div.innerHTML = buildHubScreen();

    requestAnimationFrame(() => {
      wireHub(div);
      if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
    });

    return div;
  }

  function resetState() {
    selectedMethod = null;
    currentScreen = 'hub';
    wrongAnswerCount = 0;
    extractedData = null;
    pastedImageDataUrl = null;
  }

  // ── SCREEN SWITCHER ── //
  function showScreen(screenHtml, wireFn) {
    if (!containerEl) return;
    containerEl.innerHTML = screenHtml;
    requestAnimationFrame(() => {
      wireFn && wireFn(containerEl);
      if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
      // screenHeader() builds a "← Back" button (#screen-back-btn) and is
      // called with an onBack callback, but it only returns an HTML string —
      // it has no way to attach a listener to the button it just described.
      // It stashes the callback in currentBackHandler instead; this is the
      // single choke point (same pattern as the scroll-reset fix below) that
      // actually wires it up. Confirmed live: every screen using
      // screenHeader() (Upload PDF, Paste Screenshot, Quick Log, Review) had
      // a dead "Back" button before this — clicking it did nothing.
      const backBtn = containerEl.querySelector('#screen-back-btn');
      if (backBtn && currentBackHandler) {
        backBtn.addEventListener('click', currentBackHandler);
      }
      // Internal screen swap (hub → intake → review → success) doesn't go
      // through Router.render(), so its scroll reset never fires here.
      // #main-content has no overflow rule (the window is the real scrolling
      // element — see layout.css), so an instant window.scrollTo is used
      // instead of scrollIntoView's smooth animation, which left the screen
      // scrolled to wherever the previous (often longer) screen left off —
      // same root cause confirmed in orientation.js.
      window.scrollTo(0, 0);
    });
  }

  // ── HUB SCREEN ── //
  function buildHubScreen() {
    const isFirstImport = !Storage.isFirstImportComplete();
    const importHistory = Storage.getImportHistory();

    return `
      <div class="page-header-row mb-6">
        <div>
          <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
            letter-spacing:var(--ls-widest);color:var(--color-teal);margin-bottom:var(--space-2);">
            Import Results
          </div>
          <h1 style="margin-bottom:var(--space-2);">
            ${isFirstImport ? 'Import Your SAT Practice 7 Results' : 'Import New Test Results'}
          </h1>
          <p class="page-subtitle">
            ${isFirstImport
              ? 'Your Scholar\'s Edge plan builds instantly from your scores. This is where everything starts.'
              : `${importHistory.length} test${importHistory.length !== 1 ? 's' : ''} imported. Add your latest Bluebook results.`}
          </p>
        </div>
        ${!isFirstImport ? `
          <button class="btn btn-ghost" onclick="ImportModule.showHistory()">
            <i data-lucide="history" style="width:16px;height:16px;"></i>
            Import History
          </button>
        ` : ''}
      </div>

      ${isFirstImport ? `
        <div class="alert alert-info mb-6" style="border-left:4px solid var(--color-teal);">
          <i data-lucide="info" class="alert-icon"></i>
          <div class="alert-body">
            <div class="alert-title">Before you import</div>
            <div class="alert-desc">
              You need SAT Practice 7 results from the Bluebook app.
              In Bluebook: tap <strong>Full-Length Practice</strong> → Test Type: <strong>SAT</strong> → select <strong>SAT Practice 7</strong>.
              After completing the test, download your score report PDF from the results screen, then come back here and use Method 1 (Upload PDF).
            </div>
          </div>
        </div>
      ` : ''}

      <div class="grid-3 mb-8" style="gap:var(--space-5);">
        ${methodCard('pdf', '📄', 'Upload PDF', 'Recommended',
          'Upload your College Board score report PDF. Scores and subscores extract automatically.',
          'btn-accent', true)}
        ${methodCard('screenshot', '📸', 'Paste Screenshot',
          'Alternative',
          'Mac: Shift+Cmd+4, then paste here. Works for any score report screenshot.',
          'btn-outline', false)}
        ${methodCard('quicklog', '✏️', 'Quick Log',
          'Manual Fallback',
          'Enter scores manually with dropdown fields. Takes 3–5 minutes. Always works.',
          'btn-outline', false)}
      </div>

      ${importHistory.length > 0 ? buildRecentImportsRow(importHistory) : ''}

      <div class="card card-body" style="background:var(--color-neutral-50);margin-top:var(--space-6);">
        <div style="display:flex;gap:var(--space-5);align-items:flex-start;flex-wrap:wrap;">
          ${importTip('shield-check', 'Bluebook Tests 7–10 only for full tests', 'Tests 1–6 are outdated (replaced Feb 2025). Use only Tests 7, 8, 9, and 10 for full test simulations.')}
          ${importTip('lock', 'Your data stays private', 'All results are stored only on your device. Nothing is uploaded to any server.')}
          ${importTip('refresh-cw', 'You can re-import anytime', 'Importing the same test again will add a second entry. Use the review screen to confirm before saving.')}
        </div>
      </div>
    `;
  }

  function methodCard(id, emoji, title, badge, desc, btnClass, featured) {
    return `
      <div class="card card-body" id="method-card-${id}"
        style="${featured ? 'border:2px solid var(--color-accent);' : ''}position:relative;cursor:pointer;"
        onclick="ImportModule.selectMethod('${id}')">
        ${featured ? `
          <div style="position:absolute;top:-10px;left:var(--space-5);">
            <span style="background:var(--color-accent);color:var(--color-primary);font-size:9px;
              font-weight:var(--fw-bold);padding:3px 8px;border-radius:var(--radius-full);
              letter-spacing:var(--ls-wide);">RECOMMENDED</span>
          </div>
        ` : ''}
        <div style="font-size:2.5rem;margin-bottom:var(--space-3);">${emoji}</div>
        <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2);">
          <span style="font-weight:var(--fw-bold);color:var(--color-primary);font-size:var(--text-md);">${title}</span>
          <span class="badge badge-neutral" style="font-size:9px;">${badge}</span>
        </div>
        <p style="font-size:var(--text-sm);color:var(--color-neutral-500);margin-bottom:var(--space-5);
          line-height:var(--lh-relaxed);">${desc}</p>
        <button class="btn ${btnClass} btn-block" data-method="${id}">
          ${title} →
        </button>
      </div>
    `;
  }

  function buildRecentImportsRow(history) {
    const recent = history.slice(-3).reverse();
    return `
      <div style="margin-top:var(--space-2);margin-bottom:var(--space-2);">
        <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
          letter-spacing:var(--ls-widest);color:var(--color-neutral-500);margin-bottom:var(--space-4);">
          Recent Imports
        </div>
        <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;">
          ${recent.map(imp => `
            <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3) var(--space-4);
              background:white;border:1px solid var(--color-neutral-200);border-radius:var(--radius-lg);">
              <div style="width:36px;height:36px;border-radius:var(--radius-md);
                background:var(--color-primary-50);display:flex;align-items:center;justify-content:center;">
                <i data-lucide="file-text" style="width:16px;height:16px;color:var(--color-primary);"></i>
              </div>
              <div>
                <div style="font-weight:var(--fw-semibold);font-size:var(--text-sm);color:var(--color-primary);">
                  ${formatTestLabel(imp.testSource)}
                </div>
                <div style="font-size:var(--text-xs);color:var(--color-neutral-500);">
                  ${imp.totalScore} total · ${imp.rwScore} RW · ${imp.mathScore} Math ·
                  ${new Date(imp.importedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function importTip(icon, title, desc) {
    return `
      <div style="display:flex;gap:var(--space-3);align-items:flex-start;flex:1;min-width:200px;">
        <i data-lucide="${icon}" style="width:18px;height:18px;color:var(--color-teal);flex-shrink:0;margin-top:2px;"></i>
        <div>
          <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);color:var(--color-primary);
            margin-bottom:2px;">${title}</div>
          <div style="font-size:var(--text-xs);color:var(--color-neutral-500);line-height:var(--lh-relaxed);">${desc}</div>
        </div>
      </div>
    `;
  }

  function wireHub(root) {
    root.querySelectorAll('[data-method]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectMethod(btn.getAttribute('data-method'));
      });
    });
  }

  // ── METHOD SELECTION ── //
  function selectMethod(method) {
    selectedMethod = method;
    currentScreen = 'intake';
    switch (method) {
      case 'pdf':       showScreen(buildPdfScreen(), wirePdfScreen); break;
      case 'screenshot': showScreen(buildScreenshotScreen(), wireScreenshotScreen); break;
      case 'quicklog':  showScreen(buildQuickLogScreen({}), wireQuickLogScreen); break;
    }
  }

  // ── PDF SCREEN ── //
  function buildPdfScreen() {
    return `
      <div>
        ${screenHeader('📄', 'Upload Score Report PDF', 'Drag and drop your Bluebook PDF or click to browse.',
          () => showScreen(buildHubScreen(), wireHub))}

        <div id="pdf-drop-zone"
          style="border:2px dashed var(--color-neutral-300);border-radius:var(--radius-xl);
            padding:var(--space-16) var(--space-8);text-align:center;cursor:pointer;
            background:var(--color-neutral-50);transition:all 0.2s;margin-bottom:var(--space-6);">
          <div style="font-size:3rem;margin-bottom:var(--space-4);">📄</div>
          <div style="font-size:var(--text-lg);font-weight:var(--fw-semibold);color:var(--color-primary);
            margin-bottom:var(--space-2);">
            Drop your PDF here
          </div>
          <div style="font-size:var(--text-sm);color:var(--color-neutral-500);margin-bottom:var(--space-6);">
            or click to browse your files
          </div>
          <input type="file" id="pdf-file-input" accept=".pdf" style="display:none;">
          <button class="btn btn-accent btn-lg" id="pdf-browse-btn">
            <i data-lucide="folder-open" style="width:18px;height:18px;"></i>
            Choose PDF File
          </button>
          <div style="font-size:var(--text-xs);color:var(--color-neutral-400);margin-top:var(--space-4);">
            Supported: College Board Bluebook score reports
          </div>
        </div>

        <div id="pdf-parse-status" style="display:none;"></div>

        <div class="card card-body" style="background:var(--color-primary-50);">
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-3);">
            How to get your PDF from Bluebook
          </div>
          <div style="display:flex;flex-direction:column;gap:var(--space-3);">
            ${pdfStep('1', 'Open Bluebook on your device')}
            ${pdfStep('2', 'Tap your completed practice test')}
            ${pdfStep('3', 'Look for "View Score Report" or the download icon')}
            ${pdfStep('4', 'Download or save the PDF to your computer')}
            ${pdfStep('5', 'Come back here and upload it')}
          </div>
        </div>

        <div style="margin-top:var(--space-6);text-align:center;">
          <button class="btn btn-ghost text-muted" onclick="ImportModule.selectMethod('quicklog')">
            Don't have the PDF? Use Quick Log instead →
          </button>
        </div>
      </div>
    `;
  }

  function pdfStep(num, text) {
    return `
      <div style="display:flex;gap:var(--space-3);align-items:center;">
        <div style="width:22px;height:22px;border-radius:50%;background:var(--color-primary);
          color:white;font-size:var(--text-xs);font-weight:var(--fw-bold);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;">${num}</div>
        <span style="font-size:var(--text-sm);color:var(--color-neutral-700);">${text}</span>
      </div>
    `;
  }

  function wirePdfScreen(root) {
    const dropZone = root.querySelector('#pdf-drop-zone');
    const fileInput = root.querySelector('#pdf-file-input');
    const browseBtn = root.querySelector('#pdf-browse-btn');

    browseBtn?.addEventListener('click', () => fileInput?.click());
    dropZone?.addEventListener('click', (e) => {
      if (e.target !== browseBtn && !browseBtn?.contains(e.target)) {
        fileInput?.click();
      }
    });

    // Drag and drop
    dropZone?.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--color-teal)';
      dropZone.style.background = 'var(--color-teal-50)';
    });

    dropZone?.addEventListener('dragleave', () => {
      dropZone.style.borderColor = 'var(--color-neutral-300)';
      dropZone.style.background = 'var(--color-neutral-50)';
    });

    dropZone?.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--color-neutral-300)';
      dropZone.style.background = 'var(--color-neutral-50)';
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        handlePdfFile(file);
      } else {
        UI.toast('Please drop a PDF file.', 'warning');
      }
    });

    fileInput?.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) handlePdfFile(file);
    });
  }

  async function handlePdfFile(file) {
    const statusEl = containerEl?.querySelector('#pdf-parse-status');
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.innerHTML = `
        <div class="alert alert-info" style="margin-bottom:var(--space-4);">
          <div class="spinner spinner-sm" style="flex-shrink:0;"></div>
          <div class="alert-body">
            <div class="alert-title">Parsing PDF…</div>
            <div class="alert-desc">Extracting scores from ${UI.escapeHtml(file.name)}</div>
          </div>
        </div>
      `;
    }

    try {
      // Load PDF.js dynamically
      await loadPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= Math.min(pdfDoc.numPages, 10); i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(' ') + '\n';
      }

      const parsed = parsePdfText(fullText);
      parsed.importMethod = 'pdf';
      parsed.fileName = file.name;

      if (statusEl) statusEl.style.display = 'none';

      // Go to review screen with parsed data
      showScreen(buildReviewScreen(parsed), (root) => wireReviewScreen(root, parsed));

    } catch (err) {
      console.error('[Import] PDF parse error:', err);
      if (statusEl) {
        statusEl.innerHTML = `
          <div class="alert alert-warning" style="margin-bottom:var(--space-4);">
            <i data-lucide="alert-triangle" class="alert-icon"></i>
            <div class="alert-body">
              <div class="alert-title">Couldn't extract scores automatically</div>
              <div class="alert-desc">
                PDF parsing failed or scores weren't found. You can enter them manually in Quick Log.
                <br><br>
                <button class="btn btn-accent btn-sm mt-2" onclick="ImportModule.selectMethod('quicklog')">
                  Enter Manually →
                </button>
              </div>
            </div>
          </div>
        `;
        if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
      }
    }
  }

  function loadPdfJs() {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function parsePdfText(text) {
    const result = {
      testSource: '',
      dateTaken: '',
      totalScore: null,
      rwScore: null,
      mathScore: null,
      timePressure: 'comfortable',
      wrongAnswers: [],
      notes: '',
      // Subscores (if found)
      subScores: {
        informationIdeas: null,
        craftStructure: null,
        expressionIdeas: null,
        englishConventions: null,
        algebra: null,
        advancedMath: null,
        problemSolving: null,
        geometry: null,
      },
      parseConfidence: 'low',
    };

    const t = text.replace(/\s+/g, ' ');

    // ── Total Score ──
    const totalMatch =
      t.match(/Total Score[:\s]+(\d{3,4})/i) ||
      t.match(/(?:Overall|Composite|Final) Score[:\s]+(\d{3,4})/i) ||
      t.match(/Score[:\s]+(1[0-5]\d{2}|[4-9]\d{2})/); // 400-1600 range
    if (totalMatch) {
      const v = parseInt(totalMatch[1]);
      if (v >= 400 && v <= 1600) result.totalScore = v;
    }

    // ── Section Scores ──
    const rwMatch =
      t.match(/Reading and Writing[:\s]+(\d{3})/i) ||
      t.match(/Evidence-Based Reading[:\s]+(\d{3})/i) ||
      t.match(/(?:RW|Reading\/Writing|Reading & Writing)[:\s]+(\d{3})/i) ||
      t.match(/Reading[:\s]+(\d{3})/i);
    if (rwMatch) {
      const v = parseInt(rwMatch[1]);
      if (v >= 200 && v <= 800) result.rwScore = v;
    }

    const mathMatch =
      t.match(/Math(?:ematics)?[:\s]+(\d{3})/i) ||
      t.match(/Math Section[:\s]+(\d{3})/i);
    if (mathMatch) {
      const v = parseInt(mathMatch[1]);
      if (v >= 200 && v <= 800) result.mathScore = v;
    }

    // Derive missing score if we have two of three
    if (result.totalScore && result.rwScore && !result.mathScore) {
      result.mathScore = result.totalScore - result.rwScore;
    }
    if (result.totalScore && result.mathScore && !result.rwScore) {
      result.rwScore = result.totalScore - result.mathScore;
    }
    if (!result.totalScore && result.rwScore && result.mathScore) {
      result.totalScore = result.rwScore + result.mathScore;
    }

    // ── Test Source ──
    if (/practice test\s*[#]?\s*7/i.test(t)) result.testSource = 'bluebook_7';
    else if (/practice test\s*[#]?\s*8/i.test(t)) result.testSource = 'bluebook_8';
    else if (/practice test\s*[#]?\s*9/i.test(t)) result.testSource = 'bluebook_9';
    else if (/practice test\s*[#]?\s*10/i.test(t)) result.testSource = 'bluebook_10';
    else if (/college board|bluebook/i.test(t)) result.testSource = 'bluebook_7'; // best guess
    else if (/classical learning/i.test(t)) result.testSource = 'clt';
    else if (/khan academy/i.test(t)) result.testSource = 'khan';

    // ── Date ──
    const dateMatch =
      t.match(/(?:Test Date|Date Taken|Completed)[:\s]+([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i) ||
      t.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (dateMatch) {
      try {
        const d = new Date(dateMatch[1]);
        if (!isNaN(d.getTime())) result.dateTaken = d.toISOString().slice(0, 10);
      } catch (e) { /* ignore */ }
    }

    // ── Subscores (Bluebook domain breakdown) ──
    const infoMatch = t.match(/Information and Ideas[:\s]+(\d+)/i);
    if (infoMatch) result.subScores.informationIdeas = parseInt(infoMatch[1]);

    const craftMatch = t.match(/Craft and Structure[:\s]+(\d+)/i);
    if (craftMatch) result.subScores.craftStructure = parseInt(craftMatch[1]);

    const expressionMatch = t.match(/Expression of Ideas[:\s]+(\d+)/i);
    if (expressionMatch) result.subScores.expressionIdeas = parseInt(expressionMatch[1]);

    const conventionsMatch = t.match(/Standard English Conventions[:\s]+(\d+)/i);
    if (conventionsMatch) result.subScores.englishConventions = parseInt(conventionsMatch[1]);

    const algebraMatch = t.match(/Algebra[:\s]+(\d+)/i);
    if (algebraMatch) result.subScores.algebra = parseInt(algebraMatch[1]);

    const advMathMatch = t.match(/Advanced Math[:\s]+(\d+)/i);
    if (advMathMatch) result.subScores.advancedMath = parseInt(advMathMatch[1]);

    const psMatch = t.match(/Problem.Solving[:\s]+(\d+)/i) || t.match(/Data Analysis[:\s]+(\d+)/i);
    if (psMatch) result.subScores.problemSolving = parseInt(psMatch[1]);

    const geoMatch = t.match(/Geometry[:\s]+(\d+)/i);
    if (geoMatch) result.subScores.geometry = parseInt(geoMatch[1]);

    // Confidence rating
    if (result.totalScore && result.rwScore && result.mathScore) {
      result.parseConfidence = result.testSource ? 'high' : 'medium';
    } else if (result.totalScore || (result.rwScore && result.mathScore)) {
      result.parseConfidence = 'medium';
    }

    return result;
  }

  // ── SCREENSHOT SCREEN ── //
  function buildScreenshotScreen() {
    return `
      <div>
        ${screenHeader('📸', 'Paste Score Report Screenshot', 'Take a screenshot of your results, then paste it here.',
          () => showScreen(buildHubScreen(), wireHub))}

        <div id="screenshot-paste-area"
          style="border:2px dashed var(--color-neutral-300);border-radius:var(--radius-xl);
            padding:var(--space-16) var(--space-8);text-align:center;cursor:pointer;
            background:var(--color-neutral-50);margin-bottom:var(--space-6);position:relative;"
          tabindex="0">
          <div id="screenshot-preview-container" style="display:none;"></div>
          <div id="screenshot-empty-state">
            <div style="font-size:3rem;margin-bottom:var(--space-4);">📸</div>
            <div style="font-size:var(--text-lg);font-weight:var(--fw-semibold);color:var(--color-primary);
              margin-bottom:var(--space-2);">
              Paste your screenshot here
            </div>
            <div style="font-size:var(--text-sm);color:var(--color-neutral-500);margin-bottom:var(--space-2);">
              Click this area, then press <kbd style="background:var(--color-neutral-200);padding:2px 6px;
              border-radius:4px;font-family:var(--font-mono);font-size:var(--text-xs);">Ctrl+V</kbd>
              (or <kbd style="background:var(--color-neutral-200);padding:2px 6px;
              border-radius:4px;font-family:var(--font-mono);font-size:var(--text-xs);">Cmd+V</kbd> on Mac)
            </div>
            <div style="font-size:var(--text-xs);color:var(--color-neutral-400);">
              Screenshot must show your test name and section scores
            </div>
          </div>
        </div>

        <div class="card card-body" style="background:var(--color-primary-50);margin-bottom:var(--space-5);">
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-3);">
            How to take a score report screenshot
          </div>
          <div class="grid-2" style="gap:var(--space-4);">
            ${screenshotTip('🖥️', 'Mac', 'Press Shift+Cmd+4, drag to select the score area. The file saves to Desktop. Then paste here with Cmd+V.')}
            ${screenshotTip('💻', 'Windows', 'Press Windows+Shift+S, drag to select. The image copies to clipboard. Then paste here with Ctrl+V.')}
          </div>
        </div>

        <div id="screenshot-actions" style="display:none;text-align:center;">
          <button class="btn btn-accent btn-lg" id="screenshot-confirm-btn">
            <i data-lucide="check" style="width:18px;height:18px;"></i>
            Use This Screenshot — Enter Scores Manually
          </button>
          <div style="margin-top:var(--space-3);">
            <button class="btn btn-ghost text-muted" id="screenshot-clear-btn">
              Clear and paste again
            </button>
          </div>
        </div>

        <div style="margin-top:var(--space-6);text-align:center;">
          <button class="btn btn-ghost text-muted" onclick="ImportModule.selectMethod('quicklog')">
            Skip screenshot — go to Quick Log →
          </button>
        </div>
      </div>
    `;
  }

  function screenshotTip(emoji, os, instructions) {
    return `
      <div style="display:flex;gap:var(--space-3);align-items:flex-start;">
        <span style="font-size:1.5rem;">${emoji}</span>
        <div>
          <div style="font-weight:var(--fw-semibold);color:var(--color-primary);font-size:var(--text-sm);">${os}</div>
          <div style="font-size:var(--text-xs);color:var(--color-neutral-600);line-height:var(--lh-relaxed);">${instructions}</div>
        </div>
      </div>
    `;
  }

  function wireScreenshotScreen(root) {
    const pasteArea = root.querySelector('#screenshot-paste-area');
    const previewContainer = root.querySelector('#screenshot-preview-container');
    const emptyState = root.querySelector('#screenshot-empty-state');
    const actionsRow = root.querySelector('#screenshot-actions');
    const confirmBtn = root.querySelector('#screenshot-confirm-btn');
    const clearBtn = root.querySelector('#screenshot-clear-btn');

    // Handle paste event
    pasteArea?.addEventListener('click', () => pasteArea.focus());

    document.addEventListener('paste', function handlePaste(e) {
      if (!containerEl?.contains(document.activeElement) && document.activeElement !== document.body) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (ev) => {
            pastedImageDataUrl = ev.target.result;

            if (previewContainer && emptyState && actionsRow) {
              previewContainer.style.display = 'block';
              previewContainer.innerHTML = `
                <img src="${pastedImageDataUrl}" alt="Score report screenshot"
                  style="max-width:100%;max-height:400px;border-radius:var(--radius-lg);
                    box-shadow:var(--shadow-md);">
              `;
              emptyState.style.display = 'none';
              actionsRow.style.display = 'block';
              if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
            }
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    });

    confirmBtn?.addEventListener('click', () => {
      // Go to Quick Log with screenshot context (pre-filled testSource if detectable)
      showScreen(buildQuickLogScreen({ hasScreenshot: true }), wireQuickLogScreen);
    });

    clearBtn?.addEventListener('click', () => {
      pastedImageDataUrl = null;
      if (previewContainer) previewContainer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      if (actionsRow) actionsRow.style.display = 'none';
    });
  }

  // ── QUICK LOG SCREEN ── //
  function buildQuickLogScreen(prefilled = {}) {
    const { hasScreenshot } = prefilled;

    return `
      <div>
        ${screenHeader('✏️', 'Quick Log — Manual Entry',
          hasScreenshot
            ? 'Reference your screenshot and enter scores below.'
            : 'Enter your test scores manually. Takes 3–5 minutes.',
          () => showScreen(buildHubScreen(), wireHub))}

        ${hasScreenshot && pastedImageDataUrl ? `
          <div style="margin-bottom:var(--space-6);">
            <details>
              <summary style="cursor:pointer;font-size:var(--text-sm);font-weight:var(--fw-semibold);
                color:var(--color-primary);padding:var(--space-3);background:var(--color-neutral-50);
                border-radius:var(--radius-md);">
                📸 View your screenshot while filling out the form
              </summary>
              <div style="padding:var(--space-4);background:var(--color-neutral-50);border-radius:0 0 var(--radius-md) var(--radius-md);">
                <img src="${pastedImageDataUrl}" alt="Your screenshot"
                  style="max-width:100%;border-radius:var(--radius-md);">
              </div>
            </details>
          </div>
        ` : ''}

        <form id="quick-log-form" onsubmit="return false;">

          <!-- Section 1: Test Info -->
          <div class="card mb-6">
            <div class="card-header">
              <h3 style="font-size:var(--text-lg);">
                <i data-lucide="clipboard" style="width:20px;height:20px;display:inline-block;
                  vertical-align:-4px;margin-right:var(--space-2);"></i>
                Test Information
              </h3>
            </div>
            <div class="card-body">
              <div class="grid-2" style="gap:var(--space-5);">
                <div class="form-group">
                  <label class="form-label" for="ql-test-source">
                    Test Source <span style="color:var(--color-error);">*</span>
                  </label>
                  <select class="form-select" id="ql-test-source" required>
                    <option value="">— Select test —</option>
                    ${TEST_SOURCES.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="ql-date-taken">Date Taken</label>
                  <input type="date" class="form-input" id="ql-date-taken"
                    value="${new Date().toISOString().slice(0, 10)}"
                    max="${new Date().toISOString().slice(0, 10)}">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="ql-time-pressure">Time Pressure Experienced</label>
                <select class="form-select" id="ql-time-pressure">
                  ${TIME_PRESSURE.map(t =>
                    `<option value="${t.value}">${t.label}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Section 2: Scores -->
          <div class="card mb-6">
            <div class="card-header">
              <h3 style="font-size:var(--text-lg);">
                <i data-lucide="bar-chart-2" style="width:20px;height:20px;display:inline-block;
                  vertical-align:-4px;margin-right:var(--space-2);"></i>
                Section Scores
              </h3>
              <span style="font-size:var(--text-xs);color:var(--color-neutral-500);">
                Each section: 200–800
              </span>
            </div>
            <div class="card-body">
              <div class="grid-2" style="gap:var(--space-5);margin-bottom:var(--space-5);">
                <div class="form-group">
                  <label class="form-label" for="ql-rw-score">
                    Reading & Writing <span style="color:var(--color-error);">*</span>
                  </label>
                  <input type="number" class="form-input" id="ql-rw-score"
                    min="200" max="800" placeholder="e.g. 650" required>
                  <div class="form-hint">200 – 800</div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="ql-math-score">
                    Math <span style="color:var(--color-error);">*</span>
                  </label>
                  <input type="number" class="form-input" id="ql-math-score"
                    min="200" max="800" placeholder="e.g. 580" required>
                  <div class="form-hint">200 – 800</div>
                </div>
              </div>

              <!-- Live total display -->
              <div id="ql-total-display"
                style="padding:var(--space-4);background:var(--color-primary-50);
                  border-radius:var(--radius-lg);text-align:center;display:none;">
                <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);
                  text-transform:uppercase;letter-spacing:var(--ls-widest);
                  color:var(--color-teal);margin-bottom:var(--space-1);">Total Score</div>
                <div id="ql-total-value" style="font-family:var(--font-heading);font-size:var(--text-3xl);
                  font-weight:var(--fw-extrabold);color:var(--color-primary);line-height:1;">
                  —
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Wrong Answers (optional but valuable) -->
          <div class="card mb-6">
            <div class="card-header">
              <h3 style="font-size:var(--text-lg);">
                <i data-lucide="list-x" style="width:20px;height:20px;display:inline-block;
                  vertical-align:-4px;margin-right:var(--space-2);"></i>
                Wrong Answers
                <span style="font-size:var(--text-xs);font-weight:var(--fw-regular);
                  color:var(--color-neutral-500);margin-left:var(--space-2);">
                  Optional but unlocks per-skill band mapping
                </span>
              </h3>
              <span class="badge badge-neutral" id="wrong-answer-count-badge">0 entered</span>
            </div>
            <div class="card-body">
              <div class="alert alert-info mb-5" style="font-size:var(--text-xs);">
                <i data-lucide="info" class="alert-icon" style="width:14px;height:14px;"></i>
                <div class="alert-body">
                  <div class="alert-desc">
                    Entering wrong answers maps each mistake to a skill area and gives you a precise
                    per-skill band profile. If you skip this now, you can add them later.
                  </div>
                </div>
              </div>

              <div id="wrong-answers-list" style="display:flex;flex-direction:column;gap:var(--space-3);
                margin-bottom:var(--space-4);">
                <!-- Wrong answer entries go here -->
              </div>

              <div style="display:flex;gap:var(--space-3);">
                <button type="button" class="btn btn-outline btn-sm" id="add-rw-wrong">
                  <i data-lucide="plus" style="width:14px;height:14px;"></i>
                  Add RW Wrong Answer
                </button>
                <button type="button" class="btn btn-outline btn-sm" id="add-math-wrong">
                  <i data-lucide="plus" style="width:14px;height:14px;"></i>
                  Add Math Wrong Answer
                </button>
              </div>
            </div>
          </div>

          <!-- Section 4: Notes -->
          <div class="card mb-6">
            <div class="card-header">
              <h3 style="font-size:var(--text-lg);">
                <i data-lucide="message-square" style="width:20px;height:20px;display:inline-block;
                  vertical-align:-4px;margin-right:var(--space-2);"></i>
                Session Notes
                <span style="font-size:var(--text-xs);font-weight:var(--fw-regular);
                  color:var(--color-neutral-500);margin-left:var(--space-2);">Optional</span>
              </h3>
            </div>
            <div class="card-body">
              <div class="form-group" style="margin:0;">
                <textarea class="form-textarea" id="ql-notes" rows="3"
                  placeholder="How did it feel? Any distractions? Anything notable about the session..."></textarea>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div style="display:flex;gap:var(--space-4);justify-content:flex-end;padding-top:var(--space-4);
            border-top:1px solid var(--color-neutral-200);">
            <button type="button" class="btn btn-ghost"
              onclick="ImportModule.backToHub()">
              Cancel
            </button>
            <button type="submit" class="btn btn-accent btn-lg" id="ql-submit-btn">
              <i data-lucide="arrow-right" style="width:18px;height:18px;"></i>
              Review & Import
            </button>
          </div>
        </form>
      </div>
    `;
  }

  function wireQuickLogScreen(root) {
    const rwInput = root.querySelector('#ql-rw-score');
    const mathInput = root.querySelector('#ql-math-score');
    const totalDisplay = root.querySelector('#ql-total-display');
    const totalValue = root.querySelector('#ql-total-value');
    const form = root.querySelector('#quick-log-form');
    const addRwBtn = root.querySelector('#add-rw-wrong');
    const addMathBtn = root.querySelector('#add-math-wrong');

    // Live total calculation
    function updateTotal() {
      const rw = parseInt(rwInput?.value) || 0;
      const math = parseInt(mathInput?.value) || 0;
      if (rw >= 200 && math >= 200) {
        const total = rw + math;
        if (totalDisplay) totalDisplay.style.display = 'block';
        if (totalValue) {
          totalValue.textContent = total;
          const band = scoreToBand(Math.round((rw + math) / 2));
          totalValue.style.color = BAND_COLORS[band] || 'var(--color-primary)';
        }
      } else {
        if (totalDisplay) totalDisplay.style.display = 'none';
      }
    }

    rwInput?.addEventListener('input', updateTotal);
    mathInput?.addEventListener('input', updateTotal);

    // Add wrong answer rows
    addRwBtn?.addEventListener('click', () => addWrongAnswerRow('rw'));
    addMathBtn?.addEventListener('click', () => addWrongAnswerRow('math'));

    // Form submit
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = collectQuickLogData(root);
      if (!data) return; // validation failed
      showScreen(buildReviewScreen(data), (r) => wireReviewScreen(r, data));
    });
  }

  function addWrongAnswerRow(section) {
    wrongAnswerCount++;
    const list = containerEl?.querySelector('#wrong-answers-list');
    const badge = containerEl?.querySelector('#wrong-answer-count-badge');
    if (!list) return;

    const types = section === 'rw' ? RW_QUESTION_TYPES : MATH_QUESTION_TYPES;
    const id = `wa-${wrongAnswerCount}`;

    const row = document.createElement('div');
    row.id = `wa-row-${id}`;
    row.className = 'import-wrong-row';
    row.style.cssText = `display:grid;grid-template-columns:80px 1fr 1fr auto;
      gap:var(--space-3);align-items:start;padding:var(--space-3);
      background:var(--color-neutral-50);border-radius:var(--radius-md);
      border-left:3px solid ${section === 'rw' ? 'var(--color-teal)' : 'var(--color-accent)'};`;

    row.innerHTML = `
      <div class="form-group" style="margin:0;">
        <label class="form-label" style="font-size:9px;">Q #</label>
        <input type="number" class="form-input wa-q-num" min="1" max="54"
          placeholder="${section === 'rw' ? '1-54' : '1-44'}" style="padding:var(--space-2);">
      </div>
      <div class="form-group" style="margin:0;">
        <label class="form-label" style="font-size:9px;">Question Type</label>
        <select class="form-select wa-type" style="padding:var(--space-2);">
          <option value="">— Select —</option>
          ${types.map(t => `<option value="${t.value}" data-skill="${t.skill}">${t.label}</option>`).join('')}
        </select>
      </div>
      <div class="form-group" style="margin:0;">
        <label class="form-label" style="font-size:9px;">Error Type</label>
        <select class="form-select wa-error" style="padding:var(--space-2);">
          ${ERROR_TYPES.map(e => `<option value="${e.value}">${e.icon} ${e.label.split(' — ')[0]}</option>`).join('')}
        </select>
      </div>
      <button type="button" class="btn btn-icon" style="margin-top:20px;color:var(--color-error);
        background:transparent;border:none;cursor:pointer;padding:var(--space-2);"
        onclick="document.getElementById('wa-row-${id}').remove();
          document.querySelectorAll('.wa-q-num').forEach((_, i) => {});
          const b = document.querySelector('#wrong-answer-count-badge');
          if(b) b.textContent = document.querySelectorAll('[id^=wa-row-]').length + ' entered';">
        <i data-lucide="x" style="width:16px;height:16px;"></i>
      </button>
    `;

    list.appendChild(row);
    if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });

    // Update badge count
    if (badge) {
      const count = list.querySelectorAll('[id^="wa-row-"]').length;
      badge.textContent = `${count} entered`;
    }
  }

  function collectQuickLogData(root) {
    const testSource = root.querySelector('#ql-test-source')?.value;
    const dateTaken = root.querySelector('#ql-date-taken')?.value;
    const rwScore = parseInt(root.querySelector('#ql-rw-score')?.value);
    const mathScore = parseInt(root.querySelector('#ql-math-score')?.value);
    const timePressure = root.querySelector('#ql-time-pressure')?.value;
    const notes = root.querySelector('#ql-notes')?.value || '';

    // Validate required fields
    if (!testSource) {
      UI.toast('Please select the test source.', 'warning', 'Required Field');
      root.querySelector('#ql-test-source')?.focus();
      return null;
    }

    if (!rwScore || rwScore < 200 || rwScore > 800) {
      UI.toast('Reading & Writing score must be between 200 and 800.', 'warning', 'Invalid Score');
      root.querySelector('#ql-rw-score')?.focus();
      return null;
    }

    if (!mathScore || mathScore < 200 || mathScore > 800) {
      UI.toast('Math score must be between 200 and 800.', 'warning', 'Invalid Score');
      root.querySelector('#ql-math-score')?.focus();
      return null;
    }

    // Collect wrong answers
    const wrongAnswers = [];
    root.querySelectorAll('[id^="wa-row-"]').forEach(row => {
      const qNum = row.querySelector('.wa-q-num')?.value;
      const typeSelect = row.querySelector('.wa-type');
      const typeVal = typeSelect?.value;
      const skillVal = typeSelect?.options[typeSelect.selectedIndex]?.getAttribute('data-skill') || '';
      const errorType = row.querySelector('.wa-error')?.value;

      if (typeVal) { // at least type is required
        wrongAnswers.push({
          questionNumber: qNum ? parseInt(qNum) : null,
          questionType: typeVal,
          skillArea: skillVal,
          errorType: errorType || 'unsure',
        });
      }
    });

    return {
      testSource,
      dateTaken: dateTaken || new Date().toISOString().slice(0, 10),
      rwScore,
      mathScore,
      totalScore: rwScore + mathScore,
      timePressure,
      wrongAnswers,
      notes,
      importMethod: 'quick_log',
      subScores: {
        informationIdeas: null,
        craftStructure: null,
        expressionIdeas: null,
        englishConventions: null,
        algebra: null,
        advancedMath: null,
        problemSolving: null,
        geometry: null,
      },
      parseConfidence: wrongAnswers.length > 0 ? 'medium' : 'low',
    };
  }

  // ── REVIEW SCREEN ── //
  function buildReviewScreen(data) {
    const {
      testSource, dateTaken, totalScore, rwScore, mathScore,
      timePressure, wrongAnswers, notes, importMethod, parseConfidence, fileName
    } = data;

    const isFirstImport = !Storage.isFirstImportComplete();
    const rwBand = rwScore ? scoreToBand(rwScore) : null;
    const mathBand = mathScore ? scoreToBand(mathScore) : null;

    const hasMissingRequired = !testSource || !rwScore || !mathScore;
    const hasWrongAnswers = wrongAnswers && wrongAnswers.length > 0;

    return `
      <div>
        ${screenHeader('🔍', 'Review Before Importing',
          'Confirm these scores are correct before saving to your Scholar\'s Edge profile.',
          () => showScreen(buildHubScreen(), wireHub))}

        ${parseConfidence === 'low' && importMethod === 'pdf' ? `
          <div class="alert alert-warning mb-5">
            <i data-lucide="alert-triangle" class="alert-icon"></i>
            <div class="alert-body">
              <div class="alert-title">Some fields need your attention</div>
              <div class="alert-desc">
                We couldn't extract all scores from the PDF. Please fill in the missing fields below.
              </div>
            </div>
          </div>
        ` : importMethod === 'pdf' && parseConfidence === 'high' ? `
          <div class="alert alert-success mb-5">
            <i data-lucide="check-circle" class="alert-icon"></i>
            <div class="alert-body">
              <div class="alert-title">Scores extracted successfully</div>
              <div class="alert-desc">
                Confirm the values below match your score report.
                ${fileName ? `<span style="color:var(--color-neutral-400);"> · ${UI.escapeHtml(fileName)}</span>` : ''}
              </div>
            </div>
          </div>
        ` : ''}

        <form id="review-form" onsubmit="return false;">

          <!-- Scores Preview Card -->
          <div class="card mb-6" style="border:2px solid var(--color-primary-100);">
            <div class="card-header">
              <h3>Score Summary</h3>
              ${isFirstImport ? `<span class="badge badge-accent">Your Baseline</span>` : ''}
            </div>
            <div class="card-body">
              <div class="grid-3" style="gap:var(--space-5);margin-bottom:var(--space-5);">
                <!-- Total -->
                <div style="text-align:center;padding:var(--space-5);
                  background:var(--color-primary-50);border-radius:var(--radius-lg);">
                  <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);
                    text-transform:uppercase;letter-spacing:var(--ls-wider);
                    color:var(--color-primary);margin-bottom:var(--space-1);">Total</div>
                  <div style="font-family:var(--font-heading);font-size:var(--text-4xl);
                    font-weight:var(--fw-extrabold);
                    color:${totalScore ? (BAND_COLORS[scoreToBand(Math.round(totalScore / 2))] || 'var(--color-primary)') : 'var(--color-neutral-400)'};
                    line-height:1;">
                    ${totalScore || '—'}
                  </div>
                  <div style="font-size:var(--text-xs);color:var(--color-neutral-400);margin-top:var(--space-1);">
                    out of 1600
                  </div>
                </div>
                <!-- RW -->
                <div style="text-align:center;padding:var(--space-5);
                  background:var(--color-teal-50);border-radius:var(--radius-lg);">
                  <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);
                    text-transform:uppercase;letter-spacing:var(--ls-wider);
                    color:var(--color-teal-500);margin-bottom:var(--space-1);">Reading & Writing</div>
                  <div style="font-family:var(--font-heading);font-size:var(--text-3xl);
                    font-weight:var(--fw-extrabold);
                    color:${rwBand ? BAND_COLORS[rwBand] : 'var(--color-neutral-400)'};line-height:1;">
                    ${rwScore || '—'}
                  </div>
                  ${rwBand ? `
                    <div style="font-size:var(--text-xs);color:${BAND_COLORS[rwBand]};
                      font-weight:var(--fw-semibold);margin-top:var(--space-1);">
                      Band ${rwBand}: ${BAND_LABELS[rwBand]}
                    </div>
                  ` : ''}
                </div>
                <!-- Math -->
                <div style="text-align:center;padding:var(--space-5);
                  background:var(--color-accent-50);border-radius:var(--radius-lg);">
                  <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);
                    text-transform:uppercase;letter-spacing:var(--ls-wider);
                    color:var(--color-accent-600);margin-bottom:var(--space-1);">Math</div>
                  <div style="font-family:var(--font-heading);font-size:var(--text-3xl);
                    font-weight:var(--fw-extrabold);
                    color:${mathBand ? BAND_COLORS[mathBand] : 'var(--color-neutral-400)'};line-height:1;">
                    ${mathScore || '—'}
                  </div>
                  ${mathBand ? `
                    <div style="font-size:var(--text-xs);color:${BAND_COLORS[mathBand]};
                      font-weight:var(--fw-semibold);margin-top:var(--space-1);">
                      Band ${mathBand}: ${BAND_LABELS[mathBand]}
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Editable fields if something is missing -->
              ${hasMissingRequired ? `
                <div class="alert alert-warning mb-4">
                  <i data-lucide="edit-3" class="alert-icon"></i>
                  <div class="alert-body">
                    <div class="alert-title">Missing required information — please fill in below</div>
                  </div>
                </div>
              ` : ''}

              <div class="grid-2" style="gap:var(--space-5);">
                <div class="form-group">
                  <label class="form-label" for="rev-test-source">Test Source</label>
                  <select class="form-select" id="rev-test-source" required>
                    <option value="">— Select —</option>
                    ${TEST_SOURCES.map(t =>
                      `<option value="${t.value}" ${testSource === t.value ? 'selected' : ''}>${t.label}</option>`
                    ).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" for="rev-date-taken">Date Taken</label>
                  <input type="date" class="form-input" id="rev-date-taken"
                    value="${dateTaken || new Date().toISOString().slice(0, 10)}"
                    max="${new Date().toISOString().slice(0, 10)}">
                </div>
                ${!rwScore ? `
                  <div class="form-group">
                    <label class="form-label" for="rev-rw">Reading & Writing Score *</label>
                    <input type="number" class="form-input" id="rev-rw"
                      min="200" max="800" placeholder="200–800" required>
                  </div>
                ` : ''}
                ${!mathScore ? `
                  <div class="form-group">
                    <label class="form-label" for="rev-math">Math Score *</label>
                    <input type="number" class="form-input" id="rev-math"
                      min="200" max="800" placeholder="200–800" required>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Wrong Answers Summary -->
          ${hasWrongAnswers ? `
            <div class="card mb-6">
              <div class="card-header">
                <h3>Wrong Answers — ${wrongAnswers.length} recorded</h3>
                <span class="badge badge-teal">Band mapping included</span>
              </div>
              <div class="card-body">
                <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">
                  ${wrongAnswers.slice(0, 20).map(wa => `
                    <div style="display:inline-flex;align-items:center;gap:var(--space-1);
                      padding:4px 10px;background:var(--color-neutral-100);
                      border-radius:var(--radius-full);font-size:var(--text-xs);">
                      ${wa.questionNumber ? `<span style="font-weight:var(--fw-bold);color:var(--color-primary);">Q${wa.questionNumber}</span>` : ''}
                      <span style="color:var(--color-neutral-600);">${wa.questionType.replace(/_/g, ' ')}</span>
                      <span style="color:var(--color-neutral-400);">·</span>
                      <span style="color:${wa.errorType === 'trap_answer' ? 'var(--color-warning)' : wa.errorType === 'content_gap' ? 'var(--color-error)' : 'var(--color-neutral-500)'};">
                        ${wa.errorType?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  `).join('')}
                  ${wrongAnswers.length > 20 ? `<span style="font-size:var(--text-xs);color:var(--color-neutral-400);padding:4px;">+${wrongAnswers.length - 20} more</span>` : ''}
                </div>
              </div>
            </div>
          ` : ''}

          ${notes ? `
            <div class="card mb-6">
              <div class="card-header"><h3>Session Notes</h3></div>
              <div class="card-body">
                <p style="font-size:var(--text-sm);color:var(--color-neutral-600);">
                  ${UI.escapeHtml(notes)}
                </p>
              </div>
            </div>
          ` : ''}

          <!-- Confirm Row -->
          <div style="display:flex;gap:var(--space-4);justify-content:space-between;
            align-items:center;padding-top:var(--space-6);border-top:1px solid var(--color-neutral-200);">
            <button type="button" class="btn btn-ghost" id="review-edit-btn">
              <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
              Edit Entries
            </button>
            <button type="submit" class="btn btn-accent btn-lg" id="review-confirm-btn">
              <i data-lucide="check-circle" style="width:18px;height:18px;"></i>
              ${isFirstImport ? 'Import & Start My Scholar\'s Edge Journey' : 'Save Import'}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  function wireReviewScreen(root, data) {
    const form = root.querySelector('#review-form');
    const editBtn = root.querySelector('#review-edit-btn');

    editBtn?.addEventListener('click', () => {
      if (data.importMethod === 'quick_log') {
        showScreen(buildQuickLogScreen({}), wireQuickLogScreen);
      } else {
        showScreen(buildHubScreen(), wireHub);
      }
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect any overrides from review screen
      const sourceOverride = root.querySelector('#rev-test-source')?.value;
      const dateOverride = root.querySelector('#rev-date-taken')?.value;
      const rwOverride = root.querySelector('#rev-rw')?.value;
      const mathOverride = root.querySelector('#rev-math')?.value;

      const finalData = { ...data };
      if (sourceOverride) finalData.testSource = sourceOverride;
      if (dateOverride) finalData.dateTaken = dateOverride;
      if (rwOverride) {
        finalData.rwScore = parseInt(rwOverride);
        finalData.totalScore = finalData.rwScore + (finalData.mathScore || 0);
      }
      if (mathOverride) {
        finalData.mathScore = parseInt(mathOverride);
        finalData.totalScore = (finalData.rwScore || 0) + finalData.mathScore;
      }

      // Validate
      if (!finalData.testSource) {
        UI.toast('Please select the test source.', 'warning', 'Required');
        return;
      }
      if (!finalData.rwScore || !finalData.mathScore) {
        UI.toast('Both section scores are required.', 'warning', 'Required');
        return;
      }

      confirmImport(finalData);
    });
  }

  // ── CONFIRM + SAVE ── //
  function confirmImport(data) {
    const btn = containerEl?.querySelector('#review-confirm-btn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<div class="spinner spinner-sm"></div> Saving…'; }

    const isFirstImport = !Storage.isFirstImportComplete();

    // Snapshot bands BEFORE this import overwrites them — notifications.js's
    // onImportComplete reads detail.previousBands to detect band movement, but
    // nothing was ever sending it, so cur > prev was always comparing against
    // undefined and the Band Movement Alert notification could never fire.
    const previousBands = Storage.getBands();

    // 1. Assign bands from scores and wrong answers
    const bandProfile = computeBandProfile(data);

    // 2. Build storage record
    const record = {
      testSource: data.testSource,
      dateTaken: data.dateTaken,
      totalScore: data.totalScore,
      rwScore: data.rwScore,
      mathScore: data.mathScore,
      timePressure: data.timePressure || 'comfortable',
      wrongAnswers: data.wrongAnswers || [],
      subScores: data.subScores || {},
      bandProfile,
      importMethod: data.importMethod || 'quick_log',
      notes: data.notes || '',
    };

    // 3. Save to storage
    const saved = Storage.addImport(record);

    // 4. Update band assignments
    Object.entries(bandProfile).forEach(([skill, band]) => {
      if (band !== null) Storage.updateBand(skill, band);
    });

    // 5. Mark first import complete
    if (isFirstImport) {
      Storage.setPath('progress.firstImportComplete', true);
      Storage.setPath('progress.firstImportDate', new Date().toISOString());

      // Start guarantee clock
      Storage.setPath('guarantee.startDate', new Date().toISOString());
      Storage.setPath('guarantee.baselineScore', data.totalScore);
      Storage.setPath('guarantee.status', 'active');
    }

    // 6. Award badge + points
    const badge = Storage.awardBadge(
      'baseline_set',
      'Baseline Set',
      'Imported first Bluebook test results'
    );
    if (badge) Storage.addPoints(100);

    // 7. Fire import event
    // testLabel is included here (not just `record`) because notifications.js's
    // onImportComplete reads detail.testLabel directly — without it, score-improvement
    // notifications always fell back to generic "her latest Bluebook test" phrasing.
    document.dispatchEvent(new CustomEvent('importComplete', {
      detail: { record: saved, isFirstImport, testLabel: formatTestLabel(saved.testSource), previousBands }
    }));

    // 8. Show success screen
    setTimeout(() => {
      showScreen(buildSuccessScreen(saved, bandProfile, isFirstImport),
        (root) => wireSuccessScreen(root, saved));
    }, 300);
  }

  // ── BAND COMPUTATION ── //
  function computeBandProfile(data) {
    const { rwScore, mathScore, wrongAnswers, subScores } = data;
    const rwBand = scoreToBand(rwScore);
    const mathBand = scoreToBand(mathScore);

    // Base assignments from section scores
    const bands = {
      main_idea: rwBand,
      inference: rwBand,
      grammar: rwBand,
      transitions: rwBand,
      punctuation: rwBand,
      linear_algebra: mathBand,
      advanced_math: mathBand,
      data_analysis: mathBand,
    };

    // Refine from subscores if available (PDF import)
    if (subScores) {
      // Subscore values are typically on a 1-15 scale in Bluebook
      // We map proportionally to our band system
      const subToBand = (v, max = 15) => {
        if (!v) return null;
        const pct = v / max;
        if (pct >= 0.93) return 7;
        if (pct >= 0.84) return 6;
        if (pct >= 0.76) return 5;
        if (pct >= 0.70) return 4;
        if (pct >= 0.63) return 3;
        if (pct >= 0.50) return 2;
        return 1;
      };

      if (subScores.informationIdeas) {
        const b = subToBand(subScores.informationIdeas);
        if (b) { bands.main_idea = b; bands.inference = b; }
      }
      if (subScores.expressionIdeas) {
        const b = subToBand(subScores.expressionIdeas);
        if (b) bands.transitions = b;
      }
      if (subScores.englishConventions) {
        const b = subToBand(subScores.englishConventions);
        if (b) { bands.grammar = b; bands.punctuation = b; }
      }
      if (subScores.algebra) {
        const b = subToBand(subScores.algebra);
        if (b) bands.linear_algebra = b;
      }
      if (subScores.advancedMath) {
        const b = subToBand(subScores.advancedMath);
        if (b) bands.advanced_math = b;
      }
      if (subScores.problemSolving || subScores.geometry) {
        const v = subScores.problemSolving || subScores.geometry;
        const b = subToBand(v);
        if (b) bands.data_analysis = b;
      }
    }

    // Refine from wrong answer patterns (lower band if skill shows weakness)
    if (wrongAnswers && wrongAnswers.length > 0) {
      // Count wrong answers per skill area
      const skillCounts = {};
      wrongAnswers.forEach(wa => {
        if (wa.skillArea) {
          skillCounts[wa.skillArea] = (skillCounts[wa.skillArea] || 0) + 1;
        }
      });

      // Estimated questions per skill area (approximate)
      const estimatedQuestionsPerSkill = {
        main_idea: 10, inference: 12, grammar: 8, transitions: 5,
        punctuation: 5, linear_algebra: 13, advanced_math: 13, data_analysis: 9,
      };

      Object.entries(skillCounts).forEach(([skill, count]) => {
        const estimated = estimatedQuestionsPerSkill[skill] || 8;
        const errorRate = count / estimated;
        // High error rate → drop band by 1 (minimum band 1)
        if (errorRate >= 0.5 && bands[skill] > 1) {
          bands[skill] = Math.max(1, bands[skill] - 1);
        }
      });
    }

    return bands;
  }

  // ── SUCCESS SCREEN ── //
  function buildSuccessScreen(record, bandProfile, isFirstImport) {
    const { testSource, totalScore, rwScore, mathScore, wrongAnswers } = record;
    const rwBand = bandProfile.main_idea || scoreToBand(rwScore);
    const mathBand = bandProfile.linear_algebra || scoreToBand(mathScore);

    // Identify strengths (band >= 5) and weaknesses (band <= 3) or relative lowest
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

    const bandEntries = Object.entries(bandProfile)
      .filter(([k, v]) => v !== null)
      .map(([k, v]) => ({ skill: k, label: skillLabels[k] || k, band: v }))
      .sort((a, b) => b.band - a.band);

    const strengths = bandEntries.slice(0, 3);
    const weaknesses = [...bandEntries].sort((a, b) => a.band - b.band).slice(0, 3);

    // Identify first strategy to learn based on lowest band skill
    const lowestSkill = weaknesses[0];
    const firstStrategy = getFirstStrategyForSkill(lowestSkill?.skill);

    return `
      <div class="animate-fade-in">
        ${isFirstImport ? `
          <!-- First Import Celebration -->
          <div class="card mb-6" style="background:linear-gradient(135deg,var(--color-primary),var(--color-primary-600));
            color:white;text-align:center;padding:var(--space-10);">
            <div style="font-size:3rem;margin-bottom:var(--space-3);">🎯</div>
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
              letter-spacing:var(--ls-widest);color:var(--color-accent);margin-bottom:var(--space-3);">
              Your Scholar's Edge Journey Officially Starts Now
            </div>
            <h2 style="color:white;font-size:var(--text-2xl);margin-bottom:var(--space-4);">
              Welcome to your personalized plan, ${Storage.getStudentName()}.
            </h2>
            <p style="color:rgba(255,255,255,0.7);max-width:520px;margin:0 auto;
              font-size:var(--text-sm);line-height:var(--lh-relaxed);">
              Your score report has been imported. Your band profile is built. Your drill queue is
              being prioritized. Everything in this app now reflects your actual starting point —
              not averages, not assumptions. <strong style="color:white;">Your data.</strong>
            </p>
          </div>
        ` : `
          <div class="card mb-6" style="background:var(--color-success-bg);border:1px solid rgba(46,204,113,0.25);">
            <div class="card-body d-flex gap-4 items-center">
              <div style="font-size:2.5rem;">✅</div>
              <div>
                <div style="font-weight:var(--fw-bold);color:var(--color-primary);font-size:var(--text-lg);">
                  ${formatTestLabel(testSource)} imported successfully
                </div>
                <div style="font-size:var(--text-sm);color:var(--color-neutral-500);">
                  Your bands and drill queue have been updated.
                </div>
              </div>
            </div>
          </div>
        `}

        <!-- Score Display -->
        <div class="card mb-6">
          <div class="card-header">
            <h3>Your ${isFirstImport ? 'Baseline ' : ''}Scores</h3>
            <span class="badge badge-neutral">${formatTestLabel(testSource)}</span>
          </div>
          <div class="card-body">
            <div class="grid-3" style="gap:var(--space-4);margin-bottom:var(--space-5);">
              <div style="text-align:center;padding:var(--space-4);border-radius:var(--radius-lg);
                background:var(--color-primary-50);">
                <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);
                  text-transform:uppercase;letter-spacing:var(--ls-wider);color:var(--color-primary);
                  margin-bottom:var(--space-1);">Total</div>
                <div style="font-family:var(--font-heading);font-size:var(--text-4xl);
                  font-weight:var(--fw-extrabold);color:var(--color-primary);line-height:1;">
                  ${totalScore}
                </div>
                <div style="font-size:var(--text-xs);color:var(--color-neutral-400);">out of 1600</div>
              </div>
              <div style="text-align:center;padding:var(--space-4);border-radius:var(--radius-lg);
                background:var(--color-teal-50);">
                <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);
                  text-transform:uppercase;letter-spacing:var(--ls-wider);color:var(--color-teal-500);
                  margin-bottom:var(--space-1);">Reading & Writing</div>
                <div style="font-family:var(--font-heading);font-size:var(--text-3xl);
                  font-weight:var(--fw-extrabold);color:${BAND_COLORS[rwBand]};line-height:1;">
                  ${rwScore}
                </div>
                <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);
                  color:${BAND_COLORS[rwBand]};margin-top:2px;">
                  Band ${rwBand} — ${BAND_LABELS[rwBand]}
                </div>
              </div>
              <div style="text-align:center;padding:var(--space-4);border-radius:var(--radius-lg);
                background:var(--color-accent-50);">
                <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);
                  text-transform:uppercase;letter-spacing:var(--ls-wider);color:var(--color-accent-600);
                  margin-bottom:var(--space-1);">Math</div>
                <div style="font-family:var(--font-heading);font-size:var(--text-3xl);
                  font-weight:var(--fw-extrabold);color:${BAND_COLORS[mathBand]};line-height:1;">
                  ${mathScore}
                </div>
                <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);
                  color:${BAND_COLORS[mathBand]};margin-top:2px;">
                  Band ${mathBand} — ${BAND_LABELS[mathBand]}
                </div>
              </div>
            </div>

            <!-- Band Profile Bar Chart -->
            <div style="margin-top:var(--space-2);">
              <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
                letter-spacing:var(--ls-wider);color:var(--color-neutral-500);margin-bottom:var(--space-4);">
                Skill Band Profile
              </div>
              ${bandEntries.map(({ skill, label, band }) => `
                <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
                  <div style="width:120px;font-size:var(--text-xs);font-weight:var(--fw-medium);
                    color:var(--color-neutral-700);flex-shrink:0;text-align:right;">${label}</div>
                  <div style="flex:1;background:var(--color-neutral-100);border-radius:var(--radius-full);
                    height:12px;overflow:hidden;">
                    <div style="height:100%;width:${Math.round((band / 7) * 100)}%;
                      background:${BAND_COLORS[band]};border-radius:var(--radius-full);
                      transition:width 0.8s ease;"></div>
                  </div>
                  <div style="width:80px;font-size:var(--text-xs);flex-shrink:0;">
                    <span style="font-weight:var(--fw-bold);color:${BAND_COLORS[band]};">Band ${band}</span>
                    <span style="color:var(--color-neutral-400);margin-left:4px;">${BAND_LABELS[band].split(' ')[0]}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Strengths + Weaknesses -->
        <div class="grid-2 mb-6" style="gap:var(--space-5);">
          <div class="card card-body" style="background:var(--color-success-bg);">
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
              letter-spacing:var(--ls-wider);color:var(--color-success);margin-bottom:var(--space-3);">
              ✅ Top Strengths
            </div>
            ${strengths.map(s => `
              <div style="display:flex;justify-content:space-between;align-items:center;
                padding:var(--space-2) 0;border-bottom:1px solid rgba(46,204,113,0.15);">
                <span style="font-size:var(--text-sm);color:var(--color-primary);">${s.label}</span>
                <span style="font-weight:var(--fw-bold);font-size:var(--text-sm);
                  color:${BAND_COLORS[s.band]};">Band ${s.band}</span>
              </div>
            `).join('')}
          </div>
          <div class="card card-body" style="background:var(--color-warning-bg);">
            <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
              letter-spacing:var(--ls-wider);color:var(--color-warning);margin-bottom:var(--space-3);">
              🎯 Focus Areas
            </div>
            ${weaknesses.map(w => `
              <div style="display:flex;justify-content:space-between;align-items:center;
                padding:var(--space-2) 0;border-bottom:1px solid rgba(243,156,18,0.15);">
                <span style="font-size:var(--text-sm);color:var(--color-primary);">${w.label}</span>
                <span style="font-weight:var(--fw-bold);font-size:var(--text-sm);
                  color:${BAND_COLORS[w.band]};">Band ${w.band}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- First strategy recommendation -->
        ${isFirstImport && firstStrategy ? `
          <div class="coaching-card mb-6">
            <div class="coaching-card-avatar">🎓</div>
            <div class="coaching-card-body">
              <div class="coaching-card-label">Your first strategy to learn</div>
              <div class="coaching-card-message">
                Based on your band profile, your highest-priority skill area is
                <strong>${lowestSkill?.label}</strong>.
                Your first strategy lesson will be <strong>${firstStrategy.name}</strong> — ${firstStrategy.description}
                Head to the Strategy Course to start.
              </div>
            </div>
          </div>
        ` : ''}

        <!-- CTA Buttons -->
        <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;justify-content:center;
          padding:var(--space-6) 0;border-top:1px solid var(--color-neutral-200);">
          <button class="btn btn-accent btn-lg" onclick="Router.navigate('/strategy-course')">
            <i data-lucide="book-open" style="width:18px;height:18px;"></i>
            Start Strategy Course
          </button>
          <button class="btn btn-teal btn-lg" onclick="Router.navigate('/drill-engine')">
            <i data-lucide="zap" style="width:18px;height:18px;"></i>
            Begin Drilling
          </button>
          <button class="btn btn-outline" onclick="Router.navigate('/dashboard')">
            <i data-lucide="layout-dashboard" style="width:16px;height:16px;"></i>
            Go to Dashboard
          </button>
        </div>
      </div>
    `;
  }

  function wireSuccessScreen(root, record) {
    // Nothing to wire — all CTAs use Router.navigate directly
    // Optionally confetti / badge popup
    setTimeout(() => {
      const { badges } = Storage.getGamification();
      const baselineBadge = badges?.find(b => b.id === 'baseline_set');
      if (baselineBadge) {
        UI.toast('🏅 Badge earned: Baseline Set!', 'success', 'Achievement Unlocked', 5000);
      }
    }, 600);
  }

  // ── IMPORT HISTORY MODAL ── //
  function showHistory() {
    const history = Storage.getImportHistory();
    if (history.length === 0) {
      UI.toast('No imports yet.', 'info');
      return;
    }

    const rows = [...history].reverse().map(imp => `
      <tr style="border-bottom:1px solid var(--color-neutral-100);">
        <td style="padding:var(--space-3);font-size:var(--text-sm);font-weight:var(--fw-medium);
          color:var(--color-primary);">${formatTestLabel(imp.testSource)}</td>
        <td style="padding:var(--space-3);font-size:var(--text-sm);">
          ${new Date(imp.importedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </td>
        <td style="padding:var(--space-3);text-align:center;">
          <span style="font-weight:var(--fw-bold);color:var(--color-primary);">${imp.totalScore}</span>
        </td>
        <td style="padding:var(--space-3);text-align:center;color:var(--color-teal-500);">${imp.rwScore}</td>
        <td style="padding:var(--space-3);text-align:center;color:var(--color-accent-600);">${imp.mathScore}</td>
        <td style="padding:var(--space-3);font-size:var(--text-xs);color:var(--color-neutral-500);">
          ${imp.wrongAnswers?.length || 0} recorded
        </td>
      </tr>
    `).join('');

    UI.modal({
      title: 'Import History',
      size: 'lg',
      body: `
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:2px solid var(--color-neutral-200);">
                <th style="padding:var(--space-2) var(--space-3);text-align:left;font-size:var(--text-xs);
                  text-transform:uppercase;letter-spacing:var(--ls-wider);color:var(--color-neutral-500);">
                  Test</th>
                <th style="padding:var(--space-2) var(--space-3);text-align:left;font-size:var(--text-xs);
                  text-transform:uppercase;letter-spacing:var(--ls-wider);color:var(--color-neutral-500);">
                  Imported</th>
                <th style="padding:var(--space-2) var(--space-3);text-align:center;font-size:var(--text-xs);
                  text-transform:uppercase;letter-spacing:var(--ls-wider);color:var(--color-neutral-500);">
                  Total</th>
                <th style="padding:var(--space-2) var(--space-3);text-align:center;font-size:var(--text-xs);
                  text-transform:uppercase;letter-spacing:var(--ls-wider);color:var(--color-teal-500);">
                  RW</th>
                <th style="padding:var(--space-2) var(--space-3);text-align:center;font-size:var(--text-xs);
                  text-transform:uppercase;letter-spacing:var(--ls-wider);color:var(--color-accent-600);">
                  Math</th>
                <th style="padding:var(--space-2) var(--space-3);text-align:left;font-size:var(--text-xs);
                  text-transform:uppercase;letter-spacing:var(--ls-wider);color:var(--color-neutral-500);">
                  Wrong Ans.</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `,
      footer: `<button class="btn btn-primary" onclick="UI.closeModal()">Close</button>`,
    });
  }

  // ── UTILITY HELPERS ── //
  function screenHeader(emoji, title, subtitle, onBack) {
    // This only returns a markup string — it can't attach onBack as a real
    // listener itself. Stash it for showScreen() to wire up once the markup
    // it just produced is actually in the DOM (see showScreen() above).
    currentBackHandler = onBack || null;
    return `
      <div class="page-header-row mb-6">
        <div>
          <button class="btn btn-ghost btn-sm mb-3" id="screen-back-btn" style="color:var(--color-neutral-500);">
            <i data-lucide="arrow-left" style="width:14px;height:14px;"></i>
            Back
          </button>
          <h1 style="margin-bottom:var(--space-2);">${emoji} ${title}</h1>
          <p class="page-subtitle">${subtitle}</p>
        </div>
      </div>
    `;
  }

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
    return labels[source] || source || 'Practice Test';
  }

  function getFirstStrategyForSkill(skillArea) {
    const map = {
      transitions:    { name: 'G3 — Transition Logic Map', description: 'identify the logical relationship before touching the answer choices.' },
      grammar:        { name: 'G1 — Pattern Recognition', description: 'read for what\'s consistent with the surrounding text.' },
      punctuation:    { name: 'G4 — Punctuation Decision Tree', description: 'follow a simple flowchart to the right punctuation every time.' },
      main_idea:      { name: 'R12 — One-Line Headline', description: 'find the main idea of any passage in 10 seconds.' },
      inference:      { name: 'R4 — Could-Be-True Trap', description: 'stop picking answers that are plausible but not in the text.' },
      linear_algebra: { name: 'M1 — Backsolving', description: 'work from the answer choices backward to avoid algebra.' },
      advanced_math:  { name: 'M2 — Plug In Numbers', description: 'replace variables with real numbers to make abstract problems concrete.' },
      data_analysis:  { name: 'M5 — Answer Choice Ballparking', description: 'eliminate obviously wrong answers before calculating anything.' },
    };
    return map[skillArea] || { name: 'U1 — Think Like the Test Maker', description: 'understand why every wrong answer is wrong before choosing the right one.' };
  }

  function backToHub() {
    showScreen(buildHubScreen(), wireHub);
  }

  // ── PUBLIC API ── //
  return {
    render,
    selectMethod,
    backToHub,
    showHistory,
    // Expose for inline onclick handlers in success screen
    formatTestLabel,
  };

})();

window.ImportModule = ImportModule;
