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

export interface CreateMemberInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  photoUrl?: string;
  joinDate?: string;
  planId?: string;
  amountPaid?: number;
  paymentMode?: string;
  startDate?: string;
}

export interface UpdateMemberInput {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  photoUrl?: string;
}

export interface RenewMembershipInput {
  planId: string;
  amountPaid?: number;
  paymentMode?: string;
  startDate?: string;
}

export interface CreatePlanInput {
  name: string;
  durationDays: number;
  price: number;
}

export interface UpdatePlanInput {
  name?: string;
  durationDays?: number;
  price?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export type MemberListResponse = ApiResponse<MemberWithMemberships[]> & { meta?: PaginationMeta };

export type MemberResponse = ApiResponse<MemberWithMemberships>;

export type PlanListResponse = ApiResponse<unknown[]>;

export type PlanResponse = ApiResponse<unknown>;

export type MembershipResponse = ApiResponse<unknown>;

export type PaymentDueListResponse = ApiResponse<unknown[]>;

export interface SuccessResponse {
  success: boolean;
}

export interface DashboardStats {
  totalMembers: number;
  activeMemberships: number;
  expiringSoon: number;
  overduePayments: number;
}
