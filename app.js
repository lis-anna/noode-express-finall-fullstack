require('dotenv').config();
require('express-async-errors');

//security

const helmet = require('helmet');
const cors = require('cors');
var corsOptions = {
  //link to frontend port
  origin: process.env.CORS_FRONT_ORIGIN,
};

//path to frontend folder
const path = __dirname + '/views/';
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//connectDB
const connectDB = require('./db/connect');
//routers
const authenticatedUser = require('./middleware/authentication');
const authRouter = require('./routes/auth');
const booksRouter = require('./routes/books');

//body parser middlware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, //limit each IP to 100 requests per windowMs
  })
);
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'img-src': ["'self'", 'https: data:'],
    },
  })
);
app.use(xss());

// extra packages

//frontend
app.use(express.static(path));
// routes

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/books', authenticatedUser, booksRouter);
//pick up client-side routes from /views/index.html
app.get('/', (req, res) => {
  res.sendFile(path + 'index.html');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
