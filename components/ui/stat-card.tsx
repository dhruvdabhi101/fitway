import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  const iconVariants = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm mt-1 font-medium",
                trend.isPositive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last month
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconVariants[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
