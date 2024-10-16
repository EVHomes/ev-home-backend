import mongoose from "mongoose";

import mongoose from "mongoose";

const teamLeaderAssignTurnSchema = new mongoose.Schema(
  {
    lastAssignTeamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      default: null,
    },
    nextAssignTeamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      default: null,
    },
    listOfTeamLeaders: [
      {
        teamLeader: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "employees",
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    currentOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add a method to get and update the next team leader
teamLeaderAssignTurnSchema.methods.getNextTeamLeader = async function () {
  const totalLeaders = this.listOfTeamLeaders.length;
  if (totalLeaders === 0) {
    throw new Error("No team leaders available");
  }

  // Find the next leader
  const nextOrder = (this.currentOrder + 1) % totalLeaders;
  const nextLeader = this.listOfTeamLeaders.find(
    (leader) => leader.order === nextOrder
  );

  if (!nextLeader) {
    throw new Error("Next leader not found");
  }

  // Update the document
  this.lastAssignTeamLeader = this.nextAssignTeamLeader;
  this.nextAssignTeamLeader = nextLeader.teamLeader;
  this.currentOrder = nextOrder;

  // Save the changes
  await this.save();

  return {
    lastAssignTeamLeader: this.lastAssignTeamLeader,
    nextAssignTeamLeader: this.nextAssignTeamLeader,
  };
};

const TeamLeaderAssignTurnModel = mongoose.model(
  "teamLeaderAssignTurn",
  teamLeaderAssignTurnSchema,
  "teamLeaderAssignTurn"
);

export default TeamLeaderAssignTurnModel;
// export const teamLeaderAssignTurnSchema = new mongoose.Schema(
//   {
//     lastAssignTeamLeader: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "employees",
//       default: null,
//     },
//     nextAssignTeamLeader: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "employees",
//       default: null,
//     },
//     listOfTeamLeaders: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "employees",
//         default: null,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const teamLeaderAssignTurnModel = mongoose.model(
//   "teamLeaderAssignTurn",
//   teamLeaderAssignTurnSchema,
//   "teamLeaderAssignTurn"
// );
// export default teamLeaderAssignTurnModel;
