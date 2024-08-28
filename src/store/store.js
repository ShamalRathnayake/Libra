import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice/settingsSlice';
import authReducer from './authSlice/authSlice';
import notificationReducer from './notificationSlice/notificationSlice';
import userApiSlice from './userApi/userApiSlice';
import { booksApiSlice } from './booksApi/booksApiSlice';
import { authorsApiSlice } from './authorApi/authorApiSlice';
import { lendingApiSlice } from './lendingApi/lendingApiSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    auth: authReducer,
    notification: notificationReducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [booksApiSlice.reducerPath]: booksApiSlice.reducer,
    [authorsApiSlice.reducerPath]: authorsApiSlice.reducer,
    [lendingApiSlice.reducerPath]: lendingApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      booksApiSlice.middleware,
      authorsApiSlice.middleware,
      lendingApiSlice.middleware,
    ),
});
