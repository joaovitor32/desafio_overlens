"use client";

import {
  ADD_WORKSPACE_MEMBER_MUTATION,
  GET_WORKSPACE_MEMBERS_QUERY,
  REMOVE_WORKSPACE_MEMBER_MUTATION,
} from "@/globals/mutations/workspace-member";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import React, { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROLE_OPTIONS } from "@/globals/enums";
import { fetcher } from "@/globals/lib/graphqlClient";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useUserStore } from "@/globals/store/user";

interface FormData {
  email: string;
  role: string;
}

const GetWorkspaceMembers = () => {
  const { user } = useUserStore();
  const { id: workspaceId } = useParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();
  const [adding, setAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: members, error: membersError, isValidating, mutate }: any = useSWR(
    [GET_WORKSPACE_MEMBERS_QUERY, workspaceId],
    useCallback(([query, id]) => {
      const variables = { id };
      return fetcher(query, variables, {
        Authorization: `Bearer ${user?.accessToken}`,
      });
    }, [user?.accessToken])
  );

  const onSubmit: SubmitHandler<FormData> = useCallback(async (data) => {
    if (!data.email || !data.role) {
      setErrorMessage("Both email and role are required!");
      return;
    }

    setAdding(true);

    try {
      const variables = {
        workspaceId,
        email: data.email,
        role: data.role,
      };

      await fetcher(ADD_WORKSPACE_MEMBER_MUTATION as unknown as string, variables, {
        Authorization: `Bearer ${user?.accessToken}`,
      });

      await mutate();
    } catch {
      setErrorMessage("Error adding member.");
    } finally {
      setAdding(false);
    }
  }, [workspaceId, user?.accessToken, mutate]);

  const handleRemoveMember = useCallback(async (memberId: string) => {
    try {
      const variables = {
        id: memberId,
      };
      await fetcher(REMOVE_WORKSPACE_MEMBER_MUTATION as unknown as string, variables, {
        Authorization: `Bearer ${user?.accessToken}`,
      });

      mutate();
    } catch {
      setErrorMessage("Error removing member.");
    }
  }, [user?.accessToken, mutate]);

  return (
    <div className="h-full pt-4 px-4">
      <h2 className="text-xl font-semibold mb-4">Add Workspace Member</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 flex flex-col space-y-4 w-full">
        <div className="flex flex-col w-full">
          <Input
            type="email"
            placeholder="Enter member's email"
            {...register("email", { required: "Email is required" })}
            className="border border-gray-300 rounded p-2 w-full"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="role" className="mb-1 font-medium text-gray-700">
            Role
          </label>
          <Controller
            name="role"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue="">
                <SelectTrigger className="w-full border border-gray-300 rounded p-2">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && <p className="text-red-600 text-sm">{errors.role.message}</p>}
        </div>

        <Button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full"
          disabled={adding}
        >
          {adding ? "Adding..." : "Add Member"}
        </Button>
      </form>

      {errorMessage && (
        <p className="text-red-600 font-semibold text-lg">{errorMessage}</p>
      )}

      {membersError && (
        <p className="text-red-600 font-semibold text-lg">
          Error fetching workspace members
        </p>
      )}

      {isValidating && (
        <p className="text-blue-600 font-semibold text-lg">Loading...</p>
      )}

      <h3 className="text-xl font-semibold mb-4">Workspace Members</h3>

      {members?.getWorkspaceMembers.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">User ID</TableHead>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Created At</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.getWorkspaceMembers.map(
              (member: {
                id: string;
                user: { name: string; email: string; id: string };
                role: string;
                userId: string;
                createdAt: string;
              }) => (
                <TableRow key={member.id}>
                  <TableCell>{member.userId}</TableCell>
                  <TableCell>{member.user.name}</TableCell>
                  <TableCell>{member.user.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    {new Date(member.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default GetWorkspaceMembers;