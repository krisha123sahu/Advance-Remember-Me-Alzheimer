import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Save JWT token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert(response.data.message);

      navigate("/dashboard");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <div className="login-icon">
            💙
          </div>

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to continue to Remember Me.
          </p>

        </div>


        <form onSubmit={handleSubmit}>

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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>


          {/* Forgot Password */}
          <div className="forgot-password">
            Forgot Password?
          </div>


          {/* Login Button */}
          <button
            type="submit"
            className="login-submit"
          >
            Login
          </button>

        </form>


        <p className="signup-text">

          Don't have an account?

          <Link to="/signup">
            {" "}Sign Up
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;