import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [],
  authors: [],
  users: [],
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  _reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
    },
    setAuthors: (state, action) => {
      state.books = action.payload;
    },
    setUsers: (state, action) => {
      state.books = action.payload;
    },
  },
});

export const { setBooks, setAuthors, setUsers } = dataSlice.actions;
export default dataSlice.reducer;
