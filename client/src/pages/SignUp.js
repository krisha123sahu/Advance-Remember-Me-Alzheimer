import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );

      alert(response.data.message);

      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-card">

        <div className="signup-header">

          <div className="signup-icon">
            💙
          </div>

          <h1>
            Create Account
          </h1>

          <p>
            Join Remember Me and make care simpler.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* Email */}
          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Password */}
          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          {/* Account Type */}
          <div className="form-group">

            <label>
              Account Type
            </label>

            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              required
            >

              <option value="">
                Select account type
              </option>

              <option value="patient">
                Patient
              </option>

              <option value="caregiver">
                Caregiver
              </option>

              <option value="family">
                Family Member
              </option>

            </select>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="signup-submit"
          >
            Create Account
          </button>

        </form>

        <p className="login-text">

          Already have an account?

          <Link to="/login">
            {" "}Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default SignUp;