import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import envConfig from '../../config/env.config';

export const finesApiSlice = createApi({
  reducerPath: 'finesApi',
  baseQuery: fetchBaseQuery({ baseUrl: envConfig.finesBaseUrl }),
  tagTypes: ['Fines'],
  endpoints: (builder) => ({
    getFines: builder.query({
      query: (page = 1, limit = 10) => `/fines?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              result.map(({ id }) => ({ type: 'Fines', id })),
              { type: 'Fines', id: 'LIST' },
            ]
          : [{ type: 'Fines', id: 'LIST' }],
    }),
    getFineById: builder.query({
      query: (id) => `/fines/${id}`,
      providesTags: (result) =>
        result ? [{ type: 'Fines', id: result.id }] : [],
    }),
    createFine: builder.mutation({
      query: (newFine) => ({
        url: '/fines',
        method: 'POST',
        body: newFine,
      }),
      invalidatesTags: [{ type: 'Fines', id: 'LIST' }],
    }),
    updateFine: builder.mutation({
      query: ({ id, ...updatedFine }) => ({
        url: `/fines/${id}`,
        method: 'PUT',
        body: updatedFine,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Fines', id },
        { type: 'Fines', id: 'LIST' },
      ],
    }),
    deleteFine: builder.mutation({
      query: (fineId) => ({
        url: `/fines/${fineId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, fineId) => [
        { type: 'Fines', id: fineId },
        { type: 'Fines', id: 'LIST' },
      ],
    }),
    searchFines: builder.query({
      query: (searchTerm, page = 1, limit = 10) =>
        `/fines/search?query=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              result.map(({ id }) => ({ type: 'Fines', id })),
              { type: 'Fines', id: 'LIST' },
            ]
          : [{ type: 'Fines', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetFinesQuery,
  useGetFineByIdQuery,
  useCreateFineMutation,
  useUpdateFineMutation,
  useDeleteFineMutation,
  useSearchFinesQuery,
} = finesApiSlice;
