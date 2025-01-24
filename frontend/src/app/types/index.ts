export interface LoginResponse {
  signIn: {
    accessToken: string;
    name: string;
    email: string;
  };
}

export interface SignInInput {
  email: string;
  password: string;
}