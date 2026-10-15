const webpush = require("web-push");
require("dotenv").config();

webpush.setVapidDetails(
  "mailto:admin@rememberme.local",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

async function sendPushNotification(subscription, payload) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    return true;
  } catch (error) {
    console.error("Push notification error:", error.message);
    return false;
  }
}

module.exports = { sendPushNotification };