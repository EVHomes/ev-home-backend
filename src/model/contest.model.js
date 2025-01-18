import mongoose from "mongoose";

export const contestSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, default: null },
    phoneNumber: { type: Number, required: true, default: null },
    photoUrl: {
      type: [String],
      default: null,
    },
    thumbnail: { type: String, default: null },
    event: {
      type: String,
      ref: "event",
    },
  },
  { timestamps: true }
);

// Create the model
const contestModel = mongoose.model("Contest", contestSchema, "contests");
export default contestModel;
