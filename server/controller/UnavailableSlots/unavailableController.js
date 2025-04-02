import UnavailableModel from "../../model/UnavailableSchema.js";
import moment from "moment-timezone";


// Modified function to handle each slot individually
const getSlotDate = (day, slotTime) => {
  const today = moment().tz("Asia/Kolkata"); // Current date & time in IST
  const targetDayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day);
  
  if (targetDayIndex === -1) {
    throw new Error("Invalid day provided");
  }

  let slotDate = today.clone().day(targetDayIndex);
  const currentTime = today.format("HH:mm");

  // If today is the selected day
  if (targetDayIndex === today.day()) {
    if (slotTime <= currentTime) {
      // If the time has passed, move to next week's occurrence
      return slotDate.add(7, "days").format("YYYY-MM-DD");
    }
    // If the time is still in the future, use today's date
    return today.format("YYYY-MM-DD");
  }

  // If the selected day has already passed this week, move to next week's occurrence
  if (targetDayIndex < today.day()) {
    slotDate.add(7, "days");
  }

  return slotDate.format("YYYY-MM-DD");
};

export const saveUnavailableSlots = async (req, res) => {
  try {
    let { userId, unavailableSlots } = req.body;

    if (!userId && unavailableSlots.length > 0) {
      userId = unavailableSlots[0].userId;
    }

    if (!userId || !Array.isArray(unavailableSlots) || unavailableSlots.length === 0) {
      return res.status(400).json({ error: "Invalid input data. userId and unavailableSlots are required." });
    }

    // Process each slot individually with its correct date
    const processedSlots = unavailableSlots.flatMap(slotData => {
      return slotData.slots.map(slot => {
        const slotDate = getSlotDate(slotData.day, slot.startTime); 
        
        return {
          day: slotData.day,
          date: slotDate,
          start: slot.startTime,
          end: slot.endTime
        };
      });
    });

    // Group slots by day and date
    const groupedSlots = processedSlots.reduce((acc, { day, date, start, end }) => {
      const key = `${day}-${date}`;
      if (!acc[key]) {
        acc[key] = { day, date, slots: [] };
      }
      acc[key].slots.push({ start, end });
      return acc;
    }, {});

    const finalSlots = Object.values(groupedSlots);

    if (finalSlots.length === 0) {
      return res.status(400).json({ error: "No valid slots to save." });
    }

    const bulkOperations = finalSlots.map(({ day, date, slots }) => ({
      updateOne: {
        filter: { userId, day, date },
        update: { $set: { userId, day, date, slots } },
        upsert: true,
      },
    }));

    await UnavailableModel.bulkWrite(bulkOperations);

    res.status(200).json({ message: "Unavailable slots saved successfully" });

  } catch (error) {
    console.error("Error saving unavailable slots:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const getUnavailableSlots = async (req, res) => {
  try {
    const { userId } = req.params;


    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const unavailableSlots = await UnavailableModel.find({ userId });

    if (!unavailableSlots || unavailableSlots.length === 0) {
      return res.status(404).json({ message: "No unavailable slots found for this user" });
    }

    res.status(200).json({ unavailableSlots });
  } catch (error) {
    console.error("Error fetching unavailable slots:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const deleteUnavailbleSlot = async (req, res) => {
  try {
    const { userId, day, slotId } = req.params;

    // First find the document containing the slot
    const doc = await UnavailableModel.findOne({
      userId,
      day,
      "slots._id": slotId
    });

    if (!doc) {
      return res.status(404).json({ message: "Slot not found." });
    }

    // Remove the specific slot
    doc.slots = doc.slots.filter(slot => slot._id.toString() !== slotId);

    // If no slots remain, delete the entire document
    if (doc.slots.length === 0) {
      await UnavailableModel.deleteOne({ _id: doc._id });
    } else {
      await doc.save();
    }

    return res.status(200).json({ message: "Slot deleted successfully." });

  } catch (error) {
    console.error("Error deleting slot:", error);
    res.status(500).json({ message: "Server error" });
  }
}