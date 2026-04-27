const STORAGE_KEY = "neon-grid-command-progression-v1";

export type ProgressionState = {
  unlockedLevel: number;
  completedLevels: number[];
};

const defaultProgression: ProgressionState = {
  unlockedLevel: 1,
  completedLevels: [],
};

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readProgression(): ProgressionState {
  if (!canUseStorage()) return defaultProgression;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProgression;

  try {
    const parsed = JSON.parse(raw) as ProgressionState;
    return {
      unlockedLevel: Math.max(1, parsed.unlockedLevel || 1),
      completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
    };
  } catch {
    return defaultProgression;
  }
}

export function writeProgression(state: ProgressionState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function markLevelComplete(levelId: number, maxLevelId: number): ProgressionState {
  const current = readProgression();
  const completed = Array.from(new Set([...current.completedLevels, levelId])).sort((a, b) => a - b);
  const unlockedLevel = Math.min(Math.max(current.unlockedLevel, levelId + 1), maxLevelId);
  const updated = { unlockedLevel, completedLevels: completed };
  writeProgression(updated);
  return updated;
}
