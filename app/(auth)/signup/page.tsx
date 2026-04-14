"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSignup } from "@src/queries/auth.queries";

export default function SignupPage() {
  const router = useRouter();
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
    email: string;
    password: string;
    gymName: string;
    phone: string;
    acceptTerms: boolean;
  }>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      gymName: "",
      phone: "",
      acceptTerms: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await signup.mutateAsync(values);
    router.push("/login?registered=true");
  });

  const globalError = signup.error instanceof Error ? signup.error.message : "";

  return (
    <Card className="border-0 shadow-xl">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">
          Create your account
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {globalError && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
              {globalError}
            </div>
          )}

          <Input
            id="name"
            type="text"
            label="Your Name"
            placeholder="John Doe"
            {...register("name", { required: "Name is required" })}
            required
            error={errors.name?.message}
          />

          <Input
            id="gymName"
            type="text"
            label="Gym Name"
            placeholder="Fitness Hub Gym"
            {...register("gymName")}
          />

          <Input
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="+91 9876543210"
            {...register("phone")}
          />

          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
            required
            error={errors.email?.message}
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Minimum 6 characters"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            required
            minLength={6}
            error={errors.password?.message}
          />

          <div className="flex items-start gap-3">
            <input
              id="acceptTerms"
              type="checkbox"
              {...register("acceptTerms", { required: "You must accept the terms" })}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
            />
            <label htmlFor="acceptTerms" className="text-sm text-slate-600">
              I agree to the{" "}
              <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 mt-1">{errors.acceptTerms.message}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={signup.isPending || isSubmitting}
          >
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
