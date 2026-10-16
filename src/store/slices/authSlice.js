import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

const USER_KEY = "og_user";
const storedToken = () => sessionStorage.getItem("og_access_token");
const storedUser = () => {
  try { return JSON.parse(sessionStorage.getItem(USER_KEY) || "null"); } catch { return null; }
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await api.login({ email, password });
      sessionStorage.setItem("og_access_token", result.token.access_token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(result.user));
      return result;
    } catch (error) { return rejectWithValue(error.message); }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ full_name, email, password }, { rejectWithValue }) => {
    try { return await api.register({ full_name, email, password }); }
    catch (error) { return rejectWithValue(error.message); }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken(),
    user: storedUser(),
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      sessionStorage.removeItem("og_access_token");
      sessionStorage.removeItem(USER_KEY);
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    clearAuthError(state) { state.error = null; },
    updateProfile(state, action) {
      state.user = action.payload;
      sessionStorage.setItem(USER_KEY, JSON.stringify(action.payload));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token.access_token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to sign in.";
      })
      .addCase(registerUser.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.status = "succeeded"; })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to register.";
      });
  },
});

export const { logout, clearAuthError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
