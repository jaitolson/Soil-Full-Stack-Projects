import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const GRAPHQL_ENDPOINT = "ws://localhost:4000/graphql";

const link = new GraphQLWsLink(
  createClient({
      url: GRAPHQL_ENDPOINT,
  })
);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache
});

export default client;

// Mutation functions
export async function blockUser(name) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation BlockUser($name: String!) {
          blockUser(name: $name)
        }
      `,
      variables: { name }
    });
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

export async function unblockUser(name) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation UnblockUser($name: String!) {
          unblockUser(name: $name)
        }
      `,
      variables: { name }
    });
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

export async function getUsers() {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          allUsers {
            userID
            name
            email
            userBlock
          }
        }
      `
    });
    return data.allUsers;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
}
