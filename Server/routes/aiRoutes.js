const express = require("express");
const Patient = require("../models/Patient");
const Reminder = require("../models/Reminder");

const router = express.Router();

const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "llama3.2:3b";


// =====================================================
// TEST ROUTE
// =====================================================

router.get("/test", (req, res) => {
  res.json({
    message: "AI route is working!",
  });
});


// =====================================================
// HELPER - FORMAT REMINDERS
// =====================================================

function formatReminder(reminder, index) {
  const date = new Date(reminder.date).toLocaleDateString();

  return `${index + 1}. ${reminder.title} | Type: ${reminder.type} | Date: ${date} | Time: ${reminder.time}${reminder.notes ? ` | Notes: ${reminder.notes}` : ""}`;
}


// =====================================================
// AI CHAT ROUTE
// =====================================================

router.post("/chat", async (req, res) => {
  try {
    const { message, patientId } = req.body;

    // -------------------------------------------------
    // Check message
    // -------------------------------------------------

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a message.",
      });
    }


    // -------------------------------------------------
    // Check patient
    // -------------------------------------------------

    if (!patientId) {
      return res.status(400).json({
        message: "Please select a patient first.",
      });
    }


    // -------------------------------------------------
    // Find patient
    // -------------------------------------------------

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found.",
      });
    }


    // -------------------------------------------------
    // Find actual reminders from MongoDB
    // -------------------------------------------------

    const reminders = await Reminder.find({
      patientId: patientId,
    }).sort({
      date: 1,
      time: 1,
    });


    // -------------------------------------------------
    // User question
    // -------------------------------------------------

    const userQuestion = message
      .trim()
      .toLowerCase();


    // =================================================
    // REMINDER QUESTIONS
    // =================================================

    const isReminderQuestion =
      userQuestion.includes("reminder") ||
      userQuestion.includes("appointment") ||
      userQuestion.includes("schedule") ||
      userQuestion.includes("scheduled") ||
      userQuestion.includes("medicine") ||
      userQuestion.includes("routine");


    if (isReminderQuestion) {

      // ------------------------------------------------
      // No reminders
      // ------------------------------------------------

      if (reminders.length === 0) {
        return res.status(200).json({
          reply: `There are currently no reminders stored for ${patient.name} in the Remember Me application.`,
        });
      }


      // ------------------------------------------------
      // Format actual reminder data
      // ------------------------------------------------

      const reminderList = reminders
        .map((reminder, index) =>
          formatReminder(reminder, index)
        )
        .join("\n");


      // ------------------------------------------------
      // Count question
      // ------------------------------------------------

      if (
        userQuestion.includes("how many") ||
        userQuestion.includes("number of") ||
        userQuestion.includes("count")
      ) {
        return res.status(200).json({
          reply: `${patient.name} has ${reminders.length} reminder${reminders.length === 1 ? "" : "s"} stored in the application.`,
        });
      }


      // ------------------------------------------------
      // Schedule / date / time question
      // ------------------------------------------------

      if (
        userQuestion.includes("when") ||
        userQuestion.includes("schedule") ||
        userQuestion.includes("scheduled") ||
        userQuestion.includes("date") ||
        userQuestion.includes("time")
      ) {

        return res.status(200).json({
          reply:
            `${patient.name}'s scheduled reminders are:\n\n` +
            reminderList,
        });
      }


      // ------------------------------------------------
      // General reminder question
      // ------------------------------------------------

      return res.status(200).json({
        reply:
          `${patient.name} has ${reminders.length} reminder${reminders.length === 1 ? "" : "s"} stored in the application:\n\n` +
          reminderList,
      });
    }


    // =================================================
    // PATIENT INFORMATION
    // =================================================

    const patientInformation = `
Patient Name: ${patient.name || "Not available"}

Date of Birth: ${
      patient.dateOfBirth
        ? new Date(patient.dateOfBirth).toLocaleDateString()
        : "Not available"
    }

Emergency Contact: ${patient.emergencyContact || "Not available"}

Address: ${patient.address || "Not available"}

Important Notes: ${patient.importantNotes || "Not available"}
`;


    // =================================================
    // REMINDER INFORMATION FOR AI
    // =================================================

    let reminderInformation = "No reminders found.";

    if (reminders.length > 0) {
      reminderInformation = reminders
        .map((reminder, index) =>
          formatReminder(reminder, index)
        )
        .join("\n");
    }


    // =================================================
    // OLLAMA PROMPT
    // =================================================

    const prompt = `
You are the AI Care Assistant inside the Remember Me
Alzheimer care-management application.

You help caregivers and family members understand
information stored in the application.

SELECTED PATIENT:

${patientInformation}


ACTUAL REMINDERS STORED FOR THIS PATIENT:

${reminderInformation}


USER QUESTION:

${message}


IMPORTANT RULES:

1. Answer using the information provided above.

2. Never invent patient information.

3. Never invent reminders, medicines, appointments,
   dates or times.

4. If information is unavailable, clearly say that it
   is not available in the Remember Me application.

5. Important Notes are not automatically reminders.

6. Keep answers simple and useful for caregivers.

7. Do not diagnose diseases.

8. Do not prescribe medicines or treatments.

9. Do not tell the user to start, stop or change
   medication.

10. For medical diagnosis or treatment questions,
    recommend consulting a qualified healthcare
    professional.

11. Do not reveal technical details about MongoDB,
    APIs or internal application implementation.

12. Only discuss information belonging to the selected
    patient.

Answer the user's question clearly and concisely.
`;


    // =================================================
    // CALL OLLAMA
    // =================================================

    const ollamaResponse = await fetch(
      OLLAMA_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: prompt,
          stream: false,
        }),
      }
    );


    // -------------------------------------------------
    // Ollama error
    // -------------------------------------------------

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();

      console.log(
        "Ollama error:",
        errorText
      );

      return res.status(500).json({
        message:
          "AI service could not process the request.",
      });
    }


    // -------------------------------------------------
    // Get Ollama response
    // -------------------------------------------------

    const data = await ollamaResponse.json();

    const reply =
      data.response ||
      "Sorry, I could not generate a response.";


    // -------------------------------------------------
    // Send response
    // -------------------------------------------------

    return res.status(200).json({
      reply: reply.trim(),
    });

  } catch (error) {

    console.log(
      "AI error:",
      error.message
    );

    return res.status(500).json({
      message:
        "AI assistant could not process the request.",
    });
  }
});


module.exports = router;