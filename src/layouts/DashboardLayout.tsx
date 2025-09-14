import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../features/dashboard/pages/Sidebar";
import { useState } from "react";

export default function DashboardLayout() {
  const [activeSidebar, setActiveSidebar] = useState(false);

  return (
    <div className="flex h-screen relative">

      {/* Sidebar */}
      <div
        className={`bg-blue-950 text-white shrink-0 transition-all duration-300 
          ${activeSidebar ? "block" : "hidden"} 
          ${activeSidebar ? "absolute inset-0 w-64 z-50 md:relative" : "md:w-64"}`}
      >
        <Sidebar setActiveSidebar={setActiveSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          setActiveSidebar={setActiveSidebar}
          activeSidebar={activeSidebar}
        />
        <div className="p-4 overflow-auto bg-gray-100 h-screen">
          <Outlet /> {/* Table or any other page */}
        </div>
      </div>


    </div>
  );
}
