import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import envConfig from '../../config/env.config';

export const authorsApiSlice = createApi({
  reducerPath: 'authorsApi',
  baseQuery: fetchBaseQuery({ baseUrl: envConfig.authorsBaseUrl }),
  tagTypes: ['Authors'],
  endpoints: (builder) => ({
    getAuthors: builder.query({
      query: (page = 1, limit = 10) => `/authors?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              result.map(({ id }) => ({ type: 'Authors', id })),
              { type: 'Authors', id: 'LIST' },
            ]
          : [{ type: 'Authors', id: 'LIST' }],
    }),
    searchAuthors: builder.query({
      query: (searchTerm, page = 1, limit = 10) =>
        `/authors/search?query=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              result.map(({ id }) => ({ type: 'Authors', id })),
              { type: 'Authors', id: 'LIST' },
            ]
          : [{ type: 'Authors', id: 'LIST' }],
    }),
    createAuthor: builder.mutation({
      query: (newAuthor) => ({
        url: '/authors',
        method: 'POST',
        body: newAuthor,
      }),
      invalidatesTags: [{ type: 'Authors', id: 'LIST' }],
    }),
    updateAuthor: builder.mutation({
      query: (updatedAuthor) => ({
        url: `/authors/${updatedAuthor.id}`,
        method: 'PUT',
        body: updatedAuthor,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Authors', id },
        { type: 'Authors', id: 'LIST' },
      ],
    }),
    deleteAuthor: builder.mutation({
      query: (authorId) => ({
        url: `/authors/${authorId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, authorId) => [
        { type: 'Authors', id: authorId },
        { type: 'Authors', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAuthorsQuery,
  useSearchAuthorsQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
} = authorsApiSlice;
