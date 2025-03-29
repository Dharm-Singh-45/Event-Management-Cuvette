import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import "../CreateNewEventPage/CreateNewEvent.css";
import { useGetEventByIdQuery } from "../../redux/eventApi";
import UpdateEventDetails from "./UpdateEventDetails";


const UpdateEvent = () => {
   const navigate = useNavigate();
  const { eventId } = useParams(); 
  const { data: event, isLoading } = useGetEventByIdQuery(eventId);

  const [showEventDetails, setShowEventDetails] = useState(false);
  const [eventData, setEventData] = useState({
    eventTopic: "",
    password: "",
    hostName: "",
    description: "",
    date: "",
    time: "00:00",
    timezone: "(UTC +5:30 Delhi)",
    durationHours: "1",
    durationMinutes: "00",
  });

  // Prefill data when event is loaded
  useEffect(() => {
    if (event) {
      setEventData({
        eventTopic: event.eventTopic || "",
        password: event.password || "",
        hostName: event.hostName || "",
        description: event.description || "",
        date: event.date ? event.date.split("T")[0] : "",
        time: event.time || "00:00",
        timezone: event.timezone || "(UTC +5:30 Delhi)",
        durationHours: event.durationHours?.toString() || "1",
        durationMinutes: event.durationMinutes?.toString() || "00",
      });
    }
  }, [event]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleDurationChange = (e) => {
    let { name, value } = e.target;
    value = value.replace(/\D/g, ""); // Remove non-numeric characters
    if (name === "durationHours" && parseInt(value) > 24) value = "24";
    if (name === "durationMinutes" && parseInt(value) >= 60) value = "59";

    setEventData({ ...eventData, [name]: value });
  };

  if (isLoading) return <p>Loading event details...</p>;

  return (
    <div className="create-event-container">
      <div className="create-events-heading">
        <h2>Update Event</h2>
        <span>Modify the event details as needed.</span>
      </div>

      <div className="create-container">
        <h3 className="add-event">Edit Event</h3>
        <hr />
        {showEventDetails ? (
          <UpdateEventDetails
          originalEvent={event}  
          eventData={eventData}  
          eventId ={eventId}  
          onBack={() => setShowEventDetails(false)}
        />
        ) : (
          <form>
            <div className="form-group">
              <label>Event Topic *</label>
              <input
                type="text"
                name="eventTopic"
                value={eventData.eventTopic}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={eventData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Host Name</label>
              <input
                type="text"
                name="hostName"
                value={eventData.hostName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <hr className="divider-secondary" />
            <div className="form-group">
              <label>Date and Time *</label>
              <div className="datetime-container">
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                />
                <input
                  type="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                />
                <select
                  name="timezone"
                  value={eventData.timezone}
                  onChange={handleChange}
                >
                  <option>(UTC +5:30 Delhi)</option>
                </select>
              </div>
            </div>

            <div className="form-group set-duration-group">
              <label>Set Duration</label>
              <div className="duration-container">
                <input
                  type="text"
                  name="durationHours"
                  className="small-input"
                  value={eventData.durationHours}
                  onChange={handleDurationChange}
                  maxLength="2"
                />
                <span>:</span>
                <input
                  type="text"
                  name="durationMinutes"
                  className="small-input"
                  value={eventData.durationMinutes}
                  onChange={handleDurationChange}
                  maxLength="2"
                />
              </div>
            </div>

            <div className="buttons">
            <button
                className="cancel"
                onClick={(e) => {
                  e.preventDefault(); // Prevent form submission
                  navigate("/dashboard/events", { replace: true });
                }}
              >
                Cancel
              </button>
              <button
                className="next"
                onClick={(e) => {
                  e.preventDefault();
                  setShowEventDetails(true);
                }}
              >
                Next
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateEvent;
