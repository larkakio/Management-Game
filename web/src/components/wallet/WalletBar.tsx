"use client";

import { useMemo } from "react";
import { base } from "wagmi/chains";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";

export function WalletBar() {
  const { address, chainId, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const wrongNetwork = isConnected && chainId !== base.id;

  const formattedAddress = useMemo(() => {
    if (!address) return "Not connected";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <section className="rounded-2xl border border-fuchsia-400/30 bg-black/35 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300">Wallet</p>
          <p className="mt-1 text-sm text-fuchsia-100">{formattedAddress}</p>
        </div>
        {isConnected ? (
          <button
            type="button"
            onClick={() => disconnect()}
            className="rounded-full border border-fuchsia-400/40 px-3 py-1 text-xs text-fuchsia-100 hover:bg-fuchsia-400/15"
          >
            Disconnect
          </button>
        ) : null}
      </div>

      {!isConnected ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              disabled={isConnectPending}
              onClick={() =>
                connect({
                  connector,
                  chainId: base.id,
                })
              }
              className="rounded-full border border-cyan-400/50 px-3 py-1 text-xs text-cyan-100 hover:bg-cyan-400/15 disabled:opacity-50"
            >
              Connect {connector.name}
            </button>
          ))}
        </div>
      ) : null}

      {wrongNetwork ? (
        <div className="mt-3 rounded-xl border border-amber-300/60 bg-amber-300/10 p-3">
          <p className="text-xs text-amber-100">Wrong network. Switch to Base Mainnet to run onchain check-in.</p>
          <button
            type="button"
            onClick={() => switchChain({ chainId: base.id })}
            disabled={isSwitching}
            className="mt-2 rounded-full border border-amber-200/70 px-3 py-1 text-xs text-amber-100 hover:bg-amber-300/20 disabled:opacity-50"
          >
            {isSwitching ? "Switching..." : "Switch to Base"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
