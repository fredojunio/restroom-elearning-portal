"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Camera, Loader2, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  role?: "STUDENT" | "TEACHER" | "ADMIN";
}

export function Navbar({ role = "STUDENT" }: NavbarProps) {
  const { data: session, update } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB.");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;

        const response = await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        if (response.ok) {
          await update({ image: base64 });
        } else {
          const errorData = await response.json();
          alert(`Failed to upload image: ${errorData.error || "Unknown error"}`);
        }
        setUploading(false);
      };
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
    }
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
    <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Left Side - Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200 group-hover:rotate-12 transition-transform">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tighter text-slate-900 leading-none uppercase">Toilet Hero</span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-sky-500">Academy Portal</span>
          </div>
          {getRoleBadge()}
        </Link>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-6">
          {/* User Info & Upload Trigger */}
          <div className="hidden sm:flex items-center gap-4 text-right">
            <div className="flex flex-col items-end">
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {session?.user?.name}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                {session?.user?.email}
              </p>
            </div>

            <label className="p-2.5 bg-slate-50 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all cursor-pointer group relative border border-slate-100">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
              ) : (
                <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-12 h-12 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center hover:bg-sky-500 transition-all overflow-hidden border-4 border-white shadow-xl"
            >
              {(session?.user as any)?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={(session.user as any).image}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                session?.user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden py-2">
                <div className="p-6 border-b border-slate-50">
                  <p className="text-sm font-black text-slate-900 uppercase">
                    {session?.user?.name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {session?.user?.email}
                  </p>
                </div>

                <div className="p-2 px-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors group"
                  >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
