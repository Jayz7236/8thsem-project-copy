import React from 'react';
import Sidebar from './Sidebar';
const API_URL = import.meta.env.VITE_API_URL;

const Header = ({ children, activeItem }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Header */}
      <div className="bg-white shadow-sm py-2 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
        <div className="dropdown">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            Jazzy
          </button>
        </div>
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar activeItem={activeItem} />

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Header;
