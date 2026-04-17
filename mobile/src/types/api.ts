export type Profile = {
  id: number;
  username: string;
  avatar_url: string | null;
};

export type LeagueStatus = "draft" | "active" | "completed";

export type League = {
  id: number;
  name: string;
  invite_code: string;
  status: LeagueStatus;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
};

export type Workout = {
  id: number;
  started_at: string; // ISO-8601
  duration_mins: number;
  is_outdoor: boolean;
  notes: string;
};

export type HabitTaskKey =
  | "diet_compliance"
  | "water_gallon"
  | "reading_done"
  | "progress_photo"
  | "workout_completed"
  | "workout_outdoor";

export type HabitLogItem = {
  task_key: HabitTaskKey;
  completed: boolean;
  log_date: string; // YYYY-MM-DD
};

export type LeaderboardRow = {
  rank: number;
  profile: Profile;
  total_points: number;
};

export type FeedItem = {
  id: number;
  created_at: string; // ISO-8601
  type: string;
  actor: Profile;
  message: string;
};
