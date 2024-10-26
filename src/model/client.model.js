import mongoose from "mongoose";
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true, default: null },
  lastName: { type: String, required: true, default: null },
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
  gender: {
    type: String,
    required: true,
    default: "male",
    enum: ["male", "female", "other"],
  },
  isVerifiedPhone: { type: Boolean, default: false },
  isVerifiedEmail: { type: Boolean, default: false },
  phoneNumber: { type: Number, required: true, unique: true },
  countryCode: { type: Number, default: "+91" },
  altPhoneNumber: { type: Number, required: false },
  address: { type: String, required: false, default: null },
  password: { type: String, required: true, minlength: 6 },
  projects: [
    {
      type: String,
      required: true,
      default: null,
      // enum: ["EV 9 Square", "EV Heart City", "Marina Bay"],
    },
  ],
  closingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employees",
    required: true,
    default: null,
  },
  choiceApt: [
    {
      type: String,
      required: true,
      default: null,
      // enum: ["1RK", "1BHK", "2BHK", "3BHK", "Jodi"],
    },
  ],
  role: {
    type: String,
    // required: true,
    default: "customer",
    enum: ["employee", "channel-partner", "customer"],
  },
});

const clientModel = mongoose.model("clients", clientSchema, "clients");
export default clientModel;
