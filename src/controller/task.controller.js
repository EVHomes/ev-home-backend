import oneSignalModel from "../model/oneSignal.model.js";
import { errorRes, successRes } from "../model/response.js";
import taskModel from "../model/task.model.js";
import { taskPopulateOptions } from "../utils/constant.js";
import { sendNotificationWithImage } from "./oneSignal.controller.js";

export const getTask = async (req, res, next) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(401, "no id provided"));

    const resp = await taskModel
      .find({ assignTo: id })
      .populate(taskPopulateOptions);

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
    console.log(assignTo);
    console.log(body);
    const newData = {
      ...body,
      assignTo: assignTo,
      // assignTo: user._id,
    };

    const resp = await taskModel.create({ ...newData });

    const foundTLPlayerId = await oneSignalModel.find({
      docId: assignTo,
    });

    if (foundTLPlayerId.length > 0) {
      // console.log(foundTLPlayerId);
      const getPlayerIds = foundTLPlayerId.map((dt) => dt.playerId);

      await sendNotificationWithImage({
        playerIds: getPlayerIds,
        title: "You've Got new task",
        message: `A new task has been assigned to you. Check the details to move things forward.`,
        imageUrl:
          "https://images.ctfassets.net/rz1oowkt5gyp/1IgVe0tV9yDjWtp68dAZJq/36ca564d33306d407dabe39c33322dd9/TaskManagement-hero.png",
      });
    }
    const resp2 = await taskModel
      .findById(resp._id)
      .populate(taskPopulateOptions);

    return res.send(
      successRes(200, "Task Assigned", {
        data: resp2,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req, res, next) => {
  const { status } = req.body;
  const taskId = req.params.id;
  const user = req.user;
  try {
    if (!taskId) return res.send(errorRes(401, "taskId required"));

    const resp = await taskModel
      .findByIdAndUpdate(taskId, {
        completed: status === "completed" ? true : false,
        completedDate: new Date(),
      })
      .populate(taskPopulateOptions);

    return res.send(
      successRes(200, "get task", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};
