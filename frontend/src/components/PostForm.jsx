import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import {toast} from "react-hot-toast"

const PostForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/posts", {
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()), // Convert tags to an array
      });
      console.log("Post created:", response.data);
      toast.success("Post Uploaded Successfully")
      // Reset the form fields
      setTitle("");
      setContent("");
      setTags("");
      if (onClose) onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form mb-4">
      <h2 className="text-2xl font-bold">Create a New Post</h2>
      <div className="form-control mb-2">
        <label className="label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="form-control mb-2">
        <label className="label">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea textarea-bordered w-full"
          required
        />
      </div>
      <div className="form-control mb-2">
        <label className="label">Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Create Post
      </button>
    </form>
  );
};

export default PostForm;
