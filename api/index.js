import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

import cors from 'cors';
import fileUpload from 'express-fileupload';
import AuthRoutes from './server/src/routes/AuthRoutes';
// import testRoutes from './server/src/routes/TestRoutes';
import PhotoRoutes from './server/src/routes/PhotoRoutes';
import VerifyingRoutes from './server/src/routes/VerifyingRoutes';
import ConfirmationEmail from './server/src/routes/ConfirmationEmail';
import UserRoutes from './server/src/routes/UserRoutes';
import getToken from './server/src/middleware/getToken';
import Guard from './server/src/middleware/Guard';

config.config();

const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 8080;

app.use('/api/', AuthRoutes);
app.use('/api/verifying', getToken, VerifyingRoutes);
app.use('/api/user', getToken, Guard, UserRoutes);
app.use('/api/confirmation', getToken, Guard, ConfirmationEmail);
// app.use('/api/v1/test', testRoutes);
app.use('/api/photo', getToken, Guard, PhotoRoutes);

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
