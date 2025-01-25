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

  async create(data: Prisma.WorkspaceCreateInput, userId: string) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const existingWorkspace = await prisma.workspace.findFirst({
          where: { name: data.name },
        });

        if (existingWorkspace) {
          throw new ApolloError(
            'Workspace with this name already exists',
            'DUPLICATE_NAME_ERROR',
            {
              detail: `A workspace with the name "${data.name}" already exists.`,
            },
          );
        }

        const result = await prisma.workspace.create({
          data: {
            ...data,
            members: {
              create: {
                role: 'ADMIN',
                user: { connect: { id: userId } },
              },
            },
          },
        });

        return result;
      });

      return result;
    } catch (error) {
      throw new ApolloError(
        'Failed to create workspace and add member',
        'DATABASE_ERROR',
        {
          detail: error.message,
        },
      );
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

  async getWorkspaceDetails(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: {
          where: {
            userId: userId,
          },
          select: {
            role: true,
            user: true,
          },
        },
        documents: true,
      },
    });

    if (!workspace) {
      throw new Error('Workspace não encontrado');
    }

    return workspace;
  }
}
