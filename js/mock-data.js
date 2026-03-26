// Mock data for simulating app context

const RAPID_ACTING_INSULINS = [
  'Fiasp',
  'NovoRapid',
  'Humalog',
  'Apidra',
  'Lyumjev'
];

const ROUTINE_TIMES = {
  wakeUp: 7,      // 07:00
  breakfast: 8,    // 08:00
  lunch: 12,       // 12:00
  dinner: 18,      // 18:00
  bedTime: 22      // 22:00
};

const PERIOD_LABELS = {
  wakeUp: 'Wake Up',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  bedTime: 'Bed Time'
};

const DEFAULT_MOCK_INSULIN_LOGS = [
  { name: 'Fiasp', dose: 4, timestamp: Date.now() - 2 * 60 * 60 * 1000 },
  { name: 'Fiasp', dose: 3, timestamp: Date.now() - 45 * 60 * 1000 }
];

const DEFAULT_MOCK_DIARY = {
  bg: 180,
  carbs: 45,
  period: 'lunch',
  medication: 'Fiasp',
  time: new Date()
};
