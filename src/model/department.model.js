import mongoose from "mongoose";

export const departmentSchema=new mongoose.Schema(
    {
        department:{type:String, required:true, unique:true},
    },
    // {timestamps:true}
);

const departmentModel =mongoose.model("departments",departmentSchema,"departments");
export default departmentModel;