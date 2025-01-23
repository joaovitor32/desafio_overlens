import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Workspace {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
