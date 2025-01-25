import { GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:3000/graphql';

export const graphQLClient = new GraphQLClient(endpoint);


export const fetcher = (query: string, variables = {}, headers = {}) => {
  graphQLClient.setHeaders(headers);

  return graphQLClient.request(query, variables);
};