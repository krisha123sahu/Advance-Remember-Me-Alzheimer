import React, { useEffect, useState } from "react";
import "./AICareAssistant.css";

function AICareAssistant() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hello! I'm your Remember Me Care Assistant. Select a patient and ask me something about their care.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(true);

  // Fetch patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/patients"
        );

        const data = await response.json();

        if (response.ok) {
          setPatients(data.patients || []);
        } else {
          console.error("Failed to fetch patients.");
        }
      } catch (error) {
        console.error("Patient fetch error:", error);
      } finally {
        setPatientsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle patient selection
  const handlePatientChange = (e) => {
    const patientId = e.target.value;

    setSelectedPatient(patientId);

    const selectedPatientData = patients.find(
      (patient) => patient._id === patientId
    );

    if (selectedPatientData) {
      setMessages([
        {
          type: "ai",
          text: `Patient selected: ${selectedPatientData.name}. You can now ask me about their care information.`,
        },
      ]);
    }
  };

  // Send message to AI
  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    if (!selectedPatient) {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "ai",
          text: "Please select a patient before asking about their care information.",
        },
      ]);

      return;
    }

    const userMessage = message.trim();

    // Add user message
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        type: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,
            patientId: selectedPatient,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "AI request failed."
        );
      }

      // Add AI response
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("AI Assistant Error:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "ai",
          text: "Sorry, I could not connect to the AI assistant. Please make sure the backend and Ollama are running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <div className="ai-container">

        {/* Header */}
        <div className="ai-header">
          <div className="ai-icon">🤖</div>

          <div>
            <p className="ai-tagline">
              REMEMBER ME AI
            </p>

            <h1>AI Care Assistant</h1>

            <p>
              Get helpful assistance with everyday care information.
            </p>
          </div>
        </div>

        {/* Information box */}
        <div className="ai-info">
          💙 The Care Assistant can help you understand
          patient information and organize everyday care
          activities.
        </div>

        {/* Patient Selection */}
        <div className="ai-patient-selector">

          <label htmlFor="patient-select">
            Select Patient
          </label>

          <select
            id="patient-select"
            value={selectedPatient}
            onChange={handlePatientChange}
            disabled={patientsLoading || loading}
          >
            <option value="">
              {patientsLoading
                ? "Loading patients..."
                : "Select a patient"}
            </option>

            {patients.map((patient) => (
              <option
                key={patient._id}
                value={patient._id}
              >
                {patient.name}
              </option>
            ))}
          </select>

          {!patientsLoading && patients.length === 0 && (
            <p className="ai-patient-warning">
              No patients found. Please add a patient first.
            </p>
          )}

        </div>

        {/* Chat Area */}
        <div className="chat-area">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.type === "user"
                  ? "message user-message"
                  : "message ai-message"
              }
            >
              <div className="message-avatar">
                {msg.type === "user"
                  ? "👤"
                  : "🤖"}
              </div>

              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading message */}
          {loading && (
            <div className="message ai-message">

              <div className="message-avatar">
                🤖
              </div>

              <div className="message-content">
                Thinking...
              </div>

            </div>
          )}

        </div>

        {/* Chat Input */}
        <form
          className="chat-input-area"
          onSubmit={handleSend}
        >
          <input
            type="text"
            placeholder={
              selectedPatient
                ? "Ask something about this patient..."
                : "Select a patient first..."
            }
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            disabled={!selectedPatient || loading}
          />

          <button
            type="submit"
            disabled={!selectedPatient || loading}
          >
            {loading
              ? "Sending..."
              : "Send"}
          </button>
        </form>

        {/* Disclaimer */}
        <p className="ai-disclaimer">
          Remember Me AI provides general assistance based on
          available information and is not a replacement for
          professional medical advice.
        </p>

      </div>
    </div>
  );
}

export default AICareAssistant;