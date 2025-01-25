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

export interface SignUpInput {
  name: string,
  email: string;
  password: string;
}


export interface WorkspaceInput {
  name: string,
  description: string
}

export interface GetWorkspaceResponse {
  getWorkspaces: Array<{
    id: string,
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
  }>
}

export interface GetWorkspaceMembersResponse {
  getWorkspaceMemberByWorkspaceAndUser: {
    id: string;
    role: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
    workspace: {
      id: string;
      name: string;
      description: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      documents: any[];
    };
  };
}


export interface SignUpResponse {
  signUo: {
    id: string;
    name: string;
    email: string;
  };
}