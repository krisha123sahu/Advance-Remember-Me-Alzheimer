const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");

const router = express.Router();

// Temporary upload folder
const uploadFolder = path.join(__dirname, "../uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Multer configuration
const upload = multer({
  dest: uploadFolder,
});

// Face recognition route
router.post("/recognize", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Please upload an image",
    });
  }

  const imagePath = req.file.path;

  const pythonScript = path.join(
    __dirname,
    "../python/recognition.py"
  );

  const pythonCommand =
    process.platform === "win32" ? "python" : "python3";

  execFile(
    pythonCommand,
    [pythonScript, imagePath],
    (error, stdout, stderr) => {
      // Delete uploaded temporary image
      fs.unlink(imagePath, () => {});

      if (error) {
        console.log("Python error:", error.message);
        console.log("Python stderr:", stderr);

        return res.status(500).json({
          message: "Face recognition failed",
        });
      }

      const output = stdout.trim();

      console.log("Python output:", output);

      // Extract recognition result
      const resultLine = output
        .split("\n")
        .find((line) => line.startsWith("RESULT:"));

      const result = resultLine
        ? resultLine.replace("RESULT:", "").trim()
        : "Unknown person";

      res.status(200).json({
        message: "Face recognition completed",
        result: result,
      });
    }
  );
});

module.exports = router;