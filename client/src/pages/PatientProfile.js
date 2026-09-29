import { useState } from "react";
import axios from "axios";
import "./PatientProfile.css";

function PatientProfile() {
  const [patientData, setPatientData] = useState({
    name: "",
    dateOfBirth: "",
    emergencyContact: "",
    address: "",
    importantNotes: "",
  });

  const handleChange = (e) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get JWT token from browser
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/patients/add",
        patientData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      // Clear form after successful save
      setPatientData({
        name: "",
        dateOfBirth: "",
        emergencyContact: "",
        address: "",
        importantNotes: "",
      });

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to save patient information."
      );
    }
  };

  return (
    <div className="patient-profile-page">

      {/* Header */}
      <div className="profile-page-header">

        <div>
          <p className="profile-tagline">
            PATIENT INFORMATION
          </p>

          <h1>
            Patient Profile 💙
          </h1>

          <p>
            Keep important patient information safe and organized.
          </p>
        </div>

        <div className="profile-header-icon">
          👤
        </div>

      </div>


      {/* Profile Form */}
      <div className="profile-form-card">

        <h2>
          Basic Information
        </h2>

        <p className="form-description">
          Enter the patient's important details below.
        </p>


        <form onSubmit={handleSubmit}>

          {/* Patient Name */}
          <div className="form-group">

            <label>
              Patient Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter patient name"
              value={patientData.name}
              onChange={handleChange}
              required
            />

          </div>


          {/* Date of Birth */}
          <div className="form-group">

            <label>
              Date of Birth
            </label>

            <input
              type="date"
              name="dateOfBirth"
              value={patientData.dateOfBirth}
              onChange={handleChange}
            />

          </div>


          {/* Emergency Contact */}
          <div className="form-group">

            <label>
              Emergency Contact
            </label>

            <input
              type="tel"
              name="emergencyContact"
              placeholder="Enter emergency contact number"
              value={patientData.emergencyContact}
              onChange={handleChange}
            />

          </div>


          {/* Address */}
          <div className="form-group">

            <label>
              Address
            </label>

            <textarea
              name="address"
              placeholder="Enter patient's address"
              value={patientData.address}
              onChange={handleChange}
              rows="3"
            />

          </div>


          {/* Important Notes */}
          <div className="form-group">

            <label>
              Important Notes
            </label>

            <textarea
              name="importantNotes"
              placeholder="Add important information about the patient..."
              value={patientData.importantNotes}
              onChange={handleChange}
              rows="5"
            />

          </div>


          {/* Save Button */}
          <button
            type="submit"
            className="save-profile-btn"
          >
            Save Patient Information
          </button>

        </form>

      </div>

    </div>
  );
}

export default PatientProfile;