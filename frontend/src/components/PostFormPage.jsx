import React from "react";
import PostForm from "../components/PostForm";
import { useNavigate } from "react-router-dom";

const PostFormPage = () => {
  const navigate = useNavigate();

  const handlePostSubmit = () => {
    // Redirect to the homepage after post submission
    navigate("/");
  };

  return (
    <div className="p-4">
      <PostForm onClose={handlePostSubmit} />
    </div>
  );
};

export default PostFormPage;
