import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // ✅ Add Bearer prefix
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserDetails: builder.query({
      query: () => ({
        url: "/user-profile",
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: (userData) => {
        const token = localStorage.getItem("token"); 
        return {
          url: "/update-profile",
          method: "PUT",
          body: userData,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    updatePreferences: builder.mutation({
      query: ({ userId, username, selectedCategory }) => ({
        url: `/users/${userId}/preferences`,
        method: "PUT",
        body: { username, selectedCategory },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { useGetUserDetailsQuery, useUpdateProfileMutation,useUpdatePreferencesMutation  } = userApi;
