const express = require("express");
const Reminder = require("../models/Reminder");
const Patient = require("../models/Patient");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==================== ADD REMINDER ====================

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      type,
      date,
      time,
      notes,
      patientId,
    } = req.body;

    // Check patient ID
    if (!patientId) {
      return res.status(400).json({
        message: "Patient ID is required",
      });
    }

    // Check if patient belongs to logged-in user
    const patient = await Patient.findOne({
      _id: patientId,
      createdBy: req.user.userId,
    });

    if (!patient) {
      return res.status(403).json({
        message: "You do not have access to this patient.",
      });
    }

    // Create reminder
    const newReminder = new Reminder({
      title,
      type,
      date,
      time,
      notes,
      patientId,
    });

    await newReminder.save();

    res.status(201).json({
      message: "Reminder added successfully",
      reminder: newReminder,
    });

  } catch (error) {
    console.log(
      "Reminder save error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to save reminder",
    });
  }
});


// ==================== GET REMINDERS BY PATIENT ====================

router.get(
  "/:patientId",
  authMiddleware,
  async (req, res) => {
    try {
      const { patientId } = req.params;

      // Check if patient belongs to logged-in user
      const patient = await Patient.findOne({
        _id: patientId,
        createdBy: req.user.userId,
      });

      if (!patient) {
        return res.status(403).json({
          message: "You do not have access to this patient.",
        });
      }

      const reminders = await Reminder.find({
        patientId: patientId,
      }).sort({
        date: 1,
        time: 1,
      });

      res.status(200).json({
        reminders: reminders,
      });

    } catch (error) {
      console.log(
        "Reminder fetch error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch reminders",
      });
    }
  }
);


module.exports = router;