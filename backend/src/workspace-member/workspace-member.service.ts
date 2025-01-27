import { ApolloError } from 'apollo-server-errors';
import { Injectable } from '@nestjs/common';
import { MemberRole } from 'src/enums/role';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class WorkspaceMemberService {
  constructor(private readonly prisma: PrismaService) { }

  async find(workspaceId: string, loggedUserId: string) {
    try {
      return await this.prisma.workspaceMember.findMany({
        where: {
          workspaceId,
          userId: {
            not: loggedUserId,
          },
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new ApolloError('Error fetching workspace members', 'FETCH_ERROR', {
        detail: error.message,
      });
    }
  }

  async findOne(id: string) {
    try {
      const member = await this.prisma.workspaceMember.findUnique({
        where: { id },
      });

      if (!member) {
        throw new ApolloError('Workspace member not found', 'NOT_FOUND');
      }

      return member;
    } catch (error) {
      throw new ApolloError('Error fetching workspace member', 'FETCH_ERROR', {
        detail: error.message,
      });
    }
  }

  async addMember(data: {
    role: MemberRole;
    email: string;
    workspaceId: string;
  }) {
    try {
      // 1. Buscar o usuário pelo e-mail
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        throw new ApolloError('Usuário não encontrado', 'USER_NOT_FOUND', {
          email: data.email,
        });
      }

      const existingMember = await this.prisma.workspaceMember.findFirst({
        where: {
          userId: user.id,
          workspaceId: data.workspaceId,
        },
      });

      if (existingMember) {
        throw new ApolloError(
          'Usuário já é membro deste workspace',
          'MEMBER_EXISTS',
          {
            email: data.email,
          },
        );
      }

      return await this.prisma.workspaceMember.create({
        data: {
          role: data.role,
          user: { connect: { id: user.id } },
          workspace: { connect: { id: data.workspaceId } },
        },
      });
    } catch (error) {
      throw new ApolloError(
        'Erro ao adicionar membro ao workspace',
        'CREATE_ERROR',
        {
          detail: error.message,
        },
      );
    }
  }

  async updateMember(id: string, data: Prisma.WorkspaceMemberUpdateInput) {
    try {
      const member = await this.prisma.workspaceMember.update({
        where: { id },
        data,
      });

      if (!member) {
        throw new ApolloError('Workspace member not found', 'NOT_FOUND');
      }

      return member;
    } catch (error) {
      throw new ApolloError('Error updating workspace member', 'UPDATE_ERROR', {
        detail: error.message,
      });
    }
  }

  async removeMember(id: string) {
    try {
      await this.prisma.workspaceMember.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw new ApolloError('Error removing workspace member', 'DELETE_ERROR', {
        detail: error.message,
      });
    }
  }

  async findByWorkspaceAndUser(workspaceId: string, userId: string) {
    try {
      const member = await this.prisma.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId,
        },
        include: {
          user: true,
          workspace: {
            include: {
              documents: true,
            },
          },
        },
      });

      if (!member) {
        throw new ApolloError('Workspace member not found', 'NOT_FOUND');
      }

      return member;
    } catch (error) {
      throw new ApolloError(
        'Error fetching workspace member by workspaceId and userId',
        'FETCH_ERROR',
        {
          detail: error.message,
        },
      );
    }
  }
}
