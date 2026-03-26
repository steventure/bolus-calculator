// State management with localStorage persistence

const STORAGE_KEY = 'bolusCalcState';

const defaultState = {
  settings: {
    targetBG: null,
    icrMode: 'single',
    icrSingle: null,
    icrPerPeriod: {
      wakeUp: null,
      breakfast: null,
      lunch: null,
      dinner: null,
      bedTime: null
    },
    isfMode: 'single',
    isfSingle: null,
    isfPerPeriod: {
      wakeUp: null,
      breakfast: null,
      lunch: null,
      dinner: null,
      bedTime: null
    },
    insulinActionDuration: 240,
    roundingPreference: 'whole',
    showBreakdown: true
  },
  mockData: {
    recentInsulinLogs: DEFAULT_MOCK_INSULIN_LOGS,
    diaryBG: 180,
    diaryCarbs: 45,
    selectedInsulin: 'Fiasp'
  }
};

const State = {
  _state: null,
  _listeners: [],

  init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this._state = this._merge(defaultState, parsed);
      } catch (e) {
        this._state = JSON.parse(JSON.stringify(defaultState));
      }
    } else {
      this._state = JSON.parse(JSON.stringify(defaultState));
    }
  },

  _merge(defaults, saved) {
    const result = JSON.parse(JSON.stringify(defaults));
    if (saved.settings) {
      for (const key in saved.settings) {
        if (key in result.settings) {
          if (typeof result.settings[key] === 'object' && result.settings[key] !== null && !Array.isArray(result.settings[key])) {
            Object.assign(result.settings[key], saved.settings[key]);
          } else {
            result.settings[key] = saved.settings[key];
          }
        }
      }
    }
    // Migrate legacy DIA from hours to minutes
    if (result.settings.insulinActionDuration <= 8) {
      result.settings.insulinActionDuration = result.settings.insulinActionDuration * 60;
    }
    if (saved.mockData) {
      for (const key in saved.mockData) {
        if (key in result.mockData) {
          result.mockData[key] = saved.mockData[key];
        }
      }
    }
    return result;
  },

  get(path) {
    const parts = path.split('.');
    let val = this._state;
    for (const p of parts) {
      if (val == null) return undefined;
      val = val[p];
    }
    return val;
  },

  set(path, value) {
    const parts = path.split('.');
    let obj = this._state;
    for (let i = 0; i < parts.length - 1; i++) {
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    this._save();
    this._notify();
  },

  getSettings() {
    return JSON.parse(JSON.stringify(this._state.settings));
  },

  setSettings(settings) {
    this._state.settings = settings;
    this._save();
    this._notify();
  },

  getMockData() {
    return JSON.parse(JSON.stringify(this._state.mockData));
  },

  setMockData(data) {
    this._state.mockData = data;
    this._save();
  },

  isSettingsComplete() {
    const s = this._state.settings;
    if (s.targetBG == null) return false;
    if (s.icrMode === 'single' && s.icrSingle == null) return false;
    if (s.icrMode === 'perPeriod') {
      const vals = Object.values(s.icrPerPeriod);
      if (vals.some(v => v == null)) return false;
    }
    if (s.isfMode === 'single' && s.isfSingle == null) return false;
    if (s.isfMode === 'perPeriod') {
      const vals = Object.values(s.isfPerPeriod);
      if (vals.some(v => v == null)) return false;
    }
    return true;
  },

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
  },

  _notify() {
    this._listeners.forEach(fn => fn(this._state));
  },

  onChange(fn) {
    this._listeners.push(fn);
  },

  reset() {
    this._state = JSON.parse(JSON.stringify(defaultState));
    this._save();
  }
};
