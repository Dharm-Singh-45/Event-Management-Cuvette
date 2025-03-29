export const calculateEndTime = (time, durationHours, durationMinutes) => {
  let [hours, minutes] = time.split(":").map(Number);

  // Add duration hours and minutes
  hours += parseInt(durationHours);
  minutes += parseInt(durationMinutes);

  // Handle minute overflow
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  // Handle hours overflow in 24-hour format
  hours = hours % 24;

  // Convert to 12-hour format
  let period = hours >= 12 ? "PM" : "AM";
  let displayHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};
