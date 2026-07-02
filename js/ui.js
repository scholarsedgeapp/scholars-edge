/* ============================================================
   SCHOLAR'S EDGE — UI Utilities
   Toast, Modal, Loading, Coaching Cards, Empty/Error States
   ============================================================ */

const UI = (() => {

  // ── 1. TOAST NOTIFICATIONS ── //
  let toastQueue = [];
  let toastContainer = null;

  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.getElementById('toast-container');
    }
    return toastContainer;
  }

  /**
   * Show a toast notification.
   * @param {string} message - Main message text
   * @param {'success'|'error'|'warning'|'info'} type - Toast type
   * @param {string} [title] - Optional title
   * @param {number} [duration=4000] - Auto-dismiss duration in ms (0 = no auto-dismiss)
   */
  function toast(message, type = 'info', title = '', duration = 4000) {
    const container = getToastContainer();
    if (!container) return;

    const icons = {
      success: 'check-circle',
      error:   'x-circle',
      warning: 'alert-triangle',
      info:    'info',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="${icons[type] || 'info'}" style="width:20px;height:20px;"></i>
      </div>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${escapeHtml(title)}</div>` : ''}
        <div class="toast-message">${escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss">
        <i data-lucide="x" style="width:14px;height:14px;"></i>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    container.appendChild(toast);

    if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '2' } });

    if (duration > 0) {
      setTimeout(() => dismissToast(toast), duration);
    }

    return toast;
  }

  function dismissToast(toastEl) {
    if (!toastEl || toastEl.classList.contains('removing')) return;
    toastEl.classList.add('removing');
    toastEl.addEventListener('animationend', () => toastEl.remove(), { once: true });
    // Fallback remove
    setTimeout(() => toastEl.remove(), 350);
  }

  // ── 2. MODAL ── //
  let modalOverlay = null;
  let activeModal = null;
  let onModalClose = null;

  function getModalOverlay() {
    if (!modalOverlay) {
      modalOverlay = document.getElementById('modal-overlay');
    }
    return modalOverlay;
  }

  /**
   * Open a modal dialog.
   * @param {object} config - { title, body, footer, size, onClose }
   */
  function modal({ title, body, footer, size = 'md', onClose }) {
    const overlay = getModalOverlay();
    if (!overlay) return;

    onModalClose = onClose || null;

    const maxWidths = { sm: '400px', md: '540px', lg: '720px', xl: '900px' };

    overlay.innerHTML = `
      <div class="modal" style="max-width:${maxWidths[size] || maxWidths.md};" role="dialog" aria-modal="true">
        ${title ? `
          <div class="modal-header">
            <h2>${escapeHtml(title)}</h2>
            <button class="modal-close" aria-label="Close modal">
              <i data-lucide="x" style="width:20px;height:20px;"></i>
            </button>
          </div>
        ` : ''}
        <div class="modal-body">${typeof body === 'string' ? body : ''}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;

    // Append DOM element body if provided
    if (body instanceof HTMLElement) {
      overlay.querySelector('.modal-body').appendChild(body);
    }

    // Wire close button
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Close on Escape
    document._modalEscHandler = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', document._modalEscHandler);

    // Show
    overlay.classList.add('active');

    if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });

    activeModal = overlay.querySelector('.modal');

    // Trap focus
    const firstFocusable = overlay.querySelector('button, input, select, textarea, a[href]');
    if (firstFocusable) firstFocusable.focus();

    return activeModal;
  }

  function closeModal() {
    const overlay = getModalOverlay();
    if (!overlay) return;
    overlay.classList.remove('active');
    if (document._modalEscHandler) {
      document.removeEventListener('keydown', document._modalEscHandler);
    }
    if (onModalClose) {
      try { onModalClose(); } catch(e) {}
    }
    onModalClose = null;
    activeModal = null;
  }

  /**
   * Show a confirmation dialog.
   * @returns {Promise<boolean>}
   */
  function confirm({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false }) {
    return new Promise(resolve => {
      modal({
        title,
        body: `<p style="color:var(--color-neutral-600);line-height:var(--lh-relaxed);">${escapeHtml(message)}</p>`,
        footer: `
          <button class="btn btn-ghost" id="modal-cancel">${escapeHtml(cancelText)}</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="modal-confirm">${escapeHtml(confirmText)}</button>
        `,
        onClose: () => resolve(false),
      });

      document.getElementById('modal-confirm')?.addEventListener('click', () => {
        // closeModal() unconditionally fires onModalClose (the implicit-cancel
        // path for X/Escape/backdrop dismiss). Without clearing it first, that
        // fires resolve(false) BEFORE the resolve(true) below — and since a
        // Promise can only settle once, every confirm() call was resolving to
        // false regardless of which button was clicked. Null it out here so
        // the explicit resolve(true) below is the one that wins.
        onModalClose = null;
        closeModal();
        resolve(true);
      });
      document.getElementById('modal-cancel')?.addEventListener('click', () => {
        onModalClose = null;
        closeModal();
        resolve(false);
      });
    });
  }

  // ── 3. LOADING OVERLAY ── //
  let loadingEl = null;

  function showLoading(text = 'Loading...') {
    if (!loadingEl) {
      loadingEl = document.getElementById('loading-overlay');
    }
    if (!loadingEl) return;
    const textEl = loadingEl.querySelector('.loading-text');
    if (textEl) textEl.textContent = text;
    loadingEl.classList.add('active');
  }

  function hideLoading() {
    if (!loadingEl) loadingEl = document.getElementById('loading-overlay');
    if (!loadingEl) return;
    loadingEl.classList.remove('active');
  }

  // ── 4. COACHING CARDS ── //
  /**
   * Render a coaching card element.
   * @param {object} config - { message, label, type, strategy }
   */
  function coachingCard({ message, label = 'Coach', type = 'default', strategy = null }) {
    const types = { default: '', strategy: 'strategy', frustration: 'frustration' };
    const div = document.createElement('div');
    div.className = `coaching-card ${types[type] || ''}`;
    div.innerHTML = `
      <div class="coaching-card-avatar">🎓</div>
      <div class="coaching-card-body">
        <div class="coaching-card-label">${escapeHtml(label)}</div>
        <div class="coaching-card-message">${escapeHtml(message)}</div>
        ${strategy ? `
          <button class="btn btn-sm btn-outline mt-4" onclick="Router.navigate('/strategy-course')">
            Review ${escapeHtml(strategy)}
          </button>
        ` : ''}
      </div>
    `;
    return div;
  }

  // ── 5. EMPTY STATE ── //
  /**
   * Render an empty state element.
   */
  function emptyState({ icon = 'inbox', title, message, action = null }) {
    const div = document.createElement('div');
    div.className = 'empty-state animate-fade-in';
    div.innerHTML = `
      <div class="empty-state-icon">
        <i data-lucide="${icon}" style="width:40px;height:40px;"></i>
      </div>
      <h3>${escapeHtml(title)}</h3>
      <p>${message}</p>
      ${action ? `
        <button class="btn btn-accent btn-lg" onclick="${escapeHtml(action.onclick || '')}">
          ${escapeHtml(action.label)}
        </button>
      ` : ''}
    `;
    if (window.lucide) {
      requestAnimationFrame(() => lucide.createIcons({ attrs: { 'stroke-width': '1.75' } }));
    }
    return div;
  }

  // ── 6. LOCKED MODULE PAGE ── //
  function lockedPage({ title, message, unlockSteps, ctaLabel, ctaRoute }) {
    const div = document.createElement('div');
    div.className = 'empty-state animate-fade-in';
    div.innerHTML = `
      <div class="empty-state-icon" style="background:var(--color-warning-bg);color:var(--color-warning);">
        <i data-lucide="lock" style="width:40px;height:40px;"></i>
      </div>
      <h3>${escapeHtml(title)}</h3>
      <p>${message}</p>
      ${unlockSteps ? `
        <div class="card card-body-sm mt-4" style="max-width:360px;text-align:left;">
          <div style="font-size:var(--text-sm);font-weight:var(--fw-semibold);color:var(--color-primary);margin-bottom:var(--space-3);">
            To unlock this module:
          </div>
          <ol style="padding-left:var(--space-5);display:flex;flex-direction:column;gap:var(--space-2);">
            ${unlockSteps.map(s => `<li style="font-size:var(--text-sm);color:var(--color-neutral-600);">${escapeHtml(s)}</li>`).join('')}
          </ol>
        </div>
      ` : ''}
      ${ctaLabel ? `
        <button class="btn btn-accent btn-lg" onclick="Router.navigate('${ctaRoute}')">
          ${escapeHtml(ctaLabel)}
        </button>
      ` : ''}
    `;
    if (window.lucide) {
      requestAnimationFrame(() => lucide.createIcons({ attrs: { 'stroke-width': '1.75' } }));
    }
    return div;
  }

  // ── 7. COMING SOON PAGE ── //
  function comingSoonPage({ title, description, moduleNumber }) {
    const div = document.createElement('div');
    div.className = 'animate-fade-in';
    div.innerHTML = `
      <div class="page-header">
        <h1>${escapeHtml(title)}</h1>
        ${description ? `<p class="page-subtitle">${escapeHtml(description)}</p>` : ''}
      </div>
      <div class="card card-body" style="text-align:center;padding:var(--space-16) var(--space-8);">
        <div style="
          width:80px;height:80px;border-radius:var(--radius-xl);
          background:var(--color-primary-50);display:flex;align-items:center;
          justify-content:center;margin:0 auto var(--space-6);
          color:var(--color-primary);
        ">
          <i data-lucide="hammer" style="width:40px;height:40px;"></i>
        </div>
        <h3 style="color:var(--color-primary);">Module ${moduleNumber} — Coming Next</h3>
        <p style="color:var(--color-neutral-500);max-width:400px;margin:var(--space-3) auto 0;line-height:var(--lh-relaxed);">
          This module is being built in sequence. Complete Module ${moduleNumber - 1} first,
          then this unlocks as the next build session.
        </p>
        <div style="margin-top:var(--space-6);">
          <button class="btn btn-outline" onclick="Router.navigate('/dashboard')">
            Back to Dashboard
          </button>
        </div>
      </div>
    `;
    if (window.lucide) {
      requestAnimationFrame(() => lucide.createIcons({ attrs: { 'stroke-width': '1.75' } }));
    }
    return div;
  }

  // ── 8. PROGRESS BAR COMPONENT ── //
  function progressBar({ value, max = 100, label, showValue = true, color = 'teal', size = '' }) {
    const percent = Math.min(100, Math.round((value / max) * 100));
    const div = document.createElement('div');
    div.className = 'progress-bar-wrapper';
    div.innerHTML = `
      ${(label || showValue) ? `
        <div class="progress-bar-header">
          ${label ? `<span class="progress-bar-label">${escapeHtml(label)}</span>` : ''}
          ${showValue ? `<span class="progress-bar-value">${value}/${max}</span>` : ''}
        </div>
      ` : ''}
      <div class="progress-track ${size}">
        <div class="progress-fill ${color}" style="width:${percent}%;" role="progressbar"
          aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}">
        </div>
      </div>
    `;
    return div;
  }

  // ── 9. BADGE DISPLAY ── //
  function bandBadge(bandNumber) {
    const labels = ['', 'Foundation', 'Core', 'Building', 'Approaching', 'Strong', 'Near Elite', 'Perfect'];
    const label = labels[bandNumber] || 'Unknown';
    const span = document.createElement('span');
    span.className = `badge badge-band-${bandNumber}`;
    span.textContent = `Band ${bandNumber} — ${label}`;
    return span;
  }

  // ── 10. SCORE BAND BAR ── //
  function bandBar(skillLabel, bandNumber, prevBand = null) {
    const percent = bandNumber ? ((bandNumber / 7) * 100) : 0;
    const colors = ['', '#E74C3C', '#E67E22', '#F39C12', '#F4B942', '#2ABFBF', '#2980B9', '#8E44AD'];
    const labels = ['', 'Foundation', 'Core', 'Building', 'Approaching', 'Strong', 'Near Elite', 'Perfect'];
    const moved = prevBand && bandNumber && bandNumber > prevBand;

    const div = document.createElement('div');
    div.className = 'mb-4';
    div.innerHTML = `
      <div class="d-flex justify-between items-center mb-2">
        <span style="font-size:var(--text-sm);font-weight:var(--fw-medium);color:var(--color-primary);">
          ${escapeHtml(skillLabel)}
        </span>
        <div class="d-flex items-center gap-2">
          ${moved ? `
            <span class="badge badge-success" style="font-size:var(--text-xs);">
              ↑ Band Up!
            </span>
          ` : ''}
          <span class="badge badge-band-${bandNumber || 0}" style="font-size:var(--text-xs);">
            ${bandNumber ? `Band ${bandNumber}` : 'Not set'}
          </span>
        </div>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${percent}%;background:${colors[bandNumber] || '#CED4DA'};"
          role="progressbar" aria-valuenow="${bandNumber || 0}" aria-valuemin="0" aria-valuemax="7">
        </div>
      </div>
      ${bandNumber ? `
        <div style="font-size:var(--text-xs);color:var(--color-neutral-400);margin-top:var(--space-1);">
          ${labels[bandNumber]} (${[0,200,400,500,560,610,670,740][bandNumber]}–${[200,400,500,560,610,670,740,800][bandNumber]})
        </div>
      ` : ''}
    `;
    return div;
  }

  // ── 11. MASTERY BADGE ── //
  function masteryBadge(state) {
    const config = {
      not_started: { label: 'Not Started', cls: 'badge-neutral' },
      in_progress: { label: 'In Progress', cls: 'badge-warning' },
      developing:  { label: 'Developing',  cls: 'badge-accent' },
      mastered:    { label: 'Mastered',    cls: 'badge-success' },
      elite:       { label: 'Elite',       cls: 'badge-teal' },
    };
    const c = config[state] || config.not_started;
    const span = document.createElement('span');
    span.className = `badge ${c.cls}`;
    span.textContent = c.label;
    return span;
  }

  // ── 12. GUARANTEE WIDGET ── //
  function guaranteeWidget() {
    const g = Storage.getGuarantee();
    const p = Storage.getPath('progress');
    const hoursLogged = ((p?.totalMinutes || 0) / 60).toFixed(1);
    const dayNumber = g.startDate
      ? Math.floor((Date.now() - new Date(g.startDate).getTime()) / 86400000) + 1
      : 0;
    const hoursTarget = 20;
    const daysTarget = 90;
    const hoursPercent = Math.min(100, (hoursLogged / hoursTarget) * 100);
    const daysPercent = Math.min(100, (dayNumber / daysTarget) * 100);

    const isOnTrack = hoursLogged >= (dayNumber / daysTarget) * hoursTarget * 0.85;
    const statusColor = !g.startDate ? 'var(--color-neutral-400)'
      : isOnTrack ? 'var(--color-success)'
      : 'var(--color-warning)';
    const statusLabel = !g.startDate ? 'Not Started'
      : isOnTrack ? '✅ On Track'
      : '⚠️ Needs Attention';

    const div = document.createElement('div');
    div.className = 'card card-body-sm';
    div.innerHTML = `
      <div class="d-flex items-center justify-between mb-4">
        <div>
          <div style="font-size:var(--text-xs);font-weight:var(--fw-semibold);text-transform:uppercase;
            letter-spacing:var(--ls-wider);color:var(--color-neutral-500);margin-bottom:var(--space-1);">
            Progress Guarantee
          </div>
          <div style="font-size:var(--text-sm);color:${statusColor};font-weight:var(--fw-semibold);">
            ${statusLabel}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:var(--text-xl);font-weight:var(--fw-bold);color:var(--color-primary);line-height:1;">
            Day ${dayNumber}
          </div>
          <div style="font-size:var(--text-xs);color:var(--color-neutral-400);">of 90</div>
        </div>
      </div>

      <div class="mb-4">
        <div class="progress-bar-header">
          <span class="progress-bar-label">Hours Practiced</span>
          <span class="progress-bar-value">${hoursLogged}h / 20h</span>
        </div>
        <div class="progress-track sm">
          <div class="progress-fill accent" style="width:${hoursPercent}%;"></div>
        </div>
      </div>

      <div>
        <div class="progress-bar-header">
          <span class="progress-bar-label">90-Day Window</span>
          <span class="progress-bar-value">${dayNumber} / 90 days</span>
        </div>
        <div class="progress-track sm">
          <div class="progress-fill primary" style="width:${daysPercent}%;"></div>
        </div>
      </div>

      <div style="margin-top:var(--space-4);padding-top:var(--space-4);border-top:1px solid var(--color-neutral-100);">
        <a href="#" style="font-size:var(--text-xs);color:var(--color-teal);"
          onclick="UI.modal({title:'The Scholar\'s Edge Guarantee',body:UI.guaranteeText()});return false;">
          What counts toward my guarantee? →
        </a>
      </div>
    `;
    return div;
  }

  function guaranteeText() {
    return `
      <div style="color:var(--color-text);line-height:var(--lh-relaxed);">
        <p style="margin-bottom:var(--space-4);font-weight:var(--fw-semibold);color:var(--color-primary);">
          The Scholar's Edge Progress Guarantee
        </p>
        <p style="margin-bottom:var(--space-4);">
          Take a real College Board practice test on day one to establish your baseline. Log a minimum
          of 20 hours of practice within 90 days. We guarantee a measurable improvement in your
          College Board scored results — or we extend your subscription free until you do.
        </p>
        <p style="font-size:var(--text-sm);font-weight:var(--fw-semibold);margin-bottom:var(--space-2);">
          Guaranteed improvement ranges (Bluebook scored):
        </p>
        <table style="width:100%;font-size:var(--text-sm);border-collapse:collapse;margin-bottom:var(--space-4);">
          <thead>
            <tr style="background:var(--color-neutral-50);">
              <th style="text-align:left;padding:var(--space-2) var(--space-3);font-weight:var(--fw-semibold);">Starting Score</th>
              <th style="text-align:left;padding:var(--space-2) var(--space-3);font-weight:var(--fw-semibold);">Guaranteed Improvement</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding:var(--space-2) var(--space-3);">Below 1000</td><td style="padding:var(--space-2) var(--space-3);">+100 points</td></tr>
            <tr style="background:var(--color-neutral-50);"><td style="padding:var(--space-2) var(--space-3);">1000–1200</td><td style="padding:var(--space-2) var(--space-3);">+80 points</td></tr>
            <tr><td style="padding:var(--space-2) var(--space-3);">1200–1400</td><td style="padding:var(--space-2) var(--space-3);">+60 points</td></tr>
            <tr style="background:var(--color-neutral-50);"><td style="padding:var(--space-2) var(--space-3);">1400+</td><td style="padding:var(--space-2) var(--space-3);">+40 points</td></tr>
          </tbody>
        </table>
        <p style="font-size:var(--text-xs);color:var(--color-neutral-500);">
          Requires: completed orientation, Bluebook Test 7 as baseline, minimum 3 sessions/week,
          1 Bluebook test/month, and 20 total hours within 90 days.
        </p>
      </div>
    `;
  }

  // ── 13. UTILITY: escapeHtml ── //
  function escapeHtml(str) {
    if (typeof str !== 'string') return String(str ?? '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── 14. ANNOUNCEMENT (BAND UP, ACHIEVEMENT) ── //
  function announce(message) {
    const el = document.getElementById('aria-announcer');
    if (el) {
      el.textContent = '';
      setTimeout(() => { el.textContent = message; }, 100);
    }
  }

  // ── PUBLIC API ── //
  return {
    toast, dismissToast,
    modal, closeModal, confirm,
    showLoading, hideLoading,
    coachingCard,
    emptyState, lockedPage, comingSoonPage,
    progressBar, bandBadge, bandBar, masteryBadge,
    guaranteeWidget, guaranteeText,
    escapeHtml, announce,
  };
})();

window.UI = UI;
