import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getFeed, getLeaderboard, joinLeague, listLeagues } from "@/services/api";
import type { FeedItem, LeaderboardRow, League, Profile } from "@/types/api";

type TodayScore = {
  mePoints: number;
  opponentPoints: number;
};

type LeaguesState = {
  leagues: League[];
  activeLeagueId: number | null;
  activeLeague: (League & { dayNumber?: number; streakDays?: number }) | null;
  leaderboard: LeaderboardRow[];
  feed: FeedItem[];
  todayScore: TodayScore | null;
  opponentSnapshot: Profile | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: LeaguesState = {
  leagues: [],
  activeLeagueId: null,
  activeLeague: null,
  leaderboard: [],
  feed: [],
  todayScore: null,
  opponentSnapshot: null,
  isLoading: false,
  error: null,
};

export const refreshLeagues = createAsyncThunk("leagues/list", async () => {
  const data = await listLeagues();
  return data as League[];
});

export const joinLeagueThunk = createAsyncThunk(
  "leagues/join",
  async (invite_code: string) => {
    const data = await joinLeague(invite_code);
    return data as League;
  }
);

export const refreshLeaderboard = createAsyncThunk(
  "leagues/leaderboard",
  async (leagueId: number) => {
    const data = await getLeaderboard(leagueId);
    return data as LeaderboardRow[];
  }
);

export const refreshFeed = createAsyncThunk("leagues/feed", async (leagueId: number) => {
  const data = await getFeed(leagueId);
  return data as FeedItem[];
});

const leaguesSlice = createSlice({
  name: "leagues",
  initialState,
  reducers: {
    setActiveLeagueId(state, action: { payload: number | null }) {
      state.activeLeagueId = action.payload;
      state.activeLeague = state.leagues.find((l) => l.id === action.payload) ?? null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshLeagues.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(refreshLeagues.fulfilled, (state, action) => {
      state.isLoading = false;
      state.leagues = action.payload ?? [];
      if (state.activeLeagueId == null && state.leagues.length > 0) {
        state.activeLeagueId = state.leagues[0].id;
      }
      state.activeLeague =
        state.leagues.find((l) => l.id === state.activeLeagueId) ?? null;
    });
    builder.addCase(refreshLeagues.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? "Failed to load leagues.";
    });

    builder.addCase(joinLeagueThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(joinLeagueThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      const joined = action.payload;
      state.leagues = [joined, ...state.leagues.filter((l) => l.id !== joined.id)];
      state.activeLeagueId = joined.id;
      state.activeLeague = joined;
    });
    builder.addCase(joinLeagueThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? "Failed to join league.";
    });

    builder.addCase(refreshLeaderboard.fulfilled, (state, action) => {
      state.leaderboard = action.payload ?? [];

      const me = state.leaderboard[0];
      const opp = state.leaderboard[1];
      if (me && opp) {
        state.todayScore = { mePoints: me.total_points, opponentPoints: opp.total_points };
        state.opponentSnapshot = opp.profile;
      }
    });

    builder.addCase(refreshFeed.fulfilled, (state, action) => {
      state.feed = action.payload ?? [];
    });
  },
});

export const { setActiveLeagueId } = leaguesSlice.actions;
export default leaguesSlice.reducer;
