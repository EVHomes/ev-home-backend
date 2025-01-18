import mongoose from "mongoose";
 export const weekoffSchema= new mongoose.Schema(
{

weekoffDate:{
    type:String,
    required:true,
},
reason:{
    type: String,
    required:true,
},
aprovereason:{
    type: String,
    required:true,
   default:"pending",
},
weekoffstatus:{
    type: String,
    require:true,
    default: "pending",
},
applyby: {
    type: String,
    ref: "employees",
    default: null,
  },
  reportingto: {
    type: String,
    ref: "employees",
    default: null,
  },
},

 );

 const weekoffModel = mongoose.model("weekoff", weekoffSchema, "weekoff");
 export default weekoffModel;
 