// Pure calculation functions for bolus dose

const BolusCalc = {
  /**
   * Get the current time block based on routine times.
   * Blocks: earlyMorning, morning, afternoon, evening, overnight
   *
   * | Block         | Start          | End                                    |
   * |---------------|----------------|----------------------------------------|
   * | Early Morning | Wakeup         | Breakfast                              |
   * | Morning       | Breakfast      | max(Breakfast, Lunch − 1h)             |
   * | Afternoon     | Lunch − 1h     | max(Lunch, Dinner − 1h)                |
   * | Evening       | Dinner − 1h    | max(Dinner, Bedtime − 1h)              |
   * | Overnight     | Bedtime − 1h   | Wakeup                                 |
   */
  resolvePeriod(now, routineTimes) {
    if (!now) now = new Date();
    const rt = routineTimes || State.getRoutineTimes();
    const hour = now.getHours() + now.getMinutes() / 60;

    const overnightStart = rt.bedTime - 1;
    const eveningStart = rt.dinner - 1;
    const afternoonStart = rt.lunch - 1;
    const morningStart = rt.breakfast;
    const earlyMorningStart = rt.wakeUp;

    // Overnight wraps around midnight
    if (hour >= overnightStart || hour < earlyMorningStart) return 'overnight';
    if (hour >= eveningStart) return 'evening';
    if (hour >= afternoonStart) return 'afternoon';
    if (hour >= morningStart) return 'morning';
    return 'earlyMorning';
  },

  /**
   * Compute the start and end times for each time block.
   */
  getTimeBlocks(routineTimes) {
    const rt = routineTimes || State.getRoutineTimes();
    return {
      earlyMorning: { start: rt.wakeUp, end: rt.breakfast },
      morning:      { start: rt.breakfast, end: Math.max(rt.breakfast, rt.lunch - 1) },
      afternoon:    { start: rt.lunch - 1, end: Math.max(rt.lunch, rt.dinner - 1) },
      evening:      { start: rt.dinner - 1, end: Math.max(rt.dinner, rt.bedTime - 1) },
      overnight:    { start: rt.bedTime - 1, end: rt.wakeUp }
    };
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
