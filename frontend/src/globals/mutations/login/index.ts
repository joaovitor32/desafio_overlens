import gql from 'graphql-tag';

const LOGIN_MUTATION = gql`
   mutation SignIn($signInInput: SignInInput!) {
    signIn(signInInput: $signInInput) {
      accessToken
      name
      email
    }
  }
`;


export {
  LOGIN_MUTATION
}



