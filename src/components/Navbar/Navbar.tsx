'use client';

import { RiMenuFill, RiMenuUnfold4Line } from 'react-icons/ri';
import { useDrawer } from '../Drawer/useDrawer';

export const Navbar = () => {
  const toggleDrawer = useDrawer((s) => s.toggleDrawer);
  const isOpen = useDrawer((s) => s.isDrawerOpen);

  return (
    <div className="navbar bg-base-100 px-4 shadow">
      <div className="flex-none">
        <button
          className="btn btn-ghost btn-square"
          aria-label="open drawer"
          onClick={toggleDrawer}
        >
          {isOpen ? <RiMenuUnfold4Line size={24} /> : <RiMenuFill size={24} />}
        </button>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>

      <div className="flex-none gap-2">
        <button className="btn btn-ghost btn-square rounded-full">
          <span className="text-xl">🇺🇸</span>
        </button>

        <button className="btn btn-ghost btn-square">🎨</button>

        <button className="btn btn-ghost btn-square">
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
              d="M10 6h10M10 12h10M10 18h10M4 6h.01M4 12h.01M4 18h.01"
            />
          </svg>
        </button>

        {/* Notifications */}
        <button className="btn btn-ghost btn-square">
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
                d="M15 17h5l-1.405-1.405M19 13V8a7 7 0 10-14 0v5l-1.405 1.405M4 17h16"
              />
            </svg>
            <span className="badge badge-xs badge-error indicator-item"></span>
          </div>
        </button>

        {/* Avatar */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-8 rounded-full">
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=Denish"
                alt="avatar"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <div>
                <span className="font-semibold">Denish</span>
                <span className="text-sm opacity-70">Team</span>
              </div>
            </li>
            <li>
              <a>Profile</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
