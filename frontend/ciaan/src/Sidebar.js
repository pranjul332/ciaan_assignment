
// Enhanced Sidebar Component
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faSearch,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faHome,
  faInfoCircle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Sidebar = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: "",
    profilePicture: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const [usernameResponse, profilePictureResponse] = await Promise.all([
        axios.get("http://localhost:8000/username", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8000/profile-picture", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUserProfile({
        username: usernameResponse.data.username,
        profilePicture: profilePictureResponse.data.profilePicture,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    navigate("/Login");
    onClose();
  };

  const handleSignIn = () => {
    navigate("/Login");
    onClose();
  };

  const handleProfileClick = () => {
    navigate("/Profile");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out z-50 w-80 border-l-2 border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-300 p-2"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>

          <h2 className="text-xl font-bold mb-2">Menu</h2>
          <p className="text-blue-100 text-sm">
            Navigate through your social experience
          </p>
        </div>

        {/* User Profile Section */}
        {isAuthenticated && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div
              onClick={handleProfileClick}
              className="flex items-center space-x-4 cursor-pointer hover:bg-white p-3 rounded-lg transition-colors duration-300"
            >
              {userProfile.profilePicture ? (
                <img
                  src={`http://localhost:8000/${userProfile.profilePicture}`}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-white text-lg"
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">
                  {userProfile.username || "User"}
                </p>
                <p className="text-sm text-gray-500">View your profile</p>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={isAuthenticated ? handleSignOut : handleSignIn}
            className={`w-full flex items-center justify-center space-x-3 p-3 rounded-lg font-medium transition-all duration-300 ${
              isAuthenticated
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <FontAwesomeIcon
              icon={isAuthenticated ? faSignOutAlt : faSignInAlt}
              className="text-lg"
            />
            <span>{isAuthenticated ? "Sign Out" : "Sign In"}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
