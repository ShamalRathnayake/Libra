import { createSlice } from '@reduxjs/toolkit';
import { notification } from 'antd';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
  },
  reducers: {
    showNotification: (state, action) => {
      const { type, message, description } = action.payload;
      notification[type]({
        message,
        description,
        placement: 'topRight',
        duration: 3,
      });
    },
  },
});

export const { showNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
