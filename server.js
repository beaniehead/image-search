// server.js
// where your node app starts
// init project
const fs = require('fs');
const express = require('express');
const routes = require('./routes/index.js');
const app = express();
const path = require('path');
require('dotenv').config();
// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too
if (!process.env.DISABLE_XORIGIN) {
  app.use((req, res, next) => {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if (!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
      console.log(origin);
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}
app.use('/public', express.static(process.cwd() + '/public'));
// for all requests use routes defined in router/index.js
app.use('/', routes);
// Respond not found to all the wrong routes
app.use((req, res, next) => {
  res.status(404);
  res.render("404", {
    title: "404 Not Found"
  });
});
// Error Middleware
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).type('txt').send(err.message || 'SERVER ERROR');
  }
})
app.listen(process.env.PORT, () => {
  console.log('Node.js listening ...');
});