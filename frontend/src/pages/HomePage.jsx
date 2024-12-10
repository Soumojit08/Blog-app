import React from "react";
import PostList from "../components/PostList";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-base-200 min-h-screen p-4">
      <PostList />
      <div className="fixed bottom-12 right-12">
        <button
          className="btn btn-primary rounded-full w-16 h-16 flex items-center justify-center shadow-lg"
          onClick={() => navigate("/posts")} // Navigate to PostFormPage
        >
          <span className="text-6xl">
            <Plus />
          </span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
