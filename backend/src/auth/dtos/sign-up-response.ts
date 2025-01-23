import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignUpResponse {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}
