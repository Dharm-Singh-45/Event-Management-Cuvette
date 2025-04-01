import React, { useState, useEffect } from "react";
import {
  useSaveUnavailableSlotsMutation,
  useGetUnavailableSlotsQuery,
  useDeleteUnavailableSlotMutation,
} from "../../redux/eventApi.js";
import { useGetUserDetailsQuery } from "../../redux/userApi.js";
import "./AvailablityCard.css";
import AddTime from "../../assets/add-time.png";
import Copy from "../../assets/copy.png";
import DeleteTime from "../../assets/exit-time.png";
import { toast } from "react-toastify";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AvailablityCard = () => {
  const [availability, setAvailability] = useState(
    daysOfWeek.map((day) => ({
      day,
      checked: day !== "Sun",
      slots: [{ start: "", end: "" }],
    }))
  );
  const [localChanges, setLocalChanges] = useState(false);

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

  const [saveUnavailableSlots, { isLoading: isSaving }] =
    useSaveUnavailableSlotsMutation();

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
      if (i === currentSlotIndex || !existingSlot.start || !existingSlot.end)
        return false;

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
    setLocalChanges(true);
  };

  const handleStartTimeChange = (index, slotIndex, value) => {
    const updatedAvailability = [...availability];
    const slot = updatedAvailability[index].slots[slotIndex];

    slot.start = value || "";
    setAvailability(updatedAvailability);
    setLocalChanges(true);
  };

  const handleEndTimeFocus = (index, slotIndex) => {
    const updatedAvailability = [...availability];
    const slot = updatedAvailability[index].slots[slotIndex];

    if (slot.start && !slot.end) {
      const defaultEnd = calculateDefaultEndTime(slot.start);
      const daySlots = updatedAvailability[index].slots;

      if (!checkTimeConflict(daySlots, slotIndex, slot.start, defaultEnd)) {
        slot.end = defaultEnd;
        setAvailability(updatedAvailability);
        setLocalChanges(true);
      }
    }
  };

  const handleEndTimeChange = (index, slotIndex, value) => {
    const updatedAvailability = [...availability];
    const slot = updatedAvailability[index].slots[slotIndex];
    const daySlots = updatedAvailability[index].slots;

    if (!slot.start) {
      toast.error("Please set start time first!");
      return;
    }

    if (value && value <= slot.start) {
      toast.error("End time must be after start time!");
      return;
    }

    slot.end = value || "";
    setAvailability(updatedAvailability);
    setLocalChanges(true);
  };

  const validateBeforeSave = () => {
    let isValid = true;

    availability.forEach((day, dayIndex) => {
      if (day.checked) {
        day.slots.forEach((slot, slotIndex) => {
          if (slot.start && !slot.end) {
            toast.error(`Please set end time for ${day.day}`);
            isValid = false;
          }
          if (!slot.start && slot.end) {
            toast.error(`Please set start time for ${day.day}`);
            isValid = false;
          }
          if (slot.start && slot.end && slot.end <= slot.start) {
            toast.error(`End time must be after start time for ${day.day}`);
            isValid = false;
          }

          // Check conflicts
          if (slot.start && slot.end) {
            const conflict = checkTimeConflict(
              day.slots,
              slotIndex,
              slot.start,
              slot.end
            );
            if (conflict) {
              toast.error(`Time conflict detected for ${day.day}`);
              isValid = false;
            }
          }
        });
      }
    });

    return isValid;
  };

  const handleSave = async () => {
    if (!validateBeforeSave()) {
      return;
    }

    try {
      const saveData = availability.map((day) => ({
        userId,
        day: day.day,
        slots: day.checked
          ? day.slots
              .filter((slot) => slot.start && slot.end)
              .map((slot) => ({
                startTime: slot.start,
                endTime: slot.end,
              }))
          : [{ startTime: "00:00", endTime: "23:59" }],
      }));

      await saveUnavailableSlots({ unavailableSlots: saveData }).unwrap();
      toast.success("Availability saved successfully!");
      setLocalChanges(false);
      // Instead of window.location.reload(), use refetch to get updated data
      await refetch();
    } catch (error) {
      toast.error("Failed to save availability");
      console.error("Save error:", error);
    }
  };

  const addSlot = (index) => {
    const updatedAvailability = [...availability];
    const lastSlot =
      updatedAvailability[index].slots[
        updatedAvailability[index].slots.length - 1
      ];

    if (!lastSlot.start || !lastSlot.end) {
      toast.error(
        "Please complete the current time slot before adding new one"
      );
      return;
    }
    updatedAvailability[index].slots.push({ start: "", end: "" });
    setAvailability(updatedAvailability);
    setLocalChanges(true);
  };

  const copySlot = (index) => {
    const updatedAvailability = [...availability];
    const lastSlot =
      updatedAvailability[index].slots[
        updatedAvailability[index].slots.length - 1
      ];

    if (!lastSlot.start || !lastSlot.end) {
      toast.error("Please complete the current time slot before copying");
      return;
    }

    updatedAvailability[index].slots.push({ ...lastSlot });
    setAvailability(updatedAvailability);
    setLocalChanges(true);
  };

  const removeSlot = async (index, slotIndex) => {
    const updatedAvailability = [...availability];
    const selectedDay = updatedAvailability[index];

    if (selectedDay.slots.length > 0) {
      const slotToDelete = selectedDay.slots[slotIndex];

      if (slotToDelete._id) {
        try {
          await deleteUnavailableSlot({
            userId,
            day: selectedDay.day,
            slotId: slotToDelete._id,
          }).unwrap();
          toast.success("Slot deleted successfully.");
          await refetch(); // Refresh data after deletion
        } catch (error) {
          console.error("Error deleting slot:", error);
          toast.error("Error deleting slot");
          return;
        }
      }

      selectedDay.slots.splice(slotIndex, 1);

      if (selectedDay.slots.length === 0) {
        selectedDay.slots.push({ start: "", end: "" });
      }

      setAvailability(updatedAvailability);
      setLocalChanges(true);
    }
  };

  useEffect(() => {
    if (!unavailableSlots?.unavailableSlots) return;

    const unavailableDaysMap = unavailableSlots.unavailableSlots.reduce(
      (acc, slotData) => {
        const isFullDayUnavailable = slotData.slots.some(
          (slot) => slot.start === "00:00" && slot.end === "23:59"
        );

        acc[slotData.day] = {
          checked: !isFullDayUnavailable,
          slots: isFullDayUnavailable
            ? []
            : slotData.slots.map((slot) => ({
                start:
                  slot.start === "00:00" && slot.end === "23:59"
                    ? ""
                    : slot.start,
                end:
                  slot.start === "00:00" && slot.end === "23:59"
                    ? ""
                    : slot.end,
                _id: slot._id,
              })),
        };
        return acc;
      },
      {}
    );

    const updatedAvailability = daysOfWeek.map((day) => ({
      day,
      checked: unavailableDaysMap[day]?.checked ?? day !== "Sun",
      slots:
        unavailableDaysMap[day]?.slots?.length > 0
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
                        onChange={(e) =>
                          handleStartTimeChange(
                            index,
                            slotIndex,
                            e.target.value
                          )
                        }
                        required
                      />
                      <input
                        type="time"
                        value={slot.end || ""}
                        onChange={(e) =>
                          handleEndTimeChange(index, slotIndex, e.target.value)
                        }
                        onFocus={() => handleEndTimeFocus(index, slotIndex)}
                        max="23:59"
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
      <button
        className="save-btn"
        onClick={handleSave}
        disabled={!localChanges || isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default AvailablityCard;
