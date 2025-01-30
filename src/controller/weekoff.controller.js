import employeeModel from "../model/employee.model.js";
import { errorRes, successRes } from "../model/response.js";
import weekoffModel from "../model/weekoff.model.js";

export const addweekoff = async (req, res, next) => {
  const { appliedOn,weekoffDate, reason, aprovereason, weekoffstatus, reportingto, applyby } = req.body;

  try {
    if (!weekoffDate) return res.status(401).send(errorRes(401, "Week Off Date is required"));
    if (!reason) return res.status(401).send(errorRes(401, "Reason is required"));


   
    const applybyEmployee = await employeeModel.findById(applyby);
    if (!applybyEmployee) return res.status(404).send(errorRes(404, "Apply By employee not found"));

    const reportingToEmployee = await employeeModel.findById(reportingto);
    if (!reportingToEmployee) return res.status(404).send(errorRes(404, "Reporting To employee not found"));

    
    const newWeekOff = await weekoffModel.create({
      appliedOn,
      weekoffDate,
      reason,
      aprovereason: aprovereason || "pending", 
      weekoffstatus: weekoffstatus|| "pending",
      applyby,
      reportingto,
    });

    return res.status(200).send(
      successRes(200, "Week Off added", {
        data: newWeekOff,
      })
    );
  } catch (error) {
    return res.status(500).send(errorRes(500, "Internal Server Error"));
  }
};


export const getWeekOffs = async (req, res, next) => {
  const { applyby, reportingto, weekoffstatus } = req.query;

  try {
    const query = {};

    if (applyby) {
      query.applyby = applyby;
    }

    if (reportingto) {
      query.reportingto = reportingto;
    }

    if (weekoffstatus) {
      query.weekoffstatus = weekoffstatus;
    }
    const weekoffs = await weekoffModel.find(query)
      .populate('applyby', 'firstName lastName')  
      .populate('reportingto', 'firstName lastName'); 

    if (weekoffs.length === 0) {
      return res.status(404).send(errorRes(404, "No Week Off records found"));
    }
  
    return res.status(200).send(successRes(200, "Week Off records retrieved", { data: weekoffs }));
  } catch (error) {
    console.error("Error retrieving week offs:", error);
    return res.status(500).send(errorRes(500, "Internal Server Error"));
  }
};

export const getWeekOffById =async(req,res,next) =>{
  const id= req.params.id;
  try{
if (!id)  return res.status(401).send(errorRes(401, "weekoff id required"));

const weekoff= await weekoffModel.findById(id);

if (!weekoff)  return res.status(404).send(errorRes(404, "weekoff is not found"));

return res.send(
  successRes(200,"get weekoff",{
    data: weekoff,
  })
);
  }catch(error){
    return res.send(errorRes(500, "Internal Server Error"));
  }
};

export const updateWeekOffStatus = async (req, res) => {
  const { id } = req.params; // WeekOff request ID
  const { weekoffstatus, aprovereason } = req.body;

  try {
   
    if (!weekoffstatus) {
      return res.status(400).send({
        success: false,
        message: "Week Off status is required",
      });
    }

    const weekoff = await weekoffModel.findById(id);
    if (!weekoff) {
      return res.status(404).send({
        success: false,
        message: "Week Off request not found",
      });
    }

    weekoff.weekoffstatus = weekoffstatus;
    weekoff.aprovereason = aprovereason || "No reason provided"; 

    await weekoff.save();

    return res.status(200).send({
      success: true,
      message: "Week Off status updated successfully",
      data: weekoff,
    });
  } catch (error) {
    console.error("Error updating Week Off status:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};


