// import bcrypt from 'bcrypt';
import clientModel from "../model/client.model.js";
import { errorRes, successRes } from "../model/response.js";
import { encryptPassword } from "../utils/helper.js";
//GET BY ALL
export const getClients = async (req, res) => {
  try {
    const respClient = await clientModel.find();

    return res.send(
      successRes(200, "Get Clients", {
        data: respClient,
      })
    );
  } catch (error) {
    return res.json({
      message: `error: ${error}`,
    });
  }
};

//GET BY ID
export const getClientById = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) return res.send(errorRes(403, "id is required"));
    const respClient = await clientModel.findOne({ _id: id });

    if (!respClient)
      return res.send(
        successRes(404, `Department not found with id:${id}`, {
          data: respClient,
        })
      );
  } catch (error) {
    return res.send(errorRes(500, `server error:${error?.message}`));
  }
};

//add department
export const addClient = async (req, res) => {
  const body = req.body;
  const { firstName, lastName, email, gender, phoneNumber, address, password } =
    body;

  try {
    if (!body) return res.send(errorRes(403, "Data is required"));
    if (!firstName) return res.send(errorRes(403, "First name is required"));
    if (!lastName) return res.send(errorRes(403, "Last name is required"));
    if (!password) return res.send(errorRes(403, "Password is required"));
    if (!email) return res.send(errorRes(403, "Email is required"));
    if (!gender) return res.send(errorRes(403, "Gender is required"));
    if (!phoneNumber)
      return res.send(errorRes(403, "Phone number is required"));
    if (!address) return res.send(errorRes(403, "Address is required"));

    //const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds (cost factor)
    const hashedPassword = await encryptPassword(password);
    // Create a new client with the hashed password
    const newClient = await clientModel.create({
      firstName,
      lastName,
      email,
      gender,
      phoneNumber,
      address,
      password: hashedPassword, // Save the hashed password
    });

    await newClient.save();
    return res.send(
      successRes(200, `Client added successfully: ${firstName} ${lastName}`, {
        newClient,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

//UPDATE
export const updateClient = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const { firstName, lastName, email, gender, phoneNumber, address, password } =
    body;

  try {
    if (!body) return res.send(errorRes(403, "Data is required"));
    // if (!client) return res.send(errorRes(404, "Client not found"));
    if (!firstName) return res.send(errorRes(403, "First name is required"));
    if (!lastName) return res.send(errorRes(403, "Last name is required"));
    if (!password) return res.send(errorRes(403, "Password is required"));
    if (!email) return res.send(errorRes(403, "Email is required"));
    if (!gender) return res.send(errorRes(403, "Gender is required"));
    if (!phoneNumber)
      return res.send(errorRes(403, "Phone number is required"));
    if (!address) return res.send(errorRes(403, "Address is required"));

    // Find the client by ID
    const updatedClient = await clientModel.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        gender,
        phoneNumber,
        address,
        password,
      },
      { new: true }
    );

    if (!updatedClient)
      return res.senderrorRes(
        402,
        `Client not updated:${firstName}${lastName}`
      );

    return res.send(
      successRes(200, `Client updated successfully: ${firstName} ${lastName}`, {
        updatedClient,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};

export const deleteClient = async (req, res) => {
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(403, "ID is required"));
    const deletedClient = await clientModel.findByIdAndDelete(id);
    if (!deletedClient)
      return res.send(errorRes(404, `Client not found with ID: ${id}`));

    return res.send(
      successRes(200, `Client deleted successfully with ID: ${id}`, {
        deletedClient,
      })
    );
  } catch (error) {
    return res.send(errorRes(500, `Server error: ${error?.message}`));
  }
};
