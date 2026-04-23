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

export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  // Ensure it starts with country code (assume India +91 if 10 digits)
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function getWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

export function getMembershipReminderMessage(
  name: string,
  planName: string,
  endDate: Date | string,
  daysLeft: number
): string {
  const dateStr = formatDate(endDate);
  if (daysLeft < 0) {
    return `Hi ${name}, this is a reminder from your gym. Your ${planName} membership expired on ${dateStr} (${Math.abs(daysLeft)} days ago). Please renew it at the earliest to continue your fitness journey. Thank you!`;
  } else if (daysLeft === 0) {
    return `Hi ${name}, this is a reminder from your gym. Your ${planName} membership expires today. Please renew it to avoid any interruption. Thank you!`;
  } else if (daysLeft <= 7) {
    return `Hi ${name}, this is a reminder from your gym. Your ${planName} membership expires on ${dateStr} (${daysLeft} days left). Please renew it in time to continue your fitness journey. Thank you!`;
  }
  return `Hi ${name}, this is a reminder from your gym regarding your ${planName} membership. It is valid until ${dateStr}. Keep up the great work!`;
}
