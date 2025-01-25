import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { DocumentService } from './document.service';

import { ApolloError } from 'apollo-server-errors';
import { Document } from './document.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) { }

  @UseGuards(AuthGuard)
  @Query(() => [Document])
  async getDocuments() {
    try {
      return await this.documentService.findAll();
    } catch (error) {
      throw new ApolloError('Error fetching documents', 'FETCH_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => Document)
  async getDocument(@Args('id') id: string) {
    try {
      return await this.documentService.findOne(id);
    } catch (error) {
      throw new ApolloError('Error fetching document', 'FETCH_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Document)
  async createDocument(
    @Context() context,
    @Args('title') title: string,
    @Args('content') content: string,
    @Args('workspaceId') workspaceId: string,
  ) {
    try {
      const userId = context.req.user.sub;
      return await this.documentService.create(userId, {
        title,
        content,
        workspace: { connect: { id: workspaceId } },
      });
    } catch (error) {
      throw new ApolloError('Error creating document', 'CREATE_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Document)
  async updateDocument(
    @Context() context,
    @Args('id') id: string,
    @Args('title') title: string,
    @Args('content') content: string,
    @Args('workspaceId') workspaceId: string,
  ) {
    try {
      const userId = context.req.user.sub;
      return await this.documentService.update(userId, id, {
        title,
        content,
        workspace: { connect: { id: workspaceId } },
      });
    } catch (error) {
      throw new ApolloError('Error updating document', 'UPDATE_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteDocument(@Args('id') id: string) {
    try {
      return await this.documentService.delete(id);
    } catch (error) {
      throw new ApolloError('Error deleting document', 'DELETE_ERROR', {
        detail: error.message,
      });
    }
  }
}
