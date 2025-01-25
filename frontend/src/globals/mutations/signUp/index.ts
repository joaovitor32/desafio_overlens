import gql from 'graphql-tag';

const SIGNUP_MUTATION = gql`
   mutation SignUp($signUpInput: SignUpInput!) {
    signUp(signUpInput: $signUpInput) {
      id
      name
      email
    }
  }
`;


export {
  SIGNUP_MUTATION
}



