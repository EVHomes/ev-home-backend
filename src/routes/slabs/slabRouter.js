import { Router } from "express";
import { errorRes, successRes } from "../../model/response.js";
import slabModel from "../../model/slab.model.js";
import { slabPopulateOptions } from "../../utils/constant.js";
const slabRouter = Router();

slabRouter.post("/add-slab", async (req, res) => {
  const { slabs, project, currentSlab } = req.body;
  try {
    if (!project) return res.send(errorRes(401, "project required"));

    if (!slabs || slabs?.length < 0)
      return res.send(errorRes(401, "slabs required required"));

    const newSlabs = slabs.map((slb) => {
      slb.id = `${project}-${slb.index}-${slb.name?.replace(
        /\s+/g,
        "-"
      )}`.toLowerCase();
      return slb;
    });
    const resp = await slabModel.create({
      _id: `slab-${project}`,
      ...req.body,
      slabs: newSlabs,
    });

    return res.send(successRes(200, "", { data: resp }));
  } catch (error) {
    return res.send(errorRes(500, error));
  }
});

slabRouter.get("/get-slab-by-project/:project", async (req, res) => {
  const project = req.params.project;

  try {
    if (!project) return res.send(errorRes(401, "project required"));

    const resp = await slabModel
      .findOne({ project: project })
      .populate(slabPopulateOptions);

    return res.send(successRes(200, "", { data: resp }));
  } catch (error) {
    return res.send(errorRes(500, error));
  }
});
export default slabRouter;
