import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchDeviceStatus = createAsyncThunk("activity/deviceStatus", async (id, { rejectWithValue }) => {
  try { return { id, data: await api.deviceStatus(id) }; } catch (error) { return rejectWithValue({ id, message: error.message }); }
});
export const fetchLatestLocation = createAsyncThunk("activity/latestLocation", async (id, { rejectWithValue }) => {
  try { return { id, data: await api.latestLocation(id) }; } catch (error) { return rejectWithValue({ id, message: error.message }); }
});
export const fetchLocationHistory = createAsyncThunk("activity/locationHistory", async ({ id, limit = 50, offset = 0 }, { rejectWithValue }) => {
  try { const result = await api.locationHistory(id, limit, offset); return { id, items: result.items || [] }; } catch (error) { return rejectWithValue({ id, message: error.message }); }
});
export const fetchSecurityEvents = createAsyncThunk("activity/securityEvents", async ({ id, limit = 50, offset = 0 }, { rejectWithValue }) => {
  try { const result = await api.securityEvents(id, limit, offset); return { id, items: result.items || [] }; } catch (error) { return rejectWithValue({ id, message: error.message }); }
});
export const fetchDeviceCommands = createAsyncThunk("activity/deviceCommands", async ({ id, limit = 50, offset = 0 }, { rejectWithValue }) => {
  try { const result = await api.deviceCommands(id, limit, offset); return { id, items: Array.isArray(result) ? result : result.items || [] }; } catch (error) { return rejectWithValue({ id, message: error.message }); }
});

const activitySlice = createSlice({
  name: "activity",
  initialState: { statuses: {}, latestLocations: {}, locationHistory: {}, securityEvents: {}, commands: {}, status: "idle", error: null },
  reducers: { clearActivity() { return { statuses: {}, latestLocations: {}, locationHistory: {}, securityEvents: {}, commands: {}, status: "idle", error: null }; } },
  extraReducers(builder) {
    builder
      .addCase(fetchDeviceStatus.fulfilled, (state, action) => { state.statuses[action.payload.id] = action.payload.data; })
      .addCase(fetchLatestLocation.fulfilled, (state, action) => { state.latestLocations[action.payload.id] = action.payload.data; })
      .addCase(fetchLocationHistory.fulfilled, (state, action) => { state.locationHistory[action.payload.id] = action.payload.items; })
      .addCase(fetchSecurityEvents.fulfilled, (state, action) => { state.securityEvents[action.payload.id] = action.payload.items; })
      .addCase(fetchDeviceCommands.fulfilled, (state, action) => { state.commands[action.payload.id] = action.payload.items; })
      .addMatcher(action => action.type.endsWith("/rejected") && action.type.startsWith("activity/"), (state, action) => {
        state.error = action.payload?.message || action.error?.message || "Unable to load device activity.";
      });
  },
});
export const { clearActivity } = activitySlice.actions;
export default activitySlice.reducer;
