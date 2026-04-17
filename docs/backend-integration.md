# Backend Integration Notes

## What you need from the backend repo
- A running Django + DRF server reachable from your device/simulator
- CORS configured for Expo (for web builds) and token auth enabled
- Endpoints matching `docs/api-contract.md`

## Mobile client configuration
- Set `mobile/.env`:
  - `EXPO_PUBLIC_API_BASE_URL=http://<host>:8000`

Notes:
- For iOS simulator + local backend, `http://localhost:8000` usually works.
- For a physical device, use your machine’s LAN IP (example: `http://192.168.1.12:8000`).

## Auth header
The client sends `Authorization: Token <token>` by default.
If your backend uses JWT, update `mobile/src/services/api.ts` (`setAuthToken()`).

