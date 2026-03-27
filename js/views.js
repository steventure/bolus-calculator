// View render functions

const Views = {

  // ==========================================
  // VIEW 1: More Tab (Home Screen)
  // ==========================================
  more: {
    render() {
      return `
        <div class="header">
          <span class="header-title">More</span>
        </div>
        <div class="content" style="padding-bottom:72px">
          <div class="section-header" style="padding-top:12px"></div>
          <div class="card">
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon">&#127769;</span>
                <span class="list-row-label">Daily Routine</span>
              </div>
              <span class="list-row-chevron">&#8250;</span>
            </div>
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon">&#128200;</span>
                <span class="list-row-label">BG Measurement Plan</span>
              </div>
              <span class="list-row-chevron">&#8250;</span>
            </div>
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon">&#127860;</span>
                <span class="list-row-label">Favorite Food</span>
              </div>
              <span class="list-row-chevron">&#8250;</span>
            </div>
          </div>

          <div class="section-header">Medication & Lab Results</div>
          <div class="card">
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon">&#128138;</span>
                <span class="list-row-label">Medication & Reminders</span>
              </div>
              <span class="list-row-chevron">&#8250;</span>
            </div>
            <div class="list-row list-row-clickable" data-action="nav" data-view="calculator" data-mode="standalone" style="background:var(--color-primary-light)">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon" style="color:var(--color-primary)">&#128225;</span>
                <span class="list-row-label" style="color:var(--color-primary);font-weight:600">Bolus Calculator</span>
              </div>
              <span class="list-row-chevron" style="color:var(--color-primary)">&#8250;</span>
            </div>
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon">&#128300;</span>
                <span class="list-row-label">Lab Results (incl. A1C)</span>
              </div>
              <span class="list-row-chevron">&#8250;</span>
            </div>
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon">&#43;</span>
                <span class="list-row-label">Prescription History</span>
              </div>
              <span class="list-row-chevron">&#8250;</span>
            </div>
          </div>

          <div class="section-header">Account & Membership</div>
          <div class="card">
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon">&#128100;</span>
                <span class="list-row-label">Profile</span>
              </div>
              <span class="list-row-chevron">&#8250;</span>
            </div>
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon">&#9881;</span>
                <span class="list-row-label">Account</span>
              </div>
              <span class="list-row-chevron">&#8250;</span>
            </div>
          </div>
        </div>

        <div class="tab-bar">
          <div class="tab-item">
            <span class="tab-icon">&#128202;</span>
            <span>Dashboard</span>
          </div>
          <div class="tab-item">
            <span class="tab-icon">&#128221;</span>
            <span>Diary</span>
          </div>
          <div class="tab-item" data-action="open-diary">
            <div class="tab-add">+</div>
            <span>Add</span>
          </div>
          <div class="tab-item">
            <span class="tab-icon">&#128101;</span>
            <span>Partners</span>
          </div>
          <div class="tab-item active">
            <span class="tab-icon">&#9776;</span>
            <span>More</span>
          </div>
        </div>
      `;
    },

    init() {}
  },

  // ==========================================
  // VIEW 2: Medication Entry Card (Diary Entry - Panel)
  // ==========================================
  medication: {
    render(params) {
      const mockData = State.getMockData();
      const appliedDose = params.appliedDose;
      const appliedInsulin = params.appliedInsulin;
      const isApplied = appliedDose != null;
      const calcBG = params.calcBG;
      const calcCarbs = params.calcCarbs;

      // Use simulated diary time if set, otherwise current time
      const diaryTime = mockData.diaryTime ? new Date(mockData.diaryTime) : new Date();
      // datetime-local input requires local time string (not UTC)
      const pad = n => String(n).padStart(2, '0');
      const diaryTimeInputVal = `${diaryTime.getFullYear()}-${pad(diaryTime.getMonth()+1)}-${pad(diaryTime.getDate())}T${pad(diaryTime.getHours())}:${pad(diaryTime.getMinutes())}`;
      const period = BolusCalc.resolvePeriod(diaryTime);
      const periodLabel = PERIOD_LABELS[period];

      return `
        <div class="panel-handle"></div>
        <div class="header">
          <button class="header-back" data-action="close-panel">&#8249;</button>
          <span class="header-title">Diary Entry</span>
        </div>
        <div class="content">
          <div class="card" style="margin-top:12px">
            <div class="input-row">
              <span class="list-row-label">Time</span>
              <input type="datetime-local" id="diary-time-input" value="${diaryTimeInputVal}" style="font-size:13px;color:var(--color-primary);border:none;background:none;text-align:right;padding:0">
            </div>
            <div class="input-row">
              <span class="list-row-label">Period</span>
              <span class="list-row-value" id="diary-period-label">${periodLabel}</span>
            </div>
          </div>

          ${isApplied ? `<div class="toast" id="applied-toast">&#10003; Bolus dose of ${appliedDose}U (${appliedInsulin}) applied</div>` : ''}

          <div class="med-card">
            <div class="med-card-header">
              <span style="font-size:18px">&#128138;</span>
              <span class="med-card-title">Medication</span>
              <span class="med-card-close">&times;</span>
            </div>
            <div class="input-row">
              <span class="list-row-label">Carbs</span>
              <div class="input-row-right">
                <input class="input-field" type="text" inputmode="decimal" id="med-carbs" value="${calcCarbs != null ? calcCarbs : (mockData.diaryCarbs || '')}" placeholder="Enter">
                <span class="input-unit">gram</span>
              </div>
            </div>
            <div style="padding:8px 16px;font-size:13px;color:var(--color-text-secondary);border-bottom:1px solid var(--color-border)">Insulin/GLP-1</div>
            <div class="input-row">
              <div style="display:flex;align-items:center;gap:8px">
                <span class="med-checkbox ${isApplied ? 'checked' : ''}">
                  ${isApplied ? '&#10003;' : ''}
                </span>
                <span>${appliedInsulin || mockData.selectedInsulin || 'Fiasp'}</span>
              </div>
              <div class="input-row-right">
                <span class="list-row-value">${isApplied ? appliedDose : '—'}</span>
                <span class="input-unit">unit</span>
              </div>
            </div>
            <div style="padding:12px 16px">
              <span class="text-primary" style="font-size:14px;cursor:pointer">+ Add medication</span>
            </div>
          </div>

          <button class="bolus-calc-btn" id="med-bolus-calc-btn">
            &#128225; Bolus Calculator
          </button>

          <div style="padding:16px;text-align:center;color:var(--color-text-secondary);font-size:14px">Add others:</div>

          <div class="card">
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon" style="color:#FF6B6B">&#128167;</span>
                <span class="list-row-label">Blood Glucose</span>
              </div>
              <span style="font-size:20px;color:var(--color-text-tertiary)">+</span>
            </div>
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon" style="color:#FF9500">&#128147;</span>
                <span class="list-row-label">Blood Pressure & Pulse</span>
              </div>
              <span style="font-size:20px;color:var(--color-text-tertiary)">+</span>
            </div>
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon" style="color:#5AC8FA">&#9878;</span>
                <span class="list-row-label">Weight</span>
              </div>
              <span style="font-size:20px;color:var(--color-text-tertiary)">+</span>
            </div>
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon" style="color:#FF9500">&#127860;</span>
                <span class="list-row-label">Diet</span>
              </div>
              <span style="font-size:20px;color:var(--color-text-tertiary)">+</span>
            </div>
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon" style="color:#4CAF50">&#127939;</span>
                <span class="list-row-label">Exercise</span>
              </div>
              <span style="font-size:20px;color:var(--color-text-tertiary)">+</span>
            </div>
            <div class="list-row list-row-clickable">
              <div style="display:flex;align-items:center">
                <span class="list-row-icon" style="color:#FF9500">&#128221;</span>
                <span class="list-row-label">Note & Photo</span>
              </div>
              <span style="font-size:20px;color:var(--color-text-tertiary)">+</span>
            </div>
          </div>

          <div style="height:100px"></div>
        </div>

        <div style="position:sticky;bottom:0;padding:12px 16px;background:var(--color-card);border-top:1px solid var(--color-border)">
          <div style="display:flex;gap:12px">
            <button class="btn btn-outline" data-action="close-panel" style="flex:1">Cancel</button>
            <button class="btn btn-primary" data-action="close-panel" style="flex:1">Complete</button>
          </div>
        </div>
      `;
    },

    init(params) {
      const calcBG = params.calcBG;
      const calcCarbs = params.calcCarbs;

      // Diary time editing
      const diaryTimeInput = document.getElementById('diary-time-input');
      if (diaryTimeInput) {
        diaryTimeInput.addEventListener('change', () => {
          const val = diaryTimeInput.value;
          const md = State.getMockData();
          md.diaryTime = val ? new Date(val).getTime() : null;
          State.setMockData(md);
          const newTime = md.diaryTime ? new Date(md.diaryTime) : new Date();
          const newPeriod = BolusCalc.resolvePeriod(newTime);
          const periodLabel = document.getElementById('diary-period-label');
          if (periodLabel) periodLabel.textContent = PERIOD_LABELS[newPeriod];
        });
      }

      const btn = document.getElementById('med-bolus-calc-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          const carbsInput = document.getElementById('med-carbs');
          const currentCarbs = carbsInput ? parseFloat(carbsInput.value) || null : calcCarbs;
          App.navigate('calculator', {
            mode: 'contextual',
            calcBG: calcBG,
            calcCarbs: currentCarbs != null ? currentCarbs : calcCarbs
          });
        });
      }
      // Auto-dismiss toast
      const toast = document.getElementById('applied-toast');
      if (toast) {
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
          toast.classList.remove('show');
          toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, 3000);
      }
    }
  },

  // ==========================================
  // VIEW 4: Bolus Calculator
  // ==========================================
  calculator: {
    _result: null,

    render(params) {
      const mode = params.mode || 'standalone';
      const settings = State.getSettings();
      const mockData = State.getMockData();

      // Entry Point 1 (contextual): use simulated diary time
      // Entry Point 2 (standalone): use current system time
      let resolveTime;
      if (mode === 'contextual' && mockData.diaryTime) {
        resolveTime = new Date(mockData.diaryTime);
      } else {
        resolveTime = new Date();
      }

      const period = BolusCalc.resolvePeriod(resolveTime);
      const icr = BolusCalc.getEffectiveICR(settings, period);
      const isf = BolusCalc.getEffectiveISF(settings, period);
      const iob = BolusCalc.calculateIOB(
        mockData.recentInsulinLogs || [],
        settings.insulinActionDuration / 60,
        new Date()
      );
      const settingsComplete = State.isSettingsComplete();

      // Pre-fill based on mode
      let prefillBG = '';
      let prefillCarbs = '';
      if (mode === 'contextual') {
        prefillBG = params.calcBG != null ? params.calcBG : (mockData.diaryBG || '');
        prefillCarbs = params.calcCarbs != null ? params.calcCarbs : (mockData.diaryCarbs || '');
      }

      this._result = null;

      return `
        <div class="header">
          <button class="header-back" data-action="back">&#8249;</button>
          <span class="header-title">Bolus Calculator</span>
          <button class="header-action" data-action="nav" data-view="settings">&#9881;</button>
        </div>
        <div class="disclaimer">
          &#9888;&#65039; この計算結果は参考値です。インスリン量の調整については、必ず医師にご相談ください。
          <br><span style="font-size:11px;opacity:0.8">(This result is for reference only. Always consult your doctor before adjusting your insulin dose.)</span>
        </div>
        <div class="content" id="calc-content">
          ${!settingsComplete ? `
            <div class="warning-banner" style="margin-top:12px">
              <span class="warning-icon">&#9888;&#65039;</span>
              <div>
                <strong>Settings Required</strong><br>
                Please configure Target BG, ICR, and ISF before using the calculator.
                <br><br>
                <button class="btn btn-primary" style="width:auto;padding:10px 24px;font-size:14px" data-action="nav" data-view="settings">Go to Settings</button>
              </div>
            </div>
          ` : `
            <div class="section-header">Inputs</div>
            <div class="card">
              <div class="input-row">
                <span class="list-row-label">Current Blood Glucose</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="calc-bg" value="${prefillBG}" placeholder="Enter">
                  <span class="input-unit">mg/dL</span>
                </div>
              </div>
              <div class="input-row">
                <span class="list-row-label">Carbohydrates</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="calc-carbs" value="${prefillCarbs}" placeholder="Enter">
                  <span class="input-unit">g</span>
                </div>
              </div>
              <div class="input-row">
                <span class="list-row-label">IOB</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="calc-iob" value="${Math.round(iob * 100) / 100}" placeholder="0">
                  <span class="input-unit">U</span>
                </div>
              </div>
            </div>
            ${iob > 0 ? `<div class="iob-info">IOB auto-calculated from ${(mockData.recentInsulinLogs || []).filter(l => (Date.now() - l.timestamp) < settings.insulinActionDuration * 60000).length} recent dose(s) within the past ${formatDIA(settings.insulinActionDuration)}</div>` : ''}

            <div class="section-header">Parameters (${PERIOD_LABELS[period]})</div>
            <div class="card">
              <div class="input-row">
                <span class="list-row-label">Target BG</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="calc-target-bg" value="${settings.targetBG != null ? settings.targetBG : ''}" placeholder="Enter">
                  <span class="input-unit">mg/dL</span>
                </div>
              </div>
              <div class="input-row">
                <span class="list-row-label">ICR</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="calc-icr" value="${icr != null ? icr : ''}" placeholder="Enter">
                  <span class="input-unit">g/U</span>
                </div>
              </div>
              <div class="input-row">
                <span class="list-row-label">ISF</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="calc-isf" value="${isf != null ? isf : ''}" placeholder="Enter">
                  <span class="input-unit">(mg/dL)/U</span>
                </div>
              </div>
            </div>

            <div style="padding:16px">
              <button class="btn btn-primary" id="calc-btn">Calculate</button>
            </div>

            <div id="calc-result"></div>

            <div id="calc-action" class="hidden" style="padding:0 16px 16px">
              <div class="section-header" style="padding-left:0">${mode === 'contextual' ? 'Apply To' : 'Rapid-Acting Insulin'}</div>
              <select class="select-field" id="calc-insulin" style="margin-bottom:12px">
                ${RAPID_ACTING_INSULINS.map(ins =>
                  `<option value="${ins}" ${ins === (mockData.selectedInsulin || 'Fiasp') ? 'selected' : ''}>${ins}</option>`
                ).join('')}
              </select>
              <button class="btn btn-primary" id="calc-apply">
                ${mode === 'contextual' ? 'Apply' : 'Create Diary'}
              </button>
            </div>
          `}
        </div>
      `;
    },

    init(params) {
      const mode = params.mode || 'standalone';
      const calcBtn = document.getElementById('calc-btn');
      if (!calcBtn) return;

      calcBtn.addEventListener('click', () => {
        const settings = State.getSettings();

        const currentBG = parseFloat(document.getElementById('calc-bg').value) || null;
        const carbs = parseFloat(document.getElementById('calc-carbs').value) || 0;
        const iob = parseFloat(document.getElementById('calc-iob').value) || 0;
        const targetBG = parseFloat(document.getElementById('calc-target-bg').value) || null;
        const icr = parseFloat(document.getElementById('calc-icr').value) || null;
        const isf = parseFloat(document.getElementById('calc-isf').value) || null;

        const result = BolusCalc.calculate({
          currentBG,
          carbs,
          targetBG,
          icr,
          isf,
          iob,
          roundingPreference: settings.roundingPreference
        });

        this._result = result;

        let resultHtml = `
          <div class="result-card">
            <div class="result-label">Recommended Bolus</div>
            <div class="result-value">${result.recommended.toFixed(1)}<span class="result-unit">U</span></div>
            ${result.capped ? '<div style="font-size:12px;color:var(--color-warning);margin-top:4px">Capped at maximum 50U</div>' : ''}
            ${settings.showBreakdown ? `
              <div class="result-breakdown">
                <div class="breakdown-row">
                  <span class="breakdown-label">Carb Dose</span>
                  <span class="breakdown-value">${result.carbDose} U</span>
                </div>
                <div class="breakdown-row">
                  <span class="breakdown-label">Correction Dose</span>
                  <span class="breakdown-value">${result.correctionDose} U</span>
                </div>
                <div class="breakdown-row">
                  <span class="breakdown-label">IOB (subtracted)</span>
                  <span class="breakdown-value">−${result.iob} U</span>
                </div>
              </div>
            ` : ''}
          </div>
        `;

        if (result.warning) {
          resultHtml += `
            <div class="warning-banner">
              <span class="warning-icon">&#9888;&#65039;</span>
              <div>This is a really large dose, please double-check your entries and settings. Please also confirm with your doctor if you really need to take that much.</div>
            </div>
          `;
        }

        document.getElementById('calc-result').innerHTML = resultHtml;
        document.getElementById('calc-action').classList.remove('hidden');
      });

      // Apply / Create Diary
      const applyBtn = document.getElementById('calc-apply');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          if (!this._result) return;
          const insulin = document.getElementById('calc-insulin').value;

          if (mode === 'contextual') {
            const bg = document.getElementById('calc-bg').value;
            const carbs = document.getElementById('calc-carbs').value;
            App.navigate('medication', {
              appliedDose: this._result.recommended,
              appliedInsulin: insulin,
              calcBG: bg ? parseFloat(bg) : null,
              calcCarbs: carbs ? parseFloat(carbs) : null
            });
          } else {
            const bg = document.getElementById('calc-bg').value;
            const carbs = document.getElementById('calc-carbs').value;
            App._currentView = 'more';
            App._currentParams = {};
            App._history = [];
            App._render();
            App.openPanel('medication', {
              appliedDose: this._result.recommended,
              appliedInsulin: insulin,
              calcBG: bg ? parseFloat(bg) : null,
              calcCarbs: carbs ? parseFloat(carbs) : null
            });
          }
        });
      }
    }
  },

  // ==========================================
  // VIEW 5: Bolus Settings
  // ==========================================
  settings: {
    _draft: null,

    render() {
      const s = State.getSettings();
      this._draft = JSON.parse(JSON.stringify(s));
      const blocks = BolusCalc.getTimeBlocks();

      return `
        <div class="header">
          <button class="header-back" data-action="back">&#8249;</button>
          <span class="header-title">Bolus Settings</span>
        </div>
        <div class="content" id="settings-content">
          <div class="section-header">Target Blood Glucose</div>
          <div class="card">
            <div class="input-row">
              <span class="list-row-label">Target BG</span>
              <div class="input-row-right">
                <input class="input-field settings-input" type="text" inputmode="decimal" data-setting="targetBG" value="${s.targetBG || ''}" placeholder="Enter">
                <span class="input-unit">mg/dL</span>
              </div>
            </div>
          </div>

          <div class="section-header" style="display:flex;align-items:center;justify-content:space-between">
            <span>Insulin-to-Carb Ratio (ICR)</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;padding:0 16px 8px">
            <div class="segmented" id="icr-mode-toggle" style="flex:1;margin:0">
              <button class="segmented-btn ${s.icrMode === 'single' ? 'active' : ''}" data-mode="single" data-target="icr">Single Value</button>
              <button class="segmented-btn ${s.icrMode === 'perPeriod' ? 'active' : ''}" data-mode="perPeriod" data-target="icr">Per Block</button>
            </div>
            <button class="info-btn" id="icr-info-btn" style="${s.icrMode === 'perPeriod' ? '' : 'visibility:hidden'}">&#9432;</button>
          </div>
          <div class="card">
            <div id="icr-single" class="${s.icrMode === 'perPeriod' ? 'hidden' : ''}">
              <div class="input-row">
                <span class="list-row-label">ICR</span>
                <div class="input-row-right">
                  <input class="input-field settings-input" type="text" inputmode="decimal" data-setting="icrSingle" value="${s.icrSingle || ''}" placeholder="Enter">
                  <span class="input-unit">g/U</span>
                </div>
              </div>
            </div>
            <div id="icr-period" class="${s.icrMode === 'single' ? 'hidden' : ''}">
              ${Object.entries(PERIOD_LABELS).map(([key, label]) => `
                <div class="input-row">
                  <div>
                    <span class="list-row-label" style="font-size:14px">${label}</span>
                    <div style="font-size:11px;color:var(--color-text-secondary)">${formatTimeRange(blocks[key])}</div>
                  </div>
                  <div class="input-row-right">
                    <input class="input-field settings-input" type="text" inputmode="decimal" data-setting="icrPerPeriod.${key}" value="${s.icrPerPeriod[key] || ''}" placeholder="—">
                    <span class="input-unit">g/U</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section-header">Insulin Sensitivity Factor (ISF)</div>
          <div style="display:flex;align-items:center;gap:8px;padding:0 16px 8px">
            <div class="segmented" id="isf-mode-toggle" style="flex:1;margin:0">
              <button class="segmented-btn ${s.isfMode === 'single' ? 'active' : ''}" data-mode="single" data-target="isf">Single Value</button>
              <button class="segmented-btn ${s.isfMode === 'perPeriod' ? 'active' : ''}" data-mode="perPeriod" data-target="isf">Per Block</button>
            </div>
            <button class="info-btn" id="isf-info-btn" style="${s.isfMode === 'perPeriod' ? '' : 'visibility:hidden'}">&#9432;</button>
          </div>
          <div class="card">
            <div id="isf-single" class="${s.isfMode === 'single' ? '' : 'hidden'}">
              <div class="input-row">
                <span class="list-row-label">ISF</span>
                <div class="input-row-right">
                  <input class="input-field settings-input" type="text" inputmode="decimal" data-setting="isfSingle" value="${s.isfSingle || ''}" placeholder="Enter">
                  <span class="input-unit">(mg/dL)/U</span>
                </div>
              </div>
            </div>
            <div id="isf-period" class="${s.isfMode === 'single' ? 'hidden' : ''}">
              ${Object.entries(PERIOD_LABELS).map(([key, label]) => `
                <div class="input-row">
                  <div>
                    <span class="list-row-label" style="font-size:14px">${label}</span>
                    <div style="font-size:11px;color:var(--color-text-secondary)">${formatTimeRange(blocks[key])}</div>
                  </div>
                  <div class="input-row-right">
                    <input class="input-field settings-input" type="text" inputmode="decimal" data-setting="isfPerPeriod.${key}" value="${s.isfPerPeriod[key] || ''}" placeholder="—">
                    <span class="input-unit">(mg/dL)/U</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section-header">Other Settings</div>
          <div class="card">
            <div class="list-row">
              <span class="list-row-label">Insulin Action Duration</span>
              <div class="stepper">
                <button class="stepper-btn" id="duration-minus">&minus;</button>
                <span class="stepper-value" id="duration-value">${formatDIA(s.insulinActionDuration)}</span>
                <button class="stepper-btn" id="duration-plus">+</button>
              </div>
            </div>
            <div class="list-row">
              <span class="list-row-label">Rounding</span>
              <div>
                <select class="select-field" id="rounding-select" style="width:auto">
                  <option value="whole" ${s.roundingPreference === 'whole' ? 'selected' : ''}>Whole Number</option>
                  <option value="half" ${s.roundingPreference === 'half' ? 'selected' : ''}>Nearest 0.5</option>
                </select>
              </div>
            </div>
            <div class="list-row">
              <span class="list-row-label">Show Calculation Breakdown</span>
              <label class="toggle">
                <input type="checkbox" id="breakdown-toggle" ${s.showBreakdown ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div style="padding:16px">
            <button class="btn btn-primary" id="settings-confirm">Confirm</button>
          </div>
          <div style="height:24px"></div>
        </div>
      `;
    },

    init() {
      const draft = this._draft;

      // Segmented toggle for ICR
      document.querySelectorAll('#icr-mode-toggle .segmented-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const mode = e.target.dataset.mode;
          draft.icrMode = mode;
          document.querySelectorAll('#icr-mode-toggle .segmented-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          document.getElementById('icr-single').classList.toggle('hidden', mode !== 'single');
          document.getElementById('icr-period').classList.toggle('hidden', mode !== 'perPeriod');
          document.getElementById('icr-info-btn').style.visibility = mode === 'perPeriod' ? 'visible' : 'hidden';
        });
      });

      // Segmented toggle for ISF
      document.querySelectorAll('#isf-mode-toggle .segmented-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const mode = e.target.dataset.mode;
          draft.isfMode = mode;
          document.querySelectorAll('#isf-mode-toggle .segmented-btn').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          document.getElementById('isf-single').classList.toggle('hidden', mode !== 'single');
          document.getElementById('isf-period').classList.toggle('hidden', mode !== 'perPeriod');
          document.getElementById('isf-info-btn').style.visibility = mode === 'perPeriod' ? 'visible' : 'hidden';
        });
      });

      // Info buttons
      document.getElementById('icr-info-btn').addEventListener('click', () => showTimeBlockInfo());
      document.getElementById('isf-info-btn').addEventListener('click', () => showTimeBlockInfo());

      // Input changes
      document.querySelectorAll('.settings-input').forEach(input => {
        input.addEventListener('input', (e) => {
          const key = e.target.dataset.setting;
          const val = e.target.value ? parseFloat(e.target.value) : null;
          if (key.includes('.')) {
            const [parent, child] = key.split('.');
            draft[parent][child] = val;
          } else {
            draft[key] = val;
          }
        });
      });

      // Duration stepper
      document.getElementById('duration-minus').addEventListener('click', () => {
        if (draft.insulinActionDuration > 120) {
          draft.insulinActionDuration -= 10;
          document.getElementById('duration-value').textContent = formatDIA(draft.insulinActionDuration);
        }
      });
      document.getElementById('duration-plus').addEventListener('click', () => {
        if (draft.insulinActionDuration < 480) {
          draft.insulinActionDuration += 10;
          document.getElementById('duration-value').textContent = formatDIA(draft.insulinActionDuration);
        }
      });

      // Rounding
      document.getElementById('rounding-select').addEventListener('change', (e) => {
        draft.roundingPreference = e.target.value;
      });

      // Breakdown toggle
      document.getElementById('breakdown-toggle').addEventListener('change', (e) => {
        draft.showBreakdown = e.target.checked;
      });

      // Confirm
      document.getElementById('settings-confirm').addEventListener('click', () => {
        State.setSettings(draft);
        App.back();
      });
    }
  },

  // ==========================================
  // VIEW 6: Daily Routine Settings
  // ==========================================
  routine: {
    _draft: null,

    render() {
      const rt = State.getRoutineTimes();
      this._draft = JSON.parse(JSON.stringify(rt));

      return `
        <div class="header">
          <button class="header-back" data-action="back">&#8249;</button>
          <span class="header-title">Daily Routine</span>
        </div>
        <div class="content">
          <div class="section-header">Set your daily schedule</div>
          <div style="padding:0 16px 12px;font-size:13px;color:var(--color-text-secondary)">
            These times define how your day is divided into time blocks for ICR and ISF settings.
          </div>
          <div class="card">
            ${[
              { key: 'wakeUp', label: 'Wakeup', icon: '&#9728;&#65039;' },
              { key: 'breakfast', label: 'Breakfast', icon: '&#127838;' },
              { key: 'lunch', label: 'Lunch', icon: '&#127858;' },
              { key: 'dinner', label: 'Dinner', icon: '&#127860;' },
              { key: 'bedTime', label: 'Bedtime', icon: '&#127769;' }
            ].map(item => `
              <div class="input-row">
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:18px">${item.icon}</span>
                  <span class="list-row-label">${item.label}</span>
                </div>
                <input type="time" class="time-input" id="routine-${item.key}" value="${formatHourToTimeInput(rt[item.key])}">
              </div>
            `).join('')}
          </div>

          <div class="section-header">Resulting Time Blocks</div>
          <div class="card" id="routine-blocks-preview">
            ${renderBlocksPreview(rt)}
          </div>

          <div style="padding:16px">
            <button class="btn btn-primary" id="routine-confirm">Save</button>
          </div>
        </div>
      `;
    },

    init() {
      const draft = this._draft;
      const timeInputs = ['wakeUp', 'breakfast', 'lunch', 'dinner', 'bedTime'];

      timeInputs.forEach(key => {
        const input = document.getElementById(`routine-${key}`);
        input.addEventListener('change', () => {
          const [h, m] = input.value.split(':').map(Number);
          draft[key] = h + m / 60;
          // Update preview
          document.getElementById('routine-blocks-preview').innerHTML = renderBlocksPreview(draft);
        });
      });

      document.getElementById('routine-confirm').addEventListener('click', () => {
        State.setRoutineTimes(draft);
        App.back();
      });
    }
  }
};

// ==========================================
// Time Block Info Panel
// ==========================================

function showTimeBlockInfo() {
  const rt = State.getRoutineTimes();
  const blocks = BolusCalc.getTimeBlocks(rt);

  const overlay = document.createElement('div');
  overlay.id = 'info-modal';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="sim-modal-box">
      <div class="sim-modal-header">
        <span style="font-size:15px;font-weight:600">Time Block Definitions</span>
        <span id="info-modal-close" style="font-size:22px;cursor:pointer;color:var(--color-text-secondary)">&times;</span>
      </div>
      <div class="sim-modal-body">
        <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:12px">
          ICR and ISF can vary across the day due to circadian hormonal patterns. Time blocks are divided by your daily routine schedule.
        </div>
        <div class="card" style="margin:0">
          <div class="input-row" style="padding:10px 12px;font-weight:600;font-size:12px;color:var(--color-text-secondary)">
            <span>Block</span>
            <span>Start → End</span>
          </div>
          ${Object.entries(PERIOD_LABELS).map(([key, label]) => `
            <div class="input-row" style="padding:10px 12px">
              <span style="font-size:13px;font-weight:500">${label}</span>
              <span style="font-size:13px;color:var(--color-text-secondary)">${formatTimeRange(blocks[key])}</span>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:12px;font-size:12px;color:var(--color-text-secondary)">
          <div style="margin-bottom:4px"><strong>Block boundary rules:</strong></div>
          <div>Early Morning: Wakeup → Breakfast</div>
          <div>Morning: Breakfast → max(Breakfast, Lunch−1h)</div>
          <div>Afternoon: Lunch−1h → max(Lunch, Dinner−1h)</div>
          <div>Evening: Dinner−1h → max(Dinner, Bedtime−1h)</div>
          <div>Overnight: Bedtime−1h → Wakeup</div>
        </div>
      </div>
      <div style="padding:12px 16px;border-top:1px solid var(--color-border)">
        <button class="btn btn-primary" id="info-goto-routine" style="font-size:15px;padding:12px">Adjust Daily Routine</button>
      </div>
    </div>
  `;

  document.getElementById('app-frame').appendChild(overlay);

  const closeModal = () => overlay.remove();
  document.getElementById('info-modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.getElementById('info-goto-routine').addEventListener('click', () => {
    closeModal();
    App.navigate('routine');
  });
}

// ==========================================
// Simulation Settings Modal
// ==========================================

const SimModal = {
  show(onConfirm) {
    const mockData = State.getMockData();
    const logs = mockData.recentInsulinLogs || [];

    let logsHtml = '';
    if (logs.length > 0) {
      logsHtml = logs.map((log, i) => {
        const ago = formatTimeAgo(log.timestamp);
        return `<div class="mock-log-item">
          <span>${log.name} — ${log.dose}U — ${ago}</span>
          <span class="mock-log-remove" data-sim-remove="${i}">&times;</span>
        </div>`;
      }).join('');
    } else {
      logsHtml = '<div class="mock-log-item" style="color:var(--color-text-secondary)">No recent insulin logs</div>';
    }

    const overlay = document.createElement('div');
    overlay.id = 'sim-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="sim-modal-box">
        <div class="sim-modal-header">
          <span style="font-size:15px;font-weight:600">Simulation Settings</span>
          <span id="sim-modal-close" style="font-size:22px;cursor:pointer;color:var(--color-text-secondary)">&times;</span>
        </div>
        <div class="sim-modal-body">
          <div class="mock-config" style="margin:0">
            <h3>Insulin Logs (for IOB)</h3>
            <div id="sim-logs-list">${logsHtml}</div>
            <div class="card" style="margin:0;margin-top:8px">
              <div class="input-row" style="padding:10px 12px">
                <span style="font-size:13px;color:var(--color-text)">Dose</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="sim-log-dose" value="4" placeholder="0" style="width:44px;font-size:14px">
                  <span class="input-unit">U</span>
                </div>
              </div>
              <div class="input-row" style="padding:10px 12px">
                <span style="font-size:13px;color:var(--color-text)">Time ago</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="sim-log-mins" value="60" placeholder="0" style="width:44px;font-size:14px">
                  <span class="input-unit">min</span>
                </div>
              </div>
            </div>
            <button class="mock-add-btn" id="sim-add-log" style="font-size:13px;padding:8px">+ Add Log</button>
          </div>

          <div class="mock-config" style="margin:0;margin-top:16px">
            <h3>Diary Entry Values</h3>
            <div class="card" style="margin:0">
              <div class="input-row" style="padding:10px 12px">
                <span style="font-size:13px;color:var(--color-text)">Blood Glucose</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="sim-bg" value="${mockData.diaryBG || ''}" placeholder="—" style="width:50px;font-size:14px">
                  <span class="input-unit">mg/dL</span>
                </div>
              </div>
              <div class="input-row" style="padding:10px 12px">
                <span style="font-size:13px;color:var(--color-text)">Carbohydrates</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="sim-carbs" value="${mockData.diaryCarbs || ''}" placeholder="—" style="width:50px;font-size:14px">
                  <span class="input-unit">g</span>
                </div>
              </div>
              <div class="input-row" style="padding:10px 12px">
                <span style="font-size:13px;color:var(--color-text)">Insulin</span>
                <div class="input-row-right">
                  <select class="select-field" id="sim-insulin" style="width:auto;font-size:13px;padding:6px 28px 6px 8px">
                    ${RAPID_ACTING_INSULINS.map(ins =>
                      `<option value="${ins}" ${ins === mockData.selectedInsulin ? 'selected' : ''}>${ins}</option>`
                    ).join('')}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="padding:12px 16px;border-top:1px solid var(--color-border)">
          <button class="btn btn-primary" id="sim-confirm" style="font-size:15px;padding:12px">Continue</button>
        </div>
      </div>
    `;

    document.getElementById('app-frame').appendChild(overlay);

    // Bind events
    const closeModal = () => {
      overlay.remove();
    };

    // Helper: capture current diary input values into mock data object
    const saveDiaryInputs = (md) => {
      const bgVal = document.getElementById('sim-bg').value;
      const carbsVal = document.getElementById('sim-carbs').value;
      md.diaryBG = bgVal ? parseFloat(bgVal) : null;
      md.diaryCarbs = carbsVal ? parseFloat(carbsVal) : null;
      md.selectedInsulin = document.getElementById('sim-insulin').value;
    };

    document.getElementById('sim-modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Remove log
    overlay.querySelectorAll('[data-sim-remove]').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.simRemove);
        const md = State.getMockData();
        md.recentInsulinLogs.splice(idx, 1);
        saveDiaryInputs(md);
        State.setMockData(md);
        closeModal();
        SimModal.show(onConfirm);
      });
    });

    // Add log
    document.getElementById('sim-add-log').addEventListener('click', () => {
      const dose = parseFloat(document.getElementById('sim-log-dose').value) || 0;
      const minsAgo = parseFloat(document.getElementById('sim-log-mins').value) || 0;
      if (dose <= 0) return;
      const md = State.getMockData();
      const insulinName = document.getElementById('sim-insulin').value || 'Fiasp';
      md.recentInsulinLogs.push({
        name: insulinName,
        dose: dose,
        timestamp: Date.now() - minsAgo * 60 * 1000
      });
      saveDiaryInputs(md);
      State.setMockData(md);
      closeModal();
      SimModal.show(onConfirm);
    });

    // Confirm — save values and proceed
    document.getElementById('sim-confirm').addEventListener('click', () => {
      const md = State.getMockData();
      saveDiaryInputs(md);
      State.setMockData(md);
      closeModal();
      if (onConfirm) onConfirm();
    });
  }
};

// ==========================================
// Helpers
// ==========================================

function formatTimeAgo(timestamp) {
  const mins = Math.round((Date.now() - timestamp) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  if (remainMins === 0) return `${hours}h ago`;
  return `${hours}h ${remainMins}m ago`;
}

function formatDIA(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatDecimalHour(h) {
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}

function formatTimeRange(block) {
  return `${formatDecimalHour(block.start)} – ${formatDecimalHour(block.end)}`;
}

function formatHourToTimeInput(h) {
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function renderBlocksPreview(rt) {
  const blocks = BolusCalc.getTimeBlocks(rt);
  return Object.entries(PERIOD_LABELS).map(([key, label]) => `
    <div class="input-row" style="padding:8px 16px">
      <span style="font-size:13px;font-weight:500">${label}</span>
      <span style="font-size:13px;color:var(--color-text-secondary)">${formatTimeRange(blocks[key])}</span>
    </div>
  `).join('');
}
