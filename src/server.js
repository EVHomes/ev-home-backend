import express from "express";
import cors from "cors";
import "dotenv/config";
import config from "./config/config.js";
import connectDatabase from "./config/database.js";
import router from "./routes/router.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { hostnameCheck } from "./utils/helper.js";
import cron from "node-cron";
import axios from "axios";
import triggerHistoryModel from "./model/triggerLog.model.js";
import { triggerCycleChangeFunction } from "./controller/lead.controller.js";
import {
  insertDailyAttendance,
  markPendingDailyAttendance,
} from "./routes/attendance/attendanceRouter.js";
import { Server } from "socket.io";
import http from "http";
import TransportModel from "./model/transport.model.js";

connectDatabase();

// const app = express();
// const server = http.createServer(app);
// let conntectedUser = [];
// let trackHistory = [];
// const updateTimeline = async (data) => {
//   const resp = await TransportModel.findByIdAndUpdate(data.transport, {
//     $push: {
//       timeline: data,
//     },
//   });
// };
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Replace with your Flutter app's origin for better security
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);
//   socket.on("userConnected", (data) => {
//     console.log(data);
//     conntectedUser.push({
//       socketId: socket.id,
//       transport: data["transport"],
//       loggedId: data["loggedId"],
//     });
//   });
//   // Listen for location updates from the driver
//   socket.on("locationUpdate", async (data) => {
//     console.log("Location Update:", data);
//     // Broadcast the updated location to other clients
//     socket.emit("updateLocation", data);
//     trackHistory.push({
//       socketId: socket.id,
//       ...data,
//     });
//     await updateTimeline({
//       socketId: socket.id,
//       ...data,
//     });
//     console.log("Broadcasting updateLocation");
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//     conntectedUser = conntectedUser.filter(
//       (item) => item.socketId !== socket.id
//     );
//   });
// });
const app = express();
const server = http.createServer(app);
let connectedUsers = [];
let trackHistory = [];

const updateTimeline = async (data) => {
  try {
    const resp = await TransportModel.findByIdAndUpdate(data.transport, {
      $push: {
        timeline: data,
      },
    });
    console.log("Timeline updated for transport:", data.transport);
  } catch (error) {
    console.error("Error updating timeline:", error);
  }
};

const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your Flutter app's origin for better security
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("userConnected", (data) => {
    console.log("User connected data:", data);
    connectedUsers.push({
      socketId: socket.id,
      transport: data["transport"],
      loggedId: data["loggedId"],
    });
    console.log("Connected users:", connectedUsers);
  });

  // Listen for location updates from the driver
  socket.on("locationUpdate", async (data) => {
    console.log("Location Update received:", data);
    try {
      // Broadcast the updated location to all clients except the sender
      socket.broadcast.emit("updateLocation", data);
      console.log("Broadcasting updateLocation to all clients except sender");

      trackHistory.push({
        socketId: socket.id,
        ...data,
      });

      await updateTimeline({
        socketId: socket.id,
        ...data,
      });
    } catch (error) {
      console.error("Error processing locationUpdate:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    connectedUsers = connectedUsers.filter(
      (item) => item.socketId !== socket.id
    );
    console.log("Remaining connected users:", connectedUsers);
  });

  // Add ping/pong for connection testing
  socket.on("ping", () => {
    console.log(`Received ping from ${socket.id}`);
    socket.emit("pong");
  });

  // Add test event handler
  socket.on("testEvent", (data) => {
    console.log(`Received testEvent from ${socket.id}:`, data);
    socket.emit("testEventResponse", {
      message: "Test event received successfully",
    });
  });
});
app.use(hostnameCheck);

app.use(express.json({ limit: "2gb" }));
app.use(express.urlencoded({ limit: "2gb", extended: true }));
app.set("view engine", "ejs");

app.use(cors());
app.use(router);

app.use(notFound);
app.use(errorHandler);

// Schedule a task to run at 9 AM daily and change cycle
cron.schedule("0 9 * * *", async () => {
  try {
    // Make the API call
    // const response = await axios.get(
    //   "https://api.evhomes.tech/lead-trigger-cycle-change"
    // );
    const response = await triggerCycleChangeFunction();

    await triggerHistoryModel.create({
      date: new Date(),
      changes: response?.changes ?? [],
      changesString: response?.changesString ?? "",
      totalTrigger: response?.total ?? 0,
      message: response?.message ?? "",
    });
  } catch (error) {
    console.error("Error making API call:", error.message);
  }
});

// // Trigger at 5:30 AM
// cron.schedule("30 5 * * *", async () => {
//   console.log("Triggered at 5:30 AM local time");
//   await insertDailyAttendance();
// });

// // Trigger at 11:59 PM
// cron.schedule("59 23 * * *", async () => {
//   console.log("Triggered at 11:59 PM local time");
//   await markPendingDailyAttendance();
// });

server.listen(config.PORT, () =>
  console.log("listening on port " + config.PORT)
);

export default app;
