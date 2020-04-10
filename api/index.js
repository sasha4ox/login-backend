import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { check } from 'express-validator';
import cors from 'cors';
import AuthRoutes from './server/src/routes/AuthRoutes';
import testRoutes from './server/src/routes/TestRoutes';
import VerifyingRoutes from './server/src/routes/VerifyingRoutes';
import ConfirmationEmail from './server/src/routes/ConfirmationEmail';
import getToken from './server/src/middleware/getToken';

config.config();
function validationCreator() {
  return [check('email').isEmail(), check('password').isLength({ min: 5 })];
}
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const port = process.env.PORT || 8080;
app.use('/api/', validationCreator(), AuthRoutes);
app.use('/api/verifying', getToken, VerifyingRoutes);
app.use('/api/confirmation', getToken, ConfirmationEmail);
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
