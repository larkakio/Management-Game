"use client";

import { useMemo, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import { CHECK_IN_ABI, getBuilderDataSuffix, getCheckInAddress } from "@/lib/onchain/checkin";

export function CheckInPanel() {
  const [status, setStatus] = useState("No onchain check-in today.");
  const { isConnected, chainId } = useAccount();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  const isWrongNetwork = isConnected && chainId !== base.id;
  const contractAddress = getCheckInAddress();
  const dataSuffix = useMemo(() => getBuilderDataSuffix(), []);

  async function handleCheckIn() {
    if (!isConnected) {
      setStatus("Connect a wallet first.");
      return;
    }
    try {
      const targetChainId = base.id;
      if (chainId !== targetChainId) {
        await switchChainAsync({ chainId: targetChainId });
      }

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: CHECK_IN_ABI,
        functionName: "checkIn",
        chainId: targetChainId,
        dataSuffix,
      });
      setStatus(`Check-in sent: ${hash.slice(0, 10)}...`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Transaction failed.";
      setStatus(message);
    }
  }

  return (
    <section className="rounded-2xl border border-cyan-400/30 bg-black/35 p-4 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-cyan-100">Daily Base Check-In</h3>
          <p className="mt-1 text-xs text-cyan-200/85">No fee required. Only Base L2 gas applies.</p>
        </div>
        <button
          type="button"
          onClick={handleCheckIn}
          disabled={!isConnected || isWriting || isSwitching}
          className="rounded-full border border-cyan-300/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 hover:bg-cyan-400/15 disabled:opacity-45"
        >
          {isSwitching ? "Switching..." : isWriting ? "Sending..." : "Check In"}
        </button>
      </div>
      {isWrongNetwork ? (
        <p className="mt-3 text-xs text-amber-200">Wallet is not on Base. We will switch automatically before signing.</p>
      ) : null}
      <p className="mt-3 text-xs text-fuchsia-100/85">{status}</p>
    </section>
  );
}
