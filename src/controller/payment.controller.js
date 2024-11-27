import paymentModel from "../model/payment.model.js";
import { errorRes, successRes } from "../model/response.js";

export const getPayment = async (req, res) => {
  try {
    const respPayment = await paymentModel.find()
    .populate({
        path: "projects",
    
      });

    return res.send(
      successRes(200, "Get Payment", {
        data: respPayment,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

export const addPayment = async (req, res) => {
  const body = req.body;
  
    const {
      projects,
      customerName,
      phoneNumber,
      dateOfAmtReceive,
      receiptNo,
      account,
      paymentMode,
      transactionId,
      flatNo,
      carpetArea,
      address1,
      address2,
      city,
      pincode,
      amtReceived,
      allinclusiveamt,
      bookingAmt,
      stampDuty,
      tds,
      cgst,
    } = body;

    try {
      if (!body) return res.send(errorRes(403, "data is required"));
      //   if (!department) return res.send(errorRes(403, "department is required"));
      const newPayment = await paymentModel.create({
        projects: projects,
        customerName: customerName,
        phoneNumber: phoneNumber,
        dateOfAmtReceive: dateOfAmtReceive,
        receiptNo: receiptNo,
        account: account,
        paymentMode: paymentMode,
        transactionId:transactionId,
        flatNo: flatNo,
        carpetArea: carpetArea,
        address1: address1,
        address2: address2,
        city: city,
        pincode: pincode,
        amtReceived: amtReceived,
        allinclusiveamt: allinclusiveamt,
        bookingAmt: bookingAmt,
        stampDuty: stampDuty,
        tds: tds,
        cgst: cgst,
      });
      await newPayment.save();
      const respP= await paymentModel.findById(newPayment._id)
      .populate({
          path: "projects",
      
        });
  
      return res.send(
        successRes(200, `payment added successfully: ${customerName}`, {
          data: respP,
        })
      );
    } catch (error) {
      return res.send(errorRes(500, error));
    }
  };

