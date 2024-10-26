import axios from "axios";
import config from "../config/config.js"; // Adjust the path to your config file

// Function to send an email via Brevo API
const senderName = "EV Homes";
const senderEmail = "evhomes.operations@evgroup.co.in";
export const sendEmail = async (recipientEmail, subject, htmlContent) => {
  const url = "https://api.brevo.com/v3/smtp/email";

  // Prepare the email data
  const emailData = {
    sender: { name: senderName, email: senderEmail }, // Replace with a valid sender email
    to: [{ email: recipientEmail }],
    subject: subject,
    htmlContent: htmlContent,
  };

  // Set up headers including your API key
  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "api-key": config.BREVO_API_KEY, // Ensure your API key is set in your config
  };

  try {
    // Make the POST request to send the email
    const response = await axios.post(url, emailData, { headers });
    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message
    );
  }
};
