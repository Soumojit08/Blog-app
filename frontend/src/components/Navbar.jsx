import React, { useState } from "react";
import { Rss, LogOut, User, HomeIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import defaultPhoto from "../../public/avatar.png";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const isInProfilePage = location.pathname === "/profile";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const response = await axiosInstance.get(`/users/search?name=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a href="/">Homepage</a>
              </li>
              <li>
                <a
                  href="https://soumojit08.github.io/portfolio/"
                  target="_blank"
                >
                  Portfolio
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center flex items-center justify-between gap-2 font-semibold btn btn-ghost ">
          <Rss />
          <a className="text-xl">Blogify</a>
        </div>
        {authUser && (
          <div className="navbar-end">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-24 md:w-auto"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            {/* Add Profile Link */}
            {isInProfilePage ? (
              <Link to="/" className="btn btn-ghost btn-circle text-xl">
                <HomeIcon className="size-5" />
              </Link>
            ) : (
              <Link to="/profile" className="btn btn-ghost btn-circle text-xl">
                <User className="size-5" />
              </Link>
            )}

            {isInProfilePage ? (
              <button
                className="btn btn-ghost btn-circle text-xl"
                onClick={handleLogout}
              >
                <LogOut className="size-5" />
              </button>
            ) : (
              <button
                className="btn btn-ghost btn-circle text-xl"
                onClick={logout}
              >
                <LogOut className="size-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* search result  */}
      {searchResults.length > 0 && (
        <div className="absolute bg-base-300 shadow-lg rounded-md mt-2 w-80 p-2 text-lg capitalize left-3/4 ml-2 z-50">
          {searchResults.map((user) => (
            <Link
              to={`/profile/${user._id}`}
              key={user._id}
              className=" p-2 hover:bg-base-200 flex items-center justify-start"
            >
              <img
                src={defaultPhoto}
                alt={user.fullName}
                className="w-8 h-8 rounded-full mr-3"
              />
              <span>{user.fullName}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
