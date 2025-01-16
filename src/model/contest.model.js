import mongoose from "mongoose";
const dateOfRegisterFormat= /^\d{4}-\d{2}-\d{2}$/;

export const contestSchema = new mongoose.Schema({
  firstName: { type: String, required: true, },
  lastName: { type: String, required: true, },
  // dateOfRegister: {
  //   type: String,
  //   default: "1999-01-01",
  //   validate: {
  //     validator: function (value) {
  //       // Check if the date matches the YYYY-MM-DD format
  //       return dateOfRegisterFormat.test(value);
  //     },
  //     message: (props) =>
  //       `${props.value} is not a valid date of birth. Use YYYY-MM-DD format.`,
  //   },
  // },
  phoneNumber: { type: String, required: true, default: null },
  photoUrl:{
    type:String,
    default:null,
  } // Changed to String
});


// Create the model
const contestModel = mongoose.model("Contest", contestSchema, "Contests");
export default contestModel;