import mongoose from "mongoose";

export const ourProjectsSchema = new mongoose.Schema({
  amenities: [
    {
        amenities:[{
            image:{type:String,required:true},
             name:{type:String,required:true},
        }],
        bhkConfiguration:[{
            carpetArea:{type:String,required:true},
            configuration:{type:String,required:true},
            image:{type:String,required:true},
            price:{type:Number,required:true},
            reraID:{type:String,required:true},
        }],
        contactNumber:{type:String,required:true,},
        countryCode:{type:String,default:"+91"},
        description:{type:String,required:true},
        locationLink:{type:String,required:true},
        locationName:{type:String,required:true},
        name:{type:String,required:true,unique:true},
        brochure:{type:String,required:false},
        showCaseImage:{type:String,required:true},
    },
  ],
  contactNumber: { type: String, required: true, unique: true },
  countryCode: { type: String, default: "+91", required: true },
  description: { type: String, required: true },
  locationLink: { type: String, required: true },
  locationName: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  brochure: { type: String, required: false },
  showCaseImage: { type: String, required: true, unique: true },
});
const ourProjectModel = mongoose.model(
  "ourProjects",
  ourProjectsSchema,
  "ourProjects"
);
export default ourProjectModel;
