export interface MemberWithMemberships {
  id: string;
  gymOwnerId: string;
  name: string;
  phone: string;
  email: string | null;
  photoUrl: string | null;
  address: string | null;
  joinDate: Date;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  memberships: {
    id: string;
    memberId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    amountPaid: number;
    paymentStatus: string;
    paymentMode: string;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    plan: {
      id: string;
      gymOwnerId: string;
      name: string;
      durationDays: number;
      price: number;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
}

export interface MembershipWithDetails {
  id: string;
  memberId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  amountPaid: number;
  paymentStatus: string;
  paymentMode: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  member: {
    id: string;
    name: string;
    phone: string;
    photoUrl: string | null;
  };
  plan: {
    name: string;
  };
}

export interface DashboardStats {
  totalMembers: number;
  activeMemberships: number;
  expiringSoon: number;
  overduePayments: number;
}
