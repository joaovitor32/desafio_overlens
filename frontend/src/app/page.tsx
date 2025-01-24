"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginResponse, SignInInput } from "./types";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOGIN_MUTATION } from "./mutations/login";
import { Label } from "@/components/ui/label";
import { fetcher } from "./lib/graphqlClient";
import { print } from "graphql/language/printer";
import { useUserStore } from "./store/user";

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInInput>();
  const [loginError, setLoginError] = useState<string | null>(null);

  const { user, setUser, clearUser } = useUserStore();


  const onSubmit: SubmitHandler<SignInInput> = async (data) => {
    const variables = { signInInput: { email: data.email, password: data.password } };


    try {
      const query = print(LOGIN_MUTATION);
      const response = await fetcher(query, variables) as LoginResponse;

      setUser(response?.signIn);
      setLoginError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      clearUser()
      const firstErrorMessage = error?.response?.errors?.[0]?.message || "An unexpected error occurred.";
      setLoginError(firstErrorMessage);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
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
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </div>
          </form>
          {loginError && (
            <p className="mt-2 text-sm text-center text-red-500">
              {loginError}
            </p>
          )}
          {user && (
            <p className="mt-2 text-sm text-center text-green-500">
              Welcome, {user.name}!
            </p>
          )}
          <p className="mt-4 text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
