/* ============================================================
   SCHOLAR'S EDGE — Router
   Hash-based client-side routing with lock logic
   ============================================================ */

const Router = (() => {
  // Route registry: { path: { render: fn, title: string, requiresImport: bool } }
  const routes = {};
  let currentRoute = null;
  let onNavigateCallbacks = [];

  // ── ROUTE DEFINITIONS ── //
  // Populated by App.init() calling Router.register()

  function register(path, config) {
    routes[path] = {
      path,
      title: config.title || 'Scholar\'s Edge',
      render: config.render,
      requiresOrientation: config.requiresOrientation || false,
      requiresImport: config.requiresImport || false,
      lockedMessage: config.lockedMessage || null,
      navGroup: config.navGroup || 'other',
    };
  }

  // ── NAVIGATION ── //
  function navigate(path, skipLockCheck = false) {
    const route = routes[path];
    if (!route) {
      console.warn('[Router] Unknown route:', path);
      navigate('/dashboard');
      return;
    }

    // Lock check
    if (!skipLockCheck) {
      if (route.requiresImport && !Storage.isFirstImportComplete()) {
        if (window.UI) {
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
        }
        return;
      }
      if (route.requiresOrientation && !Storage.isOrientationComplete()) {
        if (window.UI) {
          UI.modal({
            title: '🔒 Complete Orientation First',
            body: '<p style="color:var(--color-neutral-600);line-height:1.6;">This module unlocks after you complete the Orientation. It only takes 10 minutes and sets up your entire prep plan.</p>',
            footer: `
              <button class="btn btn-outline" onclick="UI.closeModal()">Not yet</button>
              <button class="btn btn-primary" onclick="UI.closeModal(); Router.navigate('/orientation');">
                Start Orientation →
              </button>
            `,
          });
        }
        return;
      }
    }

    // Update hash (triggers hashchange)
    window.location.hash = path;
  }

  function back() {
    window.history.back();
  }

  function forward() {
    window.history.forward();
  }

  // ── ROUTE RESOLUTION ── //
  function getCurrentPath() {
    const hash = window.location.hash;
    if (!hash || hash === '#') return '/dashboard';
    return hash.slice(1); // Remove leading #
  }

  function resolve(path) {
    return routes[path] || routes['/dashboard'] || null;
  }

  // ── PAGE RENDERING ── //
  function render(path) {
    const route = resolve(path);
    if (!route) return;

    const container = document.getElementById('page-container');
    if (!container) return;

    // Update document title
    document.title = `${route.title} — Scholar's Edge`;

    // Update breadcrumb
    updateBreadcrumb(route.title);

    // Update nav active state
    updateNavActive(path);

    // Show loading state briefly for heavier modules
    container.innerHTML = '';
    container.classList.remove('page-enter');

    // Render route content
    try {
      const content = route.render(path);
      if (content instanceof HTMLElement) {
        container.appendChild(content);
      } else if (typeof content === 'string') {
        container.innerHTML = content;
      }
    } catch (err) {
      console.error('[Router] Render error for', path, err);
      container.innerHTML = renderErrorPage(err);
    }

    // Trigger entry animation
    requestAnimationFrame(() => {
      container.classList.add('page-enter');
    });

    // Initialize Lucide icons in the new content
    if (window.lucide) {
      lucide.createIcons({ attrs: { 'stroke-width': '1.75' } });
    }

    currentRoute = route;

    // Scroll to top
    // NOTE: #main-content has no overflow/height rule (see layout.css), so the
    // window/document is the actual scrolling element, not #main-content itself.
    // Resetting mainContent.scrollTop alone is a no-op and was leaving pages
    // scrolled to the previous page's position (confirmed: blank Dashboard
    // after completing Orientation while scrolled down). window.scrollTo is
    // the real fix; the mainContent reset is kept as a harmless fallback in
    // case the layout ever changes to make main-content scrollable.
    window.scrollTo(0, 0);
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;

    // Fire callbacks
    onNavigateCallbacks.forEach(cb => {
      try { cb(route, path); } catch(e) {}
    });
  }

  function renderErrorPage(err) {
    return `
      <div class="error-state animate-fade-in">
        <div class="error-state-icon">
          <i data-lucide="alert-triangle" style="width:32px;height:32px;"></i>
        </div>
        <h3>Something went wrong</h3>
        <p>This page couldn't load. The error has been logged.</p>
        <pre style="font-size:var(--text-xs);color:var(--color-neutral-400);margin-top:var(--space-4);">${err.message}</pre>
        <button class="btn btn-outline" onclick="Router.navigate('/dashboard')">
          Back to Dashboard
        </button>
      </div>
    `;
  }

  // ── NAV ACTIVE STATE ── //
  function updateNavActive(path) {
    const navItems = document.querySelectorAll('.nav-item[data-route]');
    navItems.forEach(item => {
      const itemPath = item.getAttribute('data-route');
      if (itemPath === path) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });
  }

  // ── BREADCRUMB ── //
  function updateBreadcrumb(title) {
    const el = document.querySelector('.page-breadcrumb .current-page');
    if (el) el.textContent = title;
  }

  // ── LOCK STATE UPDATE ── //
  // Call this after import or orientation completes to update nav lock badges
  function refreshLockStates() {
    const orientationDone = Storage.isOrientationComplete();
    const importDone = Storage.isFirstImportComplete();

    document.querySelectorAll('.nav-item[data-route]').forEach(item => {
      const path = item.getAttribute('data-route');
      const route = routes[path];
      if (!route) return;

      const isLocked = (
        (route.requiresImport && !importDone) ||
        (route.requiresOrientation && !orientationDone)
      );

      item.classList.toggle('locked', isLocked);

      // Update lock badge
      const badge = item.querySelector('.nav-item-badge.badge-locked');
      if (badge) {
        badge.style.display = isLocked ? '' : 'none';
      }

      // Update lock icon — this element is hardcoded in index.html's markup
      // with no CSS rule tying its visibility to the .locked class (layout.css
      // only sets its size/opacity), so without this it stays visible forever,
      // even after a module unlocks. Confirmed live: Score Bands/Strategy
      // Course still showed the lock glyph in the sidebar after a successful
      // import, despite .locked being correctly removed from the nav item.
      const lockIcon = item.querySelector('.nav-lock-icon');
      if (lockIcon) {
        lockIcon.style.display = isLocked ? '' : 'none';
      }
    });
  }

  // ── HASH CHANGE LISTENER ── //
  function handleHashChange() {
    const path = getCurrentPath();
    const route = routes[path];
    if (!route) {
      navigate('/dashboard');
      return;
    }

    // Lock enforcement on direct URL navigation
    if (route.requiresImport && !Storage.isFirstImportComplete()) {
      // Don't redirect — just go back to dashboard silently.
      // The modal was already shown by navigate() if user clicked a nav item.
      // For raw URL access, just fall back to dashboard.
      window.location.hash = '/dashboard';
      return;
    }
    if (route.requiresOrientation && !Storage.isOrientationComplete()) {
      window.location.hash = '/dashboard';
      return;
    }

    render(path);
  }

  // ── ON NAVIGATE HOOK ── //
  function onNavigate(callback) {
    onNavigateCallbacks.push(callback);
  }

  // ── INIT ── //
  function init() {
    window.addEventListener('hashchange', handleHashChange);

    // Handle initial load
    const path = getCurrentPath();
    handleHashChange(path);
  }

  // ── PUBLIC API ── //
  return {
    register,
    navigate,
    back,
    forward,
    getCurrentPath,
    resolve,
    render,
    refreshLockStates,
    onNavigate,
    init,
    get routes() { return { ...routes }; },
    get currentRoute() { return currentRoute; },
  };
})();

window.Router = Router;
