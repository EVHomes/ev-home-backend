import axios from "axios";
const appId = "d4ba7e76-e911-4cbd-a99a-592df2da7984";
const apiKey = "OThlMDQ3NDYtNGZhOC00ZjlmLWJjODMtMWYxZDc4NDQxNzlm";

export const sendNotification = async ({ playerIds = [], message }) => {
  const url = "https://api.onesignal.com/notifications";

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ${apiKey}`,
  };

  const data = {
    app_id: appId, // Your OneSignal App ID
    target_channel: "push",
    // include_player_ids: [playerId],
    include_aliases: {
      onesignal_id: playerIds,
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

export const sendNotificationWithInfo = async ({
  playerIds = [],
  title,
  message,
  data,
}) => {
  const url = "https://api.onesignal.com/notifications";

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ${apiKey}`, // Your OneSignal REST API key
  };

  const notificationData = {
    app_id: appId, // Your OneSignal App ID
    include_aliases: {
      onesignal_id: playerIds,
    },
    // include_player_ids: playerIds, // Send notification to specific users by player ID
    headings: {
      en: title, // Notification title in English
    },
    contents: {
      en: message, // Notification message in English
    },
    data: data || {}, // Optional additional data you want to send
    target_channel: "push", // Optional: specify the notification channel
  };
  console.log(notificationData);
  try {
    const response = await axios.post(url, notificationData, { headers });
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error.response?.data || error.message);
  }
};

export const sendNotificationWithImage = async ({
  playerIds,
  title,
  message,
  imageUrl,
  data,
}) => {
  const url = "https://api.onesignal.com/notifications";

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: `Basic ${apiKey}`, // Your OneSignal REST API key
  };

  const notificationData = {
    app_id: appId, // Your OneSignal App ID
    // include_player_ids: [playerId], // Send notification to specific users by player ID
    include_aliases: {
      onesignal_id: playerIds,
    },
    headings: {
      en: title, // Notification title in English
    },
    contents: {
      en: message, // Notification message in English
    },
    big_picture: imageUrl, // URL of the image to display in the notification (for Android)
    ios_attachments: {
      image: imageUrl, // Attach image for iOS
    },
    data: data || {}, // Optional additional data you want to send
    target_channel: "push", // Optional: specify the notification channel
  };

  try {
    const response = await axios.post(url, notificationData, { headers });
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error.response?.data || error.message);
  }
};
