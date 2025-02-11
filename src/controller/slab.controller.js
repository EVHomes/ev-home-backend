import { findOneAndUpdate, findOne } from "../models/slab"

export async function updateSlab(req, res) {
  try {
    const { projectId, slabId } = req.body
    const updatedSlab = await findOneAndUpdate(
      { project: projectId },
      { $set: { currentSlab: slabId } },
      { new: true },
    )
    if (!updatedSlab) {
      return res.status(404).json({ code: 404, message: "Slab not found" })
    }
    res.json({ code: 200, message: "Slab updated successfully", data: updatedSlab })
  } catch (error) {
    console.error(error)
    res.status(500).json({ code: 500, message: "Failed to update slab" })
  }
}

export async function getProjectSlab(req, res) {
  try {
    const { projectId } = req.params
    const projectSlab = await findOne({ project: projectId })
    if (!projectSlab) {
      return res.status(404).json({ code: 404, message: "Project slab not found" })
    }
    res.json({ code: 200, data: projectSlab })
  } catch (error) {
    console.error(error)
    res.status(500).json({ code: 500, message: "Failed to fetch project slab" })
  }
}

