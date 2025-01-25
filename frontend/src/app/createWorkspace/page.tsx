"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CREATE_WORKSPACE_MUTATION } from "@/globals/mutations/workspace";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkspaceInput } from "../../globals/types";
import { fetcher } from "@/globals/lib/graphqlClient";
import { print } from "graphql/language/printer";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/globals/store/user";

const CreateWorkspacePage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<WorkspaceInput>();
  const [error, setError] = useState<string | null>(null);

  const { user } = useUserStore()

  const { push } = useRouter()

  const onSubmit: SubmitHandler<WorkspaceInput> = useCallback(async (data) => {
    const variables = { name: data.name, description: data.description };

    try {
      const query = print(CREATE_WORKSPACE_MUTATION);
      await fetcher(query, variables, {
        Authorization: `Bearer ${user?.accessToken}`
      });

      setError(null);
      push("/getWorkspaces")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const firstErrorMessage = error?.response?.errors?.[0]?.message || "An unexpected error occurred.";
      setError(firstErrorMessage);
    }
  }, [push, user?.accessToken]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Criar workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="mt-1"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  placeholder="Enter a description"
                  className="mt-1"
                  {...register("description", { required: "Description is required" })}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
          {error && (
            <p className="mt-2 text-sm text-center text-red-500">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateWorkspacePage;
