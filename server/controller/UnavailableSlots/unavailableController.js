import UnavailableModel from "../../model/UnavailableSchema.js";

export const saveUnavailableSlots = async (req, res) => {
  try {
    let { userId, unavailableSlots } = req.body;

    if (!userId && unavailableSlots.length > 0) {
      userId = unavailableSlots[0].userId;
    }

    if (!userId || !Array.isArray(unavailableSlots) || unavailableSlots.length === 0) {
      return res.status(400).json({ error: "Invalid input data. userId and unavailableSlots are required." });
    }

    // Convert `startTime` & `endTime` to `start` & `end`
    const processedSlots = unavailableSlots.map(slotData => ({
      day: slotData.day,
      slots: slotData.slots.map(slot => ({
        start: slot.startTime, // Renaming startTime to start
        end: slot.endTime,     // Renaming endTime to end
      })),
    }));
    const bulkOperations = processedSlots.map(({ day, slots }) => ({
      updateOne: {
        filter: { userId, day },
        update: { $set: { slots } },
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

export const deleteUnavailbleSlot = async(req,res) =>{

  try {
    const { userId, day, slotId } = req.params;

    const result = await UnavailableModel.updateOne(
      { userId, day },
      { $pull: { slots: { _id: slotId } } } // Remove the slot with matching ID
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: "Slot deleted successfully." });
    } else {
      return res.status(404).json({ message: "Slot not found." });
    }
  } catch (error) {
    console.error("Error deleting slot:", error);
    res.status(500).json({ message: "Server error" });
  }
}