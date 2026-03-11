"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, CreditCard, AlertCircle } from "lucide-react";

const navigation = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Plans", href: "/plans", icon: CreditCard },
  { name: "Due", href: "/payments", icon: AlertCircle },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 min-w-[64px] transition-all duration-200",
                isActive ? "text-emerald-600" : "text-slate-400"
              )}
            >
              <item.icon className="w-6 h-6 mb-0.5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
