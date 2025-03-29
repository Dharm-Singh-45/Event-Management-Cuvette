import EventModel from "../../model/EventSchema.js";


import moment from "moment"; // Install moment.js if not already installed

export const createEvent = async (req, res) => {
  try {
    const {
      eventTopic,
      password,
      hostName,
      description,
      date,
      time,
      durationHours,
      durationMinutes,
      meetingTitle,
      backgroundColor,
      eventLink,
      emails,
    } = req.body;

    console.log("req.body",req.body)

    if (!eventTopic || !hostName || !date || !time || !meetingTitle) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Convert time and duration into a proper DateTime format
    const startDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
    const endDateTime = startDateTime
      .clone()
      .add(parseInt(durationHours, 10), "hours")
      .add(parseInt(durationMinutes, 10), "minutes");

    // Fetch all events for the same user on the same date
    const existingMeetings = await EventModel.find({
      createdBy: req.user._id,
      date: date, // Same date
    });

    console.log("existingmeeting",existingMeetings)
    // Check for overlapping meetings
    const isConflict = existingMeetings.some((event) => {
      const existingStart = moment(
        `${moment(event.date).format("YYYY-MM-DD")} ${event.time}`,
        "YYYY-MM-DD HH:mm"
      );
      const existingEnd = existingStart
        .clone()
        .add(parseInt(event.durationHours), "hours")
        .add(parseInt(event.durationMinutes), "minutes");
    
      console.log(`\nChecking Conflict with Event: ${event.meetingTitle}`);
      console.log(`Existing Event: ${existingStart.format("YYYY-MM-DD HH:mm")} to ${existingEnd.format("YYYY-MM-DD HH:mm")}`);
      console.log(`New Event: ${startDateTime.format("YYYY-MM-DD HH:mm")} to ${endDateTime.format("YYYY-MM-DD HH:mm")}`);
    
      const conflict = startDateTime.isBefore(existingEnd) && endDateTime.isAfter(existingStart);
    
      console.log(`Conflict Detected: ${conflict}`);
      return conflict;
    });
    
    

    if (isConflict) {
      return res.status(400).json({
        success: false,
        message: "You already have a meeting scheduled at the selected time.",
      });
    }

    // Save the new event
    const event = new EventModel({
      ...req.body,
      createdBy: req.user._id,
    });

    await event.save();
    res.status(201).json({ success: true, message: "Event created successfully", event });
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
      durationHours,
      durationMinutes,
      meetingTitle,
      backgroundColor,
      eventLink,
      emails,
    } = req.body;

    // Validate required fields
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

    // Find the existing event
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Convert time and duration to DateTime format
    const startDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
    const endDateTime = startDateTime
      .clone()
      .add(parseInt(durationHours), "hours")
      .add(parseInt(durationMinutes), "minutes");

    // Find existing meetings (excluding the current event)
    const existingMeetings = await EventModel.find({
      createdBy: req.user._id,
      date: date,
      _id: { $ne: req.params.id }, // Exclude the event being updated
    });

    // Conflict checking
    const isConflict = existingMeetings.some((event) => {
      const existingStart = moment(
        `${moment(event.date).format("YYYY-MM-DD")} ${event.time}`,
        "YYYY-MM-DD HH:mm"
      );
      const existingEnd = existingStart
        .clone()
        .add(parseInt(event.durationHours), "hours")
        .add(parseInt(event.durationMinutes), "minutes");

      console.log(`\nChecking Conflict with Event: ${event.meetingTitle}`);
      console.log(`Existing Event: ${existingStart.format("YYYY-MM-DD HH:mm")} to ${existingEnd.format("YYYY-MM-DD HH:mm")}`);
      console.log(`Updated Event: ${startDateTime.format("YYYY-MM-DD HH:mm")} to ${endDateTime.format("YYYY-MM-DD HH:mm")}`);

      return startDateTime.isBefore(existingEnd) && endDateTime.isAfter(existingStart);
    });

    if (isConflict) {
      return res.status(400).json({
        success: false,
        message: "The selected time conflicts with an existing meeting.",
      });
    }

    // Update event
    const updatedEvent = await EventModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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
