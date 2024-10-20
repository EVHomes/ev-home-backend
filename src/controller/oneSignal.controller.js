import axios from "axios";
const appId = "d4ba7e76-e911-4cbd-a99a-592df2da7984";
const apiKey = "OThlMDQ3NDYtNGZhOC00ZjlmLWJjODMtMWYxZDc4NDQxNzlm";

export const sendNotification = async ({ playerId, message }) => {
  const url = "https://api.onesignal.com/notifications";

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ${apiKey}`,
  };

  const data = {
    app_id: appId, // Your OneSignal App ID
    target_channel: "push",
    include_aliases: {
      onesignal_id: [playerId],
    },
    contents: {
      en: message, // Message in English
    },
  };
  // console.log(data);
  try {
    const response = await axios.post(url, data, { headers });
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error.response?.data || error.message);
  }
};
