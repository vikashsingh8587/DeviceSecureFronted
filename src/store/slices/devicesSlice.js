import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchDevices = createAsyncThunk("devices/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const result = await api.devices();
    return Array.isArray(result) ? result : [];
  } catch (error) { return rejectWithValue(error.message); }
});

export const createDevice = createAsyncThunk("devices/create", async (payload, { rejectWithValue }) => {
  try { return await api.registerDevice(payload); }
  catch (error) { return rejectWithValue(error.message); }
});

export const editDevice = createAsyncThunk("devices/edit", async ({ id, payload }, { rejectWithValue }) => {
  try { return await api.updateDevice(id, payload); }
  catch (error) { return rejectWithValue(error.message); }
});

export const deleteDevice = createAsyncThunk("devices/delete", async (id, { rejectWithValue }) => {
  try { await api.unlinkDevice(id); return id; }
  catch (error) { return rejectWithValue(error.message); }
});

const devicesSlice = createSlice({
  name: "devices",
  initialState: { items: [], status: "idle", error: null, lastFetchedAt: null },
  reducers: { clearDevices(state) { state.items = []; state.status = "idle"; state.error = null; } },
  extraReducers(builder) {
    builder
      .addCase(fetchDevices.pending, state => { state.status = "loading"; state.error = null; })
      .addCase(fetchDevices.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload; state.lastFetchedAt = Date.now(); })
      .addCase(fetchDevices.rejected, (state, action) => { state.status = "failed"; state.error = action.payload || "Unable to load devices."; })
      .addCase(createDevice.fulfilled, (state, action) => { if (action.payload) state.items.unshift(action.payload); })
      .addCase(editDevice.fulfilled, (state, action) => { const i = state.items.findIndex(d => d.id === action.meta.arg.id); if (i >= 0 && action.payload) state.items[i] = { ...state.items[i], ...action.payload }; })
      .addCase(deleteDevice.fulfilled, (state, action) => { state.items = state.items.filter(d => String(d.id) !== String(action.payload)); });
  },
});
export const { clearDevices } = devicesSlice.actions;
export default devicesSlice.reducer;
