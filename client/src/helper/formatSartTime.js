export const formatStartTime = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    let period = hours >= 12 ? "PM" : "AM";
  
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
  
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  