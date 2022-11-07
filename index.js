const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema,
  GraphQLID,
} = require("graphql");

const app = express();
const PORT = 5000;
var Owners = [
  { id: 1, name: "Ammar" },
  { id: 2, name: "Mo" },
  { id: 3, name: "Osama" },
];
var Websites = [
  { id: 1, name: "Facebook", ownerId: 1 },
  { id: 2, name: "Google", ownerId: 2 },
  { id: 3, name: "Amazon", ownerId: 3 },
  { id: 4, name: "Github", ownerId: 1 },
  { id: 5, name: "Medium", ownerId: 2 },
  { id: 6, name: "Twitter", ownerId: 3 },
  { id: 7, name: "Yahoo", ownerId: 1 },
  { id: 8, name: "Watsapp", ownerId: 2 },
];
const WebsiteType = new GraphQLObjectType({
  name: "Website",
  description: "this represent a website made by owner",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    ownerId: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
const OwnerType = new GraphQLObjectType({
  name: "Owner",
  description: "this represent a owner",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    websites: {
      type: new GraphQLList(WebsiteType),
      description: "list all websites",
      resolve: () => Websites,
    },
    owners: {
      type: new GraphQLList(OwnerType),
      description: "list all owners",
      resolve: () => Owners,
    },
    website: {
      type: WebsiteType,
      description: "A single website",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        Websites.find((website) => website.id === args.id),
    },
    owner: {
      type: OwnerType,
      description: "A single owner",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => Owners.find((owner) => owner.id === args.id),
    },
  }),
});
const RootMutationTypt = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addWebsite: {
      type: WebsiteType,
      description: "add a website",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        ownerId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const website = {
          id: Websites.length + 1,
          name: args.name,
          ownerId: args.ownerId,
        };
        Websites.push(website);
        return website;
      },
    },
    removeWebsite: {
      type: WebsiteType,
      description: "delete a website",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        Websites = Websites.filter((website) => website.id !== args.id);
        return Websites[args.id];
      },
    },
    addOwner: {
      type: OwnerType,
      description: "add a Owner",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const owner = {
          id: Owners.length + 1,
          name: args.name,
        };
        Owners.push(owner);
        return owner;
      },
    },
    removeOwner: {
      type: OwnerType,
      description: "delete a Owner",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        Owners = Owners.filter((owner) => owner.id !== args.id);
        return Owners[args.id];
      },
    },
    updateWebsite: {
      type: WebsiteType,
      description: "update a Website",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        ownerId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        Websites[args.id - 1].name = args.name;
        Websites[args.id - 1].ownerId = args.ownerId;
        return Websites[args.id - 1];
      },
    },
    updateOwner: {
      type: OwnerType,
      description: "update a Owner",
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        Owners[args.id - 1].name = args.name;
        return Owners[args.id - 1];
      },
    },
  }),
});
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationTypt,
});
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

app.listen(PORT, () => {
  console.log("app is running on port 5000");
});
