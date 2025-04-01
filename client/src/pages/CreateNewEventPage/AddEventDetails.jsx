import React, { useState } from "react";
import { useCreateEventMutation, useGetEventsQuery } from "../../redux/eventApi.js";
import "./AddEventDetails.css";
import Avatar from "../../assets/Avatar.png";
import EditIcon from "../../assets/EditPencil.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddEventDetails = ({ eventData, onBack }) => {
  const [selectedColor, setSelectedColor] = useState("#342B26");
  const [meetingTitle, setMeetingTitle] = useState("Team A Meeting-1");
  const [isEditing, setIsEditing] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    eventLink: "",
    emails: [],
  });
  const [currentEmail, setCurrentEmail] = useState("");

  const navigate = useNavigate();
  const { refetch } = useGetEventsQuery();
  const [createEvent, { isLoading, isError, isSuccess }] = useCreateEventMutation();

  const handleChange = (e) => {
    setEventDetails({ ...eventDetails, [e.target.name]: e.target.value });
  };

  const handleEmailKeyDown = (e) => {
    if (["Enter", "Tab", ","].includes(e.key)) {
      e.preventDefault();
      addEmail();
    }
  };

  const addEmail = () => {
    if (currentEmail && validateEmail(currentEmail)) {
      setEventDetails({
        ...eventDetails,
        emails: [...eventDetails.emails, currentEmail.trim()],
      });
      setCurrentEmail("");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const removeEmail = (index) => {
    const newEmails = [...eventDetails.emails];
    newEmails.splice(index, 1);
    setEventDetails({ ...eventDetails, emails: newEmails });
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);
    if (emails) {
      const newEmails = [...eventDetails.emails];
      emails.forEach((email) => {
        if (validateEmail(email) && !newEmails.includes(email)) {
          newEmails.push(email);
        }
      });
      setEventDetails({ ...eventDetails, emails: newEmails });
    }
  };

  const handleSubmit = async () => {
    if (!eventDetails.eventLink || eventDetails.emails.length === 0) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const finalEventData = {
      ...eventData,
      meetingTitle,
      backgroundColor: selectedColor,
      ...eventDetails,
      emails: eventDetails.emails.join(","), // Convert array to comma-separated string for API
    };

    try {
      await createEvent(finalEventData).unwrap();
      toast.success("Event created successfully!");
      refetch();
      navigate("/dashboard/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event!");
    }
  };

  return (
    <div className="banner-container">
      <div className="banner-section">
        <h2>Banner</h2>
        <div className="banner" style={{ backgroundColor: selectedColor }}>
          <div className="avatar-div">
            <img src={Avatar} alt="Avatar" className="avatar" />
          </div>

          {isEditing ? (
            <input
              type="text"
              value={meetingTitle}
              className="editable-input"
              style={{ color: selectedColor === "#ffffff" ? "black" : "black" }}
              onChange={(e) => setMeetingTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              autoFocus
            />
          ) : (
            <h2
              className="meeting-title"
              style={{ color: selectedColor === "#ffffff" ? "black" : "white" }}
            >
              {meetingTitle}
            </h2>
          )}

          <img
            src={EditIcon}
            alt="EditIcon"
            className="edit-icon"
            onClick={() => setIsEditing(true)}
          />
        </div>

        <label>Custom Background Color</label>
        <div className="color-picker">
          {["#EF6500", "#ffffff", "#000000"].map((color) => (
            <button
              key={color}
              className="color-btn"
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            ></button>
          ))}
        </div>

        <div className="selected-color-container">
          <div className="selected-color-box" style={{ backgroundColor: selectedColor }}></div>
          <input type="text" value={selectedColor} readOnly />
        </div>
      </div>

      <hr className="divider" />

      <div className="form-group">
        <label>Add link *</label>
        <input
        className="add-link"
          type="text"
          name="eventLink"
          value={eventDetails.eventLink}
          onChange={handleChange}
          placeholder="Enter URL Here"
          required
        />
      </div>

      <div className="form-group">
        <label>Add Emails *</label>
        <div className="email-input-container">
          <div className="email-tags">
            {eventDetails.emails.map((email, index) => (
              <div key={index} className="email-tag">
                {email}
                <button
                  type="button"
                  className="email-tag-remove"
                  onClick={() => removeEmail(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <input
            type="email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            onKeyDown={handleEmailKeyDown}
            onPaste={handlePaste}
            placeholder="Add member Emails (press Enter or Tab to add)"
          />
        </div>
      </div>

      <div className="buttons">
        <button className="back" onClick={onBack}>
          Back
        </button>
        <button className="save" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddEventDetails;