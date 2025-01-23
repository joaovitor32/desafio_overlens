import { ApolloError } from 'apollo-server-errors';
import { Injectable } from '@nestjs/common';
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

  async create(data: Prisma.DocumentCreateInput) {
    try {
      return await this.prisma.document.create({
        data,
      });
    } catch (error) {
      throw new ApolloError('Error creating document', 'CREATE_ERROR', {
        detail: error.message,
      });
    }
  }

  async update(id: string, data: Prisma.DocumentUpdateInput) {
    try {
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
