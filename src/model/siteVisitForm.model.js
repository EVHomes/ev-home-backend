import mongoose from "mongoose";
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const siteVisitSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: Number, required: true, unique: true },
    countryCode: { type: Number, required: false, default: "+91" },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return emailFormat.test(value);
        },
        message: (props) => `${props.value} is not a valid email.`,
      },
    },
    residence: { type: String, required: true, default: null },
    projects: {
      type: String,
      required: true,
      default: "EV 9 Square",
      enum: ["EV 9 Square", "EV Heart City", "Marina Bay"],
    },
    choiceApt: {
      type: String,
      required: true,
      default: "2BHK",
      enum: ["1RK", "1BHK", "2BHK", "3BHK", "Jodi"],
    },
    source: {
      type: String,
      required: true,
      enum: ["Walk-in", "CP", "Reference"],
    },
    closingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    closingTeam:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    teamLeader: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    closingTeam: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees",
        required: true,
      },
    ],
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees",
        required: true,
      },
    ],
  }
  // {timestamps:true}
);

const siteVisitModel = mongoose.model(
  "siteVisits",
  siteVisitSchema,
  "siteVisits"
);
export default siteVisitModel;
