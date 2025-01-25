"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EDIT_DOCUMENT_MUTATION } from "@/globals/mutations/document";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetcher } from "@/globals/lib/graphqlClient";
import { print } from "graphql/language/printer";
import { useUserStore } from "@/globals/store/user";

export interface DocumentInput {
  title: string,
  content: string
}

const EditDocumentPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DocumentInput>();
  const [error, setError] = useState<string | null>(null);

  const { user } = useUserStore();
  const { back } = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get('documentId');
  const workspaceId = searchParams.get('workspaceId');

  const onSubmit: SubmitHandler<DocumentInput> = useCallback(async (data) => {
    if (!documentId) {
      setError("Document ID is required for editing");
      return;
    }

    const variables = { id: documentId, title: data.title, content: data.content, workspaceId };

    try {
      const query = print(EDIT_DOCUMENT_MUTATION);
      await fetcher(query, variables, {
        Authorization: `Bearer ${user?.accessToken}`,
      });

      setError(null);
      back()
    } catch (error: any) {
      const firstErrorMessage = error?.response?.errors?.[0]?.message || "An unexpected error occurred.";
      setError(firstErrorMessage);
    }
  }, [back, user?.accessToken, documentId, workspaceId]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Edit Document</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Título"
                  className="mt-1"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="content">Conteúdo</Label>
                <Input
                  type="text"
                  id="content"
                  placeholder="Enter with the content"
                  className="mt-1"
                  {...register("content", { required: "Content is required" })}
                />
                {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
              </div>
              <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Update"}
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

export default EditDocumentPage;
