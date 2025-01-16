import { name } from "ejs";
import leadModel from "../model/lead.model.js";
import oneSignalModel from "../model/oneSignal.model.js";
import { errorRes, successRes } from "../model/response.js";
import taskModel from "../model/task.model.js";
import { taskPopulateOptions } from "../utils/constant.js";
import { sendNotificationWithImage } from "./oneSignal.controller.js";
import employeeModel from "../model/employee.model.js";

export const getTask = async (req, res, next) => {
  const id = req.params.id;
  const type = req.query.type;
  const query = req.query.query || "";

  try {
    if (!id) return res.send(errorRes(401, "No ID provided"));

    const now = new Date();
    let filter = { assignTo: id, deadline: { $gt: now } };

    if (type) {
      if (type == "completed") {
        filter.completed = true;
      } else if (type == "pending") {
        filter.completed = false;
      } else {
        filter.type = type;
      }
    }

    if (query) {
      const isNumberQuery = !isNaN(query);
      const searchConditions = [];

      // Add search conditions based on the query type
      if (!isNumberQuery) {
        searchConditions.push(
          { clientName: { $regex: query, $options: "i" } },
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } }
        );
      } else {
        searchConditions.push({ someNumericField: Number(query) });
      }

      filter.$or = searchConditions;
    }
    const resp = await taskModel
      .find(filter)
      .populate(taskPopulateOptions)
      .sort({ assignDate: -1 });

    // .populate({
    //   path: "lead",
    //   select:"",
    //   match: {
    //     $or: [
    //       { firstname: { $regex: query, $options: "i" } }, // Case-insensitive search
    //       { lastname: { $regex: query, $options: "i" } },
    //     ],
    //   },
    // });

    // console.log(match);
    return res.send(
      successRes(200, "Get task", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const getTaskReminders = async (req, res, next) => {
  const id = req.params.id;
  const type = req.query.type;
  const query = req.query.query || "";

  try {
    if (!id) return res.send(errorRes(401, "No ID provided"));
    const today = new Date();
    let filter = { assignTo: id, reminderDate: { $gte: today } };

    if (type) {
      if (type == "completed") {
        filter.completed = true;
      } else if (type == "pending") {
        filter.completed = false;
      } else {
        filter.type = type;
      }
    }

    if (query) {
      const isNumberQuery = !isNaN(query);
      const searchConditions = [];

      // Add search conditions based on the query type
      if (!isNumberQuery) {
        searchConditions.push(
          { clientName: { $regex: query, $options: "i" } },
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } }
        );
      } else {
        searchConditions.push({ someNumericField: Number(query) });
      }

      filter.$or = searchConditions;
    }
    const resp = await taskModel
      .find(filter)
      .populate(taskPopulateOptions)
      .sort({ assignDate: -1 });

    // .populate({
    //   path: "lead",
    //   select:"",
    //   match: {
    //     $or: [
    //       { firstname: { $regex: query, $options: "i" } }, // Case-insensitive search
    //       { lastname: { $regex: query, $options: "i" } },
    //     ],
    //   },
    // });

    // console.log(match);
    return res.send(
      successRes(200, "Get task", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const getTaskByid = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(401, "No ID provided"));
    const resp = await taskModel.findById(id).populate(taskPopulateOptions);

    return res.send(
      successRes(200, "Get task", {
        data: resp,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const getTaskTeam = async (req, res, next) => {
  const id = req.params.id;
  const type = req.query.type;
  const query = req.query.query || "";
  const member = req.query.member;

  try {
    if (!id) return res.send(errorRes(401, "No ID provided"));
    const now = new Date();

    let filter = { deadline: { $gt: now } };

    if (member) {
      filter = { assignTo: member };
    } else {
      const teams = await employeeModel.find({ reportingTo: id }).select("_id");
      const ids = teams.map((ele) => ele._id);

      filter = { assignTo: { $in: ids } };
    }
    console.log(type);

    if (type) {
      if (type == "completed") {
        filter.completed = true;
      } else if (type == "pending") {
        filter.completed = false;
      } else {
        filter.type = type;
      }
    }

    if (query) {
      const isNumberQuery = !isNaN(query);
      const searchConditions = [];

      // Add search conditions based on the query type
      if (!isNumberQuery) {
        searchConditions.push(
          { clientName: { $regex: query, $options: "i" } },
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } }
        );
      } else {
        searchConditions.push({ someNumericField: Number(query) });
      }

      filter.$or = searchConditions;
    }

    const resp = await taskModel
      .find(filter)
      .populate(taskPopulateOptions)
      .sort({ assignDate: -1 });

    return res.send(
      successRes(200, "Get task", {
        total: resp.length,
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

    const assignDate = new Date();
    if (!body.deadline) {
      const now = new Date();
      now.setHours(23, 59, 0, 0); // Set time to 11:59 PM
      body.deadline = now;
    }

    const newData = {
      ...body,
      assignTo: assignTo,
      assignDate,
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
    taskCompleted,
  } = req.body;

  const taskId = req.params.id;
  const user = req.user;
  try {
    if (!taskId) return res.send(errorRes(401, "taskId required"));

    const myTask = await taskModel.findById(taskId);
    const startDate = new Date(); // Current date

    if (!myTask) return res.send(errorRes(404, "task not found"));
    if (myTask.lead != null) {
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
            interestedStatus: intrestedStatus,
          },
          updateHistory: {
            employee: user?._id,
            changes: feedback ?? "task updated",
            updatedAt: startDate,
            remark: stage,
          },
        },
      });
    }
    const statusValue = taskCompleted ? taskCompleted.toLowerCase() : "";
    const resp = await taskModel
      .findByIdAndUpdate(taskId, {
        completed: true,
        completedDate: startDate,
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

export const updateTaskReminder = async (req, res, next) => {
  const { remindMe, reminderDate, reminderDescription } = req.body;

  const taskId = req.params.id;
  try {
    if (!taskId) return res.send(errorRes(401, "taskId required"));

    const myTask = await taskModel.findById(taskId);

    if (!myTask) return res.send(errorRes(404, "task not found"));

    const resp = await taskModel
      .findByIdAndUpdate(taskId, {
        remindMe,
        reminderDate,
        reminderDescription,
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

export const updateFeedback = async (req, res, next) => {
  const {
    stage,
    status,
    intrestedStatus,
    feedback,
    document,
    recording,
    leadStatus,
    taskCompleted,
    lead,
    task,
    siteVisitInterested,
    siteVisitInterestedDate,
  } = req.body;
  const user = req.user;
  try {
    if (lead == null) return res.send(errorRes(404, "Lead not found"));

    const startDate = new Date(); // Current date
    const theLead = await leadModel.findByIdAndUpdate(lead, {
      clientInterestedStatus: intrestedStatus,
      interestedStatus: leadStatus,
      siteVisitInterested,
      siteVisitInterestedDate,
      $addToSet: {
        callHistory: {
          caller: user?._id,
          callDate: startDate,
          remark: status ?? "",
          stage: stage ?? "",
          feedback: feedback ?? "",
          document: document,
          recording: recording,
          interestedStatus: intrestedStatus,
        },
        updateHistory: {
          employee: user?._id,
          changes: feedback ?? "task updated",
          updatedAt: startDate,
          remark: stage,
        },
      },
    });

    if (task != null) {
      const statusValue = taskCompleted ? taskCompleted.toLowerCase() : "";
      const resp = await taskModel
        .findByIdAndUpdate(task, {
          completed: statusValue === "completed" ? true : false,
          completedDate: startDate,
        })
        .populate(taskPopulateOptions);
    }

    return res.send(
      successRes(200, "Feedback added", {
        data: true,
      })
    );
  } catch (error) {
    return next(error);
  }
};
