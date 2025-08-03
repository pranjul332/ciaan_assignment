import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Registration = () => {
  const [registrationData, setRegistrationData] = useState({
    username: "",
    email: "",
    password: "",
    confpassword: "",
    gender: "",
  });

  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    if (registrationData.password !== registrationData.confpassword) {
      setStatus("Passwords do not match!");
      return;
    }
    if (registrationData.password.length < 8) {
      setStatus("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/registration",
        registrationData
      );
      const { success, message } = response.data;

      if (success) {
        // Automatically log in after successful registration
        await handleAutoLogin();
      } else if (message === "Email already registered") {
        setStatus("Email already registered");
      } else if (message === "Username already registered") {
        setStatus("Username already registered");
      }
    } catch (error) {
      setStatus("An error occurred during registration.");
    }
  };

  const handleAutoLogin = async () => {
    try {
      const loginData = {
        username: registrationData.username,
        password: registrationData.password,
      };

      const response = await axios.post(
        "http://localhost:8000/login",
        loginData
      );
      const { success, token } = response.data;

      if (success) {
        localStorage.setItem("authToken", token); // Store token in localStorage
        navigate("/profile"); // Redirect to profile page
      } else {
        setStatus("Automatic login failed.");
      }
    } catch (error) {
      setStatus("Error during automatic login.");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen  bg-gray-300">
      <form
        onSubmit={handleRegistrationSubmit}
        className="relative z-10 space-y-6 px-6 py-8 border rounded-lg text-base bg-white/80 backdrop-blur-md shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Registration
        </h1>

        {/* Username Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Username:
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={registrationData.username}
            onChange={handleRegistrationChange}
            required
            className="p-2 border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={registrationData.email}
            onChange={handleRegistrationChange}
            required
            className="p-2 border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={registrationData.password}
              onChange={handleRegistrationChange}
              required
              className="p-2 w-full border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            />
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Confirm Password:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="confpassword"
            placeholder="Confirm your password"
            value={registrationData.confpassword}
            onChange={handleRegistrationChange}
            required
            className="p-2 border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        {/* Gender Selection */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">Gender:</label>
          <select
            name="gender"
            value={registrationData.gender}
            onChange={handleRegistrationChange}
            required
            className="p-2 border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Status Message */}
        {status && (
          <p
            className={`text-center ${
              status.includes("successful") ? "text-green-500" : "text-red-500"
            }`}
          >
            {status}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-2">
          Already registered?
          <Link to="/login" className="text-blue-500 hover:underline ml-2">
            Login here
          </Link>
        </p>
      </form>

      {/* Background Decorative Circles */}
      <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-white/30 to-white blur-2xl top-12 left-16"></div>
      <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-white/30 to-white blur-2xl bottom-28 right-16"></div>
    </div>
  );
};

export default Registration;
