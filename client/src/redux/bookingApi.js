import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get all bookings for the logged-in user (events where their email is included but not creator)
    getBookings: builder.query({
      query: () => ({
        url: "/get-bookings",
        method: "GET",
      }),
    }),
    
    updateBookingStatus: builder.mutation({
      query: ({ eventId, status }) => ({
        url: "/update-booking-status",
        method: "PUT",
        body: { eventId, status },
      }),
    }),
  }),
});

export const { 
  useGetBookingsQuery,useUpdateBookingStatusMutation 
} = bookingApi;