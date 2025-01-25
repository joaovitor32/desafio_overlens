"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { GET_WORKSPACES_QUERY } from "@/globals/mutations/workspace";
import React from "react";
import { fetcher } from "@/globals/lib/graphqlClient";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useUserStore } from "@/globals/store/user";

const GetWorkspaces = () => {
  const { user } = useUserStore();
  const router = useRouter(); // Initialize router

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: workspaces, error: workspacesError, isValidating }: any = useSWR(
    GET_WORKSPACES_QUERY,
    (query) =>
      fetcher(query as unknown as string, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      })
  );

  return (
    <div className="flex h-screen items-center justify-center">
      {workspacesError && (
        <p className="text-red-600 font-semibold text-lg">
          Error fetching workspaces
        </p>
      )}
      {isValidating && (
        <p className="text-blue-600 font-semibold text-lg">Loading...</p>
      )}
      {workspaces?.getWorkspaces.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Workspace Name</TableHead>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="font-bold">Actions</TableHead> {/* New column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces.getWorkspaces.map(
                (workspace: {
                  id: string;
                  name: string;
                  description: string;
                }) => (
                  <TableRow key={workspace.id}>
                    <TableCell>{workspace.name}</TableCell>
                    <TableCell>{workspace.description}</TableCell>
                    <TableCell>
                      <Button
                        className="text-blue-600 hover:underline font-medium"
                        onClick={() => router.push(`/workspaceMemberDetail/${workspace.id}`)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default GetWorkspaces;
