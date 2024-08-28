import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import envConfig from '../../config/env.config';

export const lendingApiSlice = createApi({
  reducerPath: 'lendingApi',
  baseQuery: fetchBaseQuery({ baseUrl: envConfig.lendingBaseUrl }),
  tagTypes: ['Lendings'],
  endpoints: (builder) => ({
    getLendings: builder.query({
      query: (page = 1, limit = 10) => `/lendings?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Lendings', id })),
              { type: 'Lendings', id: 'LIST' },
            ]
          : [{ type: 'Lendings', id: 'LIST' }],
    }),
    getLendingById: builder.query({
      query: (id) => `/lendings/${id}`,
      providesTags: (result) =>
        result ? [{ type: 'Lendings', id: result.id }] : [],
    }),
    createLending: builder.mutation({
      query: (newLending) => ({
        url: '/lendings',
        method: 'POST',
        body: newLending,
      }),
      invalidatesTags: [{ type: 'Lendings', id: 'LIST' }],
    }),
    updateLending: builder.mutation({
      query: ({ id, ...updatedLending }) => ({
        url: `/lendings/${id}`,
        method: 'PUT',
        body: updatedLending,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Lendings', id },
        { type: 'Lendings', id: 'LIST' },
      ],
    }),
    deleteLending: builder.mutation({
      query: (lendingId) => ({
        url: `/lendings/${lendingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, lendingId) => [
        { type: 'Lendings', id: lendingId },
        { type: 'Lendings', id: 'LIST' },
      ],
    }),
    searchLendings: builder.query({
      query: (searchTerm, page = 1, limit = 10) =>
        `/lendings/search?query=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Lendings', id })),
              { type: 'Lendings', id: 'LIST' },
            ]
          : [{ type: 'Lendings', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetLendingsQuery,
  useGetLendingByIdQuery,
  useCreateLendingMutation,
  useUpdateLendingMutation,
  useDeleteLendingMutation,
  useSearchLendingsQuery,
} = lendingApiSlice;
