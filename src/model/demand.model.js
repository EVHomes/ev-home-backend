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
    default: null,
  },
  flatNo: {
    type: Number,
    default: null,
  },
  reminders: [
    {
      customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
        required: true,
      },
      date: { type: Date, default: Date.now },

      dueDate: { type: Date, default: null, required: true },

      //before due date
      payableNetAmountBeforeDueDate: { type: Number, default: null },
      payableNetAmountAfterDueDate: { type: Number, default: null },
      //after due date
      payableGstAmountBeforeDueDate: { type: Number, default: null },
      payableGstAmountAfterDueDate: { type: Number, default: null },

      subject: { type: String, default: null },

      refId: { type: String, default: null },
      ref: { type: String, default: null },

      body: { type: String, default: null },
      slab: { type: String, default: null },
      slabAmount: { type: String, default: null },
      document: { type: String, default: null },

      recievedNetAmount: { type: Number, default: null },
      recievedGstAmount: { type: Number, default: null },

      recievedNetAmountDate: { type: Date, default: null },
      recievedGstAmountDate: { type: Date, default: null },

      businessAccount: {
        accountNo: { type: String, default: null },
        ifsc: { type: String, default: null },
        micr: { type: String, default: null },
        bankName: { type: String, default: null },
      },

      govAccount: {
        accountNo: { type: String, default: null },
        ifsc: { type: String, default: null },
        micr: { type: String, default: null },
        bankName: { type: String, default: null },
      },
    },
  ],
});

const demandModel = mongoose.model("demands", demandSchema, "demands");
export default demandModel;
