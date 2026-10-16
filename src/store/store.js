import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import devicesReducer from "./slices/devicesSlice";
import activityReducer from "./slices/activitySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: devicesReducer,
    activity: activityReducer,
  },
});
