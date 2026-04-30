# Neon Grid Command (Base App)

Mobile-first cyberpunk management game built as a standard Base App web app.

## Features

- Swipe-based gameplay on a hologrid board.
- Deterministic level goals with level unlock progression.
- Wallet connect and forced Base mainnet switch before check-in.
- Onchain daily check-in flow with Builder Code attribution (ERC-8021).
- Base App verification meta tag in root layout.
- Custom neon app icon and thumbnail in `public/`.

## Requirements

- Node.js 20+
- npm
- Foundry (for smart contract tests/deploy)

## Setup

1. Copy env template:
   - `cp .env.example .env.local`
2. Fill required vars in `.env.local`:
   - `NEXT_PUBLIC_BASE_APP_ID`
   - `NEXT_PUBLIC_BUILDER_CODE` (`bc_...`)
   - `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS`
3. Install deps:
   - `npm install`
4. Run dev server:
   - `npm run dev`

## Base App Compliance

- Root layout includes explicit `<meta name="base:app_id" ...>` for verification.
- Farcaster SDK methods are not used.
- Builder code suffix is generated via `Attribution.toDataSuffix(...)` from `ox/erc8021`.
- Optional override via `NEXT_PUBLIC_BUILDER_CODE_SUFFIX`.

## Build and Verify

- Lint: `npm run lint`
- Build: `npm run build`

## Deployment Notes

- Deploy `web/` as Vercel root directory.
- Add all `NEXT_PUBLIC_*` env vars to Vercel Project Settings.
- After re-deploying contract, update `NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS`.

## Base dashboard: “web resource must have metadata”

If domain registration on `dashboard.base.org` fails with that message:

- In the **App Domain** field use the **hostname only**, for example `management-game-blush.vercel.app`. Do **not** include `https://` or a trailing `/`.
- Confirm the live HTML contains `<meta name="base:app_id" content="YOUR_APP_ID" />` via **View Page Source** on the production URL (not only the Elements tab after client hydration).
- In Vercel → **Settings → Deployment Protection**, ensure **Vercel Authentication** is **off** for production. If it is on, automated checks may not see your real homepage meta tag.
- Trigger a fresh production deploy, wait until it is **Ready**, then click **Register** again in the Base dashboard.

Standard web app migration context: [Migrate to a Standard Web App](https://docs.base.org/apps/quickstart/migrate-to-standard-web-app).
