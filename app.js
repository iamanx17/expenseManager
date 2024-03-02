//nodejs packages
const path = require("path");

//third party
const express = require("express");
const mongoose = require("mongoose");
const nunjucks = require("nunjucks");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);

//local imports
const connectDB = require("./utils/mongoose");
  
const port = process.env.PORT || 3000;    
const mongoDB = "mongodb://localhost:27017/expense_tracker_app";

const app = express();

//configure view engine
app.set("view engine", "njk");
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

//to collect form data
app.use(express.urlencoded({ extended: false }));

//store session in mongodb
const store = new mongodbSession({
  uri: mongoDB,
  collection: "session",
});

//configure session
app.use(
  session({
    secret: "gxdp8-kygcw-m4fgh-pqp3d",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(require(path.join(__dirname, "routes/user")));
app.use(require(path.join(__dirname, "routes/tracker")));

app.listen(port, () => {
  connectDB(mongoDB);
  console.log(`server started successfully at port ${port}`);
});
  