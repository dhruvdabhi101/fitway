import { apiClient } from "@src/api/client";

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  gymName?: string;
  phone?: string;
}

export const authService = {
  signup: async (data: SignupInput) => {
    const response = await apiClient.post<{
      data: { id: string; name: string; email: string } | null;
      error: { code: string; message: string } | null;
    }>("/api/auth/signup", data);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data;
  },
};
