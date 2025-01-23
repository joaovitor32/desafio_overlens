import { ApolloError } from 'apollo-server-errors';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class WorkspaceMemberService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    try {
      return await this.prisma.workspaceMember.findMany();
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

  async addMember(data: Prisma.WorkspaceMemberCreateInput) {
    try {
      return await this.prisma.workspaceMember.create({
        data,
      });
    } catch (error) {
      throw new ApolloError('Error adding workspace member', 'CREATE_ERROR', {
        detail: error.message,
      });
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
}
