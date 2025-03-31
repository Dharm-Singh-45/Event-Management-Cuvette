import React, { useEffect, useState } from "react";
import "./EventCard.css";
import EditIcon from "../../assets/EditIcon.png";
import CopyIcon from "../../assets/copy.png";
import DeleteIcon from "../../assets/delete.png";
import { calculateEndTime } from "../../helper/calculateDateAndTime";
import { useDeleteEventMutation, useToggleEventStatusMutation } from "../../redux/eventApi";
import { formatStartTime } from "../../helper/formatSartTime";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EventCard = ({ event, refreshEvents }) => {
  const [isToggled, setIsToggled] = useState(false);
  const [deleteEvent] = useDeleteEventMutation();
  const [toggleEventStatus] = useToggleEventStatusMutation();

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/dashboard/update-events/${event._id}`); 
  };

  useEffect(() => {
    setIsToggled(event.enabled); // Ensure initial state is set
  }, [event.enabled]);

  const handleToggle = async () => {
    try {
      const response = await toggleEventStatus(event._id);
      if (response?.data?.success) {
        setIsToggled(response.data.enabled); // Update UI based on response
        refreshEvents(); // Refresh event list
      } else {
        toast.error("Failed to update event status.")
        
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Something went wrong.")
    }
  };
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await deleteEvent(event._id);
        if (response?.data?.success) {
          toast.success("Event deleted successfully!")
        
          refreshEvents();
        } else {
          toast.error("Failed to delete event.")

        }
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error("Something went wrong.")
      }
    }
  };

  const handleCopy = () => {
    if (event.eventLink) {
      navigator.clipboard
        .writeText(event.eventLink)
        .then(() => alert("Event link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err));
    } else {
      toast.error("No event link available to copy.")
    }
  };

  // Handle different date formats safely
  const eventDate = event.date?.$date?.$numberLong
    ? new Date(parseInt(event.date.$date.$numberLong))
    : new Date(event.date);

  return (
    <div className="eventCard-container">
      <div
        className="eventCard-top"
        style={{
          backgroundColor: isToggled && "#1877F2" ,
        }}
      ></div>
      <div className="eventCard-content">
        <div className="eventCard-info">
          <div className="eventCard-header">
            <h3>{event.eventTopic}</h3>
            <img src={EditIcon} alt="Edit" className="edit-icon" onClick={handleEdit} />
          </div>
          <span className="event-date">{eventDate.toDateString()}</span>
          <span className="event-time">
            {formatStartTime(event.time)} -{" "}
            {calculateEndTime(
              event.time,
              event.durationHours,
              event.durationMinutes
            )}
          </span>

          <span className="event-duration">
            {event.durationHours}h {event.durationMinutes}m Group Meeting
          </span>
        </div>
        <hr />
        <div className="eventCard-actions">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isToggled}
              onChange={handleToggle}
            />
            <span className="slider"></span>
          </label>
          <img
            src={CopyIcon}
            alt="Copy"
            className="action-icon"
            onClick={handleCopy}
            style={{ cursor: "pointer" }}
          />

          <img
            src={DeleteIcon}
            alt="Delete"
            className="action-icon"
            onClick={handleDelete}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
