import leadModel from "../model/lead.model.js";
import oneSignalModel from "../model/oneSignal.model.js";
import { errorRes, successRes } from "../model/response.js";
import taskModel from "../model/task.model.js";
import { taskPopulateOptions } from "../utils/constant.js";
import { sendNotificationWithImage } from "./oneSignal.controller.js";

export const getTask = async (req, res, next) => {
  const id = req.params.id;
  const type = req.query.type;
  try {
    if (!id) return res.send(errorRes(401, "no id provided"));
    let filter = {
      assignTo: id,
    };
    if (type) {
      filter = {
        assignTo: id,
        type,
      };
    }
    const resp = await taskModel.find(filter).populate(taskPopulateOptions);

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
    if (body?.lead) {
      const foundLead = await leadModel.findOneAndUpdate(
        { _id: body?.lead },
        { taskRef: resp?._id }
      );
    }

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
  const {
    stage,
    status,
    intrestedStatus,
    feedback,
    document,
    recording,
    leadStatus,
  } = req.body;
  const taskId = req.params.id;
  const user = req.user;
  try {
    if (!taskId) return res.send(errorRes(401, "taskId required"));

    const myTask = await taskModel.findById(taskId);
    const startDate = new Date(); // Current date

    if (!myTask) return res.send(errorRes(404, "task not found"));
    if (myTask.lead != null) {
      // if (
      //   myTask.type.toLowerCase() == "first-call" ||
      //   myTask.type.toLowerCase() == "followup"
      // ) {
      const theLead = await leadModel.findByIdAndUpdate(myTask.lead, {
        clientInterestedStatus: intrestedStatus,
        interestedStatus: leadStatus,
        $addToSet: {
          callHistory: {
            caller: user?._id,
            callDate: startDate,
            remark: status ?? "",
            stage: stage ?? "",
            feedback: feedback ?? "",
            document: document,
            recording: recording,
          },
          updateHistory: {
            employee: user?._id,
            changes: feedback ?? "task updated",
            updatedAt: startDate,
            remark: stage,
          },
        },
      });
      // if()
      // }
    }
    const resp = await taskModel
      .findByIdAndUpdate(taskId, {
        completed: status === "completed" ? true : false,
        completedDate: new Date(),
      })
      .populate(taskPopulateOptions);

    return res.send(
      successRes(200, "Task updated", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};
