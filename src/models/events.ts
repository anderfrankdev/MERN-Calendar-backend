import { Schema, model } from "mongoose";
import { Event } from "../types/mutations.js";

const EventSchema = new Schema<Event>({
  title: {
    type: String,
    required: [true, "The title is obligatory"],
  },
  start: {
    type: String,
    required: [true, "The start date is obligatory"],
  },
  end: {
    type: String,
    required: [true, "The end date is obligatory"],
    unique: false,
  },
  notes: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId as any,
    required: [true, "The user is obligatory"],
    ref: "User",
  },
});

EventSchema.methods.toJSON = function () {
  const { __v, _id, password, ...user } = this.toObject();
  user.id = _id;
  return user;
};

const Event = model<Event>("Event", EventSchema);
export default Event;
