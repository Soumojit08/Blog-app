import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/users/follow/${userId}`);
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h1>{user.fullName}</h1>
      <img
        src={`http://localhost:3001/${user.profilePhoto}`}
        alt={user.fullName}
      />
      <p>{user.bio}</p>
      <button onClick={handleFollow} disabled={isFollowing}>
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default UserProfile;
