import axios from "axios";
const appId = "dea26e24-2dc3-4ebb-ac84-2c11dbd1f2d6";
const apiKey = "NWYwOGNhZGEtOWVhMC00Zjk4LTkxOTUtMWE3Mzc1NjJmMWFl";

export const sendNotification = async ({ playerId, message }) => {
  const url = "https://api.onesignal.com/notifications";

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ${apiKey}`,
  };

  const data = {
    app_id: appId, // Your OneSignal App ID
    target_channel: "push",
    include_player_ids: [playerId],
    included_segments: ["All"],
    // include_player_ids: [playerId], // The target player ID (user's device)
    contents: {
      en: message, // Message in English
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending notification:",
      error.response?.data || error.message
    );
  }
};
