import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to fetch post.");
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/posts/${postId}`, post);
      toast.success("Post updated successfully.");
      navigate("/your-posts");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-2xl font-bold mb-4">Update Post</h2>
      <div className="form-control mb-2">
        <label className="label">Title</label>
        <input
          type="text"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="form-control mb-2">
        <label className="label">Content</label>
        <textarea
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          className="textarea textarea-bordered w-full"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Update Post
      </button>
    </form>
  );
};

export default UpdatePost;
