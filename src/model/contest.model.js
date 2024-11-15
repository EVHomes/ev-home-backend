import mongoose from "mongoose";

export const contestSchema = new mongoose.Schema(
  {
    
    firstName: { type: String, required: true, unique: true },
    lastName:{type:String, required:true, unique:true},
    dateOfRegister: {
        type: String,
        required: true,
        default: "1999-01-01",
        validate: {
          validator: function (value) {
           
            return dateOfRegister(value);
          },
          message: (props) =>
            `${props.value} is not a valid date of birth. Use YYYY-MM-DD format.`,
        },
      },
      phoneNumber: { type: Number, required: true, default: null },

  }
  // {timestamps:true}
);

const contestModel = mongoose.model("contests", contestSchema, "contests");
export default contestModel;
