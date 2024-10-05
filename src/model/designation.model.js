import mongoose from "mongoose";

export const designationSchema=new mongoose.Schema(
    {
        designation:{type:String, required:true, unique:true},
    },
    // {timestamps:true}
);

const designationModel =mongoose.model("designationModel",designationSchema);
export default designationModel;