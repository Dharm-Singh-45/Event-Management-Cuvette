import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { useUpdateBookingStatusMutation } from "../../redux/bookingApi";
import "./BookingCard.css";
import { calculateEndTime } from "../../helper/calculateDateAndTime";
import { formatStartTime } from "../../helper/formatSartTime";
import BookingStatusCard from "./BookingStatusCard";
import Participant from "./Participant";

const BookingCard = ({
  _id,
  date,
  time,
  meetingTitle,
  description,
  status,
  emails,
  durationHours,
  durationMinutes,
  activeTab,
  refetch,
}) => {
  const [updateStatus] = useUpdateBookingStatusMutation();
  const [newStatus, setNewStatus] = useState(status);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const endTime = calculateEndTime(time, durationHours, durationMinutes);

  const handleStatusChange = async (updatedStatus) => {
    setNewStatus(updatedStatus);
    setIsDropdownOpen(false);
    await updateStatus({ eventId: _id, status: updatedStatus });
    refetch();
  };

  const statusMapping = {
    pending: "Pending",
    accepted: "Accepted",
    cancelled: "Rejected",
  };

  const displayStatus = statusMapping[newStatus] || newStatus;

  return (
    <div className="booking-card">
      <div className="booking-date-time">
        <span className="booking-date">
          {date ? new Date(date).toDateString() : "N/A"}
        </span>
        <span className="booking-time">
          {time
            ? `${formatStartTime(time)} - ${endTime}`
            : "Time not available"}
        </span>
      </div>

      <div className="booking-details">
        <span className="booking-title">
          {meetingTitle || "No title available"}
        </span>
        <span className="booking-description">
          {description || "No description provided"}
        </span>
      </div>

      {/* Status Button - Opens Modal Only When Active Tab is "Pending" */}
      <div className="status-section">
        <button
          onClick={() => {
            if (activeTab === "Pending") {
              setIsModalOpen((prev) => !prev);
            }
          }}
          className={`status-badge ${newStatus}`}
        >
          {displayStatus}
        </button>
      </div>
      {activeTab !== "cancelled" && (
        <div
          className="people-count"
          onClick={() => setIsEmailModalOpen((prev) => !prev)}
        >
          <FaUsers />
          {emails.length !== undefined
            ? `${emails.length} people`
            : "No count available"}
        </div>
      )}
      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <BookingStatusCard
              onStatusChange={handleStatusChange}
              emails={emails}
            />
          </div>
        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsEmailModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Participant emails={emails} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;
