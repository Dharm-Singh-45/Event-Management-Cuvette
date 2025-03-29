import React, { useState, useEffect } from "react";
import {
  useSaveUnavailableSlotsMutation,
  useGetUnavailableSlotsQuery,
  useDeleteUnavailableSlotMutation,
} from "../../redux/eventApi";
import { useGetUserDetailsQuery } from "../../redux/userApi";
import "./AvailablityCard.css";
import AddTime from "../../assets/add-time.png";
import Copy from "../../assets/copy.png";
import DeleteTime from "../../assets/exit-time.png";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AvailablityCard = () => {
  const [availability, setAvailability] = useState(
    daysOfWeek.map((day) => ({
      day,
      checked: day !== "Sun",
      slots: [{ start: "", end: "" }],
    }))
  );
  const [isEditing, setIsEditing] = useState(false);

  const { data: userDetails } = useGetUserDetailsQuery();
  const [deleteUnavailableSlot] = useDeleteUnavailableSlotMutation();
  const userId = userDetails?._id;

  const {
    data: unavailableSlots,
    isLoading,
    isError,
    refetch,
  } = useGetUnavailableSlotsQuery(userId, {
    skip: !userId,
  });

  const [saveUnavailableSlots] = useSaveUnavailableSlotsMutation();
  const [lastSavedHash, setLastSavedHash] = useState("");

  const getDataHash = (data) => JSON.stringify(data).replace(/[^a-zA-Z0-9]/g, "");

  const calculateDefaultEndTime = (startTime) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes + 30, 0);
    return `${endTime.getHours().toString().padStart(2, "0")}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const checkTimeConflict = (daySlots, currentSlotIndex, newStart, newEnd) => {
    if (!newStart || !newEnd) return false;
    
    return daySlots.some((existingSlot, i) => {
      if (i === currentSlotIndex || !existingSlot.start || !existingSlot.end) return false;
      
      const existingStart = existingSlot.start;
      const existingEnd = existingSlot.end;
      
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  const handleCheck = (index) => {
    const updatedAvailability = [...availability];
    const isChecked = !updatedAvailability[index].checked;

    updatedAvailability[index].checked = isChecked;

    if (!isChecked) {
      updatedAvailability[index].slots = [{ start: "00:00", end: "23:59" }];
    } else {
      updatedAvailability[index].slots = [{ start: "", end: "" }];
    }

    setAvailability(updatedAvailability);
    triggerSave(updatedAvailability);
  };

  const handleStartTimeChange = (index, slotIndex, value) => {
    const updatedAvailability = [...availability];
    const slot = updatedAvailability[index].slots[slotIndex];
    
    slot.start = value || "";
    setIsEditing(true);
    setAvailability(updatedAvailability);
  };

  const handleEndTimeFocus = (index, slotIndex) => {
    const updatedAvailability = [...availability];
    const slot = updatedAvailability[index].slots[slotIndex];
    
    if (slot.start && !slot.end) {
      const defaultEnd = calculateDefaultEndTime(slot.start);
      const daySlots = updatedAvailability[index].slots;
      
      if (!checkTimeConflict(daySlots, slotIndex, slot.start, defaultEnd)) {
        slot.end = defaultEnd;
        setIsEditing(true);
        setAvailability(updatedAvailability);
      }
    }
  };

  const handleEndTimeChange = (index, slotIndex, value) => {
    const updatedAvailability = [...availability];
    const slot = updatedAvailability[index].slots[slotIndex];
    const daySlots = updatedAvailability[index].slots;

    if (!slot.start) {
      alert("Please set start time first!");
      return;
    }

    if (value && value <= slot.start) {
      alert("End time must be after start time!");
      return;
    }

    slot.end = value || "";
    setIsEditing(true);
    setAvailability(updatedAvailability);
  };

  const handleTimeBlur = (index, slotIndex) => {
    if (!isEditing) return;
    
    const updatedAvailability = [...availability];
    const slot = updatedAvailability[index].slots[slotIndex];
    const daySlots = updatedAvailability[index].slots;
    
    if (slot.start && slot.end) {
      const conflict = checkTimeConflict(daySlots, slotIndex, slot.start, slot.end);
      
      if (conflict) {
        alert("This time slot conflicts with an existing one. The slot has been reset.");
        // Reset the conflicted slot
        updatedAvailability[index].slots[slotIndex] = { start: "", end: "" };
        setAvailability(updatedAvailability);
        setIsEditing(false);
        return;
      }
      
      triggerSave(updatedAvailability);
    }
    
    setIsEditing(false);
  };

  const addSlot = (index) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].slots.push({ start: "", end: "" });
    setAvailability(updatedAvailability);
  };

  const copySlot = (index) => {
    const updatedAvailability = [...availability];
    const lastSlot = updatedAvailability[index].slots[updatedAvailability[index].slots.length - 1];
    
    if (!lastSlot.start || !lastSlot.end) {
      alert("Please complete the current time slot before copying");
      return;
    }
    
    updatedAvailability[index].slots.push({ ...lastSlot });
    setAvailability(updatedAvailability);
    // triggerSave(updatedAvailability);
  };

  const removeSlot = async (index, slotIndex) => {
    const updatedAvailability = [...availability];
    const selectedDay = updatedAvailability[index];

    if (selectedDay.slots.length > 1) {
      const slotToDelete = selectedDay.slots[slotIndex];

      if (slotToDelete._id) {
        try {
          await deleteUnavailableSlot({
            userId,
            day: selectedDay.day,
            slotId: slotToDelete._id,
          }).unwrap();
        } catch (error) {
          console.error("Error deleting slot:", error);
          return;
        }
      }

      selectedDay.slots.splice(slotIndex, 1);
      setAvailability(updatedAvailability);
      triggerSave(updatedAvailability);
    }
  };

  const triggerSave = async (availabilityData) => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    const currentData = availabilityData.map((day) => ({
      userId,
      day: day.day,
      slots: day.checked
        ? day.slots
            .filter(slot => slot.start && slot.end)
            .map(slot => ({
              startTime: slot.start,
              endTime: slot.end,
            }))
        : [{ startTime: "00:00", endTime: "23:59" }],
    }));

    const currentHash = getDataHash(currentData);

    if (currentHash !== lastSavedHash) {
      try {
        await saveUnavailableSlots({ unavailableSlots: currentData }).unwrap();
        setLastSavedHash(currentHash);
        refetch();
      } catch (error) {
        console.error("Save failed:", error);
      }
    }
  };

  useEffect(() => {
    if (!unavailableSlots?.unavailableSlots) return;

    const unavailableDaysMap = unavailableSlots.unavailableSlots.reduce((acc, slotData) => {
      const isFullDayUnavailable = slotData.slots.some(
        (slot) => slot.start === "00:00" && slot.end === "23:59"
      );

      acc[slotData.day] = {
        checked: !isFullDayUnavailable,
        slots: isFullDayUnavailable 
          ? [] 
          : slotData.slots.map((slot) => ({
              start: slot.start === "00:00" && slot.end === "23:59" ? "" : slot.start,
              end: slot.start === "00:00" && slot.end === "23:59" ? "" : slot.end,
              _id: slot._id
            })),
      };
      return acc;
    }, {});

    const updatedAvailability = daysOfWeek.map((day) => ({
      day,
      checked: unavailableDaysMap[day]?.checked ?? (day !== "Sun"),
      slots: unavailableDaysMap[day]?.slots?.length > 0 
        ? unavailableDaysMap[day].slots 
        : [{ start: "", end: "", _id: null }],
    }));

    setAvailability(updatedAvailability);
  }, [unavailableSlots]);

  return (
    <div className="availability-card">
      <div className="header">
        <div>
          <label>Activity</label>
          <select>
            <option>Event Type</option>
          </select>
        </div>
        <div>
          <label>Time Zone</label>
          <select>
            <option>Indian Standard Time</option>
          </select>
        </div>
      </div>

      <div className="week-container">
        {availability.map((day, index) => (
          <div key={day.day} className="day-row">
            <div className="day-header">
              <input
                type="checkbox"
                checked={day.checked}
                onChange={() => handleCheck(index)}
                style={{ accentColor: "#1877F2" }}
              />
              <span>{day.day}</span>
            </div>

            {day.checked ? (
              <>
                <div className="time-slot-container">
                  {day.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="time-slot">
                      <input
                        type="time"
                        value={slot.start || ""}
                        onChange={(e) => handleStartTimeChange(index, slotIndex, e.target.value)}
                        onBlur={() => handleTimeBlur(index, slotIndex)}
                        required
                      />
                      <input
                        type="time"
                        value={slot.end || ""}
                        onChange={(e) => handleEndTimeChange(index, slotIndex, e.target.value)}
                        onFocus={() => handleEndTimeFocus(index, slotIndex)}
                        onBlur={() => handleTimeBlur(index, slotIndex)}
                        required
                      />
                      <button onClick={() => removeSlot(index, slotIndex)}>
                        <img src={DeleteTime} alt="Delete Time" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="day-actions">
                  <button onClick={() => addSlot(index)}>
                    <img src={AddTime} alt="Add Time" />
                  </button>
                  <button onClick={() => copySlot(index)}>
                    <img src={Copy} alt="Copy Time" />
                  </button>
                </div>
              </>
            ) : (
              <span className="unavailable-text">Unavailable</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailablityCard;