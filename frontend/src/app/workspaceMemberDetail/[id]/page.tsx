"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubmitHandler, useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useParams, useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CREATE_DOCUMENT_MUTATION } from "@/globals/mutations/document";
import { GET_WORKSPACE_MEMBER_QUERY } from "@/globals/mutations/workspace-member";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MemberRole } from "@/globals/enums";
import { PencilIcon } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/globals/lib/graphqlClient";
import { print } from "graphql";
import { useState } from "react";
import { useUserStore } from "@/globals/store/user";

type WorkspaceFormValues = {
  title: string;
  content: string;
};

const WorkspaceMemberDetail = () => {
  const { user } = useUserStore();
  const { id } = useParams();

  const [error, setError] = useState(null)
  const { push } = useRouter()

  const { data: workspacesMembers, error: workspacesMemberError, isValidating }: any = useSWR(
    id ? [GET_WORKSPACE_MEMBER_QUERY.loc?.source.body, id] : null,
    ([query, workspaceId]) => {
      return fetcher(query as string, {
        workspaceId,
      },
        {
          Authorization: `Bearer ${user?.accessToken}`,
        });
    }
  );
  const userResponseData = workspacesMembers?.getWorkspaceMemberByWorkspaceAndUser?.user;
  const workspace = workspacesMembers?.getWorkspaceMemberByWorkspaceAndUser?.workspace

  const role = workspacesMembers?.getWorkspaceMemberByWorkspaceAndUser?.role


  const { register, handleSubmit, formState: { errors } } = useForm<WorkspaceFormValues>();

  const onSubmit: SubmitHandler<WorkspaceFormValues> = async (data) => {
    const variables = { title: data.title, content: data.content, workspaceId: id };

    try {
      const query = print(CREATE_DOCUMENT_MUTATION);
      await fetcher(query, variables, {
        Authorization: `Bearer ${user?.accessToken}`
      });

      mutate([GET_WORKSPACE_MEMBER_QUERY.loc?.source.body, id]);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const firstErrorMessage = error?.response?.errors?.[0]?.message || "An unexpected error occurred.";
      setError(firstErrorMessage);
    }
  };

  return (
    <div className="flex h-screen items-start justify-center p-8 space-y-8">
      {workspacesMemberError && (
        <Alert variant="destructive" className="w-full max-w-2xl">
          Error fetching workspace member data
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="w-full max-w-2xl">
          {error}
        </Alert>
      )}
      {isValidating && !workspacesMembers && (
        <div className="space-y-4 w-full max-w-2xl">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}
      {!isValidating && workspacesMembers && (
        <div className="w-full max-w-7xl flex flex-col  py-8  space-y-8">
          <div className="w-full">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle className="text-green-600">Workspace Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-lg font-semibold">
                    <span className="font-medium">Role:</span> {role}
                  </p>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">
                      <span className="font-medium">User:</span>
                    </p>
                    <p>Email: {userResponseData.email}</p>
                    <p>Name: {userResponseData.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">
                      <span className="font-medium">Workspace:</span>
                    </p>
                    <p>Name: {workspace.name}</p>
                    <p>Description: {workspace.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          <div className="w-full">
            <Card className="w-full h-full">
              <CardHeader>
                <CardTitle className="text-blue-600">Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Actions</TableCell> {/* Add an Actions column */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workspace.documents.map((document: any) => (
                      <TableRow key={document.id}>
                        <TableCell>{document.title}</TableCell>
                        <TableCell>{new Date(document.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          {/* Conditional rendering for the edit icon */}
                          {(role === MemberRole.ADMIN || MemberRole.EDITOR) && (
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => push(`/editDocument?documentId=${document.id}&workspaceId=${id}`)}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {role === MemberRole.ADMIN ? (
            <div className="w-full">
              <Card className="w-full h-full">
                <CardHeader>
                  <CardTitle className="text-purple-600">Create document</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-lg font-semibold">Name</Label>
                      <Input
                        {...register("title", { required: "Title is required" })}
                        id="name"
                        type="text"
                        defaultValue={workspace.name}
                        className="mt-1"
                      />
                      {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                    </div>
                    <div>
                      <Label htmlFor="content" className="text-lg font-semibold">Description</Label>
                      <Input
                        {...register("content", { required: "Description is required" })}
                        id="description"
                        defaultValue={workspace.description}
                        className="mt-1"
                      />
                      {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
                    </div>
                    <Button type="submit" className="w-full mt-4">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : null}

        </div>
      )}

      {!id && (
        <Alert className="w-full max-w-2xl">
          Workspace ID is missing.
        </Alert>
      )}
    </div>
  );
};

export default WorkspaceMemberDetail;
