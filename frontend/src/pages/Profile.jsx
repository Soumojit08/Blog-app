import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import defaultAvatar from "../../public/avatar.png";
import { Camera, LinkIcon } from "lucide-react";
import { axiosInstance } from "../lib/axios"; // Ensure axiosInstance is imported

export default function Profile() {
  const { authUser, updateProfile, updateProfilePhoto, isUpdatingProfile } =
    useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    bio: authUser?.bio || "",
    links: authUser?.links || "",
  });
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await updateProfilePhoto(file);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return defaultAvatar;
    if (photoPath.startsWith("http")) return photoPath;
    return `${import.meta.env.VITE_BACKEND_URL}${photoPath}`;
  };

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const res = await axiosInstance.get("/auth/followers");
      setFollowers(res.data);
    };

    const fetchFollowing = async () => {
      const res = await axiosInstance.get("/auth/following");
      setFollowing(res.data);
    };

    fetchFollowers();
    fetchFollowing();
  }, []);

  const handleFollow = async (userId) => {
    await axiosInstance.post(`/auth/follow/${userId}`);
    setFollowing((prev) => [...prev, userId]);
  };

  const handleUnfollow = async (userId) => {
    await axiosInstance.post(`/auth/unfollow/${userId}`);
    setFollowing((prev) => prev.filter((id) => id !== userId));
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center mb-6">
              {authUser?.fullName}'s Profile
            </h2>

            {/* Profile Photo Section */}
            <div className="flex justify-between px-4 items-center mb-6">
              <div className="relative">
                <div className="avatar">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={getPhotoUrl(authUser?.profilePhoto)}
                      alt="Profile"
                      className="object-cover"
                      onClick={handlePhotoClick}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultAvatar;
                      }}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-circle btn-sm absolute bottom-0 right-0 bg-primary text-white"
                  onClick={handlePhotoClick}
                >
                  <Camera size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>

              <div>
                <p className="text-lg font-semibold">Followers</p>
                <div>{followers.length}</div>
              </div>
              <div>
                <p className="text-lg font-semibold">Following</p>
                <div>{following.length}</div>
              </div>

              {/* Links Section */}
              <div>
                <p className="text-lg font-semibold">Links</p>
                {authUser?.links && authUser.links.startsWith("http") ? (
                  <a
                    href={authUser.links}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <LinkIcon className="size-5 cursor-pointer" />
                  </a>
                ) : (
                  <span>No valid links available</span>
                )}
              </div>
            </div>

            {/* Profile Information */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Full Name"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Email"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    className="textarea input-bordered w-full"
                    placeholder="Bio"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Link</span>
                  </label>
                  <input
                    type="text"
                    value={formData.links}
                    onChange={(e) =>
                      setFormData({ ...formData, links: e.target.value })
                    }
                    className="textarea input-bordered w-full"
                    placeholder="Link of your portfolio"
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <div className="input input-bordered flex items-center">
                    {authUser?.fullName}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <div className="input input-bordered flex items-center">
                    {authUser?.bio}
                  </div>
                </div>

                <div className="divider"></div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text text-lg">Member Since</span>
                      </label>
                      <div className="text-sm pl-1">
                        {formatDate(authUser?.createdAt)}
                      </div>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text text-lg">
                          Account Status
                        </span>
                      </label>
                      <div className="badge badge-success">Active</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
