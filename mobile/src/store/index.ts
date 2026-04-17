import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/slices/authSlice";
import habitsReducer from "@/store/slices/habitsSlice";
import leaguesReducer from "@/store/slices/leaguesSlice";
import runtimeReducer from "@/store/slices/runtimeSlice";
import workoutsReducer from "@/store/slices/workoutsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workouts: workoutsReducer,
    habits: habitsReducer,
    leagues: leaguesReducer,
    runtime: runtimeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
