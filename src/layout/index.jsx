import React, { useState } from "react";
import Footer from "../components/Footer";
import Sidebar from "../components/sidebar";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex max-h-screen">
      {/* Sidebar for large screens */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Navbar for small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 shadow-md z-50 flex items-center justify-between p-4">
        <h1 className="text-lg font-bold">Chat Now</h1>
        <button
          className="text-gray-700 focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={28} className="text-gray-800 dark:text-gray-100" />
        </button>
      </div>

      {/* Sidebar as a drawer on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transform ease-in-out duration-300 z-50"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="w-64 bg-white h-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-y-scroll mt-16 lg:mt-0">
        {/* Chat Header */}
        <div className="hidden fixed lg:flex md:justify-between p-4 bg-white dark:bg-slate-900 dark:shadow-slate-400 shadow-md w-full ">
          <h2 className="text-lg font-semibold">Awura Chat</h2>
          {/* <button className="text-blue-500">Messages</button> */}
        </div>
        <main className="flex-grow container md:pt-16">
          <Outlet />
        </main>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
