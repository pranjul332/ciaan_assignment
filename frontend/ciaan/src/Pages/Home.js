import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faComment as regularComment } from "@fortawesome/free-regular-svg-icons";
import {
  faShare,
  faEllipsisH,
  faGlobeAmericas,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../Navbar";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:8000/post/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: response.data.likes,
                liked: response.data.liked,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:8000/post/${postId}/comment`,
        { text: commentText[postId] || "" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentText((prevCommentText) => ({
        ...prevCommentText,
        [postId]: "",
      }));

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  response.data.comments.slice(-1)[0],
                ],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const toggleComment = (postId) => {
    setOpenComments((prevOpenComments) => ({
      ...prevOpenComments,
      [postId]: !prevOpenComments[postId],
    }));
  };

  const handleSearchResults = (results) => {
    setPosts(results);
  };

  const formatTimeAgo = (date) => {
    // Simple time formatting - you can enhance this
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return postDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearchResults={handleSearchResults} />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto pt-20 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Feed</h1>
          <p className="text-gray-600">Stay updated with your network</p>
        </div>

        {/* Posts Container */}
        <div className="space-y-4">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Post Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`http://localhost:8000/${post.user.profilePicture}`}
                        alt={post.user.username}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg hover:text-blue-600 cursor-pointer">
                          {post.user.username}
                        </h3>
                        
                        
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <FontAwesomeIcon icon={faEllipsisH} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  {post.title && (
                    <h2 className="text-lg font-semibold text-gray-900 mb-3 leading-tight">
                      {post.title}
                    </h2>
                  )}

                  {post.discription && (
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {post.discription}
                    </p>
                  )}
                </div>

                {/* Media Content */}
                {(post.photo || post.video) && (
                  <div className="relative">
                    {post.photo && (
                      <img
                        src={`http://localhost:8000/${post.photo}`}
                        alt="Post content"
                        className="w-full max-h-96 object-cover"
                      />
                    )}
                    {post.video && (
                      <video
                        controls
                        className="w-full max-h-96 object-cover"
                        preload="metadata"
                      >
                        <source
                          src={`http://localhost:8000/${post.video}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                )}

                {/* Engagement Stats */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      {post.likes > 0 && (
                        <>
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mr-1">
                              <FontAwesomeIcon
                                icon={faHeart}
                                className="w-2 h-2 text-white"
                              />
                            </div>
                            <span>
                              {post.likes} {post.likes === 1 ? "like" : "likes"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      {Array.isArray(post.comments) &&
                        post.comments.length > 0 && (
                          <span>
                            {post.comments.length}{" "}
                            {post.comments.length === 1
                              ? "comment"
                              : "comments"}
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-around">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                        post.liked
                          ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={post.liked ? faHeart : regularHeart}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Like</span>
                    </button>

                    <button
                      onClick={() => toggleComment(post._id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                        openComments[post._id]
                          ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          openComments[post._id] ? faComment : regularComment
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Comment</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-200">
                      <FontAwesomeIcon icon={faShare} className="w-4 h-4" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>

                {/* Comment Section */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openComments[post._id]
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    {/* Comment Input */}
                    <div className="flex items-start space-x-3 pt-4">
                      <img
                        src={`http://localhost:8000/${post.user.profilePicture}`}
                        alt="Your avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText[post._id] || ""}
                            onChange={(e) =>
                              setCommentText((prev) => ({
                                ...prev,
                                [post._id]: e.target.value,
                              }))
                            }
                            className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (
                                e.key === "Enter" &&
                                commentText[post._id]?.trim()
                              ) {
                                handleCommentSubmit(post._id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleCommentSubmit(post._id)}
                            disabled={!commentText[post._id]?.trim()}
                            className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    {Array.isArray(post.comments) &&
                      post.comments.length > 0 && (
                        <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
                          {post.comments.map((comment, idx) => (
                            <div
                              key={idx}
                              className="flex items-start space-x-3"
                            >
                              <img
                                src={`http://localhost:8000/${comment.user.profilePicture}`}
                                alt={comment.user.username}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-semibold text-sm text-gray-900">
                                      {comment.user.username}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      •
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      2nd
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">
                                    {comment.text}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-4 mt-1 px-3">
                                  <button className="text-xs text-gray-500 hover:text-blue-600 font-medium">
                                    Like
                                  </button>
                                  <button className="text-xs text-gray-500 hover:text-blue-600 font-medium">
                                    Reply
                                  </button>
                                  <span className="text-xs text-gray-400">
                                    Just now
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    {Array.isArray(post.comments) &&
                      post.comments.length === 0 &&
                      openComments[post._id] && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-500">
                            No comments yet. Be the first to comment!
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faComment}
                  className="w-8 h-8 text-gray-400"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500">
                Start following people to see their posts in your feed.
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {Array.isArray(posts) && posts.length > 0 && (
          <div className="text-center py-8">
            <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors duration-200">
              Show more posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
