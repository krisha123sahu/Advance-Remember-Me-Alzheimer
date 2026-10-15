
const express = require("express");
const router = express.Router();

const PushSubscription = require("../models/PushSubscription");
const authMiddleware = require("../middleware/authMiddleware");

const { sendPushNotification } = require("../notificationService");

// Save browser push subscription
router.post("/subscribe", authMiddleware, async (req, res) => {
  try {
    const { subscription } = req.body;

    if (
      !subscription ||
      !subscription.endpoint ||
      !subscription.keys ||
      !subscription.keys.p256dh ||
      !subscription.keys.auth
    ) {
      return res.status(400).json({
        message: "A valid push subscription is required.",
      });
    }

    const userId = req.user.userId || req.user.id || req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "User ID not found in login token.",
      });
    }

    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userId,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Push subscription saved successfully.",
    });
  } catch (error) {
    console.error("Push subscription error:", error);

    return res.status(500).json({
      message: "Unable to save push subscription.",
    });
  }
});


router.post("/test", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;

    const subscriptions = await PushSubscription.find({ userId });

    if (subscriptions.length === 0) {
      return res.status(404).json({
        message: "No push subscription found. Enable notifications first.",
      });
    }

    let sent = 0;

    for (const subscription of subscriptions) {
      const success = await sendPushNotification(subscription, {
        title: "Remember Me Test",
        body: "Great! Your care notifications are working.",
        url: "/dashboard",
      });

      if (success) {
        sent++;
      } else {
        await PushSubscription.deleteOne({ _id: subscription._id });
      }
    }

    if (sent === 0) {
      return res.status(502).json({
        message: "Push delivery failed. Please enable notifications again.",
      });
    }

    return res.status(200).json({
      message: "Test notification sent successfully!",
    });
  } catch (error) {
    console.error("Test notification error:", error);

    return res.status(500).json({
      message: "Unable to send test notification.",
    });
  }
});


module.exports = router;
