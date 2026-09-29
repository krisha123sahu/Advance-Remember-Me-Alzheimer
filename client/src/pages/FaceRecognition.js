import React, { useState } from "react";
import "./FaceRecognition.css";

function FaceRecognition() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult("");
  };

  const handleRecognize = async () => {
    if (!selectedImage) {
      setResult("Please select an image first.");
      return;
    }

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch(
        "http://localhost:5000/api/face/recognize",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
      } else {
        setResult(data.message || "Face recognition failed.");
      }
    } catch (error) {
      console.error("Face recognition error:", error);
      setResult("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="face-page">
      <div className="face-container">

        {/* Header */}
        <div className="face-header">
          <div className="face-icon">📸</div>

          <h1>Face Recognition</h1>

          <p>
            Identify familiar people using face recognition.
          </p>
        </div>

        {/* Upload Area */}
        <div className="upload-area">
          <div className="upload-icon">🖼️</div>

          <h3>Upload an Image</h3>

          <p>
            Choose a clear photo containing a person's face.
          </p>

          <input
            id="face-image"
            className="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <label
            htmlFor="face-image"
            className="choose-button"
          >
            Choose Image
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div className="preview-section">
            <h3>Selected Image</h3>

            <img
              src={preview}
              alt="Selected"
              className="preview-image"
            />

            <button
              className="recognize-button"
              onClick={handleRecognize}
              disabled={loading}
            >
              {loading
                ? "Recognizing..."
                : "Recognize Face"}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="result-box">
            <h3>Recognition Result</h3>

            <p>{result}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default FaceRecognition;