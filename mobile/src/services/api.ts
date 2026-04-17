import axios from "axios";

import { getApiBaseUrl, isDemoMode } from "@/config/runtime";
import {
  demoCreateWorkout,
  demoFeed,
  demoGetHabits,
  demoJoinLeague,
  demoLeaderboard,
  demoListLeagues,
  demoListWorkouts,
  demoLogin,
  demoMe,
  demoPostHabit,
  demoRegister,
} from "@/services/demoBackend";

const baseURL = getApiBaseUrl();

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Token ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

function requireBaseUrl() {
  if (isDemoMode()) return;
  if (!baseURL) {
    throw new Error(
      "Missing EXPO_PUBLIC_API_BASE_URL. Copy .env.example to .env and set it to your backend URL."
    );
  }
}

export async function authRegister(payload: {
  username: string;
  email: string;
  password: string;
}) {
  if (isDemoMode()) return demoRegister(payload);
  requireBaseUrl();
  const { data } = await api.post("/api/auth/register/", payload);
  return data as { token?: string; key?: string; profile?: unknown };
}

export async function authLogin(payload: { email: string; password: string }) {
  if (isDemoMode()) return demoLogin(payload);
  requireBaseUrl();
  const { data } = await api.post("/api/auth/login/", payload);
  return data as { token?: string; key?: string; profile?: unknown };
}

export async function fetchMe() {
  if (isDemoMode()) return demoMe();
  requireBaseUrl();
  const { data } = await api.get("/api/users/me/");
  return data as unknown;
}

export async function listLeagues() {
  if (isDemoMode()) return demoListLeagues();
  requireBaseUrl();
  const { data } = await api.get("/api/leagues/");
  return data as unknown;
}

export async function joinLeague(invite_code: string) {
  if (isDemoMode()) return demoJoinLeague(invite_code);
  requireBaseUrl();
  const { data } = await api.post("/api/leagues/join/", { invite_code });
  return data as unknown;
}

export async function listWorkouts() {
  if (isDemoMode()) return demoListWorkouts();
  requireBaseUrl();
  const { data } = await api.get("/api/workouts/");
  return data as unknown;
}

export async function createWorkout(payload: {
  duration_mins: number;
  is_outdoor: boolean;
  notes?: string;
  started_at?: string;
}) {
  if (isDemoMode()) return demoCreateWorkout(payload);
  requireBaseUrl();
  const { data } = await api.post("/api/workouts/", payload);
  return data as unknown;
}

export async function getHabits(forDate: string) {
  if (isDemoMode()) return demoGetHabits(forDate);
  requireBaseUrl();
  const { data } = await api.get("/api/habits/", { params: { date: forDate } });
  return data as unknown;
}

export async function postHabit(payload: {
  task_key: string;
  log_date: string;
  completed: boolean;
}) {
  if (isDemoMode()) return demoPostHabit(payload);
  requireBaseUrl();
  const { data } = await api.post("/api/habits/", payload);
  return data as unknown;
}

export async function getLeaderboard(leagueId: number) {
  if (isDemoMode()) return demoLeaderboard(leagueId);
  requireBaseUrl();
  const { data } = await api.get(`/api/leagues/${leagueId}/leaderboard/`);
  return data as unknown;
}

export async function getFeed(leagueId: number) {
  if (isDemoMode()) return demoFeed(leagueId);
  requireBaseUrl();
  const { data } = await api.get(`/api/leagues/${leagueId}/feed/`);
  return data as unknown;
}
