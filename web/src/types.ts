export type TaskType = "checkbox" | "number" | "time";

/** One row in the shared challenge — same for every league member. */
export type ChallengeTaskDef = {
  id: string;
  name: string;
  type: TaskType;
  points: number;
};

export type Task = {
  id: string;
  name: string;
  type: TaskType;
  points: number;
  completedToday: boolean;
  quickNote?: string;
};

export type LogEntry = {
  id: string;
  task_id: string;
  leagueId?: string;
  value?: number | string;
  notes?: string;
  timestamp: number;
  pointsDelta: number;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  total_points: number;
};

export type League = {
  id: string;
  name: string;
  /** Share this so others can join the same challenge group */
  accessKey: string;
  ownerId: string;
  memberIds: string[];
  /** Canonical daily challenge — everyone in the league sees these on their dashboard */
  challengeTasks: ChallengeTaskDef[];
  /** Local YYYY-MM-DD the challenge started (Day 1). */
  startedOnDayKey: string;
};

/** Mock league chat — in-memory only, single browser. */
export type LeagueChatMessage = {
  id: string;
  leagueId: string;
  userId: string;
  body: string;
  at: number;
};
