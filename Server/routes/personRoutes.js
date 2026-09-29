const express = require("express");
const Person = require("../models/Person");
const Patient = require("../models/Patient");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==================== ADD PERSON ====================

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      relation,
      contact,
      importantInfo,
      patientId,
    } = req.body;

    // Check if patient ID is provided
    if (!patientId) {
      return res.status(400).json({
        message: "Patient ID is required",
      });
    }

    // Check if this patient belongs to logged-in user
    const patient = await Patient.findOne({
      _id: patientId,
      createdBy: req.user.userId,
    });

    if (!patient) {
      return res.status(403).json({
        message: "You do not have access to this patient.",
      });
    }

    const newPerson = new Person({
      name,
      relation,
      contact,
      importantInfo,
      patientId,
    });

    await newPerson.save();

    res.status(201).json({
      message: "Person added successfully",
      person: newPerson,
    });

  } catch (error) {
    console.log(
      "Person save error:",
      error.message
    );

    res.status(500).json({
      message: "Failed to save person information",
    });
  }
});


// ==================== GET PEOPLE BY PATIENT ====================

router.get(
  "/:patientId",
  authMiddleware,
  async (req, res) => {
    try {
      const { patientId } = req.params;

      // Check if this patient belongs to logged-in user
      const patient = await Patient.findOne({
        _id: patientId,
        createdBy: req.user.userId,
      });

      if (!patient) {
        return res.status(403).json({
          message: "You do not have access to this patient.",
        });
      }

      const people = await Person.find({
        patientId: patientId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        people: people,
      });

    } catch (error) {
      console.log(
        "People fetch error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch people",
      });
    }
  }
);


module.exports = router;