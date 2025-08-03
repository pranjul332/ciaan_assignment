import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sidebar from "./Sidebar";
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

// Enhanced Navbar Component
const Navbar = ({ onSearchResults }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/posts?search=${searchQuery}`
      );
      onSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <>
      <nav className="bg-white border-b-2 border-gray-200 shadow-lg py-3 px-6 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300"
            >
              SocialApp
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div
                className={`relative transition-all duration-300 ${
                  isSearchFocused ? "scale-105" : ""
                }`}
              >
                <input
                  type="text"
                  placeholder="Search posts by title..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition-colors duration-300 text-sm font-medium"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </Link>

            <Link
              to="/About"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              <span>About</span>
            </Link>

            <Link
              to="/Create"
              className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 font-medium px-4 py-2 rounded-lg"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Create</span>
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-300 focus:outline-none"
            >
              <FontAwesomeIcon
                icon={isSidebarOpen ? faTimes : faBars}
                className="text-xl"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Render Sidebar */}
      {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}
    </>
  );
};
export default Navbar;
