import divisionModel from "../model/division.model.js";
import { errorRes, successRes } from "../model/response.js";

//GET BY ALL
export const getDivision = async (req, res) => {
  try {
    const respDiv = await divisionModel.find();
    return res.send(
      successRes(200, "Get divisions", {
        data: respDiv,
      })
    );
  } catch (error) {
    return res.json({
      message: `error:${error}`,
    });
  }
};

//GET BY ID
export const getDivisionById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respDiv = await divisionModel.findOne({ _id: id });
    if (!respDiv)
      return res.send(
        successRes(404, `Department not found with id:${id}`, {
          data: respDiv,
        })
      );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};

//add division
export const addDivision = async (req, res) => {
  const body = req.body;
  const { division,location } = body;
  
  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if(!location) return res.send(errorRes(403, "location  is required"));
    if (!division) return res.send(errorRes(403, "division is required"));
    const newDivision = await divisionModel.create({ division: division, location: location });
    await newDivision.save();
    return res.send(
      successRes(200, `division added successfully:${division}`, {
        newDivision,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};


//update designation
export const updateDivision=async(req,res)=>{
  const body=req.body;
  const id=req.params.id;
  const{division,location}=body;
  try{
    if(!id)return res.send(errorRes(403,"id is required"));
    if(!body)return res.send(errorRes(403,"data is required"));
    if(!division)return res.send(errorRes(403,"division is required"));
    if(!location) return res.send(errorRes(403, "location  is required"));
    const updatedDivision= await divisionModel.findByIdAndUpdate(
      id, 
      { division, location },  
      { new: true }      
    );
    if(!updateDivision)return res.send(errorRes(402,`division not updated:${division}`));

    return res.send(successRes(200,`Division updated successfully:${division,location}`,{
      updatedDivision,
    }));
  }catch(error){
    return res.send(errorRes(500,`server error:${error?.message}`));
  }
};

//delete designation
export const deleteDivision=async(req,res)=>{
  const body =req.body;
  const { id } = req.params;
  const{division,location}=body;
    try{
     if(!id)return res.send(errorRes(403,"id is required"));
     if(!body)return res.send(errorRes(403,"data is required"));
      const deletedDivision=await divisionModel.findByIdAndDelete(id);
     if(!deleteDivision) return res.send(errorRes(402,`division not deleted:${id}`));
     return res.send(successRes(200,`division deleted successfully:${id,division,location}`,{
        deletedDivision,
      }));
    }  catch(error){
       return res.send(errorRes(500,`server error:${error?.message}`));
   }
};