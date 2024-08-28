import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import envConfig from '../../config/env.config';

export const booksApiSlice = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: envConfig.booksBaseUrl }),
  tagTypes: ['Books'],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: (page = 1, limit = 10) => `/books?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Books', id })),
              { type: 'Books', id: 'LIST' },
            ]
          : [{ type: 'Books', id: 'LIST' }],
    }),
    searchBooks: builder.query({
      query: (searchTerm, page = 1, limit = 10) =>
        `/books/search?query=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Books', id })),
              { type: 'Books', id: 'LIST' },
            ]
          : [{ type: 'Books', id: 'LIST' }],
    }),
    createBook: builder.mutation({
      query: (newBook) => ({
        url: '/books',
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: [{ type: 'Books', id: 'LIST' }],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...updatedBook }) => ({
        url: `/books/${id}`,
        method: 'PUT',
        body: updatedBook,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Books', id },
        { type: 'Books', id: 'LIST' },
      ],
    }),
    deleteBook: builder.mutation({
      query: (bookId) => ({
        url: `/books/${bookId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, bookId) => [
        { type: 'Books', id: bookId },
        { type: 'Books', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useSearchBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApiSlice;
