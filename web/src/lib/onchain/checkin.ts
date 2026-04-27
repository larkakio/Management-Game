import { Attribution } from "ox/erc8021";

export const CHECK_IN_ABI = [
  {
    type: "function",
    name: "checkIn",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "event",
    name: "CheckedIn",
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "dayId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    anonymous: false,
  },
] as const;

export function getBuilderDataSuffix() {
  const manualSuffix = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX;
  if (manualSuffix?.startsWith("0x")) return manualSuffix as `0x${string}`;

  const builderCode = process.env.NEXT_PUBLIC_BUILDER_CODE;
  if (!builderCode) return undefined;

  return Attribution.toDataSuffix({ codes: [builderCode] });
}

export function getCheckInAddress() {
  return (process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`;
}
