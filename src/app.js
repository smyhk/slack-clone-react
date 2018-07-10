import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';
import models from './models';

const SECRET = 'ksfbiu48e9fhfsbfeh8ses';
const SECRET2 = 'ksfbiu48e9fhfsbfeh8sesgrkgfefj4l5ntt5nglekgn';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './resolvers'))
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const PORT = 8080;

const app = express();

// allow cross-origin requests
app.use(cors());

// bodyParser is needed just for POST.
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress({
    schema,
    context: {
      models,
      user: { id: 1 },
      SECRET,
      SECRET2
    }
  })
);

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

models.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.info(`Server listening on port ${PORT}`);
  });
});
