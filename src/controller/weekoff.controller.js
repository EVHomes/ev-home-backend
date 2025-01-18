import employeeModel from "../model/employee.model.js";
import { errorRes, successRes } from "../model/response.js";
import weekoffModel from "../model/weekoff.model.js";

export const addweekoff = async (req, res, next) => {
  const { weekoffDate, reason, aprovereason, weekoffstatus,reportingto,applyby } = req.body;

  try {
    if (!weekoffDate) return res.status(401).send(errorRes(401, "Week Off Date is not required"));
    if (!reason) return res.status(401).send(errorRes(401, "Reason is not required"));
    // if (!aprovereason) return res.status(401).send(errorRes(401, "Approver reason is not required"));
    // if (!weekoffstatus) return res.status(401).send(errorRes(401, "Week Off status is not required"));

    // const applybyEmployee = await employeeModel.findById(applyby);
    // if (!applybyEmployee) return res.status(404).send(errorRes(404, "Apply By employee not found"));

    // const reportingToEmployee = await employeeModel.findById(reportingto);
    // if (!reportingToEmployee) return res.status(404).send(errorRes(404, "Reporting To employee not found"));


    const newWeekOff = await weekoffModel.create({
      weekoffDate,
      reason,
      aprovereason,
      weekoffstatus,
      applyby,
      reportingto
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
