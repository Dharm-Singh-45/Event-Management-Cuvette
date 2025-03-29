import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventTopic: { type: String, required: true },
  password: { type: String },
  hostName: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true }, 
  durationHours: { type: String, required: true },
  durationMinutes: { type: String, required: true },
  meetingTitle: { type: String, required: true },
  backgroundColor: { type: String, required: true },
  eventLink: { type: String },
  enabled: { type: Boolean, default: true },
  emails: { 
    type: [{ 
      email: { type: String, required: true }, 
      status: { type: String, enum: ["pending", "accepted", "cancelled"], default: "pending" } 
    }], 
    required: true,
    set: function(emails) {
      if (typeof emails === 'string') {
        return emails.split(',').map(email => ({ email: email.trim(), status: "pending" }));
      }
      if (Array.isArray(emails)) {
        return emails.map(email => 
          typeof email === 'string' ? { email: email.trim(), status: "pending" } : email
        );
      }
      return emails;
    }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const EventModel = mongoose.model("Event", eventSchema);
export default EventModel;
