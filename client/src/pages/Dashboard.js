
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useState } from "react";
import { enablePushNotifications } from "../pushNotifications";

function Dashboard() {
  const navigate = useNavigate();

  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationLoading, setNotificationLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setNotificationLoading(true);
    setNotificationMessage("");

    try {
      const result = await enablePushNotifications();
      setNotificationMessage(
        result.message || "Notifications enabled!"
      );
    } catch (error) {
      setNotificationMessage(
        error.message || "Unable to enable notifications."
      );
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        "http://localhost:5000/api/push/test",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned HTML or invalid JSON (HTTP ${response.status}). Check the backend route.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Test notification failed."
        );
      }

      setNotificationMessage(
        data.message || "Test notification sent successfully!"
      );
    } catch (error) {
      setNotificationMessage(error.message);
    }
  };

  return (
    <div className="dashboard-page">

      {/* ==================== HEADER ==================== */}

      <div className="dashboard-header">
        <div>
          <p className="dashboard-tagline">
            WELCOME TO REMEMBER ME
          </p>

          <h1>Your Care Dashboard 💙</h1>

          <p>
            Manage care, memories and everyday support from one place.
          </p>
        </div>

        <div className="dashboard-user">
          <div className="user-icon">👤</div>
          <span>My Profile</span>
        </div>
      </div>

      {/* ==================== QUICK FEATURES ==================== */}

      <div className="dashboard-stats">

        <div
          className="stat-card clickable"
          onClick={() => navigate("/patient-profile")}
        >
          <div className="stat-icon">🧠</div>
          <div>
            <h3>Patient Profile</h3>
            <p>Manage patient information.</p>
          </div>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => navigate("/memory-people")}
        >
          <div className="stat-icon">👨‍👩‍👧</div>
          <div>
            <h3>Memory &amp; People</h3>
            <p>Manage important people.</p>
          </div>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => navigate("/reminders")}
        >
          <div className="stat-icon">🔔</div>
          <div>
            <h3>Reminders</h3>
            <p>Manage daily reminders.</p>
          </div>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => navigate("/ai-assistant")}
        >
          <div className="stat-icon">🤖</div>
          <div>
            <h3>AI Assistant</h3>
            <p>Get smart care assistance.</p>
          </div>
        </div>

      </div>

      {/* ==================== CARE NOTIFICATIONS ==================== */}

      <section className="notification-setup">
        <div className="notification-heading">
          <span className="notification-icon">🛡️</span>

          <div>
            <h2>Care Notifications</h2>
            <p>
              Stay updated with medicine and care reminders.
            </p>
          </div>
        </div>

        <div className="notification-actions">
          <button
            type="button"
            className="notification-btn primary"
            onClick={handleEnableNotifications}
            disabled={notificationLoading}
          >
            {notificationLoading
              ? "Enabling..."
              : "Enable Notifications"}
          </button>

          <button
            type="button"
            className="notification-btn secondary"
            onClick={handleTestNotification}
          >
            Send Test Notification
          </button>
        </div>

        {notificationMessage && (
          <p
            className="notification-message"
            role="status"
            aria-live="polite"
          >
            {notificationMessage}
          </p>
        )}
      </section>

      {/* ==================== MAIN CONTENT ==================== */}

      <div className="dashboard-content">

        <div className="dashboard-main-card">
          <h2>How can we help today?</h2>

          <p>
            Choose a feature to manage care and stay connected.
          </p>

          <div className="dashboard-features">

            {/* Patient Profile */}

            <div
              className="dashboard-feature clickable"
              onClick={() => navigate("/patient-profile")}
            >
              <span>👤</span>
              <div>
                <h3>Patient Profile</h3>
                <p>
                  Store important patient information,
                  emergency contacts and notes.
                </p>
              </div>
            </div>

            {/* Memory & People */}

            <div
              className="dashboard-feature clickable"
              onClick={() => navigate("/memory-people")}
            >
              <span>🧠</span>
              <div>
                <h3>Memory &amp; People</h3>
                <p>
                  Store important people, relationships
                  and information.
                </p>
              </div>
            </div>

            {/* Reminders */}

            <div
              className="dashboard-feature clickable"
              onClick={() => navigate("/reminders")}
            >
              <span>🔔</span>
              <div>
                <h3>Smart Reminders</h3>
                <p>
                  Keep track of medicines,
                  appointments and daily routines.
                </p>
              </div>
            </div>

            {/* Face Recognition */}

            <div
              className="dashboard-feature clickable"
              onClick={() => navigate("/face-recognition")}
            >
              <span>📸</span>
              <div>
                <h3>Face Recognition</h3>
                <p>
                  Help identify familiar people
                  using face recognition.
                </p>
              </div>
            </div>

            {/* AI Assistant */}

            <div
              className="dashboard-feature clickable"
              onClick={() => navigate("/ai-assistant")}
            >
              <span>🤖</span>
              <div>
                <h3>AI Care Assistant</h3>
                <p>
                  Get useful assistance based on
                  your care information.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== EMERGENCY ==================== */}

        <div className="emergency-card">
          <div className="emergency-icon">🚨</div>

          <h2>Emergency Support</h2>

          <p>
            Quickly access important emergency
            information when needed.
          </p>

          <button
            type="button"
            onClick={() => navigate("/patient-profile")}
          >
            Emergency Help
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
