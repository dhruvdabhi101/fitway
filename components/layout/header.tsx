"use client";

import { signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <div className="lg:hidden flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900">Fitway</span>
        </div>

        <div className="hidden lg:block" />

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-700">
              {userName}
            </span>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
