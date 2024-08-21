import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  isAuthenticated: !!token,
  user: user || null,
  token: token || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { user, token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
