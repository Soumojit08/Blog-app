import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Signup failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.patch("/auth/profile", formData);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Profile update failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateProfilePhoto: async (photoFile) => {
    try {
      const formData = new FormData();
      formData.append("photo", photoFile);

      const res = await axiosInstance.patch("/auth/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      if (res.status === 200) {
        set({ authUser: res.data });
        toast.success("Profile photo updated successfully");
      } else {
        throw new Error(`Failed to update profile photo`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile photo"
      );
    }
  },
}));
