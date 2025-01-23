import { Field, ID, ObjectType } from '@nestjs/graphql';

import { MemberRole } from 'src/enums/role';

@ObjectType()
export class WorkspaceMember {
  @Field(() => ID)
  id: string;

  @Field(() => MemberRole)
  role: MemberRole;

  @Field()
  userId: string;

  @Field()
  workspaceId: string;

  @Field()
  createdAt: Date;
}
