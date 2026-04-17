import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { Profile } from "@/types/api";
import { authLogin, authRegister, fetchMe, setAuthToken } from "@/services/api";
import { clearToken, loadToken, saveToken } from "@/services/session";

type AuthState = {
  token: string | null;
  profile: Profile | null;
  isBootstrapping: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  profile: null,
  isBootstrapping: true,
  isLoading: false,
  error: null,
};

function extractToken(data: { token?: string; key?: string }) {
  return data.token ?? data.key ?? null;
}

export const bootstrapSession = createAsyncThunk("auth/bootstrap", async () => {
  const token = await loadToken();
  if (token) setAuthToken(token);
  let profile: Profile | null = null;
  if (token) {
    try {
      const me = await fetchMe();
      profile = me as Profile;
    } catch {
      // token may be expired/invalid; treat as signed out
      await clearToken();
      setAuthToken(null);
      return { token: null, profile: null };
    }
  }
  return { token: token ?? null, profile };
});

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: { username: string; email: string; password: string }) => {
    const data = await authRegister(payload);
    const token = extractToken(data) ?? "";
    if (!token) throw new Error("Register response did not include a token.");
    await saveToken(token);
    setAuthToken(token);
    const me = await fetchMe();
    return { token, profile: me as Profile };
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }) => {
    const data = await authLogin(payload);
    const token = extractToken(data) ?? "";
    if (!token) throw new Error("Login response did not include a token.");
    await saveToken(token);
    setAuthToken(token);
    const me = await fetchMe();
    return { token, profile: me as Profile };
  }
);

export const signOutThunk = createAsyncThunk("auth/signOut", async () => {
  await clearToken();
  setAuthToken(null);
  return true;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: { payload: string | null }) {
      state.token = action.payload;
    },
    setProfile(state, action: { payload: Profile | null }) {
      state.profile = action.payload;
    },
    signOut(state) {
      state.token = null;
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(bootstrapSession.pending, (state) => {
      state.isBootstrapping = true;
      state.error = null;
    });
    builder.addCase(bootstrapSession.fulfilled, (state, action) => {
      state.isBootstrapping = false;
      state.token = action.payload.token;
      state.profile = action.payload.profile;
    });
    builder.addCase(bootstrapSession.rejected, (state, action) => {
      state.isBootstrapping = false;
      state.error = action.error.message ?? "Failed to bootstrap session.";
    });

    builder.addCase(registerThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.profile = action.payload.profile;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? "Registration failed.";
    });

    builder.addCase(loginThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.profile = action.payload.profile;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message ?? "Login failed.";
    });

    builder.addCase(signOutThunk.fulfilled, (state) => {
      state.token = null;
      state.profile = null;
      state.error = null;
    });
  },
});

export const { setToken, setProfile, signOut } = authSlice.actions;
export default authSlice.reducer;
