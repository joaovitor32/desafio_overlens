import { ApolloError } from 'apollo-server-errors';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class WorkspaceMemberService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(userId: string) {
    try {
      return await this.prisma.workspaceMember.findMany({
        where: {
          userId: userId, // Filter workspace members by userId
        },
      });
    } catch (error) {
      throw new ApolloError(
        'Failed to fetch workspace members',
        'DATABASE_ERROR',
        {
          detail: error.message,
        },
      );
    }
  }

  async create(data: Prisma.WorkspaceMemberCreateInput) {
    try {
      return await this.prisma.workspaceMember.create({ data });
    } catch (error) {
      throw new ApolloError(
        'Failed to create workspace member',
        'DATABASE_ERROR',
        {
          detail: error.message,
        },
      );
    }
  }

  async update(id: string, data: Prisma.WorkspaceMemberUpdateInput) {
    try {
      const workspaceMember = await this.prisma.workspaceMember.update({
        where: { id },
        data,
      });

      if (!workspaceMember) {
        throw new ApolloError('Workspace member not found', 'NOT_FOUND');
      }

      return workspaceMember;
    } catch (error) {
      throw new ApolloError(
        'Failed to update workspace member',
        'DATABASE_ERROR',
        {
          detail: error.message,
        },
      );
    }
  }

  async delete(id: string) {
    try {
      const workspaceMember = await this.prisma.workspaceMember.delete({
        where: { id },
      });

      if (!workspaceMember) {
        throw new ApolloError('Workspace member not found', 'NOT_FOUND');
      }

      return true;
    } catch (error) {
      throw new ApolloError(
        'Failed to delete workspace member',
        'DATABASE_ERROR',
        {
          detail: error.message,
        },
      );
    }
  }
}
