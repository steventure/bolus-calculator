// Mock data for simulating app context

const RAPID_ACTING_INSULINS = [
  'Fiasp',
  'NovoRapid',
  'Humalog',
  'Apidra',
  'Lyumjev'
];

const DEFAULT_ROUTINE_TIMES = {
  wakeUp: 7,       // 07:00
  breakfast: 8,    // 08:00
  lunch: 13,       // 13:00
  dinner: 19,      // 19:00
  bedTime: 23      // 23:00
};

const PERIOD_LABELS = {
  earlyMorning: 'Early Morning',
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  overnight: 'Overnight'
};

const DEFAULT_MOCK_INSULIN_LOGS = [
  { name: 'Fiasp', dose: 4, timestamp: Date.now() - 2 * 60 * 60 * 1000 },
  { name: 'Fiasp', dose: 3, timestamp: Date.now() - 45 * 60 * 1000 }
];

const DEFAULT_MOCK_DIARY = {
  bg: 180,
  carbs: 45,
  period: 'afternoon',
  medication: 'Fiasp',
  time: new Date()
};
