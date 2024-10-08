import mongoose from "mongoose";

export const divisionSchema=new mongoose.Schema(
    {
        division:{type:String,required:true,unique:true},
        location:{type:String,required:true},

    },
);
const divisionModel=mongoose.model("divisions",divisionSchema,"divisions");
export default divisionModel;