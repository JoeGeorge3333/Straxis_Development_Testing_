import type { FeedItem, HabitLogItem, HabitTaskKey, LeaderboardRow, League, Profile, Workout } from "@/types/api";

type DemoState = {
  me: Profile;
  token: string;
  leagues: League[];
  workouts: Workout[];
  habitsByDate: Record<string, Record<string, boolean>>;
  pointsByUserId: Record<number, number>;
  feed: FeedItem[];
};

const TASK_POINTS: Record<HabitTaskKey, number> = {
  workout_completed: 10,
  workout_outdoor: 5,
  diet_compliance: 10,
  water_gallon: 5,
  reading_done: 5,
  progress_photo: 5,
};

let nextWorkoutId = 100;
let nextFeedId = 1000;

const initialLeague: League = {
  id: 1,
  name: "Demo League",
  invite_code: "DEMO2026",
  status: "active",
  start_date: "2026-04-01",
  end_date: "2026-06-14",
};

const opponent: Profile = { id: 2, username: "Opponent", avatar_url: null };

const state: DemoState = {
  me: { id: 1, username: "You", avatar_url: null },
  token: "demo-token",
  leagues: [initialLeague],
  workouts: [
    {
      id: 1,
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      duration_mins: 45,
      is_outdoor: true,
      notes: "Morning run",
    },
  ],
  habitsByDate: {},
  pointsByUserId: { 1: 215, 2: 300 },
  feed: [
    {
      id: 1,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      type: "habit_completed",
      actor: opponent,
      message: "Locked in water gallon (+5).",
    },
  ],
};

function delay(ms = 350) {
  return new Promise((r) => setTimeout(r, ms));
}

function addFeed(actor: Profile, type: string, message: string) {
  state.feed = [
    {
      id: nextFeedId++,
      created_at: new Date().toISOString(),
      type,
      actor,
      message,
    },
    ...state.feed,
  ];
}

function ensureDay(date: string) {
  if (!state.habitsByDate[date]) state.habitsByDate[date] = {};
  return state.habitsByDate[date];
}

export async function demoRegister(payload: { username: string; email: string; password: string }) {
  await delay();
  state.me = { id: 1, username: payload.username || "You", avatar_url: null };
  addFeed(state.me, "league_joined", "Created an account.");
  return { token: state.token };
}

export async function demoLogin(payload: { email: string; password: string }) {
  await delay();
  addFeed(state.me, "league_joined", "Signed in.");
  return { token: state.token };
}

export async function demoMe() {
  await delay(200);
  return state.me;
}

export async function demoListLeagues() {
  await delay(220);
  return state.leagues;
}

export async function demoJoinLeague(invite_code: string) {
  await delay();
  const normalized = invite_code.trim().toUpperCase();
  let league = state.leagues.find((l) => l.invite_code === normalized);
  if (!league) {
    league = { ...initialLeague, id: 2, invite_code: normalized, name: "Joined League" };
    state.leagues = [league, ...state.leagues];
  }
  addFeed(state.me, "league_joined", `Joined league "${league.name}".`);
  return league;
}

export async function demoListWorkouts() {
  await delay(260);
  return state.workouts;
}

export async function demoCreateWorkout(payload: {
  duration_mins: number;
  is_outdoor: boolean;
  notes?: string;
  started_at?: string;
}) {
  await delay();
  const created: Workout = {
    id: nextWorkoutId++,
    started_at: payload.started_at ?? new Date().toISOString(),
    duration_mins: payload.duration_mins,
    is_outdoor: payload.is_outdoor,
    notes: payload.notes ?? "",
  };
  state.workouts = [created, ...state.workouts];

  // Score impact (simple demo): 10 points for workout + 5 for outdoor
  let delta = TASK_POINTS.workout_completed;
  if (created.is_outdoor) delta += TASK_POINTS.workout_outdoor;
  state.pointsByUserId[state.me.id] = (state.pointsByUserId[state.me.id] ?? 0) + delta;
  addFeed(state.me, "workout_logged", `Logged a workout (+${delta}).`);

  return created;
}

export async function demoGetHabits(forDate: string) {
  await delay(200);
  const day = ensureDay(forDate);
  const keys: HabitTaskKey[] = ["diet_compliance", "water_gallon", "reading_done", "progress_photo"];
  return keys.map((k) => ({ task_key: k, completed: !!day[k], log_date: forDate })) as HabitLogItem[];
}

export async function demoPostHabit(payload: { task_key: string; log_date: string; completed: boolean }) {
  await delay(200);
  const task_key = payload.task_key as HabitTaskKey;
  const day = ensureDay(payload.log_date);
  const prev = !!day[task_key];
  day[task_key] = payload.completed;

  const pts = TASK_POINTS[task_key] ?? 0;
  const delta = payload.completed === prev ? 0 : payload.completed ? pts : -pts;
  state.pointsByUserId[state.me.id] = (state.pointsByUserId[state.me.id] ?? 0) + delta;
  if (delta !== 0) addFeed(state.me, "habit_completed", `Updated ${task_key.replace(/_/g, " ")} (${delta > 0 ? "+" : ""}${delta}).`);

  return { task_key, completed: payload.completed, log_date: payload.log_date } as HabitLogItem;
}

export async function demoLeaderboard(_leagueId: number) {
  await delay(250);
  const mePoints = state.pointsByUserId[state.me.id] ?? 0;
  const oppPoints = state.pointsByUserId[opponent.id] ?? 0;

  const rows = [
    { profile: state.me, total_points: mePoints },
    { profile: opponent, total_points: oppPoints },
  ]
    .sort((a, b) => b.total_points - a.total_points)
    .map((row, idx) => ({ rank: idx + 1, profile: row.profile, total_points: row.total_points })) as LeaderboardRow[];

  return rows;
}

export async function demoFeed(_leagueId: number) {
  await delay(220);
  return state.feed;
}

