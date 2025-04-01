import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import "./Dashboard.css";
import Logo from "../../assets/logo.png";
import Aside from "../../components/Dashboard/Aside.jsx";
import Events from "../../assets/event.png";
import Booking from "../../assets/booking.png";
import Time from "../../assets/time.png";
import Settings from "../../assets/setting.png";
import Create from "../../assets/create.png";
import Avatar from "../../assets/Avatar.png";
import SignOut from "../../assets/logout.png";

import { useGetUserDetailsQuery } from "../../redux/userApi.js";
import { useGetEventsQuery, useGetUnavailableSlotsQuery } from "../../redux/eventApi.js";
import { useGetBookingsQuery } from "../../redux/bookingApi.js";

const asideItems = [
  { img: Events, title: "Events", path: "/dashboard/events" },
  { img: Booking, title: "Booking", path: "/dashboard/booking" },
  { img: Time, title: "Availablity", path: "/dashboard/availability" },
  { img: Settings, title: "Settings", path: "/dashboard/settings" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname);


  const { data: userData, isLoading } = useGetUserDetailsQuery();

  const userId = userData?._id; 
  const { refetch: refetchEvents } = useGetEventsQuery(undefined, { skip: !userId }); 
  const { refetch: refetchBookings } = useGetBookingsQuery(undefined, { skip: !userId }); 
  const { refetch: refetchAvailability } = useGetUnavailableSlotsQuery(userId, { skip: !userId });

  const username = userData?.username

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("selectedCategory");
    navigate("/login"); 
  };

  useEffect(() => {
    if (!userId) return;
    if (activeTab === "/dashboard/events") {
      refetchEvents();
    } else if (activeTab === "/dashboard/booking") {
      refetchBookings();
    } else if (activeTab === "/dashboard/availability") {
      refetchAvailability();
    }
  }, [activeTab, refetchEvents, refetchBookings, refetchAvailability]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-left">
        <div className="logo">
          <img src={Logo} alt="logo" />
          <p>CNNCT</p>
        </div>

        {asideItems.map((item, index) => (
          <div key={index} onClick={() =>{setActiveTab(item.path); navigate(item.path)}}>
            <Aside aside={item} isActive={location.pathname === item.path} />
          </div>
        ))}

        <button className="create-btn" onClick={() => navigate("/dashboard/create")}>
          <img src={Create} alt="Create" />
          <span>Create</span>
        </button>

        <div className="profile" onClick={() => setShowLogout(!showLogout)}>
          <img src={Avatar} alt="Avatar" />
          <span>{isLoading ? "Loading..." : username}</span>
          {showLogout && (
            <div className="logout-dropdown" onClick={handleLogout}>
              <img src={SignOut} alt="Logout" />
              <span>Sign out</span>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-right">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
