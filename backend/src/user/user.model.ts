import { Field, ID, ObjectType } from '@nestjs/graphql';

import { WorkspaceMember } from 'src/workspace-member/workspace-member.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field(() => [WorkspaceMember])
  workspaces: WorkspaceMember[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
