import { Route, Routes, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";

import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import Profile from "./pages/Profile";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import UserProfile from "./components/UserProfile";
import PostFormPage from "./components/PostFormPage";
import YourPosts from "./components/YourPost";
import UpdatePost from "./components/UpdatePost";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div className="max-h-screen overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostFormPage />} />
        <Route path="/your-posts" element={<YourPosts />} />
        <Route path="/posts/:postId" element={<UpdatePost />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
