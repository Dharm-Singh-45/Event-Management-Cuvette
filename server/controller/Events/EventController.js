import EventModel from "../../model/EventSchema.js";

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const {
      eventTopic,
      password,
      hostName,
      description,
      date,
      time,
      duration,
      meetingTitle,
      backgroundColor,
      eventLink,
      emails,
    } = req.body;

    if (!eventTopic || !hostName || !date || !time || !meetingTitle) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be provided",
        });
    }

    const event = new EventModel({
      ...req.body,
      createdBy: req.user._id, // Store logged-in user's ID
    });

    await event.save();
    res
      .status(201)
      .json({ success: true, message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await EventModel.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const {
      eventTopic,
      password,
      hostName,
      description,
      date,
      time,
      duration,
      meetingTitle,
      backgroundColor,
      eventLink,
      emails,
    } = req.body;

  

    // Check if all required fields are provided
    if (
      !eventTopic ||
      !hostName ||
      !date ||
      !time ||
      !meetingTitle ||
      !backgroundColor ||
      !eventLink ||
      !emails ||
      !Array.isArray(emails) ||
      emails.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Ensure event exists before updating
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Update event with new data
    const updatedEvent = await EventModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Ensure validators run on update
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const event = await EventModel.findByIdAndDelete(req.params.id);
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// event enable and disable

export const toggleEvent = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);

    if (!event) return res.status(404).json({ error: "Event not found" });

    event.enabled = !event.enabled;
    await event.save();

    res.json({ success: true, enabled: event.enabled });
  } catch (error) {
    res.status(500).json({ error: "Failed to update event status" });
  }
};

// get event by id 

export const getEventByID = async(req,res) =>{
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
