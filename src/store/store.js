import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice/settingsSlice';
import authReducer from './authSlice/authSlice';
import notificationReducer from './notificationSlice/notificationSlice';
import userApiSlice from './userApi/userApiSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    auth: authReducer,
    notification: notificationReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApiSlice.middleware),
});
