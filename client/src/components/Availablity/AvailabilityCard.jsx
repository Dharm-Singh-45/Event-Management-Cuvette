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

  const { data: userDetails } = useGetUserDetailsQuery();
  const [deleteUnavailableSlot] = useDeleteUnavailableSlotMutation();
  const userId = userDetails?._id;

  console.log("userId", userId);

  // Fetch unavailable slots from API
  const {
    data: unavailableSlots,
    isLoading,
    isError,
  } = useGetUnavailableSlotsQuery(userId, {
    skip: !userId,
  });

  console.log("unavaiable slot :", unavailableSlots);

  const [saveUnavailableSlots] = useSaveUnavailableSlotsMutation();
  const [lastSavedHash, setLastSavedHash] = useState("");

  const getDataHash = (data) =>
    JSON.stringify(data.filter((day) => !day.checked)).replace(
      /[^a-zA-Z0-9]/g,
      ""
    );

    const handleCheck = (index) => {
      const updatedAvailability = [...availability];
      const isChecked = !updatedAvailability[index].checked;
    
      updatedAvailability[index].checked = isChecked;
    
      if (!isChecked) {
        // If unchecked, mark the whole day as unavailable (00:00 - 23:59)
        updatedAvailability[index].slots = [{ start: "00:00", end: "23:59" }];
      }
    
      setAvailability(updatedAvailability);
      triggerSave(updatedAvailability);
    };
    

    const handleTimeChange = (index, slotIndex, field, value) => {
      const updatedAvailability = [...availability];
      const slot = updatedAvailability[index].slots[slotIndex];
    
      if (field === "end") {
        // Prevent selecting end time if start time is empty
        if (!slot.start) {
          alert("Please select a start time before choosing an end time.");
          return;
        }
        // Ensure end time is not earlier than start time
        if (value <= slot.start) {
          alert("End time cannot be earlier than or equal to the start time!");
          return;
        }
      }
    
      if (field === "start") {
        // Check if the new start time overlaps with any existing slots for the same day
        const daySlots = updatedAvailability[index].slots;
        const isOverlap = daySlots.some((existingSlot, i) => {
          if (i !== slotIndex) {
            return value >= existingSlot.start && value < existingSlot.end;
          }
          return false;
        });
    
        if (isOverlap) {
          alert("This time slot overlaps with an existing one. Please choose another time.");
          return;
        }
      }
    
      slot[field] = value;
      setAvailability(updatedAvailability);
    };
    
    
    

  const addSlot = (index) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].slots.push({ start: "", end: "" });
    setAvailability(updatedAvailability);
  };

  const copySlot = (index) => {
    const updatedAvailability = [...availability];
    const lastSlot =
      updatedAvailability[index].slots[
        updatedAvailability[index].slots.length - 1
      ];
    updatedAvailability[index].slots.push(
      lastSlot ? { ...lastSlot } : { start: "", end: "" }
    );
    setAvailability(updatedAvailability);
  };

  // const removeSlot = (index, slotIndex) => {
  //   const updatedAvailability = [...availability];
  //   if (updatedAvailability[index].slots.length > 1) {
  //     updatedAvailability[index].slots.splice(slotIndex, 1);
  //     setAvailability(updatedAvailability);
  //   }
  // };

  const handleBlur = (index, slotIndex) => {
    const selectedDay = availability[index];
    const slot = selectedDay.slots[slotIndex];
    if (selectedDay.checked && slot.start && slot.end) {
      triggerSave(availability);
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
        ? day.slots.length > 0
          ? day.slots.map((slot) => ({
              startTime: slot.start || "", // Ensure slot exists
              endTime: slot.end || "",
            }))
          : [{ startTime: "", endTime: "" }] // Provide at least one empty slot
        : [{ startTime: "00:00", endTime: "23:59" }], // Full-day unavailable
    }));
  
    const currentHash = getDataHash(availabilityData);
  
    if (currentHash !== lastSavedHash) {
      try {
        console.log("Saving unavailable slots:", currentData);
        await saveUnavailableSlots({ unavailableSlots: currentData }).unwrap();
        setLastSavedHash(currentHash);
        console.log("Save successful");
      } catch (error) {
        console.error("Save failed:", error);
      }
    }
  };
  

  useEffect(() => {
    if (!unavailableSlots || !unavailableSlots.unavailableSlots || unavailableSlots.unavailableSlots.length === 0) return;
  
    console.log("Processed Unavailable Slot Data:", unavailableSlots.unavailableSlots);
  
    const unavailableDaysMap = unavailableSlots.unavailableSlots.reduce((acc, slotData) => {
      const isFullDayUnavailable = slotData.slots.some(
        (slot) => slot.start === "00:00" && slot.end === "23:59"
      );
  
      acc[slotData.day] = {
        checked: !isFullDayUnavailable, // Uncheck if it's fully unavailable
        slots: isFullDayUnavailable ? [] : slotData.slots.map((slot) => ({
          start: slot.start,
          end: slot.end,
          _id : slot._id
        })),
      };
      return acc;
    }, {});
  
    const updatedAvailability = daysOfWeek.map((day) => ({
      day,
      checked: unavailableDaysMap[day]?.checked ?? (day !== "Sun"), // Default: Sunday unchecked, others checked
      slots: unavailableDaysMap[day]?.slots ?? [{ start: "", end: "",_id: null }], // Default: Empty slot if no API data
    }));
  
    setAvailability(updatedAvailability);
  }, [unavailableSlots]);
  

  // remove unavilable slot 
  const removeSlot = async (index, slotIndex) => {
    const updatedAvailability = [...availability];
    const selectedDay = updatedAvailability[index];
  
    if (selectedDay.slots.length > 1) {
      const slotToDelete = selectedDay.slots[slotIndex];
  
      if (!slotToDelete._id) {
        console.error("Slot ID missing, cannot delete from DB", slotToDelete);
        alert("Error: Cannot delete this slot as it has no ID.");
        return;
      }
  
      try {
        console.log("Deleting slot with ID:", slotToDelete._id);
  
        await deleteUnavailableSlot({
          userId,
          day: selectedDay.day,
          slotId: slotToDelete._id, // ✅ Pass slot _id
        }).unwrap();
  
        selectedDay.slots.splice(slotIndex, 1);
        setAvailability(updatedAvailability);
      } catch (error) {
        console.error("Error deleting slot:", error);
        alert("Failed to delete slot. Please try again.");
      }
    }
  };
  
  

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
                        value={
                          availability[index]?.slots[slotIndex]?.start || ""
                        }
                        onChange={(e) =>
                          handleTimeChange(
                            index,
                            slotIndex,
                            "start",
                            e.target.value
                          )
                        }
                        onBlur={() => handleBlur(index, slotIndex)}
                      />
                      <input
                        type="time"
                        value={availability[index]?.slots[slotIndex]?.end || ""}
                        onChange={(e) =>
                          handleTimeChange(
                            index,
                            slotIndex,
                            "end",
                            e.target.value
                          )
                        }
                        onBlur={() => handleBlur(index, slotIndex)}
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
