const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PORT } = process.env;
require('./config/db');
dotenv.config();


const bodyParser = express.json;
const app = express();


app.use(cors());
app.use(bodyParser());

const userRoute = require('./routes/user');

app.use('/user', userRoute);

app.get("/", (req,res) => {
  res.send("This is the default route");
})


app.listen(5000, () => {
  console.log('Server is up and running');
})


