import { getLevel, LevelDefinition } from "@/lib/game/levels";

export type SwipeDirection = "up" | "down" | "left" | "right";

export type GameStatus = "playing" | "won" | "lost";

export type GameState = {
  levelId: number;
  ticksLeft: number;
  energy: number;
  credits: number;
  reputation: number;
  gridCols: number;
  gridRows: number;
  cursorCol: number;
  cursorRow: number;
  combo: number;
  status: GameStatus;
  lastAction: string;
};

const directionStats: Record<SwipeDirection, { credits: number; reputation: number; energy: number }> = {
  up: { credits: 2, reputation: 4, energy: -2 },
  down: { credits: 5, reputation: -1, energy: -4 },
  left: { credits: 3, reputation: 2, energy: -3 },
  right: { credits: 4, reputation: 1, energy: -3 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function createInitialState(levelId: number): GameState {
  const level = getLevel(levelId);
  const gridCols = 5;
  const gridRows = 7;
  return {
    levelId: level.id,
    ticksLeft: level.maxTicks,
    energy: level.startingEnergy,
    credits: level.startingCredits,
    reputation: level.startingReputation,
    gridCols,
    gridRows,
    cursorCol: Math.floor(gridCols / 2),
    cursorRow: Math.floor(gridRows / 2),
    combo: 0,
    status: "playing",
    lastAction: "Swipe to route your first district.",
  };
}

function evaluateStatus(state: GameState, level: LevelDefinition): GameStatus {
  if (
    state.energy >= level.targets.energy &&
    state.credits >= level.targets.credits &&
    state.reputation >= level.targets.reputation
  ) {
    return "won";
  }

  if (state.ticksLeft <= 0 || state.energy <= 0) {
    return "lost";
  }

  return "playing";
}

export function applySwipe(state: GameState, direction: SwipeDirection): GameState {
  if (state.status !== "playing") return state;

  const level = getLevel(state.levelId);
  const profile = directionStats[direction];
  const newCombo = direction === "up" || direction === "right" ? state.combo + 1 : 0;
  const comboBoost = Math.floor(newCombo / 2);

  const energyShift = profile.energy - level.baseDrain + comboBoost;
  const creditsShift = profile.credits + level.swipePower + comboBoost;
  const reputationShift = profile.reputation + Math.floor(level.swipePower / 2);
  const colDelta = direction === "right" ? 1 : direction === "left" ? -1 : 0;
  const rowDelta = direction === "down" ? 1 : direction === "up" ? -1 : 0;
  const nextCol = clamp(state.cursorCol + colDelta, 0, state.gridCols - 1);
  const nextRow = clamp(state.cursorRow + rowDelta, 0, state.gridRows - 1);

  const nextState: GameState = {
    ...state,
    ticksLeft: state.ticksLeft - 1,
    energy: clamp(state.energy + energyShift, 0, 120),
    credits: clamp(state.credits + creditsShift, 0, 160),
    reputation: clamp(state.reputation + reputationShift, 0, 140),
    cursorCol: nextCol,
    cursorRow: nextRow,
    combo: newCombo,
    lastAction: `${direction.toUpperCase()} channel routed (+${creditsShift}c / +${reputationShift}r / ${energyShift}e)`,
  };

  return {
    ...nextState,
    status: evaluateStatus(nextState, level),
  };
}
