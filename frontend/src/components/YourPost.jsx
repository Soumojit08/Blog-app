import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore"; // Adjust the import based on your store setup
import { useNavigate } from "react-router-dom";

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const { authUser } = useAuthStore(); // Get the authenticated user
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get(
          `/posts?author=${authUser._id}`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to fetch posts");
      }
    };

    fetchPosts();
  }, [authUser]);

  const handleDeletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId)); // Remove the deleted post from the state
      toast.success("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleUpdatePost = (postId) => {
    navigate(`/posts/${postId}`); // Navigate to the update post page
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="post-card bg-base-100 shadow-md rounded-lg p-4 mb-4"
          >
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p>{post.content}</p>
            <div className="flex justify-between">
              <button
                className="btn btn-secondary"
                onClick={() => handleUpdatePost(post._id)}
              >
                Update
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeletePost(post._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default YourPosts;
