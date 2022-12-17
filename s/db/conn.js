const mongoose = require("mongoose");
require('dotenv').config();

const DB = process.env.MONGOURL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("connection is sucessful");
  })
  .catch((err) => {
    console.log("Connection is failed => ", err);
  });
