"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

interface NavbarProps {
  role?: "STUDENT" | "TEACHER" | "ADMIN";
}

export function Navbar({ role = "STUDENT" }: NavbarProps) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const getRoleBadge = () => {
    switch (role) {
      case "TEACHER":
        return (
          <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
            Teacher
          </span>
        );
      case "ADMIN":
        return (
          <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
            Admin
          </span>
        );
      default:
        return (
          <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
            Student
          </span>
        );
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left Side - Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">📚</span>
          </div>
          <span className="font-bold text-xl text-gray-900">Toilet Hero</span>
          {getRoleBadge()}
        </div>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-6">
          {/* User Info */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-900">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-600">{session?.user?.email}</p>
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center hover:bg-blue-700 transition"
            >
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {session?.user?.email}
                  </p>
                </div>

                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded font-semibold transition"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out Button (Mobile) */}
          <button
            onClick={handleLogout}
            className="sm:hidden px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
