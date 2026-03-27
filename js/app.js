// App initialization, routing, and event delegation

const App = {
  _history: [],
  _currentView: 'more',
  _currentParams: {},
  _panelOpen: false,
  _panelView: null,
  _panelParams: {},

  init() {
    State.init();
    this._currentView = 'more';
    this._currentParams = {};
    this._history = [];
    this._render();

    // Global event delegation for nav actions (on the whole app-frame to capture panel clicks too)
    document.getElementById('app-frame').addEventListener('click', (e) => {
      const navEl = e.target.closest('[data-action="nav"]');
      if (navEl) {
        e.preventDefault();
        const view = navEl.dataset.view;
        const params = {};
        if (navEl.dataset.mode) params.mode = navEl.dataset.mode;
        this.navigate(view, params);
        return;
      }

      const backEl = e.target.closest('[data-action="back"]');
      if (backEl) {
        e.preventDefault();
        this.back();
        return;
      }

      // Open diary panel from + button
      const addEl = e.target.closest('[data-action="open-diary"]');
      if (addEl) {
        e.preventDefault();
        this.openPanel('medication', {});
        return;
      }

      // Close diary panel
      const closePanelEl = e.target.closest('[data-action="close-panel"]');
      if (closePanelEl) {
        e.preventDefault();
        this.closePanel();
        return;
      }
    });
  },

  navigate(viewName, params = {}) {
    if (this._panelOpen) {
      // Navigation within the panel
      this._history.push({
        view: this._panelView,
        params: this._panelParams
      });
      this._panelView = viewName;
      this._panelParams = params;
      this._renderPanel();
    } else {
      // Navigation on the main screen
      this._history.push({
        view: this._currentView,
        params: this._currentParams
      });
      this._currentView = viewName;
      this._currentParams = params;
      this._render();
    }
  },

  back() {
    if (this._panelOpen) {
      if (this._history.length > 0) {
        // Check if back goes to a panel view or exits panel
        const prev = this._history.pop();
        // If the previous view was the medication panel entry point, go back within panel
        this._panelView = prev.view;
        this._panelParams = prev.params;
        this._renderPanel();
      }
    } else {
      if (this._history.length > 0) {
        const prev = this._history.pop();
        this._currentView = prev.view;
        this._currentParams = prev.params;
        this._render();
      }
    }
  },

  openPanel(viewName, params) {
    this._panelOpen = true;
    this._panelView = viewName;
    this._panelParams = params;
    // Clear history when opening a new panel
    this._history = [];
    this._renderPanel();
    // Trigger slide-up animation
    requestAnimationFrame(() => {
      const panel = document.getElementById('slide-panel');
      if (panel) {
        requestAnimationFrame(() => {
          panel.classList.add('open');
        });
      }
    });
  },

  closePanel() {
    const panel = document.getElementById('slide-panel');
    if (panel) {
      panel.classList.remove('open');
      panel.addEventListener('transitionend', () => {
        this._panelOpen = false;
        this._panelView = null;
        this._panelParams = {};
        this._history = [];
        // Remove panel from DOM
        panel.remove();
      }, { once: true });
    } else {
      this._panelOpen = false;
    }
  },

  _render() {
    const container = document.getElementById('app');
    const view = Views[this._currentView];
    if (!view) {
      container.innerHTML = '<div style="padding:40px;text-align:center">View not found</div>';
      return;
    }
    container.innerHTML = view.render(this._currentParams);
    view.init(this._currentParams);
    document.getElementById('app-frame').scrollTop = 0;
  },

  _renderPanel() {
    let panel = document.getElementById('slide-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'slide-panel';
      panel.className = 'slide-panel';
      document.getElementById('app-frame').appendChild(panel);
    }
    const view = Views[this._panelView];
    if (!view) return;
    panel.innerHTML = view.render(this._panelParams);
    view.init(this._panelParams);
    panel.scrollTop = 0;
  }
};

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
