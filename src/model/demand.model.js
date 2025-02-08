import mongoose from "mongoose";

const demandSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true,
    ref: "ourProjects", // Reference to the ourProjects model
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
  date: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },

  // Address fields
  addressLine1: {
    type: String,
    default: null,
  },
  addressLine2: {
    type: String,
    default: null,
  },
  landmark: {
    type: String,
    default: null,
  },
  pincode: {
    type: String,
    default: null,
  },
  Name: {
    type: String,
    default: null,
  },
  // Additional name field
  additionalName: {
    type: String,
    default: null,
  },

  // Amounts before and after due date
  payableNetAmountBeforeDueDate: {
    type: Number,
    default: null,
  },
  payableNetAmountAfterDueDate: {
    type: Number,
    default: null,
  },
  payableGstAmountBeforeDueDate: {
    type: Number,
    default: null,
  },
  payableGstAmountAfterDueDate: {
    type: Number,
    default: null,
  },
  payableTotalAmountBeforeDueDate: {
    type: Number,
    default: null,
  },
  payableTotalAmountAfterDueDate: {
    type: Number,
    default: null,
  },

  subject: {
    type: String,
    default: null,
  },
  body: {
    type: String,
    default: null,
  },
  document: {
    type: String,
    default: null,
  },

  ref: {
    type: String,
    default: null,
  },
  refId: {
    type: String,
    default: null,
  },
  slab: {
    type: String,
    default: null,
  },
  slabNumber: {
    type: Number,
    default: null,
  },

  // Received amounts
  receivedNetAmount: {
    type: Number,
    default: null,
  },
  receivedGstAmount: {
    type: Number,
    default: null,
  },
  receivedTotalAmount: {
    type: Number,
    default: null,
  },

  // Dates for received amounts
  receivedNetAmountDate: {
    type: Date,
    default: null,
  },
  receivedGstAmountDate: {
    type: Date,
    default: null,
  },
  receivedTotalAmountDate: {
    type: Date,
    default: null,
  },
});

// Create the model
const Demand = mongoose.model("Demand", demandSchema, "demands");
export default Demand;

// import mongoose from "mongoose";

// export const demandSchema = new mongoose.Schema({
//   project: {
//     type: String,
//     required: true,
//     default: null,
//     ref: "ourProjects",
//   },
//   booking: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "postSaleLead",
//     required: true,
//   },
//   payment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "payments",
//     default: null,
//   },
//   floor: {
//     type: Number,
//     default: null,
//   },
//   number: {
//     type: Number,
//     default: null,
//   },
//   flatNo: {
//     type: String,
//     default: null,
//   },
//   date: { type: Date, default: Date.now },
//   dueDate: { type: Date, default: null, required: true },

//   //before due date
//   payableNetAmountBeforeDueDate: { type: Number, default: null },
//   payableNetAmountAfterDueDate: { type: Number, default: null },

//   //after due date
//   payableGstAmountBeforeDueDate: { type: Number, default: null },
//   payableGstAmountAfterDueDate: { type: Number, default: null },

//   //after due date
//   payablTotalAmountBeforeDueDate: { type: Number, default: null },
//   payablTotalAmountAfterDueDate: { type: Number, default: null },

//   subject: { type: String, default: null },
//   body: { type: String, default: null },
//   document: { type: String, default: null },

//   ref: { type: String, default: null },
//   refId: { type: String, default: null }, // for ref
//   slab: { type: String, default: null },

//   slabNumber: { type: Number, default: null },

//   recievedNetAmount: { type: Number, default: null },
//   recievedGstAmount: { type: Number, default: null },
//   recievedTotalAmount: { type: Number, default: null },

//   recievedNetAmountDate: { type: Date, default: null },
//   recievedGstAmountDate: { type: Date, default: null },
//   recievedTotalAmountDate: { type: Date, default: null },
// });

// const demandModel = mongoose.model("demands", demandSchema, "demands");
// export default demandModel;
