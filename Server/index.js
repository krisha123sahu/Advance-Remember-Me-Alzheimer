const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const pushRoutes = require("./routes/pushRoutes");
const startReminderScheduler = require("./reminderScheduler");

require("dotenv").config();

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.log(
      "MongoDB connection failed:",
      error.message
    );
  });

// Routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const personRoutes = require("./routes/personRoutes");
const faceRoutes = require("./routes/faceRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Route connections
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/persons", personRoutes);
app.use("/api/face", faceRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/push", pushRoutes);
app.use("/api/ai", aiRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Remember Me Backend is running!");
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`

  );
});

startReminderScheduler();