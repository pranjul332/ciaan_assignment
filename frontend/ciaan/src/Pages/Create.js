import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faVideo,
  faGlobeAmericas,
  faUsers,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBars,
  faTimes,
  faPlus,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Sidebar";

const Create = () => {
  const [create, setCreate] = useState({
    title: "",
    discription: "",
    photo: null,
    video: null,
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [visibility, setVisibility] = useState("public");
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchCurrentUser(token);
    }
  }, [navigate]);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/profile-picture",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setCreate((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", create.title);
      formData.append("discription", create.discription);
      if (create.photo) formData.append("photo", create.photo);
      if (create.video) formData.append("video", create.video);

      const response = await axios.post(
        "http://localhost:8000/Create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { success, message } = response.data;

      if (success) {
        console.log("Post created successfully:", message);
        navigate("/");
      } else {
        console.log("Failed to create post:", message);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }

    setCreate({
      title: "",
      discription: "",
      photo: null,
      video: null,
    });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const removeFile = (type) => {
    setCreate((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Create Post</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <FontAwesomeIcon
                icon={isSidebarOpen ? faTimes : faBars}
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Render Sidebar */}
      {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Post Creator Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    currentUser?.profilePicture
                      ? `http://localhost:8000/${currentUser.profilePicture}`
                      : "/default-avatar.png"
                  }
                  alt="Your avatar"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {currentUser?.username || "User"}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() =>
                        setVisibility(
                          visibility === "public" ? "connections" : "public"
                        )
                      }
                      className="flex items-center space-x-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors duration-200"
                    >
                      <FontAwesomeIcon
                        icon={
                          visibility === "public" ? faGlobeAmericas : faUsers
                        }
                        className="w-3 h-3"
                      />
                      <span className="capitalize">{visibility}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Form */}
            <form onSubmit={handleSubmit}>
              {/* Title Input */}
              <div className="p-4 border-b border-gray-100">
                <input
                  type="text"
                  name="title"
                  value={create.title}
                  onChange={handleCreateChange}
                  placeholder="Add a title for your post..."
                  className="w-full text-lg font-medium placeholder-gray-500 border-none focus:outline-none resize-none bg-transparent"
                />
              </div>

              {/* Content Input */}
              <div className="p-4">
                <textarea
                  name="discription"
                  value={create.discription}
                  onChange={handleCreateChange}
                  placeholder="What do you want to talk about?"
                  className="w-full h-32 text-gray-700 placeholder-gray-500 border-none focus:outline-none resize-none bg-transparent text-base leading-relaxed"
                />
              </div>

              {/* Media Preview */}
              {(create.photo || create.video) && (
                <div className="px-4 pb-4">
                  <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                    {create.photo && (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(create.photo)}
                          alt="Preview"
                          className="w-full max-h-96 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("photo")}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all duration-200"
                        >
                          <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {create.video && (
                      <div className="relative">
                        <video
                          controls
                          className="w-full max-h-96 object-cover"
                          preload="metadata"
                        >
                          <source
                            src={URL.createObjectURL(create.video)}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                        <button
                          type="button"
                          onClick={() => removeFile("video")}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all duration-200"
                        >
                          <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {/* Image Upload */}
                    <label className="cursor-pointer p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200">
                      <FontAwesomeIcon icon={faImage} className="w-5 h-5" />
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>

                    {/* Video Upload */}
                    <label className="cursor-pointer p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200">
                      <FontAwesomeIcon icon={faVideo} className="w-5 h-5" />
                      <input
                        type="file"
                        name="video"
                        accept="video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>

                    {/* Emoji Button (placeholder) */}
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                    >
                      <FontAwesomeIcon icon={faSmile} className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Button */}
                  <button
                    type="submit"
                    disabled={
                      !create.title.trim() && !create.discription.trim()
                    }
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Tips Card */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Tips for great posts
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  Share authentic, valuable content that resonates with your
                  network
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Add relevant hashtags to increase discoverability</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Include compelling visuals to boost engagement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
