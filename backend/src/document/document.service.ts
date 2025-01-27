import { ApolloError } from 'apollo-server-errors';
import { Injectable } from '@nestjs/common';
import { MemberRole } from 'src/enums/role';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    try {
      return await this.prisma.document.findMany();
    } catch (error) {
      throw new ApolloError('Error fetching documents', 'FETCH_ERROR', {
        detail: error.message,
      });
    }
  }

  async findOne(id: string) {
    try {
      const document = await this.prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        throw new ApolloError('Document not found', 'NOT_FOUND');
      }

      return document;
    } catch (error) {
      throw new ApolloError('Error fetching document', 'FETCH_ERROR', {
        detail: error.message,
      });
    }
  }

  async create(userId: string, data: Prisma.DocumentCreateInput) {
    try {
      const workspaceId = data.workspace?.connect?.id;

      if (!workspaceId) {
        throw new ApolloError('Workspace ID is missing', 'BAD_USER_INPUT');
      }

      const member = await this.prisma.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId,
        },
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        throw new ApolloError(
          'User does not have admin role in the workspace',
          'FORBIDDEN',
        );
      }

      const existingDocument = await this.prisma.document.findFirst({
        where: {
          workspaceId,
          title: data.title,
        },
      });

      if (existingDocument) {
        throw new ApolloError(
          'A document with the same name already exists in the workspace',
          'BAD_USER_INPUT',
        );
      }

      return await this.prisma.document.create({
        data,
      });
    } catch (error) {
      throw new ApolloError('Error creating document', 'CREATE_ERROR', {
        detail: error.message,
      });
    }
  }

  async update(userId: string, id: string, data: Prisma.DocumentUpdateInput) {
    try {
      const workspaceId = data.workspace?.connect?.id;

      const member = await this.prisma.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId,
        },
      });

      if (
        !member ||
        (member.role !== MemberRole.ADMIN && member.role !== MemberRole.EDITOR)
      ) {
        throw new ApolloError(
          'User does not have admin or editor role in the workspace',
          'FORBIDDEN',
        );
      }

      return await this.prisma.document.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new ApolloError('Error updating document', 'UPDATE_ERROR', {
        detail: error.message,
      });
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.document.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new ApolloError('Error deleting document', 'DELETE_ERROR', {
        detail: error.message,
      });
    }
  }
}
