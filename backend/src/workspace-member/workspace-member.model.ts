import { Field, ID, ObjectType } from '@nestjs/graphql';

import { MemberRole } from 'src/enums/role';
import { User } from 'src/user/user.model';
import { Workspace } from 'src/workspace/workspace.model';

@ObjectType()
export class WorkspaceMember {
  @Field(() => ID)
  id: string;

  @Field()
  role: MemberRole;

  @Field(() => User, { nullable: true })
  user: User;

  @Field()
  userId: string;

  @Field(() => Workspace)
  workspace: Workspace;

  @Field()
  workspaceId: string;

  @Field()
  createdAt: Date;
}
