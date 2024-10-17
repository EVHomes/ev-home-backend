import departmentModel from "../model/department.model.js";
import { errorRes, successRes } from "../model/response.js";

//GET BY ALL
export const getDepartment = async (req, res) => {
  try {
    const respDept = await departmentModel.find();

    return res.send(
      successRes(200, "Get Department", {
        data: respDept,
      })
    );
  } catch (error) {
    return res.json({
      message: `error: ${error}`,
    });
  }
};

//GET BY ID
export const getDepartmentById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respDept = await departmentModel.findOne({ _id: id });

    if (!respDept)
      return res.send(
        successRes(404, `Department not found with id:${id}`, {
          data: respDept,
        })
      );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};

//add department
export const addDepartment = async (req, res) => {
  const body = req.body;
  const { department } = body;

  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    if (!department) return res.send(errorRes(403, "department is required"));
    const newDepartment = await departmentModel.create({
      department: department,
    });
    await newDepartment.save();
    return res.send(
      successRes(200, `department added successfully: ${department}`, {
        newDepartment,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};

//update department
export const updateDepartment = async (req, res) => {
  const body = req.body;
  const id = req.params.id;
  const { department } = body;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    // if (!body) return res.send(errorRes(403, "data is required"));
    if (!department) return res.send(errorRes(403, "department is required"));
    const updatedDepartment = await departmentModel.findByIdAndUpdate(
      id,
      { department },
      { new: true }
    );
    if (!updateDepartment)
      return res.send(errorRes(402, `department not updated:${department}`));
    return res.send(
      successRes(200, `department updated successfully:${(id, department)}`, {
        data: updatedDepartment,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};

//delete department
export const deleteDepartment = async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  const { department } = body;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    if (!body) return res.send(errorRes(403, "data is required"));
    const deletedDepartment = await departmentModel.findByIdAndDelete(id);
    if (!deleteDepartment)
      return res.send(errorRes(402, `department not deleted:${id}`));
    return res.send(
      successRes(200, `department deleted successfull:${(id, department)}`, {
        deletedDepartment,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};
