import { ApolloError } from 'apollo-server-errors';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    try {
      return await this.prisma.workspace.findMany();
    } catch (error) {
      throw new ApolloError('Failed to fetch workspaces', 'DATABASE_ERROR', {
        detail: error.message,
      });
    }
  }

  async create(data: Prisma.WorkspaceCreateInput) {
    try {
      return await this.prisma.workspace.create({ data });
    } catch (error) {
      throw new ApolloError('Failed to create workspace', 'DATABASE_ERROR', {
        detail: error.message,
      });
    }
  }

  async update(id: string, data: Prisma.WorkspaceUpdateInput) {
    try {
      const workspace = await this.prisma.workspace.update({
        where: { id },
        data,
      });

      if (!workspace) {
        throw new ApolloError('Workspace not found', 'NOT_FOUND');
      }

      return workspace;
    } catch (error) {
      throw new ApolloError('Failed to update workspace', 'DATABASE_ERROR', {
        detail: error.message,
      });
    }
  }

  async delete(id: string) {
    try {
      const workspace = await this.prisma.workspace.delete({
        where: { id },
      });

      if (!workspace) {
        throw new ApolloError('Workspace not found', 'NOT_FOUND');
      }

      return true;
    } catch (error) {
      throw new ApolloError('Failed to delete workspace', 'DATABASE_ERROR', {
        detail: error.message,
      });
    }
  }
}
