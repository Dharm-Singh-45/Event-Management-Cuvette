import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
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
