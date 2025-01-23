import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dtos/auth-response';
import { SignUpInput } from './dtos/sign-up';
import { SignInInput } from './dtos/sign-in';
import { SignUpResponse } from './dtos/sign-up-response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Query(() => String)
  async hello(): Promise<string> {
    return 'Hello, GraphQL!';
  }

  @Mutation(() => AuthResponse)
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
  ): Promise<AuthResponse> {
    const { email, password } = signInInput;
    return this.authService.signIn(email, password);
  }

  @Mutation(() => SignUpResponse)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<any> {
    const { name, email, password } = signUpInput;
    return this.authService.signup(name, email, password);
  }
}
