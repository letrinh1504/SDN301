const express = require("express"),
  http = require("http");
const hostname = "localhost";
const port = 3000;
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
app.use(morgan("dev"));
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);
const cookieParser = require('cookie-parser')
connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

app.use(express.static(__dirname + "/public"));
const dishRouter = require("./routes/dishRouter");
const promotionRouter = require("./routes/promotionRouter");
const leaderRouter = require("./routes/leaderRouter");
app.use("/leaders", leaderRouter);
app.use("/promotions", promotionRouter);
app.use("/dishes", dishRouter);

app.use(cookieParser('12345-67890'));
function auth (req, res, next) {
  if (!req.signedCookies.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
        return;
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
        res.cookie('user','admin',{signed: true});
        next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
    }
  }
  else {
      if (req.signedCookies.user === 'admin') {
          next();
      }
      else {
          var err = new Error('You are not authenticated!');
          err.status = 401;
          next(err);
      }
  }
}

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
