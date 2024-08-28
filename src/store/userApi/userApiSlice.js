import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import envConfig from '../../config/env.config';

const userApiSlice = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: envConfig.usersBaseUrl }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (page = 1, limit = 10) => `/users?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Users', id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    searchUsers: builder.query({
      query: (searchTerm, page = 1, limit = 10) =>
        `/users/search?query=${searchTerm}&page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Users', id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updatedUser }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: updatedUser,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'Users', id: userId },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useSearchUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLoginMutation,
} = userApiSlice;

export default userApiSlice;
