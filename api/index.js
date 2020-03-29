import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import AuthRoutes from './server/src/routes/AuthRoutes';
import testRoutes from './server/src/routes/TestRoutes';

config.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use();
const port = process.env.PORT || 8080;
app.use(
  '/api',
  function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', '*');
    next();
  },
  AuthRoutes,
);
app.use('/api/v1/test', testRoutes);

// when a random route is inputed
app.get('*', (request, response) =>
  response.status(200).send({
    message: 'Welcome to this API.',
  }),
);

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

export default app;
