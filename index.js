require('dotenv').config();

var { isNumber, isString } = require('lodash');
var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var bodyParser = require('body-parser');
var cors = require('cors');
var useragent = require('express-useragent');
var requestIp = require('request-ip');
var seeder = require('./seeder');
var routes = require('./routes');
var tasks = require('./tasks');
var mung = require('express-mung');
var { filterProperties } = require('./data/utils');

app.set('view engine', 'ejs');

app.use(useragent.express());
app.use(requestIp.mw());
app.use(cors());

app.options("/*", cors());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

const PORT = process.env.PORT;

seeder()
  .then((initData) => {
    console.log(initData);

    // start tasks
    tasks.start();
  })
  .catch((err) => {
    console.log(err);
    process.exit(-1);
  });

//middleware to access response body object
app.use(mung.json(
  function transform(body, req, res) {
    if (isNumber(body)) {
      return res.json(body);
    }
    if (isString(body)) {
      return res.json(body);
    }
    // do something with body
    if (req.user && req.user.isAdmin) {
      return filterProperties(body, (data) => false);
    }
    return filterProperties(body, (data) => {
      if (req.user && data.user && data.user._id) {
        return req.user.id !== String(data.user._id);
      } else if (req.user && data.user) {
        return req.user.id !== String(data.user);
      } else if (req.user && data._id) {
        return req.user.id !== String(data._id);
      }
      return true;
    }, ['password', 'isAdmin', 'documents', 'email', 'contact', 'firstName', 'lastName'], ['password']);
  }
));

app.get('/', function (req, res, next) {
  res.json({ message: 'hello world application' });
});

// **************** Route definitions start from here *********************

// login
app.all('/login', routes.auth.login);

// user end points
app.get('/users', routes.auth.verify, routes.user.get);

app.get('/users/:id', routes.auth.verify, routes.user.get);

app.post('/users', routes.auth.verify, routes.user.post);

app.put('/users/:id', routes.auth.verify, routes.user.put);



//activities endpoint
app.get('/activity', routes.auth.verify, routes.activity.get);

 app.get('/activity/:id', routes.auth.verify, routes.activity.get);

app.post('/activity', routes.auth.verify, routes.activity.post);

app.put('/activity/:id', routes.auth.verify, routes.activity.put);


// //bill endpoint
app.get('/bill',routes.auth.verify, routes.bill.get);

app.get('/bill/:id',routes.auth.verify, routes.bill.get);

app.post('/bill', routes.auth.verify, routes.bill.post);

app.put('/bill/:id', routes.auth.verify, routes.bill.put)


//location endpoint
 
app.get('/location',routes.auth.verify, routes.location.get);

app.get('/location/:id',routes.auth.verify, routes.location.get);

app.post('/location', routes.auth.verify, routes.location.post);

app.put('/location/:id', routes.auth.verify, routes.location.put)

//payment endpoint

app.get('/payment',routes.auth.verify, routes.payment.get);

app.get('/payment/:id',routes.auth.verify, routes.payment.get);

app.post('/payment',routes.auth.verify, routes.payment.post);

app.put('/payment/:id',routes.auth.verify, routes.payment.put)


//report endpoint

app.get('/report',routes.auth.verify, routes.report.get);

app.get('/report/:id',routes.auth.verify, routes.report.get);

app.post('/report', routes.auth.verify, routes.report.post);

app.put('/report/:id', routes.auth.verify, routes.report.put)


//residence
app.get('/residence',routes.auth.verify, routes.residence.get);

app.get('/residence/:id',routes.auth.verify, routes.residence.get);

app.post('/residence', routes.auth.verify, routes.residence.post);

app.put('/residence/:id', routes.auth.verify, routes.residence.put)

// start web server
console.log(`listening on ${PORT}`);
app.listen(PORT);

module.exports = app;