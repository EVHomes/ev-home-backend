import paymentModel from "../model/payment.model.js";
import { errorRes, successRes } from "../model/response.js";
import { paymentPopulateOptions } from "../utils/constant.js";

export const getPayment = async (req, res) => {
  try {
    const respPayment = await paymentModel
      .find()
      .populate(paymentPopulateOptions);

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
    slab,
    customerName,
    phoneNumber,
    dateOfAmtReceive,
    receiptNo,
    account,
    paymentMode,
    transactionId,
    flatNo,
    amtReceived,
    bookingAmt,
    stampDuty,
    tds,
    cgst,
  } = body;

  // console.log(body);

  try {
    if (!body) return res.send(errorRes(403, "data is required"));
    //   if (!department) return res.send(errorRes(403, "department is required"));
    const newPayment = await paymentModel.create({
      ...body,
    });
    await newPayment.save();
    const respP = await paymentModel
      .findById(newPayment._id)
      .populate(paymentPopulateOptions);

    return res.send(
      successRes(200, `payment added successfully: ${customerName}`, {
        data: respP,
      })
    );
  } catch (error) {
    console.log(error);
    return res.send(errorRes(500, error));
  }
};

export const getPaymentbyFlat = async (req, res) => {
  try {
    const flatNo = req.query.flatNo;
    const respPayment = await paymentModel
      .findOne({ flatNo: flatNo })
      .populate(paymentPopulateOptions);

    return res.send(
      successRes(200, "Get Payment", {
        data: respPayment,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error));
  }
};

// Update check return and redeposit dates
export const updateCheckDates = async (req, res) => {
  const id = req.params.id;
  try {
    const { paymentId, checkReturnedDate, checkRedepositDate } = req.body;

    if (!id) {
      return res.send(errorRes(400, "Payment ID is required"));
    }

    const payment = await paymentModel.findById(id);

    if (!payment) {
      return res.send(errorRes(404, "Payment not found"));
    }

    // Update check dates if provided
    if (checkReturnedDate) {
      payment.checkReturnedDate = new Date(checkReturnedDate);
    }
    if (checkRedepositDate) {
      payment.checkRedepositDate = new Date(checkRedepositDate);
    }

    await payment.save();

    const updatedPayment = await paymentModel
      .findById(paymentId)
      .populate(paymentPopulateOptions);

    return res.send(
      successRes(200, "Check dates updated successfully", {
        data: updatedPayment,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, error.message));
  }
};
