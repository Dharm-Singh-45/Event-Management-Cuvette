import React from "react";
import "./BookingStatusCard.css";
import Reject from "../../assets/reject.png";
import Accept from "../../assets/accept.png";

const BookingStatusCard = ({ emails, onStatusChange }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header Section */}
        <div className="card-header">
          <h3>
            Participants <span style={{ color: "#B6B6B6" }}>({emails.length})</span>
          </h3>
          <div className="action-buttons">
            <button
              className="reject-btn"
              onClick={() => onStatusChange("cancelled")}
            >
              <img src={Reject} alt="reject" />
              <span>Reject</span>
            </button>
            <button
              className="accept-btn"
              onClick={() => onStatusChange("accepted")}
            >
              <img src={Accept} alt="accept" />
              <span>Accept</span>
            </button>
          </div>
        </div>

        {/* Participants List */}
        <ul className="participants-list">
          {emails.map((emailObj, index) => (
            <li key={index} className="participant">
              <div className="participant-info">
                <div className="participant-circle"></div>
                <span style={{ color: "#808080" }}>{`${emailObj?.firstName}${emailObj?.lastName}` || emailObj?.email}</span>
                <input
                  type="checkbox"
                  checked={emailObj.status === "accepted"}
                  disabled={emailObj.status === "accepted"}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingStatusCard;
