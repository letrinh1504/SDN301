const express = require("express"),
  http = require("http");
const hostname = "localhost";
const port = 3000;
const app = express();
const morgan = require("morgan");
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

const mongoose = require('mongoose');
const url = config.mongoUrl;
const connect = mongoose.connect(url);


const dishRouter = require("./routes/dishRouter");
const promotionRouter = require("./routes/promotionRouter");
const leaderRouter = require("./routes/leaderRouter");
const usersRouter = require("./routes/users");
const indexRouter = require("./routes/index");


connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());
//router


app.use('/', indexRouter);
app.use('/users', usersRouter);




app.use("/leaders", leaderRouter);
app.use("/promotions", promotionRouter);
app.use("/dishes", dishRouter);

const server = http.createServer(app);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
