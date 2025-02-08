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
    default: null,  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payments",
    default: null,
  },
  floor: {
    type: String, // changed to String to accommodate floor like '1st' or 'Ground'
    default: null,
  },
  number: {
    type: String, // changed to String for consistency in addressing
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
    type: String,  // changed from Number to String for consistency
    default: null,
  },
  name: {
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
    type: Number,  // Ensuring consistency in number type
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
