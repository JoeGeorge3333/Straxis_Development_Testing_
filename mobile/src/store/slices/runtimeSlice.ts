import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getApiBaseUrl, setDemoMode } from "@/config/runtime";

const DEMO_OVERRIDE_KEY = "runtime.demoModeOverride.v1";

type RuntimeState = {
  isBootstrapping: boolean;
  demoMode: boolean;
};

function envDefaultDemoMode() {
  return !getApiBaseUrl();
}

export const bootstrapRuntime = createAsyncThunk("runtime/bootstrap", async () => {
  const raw = await AsyncStorage.getItem(DEMO_OVERRIDE_KEY);
  const override = raw == null ? null : raw === "true";
  const demoMode = override ?? envDefaultDemoMode();
  setDemoMode(demoMode);
  return { demoMode };
});

export const setDemoModeThunk = createAsyncThunk("runtime/setDemoMode", async (next: boolean) => {
  await AsyncStorage.setItem(DEMO_OVERRIDE_KEY, String(next));
  setDemoMode(next);
  return { demoMode: next };
});

const runtimeSlice = createSlice({
  name: "runtime",
  initialState: { isBootstrapping: true, demoMode: envDefaultDemoMode() } as RuntimeState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(bootstrapRuntime.pending, (state) => {
      state.isBootstrapping = true;
    });
    builder.addCase(bootstrapRuntime.fulfilled, (state, action) => {
      state.isBootstrapping = false;
      state.demoMode = action.payload.demoMode;
    });
    builder.addCase(bootstrapRuntime.rejected, (state) => {
      state.isBootstrapping = false;
    });

    builder.addCase(setDemoModeThunk.fulfilled, (state, action) => {
      state.demoMode = action.payload.demoMode;
    });
  },
});

export default runtimeSlice.reducer;

