import React, { useState } from "react";
import "./CreateNewEvent.css";
import AddEventDetails from "./AddEventDetails";
import { useNavigate } from "react-router-dom";

const CreateNewEvent = () => {
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };



  const handleDurationChange = (e) => {
    let { name, value } = e.target;

    // Convert value to number and check limits
    value = value.replace(/\D/g, ""); // Remove non-numeric characters
    if (name === "durationHours") {
      if (parseInt(value) > 24) value = "24";
    }
    if (name === "durationMinutes") {
      if (parseInt(value) >= 60) value = "59"; // Prevent minutes > 59
    }

    setEventData({ ...eventData, [name]: value });
  };

  return (
    <div className="create-event-container">
      <div className="create-events-heading">
        <h2>Create Event</h2>
        <span>Create events to share for people to book on your calendar.</span>
      </div>

      <div className="create-container">
        <h3 className="add-event">Add Event</h3>
        <hr />
        {showEventDetails ? (
          <AddEventDetails
            eventData={eventData}
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
                placeholder="Set a conference topic before it starts"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={eventData.password}
                onChange={handleChange}
                placeholder="Password"
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
                  placeholder="HH"
                />
                <span>:</span>
                <input
                  type="text"
                  name="durationMinutes"
                  className="small-input"
                  value={eventData.durationMinutes}
                  onChange={handleDurationChange}
                  maxLength="2"
                  placeholder="MM"
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

export default CreateNewEvent;
