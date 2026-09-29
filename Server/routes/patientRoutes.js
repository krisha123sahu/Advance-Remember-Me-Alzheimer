const express = require("express");
const Patient = require("../models/Patient");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==================== ADD PATIENT ====================

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      dateOfBirth,
      emergencyContact,
      address,
      importantNotes,
    } = req.body;

    const newPatient = new Patient({
      name,
      dateOfBirth,
      emergencyContact,
      address,
      importantNotes,

      // Logged-in user's ID
      createdBy: req.user.userId,
    });

    await newPatient.save();

    res.status(201).json({
      message: "Patient information saved successfully",
      patient: newPatient,
    });

  } catch (error) {
    console.log(
      "Patient save error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to save patient information",
    });
  }
});


// ==================== GET MY PATIENTS ====================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const patients = await Patient.find({
      createdBy: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      patients: patients,
    });

  } catch (error) {
    console.log(
      "Patient fetch error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to fetch patients",
    });
  }
});


module.exports = router;