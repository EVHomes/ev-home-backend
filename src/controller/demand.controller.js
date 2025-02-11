import demandModel from "../model/demand.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getDemand = async (req, res) => {
  try {
    const respDemand = await demandModel
      .find()
      .populate({
        path: "project",
      })
      // .populate({
      //   path: "reminders.customer",
      // });

    return res.send(
      successRes(200, "Get Demand Details", {
        data: respDemand,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const getDemandCountByProjectAndSlab = async (req, res) => {
  try {
    let project = req.query.project; 
    let slab=req.query.slab;

    if (!project ) {
      return res.send(errorRes(400, "Project is required"));
    }
    if (!slab ) {
      return res.send(errorRes(400, "Slab is required"));
    }

    const totalItemCount = await demandModel.countDocuments({
      project: project,
    });
    // Query the database to count demands for the specified project and slab
    const demandCount = await demandModel.countDocuments({
      project: project,
      slab: slab,
    })

    const resp = await demandModel.find({
      project: project,
      slab: slab,
    }).populate({
      path: "project",
      select:"name",
    });

    return res.send(
      successRes(200, "Demand count for project and slab", {
        // project: project,
        // slab: slab,
        data:{
          totalItemCount:totalItemCount,
          demandGeneratedcount: demandCount,
          resp,
        }
        
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error.message));
  }
};

export const getDemandInfo = async (req, res) => {
  try {
    let project = req.query.project; 
    let slab=req.query.slab;

    if (!project ) {
      return res.send(errorRes(400, "Project is required"));
    }
    if (!slab ) {
      return res.send(errorRes(400, "Slab is required"));
    }

  
    const resp = await demandModel.find({
      project: project,
      slab: slab,
    }).populate({
      path: "project",
      select:"name",
    });

    // console.log(resp);
    return res.send(
      successRes(200, "Demand for project and slab", {
     
        data:resp,
        
        
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error.message));
  }
};



export const addDemand = async (req, res) => {
  try {
    if (!req.body) return res.send(errorRes(401, "data Required"));
    console.log(req.body);
    const respDemand = await demandModel.create({ ...req.body });

    return res.send(
      successRes(200, "new Demand Added", {
        data: respDemand,
      })
    );
  } catch (error) {
    console.log(error);

    return res.send(errorRes(500, error));
  }
};



// import demandModel from "../model/demand.model.js";
// import { errorRes, successRes } from "../model/response.js";

// export const getDemand = async (req, res) => {
//   try {
//     const respDemand = await demandModel
//       .find()
//       .populate({
//         path: "project",
//       })
//       .populate({
//         path: "reminders.customer",
//       });

//     return res.send(
//       successRes(200, "Get Demand Details", {
//         data: respDemand,
//       })
//     );
//   } catch (error) {
//     return res.send(errorRes(500, error));
//   }
// };

// export const addDemand = async (req, res) => {
//   try {
//     if (!req.body) return res.send(errorRes(401, "data Required"));

//     const respDemand = await demandModel.create({ ...req.body });

//     return res.send(
//       successRes(200, "new Demand Added", {
//         data: respDemand,
//       })
//     );
//   } catch (error) {
//     return res.send(errorRes(500, error));
//   }
// };
