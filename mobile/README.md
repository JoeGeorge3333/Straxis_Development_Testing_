# Mobile App (Expo)

This folder contains the MVP mobile client, built with Expo + Expo Router.

## Setup
1. Install dependencies
   - `cd mobile`
   - `npm install`
2. Configure backend URL
   - Copy `.env.example` → `.env`
   - Set `EXPO_PUBLIC_API_BASE_URL` (example: `http://localhost:8000`)
   - Optional: set `EXPO_PUBLIC_DEMO_MODE=1` to force Demo Mode
3. Run
   - `npx expo start`

## Demo Mode
- Demo Mode uses an in-app mock backend so you can click through the MVP without running your server.
- Toggle it at runtime in the app: Profile → Demo Mode.

## Backend
See `../docs/api-contract.md` for expected endpoints.
