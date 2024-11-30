import React from "react";
import { Rss, LogOut, User, HomeIcon } from "lucide-react"; // Add User import
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom"; // Add this import

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  const isInProfilePage = location.pathname === "/profile";

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

            <button
              className="btn btn-ghost btn-circle text-xl"
              onClick={logout}
            >
              <LogOut className="size-5" />
            </button>

            <button className="btn btn-ghost btn-circle text-xl">
              <div className="indicator">
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="badge badge-xs badge-primary indicator-item hidden"></span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
