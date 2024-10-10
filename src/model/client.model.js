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
    default: "Male",
    enum: ["Male", "Female", "Other"],
  },
  phoneNumber: { type: Number, required: true, unique: true },
  countryCode: { type: Number, default: "+91" },
  altPhoneNumber: { type: Number, required: false },
  address: { type: String, required: false, default: null },
  password: { type: String, required: true, minlength: 6 },
});

const clientModel = mongoose.model("clients", clientSchema, "clients");
export default clientModel;
