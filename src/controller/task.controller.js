import { errorRes, successRes } from "../model/response.js";
import taskModel from "../model/task.model.js";

export const getTask = async (req, res, next) => {
  try {
    const resp = await taskModel.find();
    return res.send(
      successRes(200, "get task", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const assignTask = async (req, res, next) => {
  const body = req.body;
  const assignTo = req.params.id;
  const user = req.user;
  try {
    if (!assignTo)
      return res.send(errorRes(401, "assign to assignTo required"));
    const newData = {
      ...body,
      assignTo,
      assignBy: user._id,
    };
    const resp = await taskModel.create({ ...newData });

    return res.send(
      successRes(200, "get task", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};
