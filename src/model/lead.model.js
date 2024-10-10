import { request } from "express";
import mongoose from "mongoose";
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordFormat = /^\d+$/;

export const leadSchema = new mongoose.Schema(
  {
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
    project:[{
      type: mongoose.Schema.Types.ObjectId, ref: "ourProjects", default: null 
    }],
    firstName: { type: String, required: true, default: null },
    lastName: { type: String, required: true, default: null },
    address: { type: String, default: null },
    channelPartner: { type: mongoose.Schema.Types.ObjectId, ref: "channelPartners", default: null },
    dataAnalyser: { type: mongoose.Schema.Types.ObjectId, ref: "employees", default: null },
    teamLeader: { type: mongoose.Schema.Types.ObjectId, ref: "employees", default: null },
    preSalesExecutive: { type: mongoose.Schema.Types.ObjectId, ref: "employees", default: null },
    countryCode: { type: String, default: "+91" },
    phoneNumber: { type: Number, required: true, default: null},
    altPhoneNumber: { type: Number, required: false, default: null },
    remark:{type:String,required:true,default:null},
    startDate: {
      type: Date,  
      required: true,
      default: Date.now,  
    },

    validTill: {
      type: Date, 
      required: true,
      default: function () {
        let startDate = this.startDate || Date.now();  // Use startDate or current date if not set
        let validTillDate = new Date(startDate);  // Create a date object from `startDate`
        validTillDate.setMonth(validTillDate.getMonth() + 2);  // Add 2 months
        return validTillDate;
      },
    },

    previousValidTill: {
      type: Date,  
      required: false,
      default:null,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Rejected", "Approved"], 
    },
    interestedStatus: {
      type: String,
      required: true,
      default: "Cold",
      enum: ["Cold", "Hot", "Warm"], 
    },
  },
  { timestamps: true }
);

const leadModel = mongoose.model("leads", leadSchema, "leads");
export default leadModel;
