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
      const calcCarbs = params.calcCarbs;

      // Always default to current system time when opening a diary
      const diaryTime = new Date();
      State.setMockData(Object.assign(State.getMockData(), { diaryTime: diaryTime.getTime() }));
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
                <input class="input-field" type="text" inputmode="decimal" id="med-carbs" value="${calcCarbs != null ? calcCarbs : ''}" placeholder="Enter">
                <span class="input-unit">gram</span>
              </div>
            </div>
            <div style="padding:8px 16px;font-size:13px;color:var(--color-text-secondary);border-bottom:1px solid var(--color-border)">Insulin/GLP-1</div>
            ${isApplied ? `
            <div class="input-row">
              <div style="display:flex;align-items:center;gap:8px">
                <span class="med-checkbox checked">&#10003;</span>
                <span>${appliedInsulin}</span>
              </div>
              <div class="input-row-right">
                <span class="list-row-value">${appliedDose}</span>
                <span class="input-unit">unit</span>
              </div>
            </div>
            ` : `
            <div id="med-insulin-list"></div>
            <div style="padding:12px 16px">
              <span class="text-primary" style="font-size:14px;cursor:pointer" id="med-add-medication">+ Add medication</span>
            </div>
            `}
          </div>

          <button class="bolus-calc-btn" id="med-bolus-calc-btn" ${isApplied ? '' : 'style="display:none"'}>
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

      let selectedInsulin = params.appliedDose != null ? params.appliedInsulin : null;

      const addMedBtn = document.getElementById('med-add-medication');
      if (addMedBtn) {
        addMedBtn.addEventListener('click', () => {
          addMedBtn.style.display = 'none';
          const list = document.getElementById('med-insulin-list');
          const selectRow = document.createElement('div');
          selectRow.style.cssText = 'padding:8px 16px';
          selectRow.innerHTML = `
            <select class="select-field" id="med-insulin-select">
              <option value="">Select insulin...</option>
              ${RAPID_ACTING_INSULINS.map(ins => `<option value="${ins}">${ins}</option>`).join('')}
            </select>`;
          list.appendChild(selectRow);
          document.getElementById('med-insulin-select').addEventListener('change', (e) => {
            const val = e.target.value;
            if (!val) return;
            selectedInsulin = val;
            selectRow.remove();
            addMedBtn.style.display = '';
            const insulinRow = document.createElement('div');
            insulinRow.className = 'input-row';
            insulinRow.innerHTML = `
              <div style="display:flex;align-items:center;gap:8px">
                <span class="med-checkbox"></span>
                <span>${val}</span>
              </div>
              <div class="input-row-right">
                <span class="list-row-value">—</span>
                <span class="input-unit">unit</span>
              </div>`;
            list.appendChild(insulinRow);
            document.getElementById('med-bolus-calc-btn').style.display = '';
          });
        });
      }

      const btn = document.getElementById('med-bolus-calc-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          const carbsInput = document.getElementById('med-carbs');
          App.navigate('calculator', {
            mode: 'contextual',
            calcCarbs: carbsInput ? parseFloat(carbsInput.value) || null : null,
            selectedInsulin: selectedInsulin
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

      // Carbs pre-fill (from diary)
      let prefillCarbs = '';
      if (mode === 'contextual') {
        prefillCarbs = params.calcCarbs != null ? params.calcCarbs : '';
      }

      // BG from most recent log within 30 minutes
      const bgLogs = mockData.recentBGLogs || [];
      const recentBGLog = bgLogs
        .filter(l => Date.now() - l.timestamp <= 30 * 60 * 1000)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      const prefillBG = recentBGLog ? recentBGLog.value : '';

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
                <div style="display:flex;flex-direction:column;gap:2px">
                  <span class="list-row-label">Current Blood Glucose</span>
                  <button id="bg-logs-btn" style="font-size:11px;color:var(--color-primary);background:none;border:none;padding:0;text-align:left;cursor:pointer">Manage Logs</button>
                </div>
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
                <div style="display:flex;flex-direction:column;gap:2px">
                  <span class="list-row-label">IOB</span>
                  <button id="iob-logs-btn" style="font-size:11px;color:var(--color-primary);background:none;border:none;padding:0;text-align:left;cursor:pointer">Manage Logs</button>
                </div>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="calc-iob" value="${Math.round(iob * 100) / 100}" placeholder="0">
                  <span class="input-unit">U</span>
                </div>
              </div>
            </div>
            <div class="iob-info" id="iob-info" ${iob > 0 ? '' : 'style="display:none"'}>IOB auto-calculated from ${(mockData.recentInsulinLogs || []).filter(l => (Date.now() - l.timestamp) < settings.insulinActionDuration * 60000).length} recent dose(s) within the past ${formatDIA(settings.insulinActionDuration)}</div>
            <div class="iob-info" id="bg-info" ${recentBGLog ? '' : 'style="display:none"'}>BG auto-filled from most recent log (${recentBGLog ? formatTimeAgo(recentBGLog.timestamp) : ''})</div>

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

          `}
        </div>
      `;
    },

    init(params) {
      const mode = params.mode || 'standalone';
      const calcBtn = document.getElementById('calc-btn');
      if (!calcBtn) return;

      const iobLogsBtn = document.getElementById('iob-logs-btn');
      if (iobLogsBtn) iobLogsBtn.addEventListener('click', () => showIobLogsPanel());

      const bgLogsBtn = document.getElementById('bg-logs-btn');
      if (bgLogsBtn) bgLogsBtn.addEventListener('click', () => showBgLogsPanel());

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
        showCalcResultModal({
          result,
          settings,
          mode,
          selectedInsulin: params.selectedInsulin || State.getMockData().selectedInsulin || 'Fiasp',
          onApply: (insulin) => {
            const carbs = document.getElementById('calc-carbs').value;
            if (mode === 'contextual') {
              App.navigate('medication', {
                appliedDose: result.recommended,
                appliedInsulin: insulin,
                calcCarbs: carbs ? parseFloat(carbs) : null
              });
            } else {
              App._currentView = 'more';
              App._currentParams = {};
              App._history = [];
              App._render();
              App.openPanel('medication', {
                appliedDose: result.recommended,
                appliedInsulin: insulin,
                calcCarbs: carbs ? parseFloat(carbs) : null
              });
            }
          }
        });
      });
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
// Calc Result Modal
// ==========================================

function showCalcResultModal({ result, settings, mode, selectedInsulin, onApply }) {
  const existing = document.getElementById('calc-result-modal');
  if (existing) existing.remove();

  let resultHtml = `
    <div class="result-card" style="margin:0">
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
      <div class="warning-banner" style="margin-top:12px">
        <span class="warning-icon">&#9888;&#65039;</span>
        <div>This is a really large dose, please double-check your entries and settings. Please also confirm with your doctor if you really need to take that much.</div>
      </div>
    `;
  }

  const overlay = document.createElement('div');
  overlay.id = 'calc-result-modal';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="sim-modal-box">
      <div class="sim-modal-header">
        <span style="font-size:15px;font-weight:600">Bolus Recommendation</span>
      </div>
      <div class="sim-modal-body">
        ${resultHtml}
        <div style="margin-top:16px">
          <div class="section-header" style="padding:0 0 8px 0">${mode === 'contextual' ? 'Apply To' : 'Rapid-Acting Insulin'}</div>
          <select class="select-field" id="modal-calc-insulin">
            ${RAPID_ACTING_INSULINS.map(ins =>
              `<option value="${ins}" ${ins === selectedInsulin ? 'selected' : ''}>${ins}</option>`
            ).join('')}
          </select>
        </div>
      </div>
      <div style="padding:12px 16px;border-top:1px solid var(--color-border);display:flex;gap:10px">
        <button class="btn btn-outline" id="calc-result-cancel" style="flex:1;font-size:15px;padding:12px">Adjust</button>
        <button class="btn btn-primary" id="calc-result-apply" style="flex:2;font-size:15px;padding:12px">${mode === 'contextual' ? 'Apply' : 'Create Diary'}</button>
      </div>
    </div>
  `;

  document.getElementById('app-frame').appendChild(overlay);

  document.getElementById('calc-result-cancel').addEventListener('click', () => overlay.remove());

  document.getElementById('calc-result-apply').addEventListener('click', () => {
    const insulin = document.getElementById('modal-calc-insulin').value;
    overlay.remove();
    onApply(insulin);
  });
}

// ==========================================
// IOB Logs Panel
// ==========================================

function showIobLogsPanel() {
  const renderPanel = () => {
    const existing = document.getElementById('iob-logs-panel');
    if (existing) existing.remove();

    const mockData = State.getMockData();
    const logs = mockData.recentInsulinLogs || [];
    const sortedLogs = logs.map((log, i) => ({ ...log, _i: i })).sort((a, b) => b.timestamp - a.timestamp);

    const logsHtml = sortedLogs.length > 0
      ? sortedLogs.map((log) => {
          const ago = formatTimeAgo(log.timestamp);
          return `<div class="mock-log-item">
            <span>${log.name} — ${log.dose}U — ${ago}</span>
            <span class="mock-log-remove" data-iob-remove="${log._i}">&times;</span>
          </div>`;
        }).join('')
      : '<div class="mock-log-item" style="color:var(--color-text-secondary)">No recent insulin logs</div>';

    const overlay = document.createElement('div');
    overlay.id = 'iob-logs-panel';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="sim-modal-box">
        <div class="sim-modal-header">
          <span style="font-size:15px;font-weight:600">Insulin Logs (for IOB)</span>
          <span id="iob-panel-close" style="font-size:22px;cursor:pointer;color:var(--color-text-secondary)">&times;</span>
        </div>
        <div class="sim-modal-body">
          <div style="background:#fff8e1;border:1px solid #f5a623;border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:12px;color:#7a6000">
            &#9888;&#65039; For demo purposes only. In the real app, IOB is calculated automatically from the user's logged insulin doses.
          </div>
          <div class="mock-config" style="margin:0">
            <div id="iob-logs-list">${logsHtml}</div>
            <div class="card" style="margin:0;margin-top:8px">
              <div class="input-row" style="padding:10px 12px">
                <span style="font-size:13px;color:var(--color-text)">Insulin</span>
                <div class="input-row-right">
                  <select class="select-field" id="iob-log-insulin" style="width:auto;font-size:13px;padding:6px 28px 6px 8px">
                    ${RAPID_ACTING_INSULINS.map(ins => `<option value="${ins}">${ins}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="input-row" style="padding:10px 12px">
                <span style="font-size:13px;color:var(--color-text)">Dose</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="iob-log-dose" value="4" placeholder="0" style="width:44px;font-size:14px">
                  <span class="input-unit">U</span>
                </div>
              </div>
              <div class="input-row" style="padding:10px 12px">
                <span style="font-size:13px;color:var(--color-text)">Time ago</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="iob-log-mins" value="60" placeholder="0" style="width:44px;font-size:14px">
                  <span class="input-unit">min</span>
                </div>
              </div>
            </div>
            <button class="mock-add-btn" id="iob-add-log" style="font-size:13px;padding:8px">+ Add Log</button>
          </div>
        </div>
        <div style="padding:12px 16px;border-top:1px solid var(--color-border)">
          <button class="btn btn-primary" id="iob-panel-done" style="font-size:15px;padding:12px">Done</button>
        </div>
      </div>
    `;

    document.getElementById('app-frame').appendChild(overlay);

    const updateCalcIob = () => {
      const md = State.getMockData();
      const s = State.getSettings();
      const newIob = BolusCalc.calculateIOB(md.recentInsulinLogs || [], s.insulinActionDuration / 60, new Date());
      const iobInput = document.getElementById('calc-iob');
      if (iobInput) iobInput.value = Math.round(newIob * 100) / 100;
      const iobInfo = document.getElementById('iob-info');
      if (iobInfo) {
        const activeLogs = (md.recentInsulinLogs || []).filter(l => (Date.now() - l.timestamp) < s.insulinActionDuration * 60000);
        iobInfo.textContent = `IOB auto-calculated from ${activeLogs.length} recent dose(s) within the past ${formatDIA(s.insulinActionDuration)}`;
        iobInfo.style.display = newIob > 0 ? '' : 'none';
      }
    };

    const closePanel = () => overlay.remove();
    document.getElementById('iob-panel-close').addEventListener('click', closePanel);
    document.getElementById('iob-panel-done').addEventListener('click', closePanel);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePanel(); });

    overlay.querySelectorAll('[data-iob-remove]').forEach(el => {
      el.addEventListener('click', () => {
        const md = State.getMockData();
        md.recentInsulinLogs.splice(parseInt(el.dataset.iobRemove), 1);
        State.setMockData(md);
        updateCalcIob();
        renderPanel();
      });
    });

    document.getElementById('iob-add-log').addEventListener('click', () => {
      const dose = parseFloat(document.getElementById('iob-log-dose').value) || 0;
      const minsAgo = parseFloat(document.getElementById('iob-log-mins').value) || 0;
      if (dose <= 0) return;
      const md = State.getMockData();
      md.recentInsulinLogs.push({
        name: document.getElementById('iob-log-insulin').value || 'Fiasp',
        dose,
        timestamp: Date.now() - minsAgo * 60 * 1000
      });
      State.setMockData(md);
      updateCalcIob();
      renderPanel();
    });
  };

  renderPanel();
}

// ==========================================
// BG Logs Panel
// ==========================================

function showBgLogsPanel() {
  const BG_WINDOW_MS = 30 * 60 * 1000;

  const updateCalcBG = () => {
    const md = State.getMockData();
    const logs = md.recentBGLogs || [];
    const recent = logs
      .filter(l => Date.now() - l.timestamp <= BG_WINDOW_MS)
      .sort((a, b) => b.timestamp - a.timestamp);
    const bgInput = document.getElementById('calc-bg');
    const bgInfo = document.getElementById('bg-info');
    if (bgInput) bgInput.value = recent.length > 0 ? recent[0].value : '';
    if (bgInfo) {
      if (recent.length > 0) {
        bgInfo.textContent = `BG auto-filled from most recent log (${formatTimeAgo(recent[0].timestamp)})`;
        bgInfo.style.display = '';
      } else {
        bgInfo.style.display = 'none';
      }
    }
  };

  const renderPanel = () => {
    const existing = document.getElementById('bg-logs-panel');
    if (existing) existing.remove();

    const mockData = State.getMockData();
    const logs = mockData.recentBGLogs || [];
    const sortedBGLogs = logs.map((log, i) => ({ ...log, _i: i })).sort((a, b) => b.timestamp - a.timestamp);

    const logsHtml = sortedBGLogs.length > 0
      ? sortedBGLogs.map((log) => {
          const ago = formatTimeAgo(log.timestamp);
          const isRecent = Date.now() - log.timestamp <= BG_WINDOW_MS;
          return `<div class="mock-log-item">
            <span>${log.value} mg/dL — ${ago}${isRecent ? ' ✓' : ''}</span>
            <span class="mock-log-remove" data-bg-remove="${log._i}">&times;</span>
          </div>`;
        }).join('')
      : '<div class="mock-log-item" style="color:var(--color-text-secondary)">No BG logs</div>';

    const overlay = document.createElement('div');
    overlay.id = 'bg-logs-panel';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="sim-modal-box">
        <div class="sim-modal-header">
          <span style="font-size:15px;font-weight:600">Blood Glucose Logs</span>
          <span id="bg-panel-close" style="font-size:22px;cursor:pointer;color:var(--color-text-secondary)">&times;</span>
        </div>
        <div class="sim-modal-body">
          <div style="background:#fff8e1;border:1px solid #f5a623;border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:12px;color:#7a6000">
            &#9888;&#65039; For demo purposes only. In the real app, BG is read automatically from the user's CGM or logged measurements.
          </div>
          <div class="mock-config" style="margin:0">
            <div id="bg-logs-list">${logsHtml}</div>
            <div class="card" style="margin:0;margin-top:8px">
              <div class="input-row" style="padding:10px 12px">
                <span style="font-size:13px;color:var(--color-text)">BG Value</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="bg-log-value" value="120" placeholder="0" style="width:54px;font-size:14px">
                  <span class="input-unit">mg/dL</span>
                </div>
              </div>
              <div class="input-row" style="padding:10px 12px">
                <span style="font-size:13px;color:var(--color-text)">Time ago</span>
                <div class="input-row-right">
                  <input class="input-field" type="text" inputmode="decimal" id="bg-log-mins" value="5" placeholder="0" style="width:44px;font-size:14px">
                  <span class="input-unit">min</span>
                </div>
              </div>
            </div>
            <button class="mock-add-btn" id="bg-add-log" style="font-size:13px;padding:8px">+ Add Log</button>
          </div>
        </div>
        <div style="padding:12px 16px;border-top:1px solid var(--color-border)">
          <button class="btn btn-primary" id="bg-panel-done" style="font-size:15px;padding:12px">Done</button>
        </div>
      </div>
    `;

    document.getElementById('app-frame').appendChild(overlay);

    const closePanel = () => overlay.remove();
    document.getElementById('bg-panel-close').addEventListener('click', closePanel);
    document.getElementById('bg-panel-done').addEventListener('click', closePanel);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closePanel(); });

    overlay.querySelectorAll('[data-bg-remove]').forEach(el => {
      el.addEventListener('click', () => {
        const md = State.getMockData();
        md.recentBGLogs.splice(parseInt(el.dataset.bgRemove), 1);
        State.setMockData(md);
        updateCalcBG();
        renderPanel();
      });
    });

    document.getElementById('bg-add-log').addEventListener('click', () => {
      const value = parseFloat(document.getElementById('bg-log-value').value) || 0;
      const minsAgo = parseFloat(document.getElementById('bg-log-mins').value) || 0;
      if (value <= 0) return;
      const md = State.getMockData();
      if (!md.recentBGLogs) md.recentBGLogs = [];
      md.recentBGLogs.push({ value, timestamp: Date.now() - minsAgo * 60 * 1000 });
      State.setMockData(md);
      updateCalcBG();
      renderPanel();
    });
  };

  renderPanel();
}

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
