import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { Workout } from "@/types/api";
import { createWorkout, listWorkouts } from "@/services/api";

type WorkoutsState = {
  items: Workout[];
  isLoading: boolean;
  error: string | null;
};

const initialState: WorkoutsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const refreshWorkouts = createAsyncThunk("workouts/list", async () => {
  const data = await listWorkouts();
  return data as Workout[];
});

export const logWorkoutThunk = createAsyncThunk(
  "workouts/create",
  async (payload: { duration_mins: number; is_outdoor: boolean; notes?: string }) => {
    const started_at = new Date().toISOString();
    const data = await createWorkout({ ...payload, started_at });
    return data as Workout;
  }
);

const workoutsSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    setWorkouts(state, action: { payload: Workout[] }) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshWorkouts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(refreshWorkouts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload ?? [];
    });
    builder.addCase(refreshWorkouts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? "Failed to load workouts.";
    });

    builder.addCase(logWorkoutThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(logWorkoutThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      const created = action.payload;
      state.items = [created, ...state.items];
    });
    builder.addCase(logWorkoutThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? "Failed to log workout.";
    });
  },
});

export const { setWorkouts } = workoutsSlice.actions;
export default workoutsSlice.reducer;
