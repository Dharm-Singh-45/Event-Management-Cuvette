import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../apiConfig.js";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    signUpUser: builder.mutation({
        query: (userData) => ({
          url: "/signup", 
          method: "POST",
          body: userData,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      })
  }),
});

export const { useLoginUserMutation,useSignUpUserMutation} = authApi;
