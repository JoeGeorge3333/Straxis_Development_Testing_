import React, { createContext, useContext, useMemo, useReducer } from "react";

import { dayKeyDaysAgo, getLocalDayKey } from "./lib/dayKey";
import type { ChallengeTaskDef, League, LeagueChatMessage, LogEntry, Task, User } from "./types";

export type State = {
  meId: string;
  users: Record<string, User>;
  logs: LogEntry[];
  leagues: Record<string, League>;
  activeLeagueId: string | null;
  /** Per user, per challenge-task row */
  taskProgress: Record<string, Record<string, { completedToday: boolean; quickNote?: string }>>;
  leagueJoinError: string | null;
  /** Mock chat: leagueId → chronological messages */
  leagueChat: Record<string, LeagueChatMessage[]>;
  /**
   * Local calendar day (YYYY-MM-DD) for which `taskProgress` applies.
   * When the real day advances, `day/tick` clears `taskProgress` so challenge rows show a fresh day.
   */
  rollDayKey: string;
};

type Action =
  | { type: "task/toggleComplete"; taskId: string }
  | { type: "task/setQuickNote"; taskId: string; note: string }
  | { type: "log/add"; entry: Omit<LogEntry, "id" | "timestamp"> & { id?: string; timestamp?: number } }
  | { type: "me/setAvatar"; avatar: string }
  | { type: "league/create"; name: string }
  | { type: "league/join"; accessKey: string }
  | { type: "league/clearJoinError" }
  | { type: "league/addChallengeTask"; task: ChallengeTaskDef }
  | { type: "league/removeChallengeTask"; taskId: string }
  | { type: "league/setChallengeTasks"; tasks: ChallengeTaskDef[] }
  | { type: "chat/post"; leagueId: string; body: string }
  | { type: "day/tick"; now: number };

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function makeAccessKey() {
  return `STRX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function defaultChallengeTasksForLeague(leagueId: string): ChallengeTaskDef[] {
  const rows: Array<{ name: string; type: ChallengeTaskDef["type"]; points: number }> = [
    { name: "Workout Indoor", type: "time", points: 10 },
    { name: "Water Totals", type: "number", points: 5 },
    { name: "Read 10 Pages", type: "checkbox", points: 5 },
    { name: "Workout Outdoor", type: "time", points: 10 },
    { name: "Progress Pic", type: "checkbox", points: 5 },
  ];
  return rows.map((r, i) => ({
    id: `${leagueId}_ct_${i}`,
    name: r.name,
    type: r.type,
    points: r.points,
  }));
}

const STARTER_LEAGUE_ID = "lg_starter";

function seedStarterChat(): LeagueChatMessage[] {
  const now = Date.now();
  return [
    {
      id: "chat_seed_1",
      leagueId: STARTER_LEAGUE_ID,
      userId: "u_opp",
      body: "Good luck today — log early.",
      at: now - 3_600_000,
    },
    {
      id: "chat_seed_2",
      leagueId: STARTER_LEAGUE_ID,
      userId: "u_2",
      body: "Anyone doing outdoor workout after 5?",
      at: now - 1_800_000,
    },
  ];
}

const initialState: State = {
  meId: "u_me",
  users: {
    u_me: { id: "u_me", name: "You", avatar: "🙂", total_points: 60 },
    u_opp: { id: "u_opp", name: "Opponent", avatar: "😐", total_points: 20 },
    u_2: { id: "u_2", name: "Rival", avatar: "😮", total_points: 40 },
    u_3: { id: "u_3", name: "Chaser", avatar: "😬", total_points: 30 },
  },
  logs: [],
  leagues: {
    [STARTER_LEAGUE_ID]: {
      id: STARTER_LEAGUE_ID,
      name: "Starter Challenge",
      accessKey: "STRX-DEMO",
      ownerId: "u_me",
      memberIds: ["u_me", "u_opp", "u_2", "u_3"],
      challengeTasks: defaultChallengeTasksForLeague(STARTER_LEAGUE_ID),
      startedOnDayKey: dayKeyDaysAgo(11),
    },
  },
  activeLeagueId: STARTER_LEAGUE_ID,
  taskProgress: {},
  leagueJoinError: null,
  leagueChat: {
    [STARTER_LEAGUE_ID]: seedStarterChat(),
  },
  rollDayKey: getLocalDayKey(),
};

function reducer(state: State, action: Action): State {
  const activeId = state.activeLeagueId;
  const activeLeague = activeId ? state.leagues[activeId] : null;

  switch (action.type) {
    case "task/toggleComplete": {
      if (!activeLeague) return state;
      const def = activeLeague.challengeTasks.find((t) => t.id === action.taskId);
      if (!def) return state;

      const me = state.meId;
      const prevMine = state.taskProgress[me]?.[action.taskId]?.completedToday ?? false;
      const next = !prevMine;
      const pointsDelta = next ? def.points : -def.points;
      const user = state.users[me];

      const prevProgress = state.taskProgress[me] ?? {};
      const prevRow = prevProgress[action.taskId] ?? {};

      return {
        ...state,
        taskProgress: {
          ...state.taskProgress,
          [me]: {
            ...prevProgress,
            [action.taskId]: { ...prevRow, completedToday: next },
          },
        },
        users: {
          ...state.users,
          [me]: { ...user, total_points: Math.max(0, user.total_points + pointsDelta) },
        },
        logs: [
          {
            id: uid("log"),
            task_id: def.id,
            leagueId: activeLeague.id,
            value: next ? "complete" : "undo",
            notes: prevRow.quickNote,
            timestamp: Date.now(),
            pointsDelta,
          },
          ...state.logs,
        ],
      };
    }
    case "task/setQuickNote": {
      if (!activeLeague || !activeLeague.challengeTasks.some((t) => t.id === action.taskId)) return state;
      const me = state.meId;
      const prevProgress = state.taskProgress[me] ?? {};
      const prevRow = prevProgress[action.taskId] ?? {};
      return {
        ...state,
        taskProgress: {
          ...state.taskProgress,
          [me]: {
            ...prevProgress,
            [action.taskId]: { ...prevRow, quickNote: action.note },
          },
        },
      };
    }
    case "log/add": {
      const id = action.entry.id ?? uid("log");
      const timestamp = action.entry.timestamp ?? Date.now();
      const me = state.users[state.meId];
      const leagueId = state.activeLeagueId ?? undefined;
      return {
        ...state,
        users: {
          ...state.users,
          [state.meId]: { ...me, total_points: Math.max(0, me.total_points + action.entry.pointsDelta) },
        },
        logs: [
          {
            id,
            timestamp,
            ...action.entry,
            leagueId: action.entry.leagueId ?? leagueId,
          },
          ...state.logs,
        ],
      };
    }
    case "me/setAvatar": {
      const me = state.users[state.meId];
      return {
        ...state,
        users: {
          ...state.users,
          [state.meId]: { ...me, avatar: action.avatar },
        },
      };
    }
    case "league/create": {
      const leagueId = uid("lg");
      const accessKey = makeAccessKey();
      const league: League = {
        id: leagueId,
        name: action.name.trim(),
        accessKey,
        ownerId: state.meId,
        memberIds: [state.meId],
        challengeTasks: defaultChallengeTasksForLeague(leagueId),
        startedOnDayKey: getLocalDayKey(),
      };
      return {
        ...state,
        leagues: { ...state.leagues, [leagueId]: league },
        activeLeagueId: leagueId,
        leagueJoinError: null,
        leagueChat: {
          ...state.leagueChat,
          [leagueId]: [
            {
              id: `${leagueId}_welcome`,
              leagueId,
              userId: state.meId,
              body: "League created. (Mock chat — messages stay in this browser only.)",
              at: Date.now(),
            },
          ],
        },
      };
    }
    case "league/join": {
      const key = action.accessKey.trim().toUpperCase();
      const league = Object.values(state.leagues).find((l) => l.accessKey === key);
      if (!league) {
        return { ...state, leagueJoinError: "No league matches that access key." };
      }
      if (league.memberIds.includes(state.meId)) {
        return { ...state, activeLeagueId: league.id, leagueJoinError: null };
      }
      return {
        ...state,
        leagues: {
          ...state.leagues,
          [league.id]: { ...league, memberIds: [...league.memberIds, state.meId] },
        },
        activeLeagueId: league.id,
        leagueJoinError: null,
      };
    }
    case "league/clearJoinError":
      return { ...state, leagueJoinError: null };
    case "league/addChallengeTask": {
      if (!activeLeague || activeLeague.ownerId !== state.meId) return state;
      const nextLeague: League = {
        ...activeLeague,
        challengeTasks: [action.task, ...activeLeague.challengeTasks],
      };
      return {
        ...state,
        leagues: { ...state.leagues, [activeLeague.id]: nextLeague },
      };
    }
    case "league/removeChallengeTask": {
      if (!activeLeague || activeLeague.ownerId !== state.meId) return state;
      const nextLeague: League = {
        ...activeLeague,
        challengeTasks: activeLeague.challengeTasks.filter((t) => t.id !== action.taskId),
      };
      return {
        ...state,
        leagues: { ...state.leagues, [activeLeague.id]: nextLeague },
      };
    }
    case "league/setChallengeTasks": {
      if (!activeLeague || activeLeague.ownerId !== state.meId) return state;
      return {
        ...state,
        leagues: {
          ...state.leagues,
          [activeLeague.id]: { ...activeLeague, challengeTasks: action.tasks },
        },
      };
    }
    case "chat/post": {
      const body = action.body.trim();
      if (!body || !state.leagues[action.leagueId]) return state;
      const msg: LeagueChatMessage = {
        id: uid("chat"),
        leagueId: action.leagueId,
        userId: state.meId,
        body,
        at: Date.now(),
      };
      const prev = state.leagueChat[action.leagueId] ?? [];
      return {
        ...state,
        leagueChat: {
          ...state.leagueChat,
          [action.leagueId]: [...prev, msg],
        },
      };
    }
    case "day/tick": {
      const today = getLocalDayKey(new Date(action.now));
      if (today === state.rollDayKey) return state;
      return {
        ...state,
        rollDayKey: today,
        taskProgress: {},
      };
    }
    default:
      return state;
  }
}

export function getActiveLeague(state: State): League | null {
  if (!state.activeLeagueId) return null;
  return state.leagues[state.activeLeagueId] ?? null;
}

export function buildDashboardTasks(state: State): Task[] {
  const league = getActiveLeague(state);
  if (!league) return [];
  const mine = state.taskProgress[state.meId] ?? {};
  return league.challengeTasks.map((def) => ({
    id: def.id,
    name: def.name,
    type: def.type,
    points: def.points,
    completedToday: mine[def.id]?.completedToday ?? false,
    quickNote: mine[def.id]?.quickNote,
  }));
}

export function isLeagueOwner(state: State): boolean {
  const lg = getActiveLeague(state);
  return !!lg && lg.ownerId === state.meId;
}

export function pickOpponentId(state: State): string | null {
  const lg = getActiveLeague(state);
  if (!lg) return "u_opp";
  const others = lg.memberIds.filter((id) => id !== state.meId);
  return others[0] ?? null;
}

const StateCtx = createContext<State | null>(null);
const ActionsCtx = createContext<{
  toggleTask(taskId: string): void;
  setQuickNote(taskId: string, note: string): void;
  addLog(entry: Omit<LogEntry, "id" | "timestamp">): void;
  setMyAvatar(avatar: string): void;
  createLeague(name: string): void;
  joinLeague(accessKey: string): void;
  clearLeagueJoinError(): void;
  addChallengeTask(task: ChallengeTaskDef): void;
  removeChallengeTask(taskId: string): void;
  setChallengeTasks(tasks: ChallengeTaskDef[]): void;
  postLeagueChat(leagueId: string, body: string): void;
  tickDay(): void;
} | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      toggleTask(taskId: string) {
        dispatch({ type: "task/toggleComplete", taskId });
      },
      setQuickNote(taskId: string, note: string) {
        dispatch({ type: "task/setQuickNote", taskId, note });
      },
      addLog(entry: Omit<LogEntry, "id" | "timestamp">) {
        dispatch({ type: "log/add", entry });
      },
      setMyAvatar(avatar: string) {
        dispatch({ type: "me/setAvatar", avatar });
      },
      createLeague(name: string) {
        dispatch({ type: "league/create", name });
      },
      joinLeague(accessKey: string) {
        dispatch({ type: "league/join", accessKey });
      },
      clearLeagueJoinError() {
        dispatch({ type: "league/clearJoinError" });
      },
      addChallengeTask(task: ChallengeTaskDef) {
        dispatch({ type: "league/addChallengeTask", task });
      },
      removeChallengeTask(taskId: string) {
        dispatch({ type: "league/removeChallengeTask", taskId });
      },
      setChallengeTasks(tasks: ChallengeTaskDef[]) {
        dispatch({ type: "league/setChallengeTasks", tasks });
      },
      postLeagueChat(leagueId: string, body: string) {
        dispatch({ type: "chat/post", leagueId, body });
      },
      tickDay() {
        dispatch({ type: "day/tick", now: Date.now() });
      },
    }),
    [],
  );

  return (
    <StateCtx.Provider value={state}>
      <ActionsCtx.Provider value={actions}>{children}</ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useAppState() {
  const v = useContext(StateCtx);
  if (!v) throw new Error("useAppState must be used within AppStateProvider");
  return v;
}

export function useAppActions() {
  const v = useContext(ActionsCtx);
  if (!v) throw new Error("useAppActions must be used within AppStateProvider");
  return v;
}

export function useDashboardTasks(): Task[] {
  const s = useAppState();
  return useMemo(() => buildDashboardTasks(s), [s]);
}

export function useActiveLeague(): League | null {
  const s = useAppState();
  return useMemo(() => getActiveLeague(s), [s]);
}

export function useIsLeagueOwner(): boolean {
  const s = useAppState();
  return useMemo(() => isLeagueOwner(s), [s]);
}
