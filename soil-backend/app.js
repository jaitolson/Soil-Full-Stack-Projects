const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { typeDefs, resolvers } = require("./graphql");
const specialProductsRouter = require('./routes/specialProducts');

const db = require('./models'); // Ensure correct path
db.sequelize.sync(); // Call sync on the sequelize instance

async function startApolloServer(typeDefs, resolvers) {
  const app = express();

  // Middleware setup
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // REST API Routes
  app.use('/api/users', require('./routes/users'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/reviews', require('./routes/reviews'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/cartItems', require('./routes/cartItems'));
  app.use('/api/categories', require('./routes/categories'));
  app.use('/api/specialProducts', require('./routes/specialProducts'));
  app.use('/api/userFollows', require('./routes/userFollows'));
  app.use('/api/specialProducts', specialProductsRouter);

  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}/graphql`);
}

startApolloServer(typeDefs, resolvers);
