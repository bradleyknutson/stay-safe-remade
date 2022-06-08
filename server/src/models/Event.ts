import mongoose from "mongoose";
const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    location: {
      type: String,
      required: true,
    },
    timeEstimate: {
      type: Number,
    },
    started: {
      type: Date,
      default: Date.now,
    },
    ended: {
      type: Date,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true,
  }
);

eventSchema.virtual("eventDuration").get(function () {
  if (!this.ended) return null;
  const durationInSeconds = (this.ended - this.started) / 1000;
  const durationInMinutes = Math.round(durationInSeconds / 60);
  return durationInMinutes;
});

const Event = model("Event", eventSchema);
export default Event;
