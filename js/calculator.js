// Pure calculation functions for bolus dose

const BolusCalc = {
  /**
   * Get the current time period based on routine times.
   * Periods: wakeUp, breakfast, lunch, dinner, bedTime
   * Each period starts at the midpoint between its time and the previous period's time.
   */
  resolvePeriod(now) {
    if (!now) now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;

    // Midpoints between periods
    const boundaries = [
      { period: 'wakeUp',    start: (ROUTINE_TIMES.bedTime - 24 + ROUTINE_TIMES.wakeUp) / 2 },
      { period: 'breakfast', start: (ROUTINE_TIMES.wakeUp + ROUTINE_TIMES.breakfast) / 2 },
      { period: 'lunch',     start: (ROUTINE_TIMES.breakfast + ROUTINE_TIMES.lunch) / 2 },
      { period: 'dinner',    start: (ROUTINE_TIMES.lunch + ROUTINE_TIMES.dinner) / 2 },
      { period: 'bedTime',   start: (ROUTINE_TIMES.dinner + ROUTINE_TIMES.bedTime) / 2 }
    ];

    // Find the applicable period (go backwards)
    for (let i = boundaries.length - 1; i >= 0; i--) {
      if (hour >= boundaries[i].start) {
        return boundaries[i].period;
      }
    }
    // Before wakeUp midpoint = bedTime (wraps around midnight)
    return 'bedTime';
  },

  /**
   * Get the effective ICR for a given period.
   */
  getEffectiveICR(settings, period) {
    if (settings.icrMode === 'single') {
      return settings.icrSingle;
    }
    return settings.icrPerPeriod[period];
  },

  /**
   * Get the effective ISF for a given period.
   */
  getEffectiveISF(settings, period) {
    if (settings.isfMode === 'single') {
      return settings.isfSingle;
    }
    return settings.isfPerPeriod[period];
  },

  /**
   * Calculate IOB from recent insulin logs.
   * Uses linear decay: IOB = dose * (1 - timeSinceDose / actionDuration)
   */
  calculateIOB(recentLogs, insulinActionDurationHours, now) {
    if (!now) now = new Date();
    const actionDurationMs = insulinActionDurationHours * 60 * 60 * 1000;
    let totalIOB = 0;

    for (const log of recentLogs) {
      const timeSinceMs = now.getTime() - log.timestamp;
      if (timeSinceMs < 0 || timeSinceMs >= actionDurationMs) continue;

      const fraction = 1 - (timeSinceMs / actionDurationMs);
      totalIOB += log.dose * fraction;
    }

    return Math.max(0, totalIOB);
  },

  /**
   * Round dose based on preference.
   */
  roundDose(value, preference) {
    if (preference === 'half') {
      return Math.round(value * 2) / 2;
    }
    return Math.round(value);
  },

  /**
   * Main bolus calculation.
   * Returns: { recommended, carbDose, correctionDose, iob, warning, capped, raw }
   */
  calculate({ currentBG, carbs, targetBG, icr, isf, iob, roundingPreference }) {
    // Carb dose
    const carbDose = (carbs && icr) ? carbs / icr : 0;

    // Correction dose
    let correctionDose = 0;
    if (currentBG != null && targetBG != null && isf != null && currentBG > targetBG) {
      correctionDose = (currentBG - targetBG) / isf;
    }

    // Raw recommended
    let raw = carbDose + correctionDose - (iob || 0);

    // Floor at 0
    if (raw < 0) raw = 0;

    // Round
    let recommended = this.roundDose(raw, roundingPreference);

    // Cap and warning
    let warning = false;
    let capped = false;

    if (recommended >= 25) {
      warning = true;
    }
    if (recommended > 50) {
      recommended = 50;
      capped = true;
    }

    return {
      recommended,
      carbDose: Math.round(carbDose * 100) / 100,
      correctionDose: Math.round(correctionDose * 100) / 100,
      iob: Math.round((iob || 0) * 100) / 100,
      warning,
      capped,
      raw: Math.round(raw * 100) / 100
    };
  }
};
