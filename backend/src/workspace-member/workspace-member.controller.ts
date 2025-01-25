import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMember } from './workspace-member.model';

import { ApolloError } from 'apollo-server-errors';
import { MemberRole } from 'src/enums/role';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => WorkspaceMember)
export class WorkspaceMemberResolver {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) { }

  @UseGuards(AuthGuard)
  @Query(() => [WorkspaceMember])
  async getWorkspaceMembers() {
    try {
      return await this.workspaceMemberService.findAll();
    } catch (error) {
      throw new ApolloError('Error fetching workspace members', 'FETCH_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => WorkspaceMember)
  async getWorkspaceMember(@Args('id') id: string) {
    try {
      return await this.workspaceMemberService.findOne(id);
    } catch (error) {
      throw new ApolloError('Error fetching workspace member', 'FETCH_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => WorkspaceMember)
  async addWorkspaceMember(
    @Context() context,
    @Args('role') role: MemberRole,
    @Args('workspaceId') workspaceId: string,
  ) {
    try {
      const userId = context.req.user.sub;

      return await this.workspaceMemberService.addMember({
        role,
        user: { connect: { id: userId } },
        workspace: { connect: { id: workspaceId } },
      });
    } catch (error) {
      throw new ApolloError('Error adding workspace member', 'CREATE_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => WorkspaceMember)
  async getWorkspaceMemberByWorkspaceAndUser(
    @Context() context,
    @Args('workspaceId') workspaceId: string,
  ) {
    try {
      const userId = context.req.user.sub;

      return await this.workspaceMemberService.findByWorkspaceAndUser(
        workspaceId,
        userId,
      );
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

  @UseGuards(AuthGuard)
  @Mutation(() => WorkspaceMember)
  async updateWorkspaceMember(
    @Context() context,
    @Args('id') id: string,
    @Args('role') role: MemberRole, // Use MemberRole enum
    @Args('workspaceId') workspaceId: string,
  ) {
    try {
      const userId = context.req.user.sub;

      return await this.workspaceMemberService.updateMember(id, {
        role,
        user: { connect: { id: userId } },
        workspace: { connect: { id: workspaceId } },
      });
    } catch (error) {
      throw new ApolloError('Error updating workspace member', 'UPDATE_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async removeWorkspaceMember(@Args('id') id: string) {
    try {
      return await this.workspaceMemberService.removeMember(id);
    } catch (error) {
      throw new ApolloError('Error removing workspace member', 'DELETE_ERROR', {
        detail: error.message,
      });
    }
  }
}
