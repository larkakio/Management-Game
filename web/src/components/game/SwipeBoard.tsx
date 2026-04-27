"use client";

import { useMemo, useRef, useState } from "react";
import { applySwipe, createInitialState, GameState, SwipeDirection } from "@/lib/game/engine";
import { levels } from "@/lib/game/levels";
import { markLevelComplete, readProgression } from "@/lib/game/progression";

const SWIPE_THRESHOLD = 30;

function nextDirection(dx: number, dy: number): SwipeDirection | null {
  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return null;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
  return dy > 0 ? "down" : "up";
}

export function SwipeBoard() {
  const [progression, setProgression] = useState(readProgression);
  const [state, setState] = useState<GameState>(() => createInitialState(progression.unlockedLevel));
  const [feedback, setFeedback] = useState<string>("Swipe inside the hologrid to start.");
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const currentLevel = useMemo(
    () => levels.find((level) => level.id === state.levelId) ?? levels[0],
    [state.levelId],
  );

  function handleRestart(levelId = state.levelId) {
    setState(createInitialState(levelId));
    setFeedback(`Level ${levelId} reloaded. Re-route the city.`);
  }

  function handleLevelPick(levelId: number) {
    if (levelId > progression.unlockedLevel) return;
    handleRestart(levelId);
  }

  function handleSwipe(direction: SwipeDirection) {
    setState((previous) => {
      const next = applySwipe(previous, direction);
      setFeedback(next.lastAction);

      if (next.status === "won") {
        const updated = markLevelComplete(next.levelId, levels.length);
        setProgression(updated);
        setFeedback(`Level ${next.levelId} complete. Level ${updated.unlockedLevel} unlocked.`);
      }
      return next;
    });
  }

  const boardCells = useMemo(() => {
    const cells: { col: number; row: number; kind: "hub" | "market" | "risk" | "empty" }[] = [];
    for (let row = 0; row < state.gridRows; row += 1) {
      for (let col = 0; col < state.gridCols; col += 1) {
        const noise = (row * 13 + col * 17 + state.levelId * 5) % 10;
        const kind = noise === 0 ? "hub" : noise === 3 || noise === 7 ? "market" : noise === 9 ? "risk" : "empty";
        cells.push({ col, row, kind });
      }
    }
    return cells;
  }, [state.gridCols, state.gridRows, state.levelId]);

  return (
    <section className="w-full rounded-3xl border border-cyan-400/30 bg-black/35 p-4 shadow-[0_0_30px_rgba(34,211,238,0.25)] backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-cyan-200">{currentLevel.name}</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">Tick {state.ticksLeft}</span>
      </div>

      <div
        className="relative aspect-[5/7] w-full touch-none overflow-hidden rounded-2xl border border-fuchsia-400/30 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.25),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(217,70,239,0.2),transparent_45%),linear-gradient(160deg,#020617_0%,#09090b_45%,#0f172a_100%)]"
        onPointerDown={(event) => {
          startRef.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          if (!startRef.current) return;
          const dx = event.clientX - startRef.current.x;
          const dy = event.clientY - startRef.current.y;
          const direction = nextDirection(dx, dy);
          if (direction) handleSwipe(direction);
          startRef.current = null;
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.12)_1px,transparent_1px)] bg-[size:20%_14.28%]" />
        <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle,transparent_40%,rgba(217,70,239,0.1)_90%)]" />
        <div className="absolute inset-2 grid grid-cols-5 grid-rows-7 gap-1">
          {boardCells.map((cell) => {
            const isCursor = state.cursorCol === cell.col && state.cursorRow === cell.row;
            const kindClass =
              cell.kind === "hub"
                ? "border-cyan-300/60 bg-cyan-300/20"
                : cell.kind === "market"
                  ? "border-fuchsia-300/60 bg-fuchsia-300/20"
                  : cell.kind === "risk"
                    ? "border-rose-300/60 bg-rose-300/20"
                    : "border-white/10 bg-black/10";
            return (
              <div key={`${cell.col}-${cell.row}`} className={`relative rounded-md border ${kindClass}`}>
                {isCursor ? (
                  <div className="absolute inset-1 rounded-[4px] border border-cyan-200 bg-cyan-300/35 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
                ) : null}
                {cell.kind !== "empty" ? (
                  <span className="absolute left-1 top-1 text-[9px] uppercase tracking-wide text-white/85">
                    {cell.kind}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-cyan-300/40 bg-black/45 p-3 text-center text-sm text-cyan-100">
          {feedback}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <Stat label="Energy" value={`${state.energy}/${currentLevel.targets.energy}`} />
        <Stat label="Credits" value={`${state.credits}/${currentLevel.targets.credits}`} />
        <Stat label="Rep" value={`${state.reputation}/${currentLevel.targets.reputation}`} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {levels.map((level) => {
          const isLocked = level.id > progression.unlockedLevel;
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => handleLevelPick(level.id)}
              disabled={isLocked}
              className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs text-cyan-100 enabled:hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-35"
            >
              L{level.id}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => handleRestart()}
          className="rounded-full border border-fuchsia-400/40 px-3 py-1 text-xs text-fuchsia-100 hover:bg-fuchsia-400/15"
        >
          Retry
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-950/60 p-2 text-center">
      <p className="text-[10px] uppercase tracking-[0.16em] text-cyan-400/80">{label}</p>
      <p className="mt-1 font-semibold text-cyan-100">{value}</p>
    </div>
  );
}
