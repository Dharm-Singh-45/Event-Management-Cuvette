import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../apiConfig";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
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
