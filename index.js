const express = require("express");
const app = express();
const port = process.env.PORT || 3333;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const usersController = require('./controllers/users')
const authController = require('./controllers/auth')
const postController = require('./controllers/post')
const cors = require('cors')

app.set('port', process.env.PORT || 3333)

dotenv.config();

// connection:
// const MONGODB_URI = 'http://localhost:3000'

const mongoURI =
  //check if the node environment is production
  process.env.NODE_ENV === "production"
    ? //if so, use DB_URL as the database location
      process.env.DB_URL
    : //if not, use the app db on the MongoDB's local server
      'http://localhost:3000';



mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, 
    useUnifiedTopology: true },
  () => {
    console.log("connected to mongo");
  }
);

// middlewears:
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use(cors(
  // origin:'http://localhost:3000',
  // credentials: true
)
)
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'https://twitclonefrontend.herokuapp.com/'];
  
  const origin = req.headers.origin;
  console.log(origin)
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '');
  }
  return next();
});

// app.use(cors(corsOptions));
app.use('/users', usersController)
app.use('/auth', authController);
app.use('/post', postController)


app.get('/', (req,res) => {
    res.send('home route hit!')
})

// listening port:
app.listen(app.get('port') , () => console.log(`App is running on port ${app.get('port')}`));
