import React, {useState } from "react";
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
} from "../../redux/bookingApi";
import BookingCard from "../../components/Bookings/BookingCard";
import "./BookingPage.css";
import { toast } from "react-toastify";
import { useGetUserDetailsQuery } from "../../redux/userApi";

const BookingPage = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [openModal, setOpenModal] = useState(null);

  const { data, error, isLoading, refetch } = useGetBookingsQuery();

  const { data: userData } = useGetUserDetailsQuery();
  

  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const userEmail = userData?.email; 
 

  if (isLoading) return <p>Loading bookings...</p>;
  if (error) return <p>Error fetching bookings.</p>;

  // Extract the correct status dynamically
  const filteredBookings = data?.bookings
    ?.map((event) => {
      const userBooking = event.emails.find(
        (emailObj) => emailObj.email === userEmail
      );
      return userBooking ? { ...event, status: userBooking.status } : null;
    })
    .filter(Boolean); // Remove null values

  // Handle Status Update
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus({ bookingId, status: newStatus }).unwrap();
      toast.success("Status updated successfully!")
    
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };
 
  return (
    <div className="booking-container">
      <div className="booking-heading">
        <h2>Bookings</h2>
        <span>
          See upcoming and past events booked through your event type links.
        </span>
      </div>

      <div className="booking-details-container">
        {/* Tabs */}
        <div className="select-buttons">
          {["Upcoming", "Pending", "cancelled", "Past"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <hr />

        {/* Render Events Based on Active Tab */}
        {filteredBookings.length > 0 ? (
          filteredBookings
            .filter((event) => {
              const eventDate = new Date(event.date); // Convert ISO string to Date object
              const [hours, minutes] = event.time.split(":").map(Number); // Extract hours and minutes
              const eventDateTime = new Date(
                eventDate.setHours(hours, minutes, 0, 0)
              ); // Set hours & minutes

              const currentDateTime = new Date();
              if (activeTab === "Upcoming")
                return event.status === "accepted" && eventDateTime > currentDateTime;
              if (activeTab === "Pending")
                return event.status === "pending" && eventDateTime > currentDateTime;
              if (activeTab === "cancelled")
                return event.status === "cancelled";
              if (activeTab === "Past") return eventDateTime < currentDateTime;
              return false;
            })
            .map((event) => (
              <BookingCard
                key={event._id}
                {...event}
                onUpdateStatus={handleUpdateStatus}
                activeTab={activeTab}
                refetch={refetch}
                openModal={openModal}
                setOpenModal={setOpenModal}
              />
            ))
        ) : (
          <p>No bookings found for {activeTab}.</p>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
