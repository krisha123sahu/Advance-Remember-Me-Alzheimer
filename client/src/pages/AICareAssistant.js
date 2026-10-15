import React, { useEffect, useState } from "react";
import "./AICareAssistant.css";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const speechSupported = Boolean(SpeechRecognition);

function AICareAssistant() {

  const [language, setLanguage] = useState("en-IN");
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
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
  const [patientError, setPatientError] = useState("");

  // Add JWT token to protected API requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/patients",
          {
            headers: getAuthHeaders(),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch patients."
          );
        }

        setPatients(data.patients || []);
        setPatientError("");
      } catch (error) {
        console.error("Patient fetch error:", error);
        setPatientError(error.message);
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

    const patient = patients.find(
      (item) => item._id === patientId
    );

    if (patient) {
      setMessages([
        {
          type: "ai",
          text: `Patient selected: ${patient.name}. You can now ask me about their care information.`,
        },
      ]);
    }
  };


  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Please use Google Chrome for voice recognition.");
      return;
    }

    if (!selectedPatient) {
      alert("Please select a patient first.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      setMessage(event.results[0][0].transcript);
    };

    recognition.onerror = (event) => {
      console.error("Microphone error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };




  // Speak AI response aloud
  const speakResponse = (text) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  };

  // Send message to AI
  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    if (!selectedPatient) {
      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text: "Please select a patient before asking about their care information.",
        },
      ]);




      return;
    }

    const userMessage = message.trim();

    setMessages((previous) => [
      ...previous,
      { type: "user", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/chat",
        {
          method: "POST",
          headers: getAuthHeaders(),
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

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text: data.reply,

        },
      ]);

      speakResponse(data.reply);

    } catch (error) {
      console.error("AI Assistant Error:", error);

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text: error.message ===
            "Access denied. Please login first."
            ? "Your login session may have expired. Please log in again."
            : "Sorry, I couldn't connect to the AI assistant. Please check the backend and Ollama, then try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-page">
      <div className="ai-container">
        <div className="ai-header">
          <div className="ai-icon">🤖</div>

          <div>
            <p className="ai-tagline">REMEMBER ME AI</p>
            <h1>AI Care Assistant</h1>
            <p>
              Get helpful assistance with everyday care information.
            </p>
          </div>
        </div>

        <div className="ai-info">
          💙 The Care Assistant can help you understand
          patient information and organize everyday care activities.
        </div>

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
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>

          {!patientsLoading && patientError && (
            <p className="ai-patient-warning">
              {patientError}
            </p>
          )}

          {!patientsLoading &&
            !patientError &&
            patients.length === 0 && (
              <p className="ai-patient-warning">
                No patients found. Please add a patient first.
              </p>
            )}
        </div>

        <div className="voice-controls">
          <label htmlFor="voice-language">Language:</label>

          <select
            id="voice-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">Hindi</option>
          </select>

          <button
            type="button"
            onClick={() => setVoiceEnabled((previous) => !previous)}
          >
            {voiceEnabled ? "🔊 Voice ON" : "🔇 Voice OFF"}
          </button>

          <button
            type="button"
            onClick={startListening}
            disabled={!selectedPatient || loading || isListening || !speechSupported}
          >
            {isListening ? "🎙️ Listening..." : "🎤 Speak"}
          </button>
        </div>

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
                {msg.type === "user" ? "👤" : "🤖"}
              </div>

              <div className="message-content">
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message ai-message">
              <div className="message-avatar">🤖</div>
              <div className="message-content">Thinking...</div>
            </div>
          )}
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            placeholder={
              selectedPatient
                ? "Ask something about this patient..."
                : "Select a patient first..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!selectedPatient || loading}
          />

          <button
            type="submit"
            disabled={!selectedPatient || loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>

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