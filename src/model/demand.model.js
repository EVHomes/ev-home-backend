import mongoose from "mongoose";

export const demandSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true,
    default: null,
    ref: "ourProjects",
  },
  floor: {
    type: Number,
  },
  flatNo: {
    type: Number,
  },
  reminder: {
    date: { type: Date },
    dueDate: { type: Date },
    amount: { type: String },
    amountType: { type: String },
  },
});

const demandModel = mongoose.model("demand", demandSchema, "demand");
export default demandModel;
