/**
 * Standard painting task types with their default execution order
 */
export const TASK_TYPES = [
  { id: 'masking', label: 'Masking', defaultOrder: 1 },
  { id: 'wall-fill', label: 'Wall Fill', defaultOrder: 2 },
  { id: 'wall-sand', label: 'Wall Sand', defaultOrder: 3 },
  { id: 'pole-sand', label: 'Pole Sand', defaultOrder: 4 },
  { id: 'cut', label: 'Cut', defaultOrder: 5 },
  { id: 'roll', label: 'Roll', defaultOrder: 6 },
  { id: 'trim-fill', label: 'Trim Fill', defaultOrder: 7 },
  { id: 'trim-sand', label: 'Trim Sand', defaultOrder: 8 },
  { id: 'trim', label: 'Trim', defaultOrder: 9 },
  { id: 'touch-up', label: 'Touch-up', defaultOrder: 10 },
  { id: 'dust', label: 'Dust', defaultOrder: 11 },
] as const;

/**
 * Common task presets for different area types
 */
export const TASK_PRESETS = {
  MINIMAL: ['cut', 'roll', 'trim', 'touch-up'], // Original default
  STANDARD: ['masking', 'cut', 'roll', 'trim', 'touch-up', 'dust'],
  FULL: ['masking', 'wall-fill', 'wall-sand', 'pole-sand', 'cut', 'roll', 'trim-fill', 'trim-sand', 'trim', 'touch-up', 'dust'],
  TOUCH_UP_ONLY: ['touch-up', 'dust'],
} as const;

export type TaskTypeId = typeof TASK_TYPES[number]['id'];
export type TaskPresetName = keyof typeof TASK_PRESETS;
