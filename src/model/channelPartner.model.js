import mongoose from "mongoose";
const dateOfBirthFormat = /^\d{4}-\d{2}-\d{2}$/;
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const channelPartnerSchema = new mongoose.Schema(
  {
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
    password: { type: String, required: true, minlength: 6 },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
      message: "Gender must be either male, female, or other.",
    },
    dateOfBirth: {
      type: String,
      required: true,
      default: "1999-01-01",
      validate: {
        validator: function (value) {
          // Check if the date matches the YYYY-MM-DD format
          return dateOfBirthFormat.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid date of birth. Use YYYY-MM-DD format.`,
      },
    },
    firmName: { type: String, required: true, default: null },
    homeAddress: { type: String, default: null },
    firmAddress: { type: String, default: null },
    countryCode: { type: String, default: "+91" },
    phoneNumber: { type: Number, required: true, default: null },
    haveReraRegistration: { type: Boolean, required: true, default: false },
    reraNumber: { type: String, default: null },
    reraCertificate: { type: String, default: null },
    isVerified: { type: Boolean, required: true, default: false },
    sameAdress: { type: Boolean, required: true, default: false },
    refreshToken: { type: String, default: null },
    role: {
      type: String,
      required: true,
      default: "channel-partner",
      enum: ["employee", "channel-partner", "customer"],
    },
  },
  { timestamps: true }
);

const cpModel = mongoose.model(
  "channelPartners",
  channelPartnerSchema,
  "channelPartners"
);
export default cpModel;
