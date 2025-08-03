import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PencilIcon } from '@heroicons/react/24/outline'; // Import Heroicon

const Profile = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [file, setFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
            fetchUserPosts(token);
            fetchProfilePicture(token);
            fetchUsername(token); // Fetch username
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const fetchUserPosts = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/Profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchProfilePicture = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/profile-picture', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.profilePicture) {
                setProfilePicture(response.data.profilePicture);
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };

    const fetchUsername = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/username', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsername(response.data.username);
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    const handleSignIn = () => {
        navigate("/Login");
    };

    const handleSignOut = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate("/Login");
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleProfilePictureUpload = async () => {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            await axios.post('http://localhost:8000/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            fetchProfilePicture(token); // Refresh profile picture after upload
            setIsEditing(false); // Exit editing mode after upload
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    };

    const handleEditButtonClick = () => {
        setIsEditing(!isEditing); // Toggle editing mode
    };

    return (
        <div className="pt-16 p-8 bg-white shadow-md rounded-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                {!isAuthenticated ? (
                    <button
                        onClick={handleSignIn}
                        className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-300"
                    >
                        Sign-In
                    </button>
                ) : (
                    <button
                        onClick={handleSignOut}
                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                    >
                        Sign-out
                    </button>
                )}
            </div>

            {isAuthenticated && (
                <div className="relative mb-6 text-center">
                    {profilePicture ? (
                        <div className="relative inline-block right-[40%]">
                            <img
                                src={`http://localhost:8000/${profilePicture}`}
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full border border-gray-300 mb-4"
                            />
                            <button
                                onClick={handleEditButtonClick}
                                className="absolute top-0 right-0 bg-blue-500 text-white rounded-full p-2 m-2 hover:bg-blue-600 transition-colors duration-300"
                            >
                                <PencilIcon className="w-6 h-6" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-500">No profile picture set.</p>
                            <button
                                onClick={handleEditButtonClick}
                                className="mt-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                            >
                                Upload Profile Picture
                            </button>
                        </div>
                    )}

                    {username && (
                        <p className="relative mt-2 text-lg font-semibold right-[40%]">{username}</p>
                    )}

                    {isEditing && profilePicture && (
                        <div className="flex flex-col items-center mb-6">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mb-4"
                            />
                            <button
                                onClick={handleProfilePictureUpload}
                                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                            >
                                Upload Profile Picture
                            </button>
                        </div>
                    )}
                </div>
            )}
<div className='flex flex-col-reverse'>
            {posts.length === 0 ? (
                <p className="text-gray-500">No posts available.</p>
            ) : (
                posts.map((post, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                        
                        {post.photo && (
                            <div className="mb-4">
                                <img
                                    src={`http://localhost:8000/${post.photo}`}
                                    alt="User uploaded"
                                    className="w-full max-w-xs h-auto border border-gray-300 rounded-md"
                                />
                            </div>
                        )}
                        {post.video && (
                            <div>
                                <video
                                    controls
                                    className="w-full max-w-xs h-auto border border-gray-300 rounded-md"
                                >
                                    <source
                                        src={`http://localhost:8000/${post.video}`}
                                        type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                        <p className="mb-4">{post.discription}</p>
                    </div>
                    
                ))
            )}
            </div>
        </div>
    );
};

export default Profile;
