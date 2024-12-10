import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="post-list grid grid-cols-1 gap-4">
      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="post-card bg-base-100 shadow-md rounded-lg p-4 transition-transform transform hover:scale-95" // Adjusted scale
          >
            <h3 className="text-xl font-semibold text-gray-200">
              {post.title}
            </h3>
            <p className="text-gray-300">{post.content}</p>
            <p className="text-gray-600">By {post.author.fullName}</p>
            <p className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;
