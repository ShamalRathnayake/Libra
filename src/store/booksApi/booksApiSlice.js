import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import envConfig from '../../config/env.config';

export const booksApiSlice = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: envConfig.booksBaseUrl }),
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: (page = 1, limit = 10) => `/books?page=${page}&limit=${limit}`,
    }),
    searchBooks: builder.query({
      query: (searchTerm, page = 1, limit = 10) =>
        `/books/search?query=${searchTerm}&page=${page}&limit=${limit}`,
    }),
  }),
});

export const { useGetBooksQuery, useSearchBooksQuery } = booksApiSlice;
