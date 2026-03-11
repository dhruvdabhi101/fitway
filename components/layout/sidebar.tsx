"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  AlertCircle,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Plans", href: "/plans", icon: CreditCard },
  { name: "Payments Due", href: "/payments", icon: AlertCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
        <div className="flex items-center gap-3 h-16 px-6 border-b border-slate-100">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg
              className="w-6 h-6 text-white"
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
          <span className="text-xl font-bold text-slate-900">Fitway</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-emerald-600" : "text-slate-400"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
