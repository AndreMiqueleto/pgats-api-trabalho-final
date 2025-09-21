const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./models/typeDefs');
const resolvers = require('./controllers/resolvers');
const { authMiddleware } = require('./services/authMiddleware');

const app = express();
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware(req)
});

async function startApollo() {
  await server.start();
  server.applyMiddleware({ app });
}

startApollo();

module.exports = app;
