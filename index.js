const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');
const { MONGODB } = require('./config');

//A PubSub instance enables your server code to both publish events and listen for events associated with a particular label.
const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected!');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server is running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  })