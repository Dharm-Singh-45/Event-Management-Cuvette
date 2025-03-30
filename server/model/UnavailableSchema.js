import mongoose from "mongoose";

const unavailableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  day: { type: String, required: true },
  date: { type: String, required: true },
 
  slots: [
    {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  ],
});

// Ensure that Mongoose enforces array structure
unavailableSchema.pre("save", function (next) {
  if (!Array.isArray(this.slots)) {
    this.slots = [];
  }
  this.slots = this.slots.map(slot => ({
    start: slot.start,
    end: slot.end,
  }));
  next();
});

const UnavailableModel = mongoose.model("Unavailable", unavailableSchema);
export default UnavailableModel;
