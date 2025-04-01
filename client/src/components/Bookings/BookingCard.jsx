import React, { useRef } from "react";
import { FaUsers } from "react-icons/fa";
import { useUpdateBookingStatusMutation } from "../../redux/bookingApi.js";
import "./BookingCard.css";
import { calculateEndTime } from "../../helper/calculateDateAndTime.js";
import { formatStartTime } from "../../helper/formatSartTime.js";
import BookingStatusCard from "./BookingStatusCard.jsx";
import Participant from "./Participant.jsx";

const BookingCard = ({
  _id,
  date,
  time,
  meetingTitle,
  eventTopic,
  description,
  status,
  emails,
  durationHours,
  durationMinutes,
  activeTab,
  refetch,
  openModal,
  setOpenModal, // Receive global state
}) => {
  const [updateStatus] = useUpdateBookingStatusMutation();
  const statusButtonRef = useRef(null);
  const peopleButtonRef = useRef(null);

  const endTime = calculateEndTime(time, durationHours, durationMinutes);

  const handleStatusChange = async (updatedStatus) => {
    await updateStatus({ eventId: _id, status: updatedStatus });
    setOpenModal(null);
    refetch();
  };

  const statusMapping = {
    pending: "Pending",
    accepted: "Accepted",
    cancelled: "Rejected",
  };

  const displayStatus = statusMapping[status] || status;

  const getModalPosition = (buttonRef) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return { top: rect.bottom + 5, left: rect.left };
    }
    return { top: "30%", left: "auto" };
  };

  return (
    <div className="booking-card">
      <div className="booking-date-time">
        <span className="booking-date">
          {date ? new Date(date).toDateString() : "N/A"}
        </span>
        <span className="booking-time">
          {time ? `${formatStartTime(time)} - ${endTime}` : "Time not available"}
        </span>
      </div>

      <div className="booking-details">
        <span className="booking-title">{eventTopic || "No Topic available"}</span>
        <span className="booking-description">{description || "No description provided"}</span>
      </div>

      {/* Status Button - Opens Modal Only When Active Tab is "Pending" */}
      <div className="status-section">
        <button
          ref={statusButtonRef}
          onClick={() => {
            if (activeTab === "Pending") {
              setOpenModal(openModal === `status-${_id}` ? null : `status-${_id}`);
            }
          }}
          className={`status-badge ${status}`}
        >
          {displayStatus}
        </button>
      </div>

      {activeTab !== "cancelled" && (
        <div
          ref={peopleButtonRef}
          className="people-count"
          onClick={() => {
            setOpenModal(openModal === `email-${_id}` ? null : `email-${_id}`);
          }}
        >
          <FaUsers />
          {emails.length !== undefined ? `${emails.length} people` : "No count available"}
        </div>
      )}

      {/* Booking Status Modal */}
      {openModal === `status-${_id}` && (
        <div
          className="modal-overlay"
          onClick={() => setOpenModal(null)}
          style={{ top: `${getModalPosition(statusButtonRef).top}px`, right: "5%" }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <BookingStatusCard onStatusChange={handleStatusChange} emails={emails} />
          </div>
        </div>
      )}

      {/* Email Participants Modal */}
      {openModal === `email-${_id}` && (
        <div
          className="modal-overlay"
          onClick={() => setOpenModal(null)}
          style={{ top: `${getModalPosition(peopleButtonRef).top}px`, right: "5%" }}
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
