import React, { useState } from "react";
import "./AvailablityPage.css";
import AvailablityIcon from '../../assets/availablity.png';
import CalenderIcon from '../../assets/calender.png';
import CalendarView from "../../components/Availablity/CalendarView.jsx";
import AvailabilityCard from "../../components/Availablity/AvailabilityCard.jsx";

const AvailablityPage = () => {
  const [selectedView, setSelectedView] = useState("availability");

  return (
    <div className="availablity-container">
      <div className="availablity-heading">
        <h2>Availability</h2>
        <span>Configure times when you are available for bookings.</span>
      </div>

      {/* Buttons for Availability and Calendar View */}
      <div className="view-buttons">
        <button
          className={selectedView === "availability" ? "active" : ""}
          onClick={() => setSelectedView("availability")}
        >
          <img src={AvailablityIcon} alt="Availability Icon" className="button-icon" />
          Availability
        </button>

        <button
          className={selectedView === "calendar" ? "active" : ""}
          onClick={() => setSelectedView("calendar")}
        >
          <img src={CalenderIcon} alt="Calendar Icon" className="button-icon" />
          Calendar View
        </button>
      </div>

   
      {selectedView === "availability" ? <AvailabilityCard /> : <CalendarView />}
    </div>
  );
};

export default AvailablityPage;
