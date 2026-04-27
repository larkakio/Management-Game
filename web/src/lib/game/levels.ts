export type LevelTargets = {
  energy: number;
  credits: number;
  reputation: number;
};

export type LevelDefinition = {
  id: number;
  name: string;
  maxTicks: number;
  startingEnergy: number;
  startingCredits: number;
  startingReputation: number;
  swipePower: number;
  baseDrain: number;
  targets: LevelTargets;
};

export const levels: LevelDefinition[] = [
  {
    id: 1,
    name: "Neon District Bootcamp",
    maxTicks: 10,
    startingEnergy: 36,
    startingCredits: 18,
    startingReputation: 8,
    swipePower: 5,
    baseDrain: 2,
    targets: { energy: 30, credits: 52, reputation: 30 },
  },
  {
    id: 2,
    name: "Signal Smuggler Rush",
    maxTicks: 11,
    startingEnergy: 30,
    startingCredits: 24,
    startingReputation: 10,
    swipePower: 6,
    baseDrain: 3,
    targets: { energy: 24, credits: 66, reputation: 45 },
  },
  {
    id: 3,
    name: "Hyperloop Governance",
    maxTicks: 12,
    startingEnergy: 28,
    startingCredits: 20,
    startingReputation: 14,
    swipePower: 7,
    baseDrain: 4,
    targets: { energy: 20, credits: 78, reputation: 60 },
  },
];

export function getLevel(levelId: number): LevelDefinition {
  return levels.find((level) => level.id === levelId) ?? levels[0];
}
