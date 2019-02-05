var mongoose = require('mongoose');

var host = process.env.DB_HOST;
var port = process.env.DB_PORT;
var user = process.env.DB_USER;
var pass = process.env.DB_PASSWORD;
var dbname = process.env.DB_NAME;
var uri = process.env.DB_URI;

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;
if (uri) {
  mongoose
    .connect(uri)
    .then(() => {
      console.log('connection established');
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  mongoose
    .connect(`mongodb://${host}:${port}/${dbname}`, {
      user,
      pass
    })
    .then(() => {
      console.log('connection established');
    })
    .catch((err) => {
      console.log(err);
    });
}

var User = mongoose.model('User', require('./user')(Schema));
var Mail = mongoose.model('Mail', require('./mail')(Schema));
var Bill= mongoose.model('Bill', require('./bill')(Schema));
var Location = mongoose.model('Location', require('./location')(Schema));
var Residence = mongoose.model('Residence', require('./residence')(Schema));
var Payment = mongoose.model('Payment', require('./payment')(Schema));
var Report = mongoose.model('Report', require('./report')(Schema));
var Activity = mongoose.model('Activity', require('./activity')(Schema));



module.exports = {  
  User,  
  Mail,
  Residence,
  Location,
  Bill,
  Payment,
  Report,
  Activity
};