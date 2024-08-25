import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice/settingsSlice';
import authReducer from './authSlice/authSlice';
import notificationReducer from './notificationSlice/notificationSlice';
import userApiSlice from './userApi/userApiSlice';
import { booksApiSlice } from './booksApi/booksApiSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    auth: authReducer,
    notification: notificationReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [booksApiSlice.reducerPath]: booksApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      booksApiSlice.middleware,
    ),
});
