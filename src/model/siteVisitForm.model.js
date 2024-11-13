import mongoose from "mongoose";
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const siteVisitSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, default: null },
    lastName: { type: String, required: true, default: null },
    verified: { type: Boolean, default: false },
    namePrefix: { type: String, default: "Mr" },
    gender: { type: String, default: "male" },
    phoneNumber: { type: Number, required: true, default: 0 },
    date: { type: Date, default: Date.now },
    countryCode: { type: String, default: "+91" },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return emailFormat.test(value);
        },
        message: (props) => `${props.value} is not a valid email.`,
      },
    },
    residence: { type: String, default: null },
    projects: [
      {
        type: String,
        required: true,
        default: null,
        // enum: ["EV 9 Square", "EV Heart City", "Marina Bay"],
      },
    ],
    choiceApt: [
      {
        type: String,
        required: true,
        default: null,
        // enum: ["1RK", "1BHK", "2BHK", "3BHK", "Jodi"],
      },
    ],
    source: {
      type: String,
      // required: true,
      default: null,
      // enum: ["Walk-in", "CP", "Reference"],
    },
    feedback: {
      type: String,
      // required: true,
      default: "",
      // enum: ["Walk-in", "CP", "Reference"],
    },
    closingManager: {
      type: String,
      ref: "employees",
      default: null,
    },
    attendedBy: {
      type: String,
      ref: "employees",
      default: null,
    },
    closingTeam: [
      {
        type: String,
        ref: "employees",
        default: null,
      },
    ],
    teamLeader: {
      type: String,
      ref: "employees",
      // required: true,
      default: null,
    },
    teamLeaderTeam: [
      {
        type: String,
        ref: "employees",
        default: null,
      },
    ],
    dataEntryBy: {
      type: String,
      ref: "employees",
      // required: true,
      default: null,
    },
  },
  { timestamps: true }
);

const siteVisitModel = mongoose.model("siteVisits", siteVisitSchema, "siteVisits");
export default siteVisitModel;
