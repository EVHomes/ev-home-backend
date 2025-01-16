import eventModel from "../model/event.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getEvent= async (req, res) => {
    try {
      const respDept = await eventModel.find();
  
      return res.send(
        successRes(200, "Get Event", {
          data: respDept,
        })
      );
    } catch (error) {
      return res.send(errorRes(500, error));
    }
  };
  
  export const addEvent = async (req, res) => {
    const body = req.body;
    const { startDate,validTill,event } = body;
  
    try {
      if (!startDate) return res.send(errorRes(403, "Start Date is required"));
      if (!event)
        return res.send(errorRes(403, "Event is required"));
    //  if(!validTill) return res.send(errorRes(403, "End Date is required"));
  
      const newEvent = await eventModel.create({
        startDate:startDate,
        validTill:validTill,
        event:event,
        
      });
      await newEvent.save();
  
      return res.send(
        successRes(200, `Event added successfully: ${event}`, {
          data: newEvent,
        })
      );
    } catch (error) {
      return res.send(errorRes(500, error));
    }
  };

  export const getEventById = async (req, res) => {
    const event = req.params.id;
    try {
      if (!event) return res.send(errorRes(403, "id is required"));
  
      const respDiv = await eventModel.findOne({event:event});
  
      if (!respDiv) return res.send(errorRes(404, `Event not found`));
  
      return res.send(
        successRes(200, `Event Found`, {
          data: respDiv,
        })
      );
    } catch (error) {
      return res.send(errorRes(500, error));
    }
  };
