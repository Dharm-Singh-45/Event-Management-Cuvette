import EventModel from "../../model/EventSchema.js";
import UserModel from '../../model/userSchema.js';

export const getBookingController = async (req, res) => {
  try {
    // Find events where the logged-in user's email is in the `emails` array
    // and the event is NOT created by the logged-in user
    const bookings = await EventModel.find({
      "emails.email": req.user.email,
      createdBy: { $ne: req.user._id }
    });

    // Process each booking to include firstName and lastName where applicable
    const bookingsWithUserNames = await Promise.all(
      bookings.map(async (booking) => {
        // Fetch creator details
        const creator = await UserModel.findById(booking.createdBy);

        // Map through emails array and fetch user details
        const updatedEmails = await Promise.all(
          booking.emails.map(async (emailEntry) => {
            // Find user by email
            const user = await UserModel.findOne({ email: emailEntry.email });

            // If user exists, add firstName and lastName, otherwise leave them as empty strings
            return {
              email: emailEntry.email,
              firstName: user ? user.firstName : "",
              lastName: user ? user.lastName : "",
              status: emailEntry.status
            };
          })
        );

        // Add event creator's email to the emails array if not already present
        if (creator) {
          const creatorEmailExists = updatedEmails.some(
            (emailEntry) => emailEntry.email === creator.email
          );

          if (!creatorEmailExists) {
            updatedEmails.push({
              email: creator.email,
              firstName: creator.firstName || "",
              lastName: creator.lastName || "",
              status: "host", 
            });
          }
        }

        // Return the updated booking with modified email data
        return { ...booking.toObject(), emails: updatedEmails };
      })
    );

    res.status(200).json({ success: true, bookings: bookingsWithUserNames });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateBookingStatus = async (req, res) => {
  try {
    const { eventId, status } = req.body;
    const userEmail = req.user.email;

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

