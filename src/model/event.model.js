import mongoose from "mongoose";

export const eventSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        required: true,
      },
      validTill: {
        type: Date,
        default: null,
      },
      event:{
        type:String,
        default:null,
      },

});

// Create the model
const eventModel = mongoose.model("event", eventSchema, "event");
export default eventModel;