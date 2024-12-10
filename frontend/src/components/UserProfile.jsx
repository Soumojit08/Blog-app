import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Loader } from "lucide-react";
import defaultAvtar from "../../public/avatar.png";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
        const followingResponse = await axiosInstance.get(`/auth/following`);
        const followingIds = followingResponse.data.map(
          (followedUser) => followedUser._id
        );
        setIsFollowing(followingIds.includes(userId));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await axiosInstance.post(`/auth/unfollow/${userId}`);
        setIsFollowing(false);
      } else {
        await axiosInstance.post(`/auth/follow/${userId}`);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4 bg-base-300 h-screen ">
      <div className="card w-96 bg-base-200 shadow-xl items-center">
        <div className="avtar mt-4">
          <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
            <img
              className="object-cover w-full h-full max-w-full max-h-full"
              src={
                user.profilePhoto
                  ? `http://localhost:3001${user.profilePhoto}`
                  : defaultAvtar
              }
            />
          </div>
        </div>
        <div className="card-body text-center justify-center">
          <h2 className="card-title capitalize justify-center">
            {user.fullName}
          </h2>
          <p className="text-gray-600">{user.bio}</p>
          <div className="card-actions justify-center">
            <button
              className={`btn ${isFollowing ? "btn-active" : "btn-primary"}`}
              onClick={handleFollow}
              disabled={loading}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
