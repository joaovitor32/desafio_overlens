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
  const router = useRouter();

  const { data: workspaces, error: workspacesError, isValidating }: any = useSWR(
    user?.accessToken ? GET_WORKSPACES_QUERY : null,
    (query) =>
      fetcher(query as unknown as string, {}, {
        Authorization: `Bearer ${user?.accessToken}`,
      })
  );

  return (
    <div className="h-full pt-4 px-4">
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
                <TableHead className="font-bold">Actions</TableHead>
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
                      <div className="flex space-x-4">
                        <Button
                          className="text-blue-600 hover:underline font-medium"
                          onClick={() => router.push(`/workspaceMemberDetail/${workspace.id}`)}
                        >
                          Workspace details
                        </Button>
                        <Button
                          className="text-blue-600 hover:underline font-medium"
                          onClick={() => router.push(`/getWorkspaceMembers/${workspace.id}`)}
                        >
                          Workspace members
                        </Button>
                      </div>
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
