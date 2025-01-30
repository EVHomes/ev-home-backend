import mongoose from "mongoose";

export const leaveRequestSchema = new mongoose.Schema(
    {
        leaveType:{
            type:String,
            required:true,
            enum:[
               "Compensatory Off",
                "Paid Leave",
                "Unpaid Leave",
                "Sick Leave",
                "Casual Leave",
            ],
        },
        appliedOn:{
            type:Date,
            required:true,
        },
        startDate:{
            type:Date,
            required:true,
        },
        endDate:{
            type:Date,
            required:true,
        },
        numberOfDays:{
            type:String,
            required:true,
        },
        reason:{
            type:String,
            required:true,
        },
        approveReason:{
            type:String,
            default:"Pending",
        },
        leaveStatus:{
            type:String,
            required:true,
            enum:[
                "Pending",
                "Approved",
                "Rejected",
            ],
            default:"Pending",
        },
        applicant:{
            type:String,
            ref:"employees",
            required:true,
        },
        reportingTo:{
            type:String,
            ref:"employees",
            required:true,
        },
        attachedFile:{
            type:String,
            required:false,
        },
    },
    { timestamps : true }
);

const leaveRequestModel = mongoose.model("leaveRequest",leaveRequestSchema,"leaveRequests");
export default leaveRequestModel;