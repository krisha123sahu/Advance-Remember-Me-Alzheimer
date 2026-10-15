
const cron = require("node-cron");
const Reminder = require("./models/Reminder");
const Patient = require("./models/Patient");
const PushSubscription = require("./models/PushSubscription");
const { sendPushNotification } = require("./notificationService");

function startReminderScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // Find reminders that have not been sent yet.
      const dueReminders = await Reminder.find({
        notificationSent: false,
      }).populate("patientId");

      for (const reminder of dueReminders) {
        if (!reminder.patientId) continue;

        // Match the reminder's calendar date with today's date.
        const reminderDate = new Date(reminder.date);

        if (
          reminderDate.getFullYear() !== now.getFullYear() ||
          reminderDate.getMonth() !== now.getMonth() ||
          reminderDate.getDate() !== now.getDate()
        ) {
          continue;
        }

        // Match the scheduled time (HH:mm).
        const [hours, minutes] = reminder.time.split(":").map(Number);

        if (
          now.getHours() !== hours ||
          now.getMinutes() !== minutes
        ) {
          continue;
        }

        const patient = await Patient.findById(
          reminder.patientId._id
        );

        if (!patient || !patient.createdBy) continue;

        const subscriptions = await PushSubscription.find({
          userId: patient.createdBy,
        });

        if (subscriptions.length === 0) continue;

        let delivered = false;

        for (const subscription of subscriptions) {
          const success = await sendPushNotification(
            subscription,
            {
              title: `Remember Me: ${reminder.title}`,
              body: `${reminder.type}: ${
                reminder.notes || "Your reminder is due now."
              }`,
              url: "/reminders",
            }
          );

          if (success) delivered = true;
        }

        if (delivered) {
          reminder.notificationSent = true;
          await reminder.save();

          console.log(
            `Reminder notification sent: ${reminder.title}`
          );
        }
      }
    } catch (error) {
      console.error(
        "Reminder scheduler error:",
        error.message
      );
    }
  });

  console.log("Reminder scheduler started.");
}

module.exports = startReminderScheduler;
