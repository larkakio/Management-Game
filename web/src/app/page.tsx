import { SwipeBoard } from "@/components/game/SwipeBoard";
import { CheckInPanel } from "@/components/onchain/CheckInPanel";
import { WalletBar } from "@/components/wallet/WalletBar";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 px-3 py-4">
      <header className="rounded-3xl border border-cyan-300/35 bg-black/30 p-4 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.26em] text-cyan-300">Neon Grid Command</p>
        <h1 className="mt-2 text-2xl font-bold text-cyan-100">Cyberpunk Management Ops</h1>
        <p className="mt-2 text-sm text-fuchsia-100/80">
          Control districts by swiping the field. Win objectives to unlock the next level.
        </p>
      </header>
      <WalletBar />
      <CheckInPanel />
      <SwipeBoard />
      <footer className="pb-4 text-center text-xs text-cyan-100/70">
        Built for Base App standard web requirements with Builder Code attribution.
      </footer>
    </main>
  );
}
