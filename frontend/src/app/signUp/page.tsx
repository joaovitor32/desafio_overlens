"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { SignUpInput, SignUpResponse } from "../../globals/types";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SIGNUP_MUTATION } from "../../globals/mutations/signUp";
import { fetcher } from "../../globals/lib/graphqlClient";
import { print } from "graphql/language/printer";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpInput>();
  const { push } = useRouter()
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<SignUpInput> = async (data) => {
    const variables = { signUpInput: { email: data.email, password: data.password, name: data.name } };

    try {
      const query = print(SIGNUP_MUTATION);
      await fetcher(query, variables) as SignUpResponse;

      setSignUpError(null);
      push("/")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const firstErrorMessage = error?.response?.errors?.[0]?.message || "An unexpected error occurred.";
      setSignUpError(firstErrorMessage);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="mt-1"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="mt-1"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="********"
                  className="mt-1"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>
            </div>
          </form>
          {signUpError && (
            <p className="mt-2 text-sm text-center text-red-500">
              {signUpError}
            </p>
          )}
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/" passHref>
              <button className="text-blue-500 bg-transparent border-0 focus:ring-0 hover:text-blue-500">
                Sign In
              </button>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;