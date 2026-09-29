import { useEffect, useState } from "react";
import axios from "axios";
import "./MemoryPeople.css";

function MemoryPeople() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");

  const [personData, setPersonData] = useState({
    name: "",
    relation: "",
    contact: "",
    importantInfo: "",
  });

  const [people, setPeople] = useState([]);

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
      console.log("Patient fetch error:", error);
      setPatients([]);
    }
  };


  // ==================== GET PEOPLE ====================

  const fetchPeople = async (patientId) => {
    if (!patientId) {
      setPeople([]);
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/persons/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPeople(response.data.people);

    } catch (error) {
      console.log("People fetch error:", error);
      setPeople([]);
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

    fetchPeople(patientId);
  };


  // ==================== INPUT CHANGE ====================

  const handleChange = (e) => {
    setPersonData({
      ...personData,
      [e.target.name]: e.target.value,
    });
  };


  // ==================== ADD PERSON ====================

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
        "http://localhost:5000/api/persons/add",
        {
          ...personData,
          patientId: selectedPatient,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      setPersonData({
        name: "",
        relation: "",
        contact: "",
        importantInfo: "",
      });

      fetchPeople(selectedPatient);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to save person information."
      );
    }
  };


  return (
    <div className="memory-people-page">

      {/* Header */}
      <div className="memory-page-header">

        <div>
          <p className="memory-tagline">
            MEMORY & PEOPLE
          </p>

          <h1>
            People Who Matter 💙
          </h1>

          <p>
            Keep important people and their information organized.
          </p>
        </div>

        <div className="memory-header-icon">
          👨‍👩‍👧
        </div>

      </div>


      {/* Main Content */}
      <div className="memory-content">

        {/* Add Person Form */}
        <div className="person-form-card">

          <h2>
            Add Important Person
          </h2>

          <p className="form-description">
            Add someone important to the patient's life.
          </p>


          <form onSubmit={handleSubmit}>

            {/* Select Patient */}
            <div className="form-group">

              <label>
                Select Patient
              </label>

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


            {/* Name */}
            <div className="form-group">

              <label>
                Person Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter person's name"
                value={personData.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* Relation */}
            <div className="form-group">

              <label>
                Relation
              </label>

              <select
                name="relation"
                value={personData.relation}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select relation
                </option>

                <option value="mother">
                  Mother
                </option>

                <option value="father">
                  Father
                </option>

                <option value="spouse">
                  Spouse
                </option>

                <option value="son">
                  Son
                </option>

                <option value="daughter">
                  Daughter
                </option>

                <option value="brother">
                  Brother
                </option>

                <option value="sister">
                  Sister
                </option>

                <option value="friend">
                  Friend
                </option>

                <option value="caregiver">
                  Caregiver
                </option>

                <option value="other">
                  Other
                </option>

              </select>

            </div>


            {/* Contact */}
            <div className="form-group">

              <label>
                Contact Number
              </label>

              <input
                type="tel"
                name="contact"
                placeholder="Enter contact number"
                value={personData.contact}
                onChange={handleChange}
              />

            </div>


            {/* Important Information */}
            <div className="form-group">

              <label>
                Important Information
              </label>

              <textarea
                name="importantInfo"
                placeholder="Add information that may help the patient remember this person..."
                value={personData.importantInfo}
                onChange={handleChange}
                rows="5"
              />

            </div>


            {/* Add Button */}
            <button
              type="submit"
              className="add-person-btn"
            >
              Add Person
            </button>

          </form>

        </div>


        {/* People List */}
        <div className="people-list-card">

          <h2>
            Important People
          </h2>

          <p className="form-description">
            People added for the selected patient will appear here.
          </p>


          {!selectedPatient ? (

            <div className="empty-people">

              <div>
                👥
              </div>

              <h3>
                Select a patient
              </h3>

              <p>
                Select a patient to view important people.
              </p>

            </div>

          ) : people.length === 0 ? (

            <div className="empty-people">

              <div>
                👥
              </div>

              <h3>
                No people added yet
              </h3>

              <p>
                Add an important person using the form.
              </p>

            </div>

          ) : (

            <div className="people-list">

              {people.map((person) => (

                <div
                  className="person-card"
                  key={person._id}
                >

                  <div className="person-icon">
                    👤
                  </div>

                  <div className="person-details">

                    <h3>
                      {person.name}
                    </h3>

                    <p>
                      {person.relation}
                    </p>

                    {person.contact && (
                      <p>
                        📞 {person.contact}
                      </p>
                    )}

                    {person.importantInfo && (
                      <p>
                        📝 {person.importantInfo}
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

export default MemoryPeople;