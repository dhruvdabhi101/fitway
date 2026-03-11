import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getDaysUntilExpiry(endDate: Date | string): number {
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getMembershipStatus(endDate: Date | string): {
  status: "active" | "expiring" | "expired";
  label: string;
  daysLeft: number;
} {
  const daysLeft = getDaysUntilExpiry(endDate);

  if (daysLeft < 0) {
    return { status: "expired", label: "Expired", daysLeft };
  } else if (daysLeft <= 7) {
    return { status: "expiring", label: "Expiring Soon", daysLeft };
  } else {
    return { status: "active", label: "Active", daysLeft };
  }
}
