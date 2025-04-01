import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useGetEventsQuery } from "../../redux/eventApi.js";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarView.css";
import { calculateEndTime } from "../../helper/calculateDateAndTime.js";

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const { data, isLoading, error } = useGetEventsQuery();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (data?.events) {
      const transformedEvents = data.events.map((event) => {
        // Construct start time using event date, time, and period
        const startTime = moment(event.date)
          .set({
            hour: parseInt(event.time.split(":")[0]) + (event.period === "PM" && event.time.split(":")[0] !== "12" ? 12 : 0),
            minute: parseInt(event.time.split(":")[1]),
          })
          .toDate();

        // Calculate end time
        const endTimeStr = calculateEndTime(event.time, event.durationHours, event.durationMinutes);
        const endTime = moment(event.date)
          .set({
            hour: parseInt(endTimeStr.split(":")[0]) + (endTimeStr.includes("PM") ? 12 : 0),
            minute: parseInt(endTimeStr.split(":")[1]),
          })
          .toDate();

        return {
          title: event.eventTopic,
          start: startTime,
          end: endTime,
        };
      });

      setEvents(transformedEvents);
    }
  }, [data]);

  if (isLoading) return <p>Loading calendar events...</p>;
  if (error) return <p>Error fetching events. Please try again.</p>;

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={["day", "week", "month"]}
        className="custom-calendar"
      />
    </div>
  );
};

export default CalendarView;
