import mongoose from "mongoose";

export const demandSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true,
    default: null,
    ref: "ourProjects",
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "postSaleLead",
    required: true,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payments",
    default: null,
  },
  floor: {
    type: Number,
    default: null,
  },
  number: {
    type: Number,
    default: null,
  },
  flatNo: {
    type: String,
    default: null,
  },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date, default: null, required: true },

  //before due date
  payableNetAmountBeforeDueDate: { type: Number, default: null },
  payableNetAmountAfterDueDate: { type: Number, default: null },

  //after due date
  payableGstAmountBeforeDueDate: { type: Number, default: null },
  payableGstAmountAfterDueDate: { type: Number, default: null },

  //after due date
  payablTotalAmountBeforeDueDate: { type: Number, default: null },
  payablTotalAmountAfterDueDate: { type: Number, default: null },

  subject: { type: String, default: null },
  body: { type: String, default: null },
  document: { type: String, default: null },

  ref: { type: String, default: null },
  refId: { type: String, default: null }, // for ref
  slab: { type: String, default: null },

  slabNumber: { type: Number, default: null },

  recievedNetAmount: { type: Number, default: null },
  recievedGstAmount: { type: Number, default: null },
  recievedTotalAmount: { type: Number, default: null },

  recievedNetAmountDate: { type: Date, default: null },
  recievedGstAmountDate: { type: Date, default: null },
  recievedTotalAmountDate: { type: Date, default: null },
});

const demandModel = mongoose.model("demands", demandSchema, "demands");
export default demandModel;
