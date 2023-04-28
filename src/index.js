const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PORT } = process.env;
require('./config/db');
dotenv.config();

// App configurations
const bodyParser = express.json;
const app = express();
app.use(cors());
app.use(bodyParser());

// Import user routes
const userRoute = require('./routes/user');

// Basic route for testing deployment
app.get("/", (req,res) => {
  res.send("This is the default route");
})

// Real users authentication routes
app.use('/user', userRoute);

// Start to listen request on port
app.listen(5000, () => {
  console.log('Server is up and running');
})


