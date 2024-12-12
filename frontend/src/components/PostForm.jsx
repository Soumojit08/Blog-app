import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const PostForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append(
      "tags",
      tags.split(",").map((tag) => tag.trim())
    );
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      const response = await axiosInstance.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Post created successfully!");
      onClose(); // Call the onClose function to navigate back
    } catch (error) {
      console.error("Error creating post:", response.data);
      toast.error("Failed to create post.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <div className="form-control mb-2">
        <label className="label">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="input input-bordered w-full"
        />
      </div>
      <div className="form-control mb-2">
        <label className="label">Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
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
