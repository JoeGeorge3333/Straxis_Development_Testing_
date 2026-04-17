# Backend API Contract (MVP)

This repo’s mobile client assumes a Django + DRF backend with token auth and the endpoints below.

## Environment
- Base URL is configured by `EXPO_PUBLIC_API_BASE_URL` (example: `http://localhost:8000`)
- Auth header: `Authorization: Token <token>` (or JWT if you change the backend; update the client accordingly)

## Endpoints (from spec)

### Authentication
- `POST /api/auth/register/` → create account, returns token
- `POST /api/auth/login/` → login, returns token
- `GET /api/users/me/` → current user profile

### Tracking
- `GET /api/workouts/` → list workouts
- `POST /api/workouts/` → log workout (triggers scoring)
- `GET /api/habits/?date=YYYY-MM-DD` → habits for date
- `POST /api/habits/` → log habit (triggers scoring)

### Leagues
- `GET /api/leagues/` → list leagues for user
- `POST /api/leagues/` → create league
- `POST /api/leagues/join/` → join by invite code
- `GET /api/leagues/{id}/` → league detail
- `GET /api/leagues/{id}/leaderboard/` → standings ordered by total points
- `GET /api/leagues/{id}/feed/` → activity stream (auto-generated)

## Client-side type expectations (minimal)

### Profile
```json
{
  "id": "number",
  "username": "string",
  "avatar_url": "string|null"
}
```

### Workout
```json
{
  "id": "number",
  "started_at": "ISO-8601 string",
  "duration_mins": "number",
  "is_outdoor": "boolean",
  "notes": "string"
}
```

### Habit log item (for a date)
```json
{
  "task_key": "diet_compliance|water_gallon|reading_done|progress_photo|workout_completed|workout_outdoor",
  "completed": "boolean",
  "log_date": "YYYY-MM-DD"
}
```

### League summary
```json
{
  "id": "number",
  "name": "string",
  "invite_code": "string",
  "status": "draft|active|completed",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD"
}
```

### Leaderboard row
```json
{
  "rank": "number",
  "profile": { "id": "number", "username": "string", "avatar_url": "string|null" },
  "total_points": "number"
}
```

### Feed item
```json
{
  "id": "number",
  "created_at": "ISO-8601 string",
  "type": "workout_logged|habit_completed|league_joined",
  "actor": { "id": "number", "username": "string", "avatar_url": "string|null" },
  "message": "string"
}
```

