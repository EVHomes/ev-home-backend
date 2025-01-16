import mongoose from "mongoose";

export const contestSchema = new mongoose.Schema({

  firstName: { type: String, required: true, },
  lastName: { type: String, required: true, },
  phoneNumber: { type: String, required: true, default: null },
  photoUrl:{
    type:[String],
    default:null,
  }  ,
  event:{
    type : String,
    ref: "event"
  }
});


// Create the model
const contestModel = mongoose.model("Contest", contestSchema, "Contests");
export default contestModel;