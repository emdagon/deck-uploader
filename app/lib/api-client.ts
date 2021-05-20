// Remove the apollo-boost import and change to this:
import {
  ApolloClient,
  InMemoryCache,
  // NormalizedCacheObject,
} from "@apollo/client";
// Setup the network "links"
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";

import { isServer } from "./utils";

const API_SERVER = process.env.API_SERVER || "localhost:8080";

const httpLink = new HttpLink({
  uri: `http://${API_SERVER}/v1/graphql`, // use https for secure endpoint
});

const link = isServer()
  ? httpLink
  : (() => {
      // Create a WebSocket link:
      const wsLink = new WebSocketLink({
        uri: `ws://${API_SERVER}/v1/graphql`, // use wss for a secure endpoint
        options: {
          reconnect: true,
        },
      });

      // using the ability to split links, you can send data to each link
      // depending on what kind of operation is being sent
      return split(
        // split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      );
    })();

// Instantiate client
const client = new ApolloClient({
  link,
  ssrMode: true,
  cache: new InMemoryCache(),
});

export default client;
