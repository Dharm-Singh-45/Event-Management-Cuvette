import React, { useEffect } from "react";
import "./EventsPage.css";
import EventCard from "../../components/EventsCard/EventCard.jsx";
import Create from "../../assets/create.png";
import { useGetEventsQuery } from "../../redux/eventApi.js";
import { useNavigate } from "react-router-dom";
import { useGetUserDetailsQuery } from "../../redux/userApi.js";

const EventsPage = () => {
  const { data, isLoading, error,refetch } = useGetEventsQuery();
  const {refetch:userDetailsRefetch} = useGetUserDetailsQuery()
  const navigate = useNavigate()

  useEffect(()=>{
    userDetailsRefetch()
  },[])

  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading events...</p>
      </div>
    );
  }
  if (error) return <p>Error loading events. Please try again later.</p>;

const openCreatePage = () =>{
  navigate('/dashboard/create')
}


  return (
    <div className="events-container">
      <div className="events-heading">
        <h2>Event Types</h2>
        <div>
          <span>Create events to share for people to book on your calendar.</span>
          <button  onClick={openCreatePage} className="event-container-btn">
            <img src={Create} alt="Create" />
            <span>Add New Event</span>
          </button>
        </div>
      </div>
      <div className="eventCard-wrapper">
        {data?.events?.map((event) => (
          <EventCard key={event._id} event={event} refreshEvents={refetch} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
