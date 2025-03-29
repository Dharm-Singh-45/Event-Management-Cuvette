import EventModel from "../../model/EventSchema.js";

export const getBookingController = async (req, res) => {
  try {
    const bookings = await EventModel.find({
      "emails.email": req.user.email,  // Check inside the `emails` array where `email` matches
      createdBy: { $ne: req.user._id } // Ensure the event was not created by the current user
    });

    res.status(200).json({ success: true, bookings: bookings || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { eventId, status } = req.body;
    const userEmail = req.user.email; // Get logged-in user's email from authentication

    // Validate the status
    if (!["pending", "accepted", "cancelled"].includes(status.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Find the attendee with the logged-in user's email
    const attendee = event.emails.find((emailObj) => emailObj.email === userEmail);
    if (!attendee) {
      return res.status(404).json({ success: false, message: "Booking not found for this user" });
    }

    // Update the status
    attendee.status = status.toLowerCase();
    await event.save();

    res.status(200).json({ success: true, message: "Booking status updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

