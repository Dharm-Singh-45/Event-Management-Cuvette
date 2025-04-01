import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../apiConfig";

export const eventApi = createApi({
  reducerPath: "eventApi",
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
    createEvent: builder.mutation({
      query: (eventData) => {
        const token = localStorage.getItem("token");
        return {
          url: "/create-event",
          method: "POST",
          body: eventData,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    // Fetch Events
    getEvents: builder.query({
      query: () => ({
        url: "/get-all-events",
        method: "GET",
      }),
    }),
    // Fetch event by ID
    getEventById: builder.query({
      query: (eventId) => ({
        url: `/get-event/${eventId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),

        //  **New Update Event Mutation**
        updateEvent: builder.mutation({
          query: ({ eventId, updatedData }) => ({
            url: `/update-event/${eventId}`,
            method: "PUT",
            body: updatedData,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        }),
    // Delete Event
    deleteEvent: builder.mutation({
      query: (eventId) => ({
        url: `/delete-event/${eventId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    // enable - disable events
    toggleEventStatus: builder.mutation({
      query: (eventId) => ({
        url: `/toggle-event/${eventId}/toggle`,
        method: "PUT",
      }),
    }),
     // 🔹 Fetch Unavailable Slots for a Specific User
     getUnavailableSlots: builder.query({
      query: (userId) => ({
        url: `/unavailable-slots/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
    // Save Unavailable Slots
    saveUnavailableSlots: builder.mutation({
      query: (unavailableData) => ({
        url: "/unavailable-slots",
        method: "POST",
        body: unavailableData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),

     // Delete Unavailable Slots
     deleteUnavailableSlot: builder.mutation({
      query: ({ userId, day, slotId }) => ({
        url: `/unavailable-slots/${userId}/${day}/${slotId}`, // Correct URL
        method: "DELETE",
      }),
      invalidatesTags: ["UnavailableSlots"], // Refresh UI after deletion
    }),
    

  }),
});

export const {
  useCreateEventMutation,
  useGetEventsQuery,
  useGetEventByIdQuery,
  useDeleteEventMutation,
  useSaveUnavailableSlotsMutation,
  useToggleEventStatusMutation,
  useUpdateEventMutation,
  useGetUnavailableSlotsQuery,
  useDeleteUnavailableSlotMutation 
} = eventApi;
