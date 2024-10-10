import { Router } from "express";
import cpRouter from "./channelPartner/channelPartnerRouter.js";
import employeeRouter from "./employee/employeeRouter.js";
import divRouter from "./division/divisionRouter.js";
import desRouter from "./designation/designationRouter.js";
import deptRouter from "./department/departmentRouter.js";
import ourProjectRouter from "./ourProject/ourProjectRouter.js";
import leadRouter from "./lead/leadRouter.js";
import clientRouter from "./client/clientRouter.js";
import siteVisitRouter from "./siteVisit/sitevisitRouter.js";
import storageRouter from "./storage/storageRouter.js";

const router = Router();

router.get("/", (req, res) => {
  const message = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
              }
              h1 {
                  color: #333;
              }
              p {
                  color: #666;
              }
              .container {
                  max-width: 600px;
                  margin: auto;
                  background: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Hello, welcome to our API!</h1>
              <p>This is a simple Message for api home.</p>
          </div>
      </body>
      </html>
    `;
  res.send(message);
});
router.use(cpRouter);
router.use(employeeRouter);
router.use(divRouter);
router.use(desRouter);
router.use(deptRouter);
router.use(ourProjectRouter);
router.use(leadRouter);
router.use(clientRouter);
router.use(storageRouter);
router.use(siteVisitRouter);
export default router;
