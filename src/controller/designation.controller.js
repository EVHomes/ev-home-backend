import designationModel from "../model/designation.model.js";
import { errorRes,successRes } from "../model/response.js";

//GET BY ALL
export const getDesignation = async (req, res) => {
  try {
    const respDes= await designationModel.find();

    return res.send(
      successRes(200,"Get designation",{
        data:respDes,
      })
    );
  } catch (error) {
    return res.json({
      message: `error: ${error}`,
    });
  }
};

//GET BY ID
export const getDesignationById= async(req,res)=>{
  const id=req.params.id;
  try{
    if(!id)return res.send(errorRes(403,"id is required"));
    const respDes=await designationModel.findOne({_id:id});

    if(!respDes)
      return res.send(successRes(404,`Designation not found with id:${id}`,{
    data:respDes,
    })
  );
  return res.send(
    successRes(200, `get designation by id:${id}`,{
    data:respDes,
    })
  );
  } catch(error){
    return res.send(errorRes(500,`server error:${error?.message}`));
  }
};

//ADD DESIGNATION
export const addDesignation=async(req,res)=>{
  const body=req.body;
  const {designation}= body;
  try{
    if(!body)return res.send(errorRes(403,"data is required"));
    if(!designation)return res.send(errorRes(403,"designation is required"));
    const newDesignation = await designationModel.create({ designation:designation });
    await newDesignation.save();
    return res.send(
      successRes(200,`designation added successfully:${designation}`,{
        newDesignation,
      })
    );

  }catch(error){
    return res.send(errorRes(500,`server error:${error?.message}`));
  }
};

//update designation
export const updateDesignation=async(req,res)=>{
  const body=req.body;
  req.params.id;
  const{designation}=body;
  try{
    if(!id)return res.send(errorRes(403,"id is required"));
    if(!body)return res.send(errorRes(403,"data is required"));
    if(!designation )return res.send(errorRes(403,"designation is required"));
    const updatedDesignation = await designationModel.findByIdAndUpdate(
      id, 
      { designation },  // Update designation field
      { new: true }      // Return the updated document
    );
    if(!updateDesignation)return res.send(errorRes(402,`designation not updated:${designation}`));

    return res.send(successRes(200,`designation upodated successfully:${id,designation}`,{
      updatedDesignation,
    }));
  }catch(error){
    return res.send(errorRes(500,`server error:${error?.message}`));
  }
};

//delete designation
export const deleteDesignation=async(req,res)=>{
  const body =req.body;
  const { id } = req.params;
  const{designation}=body;
    try{
     if(!id)return res.send(errorRes(403,"id is required"));
      if(!body)return res.send(errorRes(403,"data is required"));
      const deletedDesignation=await designationModel.findByIdAndDelete(id);
     if(!deleteDesignation) return res.send(errorRes(402,`designation not deleted${id}`));
     return res.send(successRes(200,`designation deleted successfully${id,designation}`,{
        deletedDesignation,
      }));
    }  catch(error){
       return res.send(errorRes(500,`server error:${error?.message}`));
   }
};




