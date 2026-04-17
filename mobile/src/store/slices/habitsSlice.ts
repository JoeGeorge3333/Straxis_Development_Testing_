import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { HabitLogItem } from "@/types/api";
import { getHabits, postHabit } from "@/services/api";

type HabitsState = {
  forDate: string; // YYYY-MM-DD
  items: HabitLogItem[];
  isLoading: boolean;
  error: string | null;
};

const today = new Date().toISOString().slice(0, 10);

const initialState: HabitsState = {
  forDate: today,
  items: [
    { task_key: "diet_compliance", completed: true, log_date: today },
    { task_key: "water_gallon", completed: true, log_date: today },
    { task_key: "reading_done", completed: false, log_date: today },
    { task_key: "progress_photo", completed: false, log_date: today },
  ],
  isLoading: false,
  error: null,
};

export const refreshHabits = createAsyncThunk("habits/list", async (forDate: string) => {
  const data = await getHabits(forDate);
  return { forDate, items: data as HabitLogItem[] };
});

export const toggleHabitThunk = createAsyncThunk(
  "habits/toggle",
  async (payload: { task_key: string; forDate: string; completed: boolean }) => {
    const data = await postHabit({
      task_key: payload.task_key,
      log_date: payload.forDate,
      completed: payload.completed,
    });
    return data as HabitLogItem;
  }
);

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    toggleHabit(state, action: { payload: { task_key: string } }) {
      const item = state.items.find((i) => i.task_key === action.payload.task_key);
      if (item) item.completed = !item.completed;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshHabits.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(refreshHabits.fulfilled, (state, action) => {
      state.isLoading = false;
      state.forDate = action.payload.forDate;
      state.items = action.payload.items ?? [];
    });
    builder.addCase(refreshHabits.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? "Failed to load habits.";
    });

    builder.addCase(toggleHabitThunk.rejected, (state, action) => {
      state.error = action.error.message ?? "Failed to update habit.";
    });
  },
});

export const { toggleHabit } = habitsSlice.actions;
export default habitsSlice.reducer;
