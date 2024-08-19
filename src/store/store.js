import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice/settingsSlice';
import authReducer from './authSlice/authSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    auth: authReducer,
  },
});
