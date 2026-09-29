import { useEffect, useState } from "react";
import axios from "axios";
import "./Reminders.css";

function Reminders() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");

  const [reminderData, setReminderData] = useState({
    title: "",
    type: "",
    date: "",
    time: "",
    notes: "",
  });

  const [reminders, setReminders] = useState([]);


  // ==================== GET TOKEN ====================

  const getToken = () => {
    return localStorage.getItem("token");
  };


  // ==================== GET PATIENTS ====================

  const fetchPatients = async () => {
    try {
      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPatients(response.data.patients);

    } catch (error) {
      console.log(
        "Patient fetch error:",
        error
      );

      setPatients([]);
    }
  };


  // ==================== GET REMINDERS ====================

  const fetchReminders = async (patientId) => {
    if (!patientId) {
      setReminders([]);
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/reminders/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReminders(response.data.reminders);

    } catch (error) {
      console.log(
        "Reminder fetch error:",
        error
      );

      setReminders([]);
    }
  };


  // ==================== LOAD PATIENTS ====================

  useEffect(() => {
    fetchPatients();
  }, []);


  // ==================== PATIENT CHANGE ====================

  const handlePatientChange = (e) => {
    const patientId = e.target.value;

    setSelectedPatient(patientId);

    fetchReminders(patientId);
  };


  // ==================== INPUT CHANGE ====================

  const handleChange = (e) => {
    setReminderData({
      ...reminderData,
      [e.target.name]: e.target.value,
    });
  };


  // ==================== ADD REMINDER ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient) {
      alert("Please select a patient first.");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/reminders/add",
        {
          ...reminderData,
          patientId: selectedPatient,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      setReminderData({
        title: "",
        type: "",
        date: "",
        time: "",
        notes: "",
      });

      fetchReminders(selectedPatient);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to save reminder."
      );
    }
  };


  return (
    <div className="reminders-page">

      {/* ==================== HEADER ==================== */}

      <div className="reminders-header">

        <div>
          <p className="reminders-tagline">
            SMART REMINDERS
          </p>

          <h1>Daily Care Reminders 🔔</h1>

          <p>
            Keep track of important medicines,
            appointments and daily routines.
          </p>
        </div>

        <div className="reminders-header-icon">
          🔔
        </div>

      </div>


      {/* ==================== CONTENT ==================== */}

      <div className="reminders-content">

        {/* ==================== FORM ==================== */}

        <div className="reminder-form-card">

          <h2>Add Reminder</h2>

          <p className="form-description">
            Create a helpful reminder for the patient.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Patient */}

            <div className="form-group">

              <label>Select Patient</label>

              <select
                value={selectedPatient}
                onChange={handlePatientChange}
                required
              >
                <option value="">
                  Select patient
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

            </div>


            {/* Title */}

            <div className="form-group">

              <label>Reminder Title</label>

              <input
                type="text"
                name="title"
                placeholder="Example: Take morning medicine"
                value={reminderData.title}
                onChange={handleChange}
                required
              />

            </div>


            {/* Type */}

            <div className="form-group">

              <label>Reminder Type</label>

              <select
                name="type"
                value={reminderData.type}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select type
                </option>

                <option value="medicine">
                  💊 Medicine
                </option>

                <option value="appointment">
                  🏥 Appointment
                </option>

                <option value="routine">
                  🕐 Daily Routine
                </option>

                <option value="other">
                  📌 Other
                </option>

              </select>

            </div>


            {/* Date */}

            <div className="form-group">

              <label>Date</label>

              <input
                type="date"
                name="date"
                value={reminderData.date}
                onChange={handleChange}
                required
              />

            </div>


            {/* Time */}

            <div className="form-group">

              <label>Time</label>

              <input
                type="time"
                name="time"
                value={reminderData.time}
                onChange={handleChange}
                required
              />

            </div>


            {/* Notes */}

            <div className="form-group">

              <label>Notes</label>

              <textarea
                name="notes"
                placeholder="Add any additional information..."
                value={reminderData.notes}
                onChange={handleChange}
                rows="4"
              />

            </div>


            <button
              type="submit"
              className="add-reminder-btn"
            >
              Add Reminder
            </button>

          </form>

        </div>


        {/* ==================== REMINDER LIST ==================== */}

        <div className="reminders-list-card">

          <h2>Upcoming Reminders</h2>

          <p className="form-description">
            Reminders for the selected patient will appear here.
          </p>


          {!selectedPatient ? (

            <div className="empty-reminders">

              <div>🔔</div>

              <h3>Select a patient</h3>

              <p>
                Select a patient to view their reminders.
              </p>

            </div>

          ) : reminders.length === 0 ? (

            <div className="empty-reminders">

              <div>📅</div>

              <h3>No reminders yet</h3>

              <p>
                Add a reminder using the form.
              </p>

            </div>

          ) : (

            <div className="reminders-list">

              {reminders.map((reminder) => (

                <div
                  className="reminder-card"
                  key={reminder._id}
                >

                  <div className="reminder-icon">
                    {reminder.type === "medicine"
                      ? "💊"
                      : reminder.type === "appointment"
                      ? "🏥"
                      : reminder.type === "routine"
                      ? "🕐"
                      : "📌"}
                  </div>

                  <div className="reminder-details">

                    <h3>
                      {reminder.title}
                    </h3>

                    <p className="reminder-type">
                      {reminder.type}
                    </p>

                    <p>
                      📅{" "}
                      {new Date(
                        reminder.date
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      ⏰ {reminder.time}
                    </p>

                    {reminder.notes && (
                      <p>
                        📝 {reminder.notes}
                      </p>
                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Reminders;