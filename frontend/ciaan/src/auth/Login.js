import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../index.css";

const Login = () => {
  const [LoginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        LoginData
      );
      const { success, message, token } = response.data;

      if (success) {
        localStorage.setItem("authToken", token); // Store token in localStorage
        setStatus({ message: "Login successful", type: "success" });
        navigate("/profile");
      } else {
        setStatus({ message, type: "error" });
      }
    } catch (error) {
      setStatus({ message: "An error occurred during login", type: "error" });
    }

    setLoginData({
      username: "",
      password: "",
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-300 ">
      <form
        onSubmit={handleLoginSubmit}
        className="relative z-10 space-y-10 px-8 py-12 border rounded-lg text-lg bg-white/80 backdrop-blur-md shadow-xl w-full max-w-md"
      >
        <h1 className="text-4xl font-bold text-center text-gray-800">Login</h1>

        {/* Username Field */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-semibold text-gray-700"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={LoginData.username}
            onChange={handleLoginChange}
            required
            className="p-3 border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-gray-700"
          >
            Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={LoginData.password}
              onChange={handleLoginChange}
              required
              className="p-3 w-full border-2 border-gray-300 rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Status Message */}
        {status.message && (
          <p
            className={`mt-4 text-center ${
              status.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {status.message}
          </p>
        )}

        {/* Registration Link */}
        <p className="text-center text-gray-600">
          Not registered yet?
          <Link
            to="/registration"
            className="text-blue-500 ml-2 hover:underline"
          >
            Register Here
          </Link>
        </p>
      </form>

      {/* Background Decorative Circles */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-white/30 to-white blur-2xl top-10 left-16"></div>
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-white/30 to-white blur-2xl bottom-24 right-16"></div>
    </div>
  );
};

export default Login;
