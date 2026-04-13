import { useMutation } from "@tanstack/react-query";
import { authService, type SignupInput } from "@src/services/auth.service";

export function useSignup() {
  return useMutation({
    mutationFn: async (data: SignupInput) => {
      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      return authService.signup(data);
    },
  });
}
