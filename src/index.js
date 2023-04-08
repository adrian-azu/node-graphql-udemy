import path from "node:path";
import { readFileSync } from "node:fs";
import { createYoga, createSchema } from "graphql-yoga";
import { PubSub } from "graphql-subscriptions";
import { createServer } from "http";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";
const pubsub = new PubSub();
const schema = createSchema({
  typeDefs: readFileSync(path.join(__dirname, "./schema.graphql"), "utf8"),
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
});

const yoga = createYoga({
  graphqlEndpoint: "/",
  schema,
  context: {
    db,
    pubsub,
  },
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/");
});
